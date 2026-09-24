import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function installCopilot(target, dryRun=false) {
  const dest=path.resolve(target);
  if(!fs.existsSync(dest) || !fs.statSync(dest).isDirectory()) throw new Error('Target must be an existing project directory');
  const selected=['.github/agents','.github/instructions','.github/prompts','.github/hooks',...fs.readdirSync(path.join(source,'core/skills')).map(n=>`.github/skills/${n}`)];
  const files=[];
  function walk(p){for(const e of fs.readdirSync(path.join(source,p),{withFileTypes:true})){const rel=`${p}/${e.name}`;if(e.isDirectory())walk(rel);else files.push(rel);}}
  selected.forEach(walk);
  // Check all collisions and symlinked destination ancestors before the first write.
  for(const rel of files) {
    const to=path.join(dest,rel);
    let part=to;
    while(part!==path.dirname(dest) && part!==path.dirname(part)) {
      let stat;
      try {stat=fs.lstatSync(part);} catch(e) {if(e.code!=='ENOENT' && e.code!=='ENOTDIR') throw e;}
      if(stat?.isSymbolicLink()) throw new Error(`Symlink destination refused: ${part}`);
      if(stat && part!==to && !stat.isDirectory()) throw new Error(`Destination ancestor is not a directory: ${part}`);
      part=path.dirname(part);
    }
    if(fs.existsSync(to) && (!fs.statSync(to).isFile() || !fs.readFileSync(to).equals(fs.readFileSync(path.join(source,rel))))) throw new Error(`Existing file differs: ${rel}. Review migration manually; nothing overwritten.`);
  }
  if(!dryRun) for(const rel of files){const to=path.join(dest,rel);fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(path.join(source,rel),to);}
  return {target:dest,files:files.length,dryRun,mcp:'Unchanged: install the official powerbi-authoring plugin separately.'};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const args=process.argv.slice(2),target=args.find(a=>!a.startsWith('--'));
  if(!target || args.some(a=>a.startsWith('--')&&a!=='--dry-run')) {console.error('Usage: node scripts/install-copilot.mjs <existing-project> [--dry-run]');process.exitCode=2;}
  else try {console.log(JSON.stringify(installCopilot(target,args.includes('--dry-run')),null,2));}catch(e){console.error(e.message);process.exitCode=1;}
}
