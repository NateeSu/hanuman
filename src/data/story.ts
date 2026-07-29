import type { Language, LevelId } from "./types";

export interface LocalizedStoryText {
  th: string;
  en: string;
}

export interface StoryChapter {
  id: LevelId;
  beats: [LocalizedStoryText, LocalizedStoryText];
  lore: LocalizedStoryText;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    beats: [
      {
        th: "กลางราตรี ไมยราพเจ้าเมืองบาดาลเป่ายาสะกดกองทัพวานร แล้วลักพาพระรามลงไปยังนครลับใต้พิภพ",
        en: "At midnight, Maiyarap puts the vanara army to sleep and abducts Rama to his hidden underworld city.",
      },
      {
        th: "มีเพียงหนุมานที่ฟื้นจากมนตร์ เขาจึงตามรอยหมอกนิทราไปยังประตูบาดาล ก่อนทางจะปิดตลอดกาล",
        en: "Hanuman alone wakes from the spell and follows the sleeping mist before the underworld gate closes forever.",
      },
    ],
    lore: {
      th: "จุดเริ่มต้นของศึกไมยราพ คือการช่วงชิงพระรามด้วยกลอุบาย มิใช่การรบซึ่งหน้า",
      en: "The Battle of Maiyarap begins with deception and abduction—not an open fight.",
    },
  },
  {
    id: 2,
    beats: [
      {
        th: "หลังผ่านประตูบาดาล หนุมานพบช่องผาที่ถูกกองทัพคชสารต้องมนตร์ปิดกั้นทุกเส้นทาง",
        en: "Beyond the gate, Hanuman finds every path through the gorge blocked by enchanted war elephants.",
      },
      {
        th: "เขาต้องฝ่าพลช้างโดยไม่เสียเวลา เพื่อไล่ตามขบวนของไมยราพให้ทันก่อนถึงพระนครบาดาล",
        en: "He must break through quickly and catch Maiyarap's procession before it reaches the underworld palace.",
      },
    ],
    lore: {
      th: "หนุมานมักเอาชนะอุปสรรคด้วยทั้งพละกำลัง ความเร็ว และปฏิภาณ ไม่ใช่กำลังเพียงอย่างเดียว",
      en: "Hanuman overcomes obstacles with strength, speed, and wit—not strength alone.",
    },
  },
  {
    id: 3,
    beats: [
      {
        th: "ทางลงลึกถูกหนีบด้วยภูผาหินดำที่กระทบกันเป็นจังหวะ เปลวอัคนีพวยพุ่งทุกครั้งที่ศิลาชนกัน",
        en: "The descent narrows between black mountains that crash together, throwing fire with every collision.",
      },
      {
        th: "ทวารศิลาอัคนีคุมกลไกอยู่เบื้องหน้า หนุมานต้องอ่านจังหวะภูผาและทำลายแกนเพลิงให้สิ้น",
        en: "A fire-stone sentinel controls the pass. Hanuman must read its rhythm and shatter the flaming core.",
      },
    ],
    lore: {
      th: "การเดินทางสู่นครบาดาลถูกเล่าให้เป็นโลกกลับด้าน ยิ่งลึกยิ่งพิสดารและเต็มไปด้วยด่านทดสอบ",
      en: "The journey to the underworld grows stranger with every descent, each passage becoming a new trial.",
    },
  },
  {
    id: 4,
    beats: [
      {
        th: "พงไพรใต้บาดาลเต็มไปด้วยฝูงมศกยักษ์ เสียงปีกของมันกลบทุกทิศทาง และหมอกนิทรากลับหนาแน่นขึ้น",
        en: "Giant mosquitoes fill the underworld wilds, their wings drowning every sound as the sleeping mist thickens.",
      },
      {
        th: "หนุมานเรียกลมวายุแหวกฝูงอสูร เพื่อค้นหาสระบัวซึ่งซ่อนทางเข้าสู่เขตพระนคร",
        en: "Hanuman summons the wind to part the swarm and reveal the lotus pool hiding the way to the royal city.",
      },
    ],
    lore: {
      th: "ฤทธิ์สำคัญของหนุมานคือการเหาะเหินและสำแดงเดชแห่งวายุ จึงเหมาะกับการฝ่าศัตรูที่มาเป็นฝูง",
      en: "Hanuman's command of flight and wind makes him the perfect hero against enemies that attack as a swarm.",
    },
  },
  {
    id: 5,
    beats: [
      {
        th: "ณ สระบัวหน้าพระนคร มัจฉานุผู้มีหางเป็นปลาเข้าขวางหนุมาน ทั้งสองต่อสู้โดยไม่มีใครยอมใคร",
        en: "At the lotus pool, the fish-tailed warrior Matchanu bars Hanuman's way, and neither yields in combat.",
      },
      {
        th: "เมื่อสังเกตลักษณะและซักถาม ทั้งคู่จึงรู้ความจริงว่าเป็นพ่อลูก การต่อสู้จึงยุติลงและทางลับถูกเปิดเผย",
        en: "By observing and questioning one another, they discover they are father and son; the duel ends and a secret way is revealed.",
      },
    ],
    lore: {
      th: "ตอนมัจฉานุเน้นการรู้จักยั้งมือและใช้ปัญญาค้นหาความจริง ก่อนตัดสินกันด้วยกำลัง",
      en: "Matchanu's episode values restraint and discovering the truth before deciding everything by force.",
    },
  },
  {
    id: 6,
    beats: [
      {
        th: "หนุมานลอบเข้าเมืองด้วยความช่วยเหลือของพิรากวน จนพบพระรามถูกขังในกรงเหล็กกลางดงตาลท้ายพระนคร",
        en: "With Phirakuan's help, Hanuman enters the city and finds Rama imprisoned in an iron cage in the royal grove.",
      },
      {
        th: "ก่อนช่วยพระองค์ออกมา เขาต้องทำลายตราผนึกสามชั้นและโซ่ต้องมนตร์ โดยไม่ให้ทหารทั้งเมืองรู้ตัว",
        en: "To free him, Hanuman must quietly break three seals and the enchanted chains before the city guard is alerted.",
      },
    ],
    lore: {
      th: "ดงตาลเป็นสถานที่สำคัญในตอนศึกไมยราพ เพราะเป็นที่คุมขังพระรามและจุดพลิกกลับของเรื่อง",
      en: "The toddy grove is the story's turning point: Rama's prison and the place where the rescue truly begins.",
    },
  },
  {
    id: 7,
    beats: [
      {
        th: "แม้ช่วยพระรามได้แล้ว ฤทธิ์ของไมยราพยังไม่สิ้น เพราะเขาซ่อนดวงใจไว้นอกกายและฟื้นคืนได้เสมอ",
        en: "Rama is safe, but Maiyarap cannot be defeated while his hidden heart remains outside his body.",
      },
      {
        th: "หนุมานจึงย้อนเข้าพระนครเป็นครั้งสุดท้าย เพื่อทำลายดวงใจและยุติมนตร์มืดเหนือเมืองบาดาล",
        en: "Hanuman returns to the palace one final time to destroy the heart and end the dark spell over the underworld.",
      },
    ],
    lore: {
      th: "วีรกรรมสุดท้ายชนะได้ด้วยการค้นพบความลับของศัตรู แสดงให้เห็นว่าปัญญาต้องเดินคู่กับความกล้าหาญ",
      en: "The final victory depends on discovering the enemy's secret, showing that wisdom must accompany courage.",
    },
  },
];

export const storyChapterById = (id: LevelId): StoryChapter =>
  STORY_CHAPTERS[id - 1] ?? STORY_CHAPTERS[0];

export const localized = (text: LocalizedStoryText, language: Language): string =>
  text[language];
