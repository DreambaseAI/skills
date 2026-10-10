import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const script = fileURLToPath(new URL('./industrial-ring.mjs', import.meta.url));
for (const mode of ['ring', 'ruler']) {
  const result = spawnSync(process.execPath, [script, mode, '{}'], {encoding:'utf8'});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /<svg/);
  assert.doesNotMatch(result.stdout, /NaN|Infinity/);
}
for (const [mode, cfg] of [['ruler',{count:1}],['ruler',{progress:2}],['ruler',{count:100000}],['ring',{ticks:{count:100000}}],['ring',{nodes:[{angle:'bad'}]}],['ring',{bg:'" onload="bad'}],['ring',{arc:{sweep:100000}}]]) {
  const result = spawnSync(process.execPath, [script, mode, JSON.stringify(cfg)], {encoding:'utf8'});
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, '');
}
const label = spawnSync(process.execPath, [script, 'ring', JSON.stringify({nodes:[{angle:0,label:'x--y<&'}]})], {encoding:'utf8'});
assert.equal(label.status, 0, label.stderr);
assert.doesNotMatch(label.stdout, /<!-- node: /);
assert.match(label.stdout, /X--Y&lt;&amp;/);
console.log('Ring/ruler configuration regression tests passed');
