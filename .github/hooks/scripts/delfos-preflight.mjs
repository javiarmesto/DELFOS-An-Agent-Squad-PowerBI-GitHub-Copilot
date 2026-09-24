// Advisory context only. Does not grant permission or certify MCP/Desktop state.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
export function preflight(event) {
  if (!event || typeof event !== 'object') return null;
  const name = event.tool_name ?? event.toolName ?? '';
  let input = event.tool_input ?? event.toolInput ?? {};
  if (typeof input === 'string') { try {input=JSON.parse(input);} catch {return null;} }
  if (!input || typeof input !== 'object') return null;
  const editTool = /(?:write|edit|replace|create_file|apply_patch|bash|terminal|shell)/i.test(name);
  const modelTool = /(?:powerbi|power-bi).*(?:operations|model|query)/i.test(name);
  const text = JSON.stringify(input);
  const powerbiPath = /\.tmdl\b|\.pbip\b|\.pbir\b|\.Report[\\/]|\.SemanticModel[\\/]/i.test(text);
  if (!modelTool && !(editTool && powerbiPath)) return null;
  return {hookSpecificOutput:{hookEventName:'PreToolUse',additionalContext:
    'DELFOS: verify the intended model/connection or PBIP path before this operation. Use one authoring MCP. Do not overwrite unsaved Desktop changes or reload stale TMDL over live MCP edits. Offline PBIP work is valid without Desktop. Use semantic-model-authoring for models and powerbi-report-cli for reports; validate files and separately verify DAX/rendering. This reminder has not checked live state and does not authorize the operation.'}};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {const result=preflight(JSON.parse(fs.readFileSync(0,'utf8')));if(result) console.log(JSON.stringify(result));}
  catch { /* Unknown payload: no override; host permissions remain in force. */ }
}
