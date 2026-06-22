import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    const replacements = [
        ["college campuses", "global networks"], // "In global networks, hacker houses..." sounds better
        ["gather campus builders", "gather builders in the network"],
        ["Campus Feed", "Network Feed"],
        ["real-time campus actions", "real-time network actions"],
        ["Convoke Digital Campus Passport", "Convoke Passport"],
        ["technology on campus.", "technology in the ecosystem."],
        ["major campus gathering", "major network gathering"],
        ["on campus", "in the network"],
        ["Convoke campus", "Convoke network"],
        ["with campus", "with the network"],
        ["to campus builders", "to builders in the network"],
        ["digital campus", "digital network"],
        ["published on campus", "published in the network"],
        ["DIGITAL CAMPUS", "NETWORK"],
        ["Explore campus happenings", "Explore network happenings"],
        ["Browse Campus Meets", "Browse Network Meets"],
        ["Discover campus", "Discover the network"],
        ["Your campus is quiet", "Your network is quiet"],
        ["Midnight campus theme.", "Midnight network theme."]
    ];

    replacements.forEach(([search, replace]) => {
        if (content.includes(search)) {
            content = content.split(search).join(replace);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
