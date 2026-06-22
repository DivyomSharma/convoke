export const photos = {
  hackathon: "/assets/ph-hackathon.jpg",
  pitch: "/assets/ph-pitch.jpg",
  coffee: "/assets/ph-coffee.jpg",
  whiteboard: "/assets/ph-whiteboard.jpg",
  meetup: "/assets/ph-meetup.jpg",
  code: "/assets/ph-code.jpg",
  coworking: "/assets/ph-coworking.jpg",
  demoday: "/assets/ph-demoday.jpg",
};

export const portraits = [
  "/assets/ph-portrait-1.jpg",
  "/assets/ph-portrait-2.jpg",
  "/assets/ph-portrait-3.jpg",
  "/assets/ph-portrait-4.jpg",
];

export function getFallbackPhoto(id: string, type: 'meet' | 'project' | 'space' | 'opportunity'): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  if (type === 'meet') {
    const options = [photos.meetup, photos.demoday, photos.coffee];
    return options[hash % options.length];
  } else if (type === 'project') {
    const options = [photos.code, photos.whiteboard, photos.hackathon];
    return options[hash % options.length];
  } else if (type === 'space') {
    const options = [photos.coworking, photos.meetup, photos.coffee];
    return options[hash % options.length];
  } else {
    const options = [photos.pitch, photos.code, photos.coworking];
    return options[hash % options.length];
  }
}
