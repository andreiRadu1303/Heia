/**
 * Copy MapLibre's web worker into /public so we can serve it ourselves.
 *
 * Why: MapLibre resolves its worker URL from `import.meta.url`, which Next.js
 * rewrites to a path that doesn't exist — the request returns the HTML 404
 * page, the browser rejects it for having a non-JavaScript MIME type, and the
 * map silently never initialises ("Worker failed to load").
 *
 * Serving a known-good copy ourselves and pointing `setWorkerUrl` at it avoids
 * the bundler entirely. Runs on prebuild/postinstall so it tracks the
 * installed maplibre-gl version instead of drifting out of date.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs');
// Named .js rather than .mjs so every host serves it with a JS MIME type.
const destDir = join(root, 'public/maplibre');
const dest = join(destDir, 'maplibre-gl-worker.js');

try {
  mkdirSync(destDir, { recursive: true });
  copyFileSync(src, dest);
  console.log('[maplibre] worker copied to public/maplibre/maplibre-gl-worker.js');
} catch (err) {
  // Don't fail the build — the map degrades to "not loading", not a broken site.
  console.warn('[maplibre] could not copy worker:', err.message);
}
