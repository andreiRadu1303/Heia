/**
 * Copy MapLibre's web worker into public/ so it is served same-origin.
 *
 * MapLibre creates its worker with `new URL('maplibre-gl-worker.mjs',
 * import.meta.url)`, which Next.js's bundler does not emit as a file, so the
 * browser gets a 404 HTML page and the map never renders. `_map-base.tsx`
 * points `setWorkerUrl()` at this copy instead. Runs on `npm install`
 * (postinstall) so the copy always matches the installed maplibre-gl version.
 */
const fs = require('node:fs');
const path = require('node:path');

const src = path.join(__dirname, '..', 'node_modules', 'maplibre-gl', 'dist', 'maplibre-gl-worker.mjs');
const dest = path.join(__dirname, '..', 'public', 'maplibre-gl-worker.mjs');

if (!fs.existsSync(src)) {
  console.warn('[copy-maplibre-worker] maplibre-gl not installed; skipping.');
  process.exit(0);
}
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log('[copy-maplibre-worker] copied to public/maplibre-gl-worker.mjs');
