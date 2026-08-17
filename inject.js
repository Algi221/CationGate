const fs=require('fs');
const p='src/app/[school_slug]/dashboard/kelola-ui/page.tsx';
let c=fs.readFileSync(p,'utf8');
const inject = `
                  <div className="space-y-2 md:col-span-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Deskripsi Singkat Footer</label>
                    <textarea
                      value={footerDesc}
                      onChange={(e) => setFooterDesc(e.target.value)}
                      rows={2}
                      placeholder="Pionir pendidikan kejuruan teknologi informasi..."
                      className="w-full px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-y"
                    />
                  </div>
`;
c=c.replace(/(placeholder="Alamat lengkap sekolah\.\.\."[\s\S]*?<\/div>)/, '$1' + inject);
fs.writeFileSync(p,c);
