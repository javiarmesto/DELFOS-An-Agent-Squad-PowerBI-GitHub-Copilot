import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];
function assert(ok,message){if(!ok)errors.push(message);}
function files(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(`${dir}/${e.name}`):[`${dir}/${e.name}`]);}
const pkg=JSON.parse(read('package.json'));
const plugin=JSON.parse(read('plugins/delfos/.claude-plugin/plugin.json'));
const market=JSON.parse(read('.claude-plugin/marketplace.json'));
assert(plugin.name==='delfos' && plugin.version===pkg.version,'Plugin/package version mismatch');
assert(market.plugins[0].source==='./plugins/delfos' && market.plugins[0].version===pkg.version,'Marketplace source/version mismatch');
assert(!plugin.mcpServers && !fs.existsSync(path.join(root,'plugins/delfos/.mcp.json')),'DELFOS must not duplicate upstream MCP');
assert(Object.keys(JSON.parse(read('.vscode/mcp.json')).servers).length===0,'Default workspace must not register a second MCP');
const roles=JSON.parse(read('core/agents.json'));
assert(new Set(roles.map(r=>r.id)).size===6,'Expected six unique roles');
for(const r of roles) {
 const c=read(`plugins/delfos/agents/${r.id}.md`).split('---')[1];
 assert(c.includes(`name: ${r.id}`),'Missing Claude role name');
 assert(!/^(?:agents|handoffs|permissionMode|mcpServers|hooks):/m.test(c),`Unsupported Claude metadata: ${r.id}`);
 assert(!/vscode\/|\(copilot\)|powerbi-remote/.test(c),`Leaked Copilot metadata: ${r.id}`);
}
for(const file of [...files('core/skills'),...files('plugins/delfos/skills')].filter(p=>p.endsWith('/SKILL.md'))) {
 const content=read(file),header=content.match(/^---\n([\s\S]*?)\n---/);
 assert(!!header,`Missing skill frontmatter: ${file}`);
 if(header) {assert(/^name: [a-z0-9-]+$/m.test(header[1]),`Invalid skill name: ${file}`);assert(/^description: .+/m.test(header[1]),`Missing skill description: ${file}`);}
}
// Check Markdown links in maintained docs and canonical/bundled domain skills.
for(const file of ['README.md','QUICKSTART.md','CONTRIBUTING.md',...files('docs'),...files('core/skills'),...files('plugins/delfos/skills')].filter(p=>p.endsWith('.md'))) {
 const text=read(file).replace(/```[\s\S]*?```/g,'');
 for(const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
  const link=match[1].split('#')[0];
  if(!link || /^[a-z]+:/i.test(link)) continue;
  assert(fs.existsSync(path.resolve(root,path.dirname(file),link)),`Broken link in ${file}: ${link}`);
 }
}
for(const file of files('plugins/delfos').filter(p=>p.endsWith('.json'))) {try{JSON.parse(read(file));}catch{errors.push(`Invalid JSON: ${file}`);}}
for(const host of ['vscode','claude']) for(const mode of ['local','hosted']) {
 const config=JSON.parse(read(`config/mcp/${host}-${mode}.example.json`));
 assert(Object.keys(config[host==='vscode'?'servers':'mcpServers']).length===1,'Manual example must register exactly one server');
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('Package, metadata, profiles and relative links OK. Runtime checks NOT RUN.');
