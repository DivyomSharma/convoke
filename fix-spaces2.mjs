import fs from 'fs';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Add the missing states if not present
  if (!content.includes('const [discord')) {
    content = content.replace(
      'const [error, setError] = useState("");',
      `const [error, setError] = useState("");
  const [discord, setDiscord] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const TABS = ["Basic Info", "Details", "Links"];`
    );
    console.log(`Added missing state to ${filePath}`);
  }

  fs.writeFileSync(filePath, content);
}

fixFile('src/app/spaces/SpacesList.tsx');
