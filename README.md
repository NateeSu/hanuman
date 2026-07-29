# หนุมาน: ศึกไมยราพ

เกมเว็บแอ็กชัน 2D แบบ side-scrolling จากตอน “ศึกไมยราพ” ในรามเกียรติ์ สร้างด้วย Phaser 3 + TypeScript สำหรับมือถือแนวนอนเป็นหลัก ภาพตัวละคร ฉาก โปสเตอร์ และวัตถุสำคัญทั้งหมดสร้างขึ้นใหม่สำหรับโครงการนี้

## ติดตั้งและรัน

ต้องใช้ Node.js 20 ขึ้นไป

```bash
npm install
npm run dev
```

เปิด `http://localhost:5173`

คำสั่งตรวจคุณภาพ:

```bash
npm run lint
npm run test
npm run build
npm run preview
```

ไฟล์ production อยู่ใน `dist/`

## วิธีเล่น

- เดิน: `A/D` หรือปุ่มลูกศรซ้าย/ขวา
- กระโดด/กระโดดสองชั้น: `Space`
- โจมตี: `J`
- พลังวายุรอบตัว: `K`
- พุ่งวายุ: `L` หรือ `Shift`
- หยุดเกม: `Escape`
- มือถือแนวนอน: ปุ่มซ้าย/ขวาและ Jump / Attack / Dash / Skill รองรับ multi-touch

ผู้เล่นต้องผ่าน 7 ด่านตามลำดับ ต่อสู้กับนายทวารรัตติกาล พญาคชสารเมฆา ทวารศิลาอัคนี นางพญามศกทมิฬ มัจฉานุ ขุนทัณฑ์เหล็ก และไมยราพ ด่าน 6 ต้องทำลายตราผนึกกรงเหล็ก 3 จุด ส่วนด่านสุดท้ายต้องทำลายผนึก 3 จุดและโจมตีดวงใจ 3 ครั้งก่อนเข้าศึกสุดท้าย

## ระบบบันทึก

บันทึกด้วย `localStorage` key `hanuman_maiyarap_save_v1`, schema version `1` และ content revision `2` เมื่อเปิด checkpoint เก็บตราพระราม จบด่าน เปลี่ยนการตั้งค่า หรือกลับเมนู ระบบจะย้ายความคืบหน้าจากโครงสร้าง 3 ด่านเดิมไปยังลำดับ 7 ด่านให้อัตโนมัติ หากข้อมูลเสียหาย ระบบเริ่มข้อมูลใหม่และสำรอง raw value ไว้ที่ `hanuman_maiyarap_save_v1_corrupt`

ไม่มีบัญชีผู้ใช้ analytics cookies หรือข้อมูลส่วนบุคคล

## โครงสร้าง

- `src/scenes/` — boot, preload, menu, 7 ด่าน, pause, result และ ending
- `src/entities/` — player, enemy และ boss
- `src/systems/` — touch input, combat timing และ progression
- `src/storage/` — save validation และ persistence
- `public/assets/` — generated production art ที่ optimize แล้ว
- `prompts/` — prompt และ art direction สำหรับสร้างภาพ
- `docs/asset-manifest.md` — ที่มา/metadata ของภาพสร้างใหม่

## ภาพและเสียง

Core visual assets ทั้งหมดเป็นงานสร้างใหม่ด้วย OpenAI Image Generation และผ่าน chroma-key cleanup/crop/optimization ด้วย `scripts/process_assets.py` และ `scripts/process_expansion_assets.py` ไม่มี third-party visual asset หรือ SFX

ดนตรีบรรยากาศและ SFX เป็น procedural Web Audio ที่เขียนขึ้นสำหรับเกมนี้ จึงไม่มีไฟล์เสียงภายนอกหรือ attribution เพิ่มเติม รายละเอียดอยู่ใน [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)

## Deployment

โปรเจกต์เป็น static Vite app:

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback และ cache headers กำหนดไว้ใน `vercel.json`

ดูขั้นตอน release ใน `docs/deployment.md`

## ข้อจำกัดที่ทราบ

- แอนิเมชันใช้ pose swap/tween จำนวน frame ต่ำตาม priority rule ของสเปก เพื่อรักษาความคงที่ของตัวละคร
- เพลงเป็น procedural ambient score เดียวที่เปลี่ยนบรรยากาศจากภาพและ gameplay แทนเพลงบันทึกแยกด่าน
- Browser automation ตรวจ flow หลักและเปิดทุกด่านผ่าน dev QA route; การรับรอง Safari iOS และ Android จริงยังต้องทำบนอุปกรณ์จริง

## License

โค้ดและงานศิลป์ยังไม่ได้ประกาศ public license ห้ามนำไปแจกจ่ายต่อโดยไม่ได้รับอนุญาตจากเจ้าของโครงการ
