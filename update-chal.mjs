import fs from 'fs';

const filePath = 'src/app/challenges/ChallengesList.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add FileUploadField import
if (!content.includes('import { FileUploadField }')) {
  content = content.replace(
    /import { ImageUploadField } from "@\/components\/forms\/ImageUploadField";/,
    'import { ImageUploadField } from "@/components/forms/ImageUploadField";\nimport { FileUploadField } from "@/components/forms/FileUploadField";'
  );
}

// 2. Add brochure states
if (!content.includes('const [brochureUrl, setBrochureUrl]')) {
  content = content.replace(
    /const \[bannerFileName, setBannerFileName\] = useState\(""\);/,
    'const [bannerFileName, setBannerFileName] = useState("");\n  const [brochureUrl, setBrochureUrl] = useState("");\n  const [brochureFileName, setBrochureFileName] = useState("");'
  );
}

// 3. Add to createOpportunity payload
if (!content.includes('brochureUrl: brochureUrl')) {
  content = content.replace(
    /mode: mode \|\| undefined,/,
    'mode: mode || undefined,\n        brochureUrl: brochureUrl || undefined,'
  );
}

// 4. Reset brochure state
if (!content.includes('setBrochureUrl("");')) {
  content = content.replace(
    /setBannerFileName\(""\);/,
    'setBannerFileName("");\n        setBrochureUrl("");\n        setBrochureFileName("");'
  );
}

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
                        <label className="text-ink font-medium text-xs mb-1.5 block">Challenge Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="E.g. AI for Healthcare Hackathon"
                          className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Type <span className="text-red-500">*</span></label>
                          <select 
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-paper text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          >
                            <option value="HACKATHON">Hackathon</option>
                            <option value="IDEATHON">Ideathon</option>
                            <option value="COMPETITION">Competition</option>
                            <option value="BOUNTY">Bounty</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Host Organization <span className="text-red-500">*</span></label>
                          {organizations.length === 0 ? (
                            <div className="text-[11px] text-amber-500 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                              No organizations found.
                            </div>
                          ) : (
                            <select 
                              value={organizationId}
                              onChange={(e) => setOrganizationId(e.target.value)}
                              className="w-full h-11 px-4 rounded-xl border border-g3 bg-paper text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                            >
                              {organizations.map((org) => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ImageUploadField
                          label="Challenge cover"
                          value={bannerUrl}
                          fileName={bannerFileName}
                          onChange={setBannerUrl}
                          onFileNameChange={setBannerFileName}
                          onError={setError}
                        />
                        <FileUploadField
                          label="Challenge Brochure (PDF)"
                          value={brochureUrl}
                          fileName={brochureFileName}
                          onChange={setBrochureUrl}
                          onFileNameChange={setBrochureFileName}
                          onError={setError}
                        />
                      </div>
                    </div>
                  )}

                  {currentTab === 1 && (
                    <div className="space-y-5 max-w-2xl mx-auto w-full">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Awards & Prize Pool</label>
                          <input 
                            type="text"
                            value={compensation}
                            onChange={(e) => setCompensation(e.target.value)}
                            placeholder="E.g. $10,000 in grants"
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Submission Deadline</label>
                          <input 
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Location</label>
                          <input 
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="E.g. Online, IIT Delhi"
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Challenge Description & Rules</label>
                        <textarea 
                          rows={6}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Provide a detailed brief, track details, rules, judging criteria, and schedules..."
                          className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {currentTab === 2 && (
                    <div className="space-y-4 max-w-2xl mx-auto w-full">
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Discord</label>
                        <input type="text" value={discord} onChange={(e) => setDiscord(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://discord.gg/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Instagram</label>
                        <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://instagram.com/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">WhatsApp Group</label>
                        <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://chat.whatsapp.com/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Twitter</label>
                        <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://twitter.com/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">LinkedIn</label>
                        <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://linkedin.com/in/..." />
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
