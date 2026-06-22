import fs from 'fs';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix the syntax error (duplicated bottom)
  const errorIndex = content.indexOf('</div>next/link";');
  if (errorIndex !== -1) {
    const goodPartTop = content.substring(0, errorIndex + 6);
    
    const resumeIndex = content.lastIndexOf('{/* Creation Drawer Overlay */}');
    if (resumeIndex !== -1) {
      const textBeforeDrawer = content.substring(0, resumeIndex);
      const lastClosingBrace = textBeforeDrawer.lastIndexOf(')}');
      
      const goodPartBottom = '\n      ' + content.substring(lastClosingBrace);
      
      content = goodPartTop + goodPartBottom;
      console.log(`Fixed syntax in ${filePath}`);
    } else {
      console.log(`Could not find resume point in ${filePath}`);
    }
  }

  // Add the missing states if not present
  if (!content.includes('setDiscord')) {
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
