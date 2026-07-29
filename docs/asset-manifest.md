# Generated Asset Manifest

Generated date: 2026-07-28
Tool: OpenAI built-in Image Generation  
Art direction: `prompts/art-direction.md`

## Poster

| Runtime path | Purpose | Source resolution | Final | Transparency | Prompt |
|---|---|---:|---:|---|---|
| `public/assets/poster/opening-poster.webp` | preload/menu/ending key art | 1536×1024 | 1536×1024 WebP | no | `prompts/poster.md` |

Crop/pivot: cover within 16:9, focal point Hanuman left and Maiyarap right. Text and buttons remain code-native.

## Developer family logo

| Runtime path | Purpose | Source resolution | Final | Transparency | Prompt |
|---|---|---:|---:|---|---|
| `public/assets/ui/branding/developer-father-son-logo.png` | Father-and-son portrait on the dedicated developer scene | 1536×1536 | 1536×1536 PNG | no | Identity-preserving circular hand-painted portrait from the supplied family photo |

The Thai credit remains code-native for crisp rendering at every game scale: `พัฒนาเกมส์โดยพ่อน๊อตและน้องเปรม`. The generated emblem uses a midnight-teal square field that blends into the dedicated scene.

## Hanuman pose atlas

Runtime directory: `public/assets/characters/hanuman/poses/`

Poses: idle, run-a, run-b, jump, fall, dash, attack-1, attack-2, heavy, air-attack, hurt, victory. Source 4×3 atlas 1536×1024, chroma key removed and connected-component edge cleanup applied. Every runtime pose is padded to 460×380 RGBA for stable pivot/collision. Pivot `(0.5, 0.9)`; collision body tuned independently in code.

Prompt: `prompts/characters.md`

## Character roster

Runtime directory: `public/assets/characters/roster/poses/`

| File | Category | Purpose |
|---|---|---|
| `gatekeeper.png` | boss | Level 1 boss |
| `khotchasan.png` | boss | Level 2 boss, bright cyan-blue elephant armor |
| `akkhani.png` | boss | Level 3 boss, emissive orange magma stone |
| `masaka.png` | boss | Level 4 boss, luminous pink-violet wings |
| `matchanu.png` | boss/character | Level 5 non-lethal boss |
| `than-lek.png` | boss | Level 6 boss, gold-green ritual chains |
| `maiyarap.png` | final boss | Level 7 boss |
| `rama.png` | story character | rescue/ending art |
| `yak-guard.png` | enemy | melee enemy |
| `yak-archer.png` | enemy | ranged enemy |
| `bat-spirit.png` | enemy | flying enemy |
| `shadow-mage.png` | enemy | magic enemy |

Source 4×2 atlas 1774×887, transparent cleanup and cell trimming. Prompt: `prompts/characters.md`

### Boss combat pose sets

Every boss has a normalized three-pose WebP set named `{boss}-idle.webp`, `{boss}-cast.webp`, and `{boss}-strike.webp`. The seven sets cover Gatekeeper, Khotchasan, Akkhani, Masaka, Matchanu, Than Lek, and Maiyarap (21 runtime images total). Each set keeps a stable bottom-aligned pivot while changing the silhouette for telegraph, release, charge, and slam attacks.

The source sheets were generated as identity-preserving two-pose sprite edits with the built-in Image Generation tool: a cast/windup pose on the left and a strike/release pose on the right, on a flat chroma background with no text or watermark. `scripts/process_boss_poses.py` removes the keyed background, splits the sheets, trims alpha, and normalizes idle/cast/strike frames onto one canvas per boss.

## Environments

| Runtime path | Level | Source/final | Transparency | Prompt |
|---|---|---|---|---|
| `public/assets/levels/level-01/background.webp` | รัตติกาลเหนือค่ายพระราม | 1536×1024 WebP | no | `prompts/environments.md` |
| `public/assets/levels/level-02/background.webp` | ช่องผาคชสารคลั่ง | 1536×1024 WebP | no | `docs/level-expansion-concept.md` |
| `public/assets/levels/level-03/background.webp` | ภูผากระทบอัคนี | 1536×1024 WebP | no | `docs/level-expansion-concept.md` |
| `public/assets/levels/level-04/background.webp` | พงไพรมศกอสูร | 1536×1024 WebP | no | `docs/level-expansion-concept.md` |
| `public/assets/levels/level-05/background.webp` | สระบัวแห่งมัจฉานุ | 1536×1024 WebP | no | `prompts/environments.md` |
| `public/assets/levels/level-06/background.webp` | ดงตาลกรงเหล็ก | 1536×1024 WebP | no | `docs/level-expansion-concept.md` |
| `public/assets/levels/level-07/background.webp` | พระนครบาดาล | 1536×1024 WebP | no | `prompts/environments.md` |

Gameplay uses invisible collision geometry aligned to the visible ground silhouettes. Backgrounds are repeated as long horizontal rooms; all core scene imagery is generated, not stock.

## Gameplay objects

Runtime directory: `public/assets/ui/objects/`

Objects: Rama seal, checkpoint, dash wall, sleep mist urn, heart reliquary, heart seal, blade trap, exit portal. Source 4×2 atlas 1536×1024; chroma-key cleanup and trim applied. Prompt: `prompts/ui-vfx.md`.

## Processing

`scripts/process_assets.py` performs:

1. atlas cell extraction;
2. alpha connected-component cleanup;
3. fixed-canvas alignment for Hanuman poses;
4. optimized PNG output;
5. WebP background compression.

`scripts/process_expansion_assets.py` processes the four expansion backgrounds, removes boss/projectile chroma keys, preserves emissive edge color, and fits every transparent asset to a stable runtime canvas.

`scripts/process_boss_poses.py` produces the 21 bottom-aligned boss pose WebPs used for runtime attack animation.

Raw generated/chroma files are intentionally excluded from version control.

## Trishula ultimate

| Runtime path | Purpose | Source resolution | Final | Transparency | Prompt |
|---|---|---:|---:|---|---|
| `public/assets/ui/vfx/trishula-ultimate.png` | Returning circular ultimate projectile | 1776×887 | 1755×443 PNG | yes | `prompts/trishula-ultimate.md` |

The generated chroma-key source is converted to alpha, tightly trimmed, and padded by 24 pixels. Circular sigils, weapon afterimages, sparks, impact rings, and the homing return path are rendered procedurally in Phaser around this production sprite.

## Hostile projectiles

Runtime directory: `public/assets/projectiles/`

| File | Source enemy | Purpose | Transparency |
|---|---|---|---|
| `yak-arrow.png` | Yak archer | Fast physical arrow with a visible aim line | yes |
| `mage-orb.png` | Shadow Mage | Slower green cursed orb | yes |
| `bat-bolt.png` | Bat Spirit | Mid-speed blue-violet crescent bolt | yes |
| `boss-wave.png` | Bosses / Maiyarap palette | Ground-hugging jumpable shockwave | yes |
| `shield-disc.png` | Gatekeeper | Rotating fiery bronze shield disc | yes |
| `tusk-wave.png` | พญาคชสารเมฆา | Cyan crescent tusk pressure wave | yes |
| `magma-boulder.png` | ทวารศิลาอัคนี | Orange molten boulder with sparks | yes |
| `lotus-stinger.png` | นางพญามศกทมิฬ | Pink-violet lotus stinger lance | yes |
| `tidal-trident.png` | Matchanu | Fast cyan triple-crested tidal trident | yes |
| `chain-sigil.png` | ขุนทัณฑ์เหล็ก | Green-gold binding chain seal | yes |
| `hypnosis-orb.png` | Maiyarap | Homing lime-violet occult eye orb | yes |

Prompt: `prompts/hostile-projectiles.md`, the approved expansion concept, and identity-specific old-boss projectile prompts. All eleven assets were generated separately with the built-in Image Generation tool, converted from a flat chroma key to alpha, trimmed, resized for runtime use, and padded for clean emissive edges.
