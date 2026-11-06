import portraitImg from "../../assets/leisure/portrait.jpg";
import carGamingImg from "../../assets/leisure/car-gaming.jpg";
import netflixImg from "../../assets/leisure/netflix.jpg";
import spotifyImg from "../../assets/leisure/spotify.jpg";
import travelImg from "../../assets/leisure/travel.jpg";
import codingImg from "../../assets/leisure/coding.jpg";
import type { LeisureCardData } from "./types";

export const portraitCard: LeisureCardData = {
  id: "portrait",
  label: "PORTRAIT / DINIDU",
  category: "LIFE & ETHOS",
  title: "DINIDU SACHINTHA",
  image: portraitImg,
  alt: "Dinidu Sachintha portrait in white t-shirt against dark background",
  accentColor: "#9867ff",
  defaultRotate: 0,
  isPortrait: true,
};

export const floatingLeisureCards: LeisureCardData[] = [
  {
    id: "spotify",
    label: "03 / SPOTIFY",
    category: "SPOTIFY",
    title: "LOST IN THE RHYTHM",
    image: spotifyImg,
    alt: "Studio headphones and dedicated audio player setup",
    accentColor: "#10b981",
    defaultRotate: -1.5,
  },
  {
    id: "car-gaming",
    label: "01 / CAR GAMING",
    category: "CAR GAMING",
    title: "CHASE THE ADRENALINE",
    image: carGamingImg,
    alt: "Triple-monitor racing simulator with steering wheel and red cockpit lighting",
    accentColor: "#ef4444",
    defaultRotate: -4,
  },
  {
    id: "netflix",
    label: "02 / NETFLIX",
    category: "NETFLIX",
    title: "STORIES THAT STAY",
    image: netflixImg,
    alt: "Cinematic home theater screen with ambient evening lighting",
    accentColor: "#f59e0b",
    defaultRotate: 3.5,
  },
  {
    id: "travel",
    label: "04 / TRAVEL",
    category: "TRAVEL",
    title: "EXPLORE BEYOND",
    image: travelImg,
    alt: "Cinematic mountain highway road leading to misty glacier landscape",
    accentColor: "#38bdf8",
    defaultRotate: 2.5,
  },
  {
    id: "coding",
    label: "05 / CODING",
    category: "CODING",
    title: "ALWAYS CREATING",
    image: codingImg,
    alt: "Developer workstation at night with glowing code editor on wide monitor",
    accentColor: "#a855f7",
    defaultRotate: -3,
  },
];
