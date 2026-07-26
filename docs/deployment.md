# Deployment

## Vercel

1. Run `npm ci`.
2. Run `npm run lint && npm run test && npm run build`.
3. Import the GitHub repository into Vercel as a Vite project.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Test the preview URL at 1280×720, 844×390, 740×360, and 390×844.
7. Merge to `main` and verify the production URL.

`vercel.json` provides SPA fallback, immutable cache headers for hashed assets, and no-cache for `index.html`.

## Release checks

- refresh does not return 404
- HTTPS is active
- no external asset/audio request
- no mixed content
- localStorage checkpoint survives refresh
- touch controls are visible on coarse-pointer landscape devices
- portrait overlay pauses gameplay
