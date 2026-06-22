import fs from 'fs';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // The error string we want to find is: </div>next/link";
  const errorIndex = content.indexOf('</div>next/link";');
  if (errorIndex !== -1) {
    // The good part is up to the </div>
    const goodPartTop = content.substring(0, errorIndex + 6); // Includes "</div>"
    
    // Search for the creation drawer from the back
    const resumeIndex = content.lastIndexOf('{/* Creation Drawer Overlay */}');
    
    // But we want the "      )}\n\n      {/*" part before it to make it clean.
    // Let's just find the closing bracket of the organizations list checking `      )}`
    
    if (resumeIndex !== -1) {
      // Find the `      )}` right before the Drawer Overlay
      const textBeforeDrawer = content.substring(0, resumeIndex);
      const lastClosingBrace = textBeforeDrawer.lastIndexOf(')}');
      
      const goodPartBottom = '\n      ' + content.substring(lastClosingBrace);
      
      fs.writeFileSync(filePath, goodPartTop + goodPartBottom);
      console.log(`Fixed ${filePath}`);
    } else {
      console.log(`Could not find resume point in ${filePath}`);
    }
  } else {
    console.log(`No error string found in ${filePath}`);
  }
}

fixFile('src/app/organizations/OrganizationsList.tsx');
fixFile('src/app/spaces/SpacesList.tsx');
