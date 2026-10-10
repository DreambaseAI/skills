import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const generator = fileURLToPath(new URL('./industrial-mesh.mjs', import.meta.url));
for (const share of [1, 0.75]) {
  const config = {
    segments: share === 1 ? 1 : [{ share }, { share: 1 - share }],
    depth: 0, rotate: { x: 0, y: 0, z: 0 }, perspective: 0,
    grain: 0, glow: false, gapDeg: 0, fill: 'hybrid', grid: { radial: 6 },
  };
  const result = spawnSync(process.execPath, [generator, 'donut', JSON.stringify(config)], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout, /NaN|Infinity/);
  const face = result.stdout.match(/<g>\s*<path d="([^"]+)"/);
  assert.ok(face, 'Expected filled annular face');
  const samples = [...face[1].matchAll(/-?\d+(?:\.\d+)? -?\d+(?:\.\d+)?/g)];
  const expected = 2 * (Math.max(3, Math.ceil(360 * share / 6)) + 1);
  assert.equal(samples.length, expected, 'Both arc directions must retain angular resolution');
}
for (const config of [null, [], {segments: 0}, {segments: [null]}, {segments: [{share: 0}]}, {innerR: 500}, {grid: {rings: 1000}}, {perspective: 10}, {bg: '" onload="alert(1)'}]) {
  const result = spawnSync(process.execPath, [generator, 'donut', JSON.stringify(config)], { encoding: 'utf8' });
  assert.notEqual(result.status, 0, 'Invalid config must fail');
  assert.equal(result.stdout, '', 'Invalid config must not emit SVG');
}
console.log('Reverse-arc and invalid-configuration regression tests passed');
