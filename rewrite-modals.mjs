import fs from 'fs';
import path from 'path';

const files = [
    {
        path: 'src/app/meets/MeetsList.tsx',
        entityType: 'Meet',
        entityVar: 'meet',
        isEvent: true,
    },
    {
        path: 'src/app/spaces/SpacesList.tsx',
        entityType: 'Space',
        entityVar: 'space',
        isSpace: true,
    },
    {
        path: 'src/app/organizations/OrganizationsList.tsx',
        entityType: 'Organization',
        entityVar: 'org',
        isOrg: true,
    },
    {
        path: 'src/app/opportunities/OpportunitiesList.tsx',
        entityType: 'Opportunity',
        entityVar: 'opp',
        isOpp: true,
    },
    {
        path: 'src/app/challenges/ChallengesList.tsx',
        entityType: 'Challenge',
        entityVar: 'challenge',
        isChallenge: true,
    }
];

files.forEach(fileInfo => {
    let content = fs.readFileSync(fileInfo.path, 'utf8');

    // Add state variables if missing
    if (!content.includes('setDiscord')) {
        content = content.replace(
            /const \[error, setError\] = useState\(""\);/,
            `const [error, setError] = useState("");
  const [discord, setDiscord] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [currentTab, setCurrentTab] = useState(0);`
        );
    }
    
    if ((fileInfo.isChallenge || fileInfo.isOpp) && !content.includes('setMode')) {
        content = content.replace(
            /const \[linkedin, setLinkedin\] = useState\(""\);/,
            `const [linkedin, setLinkedin] = useState("");
  const [mode, setMode] = useState("ONLINE");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [brochureFileName, setBrochureFileName] = useState("");`
        );
    }

    // Now inject into the create function payload
    // We can do this by regexing the payload of createXXX
    // Wait, the create function is called like createMeet({ ... })
    let createRegex = /(const res = await create[A-Za-z]+\(\{[^}]*)\}\);/g;
    content = content.replace(createRegex, (match, p1) => {
        if (!p1.includes('discord:')) {
            let add = `discord: discord || undefined,
        instagram: instagram || undefined,
        whatsapp: whatsapp || undefined,
        twitter: twitter || undefined,
        linkedin: linkedin || undefined,
        `;
            if (fileInfo.isChallenge || fileInfo.isOpp) {
                add += `mode: mode || undefined,
        brochureUrl: brochureUrl || undefined,
        `;
            }
            if (fileInfo.isEvent) {
                add += `mode: location || undefined,
        `; // Wait, location is already there for Meet. Mode is new.
            }
            return p1 + add + '});';
        }
        return match;
    });

    // Reset fields on success
    let resetRegex = /(setCreationOpen\(false\);)/;
    content = content.replace(resetRegex, `$1
        setCurrentTab(0);
        setDiscord("");
        setInstagram("");
        setWhatsapp("");
        setTwitter("");
        setLinkedin("");`);

    if (fileInfo.isChallenge || fileInfo.isOpp) {
        content = content.replace(resetRegex, `$1
        setMode("ONLINE");
        setBrochureUrl("");
        setBrochureFileName("");`);
    }

    fs.writeFileSync(fileInfo.path, content, 'utf8');
    console.log(`Updated states and backend calls for ${fileInfo.path}`);
});
