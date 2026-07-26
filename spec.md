# SPEC — หนุมาน: ศึกไมยราพ

> เอกสารข้อกำหนดสำหรับ Codex เพื่อออกแบบ พัฒนา ทดสอบ และเตรียมเผยแพร่เกมเว็บแอ็กชัน 2D แบบมุมมองด้านข้าง โดยสร้างภาพหลักของเกมขึ้นใหม่ทั้งหมด และอนุญาตให้ใช้ asset สนับสนุนกับ Sound Effect ที่มีใบอนุญาตให้ใช้ฟรีอย่างถูกต้อง เพื่อให้พัฒนาได้รวดเร็วและรองรับมือถือแนวนอนเป็นแพลตฟอร์มหลัก

---

## 0. คำสั่งหลักสำหรับ Codex

Codex ต้องอ่านเอกสารนี้ทั้งหมดก่อนเริ่มพัฒนา และใช้เอกสารนี้เป็นแหล่งอ้างอิงหลักของโครงการ

เป้าหมายคือสร้างเกมเว็บที่ **เล่นได้จริงจนจบ 3 ด่าน** ไม่ใช่เพียงหน้าเดโมหรือ mockup โดยเน้น:

1. ภาพสวย มีเอกลักษณ์ไทยร่วมสมัย
2. หน้าแรกตอนเปิดเกมมีคุณภาพเหมือนโปสเตอร์ภาพยนตร์แอ็กชัน
3. เล่นบนมือถือแนวนอนได้ลื่นไหล
4. เกมสั้น กระชับ ลดขอบเขตเพื่อพัฒนาได้เร็ว
5. ภาพหลักที่กำหนดเอกลักษณ์ของเกมต้องสร้างขึ้นใหม่ทั้งหมด ได้แก่ ตัวละครทุกตัว sprite ตัวละครและศัตรู โปสเตอร์/key art ภาพฉาก พื้นหลัง parallax ฉากจบ และภาพเล่าเรื่อง
6. Asset สนับสนุนที่ไม่ใช่ตัวละคร โปสเตอร์ หรือภาพฉาก รวมถึง Sound Effect สามารถใช้ของบุคคลที่สามได้ เมื่อมีใบอนุญาตให้ใช้ฟรีอย่างชัดเจน เหมาะกับเกม และผ่านกฎ license/attribution ในเอกสารนี้
7. บันทึกความคืบหน้าฝั่งผู้เล่นด้วย `localStorage`
8. เมื่อเสร็จแล้วต้อง push ขึ้น GitHub และ deploy เป็น static web app บน Vercel

### ห้ามทำ

- ห้ามใช้ asset จากเกม Sonic, Contra, Mega Man หรือเกมอื่น แม้จะใช้เป็น reference ด้าน gameplay ได้
- ห้ามใช้ตัวละคร sprite ตัวละคร ศัตรู บอส โปสเตอร์ key art ภาพฉาก พื้นหลัง parallax หรือภาพเล่าเรื่องจาก asset pack, stock image หรือผลงานบุคคลที่สาม
- ห้ามใช้ asset หรือเสียงที่ไม่ระบุเจ้าของ แหล่งที่มา หรือเงื่อนไขใบอนุญาตอย่างชัดเจน
- ห้ามใช้ asset ที่จำกัดเฉพาะ non-commercial, editorial use, personal use หรือห้ามแจกจ่ายรวมกับผลิตภัณฑ์
- ห้าม hotlink รูปหรือเสียงจากเว็บไซต์ภายนอก ทุกไฟล์ที่ใช้ต้องเก็บไว้ใน repository หรือ build artifact
- ห้ามใช้ sprite rip, screenshot, เสียงตัดจากหนัง เกม การ์ตูน เพลง หรือสื่ออื่น
- ห้ามส่งเกมที่มี placeholder, กล่องสีแทนตัวละคร, sprite ชั่วคราว หรือภาพไม่ครบ
- ห้ามทำเป็นหน้าเว็บไซต์เล่าเรื่องแทนเกม
- ห้ามเพิ่มระบบบัญชีผู้ใช้ ฐานข้อมูลออนไลน์ multiplayer leaderboard ร้านค้า หรือโฆษณาในเวอร์ชันแรก
- ห้ามเพิ่มด่านเกิน 3 ด่านก่อนที่ 3 ด่านหลักจะเสร็จสมบูรณ์และผ่านเกณฑ์ทั้งหมด

---

## 1. ข้อมูลผลิตภัณฑ์

### 1.1 ชื่อเกม

**หนุมาน: ศึกไมยราพ**  
English working title: **Hanuman: Battle of Maiyarap**

### 1.2 ประเภท

- 2D side-scrolling action adventure
- Platform combat
- Single player
- Browser-first
- Mobile landscape-first

### 1.3 แพลตฟอร์ม

ลำดับความสำคัญ:

1. Mobile browser แนวนอน
2. Tablet browser แนวนอน
3. Desktop browser

### 1.4 ระยะเวลาเล่น

- ครั้งแรกจนจบ: 35–55 นาที
- ผู้เล่นชำนาญ: 20–30 นาที
- แต่ละด่าน: 8–15 นาที

### 1.5 กลุ่มเป้าหมาย

- ผู้เล่นอายุประมาณ 10 ปีขึ้นไป
- ผู้ชอบเกมแอ็กชัน 2D
- นักเรียนและผู้สนใจวรรณคดีไทย
- ผู้เล่นมือถือที่ต้องการเกมจบเป็นตอน ไม่ต้องสมัครสมาชิก

---

## 2. วิสัยทัศน์

สร้างเกมแอ็กชันสั้นที่ถ่ายทอดตอน “ศึกไมยราพ” จากรามเกียรติ์ด้วยภาพลักษณ์ไทยร่วมสมัยแบบภาพยนตร์แฟนตาซีแอ็กชัน ผู้เล่นรับบทเป็นหนุมาน ไล่ตามไมยราพลงเมืองบาดาล พบมัจฉานุ ช่วยพระราม และทำลายดวงใจของไมยราพ

เกมต้องให้ความรู้สึกว่า:

- หนุมานรวดเร็ว คล่องตัว และทรงพลัง
- เมืองบาดาลลึกลับ สวยงาม และอันตราย
- ภาพมีคุณภาพสูงกว่าต้นแบบเกมเว็บทั่วไป
- ควบคุมง่ายบนจอสัมผัส
- จบได้โดยไม่ต้อง grinding

---

## 3. ขอบเขตเวอร์ชันแรก

### 3.1 สิ่งที่ต้องมี

- Intro/loading screen แบบโปสเตอร์ภาพยนตร์
- Main menu
- Tutorial แบบสั้นในด่านแรก
- ด่านหลัก 3 ด่าน
- บอส 3 ตัว
- ศัตรูทั่วไป 4 ประเภท
- ความสามารถผู้เล่น 5 กลุ่ม
- ระบบ touch control
- ระบบ keyboard control
- ระบบ pause
- ระบบ checkpoint
- ระบบ save ด้วย `localStorage`
- ระบบเลือกด่านหลังปลดล็อก
- ระบบตั้งค่าเสียงและคุณภาพภาพ
- หน้าจอสรุปผลแต่ละด่าน
- Ending แบบสั้น
- Responsive landscape layout
- GitHub-ready repository
- Vercel-ready static deployment

### 3.2 สิ่งที่ไม่รวม

- Multiplayer
- Online account
- Cloud save
- Online leaderboard
- Voice acting เต็มรูปแบบ
- Skill tree ซับซ้อน
- Crafting
- Inventory หลายหน้า
- Open world
- Procedural level generation
- In-app purchase
- Advertising
- Gamepad support เป็นข้อบังคับ
- Localization มากกว่าไทยและอังกฤษในเวอร์ชันแรก

---

## 4. หลักวรรณคดีและการดัดแปลง

### 4.1 เหตุการณ์หลักที่ต้องรักษา

- ไมยราพสะกดกองทัพและลักพาตัวพระราม
- หนุมานติดตามลงเมืองบาดาล
- หนุมานพบและต่อสู้กับมัจฉานุ
- หนุมานช่วยพระราม
- ไมยราพซ่อนดวงใจไว้ภายนอกร่าง
- หนุมานทำลายดวงใจและปราบไมยราพ

### 4.2 การดัดแปลงเพื่อเกม

อนุญาตให้:

- รวมสถานที่หลายช่วงไว้ในด่านเดียว
- ลดตัวละครรอง
- เปลี่ยนเหตุการณ์บางตอนเป็น platform challenge
- ทำให้บอสมีหลาย phase
- ใช้ “พลังวายุ” เป็น resource สำหรับ gameplay

ห้าม:

- เปลี่ยนหนุมานเป็นตัวละครชั่วร้าย
- เปลี่ยนมัจฉานุเป็นศัตรูที่ถูกสังหาร
- เปลี่ยนพระรามเป็นตัวร้าย
- ทำให้เนื้อหาเสียดสีศาสนา วัฒนธรรม หรือเครื่องแต่งกายไทย

### 4.3 โทนเนื้อหา

- Heroic fantasy
- Action adventure
- ไม่มีเลือดหรือความรุนแรงสมจริง
- ศัตรูสลายเป็นควัน เศษแสง หรือพลังเวท
- เหมาะกับผู้เล่นวัยเรียน

---

## 5. เสาหลักด้านเกมเพลย์

### 5.1 Movement first

การเคลื่อนที่ต้องสนุกแม้ไม่มีศัตรู หนุมานต้องตอบสนองเร็วและควบคุมได้แม่น

### 5.2 Short readable combat

ศัตรูมีท่าไม่มาก แต่ต้องอ่านจังหวะได้ มีสัญญาณเตือนชัดเจน

### 5.3 Cinematic Thai fantasy

ฉากและตัวละครใช้ศิลปะไทยร่วมสมัย ไม่เป็น pixel art และไม่เลียนแบบการ์ตูนต่างประเทศ

### 5.4 Mobile-friendly challenge

ความยากมาจากการอ่านจังหวะและเลือกตำแหน่ง ไม่ใช่จากปุ่มจำนวนมากหรือการกดพร้อมกันซับซ้อน

### 5.5 Small polished scope

เลือกองค์ประกอบน้อยแต่ทำให้สมบูรณ์ ดีกว่ามีระบบจำนวนมากแต่ไม่ขัดเกลา

---

## 6. Technology specification

### 6.1 Stack ที่กำหนด

ใช้:

- Vite
- TypeScript
- Phaser 3 รุ่น stable ที่เข้ากันได้กับ ecosystem ณ เวลาพัฒนา และต้อง pin version ใน `package.json`
- HTML5 Canvas/WebGL ผ่าน Phaser renderer
- CSS สำหรับ outer shell, orientation screen และ accessibility UI
- Vitest สำหรับ unit tests ที่เหมาะสม
- Playwright หรือ browser automation ที่มีอยู่สำหรับ smoke test
- ESLint และ Prettier

ไม่ใช้ React หากไม่มีความจำเป็น เกมและเมนูหลักควรอยู่ใน Phaser เพื่อลด bundle และลดความซับซ้อน

### 6.2 Rendering

- ใช้ Phaser renderer แบบ `AUTO`
- logical game resolution: `1280 × 720`
- aspect ratio หลัก: `16:9`
- scale mode: fit inside viewport
- center both axes
- แสดง letterbox อย่างมีดีไซน์หากอัตราส่วนไม่ตรง
- ห้ามขยายพื้นที่มองเห็นด้านข้างเพื่อให้ผู้เล่นจอกว้างได้เปรียบ

### 6.3 Physics

ใช้ Phaser Arcade Physics เพื่อให้ระบบเบาและคาดเดาได้

ไม่ใช้ physics engine หนัก เช่น Matter.js เว้นแต่พบ blocker ที่มีหลักฐานชัดเจน

### 6.4 Deployment model

- Static single-page application
- ไม่มี backend
- ไม่มี serverless function ใน MVP
- build output อยู่ใน `dist/`
- deploy บน Vercel

### 6.5 Browser support

ต้องทดสอบอย่างน้อย:

- Chrome desktop รุ่นปัจจุบัน
- Edge desktop รุ่นปัจจุบัน
- Safari iOS รุ่นปัจจุบัน
- Chrome Android รุ่นปัจจุบัน

Fallback ขั้นต่ำ:

- หาก WebGL ใช้ไม่ได้ ให้ Canvas ทำงานได้
- หากอุปกรณ์ช้า ให้ลด particle และ parallax layer อัตโนมัติ

---

## 7. Repository structure

Codex ต้องสร้างโครงสร้างใกล้เคียงดังนี้:

```text
/
├─ public/
│  ├─ assets/
│  │  ├─ poster/
│  │  ├─ characters/
│  │  │  ├─ hanuman/
│  │  │  ├─ matchanu/
│  │  │  ├─ maiyarap/
│  │  │  ├─ rama/
│  │  │  └─ enemies/
│  │  ├─ levels/
│  │  │  ├─ level-01/
│  │  │  ├─ level-02/
│  │  │  └─ level-03/
│  │  ├─ ui/
│  │  ├─ vfx/
│  │  └─ audio/
│  └─ manifest.webmanifest
├─ prompts/
│  ├─ art-direction.md
│  ├─ poster.md
│  ├─ characters.md
│  ├─ environments.md
│  ├─ enemies-bosses.md
│  └─ ui-vfx.md
├─ src/
│  ├─ main.ts
│  ├─ config/
│  ├─ scenes/
│  ├─ entities/
│  ├─ systems/
│  ├─ levels/
│  ├─ ui/
│  ├─ storage/
│  ├─ audio/
│  ├─ data/
│  ├─ utils/
│  └─ styles/
├─ tests/
├─ scripts/
├─ docs/
│  ├─ asset-manifest.md
│  ├─ third-party-assets.md
│  ├─ qa-checklist.md
│  └─ deployment.md
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ vercel.json
├─ README.md
├─ THIRD_PARTY_NOTICES.md
└─ spec.md
```

Codex สามารถปรับชื่อไฟล์ย่อยได้ แต่ต้องรักษาการแยก concern และห้ามรวมระบบทั้งหมดไว้ในไฟล์เดียว

---

## 8. Scene architecture

ใช้ scene อย่างน้อยดังนี้:

1. `BootScene`
   - ตั้งค่าระบบพื้นฐาน
   - ตรวจ save data
   - ตรวจอุปกรณ์และระดับคุณภาพ

2. `PreloadScene`
   - แสดง poster loading screen
   - โหลด asset ของเมนูและด่านแรก
   - แสดง progress จริง ไม่ใช่ animation ปลอม

3. `MainMenuScene`
   - เริ่มเกม
   - เล่นต่อ
   - เลือกด่าน
   - ตั้งค่า
   - เครดิต

4. `Level01Scene`

5. `Level02Scene`

6. `Level03Scene`

7. `ResultScene`

8. `EndingScene`

9. `SettingsScene` หรือ modal scene

10. `PauseScene` หรือ overlay scene

แยก game state จาก scene object ให้ชัดเจน และใช้ event system สำหรับ HUD กับ gameplay

---

## 9. Opening experience และโปสเตอร์หน้าโหลด

### 9.1 ความสำคัญ

หน้าแรกเป็น asset ที่สำคัญที่สุดของโครงการ ต้องให้ความรู้สึกเหมือนโปสเตอร์ภาพยนตร์แอ็กชันแฟนตาซีไทย ไม่ใช่หน้า loading ธรรมดา

### 9.2 Composition

องค์ประกอบหลัก:

- หนุมานอยู่ foreground กลางค่อนไปทางซ้าย ยืนหรือกระโจนในท่าพร้อมรบ
- ถือกระบองหรืออยู่ในท่ากำหมัด มีพลังวายุหมุนรอบตัว
- ไมยราพปรากฏเป็นร่างใหญ่ในฉากหลังด้านขวา สีม่วงดำ ดูน่าเกรงขาม
- พระรามอยู่เป็น silhouette หรือถูกคุมขังในแสงสีทองด้านล่าง
- ฉากเมืองบาดาลมีเสาไทย วังยักษ์ หมอก พายุ และแสงเวท
- มีเส้นนำสายตาแบบโปสเตอร์หนัง
- มีพื้นที่ปลอดภัยสำหรับวางชื่อเกมและ progress bar ด้วย code-native text

### 9.3 Visual tone

- Epic Thai mythic action
- High contrast
- Dramatic rim light
- Deep indigo, violet, black, gold, white
- Atmospheric depth
- Painterly cinematic illustration
- ไม่มีข้อความฝังในภาพ
- ไม่มีโลโก้หรือ watermark

### 9.4 Motion ระหว่างโหลด

ใช้ motion เบา ๆ จาก code:

- หมอกเคลื่อนช้า
- particle ฝุ่นทอง
- parallax หนุมานกับฉากหลังเล็กน้อย
- แสงวายุ pulse
- progress bar จริง

ห้ามใช้ video เปิดเกมเพื่อประหยัดขนาดและเวลาโหลด

### 9.5 Performance budget ของหน้าแรก

- poster หลักควรมี WebP/AVIF ที่ optimized
- ขนาด asset ที่โหลดก่อน interaction ไม่เกินประมาณ 1.5 MB เมื่อทำได้
- shell + poster + menu asset รวมเป้าหมายไม่เกิน 3 MB
- ต้องเริ่มแสดง poster ให้เร็วที่สุด ไม่รอโหลด asset ทุกด่าน

### 9.6 Acceptance criteria

หน้าแรกผ่านเมื่อ:

- ดูดีทั้ง 1280×720 และ 844×390
- ชื่อเกมอ่านได้ชัด
- ปุ่มเริ่มเกมเข้าถึงง่ายด้วยนิ้วโป้ง
- ไม่มี text baked-in ในภาพ
- ไม่มีการยืดภาพผิดสัดส่วน
- poster ยังดูดีเมื่อ crop แบบ cover ภายในกรอบ 16:9

---

## 10. Art direction

### 10.1 Style bible

รูปแบบภาพคือ:

**“Cinematic Thai mural fantasy”**

ผสม:

- เครื่องแต่งกายและลวดลายจากโขน/จิตรกรรมไทย
- สัดส่วนตัวละครที่อ่านง่ายในเกมแอ็กชัน
- แสงเงาแบบภาพยนตร์แฟนตาซี
- silhouette ชัดเจน
- พื้นผิวลงสีแบบ painterly
- ขอบรูปคมพอสำหรับ sprite

ไม่ใช้:

- Pixel art
- Chibi
- Photorealistic costume cosplay
- Anime school style
- Western superhero suit
- ภาพสีน้ำจางจนแยกตัวละครจากฉากไม่ได้

### 10.2 Character silhouette

- หนุมาน: รูปทรงคล่องตัว ไหล่กว้าง หางเด่น ชฎาและเครื่องทองไม่รก
- มัจฉานุ: ลำตัววานร ช่วงล่างและหางสะท้อนสิ่งมีชีวิตใต้น้ำ โทนเขียวฟ้า
- ไมยราพ: ร่างใหญ่ เส้นทรงเหลี่ยม หนักแน่น ชฎาสูง กระบองเด่น
- พระราม: สงบ สง่างาม โทนเขียวทอง ไม่แย่ง focal point หนุมาน

### 10.3 Color keys

- Hero palette: white, warm gold, cool silver, wind cyan
- Maiyarap palette: deep violet, black, copper gold, poisonous green accent
- Level 1: moon blue, smoky purple, torch gold
- Level 2: teal water, emerald, lotus pink accent, cave indigo
- Level 3: black-violet palace, storm gold, crimson warning accent

### 10.4 Camera readability

รายละเอียดของ sprite ต้องยังอ่านออกเมื่อความสูงตัวละครบนจออยู่ประมาณ 110–150 logical pixels

ห้ามสร้างเครื่องประดับละเอียดเกินไปจนเกิด visual noise บนมือถือ

---

## 11. Visual asset sourcing and generation policy

### 11.1 ภาพที่ต้องสร้างขึ้นใหม่ทั้งหมด

ภาพต่อไปนี้เป็น **core visual assets** ที่กำหนดตัวตนของเกม และห้ามนำ asset สำเร็จรูปหรือผลงานบุคคลที่สามมาใช้แทน:

- Opening poster และ key art
- Menu background ที่ดัดแปลงจาก key art
- ตัวละครหนุมาน พระราม มัจฉานุ ไมยราพ
- ศัตรูและบอสทุกตัว
- Character portraits, sprites, animation frames และ silhouette ที่เกี่ยวข้อง
- ภาพฉากทุกด่าน ได้แก่ far background, mid background, parallax layer, gameplay terrain, foreground overlay และ major set piece
- Level thumbnails
- Ending illustration และภาพเล่าเรื่อง
- สัญลักษณ์เฉพาะเรื่องที่มีบทบาทเด่น เช่น ดวงใจไมยราพหรือวัตถุพิธีกรรมสำคัญ

Core visual assets ต้องสร้างใหม่สำหรับโครงการนี้ด้วยระบบสร้างภาพและการตกแต่งหลังการสร้าง ห้ามใช้ภาพ stock, asset pack หรือภาพจากเว็บเป็น production asset

### 11.2 Asset ภาพที่อนุญาตให้ใช้ของฟรี

เพื่อประหยัดเวลา สามารถใช้ third-party visual assets ที่มีใบอนุญาตให้ใช้ฟรีได้ เฉพาะสิ่งที่ไม่ใช่ตัวละคร โปสเตอร์ key art หรือภาพฉากหลัก เช่น:

- UI icons และ controller/button glyphs
- Cursor, toggle, slider, checkbox และไอคอน accessibility
- Generic particle textures, spark, smoke, dust หรือ impact texture
- Generic VFX texture ที่ไม่มีเอกลักษณ์จากเกมหรือสื่ออื่น
- Generic decorative UI elements ที่สามารถปรับให้เข้ากับ art direction ได้
- Font ที่มี license อนุญาตให้ embed และ redistribute บนเว็บ
- Props ขนาดเล็กที่ไม่กำหนดเอกลักษณ์ของฉาก เช่น เชือก โซ่ เศษหิน หรือภาชนะทั่วไป เฉพาะเมื่อปรับสี แสง และรูปทรงแล้วเข้ากับเกม

ห้ามนำ asset pack สำเร็จรูปทั้งชุดมาใช้จนทำให้ภาพรวมดูเหมือนเกม template หรือขัดกับศิลปะไทยร่วมสมัย ถ้า asset ฟรีไม่กลมกลืน ให้สร้างใหม่แทน

### 11.3 License ที่ยอมรับได้

อนุญาตเฉพาะ license ที่ให้สิทธิ์ใช้งานในเกมเว็บและแจกจ่ายไฟล์ไปกับ build ได้อย่างชัดเจน โดยลำดับที่ควรเลือกคือ:

1. CC0 หรือ Public Domain
2. CC BY 4.0 โดยใส่ attribution ครบถ้วน
3. MIT, Apache-2.0 หรือ BSD สำหรับ icon, font, code-based asset หรือ resource ที่ license ครอบคลุมไฟล์นั้น
4. License ของผู้สร้างหรือเว็บไซต์ที่ระบุชัดว่าใช้ฟรีในงานเชิงพาณิชย์และอนุญาตให้รวม/redistribute ไปกับเกม

ห้ามใช้โดยไม่ได้รับอนุมัติเพิ่มเติม:

- CC BY-NC หรือ license ที่ห้าม commercial use
- CC BY-ND หรือ license ที่ห้ามดัดแปลง
- CC BY-SA หรือ license แบบ share-alike ที่อาจสร้างข้อผูกพันกับทั้งโครงการ
- Editorial use only
- Personal use only
- License ที่ระบุว่าใช้ฟรีแต่ห้าม redistribute
- ไฟล์ที่มีเพียงคำว่า royalty-free แต่ไม่มีเงื่อนไขสิทธิ์ที่ตรวจสอบได้
- ไฟล์จากเว็บไซต์รวม asset ที่ไม่สามารถยืนยันเจ้าของต้นฉบับได้

เมื่อไม่แน่ใจ ให้ถือว่า **ห้ามใช้** และสร้าง asset ใหม่แทน

### 11.4 กฎการนำ third-party asset เข้าโครงการ

ทุก asset ฟรีที่นำมาใช้ต้อง:

1. ดาวน์โหลดเก็บใน repository หรือในขั้นตอน build ที่ควบคุมได้ ห้าม hotlink
2. ตรวจว่า license อนุญาตให้ใช้ในโครงการที่เผยแพร่สาธารณะและอาจใช้เชิงพาณิชย์ในอนาคต
3. บันทึก URL ต้นทาง ชื่อผู้สร้าง ชื่อ license และวันที่ดาวน์โหลด
4. เก็บสำเนาข้อความ license หรือไฟล์ license ใน repository เมื่อผู้ให้บริการอนุญาต
5. ระบุว่ามีการแก้ไขอะไร เช่น crop, recolor, pitch, trim, layer หรือ normalize
6. ใส่ attribution ใน `THIRD_PARTY_NOTICES.md`, `docs/third-party-assets.md` และหน้า Credits ภายในเกมเมื่อ license กำหนด
7. ห้ามมี watermark, trademark หรือ branding ของบุคคลที่สามติดมากับ asset
8. ปรับ asset ให้สอดคล้องกับ palette, lighting, scale, outline และ visual density ของเกม
9. ตรวจว่า asset ไม่มี metadata หรือไฟล์แฝงที่ไม่จำเป็นก่อน commit

### 11.5 Generation workflow สำหรับ core visual assets

สำหรับแต่ละหมวด core visual asset:

1. สร้าง concept sheet
2. เลือก visual direction เดียว
3. สร้าง production asset แยกพื้นหลังโปร่งใสเมื่อจำเป็น
4. ทำ cleanup ขอบภาพ
5. crop ให้สม่ำเสมอ
6. สร้าง atlas
7. บีบอัดไฟล์
8. บันทึก prompt และ metadata ลง `docs/asset-manifest.md`

### 11.6 Asset manifests

`docs/asset-manifest.md` ต้องบันทึก asset ที่สร้างใหม่ โดยมีข้อมูล:

- file path
- asset name
- category
- purpose
- prompt file อ้างอิง
- generated date
- image model/tool ที่ใช้
- original resolution
- final resolution
- transparency required หรือไม่
- optimization format
- notes เรื่อง crop/pivot/hitbox

`docs/third-party-assets.md` ต้องบันทึก asset บุคคลที่สามทุกไฟล์ โดยมีข้อมูล:

- local file path
- original asset name
- category และ purpose
- author/creator
- source page URL
- direct download URL ถ้ามี
- license name และ version
- license URL
- commercial use permitted: yes/no
- redistribution in game build permitted: yes/no
- attribution required: yes/no
- attribution text ที่ต้องใช้
- downloaded date
- modifications performed
- path ของสำเนา license หรือหลักฐาน license

ห้าม merge หรือ deploy หาก third-party asset ใดไม่มีข้อมูลครบ

### 11.7 Prompt requirements

Prompt สำหรับ core visual asset ต้องระบุ:

- ตัวละคร/ฉาก
- style bible
- lighting
- camera angle
- silhouette requirement
- transparent background หากเป็น sprite
- no text
- no watermark
- no frame
- no duplicated limbs
- no cropped weapon or tail
- consistent costume

### 11.8 Sprite consistency

หากระบบสร้างภาพไม่สามารถสร้าง sprite sheet ที่ consistent ได้ ให้ใช้แนวทาง:

- สร้าง key pose ที่ consistent
- ใช้ animation แบบ skeletal/mesh หรือ tween บางส่วน
- ใช้จำนวน frame ต่ำแต่คุณภาพสูง
- ห้ามใช้ sprite หลายแบบที่หน้าตาและเครื่องแต่งกายไม่ต่อเนื่องกัน

### 11.9 Minimum visual asset list

#### Poster and menu — ต้องสร้างใหม่

- Opening poster 1 ภาพ
- Menu background variant 1 ภาพ
- Level select map/background 1 ภาพ
- Ending illustration 1 ภาพ
- Level thumbnail 3 ภาพ

#### Hanuman — ต้องสร้างใหม่

อย่างน้อย:

- idle
- run
- jump rise
- fall
- dash
- attack 1
- attack 2
- heavy attack
- air attack
- hurt
- victory
- wind skill

#### Matchanu — ต้องสร้างใหม่

- idle
- swim/dash
- tail strike
- trident strike
- hurt
- resolve/ending pose

#### Maiyarap — ต้องสร้างใหม่

- idle
- staff strike
- spell cast
- teleport
- shadow clone pose
- giant form attack
- hurt
- defeat

#### Enemies — ต้องสร้างใหม่

ศัตรู 4 ประเภท แต่ละประเภทมี:

- idle
- walk/fly
- attack
- hurt
- defeat

#### Environment — ต้องสร้างใหม่

แต่ละด่านมี:

- far background
- mid background
- gameplay ground/tiles
- foreground overlay
- 3–5 props หลักที่กำหนดเอกลักษณ์ของด่าน
- 2 hazard assets
- checkpoint asset
- exit/goal asset

Props ขนาดเล็กหรือองค์ประกอบทั่วไปสามารถใช้ asset ฟรีได้ตามข้อ 11.2 แต่ต้องไม่ทำให้ภาพฉากหลักพึ่งพา asset สำเร็จรูป

#### VFX — สร้างใหม่หรือใช้ asset ฟรีที่ผ่าน license

- melee slash
- heavy impact
- wind dash
- wind skill burst
- enemy dissolve
- magic projectile
- boss warning marker
- checkpoint activation

VFX ที่เป็นเอกลักษณ์ของหนุมาน ไมยราพ หรือบอสควรสร้างใหม่ ส่วน particle หรือ texture ทั่วไปใช้ asset ฟรีได้หากผ่านข้อ 11.3–11.6

---

## 12. Audio policy

### 12.1 Music

เพลงประกอบต้องเป็น original หรือ generated ใหม่สำหรับโครงการ เพื่อให้เสียงดนตรีมีเอกลักษณ์สอดคล้องกับไทยแฟนตาซีร่วมสมัย ห้ามใช้เพลงจากหนัง เกม เพลงเชิงพาณิชย์ หรือเพลงที่มีสิทธิ์ไม่ชัดเจน

หากภายหลังจำเป็นต้องใช้เพลงฟรีจากบุคคลที่สาม ต้องได้รับการอนุมัติจากเจ้าของโครงการก่อน และต้องผ่านกฎ license ในข้อ 11.3–11.6 ทุกข้อ

### 12.2 Sound Effect

อนุญาตให้ใช้ Sound Effect จากคลังเสียงหรือผู้สร้างภายนอกได้ เพื่อประหยัดเวลา เมื่อไฟล์นั้น:

- เป็น CC0, Public Domain, CC BY 4.0 หรือ license อื่นที่อนุญาต commercial use และ redistribution ในเกมอย่างชัดเจน
- ไม่มีข้อจำกัด non-commercial, editorial-only, personal-use-only หรือห้ามดัดแปลง
- ไม่ใช่เสียงที่ตัดมาจากหนัง เกม การ์ตูน เพลง หรือสื่อที่มีลิขสิทธิ์
- ไม่มีเสียงพูด ชื่อแบรนด์ หรือลักษณะจำเพาะที่อาจสร้างปัญหาสิทธิ์
- เข้ากับบรรยากาศไทยแฟนตาซีและไม่ฟังเหมือน asset สำเร็จรูปที่ขัดกับภาพเกม
- ดาวน์โหลดมาเก็บในโครงการ ห้าม stream หรือ hotlink จากแหล่งภายนอก
- ลงทะเบียนใน `docs/third-party-assets.md` และ `THIRD_PARTY_NOTICES.md`

Codex สามารถ trim, normalize, EQ, layer, fade, pitch-shift หรือปรับความยาว SFX เพื่อให้เหมาะกับเกมได้ ตราบใดที่ license อนุญาตให้ดัดแปลง ต้องบันทึกการแก้ไขไว้ใน manifest

ควรหลีกเลี่ยงการใช้เสียงเดียวกับที่พบทั่วไปในเกมจำนวนมาก หากใช้เสียง stock ให้ layer หรือปรับแต่งเพื่อสร้างเอกลักษณ์ และต้องไม่ทำให้ peak level แตกหรือดังเกินไปบนลำโพงมือถือ

### 12.3 Audio asset requirements

MVP ใช้เสียงขั้นต่ำ:

- music loop เมนู 1 ชิ้น
- music loop ด่าน 3 ชิ้น หรือใช้ 2 ชิ้นร่วมกันอย่างเหมาะสม
- boss music 1 ชิ้น
- SFX movement/combat/UI ประมาณ 20–30 เสียง

ไม่มี voice acting เต็มรูปแบบ ใช้ subtitle และเสียงอุทานสั้นที่สร้างใหม่ได้

ไฟล์เสียงต้องบีบอัดสำหรับเว็บ โดยใช้ format ที่รองรับเบราว์เซอร์เป้าหมาย และต้องตั้งระดับความดังให้สมดุลระหว่างเพลง SFX และ UI sound

---

## 13. Player controls

### 13.1 Keyboard

| Action | Default |
|---|---|
| Move left/right | A/D หรือ Arrow Left/Right |
| Jump | Space |
| Attack | J |
| Skill / wind burst | K |
| Dash | L หรือ Shift |
| Pause | Escape |

### 13.2 Mobile landscape

ฝั่งซ้าย:

- virtual joystick หรือปุ่ม left/right แบบ 2 ปุ่ม

ฝั่งขวา:

- Jump
- Attack
- Dash
- Skill

ข้อกำหนด:

- ปุ่มหลักเส้นผ่านศูนย์กลาง visual อย่างน้อยประมาณ 56 CSS px บนมือถือทั่วไป
- hit area ใหญ่กว่า visual ได้
- opacity ปรับได้
- ปุ่มไม่บังตัวละครตรงกลางจอ
- รองรับ multi-touch อย่างน้อย move + jump/attack
- มี haptic feedback เฉพาะเมื่อ browser รองรับและผู้เล่นเปิดใช้

### 13.3 Portrait mode

เมื่อมือถืออยู่แนวตั้ง:

- หยุดเกม
- แสดง orientation screen ที่สวยงาม
- ข้อความ: “หมุนอุปกรณ์เป็นแนวนอนเพื่อเล่น”
- ไม่ให้ gameplay ดำเนินต่อเบื้องหลัง

---

## 14. Player movement specification

ค่าต่อไปนี้เป็นค่าเริ่มต้นและปรับได้หลัง playtest:

- run speed: เร็วแต่ควบคุมได้
- acceleration: สั้น ไม่ลื่นเหมือนน้ำแข็ง
- deceleration: เร็วพอหยุดบนแท่น
- jump: variable height ตามเวลาที่กด
- coyote time: 100–140 ms
- jump buffer: 100–140 ms
- double jump: 1 ครั้ง
- wall slide: ไม่มีใน MVP เพื่อลด scope
- dash: ใช้ได้บนพื้นและกลางอากาศ 1 ครั้งก่อนแตะพื้น
- dash cooldown: สั้น
- knockback: ไม่รุนแรงจนตกเหวง่าย

ตัวควบคุมต้องให้ความสำคัญกับความรู้สึกตอบสนองมากกว่าฟิสิกส์สมจริง

---

## 15. Player abilities

จำกัดเหลือ 5 ระบบหลัก:

### 15.1 Run and jump

พื้นฐานการเคลื่อนที่

### 15.2 Double jump

ใช้ตั้งแต่ต้นเกม

### 15.3 Wind dash

- พุ่งไปตามทิศทางหลัก
- หลบอันตราย
- ผ่านช่องลม
- ทำลายกำแพงที่แตกร้าว

### 15.4 Three-hit melee combo

- attack 1: เร็ว
- attack 2: กวาด
- attack 3: กระแทกหนัก

ระบบ auto-chain เมื่อกด attack ต่อเนื่องใน timing window

### 15.5 Wind burst skill

- ใช้ resource “พลังวายุ”
- โจมตีเป็นวง
- ผลักศัตรู
- ทำลาย projectile บางชนิด
- cooldown สั้นและใช้พลังวายุ

ไม่มี skill tree ใน MVP

---

## 16. Player resources

### 16.1 Health

- เริ่มต้น 100
- ไม่มี life count
- แพ้แล้วกลับ checkpoint

### 16.2 Wind energy

- สูงสุด 100
- ใช้กับ wind burst
- ฟื้นจากการโจมตีศัตรูและ collectible

### 16.3 Collectible

มี collectible หลักเพียงชนิดเดียว: **ตราพระราม**

- ด่านละ 3 ชิ้น
- รวม 9 ชิ้น
- ใช้ปลดล็อก gallery/ending art variant เท่านั้น
- ไม่จำเป็นต่อการจบเกม

---

## 17. Combat specification

### 17.1 Core loop

1. อ่านท่าเตือน
2. กระโดดหรือ dash หลบ
3. โจมตีเป็น combo
4. ใช้ wind burst เมื่อถูกล้อม

### 17.2 Damage feedback

เมื่อโจมตีโดน:

- hit stop สั้นมาก
- impact VFX
- sound
- enemy flash โดยไม่ใช้แสงกระพริบรุนแรง
- camera shake ระดับต่ำและปิดได้

### 17.3 Invulnerability

หลังผู้เล่นรับความเสียหาย มี invulnerability frame ระยะสั้น เพื่อป้องกันการเสียพลังซ้ำต่อเนื่อง

### 17.4 Enemy telegraph

ทุก attack ที่สร้างความเสียหายสูงต้องมีอย่างน้อย 2 ใน 3 อย่าง:

- animation cue
- color/VFX cue
- audio cue

### 17.5 Boss rules

- checkpoint ก่อนบอส
- phase ไม่เกิน 3
- attack pattern ต่อ phase ไม่เกิน 4 แบบ
- ไม่เพิ่ม HP แบบยืดเวลาโดยไม่มี mechanic ใหม่
- ผู้เล่นต้องเข้าใจจุดอ่อนจาก gameplay โดยไม่ต้องอ่านข้อความยาว

---

## 18. Enemy roster

จำกัดศัตรูทั่วไปเหลือ 4 ประเภท และ reuse อย่างมีการปรับ palette/VFX เล็กน้อยได้

### 18.1 Yak Guard

- melee enemy
- เดินเข้าหา
- โจมตี 1–2 จังหวะ
- มีท่าเตือนชัด

### 18.2 Yak Archer

- ranged enemy
- ยิง projectile เส้นตรง
- มี laser/line hint สั้นก่อนยิง

### 18.3 Cave Bat Spirit

- flying enemy
- บินวนแล้วพุ่ง
- HP ต่ำ

### 18.4 Shadow Mage

- teleport ระยะสั้น
- ยิงเวทช้า
- สร้างพื้นที่อันตรายเล็ก ๆ

ห้ามเพิ่มศัตรูทั่วไปใหม่ก่อนที่ศัตรู 4 ชนิดนี้จะ polish ครบ

---

## 19. Game progression

ลำดับ:

1. เปิดเกมและดู poster loading
2. Main menu
3. ด่าน 1 ปลดล็อกเสมอ
4. ผ่านด่าน 1 ปลดล็อกด่าน 2
5. ผ่านด่าน 2 ปลดล็อกด่าน 3
6. ผ่านด่าน 3 ปลดล็อก ending และ level select เต็ม

ไม่มี character leveling

ผู้เล่นเก่งขึ้นจากการเรียนรู้ระบบ ไม่ใช่จากการเพิ่มตัวเลขจำนวนมาก

---

# 20. Level design

## 20.1 ด่าน 1 — รัตติกาลเหนือค่ายพระราม

### Narrative

ไมยราพใช้มนตร์สะกดกองทัพและลักพาตัวพระราม หนุมานฟื้นขึ้นและไล่ตามร่องรอยไปยังประตูบาดาล

### Duration

8–12 นาที

### Visual

- ค่ายพระรามยามค่ำ
- แสงจันทร์
- หมอกม่วง
- คบเพลิงทอง
- เงาวังบาดาลใต้พื้นดิน

### Gameplay purpose

- สอน movement
- สอน attack
- สอน dash
- สอน checkpoint
- มี combat arena สั้น

### Structure

1. Poster transition เข้าฉาก
2. Tutorial movement
3. พบศัตรู melee
4. platform section สั้น
5. สอน dash ผ่านกำแพงแตก
6. arena รวม melee + archer
7. checkpoint
8. boss
9. เปิดประตูบาดาล

### Hazards

- หมอกนิทรา: ทำให้ช้าชั่วคราว
- หลุมและแท่นพัง

### Boss 1 — นายทวารรัตติกาล

รูปแบบ:

- spear thrust
- shield charge
- overhead slam

วิธีชนะ:

- dash ผ่านหรือกระโดดหลบ charge
- โจมตีด้านหลังเมื่อ shield เปิด

Phase เดียวหรือ 2 phase สั้น

### End

หนุมานกระโดดลงประตูบาดาล กล้องตามลงสู่ความมืด

---

## 20.2 ด่าน 2 — สระบัวแห่งมัจฉานุ

### Narrative

หนุมานผ่านถ้ำใต้พิภพและมาถึงสระบัว พบมัจฉานุผู้เฝ้าทางเข้าสู่เมืองบาดาล ทั้งสองต่อสู้ก่อนทราบสายสัมพันธ์

### Duration

10–15 นาที

### Visual

- ถ้ำคริสตัลสีน้ำเงินเขียว
- สระบัวเรืองแสง
- รากบัวขนาดใหญ่
- เมืองบาดาลปรากฏไกล ๆ
- น้ำและหมอกสะท้อนแสง

### Gameplay purpose

- เพิ่ม verticality
- ฝึก double jump
- ใช้ wind dash ข้ามช่อง
- เรียนรู้ flying enemy
- boss ที่เน้น movement

### Structure

1. ถ้ำบาดาล
2. platform เหนือน้ำ
3. กระแสน้ำ/ลมผลัก
4. arena กับ bat + mage
5. เก็บตราพระรามในเส้นทางลับ
6. checkpoint
7. boss Matchanu
8. cutscene สั้น
9. มัจฉานุเปิดทาง

### Hazards

- น้ำลึก: ตกแล้วเสียพลังและ respawn ใกล้จุดเดิม
- กระแสน้ำพุ่งขึ้น
- รากบัวพัง

### Boss 2 — มัจฉานุ

ห้ามให้ผู้เล่นสังหารมัจฉานุ

#### Phase 1

- water dash
- tail sweep
- trident thrust

#### Phase 2

- leap from water
- water projectile
- current wave

ค่าบอสที่ลดลงแสดงเป็น “แรงต่อสู้” หรือใช้ HP แต่จบด้วย cutscene ยุติการต่อสู้ ไม่ใช่ death animation

### End

มัจฉานุเปิดทางลับเข้าสู่พระนครไมยราพ พร้อมคำใบ้เรื่องดวงใจ

---

## 20.3 ด่าน 3 — พระนครบาดาลและดวงใจไมยราพ

### Narrative

หนุมานบุกพระนคร ช่วยพระราม พบว่าไมยราพไม่อาจตายด้วยการโจมตีธรรมดา จึงทำลายแมลงภู่ที่เก็บดวงใจและกลับมาปราบไมยราพ

### Duration

12–18 นาที

### Visual

ด่านเดียวแต่แบ่ง 3 visual zone:

1. พระราชวังบาดาลสีม่วงดำ
2. วิหารดวงใจสีทองเขียวพิษ
3. ห้องบัลลังก์ที่กำลังถล่ม

### Gameplay purpose

- ทดสอบทุกความสามารถ
- combat encounter ที่เข้มขึ้น
- chase section สั้น
- final boss หลาย phase

### Structure

1. ลอบเข้าพระราชวังแบบ action ไม่ใช่ stealth เต็มระบบ
2. arena 2 ห้อง
3. พบพระรามในผนึก
4. ต่อสู้ไมยราพครั้งแรกสั้น ๆ
5. ไมยราพฟื้นและเผยเงื่อนงำดวงใจ
6. chase ไปวิหารดวงใจ
7. ทำลายผนึก 3 จุด
8. ไล่จับแมลงภู่ดวงใจ
9. กลับสู่ห้องบัลลังก์
10. final boss
11. ending

### Hazards

- magic floor
- falling debris
- rotating blade/ornament trap แบบแฟนตาซี
- collapsing platforms

### Boss 3 — ไมยราพ

#### Phase 1: จอมเวทบาดาล

- staff combo
- shadow projectile
- teleport strike
- sleep mist zone

เมื่อ HP ลดถึง threshold ให้เกิด narrative event ว่าโจมตีไม่ตาย

#### Heart sequence

- ทำลาย seal 3 จุด
- แมลงภู่บินเป็นเส้นทางสั้น
- ผู้เล่นใช้ dash + jump ไล่ตาม
- โจมตีแมลงภู่ 3 ครั้ง

#### Phase 2: ร่างอสูรสุดท้าย

- giant hand slam
- floor shockwave
- shadow clone
- collapsing arena

#### Final beat

เมื่อบอสเหลือ HP ต่ำ:

- เปิด short interactive finisher
- ผู้เล่นกด attack/dash ตาม cue ที่อ่านง่าย
- หนุมานทำลายพลังไมยราพ

### Ending

- พระรามได้รับการช่วยเหลือ
- หนุมานนำพระรามกลับสู่กองทัพ
- แสดงภาพ ending illustration
- แสดงสรุปของสะสมและเวลารวม
- ปลดล็อก replay

---

## 21. Checkpoint and failure

- ด่านละ 2–3 checkpoint
- checkpoint ก่อนบอสเสมอ
- เมื่อแพ้ ผู้เล่นกลับ checkpoint ล่าสุด
- HP เต็ม
- wind energy อย่างน้อย 50%
- collectible ที่เก็บแล้วไม่หาย
- ศัตรูใน encounter ปัจจุบัน reset
- ไม่ใช้ life count

Death/defeat transition ต้องเร็ว ไม่เกินประมาณ 2–3 วินาทีก่อนเล่นต่อได้

---

## 22. Camera

- side-scroll follow
- dead zone ป้องกันกล้องสั่นตามผู้เล่นทุก pixel
- look-ahead เล็กน้อยตามทิศทางวิ่ง
- boss room lock camera
- camera shake ปิดได้
- no sudden zoom ที่ทำให้เวียนหัว
- บนมือถืออย่า zoom ออกจนตัวละครเล็กเกินไป

---

## 23. HUD

HUD ระหว่างเล่นมีเฉพาะ:

- HP bar
- Wind energy bar
- ตราพระราม x/3
- boss HP เมื่อมีบอส
- pause button บนมือถือ

ข้อกำหนด:

- อยู่ใน safe area
- อ่านได้บนจอ 667×375
- ไม่บัง platform สำคัญ
- ใช้ ornament ไทยบางส่วนแต่ไม่รก
- ตัวเลขและข้อความเป็น code-native

---

## 24. Main menu

เมนูหลัก:

- เริ่มเกมใหม่
- เล่นต่อ
- เลือกด่าน
- ตั้งค่า
- เครดิต

พฤติกรรม:

- “เล่นต่อ” disabled เมื่อไม่มี save
- “เลือกด่าน” แสดงเฉพาะด่านที่ปลดล็อก
- background ใช้ menu variant จาก poster
- มี ambient motion เบา ๆ
- tap target ใหญ่

---

## 25. Result screen

หลังจบด่าน แสดง:

- completion time
- damage taken
- collectibles x/3
- retry
- next level
- main menu

Rating ใช้เพียง 3 ระดับเพื่อลดระบบ:

- ผ่านศึก
- วีรชน
- มหาวีร

ไม่ต้องมี score formula ซับซ้อน

---

## 26. Save data

### 26.1 Storage

ใช้ `localStorage`

key แนะนำ:

```text
hanuman_maiyarap_save_v1
```

### 26.2 Save schema

อย่างน้อยมี:

```ts
interface GameSaveV1 {
  version: 1;
  updatedAt: string;
  unlockedLevel: 1 | 2 | 3;
  completedLevels: number[];
  latestCheckpoint?: {
    levelId: number;
    checkpointId: string;
  };
  levelStats: Record<string, {
    bestTimeMs?: number;
    collectibles: string[];
    completed: boolean;
  }>;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    muted: boolean;
    quality: "auto" | "low" | "medium" | "high";
    screenShake: boolean;
    touchOpacity: number;
    language: "th" | "en";
  };
}
```

Codex ปรับ schema ได้ แต่ต้องมี versioning และ validation

### 26.3 Save rules

บันทึกเมื่อ:

- activate checkpoint
- collect item
- complete level
- change settings
- return to menu
- page becomes hidden

### 26.4 Corruption handling

- parse ด้วย try/catch
- validate shape
- หากเสียหาย ให้สำรองค่าดิบไว้ใน key debug ชั่วคราวและเริ่ม save ใหม่
- UI ต้องมี “ลบข้อมูลการเล่น” พร้อม confirmation

### 26.5 Privacy

- ไม่มีข้อมูลส่วนบุคคล
- ไม่มี analytics ใน MVP เว้นแต่ผู้ใช้อนุมัติภายหลัง
- ไม่มี cookie tracking

---

## 27. Mobile landscape performance

### 27.1 Target

- 60 FPS บนอุปกรณ์มือถือระดับกลางที่ทันสมัย
- ไม่ต่ำกว่า 30 FPS บนอุปกรณ์ขั้นต่ำที่รองรับ
- frame pacing ต้องนิ่งกว่าเน้น visual effect จำนวนมาก

### 27.2 Budgets

เป้าหมายโดยประมาณ:

- initial download: ไม่เกิน 3 MB เมื่อทำได้
- asset ด่านโหลดแบบ lazy
- total compressed game size: ควรอยู่ประมาณ 25–45 MB หรือน้อยกว่า
- active textures ต่อด่านต้องจัดการไม่ให้ memory สูงเกินจำเป็น
- จำกัด simultaneous particles
- จำกัด enemy active พร้อมกันประมาณ 6–8 ตัว

### 27.3 Optimization rules

- ใช้ texture atlas
- ใช้ WebP/AVIF สำหรับ background
- ใช้ PNG/WebP transparency สำหรับ sprite ตามความเหมาะสม
- ใช้ compressed audio
- preload เฉพาะ asset ที่ต้องใช้
- unload asset ด่านเก่าเมื่อเข้า scene ใหม่หาก memory pressure สูง
- object pooling สำหรับ projectile/VFX
- หลีกเลี่ยง dynamic shadow หนัก
- parallax 3 ชั้นเป็นค่าเริ่มต้น และลดเหลือ 2 ชั้นใน low quality
- particle count scalable

### 27.4 Auto quality

ใน `auto` ให้ประเมินจาก:

- device memory หาก browser ให้ข้อมูล
- viewport size
- renderer
- FPS ช่วงเริ่มเกม

หาก FPS ต่ำต่อเนื่อง:

1. ลด particle
2. ลด foreground overlay
3. ลด parallax layer
4. ลด render resolution scale เล็กน้อย

ห้ามลด gameplay simulation rate

---

## 28. Accessibility and comfort

ต้องมี:

- subtitle สำหรับข้อความเนื้อเรื่อง
- ปิด screen shake
- ลด flash
- ปรับ music/sfx แยกกัน
- mute ทั้งหมด
- ปรับ opacity touch control
- ปุ่มใหญ่
- pause เมื่อ app เสีย focus
- readable Thai font stack
- ใช้ icon + text ไม่ใช้สีอย่างเดียวในสถานะสำคัญ

แนะนำ font stack:

```css
font-family: "Noto Sans Thai", "Leelawadee UI", Tahoma, sans-serif;
```

ไม่ควรโหลดฟอนต์จาก CDN runtime หากไม่จำเป็น หาก bundle ฟอนต์ต้องตรวจ license และขนาดไฟล์

---

## 29. Localization

เวอร์ชันแรกต้องมี:

- ภาษาไทยเป็นค่าเริ่มต้น
- ภาษาอังกฤษสำหรับเมนูและข้อความหลัก

เก็บข้อความใน data file แยกจาก scene code

ห้ามฝังข้อความในภาพ ยกเว้น element ตกแต่งที่ไม่มีความหมายเชิงข้อมูล แต่โดยหลักให้หลีกเลี่ยงทั้งหมด

---

## 30. Error handling

ต้องมี UI สำหรับ:

- โหลด asset ล้มเหลว
- browser ไม่รองรับ WebGL/Canvas
- save data เสียหาย
- audio ถูก block จนกว่าจะมี user gesture
- portrait orientation

ข้อความ error ต้องให้ผู้เล่น retry ได้ ไม่ใช่จอขาว

---

## 31. Testing requirements

### 31.1 Unit tests

อย่างน้อยทดสอบ:

- save serialization/validation
- progression unlock
- settings defaults
- collectible persistence
- damage/invulnerability timing logic หากแยกเป็น pure module

### 31.2 Integration smoke tests

ทดสอบ:

1. เปิดหน้าเกม
2. poster loading แสดง
3. เข้า main menu
4. เริ่มเกมใหม่
5. player เคลื่อนที่และกระโดดได้
6. pause/resume ได้
7. checkpoint บันทึก
8. refresh แล้วเล่นต่อได้
9. ผ่านด่านปลดล็อกด่านถัดไป
10. orientation overlay ทำงาน

### 31.3 Visual QA

ตรวจอย่างน้อย viewport:

- 1280×720 desktop
- 1920×1080 desktop
- 844×390 mobile landscape
- 740×360 mobile landscape
- 390×844 portrait overlay

### 31.4 Performance QA

- ตรวจ FPS ใน gameplay จริง
- ตรวจ memory หลังเปลี่ยนด่าน
- ตรวจว่า scene เก่าไม่ค้าง asset ซ้ำ
- ตรวจ touch latency
- ตรวจว่าปุ่ม multi-touch ทำงาน

### 31.5 Gameplay QA

- ทุก jump ผ่านได้โดยไม่ต้อง pixel-perfect
- บอสทุกตัวชนะได้ด้วยระบบพื้นฐาน
- ไม่มี soft lock
- respawn ไม่เกิดใน hazard
- collision ไม่ทำให้ผู้เล่นติดผนัง
- final boss จบและเข้าสู่ ending ได้เสมอ

---

## 32. Git workflow

เมื่อเริ่มพัฒนา:

- initialize git repository หากยังไม่มี
- branch หลักชื่อ `main`
- ใช้ feature branches สำหรับงานใหญ่
- commit ขนาดเล็กและมีความหมาย

รูปแบบ commit แนะนำ:

```text
feat: add mobile touch controls
feat: implement level 1 checkpoint flow
art: add generated hanuman combat atlas
perf: reduce level 2 particle count
fix: prevent dash from clipping through boss wall
```

ห้าม commit:

- secret
- token
- `.env.local`
- raw generated assets ที่ไม่ใช้และมีขนาดใหญ่มาก
- debug recordings
- temporary export files

ต้องมี `.gitignore` ที่เหมาะสม

---

## 33. GitHub publication

เมื่อเกมผ่าน Definition of Done:

1. ตรวจ repository clean
2. run lint
3. run tests
4. run production build
5. run local preview smoke test
6. ตรวจ README
7. commit final changes
8. push branch
9. เปิด pull request หาก workflow ใช้ PR
10. merge เข้า `main`

README ต้องมี:

- ภาพรวมเกม
- วิธีติดตั้ง
- วิธีรัน dev
- วิธี build
- วิธีเล่น
- controls
- โครงสร้างการสร้าง core visual assets
- นโยบาย third-party assets และ SFX
- local save behavior
- deployment note
- credit สำหรับ asset และเสียงที่สร้างใหม่
- attribution และ license ของ third-party assets จาก `THIRD_PARTY_NOTICES.md`

---

## 34. Vercel deployment

### 34.1 Project type

Static Vite project

### 34.2 Build configuration

- install command: package manager default
- build command: `npm run build` หรือ package manager ที่เลือก
- output directory: `dist`

### 34.3 `vercel.json`

สร้างเมื่อจำเป็นสำหรับ:

- SPA fallback
- cache headers สำหรับ hashed assets
- no-cache หรือ short cache สำหรับ `index.html`

หลักการ:

- hashed JS/CSS/image atlas cache ยาวแบบ immutable
- `index.html` ไม่ cache ยาวจน deploy ใหม่ไม่ปรากฏ

### 34.4 Deployment flow

หลัง push GitHub:

1. เชื่อม GitHub repository กับ Vercel
2. Vercel สร้าง preview deployment สำหรับ PR/branch
3. ทดสอบ preview URL บน desktop และมือถือ
4. merge `main`
5. deploy production
6. ตรวจ production URL
7. ตรวจ console error และ network error

### 34.5 Deployment acceptance

- เปิด URL production ได้
- refresh หน้าไม่ 404
- asset โหลดครบ
- localStorage ทำงาน
- HTTPS
- mobile touch control ทำงาน
- ไม่มี mixed content
- ไม่มี request ไปยังแหล่งภาพหรือเสียงภายนอก ทุก production asset ถูก bundle หรือ serve จาก deployment เดียวกัน
- third-party asset ทุกไฟล์มี license record และ attribution ครบ
- ไม่มี secret ใน client bundle

---

## 35. Development milestones

### Milestone 1 — Foundation

- repo setup
- Phaser boot
- responsive canvas
- orientation overlay
- input abstraction
- save system skeleton
- poster/loading prototype

Exit criteria:

- เปิดเกมได้บน desktop/mobile
- menu ใช้งานได้
- save settings ได้

### Milestone 2 — Visual pipeline

- art direction approved
- poster final
- Hanuman final sprite set
- enemy base sprites
- level 1 environment
- asset manifest

Exit criteria:

- ไม่มี placeholder ใน opening และ level 1 core path

### Milestone 3 — Core gameplay

- movement
- combat
- dash
- wind burst
- HUD
- damage/checkpoint

Exit criteria:

- sandbox arena เล่นสนุกและ stable

### Milestone 4 — Level 1

- complete level
- boss 1
- result
- progression

### Milestone 5 — Level 2

- environment
- hazards
- Matchanu boss
- narrative transition

### Milestone 6 — Level 3

- palace zones
- heart sequence
- Maiyarap final boss
- ending

### Milestone 7 — Mobile optimization

- touch tuning
- auto quality
- asset compression
- FPS audit
- orientation/focus handling

### Milestone 8 — Release

- tests
- QA
- GitHub push
- Vercel preview
- production deploy

ห้ามเริ่มระบบเสริมก่อน Milestone 6 เสร็จ

---

## 36. Definition of Done

เกมถือว่าเสร็จเมื่อครบทุกข้อ:

### Product

- เล่นครบ 3 ด่านได้
- มี opening poster คุณภาพสูง
- เนื้อเรื่องศึกไมยราพเข้าใจได้
- มี ending

### Gameplay

- movement responsive
- combat stable
- touch multi-input ทำงาน
- checkpoint ทำงาน
- boss ทั้ง 3 ชนะได้
- ไม่มี soft lock

### Art

- core visual assets ได้แก่ ตัวละคร ศัตรู บอส โปสเตอร์ key art ภาพฉาก และภาพเล่าเรื่อง สร้างใหม่ทั้งหมด
- supporting visual assets ที่นำมาจากภายนอกผ่านการตรวจ license และบันทึกใน manifest ครบ
- ไม่มี placeholder
- character consistency ผ่าน
- background และ sprite blend กัน
- poster ดูเหมือน key art ภาพยนตร์
- UI และ asset ฟรีที่นำมาใช้มีรูปแบบกลมกลืนกับเกมและไม่บดบังฉาก

### Mobile

- เล่น landscape ได้
- portrait overlay ทำงาน
- viewport 740×360 ใช้งานได้
- ปุ่มสัมผัสไม่ซ้อนกัน
- performance อยู่ในเป้าหมาย

### Save

- refresh แล้วความคืบหน้าไม่หาย
- checkpoint restore ได้
- settings restore ได้
- clear save ได้

### Audio and licensing

- เพลงประกอบเป็น original/generated ตามข้อกำหนด
- SFX บุคคลที่สามทุกไฟล์มีสิทธิ์ใช้และ redistribute ได้
- `docs/third-party-assets.md` และ `THIRD_PARTY_NOTICES.md` ครบถ้วน
- Credits แสดง attribution ตามที่ license กำหนด
- ไม่มี asset หรือเสียงที่สิทธิ์ไม่ชัดเจน

### Quality

- lint ผ่าน
- test ผ่าน
- production build ผ่าน
- ไม่มี console error สำคัญ
- ไม่มี broken asset
- ไม่มี request 404

### Release

- README ครบ
- asset manifest ครบ
- third-party notices และ license records ครบ
- pushed to GitHub
- Vercel production deployment ทำงาน

---

## 37. Final delivery checklist สำหรับ Codex

ก่อนส่งงาน Codex ต้องรายงาน:

1. GitHub repository/branch
2. production build result
3. test result
4. preview/production Vercel URL
5. browser/device viewports ที่ทดสอบ
6. average FPS โดยประมาณในแต่ละด่านบนอุปกรณ์ทดสอบ
7. รายการ core visual asset และตำแหน่ง generated asset manifest
8. รายการ third-party visual assets/SFX พร้อม license และตำแหน่ง `THIRD_PARTY_NOTICES.md`
9. known limitations
10. localStorage key และ schema version
11. intentional deviations จาก spec หากมี พร้อมเหตุผล

---

## 38. Priority rules เมื่อต้องตัด scope เพิ่ม

หากเวลาไม่พอ ให้ลดตามลำดับนี้:

1. ลดจำนวน frame animation แต่รักษาความ consistent
2. ลด collectible หรือเส้นทางลับ
3. ลดชนิด hazard
4. ลด cutscene และใช้ illustration + subtitle
5. reuse enemy 4 ชนิดด้วย palette/VFX variation
6. ลดเพลงเฉพาะด่าน

ห้ามตัด:

- opening poster quality
- 3 ด่านหลัก
- boss 3 ตัว
- mobile landscape controls
- save system
- core visual assets ต้องสร้างใหม่ตามข้อ 11.1
- license documentation สำหรับ third-party assets และ SFX
- GitHub/Vercel release readiness

---

## 39. One-sentence implementation brief

สร้างเกม Phaser + TypeScript แบบ side-scrolling จำนวน 3 ด่าน เรื่องหนุมานศึกไมยราพ โดยสร้างตัวละคร โปสเตอร์ key art และภาพฉากใหม่ทั้งหมด อนุญาตให้ใช้ supporting visual assets และ SFX ที่มี license ฟรีอย่างถูกต้องและกลมกลืนกับเกม มี opening key art แบบโปสเตอร์หนังแอ็กชัน เล่นมือถือแนวนอนได้ลื่นไหล บันทึกด้วย localStorage และพร้อม push GitHub เพื่อ deploy บน Vercel
