import type { LevelDefinition, LevelId } from "./types";

export const LEVEL_COUNT = 7;

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
    victory: {
      th: "ประตูบาดาลเปิดออก",
      en: "The underworld gate opens",
    },
  },
  {
    id: 2,
    sceneKey: "Level02Scene",
    title: { th: "ช่องผาคชสารคลั่ง", en: "Mad Elephant Gorge" },
    subtitle: { th: "ฝ่ากองทัพคชสารต้องมนตร์", en: "Break through the enchanted war elephants" },
    background: "level-02",
    accent: 0x78efff,
    bossName: { th: "พญาคชสารเมฆา", en: "Phaya Khotchasan Mekha" },
    bossTexture: "khotchasan",
    story: {
      th: "เบื้องหลังประตูบาดาล ฝูงช้างต้องมนตร์ปิดช่องผา หนุมานต้องใช้ความเร็วเปิดทางลงสู่เบื้องล่าง",
      en: "Beyond the gate, enchanted elephants seal the gorge. Hanuman must use speed to descend.",
    },
    victory: {
      th: "มนตร์คลาย คชสารสงบและเปิดทาง",
      en: "The spell breaks and the guardian opens the path",
    },
  },
  {
    id: 3,
    sceneKey: "Level03Scene",
    title: { th: "ภูผากระทบอัคนี", en: "Clashing Mountains of Fire" },
    subtitle: { th: "จับจังหวะก่อนศิลาจะปิดทาง", en: "Race the rhythm of the crushing cliffs" },
    background: "level-03",
    accent: 0xff9b45,
    bossName: { th: "ทวารศิลาอัคนี", en: "Thawan Sila Akkhani" },
    bossTexture: "akkhani",
    story: {
      th: "ภูเขาหินดำกระทบกันเป็นเปลวไฟ อสูรศิลาควบคุมประตูที่ไม่มีผู้ใดผ่าน",
      en: "Black mountains crash together in flame while a stone sentinel commands the sealed pass.",
    },
    victory: {
      th: "แกนอัคนีแตกสลาย ภูผาหยุดกระทบ",
      en: "The fire core shatters and the mountains fall still",
    },
  },
  {
    id: 4,
    sceneKey: "Level04Scene",
    title: { th: "พงไพรมศกอสูร", en: "Demon Mosquito Wilds" },
    subtitle: { th: "ใช้วายุแหวกฝูงมศกยักษ์", en: "Part the giant swarm with wind" },
    background: "level-04",
    accent: 0xff7cf0,
    bossName: { th: "นางพญามศกทมิฬ", en: "Queen Masaka Thamin" },
    bossTexture: "masaka",
    story: {
      th: "พงไพรชื้นใต้บาดาลเต็มไปด้วยมศกยักษ์ หมอกนิทราปิดบังสระบัวที่อยู่เบื้องหน้า",
      en: "Giant mosquitoes and sleeping mist conceal the lotus pool beyond the underworld wetland.",
    },
    victory: {
      th: "ฝูงมศกแตกเป็นแสง หมอกเผยสระบัว",
      en: "The swarm becomes light and the lotus path appears",
    },
  },
  {
    id: 5,
    sceneKey: "Level05Scene",
    title: { th: "สระบัวแห่งมัจฉานุ", en: "The Lotus Pool of Matchanu" },
    subtitle: { th: "ผู้เฝ้าทางแห่งนครบาดาล", en: "Guardian of the underworld passage" },
    background: "level-05",
    accent: 0x56f0cf,
    bossName: { th: "มัจฉานุ", en: "Matchanu" },
    bossTexture: "matchanu",
    story: {
      th: "เบื้องล่างถ้ำคริสตัล มัจฉานุผู้พิทักษ์สระบัวขวางทางหนุมานไว้",
      en: "Below the crystal cavern, Matchanu guards the lotus pool and bars Hanuman's path.",
    },
    victory: {
      th: "มัจฉานุยุติการต่อสู้และบอกทางเป็นนัย",
      en: "Matchanu ends the duel and reveals the path in a riddle",
    },
  },
  {
    id: 6,
    sceneKey: "Level06Scene",
    title: { th: "ดงตาลกรงเหล็ก", en: "Iron Prison of the Toddy Grove" },
    subtitle: { th: "ทำลายสามตราผนึกเพื่อช่วยพระราม", en: "Break three seals and rescue Rama" },
    background: "level-06",
    accent: 0xb7ff63,
    bossName: { th: "ขุนทัณฑ์เหล็ก", en: "Khun Than Lek" },
    bossTexture: "than-lek",
    story: {
      th: "พิรากวนพาหนุมานลอบเข้าเมือง พระรามถูกขังไว้ในกรงเหล็กกลางดงตาลท้ายพระนคร",
      en: "Phirakuan guides Hanuman inside. Rama is held in an iron cage within the royal toddy grove.",
    },
    victory: {
      th: "โซ่ตรวนสลาย พระรามได้รับการช่วยเหลือ",
      en: "The binding chains break and Rama is rescued",
    },
  },
  {
    id: 7,
    sceneKey: "Level07Scene",
    title: { th: "พระนครบาดาล", en: "The Underworld Palace" },
    subtitle: { th: "ทำลายดวงใจไมยราพ", en: "Destroy Maiyarap's hidden heart" },
    background: "level-07",
    accent: 0xf4c45f,
    bossName: { th: "ไมยราพ", en: "Maiyarap" },
    bossTexture: "maiyarap",
    story: {
      th: "หลังนำพระรามไปยังที่ปลอดภัย หนุมานย้อนเข้าวังเพื่อทำลายดวงใจและยุติฤทธิ์ไมยราพ",
      en: "With Rama safe, Hanuman returns to destroy the hidden heart and end Maiyarap's reign.",
    },
    victory: {
      th: "ไมยราพสิ้นฤทธิ์ เมืองบาดาลพ้นจากมนตร์มืด",
      en: "Maiyarap falls and the underworld is freed from dark magic",
    },
  },
];

export const levelById = (id: number): LevelDefinition => LEVELS[id - 1] ?? LEVELS[0];

export const isLevelId = (value: number): value is LevelId =>
  Number.isInteger(value) && value >= 1 && value <= LEVEL_COUNT;
