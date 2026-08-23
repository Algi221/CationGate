import re

file_path = r'c:\Users\Husein\OneDrive\Documents\Lomba\CationGate-Baru\src\app\[school_slug]\daftar\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add formGuideline state
if 'const [formGuideline' not in content:
    content = content.replace(
        'const [fieldsConfig, setFieldsConfig] = useState<Record<string, { label: string; required: boolean; active: boolean }>>({});',
        'const [fieldsConfig, setFieldsConfig] = useState<Record<string, { label: string; required: boolean; active: boolean }>>({});\n  const [formGuideline, setFormGuideline] = useState("");'
    )

# 2. Add formGuideline to loadLiveConfig
if 'ppdb_form_guideline' not in content:
    content = content.replace(
        'if (config.ppdb_fields_config) {',
        "if (config.ppdb_form_guideline) {\n              setFormGuideline(config.ppdb_form_guideline);\n              localStorage.setItem('ppdb_form_guideline', config.ppdb_form_guideline);\n            }\n            if (config.ppdb_fields_config) {"
    )
    # And localStorage load
    content = content.replace(
        "const savedFieldsConfig = localStorage.getItem('ppdb_fields_config');",
        "const savedGuideline = localStorage.getItem('ppdb_form_guideline');\n    if (savedGuideline) setFormGuideline(savedGuideline);\n\n    const savedFieldsConfig = localStorage.getItem('ppdb_fields_config');"
    )

# 3. Render formGuideline above the wizard
if 'formGuideline &&' not in content:
    content = content.replace(
        '{/* FORM WIZARD CARD */}',
        '{/* FORM WIZARD CARD */}\n        {formGuideline && (\n          <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl p-4 md:p-6 mb-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">\n            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-widest text-[10px]">Panduan Registrasi</h4>\n            <div className="whitespace-pre-line">{formGuideline}</div>\n          </div>\n        )}'
    )

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated formGuideline!')
