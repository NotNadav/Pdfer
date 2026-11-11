import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('../app.js', import.meta.url), 'utf8');

function stub() {
  const f = function () {};
  return new Proxy(f, {
    get: (_, k) => (k === Symbol.toPrimitive ? () => '' : stub()),
    apply: () => stub(),
    construct: () => stub(),
    set: () => true,
  });
}

const ctx = vm.createContext({
  PDFLib: { PDFDocument: stub(), degrees: a => ({ angle: a }), rgb: (r, g, b) => ({ r, g, b }) },
  pdfjsLib: { GlobalWorkerOptions: {} },
  JSZip: stub(),
  document: stub(),
  window: stub(),
  location: { hash: '' },
  Node: class {},
  URL,
  setTimeout,
  clearTimeout,
  structuredClone,
  console,
});
vm.runInContext(src, ctx, { filename: 'app.js' });

const run = expr => JSON.parse(vm.runInContext(`JSON.stringify(${expr})`, ctx) ?? 'null');

test('app.js loads without a browser', () => {
  assert.equal(run('typeof parseRanges'), 'function');
});

test('parseRanges accepts valid input', () => {
  assert.deepEqual(run('parseRanges("1-3", 5)'), [[0, 1, 2]]);
  assert.deepEqual(run('parseRanges("2, 4", 5)'), [[1], [3]]);
  assert.deepEqual(run('parseRanges("1 - 3", 5)'), [[0, 1, 2]]);
  assert.deepEqual(run('parseRanges("-2", 5)'), [[0, 1]]);
  assert.deepEqual(run('parseRanges("4-", 5)'), [[3, 4]]);
  assert.deepEqual(run('parseRanges("1;5", 5)'), [[0], [4]]);
  assert.deepEqual(run('parseRanges("", 5)'), []);
});

test('parseRanges rejects bad input', () => {
  for (const s of ['0', '6', '3-1', '-', 'abc', '1-x', '2-9', '1.5']) assert.equal(run(`parseRanges(${JSON.stringify(s)}, 5)`), null, s);
});

test('toRanges compresses consecutive pages', () => {
  assert.equal(run('toRanges([0, 1, 2, 4, 6, 7])'), '1-3, 5, 7-8');
  assert.equal(run('toRanges([3])'), '4');
  assert.equal(run('toRanges([])'), '');
});

test('ranges round trip', () => {
  assert.deepEqual(run('parseRanges(toRanges([0, 1, 2, 4, 6, 7]), 10).flat()'), [0, 1, 2, 4, 6, 7]);
});

test('small helpers', () => {
  assert.equal(run('norm(-90)'), 270);
  assert.equal(run('norm(450)'), 90);
  assert.equal(run('norm(0)'), 0);
  assert.equal(run('baseName("a.b.pdf")'), 'a.b');
  assert.equal(run('baseName("noext")'), 'noext');
  assert.equal(run('fmtSize(500)'), '500 B');
  assert.equal(run('fmtSize(2048)'), '2 KB');
  assert.equal(run('fmtSize(1572864)'), '1.5 MB');
  assert.equal(run('hexA("#ff0000", 0.5)'), '#ff000080');
  assert.equal(run('sum([1, 2, 3])'), 6);
  assert.deepEqual(run('hexToRgb("#ff8000")'), { r: 1, g: 128 / 255, b: 0 });
});

test('isRTL looks at the first letter', () => {
  assert.equal(run('isRTL("שלום")'), true);
  assert.equal(run('isRTL("123 שלום")'), true);
  assert.equal(run('isRTL("hello")'), false);
  assert.equal(run('isRTL("hi שלום")'), false);
  assert.equal(run('isRTL("")'), false);
  assert.equal(run('isRTL("123")'), false);
});

test('moveItem reorders in place', () => {
  assert.deepEqual(run('(() => { const a = [1, 2, 3, 4]; moveItem(a, 0, 2); return a; })()'), [2, 3, 1, 4]);
  assert.deepEqual(run('(() => { const a = [1, 2, 3, 4]; moveItem(a, 3, 0); return a; })()'), [4, 1, 2, 3]);
});

function jpeg(le, orientation) {
  const tiff = le
    ? [0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x12, 0x01, 0x03, 0x00, 0x01, 0x00, 0x00, 0x00, orientation, 0x00, 0x00, 0x00]
    : [0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08, 0x00, 0x01, 0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, orientation, 0x00, 0x00];
  const body = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, ...tiff];
  const len = body.length + 2;
  return [0xff, 0xd8, 0xff, 0xe1, len >> 8, len & 255, ...body, 0xff, 0xda, 0x00, 0x02];
}

test('jpegOrientation reads EXIF in both byte orders', () => {
  assert.equal(run(`jpegOrientation(new Uint8Array(${JSON.stringify(jpeg(true, 6))}))`), 6);
  assert.equal(run(`jpegOrientation(new Uint8Array(${JSON.stringify(jpeg(false, 3))}))`), 3);
});

test('jpegOrientation is safe on non-JPEG and truncated data', () => {
  assert.equal(run('jpegOrientation(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))'), 0);
  assert.equal(run('jpegOrientation(new Uint8Array([0xff, 0xd8]))'), 0);
  assert.equal(run(`jpegOrientation(new Uint8Array(${JSON.stringify(jpeg(true, 6).slice(0, 12))}))`), 0);
});

const page = rot => `({ getCropBox: () => ({ x: 10, y: 20, width: 100, height: 200 }), getRotation: () => ({ angle: ${rot} }) })`;

test('pageGeom swaps width and height for rotated pages', () => {
  assert.deepEqual(run(`(() => { const g = pageGeom(${page(0)}); return [g.r, g.w, g.h]; })()`), [0, 100, 200]);
  assert.deepEqual(run(`(() => { const g = pageGeom(${page(90)}); return [g.r, g.w, g.h]; })()`), [90, 200, 100]);
  assert.deepEqual(run(`(() => { const g = pageGeom(${page(-90)}); return [g.r, g.w, g.h]; })()`), [270, 200, 100]);
});

test('pageGeom maps screen corners to PDF coordinates', () => {
  assert.deepEqual(run(`pageGeom(${page(0)}).map(0, 0)`), [10, 220]);
  assert.deepEqual(run(`pageGeom(${page(0)}).map(100, 200)`), [110, 20]);
  assert.deepEqual(run(`pageGeom(${page(90)}).map(0, 0)`), [10, 20]);
  assert.deepEqual(run(`pageGeom(${page(180)}).map(0, 0)`), [110, 20]);
  assert.deepEqual(run(`pageGeom(${page(270)}).map(0, 0)`), [110, 220]);
});

test('numPos places page numbers inside the margins', () => {
  assert.deepEqual(run('numPos(600, 800, 50, 20, "bc", 10)'), [300, 770]);
  assert.deepEqual(run('numPos(600, 800, 50, 20, "tl", 10)'), [45, 30]);
  assert.deepEqual(run('numPos(600, 800, 50, 20, "br", 20)'), [539, 754]);
});

test('splitGroups modes', () => {
  vm.runInContext('S.pages = [{}, {}, {}, {}, {}]', ctx);
  vm.runInContext('S.opt = { mode: "every" }', ctx);
  assert.deepEqual(run('splitGroups()'), [[0], [1], [2], [3], [4]]);
  vm.runInContext('S.opt = { mode: "chunk", chunk: 2 }', ctx);
  assert.deepEqual(run('splitGroups()'), [[0, 1], [2, 3], [4]]);
  vm.runInContext('S.opt = { mode: "chunk", chunk: 0 }', ctx);
  assert.deepEqual(run('splitGroups()'), [[0], [1], [2], [3], [4]]);
  vm.runInContext('S.opt = { mode: "ranges", ranges: "1-2, 5" }', ctx);
  assert.deepEqual(run('splitGroups()'), [[0, 1], [4]]);
  vm.runInContext('S.opt = { mode: "ranges", ranges: "9" }', ctx);
  assert.equal(run('splitGroups()'), null);
});
