export interface LeisureActivity {
  id: string;
  number: string;
  title: string;
  description: string;
  category: string;
  iconName: "Gamepad" | "Headphones" | "Play" | "MapPin" | "Trophy" | "Camera";
  imageWebp: string;
  imageJpg: string;
  alt: string;
  badge: string;
  accentGlow?: string;
}

export const leisureActivities: LeisureActivity[] = [
  {
    id: "gaming",
    number: "01",
    title: "Gaming & Racing",
    description: "Car gaming, racing sims, and open-world adventures.",
    category: "Simulation & Play",
    iconName: "Gamepad",
    imageWebp: "/assets/images/leisure/car-gaming.webp",
    imageJpg: "/assets/images/leisure/car-gaming.jpg",
    alt: "Cinematic gaming setup with racing sim and game controller",
    badge: "Virtual Track",
    accentGlow: "rgba(0, 229, 255, 0.4)",
  },
  {
    id: "music",
    number: "02",
    title: "Music",
    description: "Playlists for every mood, focus, and creative flow.",
    category: "Acoustic Flow",
    iconName: "Headphones",
    imageWebp: "/assets/images/leisure/spotify.webp",
    imageJpg: "/assets/images/leisure/spotify.jpg",
    alt: "Premium black headphones with cyan lighting",
    badge: "Audio Immersion",
    accentGlow: "rgba(168, 85, 247, 0.4)",
  },
  {
    id: "movies",
    number: "03",
    title: "Movies & Series",
    description: "Binge-worthy stories and cinematic experiences.",
    category: "Narrative & Cinema",
    iconName: "Play",
    imageWebp: "/assets/images/leisure/netflix.webp",
    imageJpg: "/assets/images/leisure/netflix.jpg",
    alt: "Cinematic home theater screen with movie playing",
    badge: "Cinema & Lore",
    accentGlow: "rgba(239, 68, 68, 0.4)",
  },
  {
    id: "traveling",
    number: "04",
    title: "Traveling",
    description: "New places, scenic routes, and cultural experiences.",
    category: "Expeditions",
    iconName: "MapPin",
    imageWebp: "/assets/images/leisure/travel.webp",
    imageJpg: "/assets/images/leisure/travel.jpg",
    alt: "Scenic mountain roads and lush natural landscapes",
    badge: "Highlands",
    accentGlow: "rgba(16, 185, 129, 0.4)",
  },
  {
    id: "cricket",
    number: "05",
    title: "Cricket",
    description: "The thrill of the game, match days, and supporting the team.",
    category: "Athletics",
    iconName: "Trophy",
    imageWebp: "/assets/images/leisure/cricket.webp",
    imageJpg: "/assets/images/leisure/cricket.jpg",
    alt: "Cricket stadium illuminated by floodlights at night",
    badge: "Match Day",
    accentGlow: "rgba(0, 229, 255, 0.45)",
  },
  {
    id: "photography",
    number: "06",
    title: "Filming & Photography",
    description: "Capturing moments, creating videos, and telling visual stories.",
    category: "Visual Storytelling",
    iconName: "Camera",
    imageWebp: "/assets/images/leisure/photography.webp",
    imageJpg: "/assets/images/leisure/photography.jpg",
    alt: "Professional cinema camera with cinematic studio lighting",
    badge: "Visual Craft",
    accentGlow: "rgba(56, 189, 248, 0.4)",
  },
];
