import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {preflight} from '../scripts/preflight.mjs';
import {validateProject} from '../scripts/validate-project.mjs';
import {installCopilot} from '../scripts/install-copilot.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function temp(t){const d=fs.mkdtempSync(path.join(os.tmpdir(),'delfos test '));t.after(()=>fs.rmSync(d,{recursive:true,force:true}));return d;}
function put(root,p,body){const f=path.join(root,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,body);}
function fixture(d){
 put(d,'Sales.pbip',JSON.stringify({version:'1.0',artifacts:[{report:{path:'Sales.Report'}}]}));
 put(d,'Sales.Report/definition.pbir',JSON.stringify({version:'4.0',datasetReference:{byPath:{path:'../Sales.SemanticModel'}}}));
 put(d,'Sales.Report/definition/pages/pages.json',JSON.stringify({pageOrder:['overview'],activePageName:'overview'}));
 put(d,'Sales.Report/definition/pages/overview/page.json',JSON.stringify({name:'overview',displayName:'Overview'}));
 put(d,'Sales.SemanticModel/definition/model.tmdl','model Model\n\tculture: en-US\n');
}
test('valid offline definitions pass only file checks, not runtime',t=>{const d=temp(t);fixture(d);const r=validateProject(d);assert.equal(r.errors.length,0);assert.equal(r.checked.length,5);assert.equal(r.runtime,'NOT RUN');});
test('missing report artifact, model binding and page reference are diagnosed',t=>{const d=temp(t);fixture(d);fs.rmSync(path.join(d,'Sales.SemanticModel'),{recursive:true});fs.rmSync(path.join(d,'Sales.Report/definition/pages/overview'),{recursive:true});put(d,'Other.pbip',JSON.stringify({artifacts:[{report:{path:'Missing.Report'}}]}));const r=validateProject(d);assert.equal(r.errors.length,3);});
test('BOM, invalid UTF-8, empty TMDL and invalid JSON fail',t=>{const d=temp(t);put(d,'bom.tmdl',Buffer.from([239,187,191,97]));put(d,'bad.tmdl',Buffer.from([255]));put(d,'empty.tmdl','');put(d,'bad.pbir','{');assert.equal(validateProject(d).errors.length,4);});
test('typed M and embedded whitespace are not incorrectly rejected',t=>{const d=temp(t);put(d,'table.tmdl','table Sales\n\tpartition Sales = m\n\t\tsource =\n            #table(type table [Amount = number], {{1}})\n');assert.equal(validateProject(d).errors.length,0);});
test('no definitions and nonexistent paths never report success',t=>{const d=temp(t);assert.ok(validateProject(d).errors.length);assert.ok(validateProject(path.join(d,'missing')).errors.length);});
test('duplicate or inactive page IDs fail',t=>{const d=temp(t);fixture(d);put(d,'Sales.Report/definition/pages/pages.json',JSON.stringify({pageOrder:['overview','overview'],activePageName:'missing'}));assert.equal(validateProject(d).errors.length,2);});
test('Claude and VS Code payloads produce context without permission decisions',()=>{for(const e of [{tool_name:'Write',tool_input:{file_path:'C:\\Reports\\Sales.Report\\definition\\report.json'}},{tool_name:'replace_string_in_file',tool_input:{filePath:'/project/model.tmdl'}},{toolName:'create_file',toolInput:JSON.stringify({filePath:'/project/model.tmdl'})}]){const r=preflight(e);assert.equal(r.hookSpecificOutput.hookEventName,'PreToolUse');assert.equal(r.hookSpecificOutput.permissionDecision,undefined);assert.match(r.hookSpecificOutput.additionalContext,/has not checked live state/);}});
test('scoped MCP and shell report calls receive the reminder',()=>{assert.ok(preflight({tool_name:'mcp__plugin_powerbi-authoring_powerbi-modeling-mcp__measure_operations',tool_input:{operation:'Update'}}));assert.ok(preflight({tool_name:'Bash',tool_input:{command:'powerbi-report-author validate Sales.Report/definition'}}));});
test('unrelated reads and malformed payloads do not override host policy',()=>{for(const e of [null,{}, {tool_name:'Read',tool_input:{file_path:'Sales.tmdl'}},{tool_name:'Write',tool_input:{file_path:'notes.md'}},{tool_name:'Write',tool_input:'not json'}])assert.equal(preflight(e),null);});
test('hook runs from a working directory with spaces and malformed stdin stays silent',t=>{const d=temp(t);const script=path.join(root,'scripts/preflight.mjs');const ok=spawnSync(process.execPath,[script],{cwd:d,input:JSON.stringify({tool_name:'Edit',tool_input:{file_path:'model.tmdl'}}),encoding:'utf8'});assert.equal(ok.status,0);assert.ok(JSON.parse(ok.stdout).hookSpecificOutput);const bad=spawnSync(process.execPath,[script],{cwd:d,input:'{',encoding:'utf8'});assert.equal(bad.status,0);assert.equal(bad.stdout,'');});
test('Copilot installer dry-run, installation, idempotence and MCP preservation',t=>{const d=temp(t);put(d,'.vscode/mcp.json','{"servers":{"existing":{}}}');const before=fs.readFileSync(path.join(d,'.vscode/mcp.json'),'utf8');installCopilot(d,true);assert.ok(!fs.existsSync(path.join(d,'.github')));installCopilot(d);installCopilot(d);assert.ok(fs.existsSync(path.join(d,'.github/skills/bc-data-source-mapping/references/bc-api-v2-catalog.md')));assert.equal(fs.readFileSync(path.join(d,'.vscode/mcp.json'),'utf8'),before);});
test('installer refuses collisions before any write',t=>{const d=temp(t);put(d,'.github/instructions/delfos-pbir-authoring.instructions.md','user changes');assert.throws(()=>installCopilot(d),/Existing file differs/);assert.ok(!fs.existsSync(path.join(d,'.github/agents')));assert.equal(fs.readFileSync(path.join(d,'.github/instructions/delfos-pbir-authoring.instructions.md'),'utf8'),'user changes');});
test('packaged Claude hook and validator run outside the repository',t=>{const d=temp(t);const plugin=path.join(root,'plugins/delfos');const hook=JSON.parse(fs.readFileSync(path.join(plugin,'hooks/hooks.json'))).hooks.PreToolUse[0].hooks[0];assert.match(hook.command,/CLAUDE_PLUGIN_ROOT/);const r=spawnSync(process.execPath,[path.join(plugin,'scripts/preflight.mjs')],{cwd:d,input:JSON.stringify({tool_name:'Write',tool_input:{file_path:'x.tmdl'}}),encoding:'utf8'});assert.equal(r.status,0);assert.ok(JSON.parse(r.stdout).hookSpecificOutput);fixture(d);const v=spawnSync(process.execPath,[path.join(plugin,'scripts/validate-project.mjs'),d],{cwd:d,encoding:'utf8'});assert.equal(v.status,0);assert.equal(JSON.parse(v.stdout).runtime,'NOT RUN');});
test('synthetic smoke data reconciles to documented totals and RLS slices',()=>{const rows=fs.readFileSync(path.join(root,'examples/sales/FactSales.csv'),'utf8').trim().split('\n').slice(1).map(l=>l.split(','));let sales=0,cost=0,qty=0;const byCustomer={};for(const r of rows){const q=+r[4],amount=q*+r[5];qty+=q;sales+=amount;cost+=q*+r[6];byCustomer[r[2]]=(byCustomer[r[2]]||0)+amount;}assert.deepEqual([sales,cost,sales-cost,(sales-cost)/sales,new Set(rows.map(r=>r[0])).size,qty],[600,360,240,.4,4,7]);assert.deepEqual(byCustomer,{C1:350,C2:250});});

test('installer rejects a file occupying a destination directory before writing',t=>{const d=temp(t);put(d,'.github/instructions','user file');assert.throws(()=>installCopilot(d),/not a directory/);assert.ok(!fs.existsSync(path.join(d,'.github/agents')));});
