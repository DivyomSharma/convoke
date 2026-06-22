import fs from 'fs';

function addAutocomplete(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Add import if not exists
  if (!content.includes('LocationAutocomplete')) {
    content = content.replace(
      /import \{ ImageUploadField \}.*/,
      `$&
import { LocationAutocomplete } from "@/components/forms/LocationAutocomplete";`
    );
  }

  // Replace text input with LocationAutocomplete
  // Using simple string replacement
  
  const oldInput1 = `<input 
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="E.g. Remote, Bangalore"
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          />`;

  const newAuto1 = `<LocationAutocomplete 
                            value={location}
                            onChange={(val) => setLocation(val)}
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          />`;
                          
  const oldInput2 = `<input 
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="E.g. Room 101, Hub, Online"
                            className={\`w-full h-11 px-4 rounded-xl border \${getError("meet-location") ? "border-red-500/50" : "border-g3"} bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all\`}
                          />`;

  const newAuto2 = `<LocationAutocomplete 
                            value={location}
                            onChange={(val) => setLocation(val)}
                            className={\`w-full h-11 px-4 rounded-xl border \${getError("meet-location") ? "border-red-500/50" : "border-g3"} bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all\`}
                          />`;

  content = content.replace(oldInput1, newAuto1);
  content = content.replace(oldInput2, newAuto2);
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

addAutocomplete('src/app/opportunities/OpportunitiesList.tsx');
addAutocomplete('src/app/meets/MeetsList.tsx');
