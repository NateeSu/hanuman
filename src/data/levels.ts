import type { LevelDefinition } from "./types";

export const LEVELS: LevelDefinition[] = [
  {
    id: 1,
    sceneKey: "Level01Scene",
    title: { th: "รัตติกาลเหนือค่ายพระราม", en: "Nightfall over Rama's Camp" },
    subtitle: { th: "ตามรอยมนตร์สู่ประตูบาดาล", en: "Follow the spell to the underworld gate" },
    background: "level-01",
    accent: 0x69dfff,
    bossName: { th: "นายทวารรัตติกาล", en: "Night Gatekeeper" },
    bossTexture: "gatekeeper",
    story: {
      th: "ไมยราพสะกดกองทัพและลักพาพระราม หนุมานฟื้นขึ้นท่ามกลางหมอกนิทรา",
      en: "Maiyarap has enchanted the army and taken Rama. Hanuman awakens in the sleeping mist.",
    },
  },
  {
    id: 2,
    sceneKey: "Level02Scene",
    title: { th: "สระบัวแห่งมัจฉานุ", en: "The Lotus Pool of Matchanu" },
    subtitle: { th: "ผู้เฝ้าทางแห่งนครบาดาล", en: "Guardian of the underworld passage" },
    background: "level-02",
    accent: 0x56f0cf,
    bossName: { th: "มัจฉานุ", en: "Matchanu" },
    bossTexture: "matchanu",
    story: {
      th: "เบื้องล่างถ้ำคริสตัล มัจฉานุผู้พิทักษ์สระบัวขวางทางหนุมานไว้",
      en: "Below the crystal cavern, Matchanu guards the lotus pool and bars Hanuman's path.",
    },
  },
  {
    id: 3,
    sceneKey: "Level03Scene",
    title: { th: "พระนครบาดาล", en: "The Underworld Palace" },
    subtitle: { th: "ทำลายดวงใจไมยราพ", en: "Destroy Maiyarap's hidden heart" },
    background: "level-03",
    accent: 0xf4c45f,
    bossName: { th: "ไมยราพ", en: "Maiyarap" },
    bossTexture: "maiyarap",
    story: {
      th: "หนุมานบุกวังบาดาลเพื่อช่วยพระราม แต่จอมอสูรซ่อนดวงใจไว้นอกกาย",
      en: "Hanuman storms the palace to rescue Rama, but the demon king has hidden his heart.",
    },
  },
];

export const levelById = (id: number): LevelDefinition => LEVELS[id - 1] ?? LEVELS[0];
