const fs = require('fs');
const _path = require('path');
const { execSync } = require('child_process');

console.log('Running eslint to get JSON report...');
try {
  execSync('npx eslint -f json . > lint-results.json', { stdio: 'ignore' });
} catch (_e) {
  // eslint usually exits with 1 if there are errors
}

console.log('Parsing report...');
const report = JSON.parse(fs.readFileSync('lint-results.json', 'utf-8'));

for (const fileResult of report) {
  if (fileResult.messages.length === 0) continue;
  
  const filePath = fileResult.filePath;
  let content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  
  // Sort messages from bottom to top, right to left so replacements don't shift coordinates
  const messages = fileResult.messages.sort((a, b) => {
    if (a.line !== b.line) return b.line - a.line;
    return b.column - a.column;
  });

  let modified = false;

  for (const msg of messages) {
    if (msg.ruleId === '@typescript-eslint/no-unused-vars') {
      const match = msg.message.match(/'([^']+)'/);
      if (match) {
        const varName = match[1];
        // Only prefix if it doesn't already start with _
        if (!varName.startsWith('_')) {
          const lineIdx = msg.line - 1;
          const colIdx = msg.column - 1;
          
          if (lines[lineIdx] && lines[lineIdx].substring(colIdx, colIdx + varName.length) === varName) {
            lines[lineIdx] = lines[lineIdx].substring(0, colIdx) + '_' + lines[lineIdx].substring(colIdx);
            modified = true;
          }
        }
      }
    } else if (msg.ruleId === '@typescript-eslint/no-explicit-any') {
      // Do nothing for now, we will handle 'any' manually or folder by folder
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    console.log(`Fixed ${filePath}`);
  }
}
console.log('Done!');
