import carGamingImg from "../../assets/leisure/car-gaming.jpg";
import netflixImg from "../../assets/leisure/netflix.jpg";
import spotifyImg from "../../assets/leisure/spotify.jpg";
import travelImg from "../../assets/leisure/travel.jpg";
import codingImg from "../../assets/leisure/coding.jpg";
import type { LeisureActivity } from "./types";

export const leisureActivities: LeisureActivity[] = [
  {
    id: "car-gaming",
    number: "01",
    category: "CAR GAMING",
    title: "CHASE THE ADRENALINE",
    description: "Virtual roads, real excitement.",
    image: carGamingImg,
    alt: "Premium racing simulator setup with triple monitors, force feedback wheel, and cockpit lighting",
    accentColor: "#ef4444",
    badge: "SIM RACING & PRECISION",
    meta: "FORCE FEEDBACK · APEX APPRECIATION",
  },
  {
    id: "netflix",
    number: "02",
    category: "NETFLIX",
    title: "STORIES THAT STAY",
    description: "Getting lost in great films and unforgettable stories.",
    image: netflixImg,
    alt: "Cinematic home cinema space with warm ambient lighting and movie curation",
    accentColor: "#f59e0b",
    badge: "CINEMATIC STORYTELLING",
    meta: "4K CINEMATOGRAPHY · TIMELESS NARRATIVES",
  },
  {
    id: "spotify",
    number: "03",
    category: "SPOTIFY",
    title: "LOST IN THE RHYTHM",
    description: "Good music, better moods.",
    image: spotifyImg,
    alt: "Audiophile studio headphones with high-res music player and synthesizer deck",
    accentColor: "#10b981",
    badge: "SONIC IMMERSION",
    meta: "ACOUSTIC DEPTH · DEEP FLOW STATE",
  },
  {
    id: "travel",
    number: "04",
    category: "TRAVEL",
    title: "EXPLORE BEYOND",
    description: "New places, fresh perspectives, endless memories.",
    image: travelImg,
    alt: "Cinematic winding open road carving through glacial valleys and mountain landscapes",
    accentColor: "#38bdf8",
    badge: "DISCOVERY & LANDSCAPES",
    meta: "ENDLESS HORIZONS · RAW PERSPECTIVE",
  },
  {
    id: "coding",
    number: "05",
    category: "CODING",
    title: "ALWAYS CREATING",
    description: "Sometimes the best ideas happen after hours.",
    image: codingImg,
    alt: "Moody developer workstation at night with glowing code editor and warm desk lamp",
    accentColor: "#a855f7",
    badge: "CREATIVE ENGINEERING",
    meta: "AFTER-HOURS EXPERIMENTS · ARCHITECTURAL PLAY",
  },
];
