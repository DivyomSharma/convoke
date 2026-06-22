import fs from 'fs';

const filePath = 'src/app/organizations/OrganizationsList.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Ensure Tabs state is added
if (!content.includes('const TABS =')) {
  content = content.replace(
    /const \[currentTab, setCurrentTab\] = useState\(0\);/g,
    'const [currentTab, setCurrentTab] = useState(0);\n  const TABS = ["Basic Info", "Details", "Links"];'
  );
}

const formStartMatch = content.match(/<form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">/);
const formEndMatch = content.match(/<\/form>/);

if (formStartMatch && formEndMatch) {
  const newForm = `<form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex border-b border-g3/60 px-6 shrink-0">
                  {TABS.map((tab, idx) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCurrentTab(idx)}
                      className={\`px-4 py-3 text-sm font-medium border-b-2 transition-colors \${currentTab === idx ? "border-brand text-ink" : "border-transparent text-g5 hover:text-ink hover:border-g3"}\`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {currentTab === 0 && (
                    <div className="space-y-5">
                      {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                          {error}
                        </div>
                      )}

                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Organization Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          required
                          value={name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="E.g. Delhi Hacker Club"
                          className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Organization Slug (URL path) <span className="text-red-500">*</span></label>
                        <div className="relative flex items-center h-11 rounded-xl border border-g3 bg-transparent focus-within:border-[var(--brand)]/55 focus-within:ring-1 focus-within:ring-[var(--brand)]/20 transition-all overflow-hidden">
                          <span className="pl-4 pr-0.5 text-g4 text-sm font-mono select-none">theconvoke.xyz/org/</span>
                          <input 
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                            placeholder="delhi-hacker-club"
                            className="flex-1 h-full pr-4 bg-transparent text-sm text-ink outline-none font-mono min-w-0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ImageUploadField
                          label="Organization logo"
                          value={logoUrl}
                          fileName={logoFileName}
                          onChange={setLogoUrl}
                          onFileNameChange={setLogoFileName}
                          onError={setError}
                          compact
                        />
                        <ImageUploadField
                          label="Organization banner"
                          value={bannerUrl}
                          fileName={bannerFileName}
                          onChange={setBannerUrl}
                          onFileNameChange={setBannerFileName}
                          onError={setError}
                          compact
                        />
                      </div>
                    </div>
                  )}

                  {currentTab === 1 && (
                    <div className="space-y-5 max-w-2xl mx-auto w-full">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Industry / Tag</label>
                          <input 
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            placeholder="E.g. Hacking, Startup"
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Location</label>
                          <input 
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="E.g. New Delhi, Remote"
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Website URL</label>
                        <input 
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://myclub.com"
                          className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Brief Description</label>
                        <textarea 
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe your organization's focus and core activities..."
                          className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Mission Statement</label>
                          <textarea 
                            rows={3}
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                            placeholder="What is your immediate mission?"
                            className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                          />
                        </div>
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Vision Statement</label>
                          <textarea 
                            rows={3}
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                            placeholder="Where do you see the future?"
                            className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentTab === 2 && (
                    <div className="space-y-4 max-w-2xl mx-auto w-full">
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Discord</label>
                        <input type="text" value={discord} onChange={(e) => setDiscord(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none" placeholder="https://discord.gg/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Instagram</label>
                        <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none" placeholder="https://instagram.com/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">WhatsApp Group</label>
                        <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none" placeholder="https://chat.whatsapp.com/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Twitter</label>
                        <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none" placeholder="https://twitter.com/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">LinkedIn</label>
                        <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none" placeholder="https://linkedin.com/in/..." />
                      </div>
                    </div>
                  )}
                </div>
              </form>`;

  const startIndex = formStartMatch.index;
  const endIndex = content.indexOf('</form>', startIndex) + '</form>'.length;
  content = content.substring(0, startIndex) + newForm + content.substring(endIndex);
  fs.writeFileSync(filePath, content);
  console.log("Updated", filePath);
} else {
  console.log("Could not find form bounds");
}
