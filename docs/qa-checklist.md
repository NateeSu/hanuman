# QA Checklist

## Automated

- [x] save serialization/default/corruption tests
- [x] progression unlock/rating tests
- [x] seven-level definition/order tests
- [x] three-level save migration tests
- [x] terrain coverage for all seven levels
- [x] seven bosses use seven distinct projectile/effect identities
- [x] all boss display heights are at least 2× the tallest normal enemy
- [x] all 21 boss idle/cast/strike pose assets exist and pass minimum-size checks
- [x] boss projectile direction, speed, and homing motion tests
- [x] invulnerability timing test
- [x] ESLint
- [x] TypeScript production build

## Browser smoke

- [x] poster and main menu render
- [x] New Game enters Level 1
- [x] pause/resume overlay
- [x] seven-level select renders and locks progression correctly
- [x] Level 2 พญาคชสารเมฆา renders with cyan aura and tusk projectile
- [x] Level 3 ทวารศิลาอัคนี renders with orange aura and magma projectile
- [x] Level 4 นางพญามศกทมิฬ renders with pink aura and lotus projectile
- [x] Level 6 ขุนทัณฑ์เหล็ก renders with green-gold aura and chain projectile
- [x] Level 7 loads with heart-sequence objects
- [x] Gatekeeper renders a cast pose and fiery rotating shield disc
- [x] Matchanu renders cast/strike silhouettes and cyan tidal trident
- [x] Maiyarap renders staff strike and lime-violet homing hypnosis orb
- [x] Akkhani renders a two-fist magma slam pose
- [x] boss scale remains readable without overlapping the HUD
- [x] no console error or asset 404
- [x] 1280×720 desktop
- [x] 844×390 mobile landscape
- [x] 390×844 portrait orientation overlay

## Manual device pass still recommended

- [ ] Safari iOS current on a physical device
- [ ] Chrome Android current on a physical device
- [ ] 30-minute thermal/performance run
- [ ] simultaneous multi-touch on two representative phones
