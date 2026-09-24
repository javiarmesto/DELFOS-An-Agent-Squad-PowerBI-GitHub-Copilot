import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const ignored = new Set(['.git','.pbi','node_modules','.delfos']);
export function validateProject(target) {
  const root=path.resolve(target), errors=[], checked=[];
  const fail=(file,message)=>errors.push({file:path.relative(root,file)||path.basename(file),message});
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) return {scope:'file checks only',checked:[],errors:[{file:root,message:'Project directory does not exist'}],runtime:'NOT RUN'};
  function walk(dir) {
    for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
      const file=path.join(dir,e.name);
      if(e.isSymbolicLink()) continue;
      if(e.isDirectory()) {if(!ignored.has(e.name)) walk(file);continue;}
      const rel=path.relative(root,file).replaceAll('\\','/');
      const inDefinition=/(?:^|\/)[^/]+\.(?:Report|SemanticModel)\//i.test(rel) || /\.(?:Report|SemanticModel)$/i.test(root);
      const isTmdl=/\.tmdl$/i.test(file);
      if(!isTmdl && !/\.(?:pbip|pbir)$/i.test(file) && !(inDefinition && /\.json$/i.test(file))) continue;
      checked.push(rel);
      const bytes=fs.readFileSync(file);
      if(bytes.length>=3 && bytes[0]===239 && bytes[1]===187 && bytes[2]===191) fail(file,'UTF-8 BOM found');
      let text;
      try {text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);} catch {fail(file,'Invalid UTF-8');continue;}
      if(!text.trim()) {fail(file,'Empty definition');continue;}
      if(isTmdl) continue; // Never claim this checks TMDL grammar or DAX/M semantics.
      let data;
      try {data=JSON.parse(text);} catch {fail(file,'Invalid JSON');continue;}
      if (!data || typeof data!=='object' || Array.isArray(data)) {fail(file,'Definition must be a JSON object');continue;}
      const exists=(relative,label)=>{
        if(typeof relative!=='string' || !relative.trim()) {fail(file,`${label} must be a nonempty path`);return;}
        if(!fs.existsSync(path.resolve(path.dirname(file),relative))) fail(file,`${label} does not exist: ${relative}`);
      };
      if(/\.pbip$/i.test(file)) {
        if(!Array.isArray(data.artifacts) || data.artifacts.length===0) fail(file,'PBIP artifacts must be a nonempty array');
        else for(const a of data.artifacts) if(a?.report) exists(a.report.path,'Report artifact');
      }
      if(/\.pbir$/i.test(file) && data.datasetReference?.byPath) exists(data.datasetReference.byPath.path,'Semantic model reference');
      if(e.name==='pages.json' && path.basename(path.dirname(file))==='pages') {
        if(!Array.isArray(data.pageOrder)) fail(file,'pageOrder must be an array');
        else {
          if(new Set(data.pageOrder).size!==data.pageOrder.length) fail(file,'Duplicate page IDs in pageOrder');
          for(const id of data.pageOrder) {
            if(typeof id!=='string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {fail(file,'Invalid page ID');continue;}
            exists(`${id}/page.json`,'Page definition');
          }
          if(data.activePageName && !data.pageOrder.includes(data.activePageName)) fail(file,'Active page is absent from pageOrder');
        }
      }
    }
  }
  walk(root);
  if(!checked.length) fail(root,'No Power BI definition files found');
  return {scope:'UTF-8, nonempty TMDL, JSON and basic file-reference checks only',checked,errors,runtime:'NOT RUN'};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  if(!process.argv[2]) {console.error('Usage: node validate-project.mjs <project-directory>');process.exitCode=2;}
  else {try {const result=validateProject(process.argv[2]);console.log(JSON.stringify(result,null,2));process.exitCode=result.errors.length?1:0;}catch(e){console.error(e.message);process.exitCode=1;}}
}
