import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

// 1. page.tsx
replaceInFile('src/app/page.tsx', [
  { from: /NEW COMMUNITY/g, to: 'NEW SPACE' },
  { from: /Launch a builder community/g, to: 'Launch a builder space' },
  { from: /community vouches/g, to: 'space vouches' },
  { from: /community mixer/g, to: 'space mixer' },
  { from: /live events/g, to: 'live meets' },
  { from: /Host an event/g, to: 'Host a meet' },
]);

// 2. ProjectsList.tsx
replaceInFile('src/app/projects/ProjectsList.tsx', [
  { from: /from the community/g, to: 'from the space' },
  { from: /with the community/g, to: 'with the space' },
]);

// 3. ResearchList.tsx
replaceInFile('src/app/research/ResearchList.tsx', [
  { from: /builder community/g, to: 'builder space' },
]);

// 4. SpacesList.tsx
replaceInFile('src/app/spaces/SpacesList.tsx', [
  { from: /community space/g, to: 'digital space' },
  { from: /COMMUNITY/g, to: 'SPACE' },
]);

// 5. Spaces [id] page
replaceInFile('src/app/spaces/[id]/page.tsx', [
  { from: /Community Org/g, to: 'Space Org' },
]);

// 6. MeetsList.tsx
replaceInFile('src/app/meets/MeetsList.tsx', [
  { from: /totalEvents/g, to: 'totalMeets' },
  { from: /liveEvents/g, to: 'liveMeets' },
  { from: /No events found/g, to: 'No meets found' },
  { from: /Host the first event/g, to: 'Host the first meet' },
  { from: /Publish first event/g, to: 'Publish first meet' },
  { from: /Host an Event/g, to: 'Host a Meet' },
  { from: /Event Title/g, to: 'Meet Title' },
  { from: /event-title/g, to: 'meet-title' },
  { from: /Event banner/g, to: 'Meet banner' },
  { from: /Event Description/g, to: 'Meet Description' },
  { from: /Publish Event/g, to: 'Publish Meet' },
  { from: /Today's Events/g, to: "Today's Meets" },
  { from: /This Week's Events/g, to: "This Week's Meets" },
  { from: /Upcoming Events/g, to: "Upcoming Meets" },
  { from: /Past Events/g, to: "Past Meets" },
]);
