import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walk(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

walk('./src', (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Type and variable renames
    content = content.replace(/prisma\.eventAttendance/g, 'prisma.meetAttendance');
    content = content.replace(/prisma\.event/g, 'prisma.meet');
    
    content = content.replace(/\bEventWithDetails\b/g, 'MeetWithDetails');
    content = content.replace(/\beventId\b/g, 'meetId');
    content = content.replace(/\beventId:\s/g, 'meetId: ');

    // Replace strings and paths
    content = content.replace(/\/events\//g, '/meets/');
    content = content.replace(/\/events`/g, '/meets`');
    content = content.replace(/"\/events"/g, '"/meets"');
    content = content.replace(/"Events"/g, '"Meets"');
    content = content.replace(/>Events</g, '>Meets<');
    content = content.replace(/\bEventsList\b/g, 'MeetsList');
    content = content.replace(/\bEventAttendance\b/g, 'MeetAttendance');

    // Be careful with singular Event to Meet
    // We only replace \bEvent\b when used as a type from Prisma
    content = content.replace(/import\s+\{[^}]*\bEvent\b[^}]*\}\s+from\s+['"]@prisma\/client['"]/g, match => match.replace(/\bEvent\b/, 'Meet'));
    
    // Replace event. variables safely
    content = content.replace(/\bevent\./g, 'meet.');
    // Replace selected Event props
    content = content.replace(/\bevent\b:/g, 'meet:');
    
    // Replace UI strings for Space -> Community? No, it's the other way round.
    // "Change UI text from Communities to Spaces."
    content = content.replace(/"Communities"/g, '"Spaces"');
    content = content.replace(/>Communities</g, '>Spaces<');
    content = content.replace(/"Community"/g, '"Space"');
    content = content.replace(/>Community</g, '>Space<');
    content = content.replace(/No communities active/g, 'No spaces active');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
});
