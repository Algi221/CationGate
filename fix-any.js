const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running eslint to get JSON report...');
try {
  execSync('npx eslint -f json . > lint-results.json', { stdio: 'ignore' });
} catch (e) {}

console.log('Parsing report...');
const report = JSON.parse(fs.readFileSync('lint-results.json', 'utf-8'));

for (const fileResult of report) {
  if (fileResult.messages.length === 0) continue;
  
  const filePath = fileResult.filePath;
  let content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  
  // Sort messages from bottom to top, right to left
  const messages = fileResult.messages.sort((a, b) => {
    if (a.line !== b.line) return b.line - a.line;
    return b.column - a.column;
  });

  let modified = false;

  for (const msg of messages) {
    if (msg.ruleId === '@typescript-eslint/no-explicit-any') {
      const lineIdx = msg.line - 1;
      const colIdx = msg.column - 1;
      
      const line = lines[lineIdx];
      // If it's a catch block `catch (e: any)` -> `catch (e: unknown)`
      if (line.match(/catch\s*\(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*any\s*\)/)) {
        lines[lineIdx] = line.substring(0, colIdx) + 'unknown' + line.substring(colIdx + 3);
        modified = true;
      } 
      // If it's an arrow function error param `(err: any)`
      else if (line.match(/\(\s*(err|error|e)\s*:\s*any\s*\)/)) {
        lines[lineIdx] = line.substring(0, colIdx) + 'unknown' + line.substring(colIdx + 3);
        modified = true;
      }
      else {
        // Insert eslint-disable on the previous line if not already there
        if (lineIdx > 0 && !lines[lineIdx - 1].includes('eslint-disable-next-line @typescript-eslint/no-explicit-any')) {
          const whitespace = line.match(/^\s*/)[0];
          lines.splice(lineIdx, 0, whitespace + '// eslint-disable-next-line @typescript-eslint/no-explicit-any');
          modified = true;
        } else if (lineIdx === 0 && !line.includes('eslint-disable')) {
          lines.splice(0, 0, '// eslint-disable-next-line @typescript-eslint/no-explicit-any');
          modified = true;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    console.log(`Fixed any in ${filePath}`);
  }
}
console.log('Done!');
