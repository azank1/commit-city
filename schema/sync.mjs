// Copy schema/agents.json (the agent-lens rules) to where each builder can reach it at run time: the hosted
// engine deploys web/ alone and the Python package ships commit_city/ alone. Both test suites fail while a
// copy differs from the JSON, so edit the JSON, then run: node schema/sync.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = JSON.stringify(JSON.parse(fs.readFileSync(path.join(root, 'schema', 'agents.json'), 'utf8')), null, 2);
if (json.includes("'''")) throw new Error("agents.json cannot contain ''' (it is embedded in a Python raw string)");
const head = 'Generated from schema/agents.json by schema/sync.mjs. Do not edit.';
const out = {
  'web/lib/engine/agents-rules.ts': `// ${head}\nimport type { Rules } from './agents.js';\n\nexport const RULES: Rules = ${json};\n`,
  'commit_city/agents_rules.py': `# ${head}\nimport json\n\nRULES = json.loads(r'''${json}''')\n`,
};
for (const [file, text] of Object.entries(out)) {
  fs.writeFileSync(path.join(root, file), text);
  console.log(`wrote ${file}`);
}
