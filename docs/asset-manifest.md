# Generated Asset Manifest

Generated date: 2026-07-26  
Tool: OpenAI built-in Image Generation  
Art direction: `prompts/art-direction.md`

## Poster

| Runtime path | Purpose | Source resolution | Final | Transparency | Prompt |
|---|---|---:|---:|---|---|
| `public/assets/poster/opening-poster.webp` | preload/menu/ending key art | 1536×1024 | 1536×1024 WebP | no | `prompts/poster.md` |

Crop/pivot: cover within 16:9, focal point Hanuman left and Maiyarap right. Text and buttons remain code-native.

## Hanuman pose atlas

Runtime directory: `public/assets/characters/hanuman/poses/`

Poses: idle, run-a, run-b, jump, fall, dash, attack-1, attack-2, heavy, air-attack, hurt, victory. Source 4×3 atlas 1536×1024, chroma key removed and connected-component edge cleanup applied. Every runtime pose is padded to 460×380 RGBA for stable pivot/collision. Pivot `(0.5, 0.9)`; collision body tuned independently in code.

Prompt: `prompts/characters.md`

## Character roster

Runtime directory: `public/assets/characters/roster/poses/`

| File | Category | Purpose |
|---|---|---|
| `gatekeeper.png` | boss | Level 1 boss |
| `matchanu.png` | boss/character | Level 2 non-lethal boss |
| `maiyarap.png` | final boss | Level 3 boss |
| `rama.png` | story character | rescue/ending art |
| `yak-guard.png` | enemy | melee enemy |
| `yak-archer.png` | enemy | ranged enemy |
| `bat-spirit.png` | enemy | flying enemy |
| `shadow-mage.png` | enemy | magic enemy |

Source 4×2 atlas 1774×887, transparent cleanup and cell trimming. Prompt: `prompts/characters.md`

## Environments

| Runtime path | Level | Source/final | Transparency | Prompt |
|---|---|---|---|---|
| `public/assets/levels/level-01/background.webp` | รัตติกาลเหนือค่ายพระราม | 1536×1024 WebP | no | `prompts/environments.md` |
| `public/assets/levels/level-02/background.webp` | สระบัวแห่งมัจฉานุ | 1536×1024 WebP | no | `prompts/environments.md` |
| `public/assets/levels/level-03/background.webp` | พระนครบาดาล | 1536×1024 WebP | no | `prompts/environments.md` |

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

Prompt: `prompts/hostile-projectiles.md`. All four assets were generated separately with the built-in Image Generation tool, converted from a flat magenta chroma key to alpha, trimmed, resized for runtime use, and padded by 16 pixels.
