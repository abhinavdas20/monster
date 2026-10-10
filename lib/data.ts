export type Monster = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  attack: number;
  defense: number;
  speed: number;
  element: string;
  rarity: string;
  emoji: string;
};

export const MONSTERS: Monster[] = [
  {
    id: "m1",
    name: "Ember Fox",
    description: "A swift striker with blazing attacks and nimble feet.",
    imageUrl: "/monsters/ember-fox.svg",
    attack: 8,
    defense: 4,
    speed: 9,
    element: "fire",
    rarity: "common",
    emoji: "🦊",
  },
  {
    id: "m2",
    name: "Moss Drake",
    description: "A stalwart defender that turns pressure into resilience.",
    imageUrl: "/monsters/moss-drake.svg",
    attack: 5,
    defense: 9,
    speed: 4,
    element: "nature",
    rarity: "common",
    emoji: "🐉",
  },
  {
    id: "m3",
    name: "Storm Finch",
    description: "Fast, clever, and always ready to surprise an opponent.",
    imageUrl: "/monsters/storm-finch.svg",
    attack: 9,
    defense: 4,
    speed: 10,
    element: "storm",
    rarity: "rare",
    emoji: "🐦",
  },
  {
    id: "m4",
    name: "Quartz Tortoise",
    description: "A patient tank built to outlast the fiercest wild enemies.",
    imageUrl: "/monsters/quartz-tortoise.svg",
    attack: 4,
    defense: 10,
    speed: 3,
    element: "earth",
    rarity: "rare",
    emoji: "🐢",
  },
  {
    id: "m5",
    name: "Mist Sprite",
    description: "An evasive support monster that manipulates tempo.",
    imageUrl: "/monsters/mist-sprite.svg",
    attack: 6,
    defense: 5,
    speed: 8,
    element: "arcane",
    rarity: "uncommon",
    emoji: "🧚",
  },
  {
    id: "m6",
    name: "Glacier Bear",
    description: "A heavy hitter with a frost-coated punch.",
    imageUrl: "/monsters/glacier-bear.svg",
    attack: 7,
    defense: 8,
    speed: 4,
    element: "ice",
    rarity: "uncommon",
    emoji: "🐻",
  },
];
