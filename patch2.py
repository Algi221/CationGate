import re
import sys

file_path = r'c:\Users\Husein\OneDrive\Documents\Lomba\CationGate-Baru\src\app\[school_slug]\daftar\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = ''
lines = content.split('\n')
i = 0
count = 0
while i < len(lines):
    line = lines[i]
    if '<div className="form-group"' in line or '<div className="form-group mb-4"' in line:
        block_lines = [line]
        div_count = line.count('<div') - line.count('</div')
        i += 1
        while i < len(lines) and div_count > 0:
            block_lines.append(lines[i])
            div_count += lines[i].count('<div')
            div_count -= lines[i].count('</div')
            i += 1
        
        block_text = '\n'.join(block_lines)
        
        # Process block
        names = re.findall(r'name="([a-zA-Z0-9_]+)"', block_text)
        if names:
            primary = names[0]
            # Replace label
            def lbl_repl(m):
                cls = m.group(1)
                text = m.group(2)
                return f'<label {cls}>{{_getFieldLabel("{primary}", "{text}")}} {{_isFieldRequired("{primary}") && <span className="text-red-500 ml-1">*</span>}}</label>'
            
            block_text = re.sub(r'<label (className="[^"]+")>(.*?)</label>', lbl_repl, block_text, count=1)
            
            # Wrap
            block_text = f'{{_isFieldActive("{primary}") && (\n{block_text}\n)}}'
            count += 1
        
        new_content += block_text + '\n'
    else:
        new_content += line + '\n'
        i += 1

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)
print(f'Form groups wrapped successfully! Replaced {count} form groups.')
