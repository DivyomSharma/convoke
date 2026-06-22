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

    content = content.replace(/(?<!-)\bevent\b(?!-)/g, 'meet');
    content = content.replace(/(?<!-)\bevents\b(?!-)/g, 'meets');
    content = content.replace(/(?<!-)\bEvent\b(?!-)/g, 'Meet');
    content = content.replace(/(?<!-)\bEvents\b(?!-)/g, 'Meets');

    // Restore React's FormEvent, MouseEvent, KeyboardEvent, ChangeEvent etc.
    content = content.replace(/\bFormMeet\b/g, 'FormEvent');
    content = content.replace(/\bMouseMeet\b/g, 'MouseEvent');
    content = content.replace(/\bKeyboardMeet\b/g, 'KeyboardEvent');
    content = content.replace(/\bChangeMeet\b/g, 'ChangeEvent');
    content = content.replace(/\bFocusMeet\b/g, 'FocusEvent');
    content = content.replace(/\bReact\.Meet\b/g, 'React.Event');
    content = content.replace(/\bMeetTarget\b/g, 'EventTarget');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
});
