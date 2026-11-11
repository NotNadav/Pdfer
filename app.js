const { PDFDocument, degrees, rgb } = PDFLib;
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const ICONS = {
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  merge: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  split: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  reorder: '<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
  rotR: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  rotL: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  edit: '<path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>',
  hash: '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
  shrink: '<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  images: '<path d="M18 22H4a2 2 0 0 1-2-2V6"/><path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18"/><circle cx="12" cy="8" r="2"/><rect width="16" height="16" x="6" y="2" rx="2"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  pointer: '<path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/>',
  type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
  square: '<rect width="18" height="18" x="3" y="3" rx="2"/>',
  highlighter: '<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',
  pen: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
  undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
};

const GROUPS = [['org', 'ארגון עמודים'], ['edit', 'עריכה ושיפור'], ['convert', 'המרה']];
const COLORS = ['#6d4aff', '#e5484d', '#12a594', '#f76b15', '#0090ff', '#d6409f', '#8e4ec6', '#46a758'];
const INK_COLORS = ['#1d1a26', '#1f4fd1', '#e5484d', '#12a594', '#6d4aff'];
const COVER_COLORS = ['#ffffff', '#1d1a26', '#f3f1f8'];
const MARK_COLORS = ['#ffd23f', '#7ee08a', '#ff9ec7', '#8fd3ff'];

const S = { tool: null, files: [], pages: [], opt: {}, view: 0, ui: {}, ed: null, result: null, busy: false };

const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 10);
const norm = a => ((a % 360) + 360) % 360;
const sum = a => a.reduce((x, y) => x + y, 0);
const baseName = n => n.replace(/\.[^.]+$/, '');
const fmtSize = b => b < 1024 ? `${b} B` : b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`;
const tick = () => new Promise(r => setTimeout(r));
const count = k => S.pages.filter(p => p[k]).length;
const hexA = (hex, a) => hex + Math.round(a * 255).toString(16).padStart(2, '0');

function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}

function icon(name, size = 18) {
  const t = document.createElement('template');
  t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  return t.content.firstChild;
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function isRTL(s) {
  const m = s.match(/[A-Za-zÀ-ɏ֐-׿؀-ۿ]/);
  return !!m && /[֐-ۿ]/.test(m[0]);
}

function moveItem(arr, from, to) {
  const [x] = arr.splice(from, 1);
  arr.splice(to, 0, x);
}

function parseRanges(str, n) {
  const parts = str.replace(/\s*-\s*/g, '-').split(/[,;\s]+/).filter(Boolean);
  const groups = [];
  for (const part of parts) {
    let a, b;
    const m = part.match(/^(\d*)-(\d*)$/);
    if (m) {
      if (!m[1] && !m[2]) return null;
      a = m[1] ? +m[1] : 1;
      b = m[2] ? +m[2] : n;
    } else if (/^\d+$/.test(part)) a = b = +part;
    else return null;
    if (a < 1 || b > n || a > b) return null;
    const g = [];
    for (let i = a; i <= b; i++) g.push(i - 1);
    groups.push(g);
  }
  return groups;
}

function toRanges(ix) {
  const out = [];
  for (let i = 0; i < ix.length;) {
    let j = i;
    while (j + 1 < ix.length && ix[j + 1] === ix[j] + 1) j++;
    out.push(i === j ? `${ix[i] + 1}` : `${ix[i] + 1}-${ix[j] + 1}`);
    i = j + 1;
  }
  return out.join(', ');
}

function canvas(w, hgt) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(hgt));
  return c;
}

function canvasBlob(c, type = 'image/png', q = 0.92) {
  return new Promise((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('toBlob'))), type, q));
}

async function canvasBytes(c, type, q) {
  return new Uint8Array(await (await canvasBlob(c, type, q)).arrayBuffer());
}

function download(data, name) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 20000);
}

function done(data, name) {
  download(data, name);
  toast(`הקובץ מוכן: ${name}`, 'ok');
}

function toast(msg, kind) {
  let w = $('.toasts');
  if (!w) {
    w = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
    document.body.append(w);
  }
  const t = h('div', { class: `toast${kind ? ' ' + kind : ''}` }, msg);
  w.append(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 320);
  }, 4000);
}

function setBusy(text) {
  S.busy = !!text;
  let el = $('#busy');
  if (!text) return el?.remove();
  if (!el) {
    el = h('div', { id: 'busy', class: 'busy' }, h('div', { class: 'busy-card' }, h('span', { class: 'spin' }), h('span', { class: 'busy-text' })));
    document.body.append(el);
  }
  el.querySelector('.busy-text').textContent = text;
}

async function progress(text) {
  setBusy(text);
  await tick();
}

const libDoc = f => PDFDocument.load(f.bytes, { ignoreEncryption: true });

async function pagesToPdf(list, src) {
  src ||= await libDoc(S.files[0]);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, list.map(p => p.index));
  copied.forEach((pg, i) => {
    const r = norm(list[i].rot || 0);
    if (r) pg.setRotation(degrees(norm(pg.getRotation().angle + r)));
    out.addPage(pg);
  });
  return out.save();
}

function pageGeom(page) {
  const box = page.getCropBox();
  const r = norm(page.getRotation().angle);
  const W = box.width, H = box.height;
  const map = (x, y) =>
    r === 0 ? [box.x + x, box.y + H - y]
    : r === 90 ? [box.x + y, box.y + x]
    : r === 180 ? [box.x + W - x, box.y + y]
    : [box.x + W - y, box.y + H - x];
  return { r, w: r % 180 ? H : W, h: r % 180 ? W : H, map };
}

function placeAt(g, cx, cy, w, hgt, angle = 0) {
  const [px, py] = g.map(cx, cy);
  const t = ((g.r + angle) * Math.PI) / 180;
  const c = Math.cos(t), s = Math.sin(t);
  return { x: px - (w / 2) * c + (hgt / 2) * s, y: py - (w / 2) * s - (hgt / 2) * c, width: w, height: hgt, rotate: degrees(g.r + angle) };
}

const fontOf = (size, bold) => `${bold ? 700 : 400} ${size}px Heebo, sans-serif`;
let measureCtx;

function measure(text, size, bold) {
  measureCtx ||= document.createElement('canvas').getContext('2d');
  measureCtx.font = fontOf(size, bold);
  const lines = text.split('\n');
  return { w: Math.max(1, ...lines.map(l => measureCtx.measureText(l).width)), h: lines.length * size * 1.25, lines };
}

async function textImage(text, { size, color, bold = false }) {
  await document.fonts.load(fontOf(size, bold), text).catch(() => {});
  const k = 4;
  const m = measure(text, size, bold);
  const c = canvas(m.w * k + 2, m.h * k + 2);
  const ctx = c.getContext('2d');
  ctx.scale(k, k);
  ctx.font = fontOf(size, bold);
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  const rtl = isRTL(text);
  ctx.direction = rtl ? 'rtl' : 'ltr';
  ctx.textAlign = rtl ? 'right' : 'left';
  const lh = size * 1.25;
  m.lines.forEach((l, i) => ctx.fillText(l, rtl ? m.w : 0, lh * i + lh / 2));
  return { bytes: await canvasBytes(c, 'image/png'), w: m.w, h: m.h };
}

function jpegOrientation(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return 0;
  let o = 2;
  while (o + 4 < b.length) {
    if (b[o] !== 0xff) return 0;
    const m = b[o + 1], len = (b[o + 2] << 8) | b[o + 3];
    if (m === 0xe1 && b[o + 4] === 0x45 && b[o + 5] === 0x78 && b[o + 6] === 0x69 && b[o + 7] === 0x66) {
      const t = o + 10, le = b[t] === 0x49;
      const r16 = p => (le ? b[p] | (b[p + 1] << 8) : (b[p] << 8) | b[p + 1]);
      const r32 = p => (le ? (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24)) >>> 0 : ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0);
      const ifd = t + r32(t + 4), n = r16(ifd);
      for (let i = 0; i < n; i++) {
        const e = ifd + 2 + i * 12;
        if (r16(e) === 0x0112) return r16(e + 8);
      }
      return 0;
    }
    if (m === 0xda) return 0;
    o += 2 + len;
  }
  return 0;
}

async function prepareImage(file) {
  const raw = new Uint8Array(await file.arrayBuffer());
  const blob = new Blob([raw], { type: file.type });
  const bmp = await createImageBitmap(blob);
  const iw = bmp.width, ih = bmp.height;
  let bytes = raw, kind;
  if (file.type === 'image/png') kind = 'png';
  else if (file.type === 'image/jpeg' && jpegOrientation(raw) <= 1) kind = 'jpg';
  else {
    const c = canvas(iw, ih);
    c.getContext('2d').drawImage(bmp, 0, 0);
    kind = file.type === 'image/jpeg' ? 'jpg' : 'png';
    bytes = await canvasBytes(c, kind === 'jpg' ? 'image/jpeg' : 'image/png', 0.92);
  }
  bmp.close?.();
  return { bytes, kind, iw, ih, url: URL.createObjectURL(blob) };
}

async function embedImage(doc, im) {
  try {
    return im.kind === 'jpg' ? await doc.embedJpg(im.bytes) : await doc.embedPng(im.bytes);
  } catch {
    const bmp = await createImageBitmap(new Blob([im.bytes]));
    const c = canvas(bmp.width, bmp.height);
    c.getContext('2d').drawImage(bmp, 0, 0);
    return doc.embedPng(await canvasBytes(c, 'image/png'));
  }
}

async function pageCanvas(file, index, scale) {
  const page = await file.pdf.getPage(index + 1);
  let vp = page.getViewport({ scale });
  const big = Math.max(vp.width, vp.height);
  if (big > 6000) vp = page.getViewport({ scale: (scale * 6000) / big });
  const c = canvas(vp.width, vp.height);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  return c;
}

async function paintSheet(sheet, page, scale, stale) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const vp = page.getViewport({ scale: scale * dpr });
  const c = canvas(vp.width, vp.height);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  if (stale()) return false;
  const v = page.getViewport({ scale: 1 });
  sheet.style.width = `${v.width * scale}px`;
  sheet.style.height = `${v.height * scale}px`;
  sheet.querySelector('canvas')?.remove();
  sheet.prepend(c);
  return true;
}

const thumbReady = new Map();
const thumbPending = new Map();
let thumbChain = Promise.resolve();
let io;

function observer() {
  io ||= new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) {
      io.unobserve(e.target);
      loadThumb(e.target);
    }
  }, { rootMargin: '400px' });
  return io;
}

function setThumb(img, file, index) {
  const k = `${file.id}:${index}`;
  img.dataset.k = k;
  if (thumbReady.has(k)) return (img.src = thumbReady.get(k));
  img._file = file;
  img._index = index;
  observer().observe(img);
}

function loadThumb(img) {
  const k = img.dataset.k;
  if (!thumbPending.has(k)) {
    thumbChain = thumbChain
      .then(async () => {
        const page = await img._file.pdf.getPage(img._index + 1);
        const v = page.getViewport({ scale: 1 });
        const c = await pageCanvas(img._file, img._index, 280 / Math.max(v.width, v.height));
        return c.toDataURL('image/jpeg', 0.82);
      })
      .then(url => (thumbReady.set(k, url), url), () => (thumbPending.delete(k), ''));
    thumbPending.set(k, thumbChain);
  }
  thumbPending.get(k).then(url => {
    if (url && img.dataset.k === k) img.src = url;
  });
}

function field(label, control, hint) {
  return h('div', { class: 'fld' }, h('span', { class: 'label' }, label), control, hint && h('span', { class: 'hint' }, hint));
}

function seg(opts, v, set) {
  const w = h('div', { class: 'seg', role: 'group' });
  for (const [val, label] of opts) {
    const b = h('button', { type: 'button', 'aria-pressed': String(val === v) }, label);
    b.onclick = () => {
      w.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      set(val);
    };
    w.append(b);
  }
  return w;
}

function numInput(v, min, max, set) {
  const i = h('input', { class: 'field', type: 'number', min, max, value: v, dir: 'ltr', inputmode: 'numeric' });
  i.oninput = () => {
    const n = +i.value;
    if (i.value !== '' && Number.isFinite(n)) set(Math.min(max, Math.max(min, n)));
  };
  return i;
}

function textInput(v, ph, set, dir = 'auto') {
  const i = h('input', { class: 'field', type: 'text', value: v, placeholder: ph, dir });
  i.oninput = () => set(i.value);
  return i;
}

function rangeInput(v, min, max, step, set) {
  const i = h('input', { type: 'range', min, max, step, value: v });
  i.oninput = () => set(+i.value);
  return i;
}

function check(label, v, set) {
  const i = h('input', { type: 'checkbox', checked: v });
  i.onchange = () => set(i.checked);
  return h('label', { class: 'check' }, i, h('span', null, label));
}

function swatches(v, list, set) {
  const w = h('div', { class: 'swatches' });
  const pick = h('input', { class: 'color', type: 'color', value: v, title: 'צבע אחר', 'aria-label': 'צבע אחר' });
  const mark = c => w.querySelectorAll('.sw').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.c === c)));
  for (const c of list) {
    const b = h('button', { class: 'sw', type: 'button', title: c, 'aria-label': c, 'aria-pressed': String(c === v.toLowerCase()) });
    b.dataset.c = c;
    b.style.background = c;
    b.onclick = () => {
      mark(c);
      pick.value = c;
      set(c);
    };
    w.append(b);
  }
  pick.oninput = () => {
    mark(pick.value);
    set(pick.value);
  };
  w.append(pick);
  return w;
}

function btn(label, ic, fn, cls = '') {
  return h('button', { class: `btn btn-outline ${cls}`, type: 'button', onclick: fn }, ic && icon(ic, 16), label);
}

const note = t => h('p', { class: 'note' }, t);

function miniBtn(ic, label, fn, disabled) {
  return h('button', { class: 'mini-btn', type: 'button', title: label, 'aria-label': label, disabled, onclick: fn }, icon(ic, 16));
}

function moveBtns(i, n, move) {
  return h('span', { class: 'mini-row' },
    miniBtn('chevR', 'הזזה אחורה', () => move(i, i - 1), i === 0),
    miniBtn('chevL', 'הזזה קדימה', () => move(i, i + 1), i === n - 1));
}

let dragFrom = null;

function makeSortable(el, i, onMove) {
  el.draggable = true;
  el.addEventListener('dragstart', e => {
    dragFrom = i;
    el.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  });
  el.addEventListener('dragend', () => {
    dragFrom = null;
    el.classList.remove('dragging');
    document.querySelectorAll('.drop-target').forEach(x => x.classList.remove('drop-target'));
  });
  el.addEventListener('dragover', e => {
    if (dragFrom === null) return;
    e.preventDefault();
    el.classList.add('drop-target');
  });
  el.addEventListener('dragleave', () => el.classList.remove('drop-target'));
  el.addEventListener('drop', e => {
    if (dragFrom === null) return;
    e.preventDefault();
    e.stopPropagation();
    const from = dragFrom;
    dragFrom = null;
    el.classList.remove('drop-target');
    if (from !== i) onMove(from, i);
  });
}

function pageGrid({ onClick, decorate, onMove, tools } = {}) {
  const f = S.files[0];
  const grid = h('div', { class: 'pages' });
  S.ui.decorate = decorate;
  S.ui.cards = S.pages.map((p, i) => {
    const img = h('img', { alt: `עמוד ${p.index + 1}`, draggable: 'false' });
    const card = h('div', { class: 'pg', tabindex: onClick ? '0' : null, role: onClick ? 'button' : null },
      h('div', { class: 'pg-thumb' }, img),
      h('span', { class: 'pg-check' }, icon('check', 14)),
      h('span', { class: 'pg-del' }, icon('trash', 13)),
      h('span', { class: 'pg-badge' }),
      h('div', { class: 'pg-foot' }, h('span', { class: 'pg-num' }, String(p.index + 1)), tools && tools(p, i)));
    card._img = img;
    setThumb(img, f, p.index);
    if (onClick) {
      card.addEventListener('click', e => !e.target.closest('button') && onClick(p, i));
      card.addEventListener('keydown', e => {
        if (e.target === card && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(p, i);
        }
      });
    }
    if (onMove) makeSortable(card, i, onMove);
    grid.append(card);
    return card;
  });
  updateCards();
  return grid;
}

function updateCards() {
  const t = TOOLS[S.tool];
  const ctx = t.ctx?.();
  (S.ui.cards || []).forEach((c, i) => {
    const p = S.pages[i];
    c._img.style.transform = p.rot ? `rotate(${p.rot}deg)` : '';
    S.ui.decorate?.(c, p, i, ctx);
  });
}

function fileGrid() {
  const t = TOOLS[S.tool];
  const grid = h('div', { class: 'files' });
  const move = (a, b) => {
    moveItem(S.files, a, b);
    renderStage();
    renderFoot();
  };
  S.files.forEach((f, i) => {
    const img = h('img', { alt: '', draggable: 'false' });
    if (f.url) img.src = f.url;
    else setThumb(img, f, 0);
    const remove = () => {
      releaseFile(S.files.splice(i, 1)[0]);
      if (!S.files.length) return render();
      renderStage();
      renderFoot();
    };
    const card = h('div', { class: 'pg fc' },
      h('div', { class: 'pg-thumb' }, img),
      h('span', { class: 'pg-badge' }, String(i + 1)),
      h('button', { class: 'fc-x', type: 'button', title: 'הסרה', 'aria-label': `הסרת ${f.name}`, onclick: remove }, icon('x', 14)),
      h('div', { class: 'fc-name', dir: 'auto', title: f.name }, f.name),
      h('div', { class: 'pg-foot' }, h('span', null, f.n != null ? `${f.n} עמ׳ · ${fmtSize(f.size)}` : `${f.iw}×${f.ih}`), moveBtns(i, S.files.length, move)));
    makeSortable(card, i, move);
    grid.append(card);
  });
  grid.append(h('button', { class: 'add-card', type: 'button', onclick: pickFiles }, icon('plus', 24), t.accept === 'image' ? 'הוספת תמונות' : 'הוספת קבצים'));
  return grid;
}

function toggleKey(p, k) {
  p[k] = !p[k];
  afterSel();
}

function afterSel() {
  updateCards();
  syncSel();
  if (TOOLS[S.tool].livePanel) renderPanel();
  else renderFoot();
}

const selected = k => S.pages.map((p, j) => (p[k] ? j : -1)).filter(j => j >= 0);

function selField(label, k) {
  const i = h('input', { class: 'field', type: 'text', dir: 'ltr', placeholder: 'לדוגמה: 1-3, 7', value: toRanges(selected(k)) });
  i.oninput = () => {
    const g = parseRanges(i.value, S.pages.length);
    i.classList.toggle('bad', !g);
    if (!g) return;
    const set = new Set(g.flat());
    S.pages.forEach((p, j) => (p[k] = set.has(j)));
    updateCards();
    renderFoot();
  };
  S.ui.selInput = { i, k };
  return field(label, i, 'אפשר גם פשוט ללחוץ על העמודים');
}

function syncSel() {
  const s = S.ui.selInput;
  if (!s || document.activeElement === s.i) return;
  s.i.value = toRanges(selected(s.k));
  s.i.classList.remove('bad');
}

function selButtons(k) {
  const set = fn => () => {
    S.pages.forEach((p, j) => (p[k] = fn(p, j)));
    afterSel();
  };
  return h('div', { class: 'row' }, btn('הכול', null, set(() => true)), btn('ניקוי', null, set(() => false)), btn('היפוך', null, set(p => !p[k])));
}

function pagerEl(get, n, set) {
  const label = h('span', { class: 'pager-label' });
  const prev = miniBtn('chevR', 'עמוד קודם', null);
  const next = miniBtn('chevL', 'עמוד הבא', null);
  const sync = () => {
    const i = get();
    label.textContent = `עמוד ${i + 1} מתוך ${n}`;
    prev.disabled = i <= 0;
    next.disabled = i >= n - 1;
  };
  prev.onclick = () => (set(get() - 1), sync());
  next.onclick = () => (set(get() + 1), sync());
  sync();
  return h('div', { class: 'pager' }, prev, label, next);
}

function previewStage(draw) {
  const sheet = h('div', { class: 'sheet' });
  const ov = h('div', { class: 'overlay' });
  sheet.append(ov);
  const wrap = h('div', { class: 'pv-wrap' }, sheet);
  S.ui.pv = { sheet, ov, wrap, draw, tok: 0 };
  requestAnimationFrame(renderPreview);
  return [wrap, S.pages.length > 1 && pagerEl(() => S.view, S.pages.length, i => { S.view = i; renderPreview(); })];
}

async function renderPreview() {
  const pv = S.ui.pv;
  if (!pv || !pv.wrap.isConnected) return;
  const tok = ++pv.tok;
  const page = await S.files[0].pdf.getPage(S.view + 1);
  if (tok !== pv.tok) return;
  const v = page.getViewport({ scale: 1 });
  const scale = Math.min((pv.wrap.clientWidth - 4) / v.width, (window.innerHeight * 0.74) / v.height, 2);
  if (!(await paintSheet(pv.sheet, page, scale, () => tok !== pv.tok))) return;
  Object.assign(pv, { w: v.width, h: v.height, scale });
  pv.draw();
}

function ovText(text, cx, cy, size, color, opacity, angle, bold, s) {
  const d = h('div', { class: 'ov-text', dir: 'auto' }, text);
  Object.assign(d.style, {
    left: `${cx * s}px`,
    top: `${cy * s}px`,
    fontSize: `${size * s}px`,
    color,
    opacity,
    fontWeight: bold ? 700 : 400,
    transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
  });
  return d;
}

function numberText(i) {
  const o = S.opt, n = S.pages.length, skip = o.skipFirst ? 1 : 0;
  if (skip && i === 0) return null;
  const k = o.start + i - skip, total = o.start + n - 1 - skip;
  return o.fmt === 'n' ? String(k) : o.fmt === 'nN' ? `${k} / ${total}` : `עמוד ${k} מתוך ${total}`;
}

function numPos(W, H, w, hgt, pos, size) {
  const m = Math.max(20, size * 1.8);
  const x = pos[1] === 'l' ? m + w / 2 : pos[1] === 'r' ? W - m - w / 2 : W / 2;
  const y = pos[0] === 't' ? m + hgt / 2 : H - m - hgt / 2;
  return [x, y];
}

function drawNumbers() {
  const pv = S.ui.pv, o = S.opt;
  if (!pv?.scale) return;
  pv.ov.replaceChildren();
  const text = numberText(S.view);
  if (!text) return;
  const m = measure(text, o.size, false);
  const [cx, cy] = numPos(pv.w, pv.h, m.w, m.h, o.pos, o.size);
  pv.ov.append(ovText(text, cx, cy, o.size, o.color, 1, 0, false, pv.scale));
}

const POS_LABELS = { tl: 'למעלה משמאל', tc: 'למעלה באמצע', tr: 'למעלה מימין', bl: 'למטה משמאל', bc: 'למטה באמצע', br: 'למטה מימין' };

function posPicker(v, set) {
  const wrap = h('div', { class: 'pos-pick', dir: 'ltr', role: 'group', 'aria-label': 'מיקום' });
  for (const row of [['tl', 'tc', 'tr'], ['bl', 'bc', 'br']]) {
    const r = h('div');
    for (const p of row) {
      const b = h('button', { type: 'button', title: POS_LABELS[p], 'aria-label': POS_LABELS[p], 'aria-pressed': String(p === v) }, h('i'));
      b.onclick = () => {
        wrap.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        set(p);
      };
      r.append(b);
    }
    wrap.append(r);
  }
  return wrap;
}

function splitGroups() {
  const n = S.pages.length, o = S.opt;
  if (o.mode === 'every') return S.pages.map((_, i) => [i]);
  if (o.mode === 'chunk') {
    const k = Math.max(1, Math.floor(o.chunk) || 1), out = [];
    for (let i = 0; i < n; i += k) out.push(Array.from({ length: Math.min(k, n - i) }, (_, j) => i + j));
    return out;
  }
  return parseRanges(o.ranges, n);
}

const ED_TOOLS = [['select', 'בחירה', 'pointer'], ['text', 'טקסט', 'type'], ['image', 'תמונה', 'image'], ['cover', 'כיסוי', 'square'], ['mark', 'הדגשה', 'highlighter'], ['ink', 'ציור וחתימה', 'pen']];
const ED_HINTS = {
  select: 'לחצו על פריט כדי לבחור ולגרור אותו. לחיצה כפולה על טקסט פותחת אותו לעריכה, ו-Delete מוחק.',
  text: 'לחצו על הדף במקום שבו הטקסט צריך להופיע, והתחילו להקליד.',
  cover: 'גררו מלבן על אזור שתרצו להסתיר. הכיסוי מסתיר מהעין בלבד: הטקסט המקורי עדיין קיים בקובץ.',
  mark: 'גררו על הדף כדי להדגיש אזור, כמו עם מרקר.',
  ink: 'ציירו או חתמו ישירות על הדף, עם העכבר או עם האצבע.',
};

function newEd() {
  return {
    page: 0, els: [], tool: 'select', sel: null, editing: null, scale: 1, pw: 0, ph: 0, tok: 0, lastTap: null,
    style: { size: 18, color: '#1d1a26', bold: false, inkColor: '#1f4fd1', inkWidth: 2.5, coverColor: '#ffffff', markColor: '#ffd23f' },
  };
}

const edEl = id => S.ed.els.find(e => e.id === id);
const edNode = id => S.ui.ed?.layer.querySelector(`[data-id="${id}"]`);

function edStage() {
  const E = S.ed;
  const bar = h('div', { class: 'ed-bar', role: 'toolbar' }, ED_TOOLS.map(([id, label, ic]) => {
    const b = h('button', { type: 'button', title: label, 'aria-pressed': String(E.tool === id) }, icon(ic, 17), h('span', null, label));
    b.dataset.tool = id;
    b.onclick = () => (id === 'image' ? edPickImage() : edSetTool(id));
    return b;
  }));
  const layer = h('div', { class: 'ed-layer' });
  layer.dataset.tool = E.tool;
  const sheet = h('div', { class: 'sheet' }, layer);
  const wrap = h('div', { class: 'ed-wrap' }, sheet);
  S.ui.ed = { bar, sheet, layer, wrap };
  layer.addEventListener('pointerdown', edDown);
  layer.addEventListener('dblclick', e => {
    const d = e.target.closest('.el-text');
    if (d) edEditText(d);
  });
  requestAnimationFrame(edRender);
  return [bar, wrap, S.pages.length > 1 && pagerEl(() => E.page, S.pages.length, i => {
    edCommitText();
    E.page = i;
    E.sel = null;
    edRender();
    renderPanel();
  })];
}

async function edRender() {
  const E = S.ed, ui = S.ui.ed;
  if (!ui || !ui.wrap.isConnected) return;
  const tok = ++E.tok;
  const page = await S.files[0].pdf.getPage(E.page + 1);
  if (tok !== E.tok) return;
  const v = page.getViewport({ scale: 1 });
  const scale = Math.min(Math.max(200, ui.wrap.clientWidth - 4) / v.width, 2);
  if (!(await paintSheet(ui.sheet, page, scale, () => tok !== E.tok))) return;
  Object.assign(E, { scale, pw: v.width, ph: v.height });
  edDraw();
}

function pathD(pts) {
  if (pts.length === 1) return `M${pts[0][0]} ${pts[0][1]}l0.01 0`;
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join('');
}

function placeNode(d, e, s) {
  d.style.left = `${e.x * s}px`;
  d.style.top = `${e.y * s}px`;
  if (e.type !== 'text') {
    d.style.width = `${e.w * s}px`;
    d.style.height = `${e.h * s}px`;
  }
}

function elNode(e) {
  const E = S.ed, s = E.scale;
  const d = h('div', { class: `el el-${e.type}${E.sel === e.id ? ' is-sel' : ''}${e.blend ? ' is-mark' : ''}` });
  d.dataset.id = e.id;
  placeNode(d, e, s);
  if (e.type === 'text') {
    d.textContent = e.text;
    d.dir = 'auto';
    Object.assign(d.style, { fontSize: `${e.size * s}px`, color: e.color, fontWeight: e.bold ? 700 : 400 });
  } else if (e.type === 'rect') d.style.background = hexA(e.color, e.opacity);
  else if (e.type === 'image') d.append(h('img', { src: e.url, alt: '', draggable: 'false' }));
  else if (e.type === 'ink')
    d.innerHTML = `<svg viewBox="0 0 ${e.vw} ${e.vh}" preserveAspectRatio="none"><path d="${pathD(e.pts)}" fill="none" stroke="${e.color}" stroke-width="${e.width * s}" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`;
  if (E.sel === e.id) d.append(h('span', { class: 'h-resize' }));
  return d;
}

function edDraw() {
  const E = S.ed, ui = S.ui.ed;
  if (!ui) return;
  ui.layer.replaceChildren(...E.els.filter(e => e.page === E.page).map(elNode));
}

function edSetTool(id) {
  const E = S.ed;
  edCommitText();
  E.tool = id;
  S.ui.ed.layer.dataset.tool = id;
  S.ui.ed.bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === id)));
  if (id !== 'select') edSelect(null, true);
  renderPanel();
}

function edSelect(id, quiet) {
  const E = S.ed;
  if (E.sel === id) return;
  E.sel = id;
  S.ui.ed?.layer.querySelectorAll('.el').forEach(n => {
    const on = n.dataset.id === id;
    n.classList.toggle('is-sel', on);
    const hd = n.querySelector(':scope > .h-resize');
    if (on && !hd && E.editing !== id) n.append(h('span', { class: 'h-resize' }));
    if (!on && hd) hd.remove();
  });
  if (!quiet) renderPanel();
}

function ptOf(ev) {
  const r = S.ui.ed.layer.getBoundingClientRect(), s = S.ed.scale;
  return { x: (ev.clientX - r.left) / s, y: (ev.clientY - r.top) / s };
}

function drag(ev, onMove, onUp) {
  ev.preventDefault();
  const up = e => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
    onUp?.(e);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
}

function edDown(ev) {
  if (ev.button !== 0) return;
  const E = S.ed, pt = ptOf(ev);
  const d = ev.target.closest('.el');
  const el = d && edEl(d.dataset.id);
  if (E.editing && el && el.id === E.editing) return;
  edCommitText();
  if (ev.target.closest('.h-resize') && el) return startResize(ev, el, d);
  if (E.tool === 'ink') return startInk(ev, pt);
  if (E.tool === 'cover' || E.tool === 'mark') return startRect(ev, pt);
  if (el) {
    edSelect(el.id);
    return startMove(ev, el, d, pt);
  }
  if (E.tool === 'text') {
    ev.preventDefault();
    return edAddText(pt);
  }
  edSelect(null);
}

function startMove(ev, el, d, p0) {
  const E = S.ed, x0 = el.x, y0 = el.y, now = Date.now();
  const dbl = E.lastTap && E.lastTap.id === el.id && now - E.lastTap.t < 350;
  E.lastTap = { id: el.id, t: now };
  let moved = false;
  drag(ev, e => {
    const p = ptOf(e);
    if (!moved && Math.hypot(p.x - p0.x, p.y - p0.y) * E.scale < 3) return;
    moved = true;
    el.x = x0 + p.x - p0.x;
    el.y = y0 + p.y - p0.y;
    placeNode(d, el, E.scale);
  }, () => {
    if (!moved && dbl && el.type === 'text') edEditText(d);
  });
}

function startResize(ev, el, d) {
  const s = S.ed.scale, p0 = ptOf(ev);
  const w0 = el.type === 'text' ? d.offsetWidth / s : el.w;
  const h0 = el.type === 'text' ? d.offsetHeight / s : el.h;
  const size0 = el.size;
  drag(ev, e => {
    const p = ptOf(e);
    const w = Math.max(6, w0 + p.x - p0.x);
    if (el.type === 'text') {
      el.size = Math.max(4, Math.round(((size0 * w) / w0) * 10) / 10);
      d.style.fontSize = `${el.size * s}px`;
      return;
    }
    el.w = w;
    el.h = el.type === 'image' ? (w * h0) / w0 : Math.max(4, h0 + p.y - p0.y);
    placeNode(d, el, s);
  }, () => renderPanel());
}

function startRect(ev, p0) {
  const E = S.ed, mark = E.tool === 'mark';
  const el = { id: uid(), page: E.page, type: 'rect', x: p0.x, y: p0.y, w: 0, h: 0, color: mark ? E.style.markColor : E.style.coverColor, opacity: mark ? 0.5 : 1, blend: mark };
  E.els.push(el);
  const d = elNode(el);
  S.ui.ed.layer.append(d);
  drag(ev, e => {
    const p = ptOf(e);
    el.x = Math.min(p0.x, p.x);
    el.y = Math.min(p0.y, p.y);
    el.w = Math.abs(p.x - p0.x);
    el.h = Math.abs(p.y - p0.y);
    placeNode(d, el, E.scale);
  }, () => {
    if (el.w * E.scale < 4 || el.h * E.scale < 4) {
      E.els.splice(E.els.indexOf(el), 1);
      d.remove();
      return;
    }
    edSelect(el.id);
  });
}

function startInk(ev, p0) {
  const E = S.ed, st = E.style, NS = 'http://www.w3.org/2000/svg';
  const pts = [[p0.x, p0.y]];
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'ink-live');
  svg.setAttribute('viewBox', `0 0 ${E.pw} ${E.ph}`);
  const path = document.createElementNS(NS, 'path');
  Object.entries({ fill: 'none', stroke: st.inkColor, 'stroke-width': st.inkWidth, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: pathD(pts) }).forEach(([k, v]) => path.setAttribute(k, v));
  svg.append(path);
  S.ui.ed.layer.append(svg);
  drag(ev, e => {
    for (const ce of e.getCoalescedEvents?.() || [e]) {
      const p = ptOf(ce);
      pts.push([p.x, p.y]);
    }
    path.setAttribute('d', pathD(pts));
  }, () => {
    svg.remove();
    const pad = st.inkWidth;
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x = Math.min(...xs) - pad, y = Math.min(...ys) - pad;
    const vw = Math.max(...xs) - x + pad, vh = Math.max(...ys) - y + pad;
    const el = { id: uid(), page: E.page, type: 'ink', x, y, w: vw, h: vh, vw, vh, pts: pts.map(([a, b]) => [a - x, b - y]), color: st.inkColor, width: st.inkWidth };
    E.els.push(el);
    S.ui.ed.layer.append(elNode(el));
    renderFoot();
  });
}

function edAddText(pt) {
  const E = S.ed, st = E.style;
  const el = { id: uid(), page: E.page, type: 'text', text: '', x: pt.x, y: pt.y - st.size * 0.625, size: st.size, color: st.color, bold: st.bold };
  E.els.push(el);
  const d = elNode(el);
  S.ui.ed.layer.append(d);
  el.x = pt.x - d.offsetWidth / E.scale;
  placeNode(d, el, E.scale);
  edSelect(el.id, true);
  edEditText(d);
  renderPanel();
}

function edEditText(d) {
  const E = S.ed, el = edEl(d.dataset.id);
  if (!el || E.editing === el.id) return;
  edCommitText();
  E.editing = el.id;
  edSelect(el.id, true);
  d.querySelector('.h-resize')?.remove();
  d.classList.add('editing');
  try {
    d.contentEditable = 'plaintext-only';
  } catch {}
  if (d.contentEditable !== 'plaintext-only') d.contentEditable = 'true';
  const s = E.scale, right = el.x + d.offsetWidth / s;
  d.oninput = () => {
    el.text = d.innerText.replace(/\n$/, '');
    if (!el.text || isRTL(el.text)) {
      el.x = right - d.offsetWidth / s;
      placeNode(d, el, s);
    }
  };
  d.onkeydown = e => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      e.preventDefault();
      d.blur();
    }
  };
  d.onblur = () => edCommitText();
  d.focus();
  const r = document.createRange();
  r.selectNodeContents(d);
  const sel = getSelection();
  sel.removeAllRanges();
  sel.addRange(r);
}

function edCommitText() {
  const E = S.ed;
  if (!E?.editing) return;
  const id = E.editing, el = edEl(id), d = edNode(id);
  E.editing = null;
  if (d) {
    d.removeAttribute('contenteditable');
    d.classList.remove('editing');
    d.oninput = d.onkeydown = d.onblur = null;
  }
  if (el && !el.text.trim()) {
    E.els.splice(E.els.indexOf(el), 1);
    d?.remove();
    if (E.sel === id) E.sel = null;
    return renderPanel();
  }
  if (d && el) {
    d.textContent = el.text;
    if (E.sel === id) d.append(h('span', { class: 'h-resize' }));
  }
  renderFoot();
}

function edPickImage() {
  const inp = h('input', { type: 'file', accept: 'image/*' });
  inp.onchange = async () => {
    const f = inp.files[0];
    if (!f) return;
    try {
      const im = await prepareImage(f);
      const E = S.ed;
      const w = Math.min(E.pw * 0.4, im.iw * 0.75), hh = (w * im.ih) / im.iw;
      const el = { ...im, id: uid(), page: E.page, type: 'image', x: (E.pw - w) / 2, y: (E.ph - hh) / 2, w, h: hh };
      E.els.push(el);
      edSetTool('select');
      S.ui.ed.layer.append(elNode(el));
      edSelect(el.id);
    } catch {
      toast('לא הצלחנו לקרוא את התמונה');
    }
  };
  inp.click();
}

function edDelete() {
  const E = S.ed;
  E.els = E.els.filter(e => e.id !== E.sel);
  E.sel = null;
  edDraw();
  renderPanel();
}

function edDup() {
  const E = S.ed, src = edEl(E.sel);
  if (!src) return;
  const el = { ...src, id: uid(), x: src.x + 14, y: src.y + 14, pts: src.pts?.map(p => [...p]) };
  E.els.push(el);
  E.sel = el.id;
  edDraw();
  renderPanel();
}

function edPanel() {
  const E = S.ed, st = E.style, el = edEl(E.sel);
  const live = () => edDraw();
  if (!el) {
    const out = [note(ED_HINTS[E.tool])];
    if (E.tool === 'select' || E.tool === 'text') out.push(
      h('div', { class: 'sub-h' }, 'עיצוב לטקסט חדש'),
      field('גודל', numInput(st.size, 4, 200, v => (st.size = v))),
      field('צבע', swatches(st.color, INK_COLORS, v => (st.color = v))),
      check('מודגש', st.bold, v => (st.bold = v)));
    if (E.tool === 'ink') out.push(
      field('צבע', swatches(st.inkColor, INK_COLORS, v => (st.inkColor = v))),
      field('עובי קו', rangeInput(st.inkWidth, 1, 10, 0.5, v => (st.inkWidth = v))));
    if (E.tool === 'cover') out.push(field('צבע הכיסוי', swatches(st.coverColor, COVER_COLORS, v => (st.coverColor = v))));
    if (E.tool === 'mark') out.push(field('צבע ההדגשה', swatches(st.markColor, MARK_COLORS, v => (st.markColor = v))));
    return out;
  }
  const out = [h('div', { class: 'sub-h' }, { text: 'טקסט נבחר', image: 'תמונה נבחרת', rect: el.blend ? 'הדגשה נבחרת' : 'כיסוי נבחר', ink: 'ציור נבחר' }[el.type])];
  if (el.type === 'text') out.push(
    field('גודל', numInput(el.size, 4, 200, v => { el.size = st.size = v; live(); })),
    field('צבע', swatches(el.color, INK_COLORS, v => { el.color = st.color = v; live(); })),
    check('מודגש', el.bold, v => { el.bold = st.bold = v; live(); }),
    btn('עריכת הטקסט', 'type', () => { const d = edNode(el.id); if (d) edEditText(d); }));
  if (el.type === 'rect') out.push(
    field('צבע', swatches(el.color, el.blend ? MARK_COLORS : COVER_COLORS, v => { el.color = v; el.blend ? (st.markColor = v) : (st.coverColor = v); live(); })),
    field('אטימות', rangeInput(el.opacity, 0.1, 1, 0.05, v => { el.opacity = v; live(); })));
  if (el.type === 'ink') out.push(
    field('צבע', swatches(el.color, INK_COLORS, v => { el.color = st.inkColor = v; live(); })),
    field('עובי קו', rangeInput(el.width, 1, 10, 0.5, v => { el.width = st.inkWidth = v; live(); })));
  out.push(h('div', { class: 'row' }, btn('שכפול', 'copy', edDup), btn('מחיקה', 'trash', edDelete, 'danger')));
  return out;
}

async function inkImage(e) {
  const k = 4, sx = e.w / e.vw, sy = e.h / e.vh;
  const c = canvas(e.w * k, e.h * k);
  const ctx = c.getContext('2d');
  ctx.lineCap = ctx.lineJoin = 'round';
  ctx.strokeStyle = e.color;
  ctx.lineWidth = e.width * k;
  ctx.beginPath();
  e.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * sx * k, y * sy * k) : ctx.moveTo(x * sx * k, y * sy * k)));
  if (e.pts.length === 1) ctx.lineTo(e.pts[0][0] * sx * k + 0.01, e.pts[0][1] * sy * k);
  ctx.stroke();
  return canvasBytes(c, 'image/png');
}

async function edExport() {
  edCommitText();
  const f = S.files[0], doc = await libDoc(f), pages = doc.getPages(), els = S.ed.els;
  for (const [i, e] of els.entries()) {
    await progress(`מחיל שינויים ${i + 1} מתוך ${els.length}…`);
    const page = pages[e.page], g = pageGeom(page);
    if (e.type === 'rect') {
      page.drawRectangle({
        ...placeAt(g, e.x + e.w / 2, e.y + e.h / 2, e.w, e.h),
        color: hexToRgb(e.color),
        opacity: e.opacity,
        borderWidth: 0,
        ...(e.blend && PDFLib.BlendMode ? { blendMode: PDFLib.BlendMode.Multiply } : {}),
      });
      continue;
    }
    let img, w = e.w, hh = e.h;
    if (e.type === 'image') img = await embedImage(doc, e);
    else if (e.type === 'ink') img = await doc.embedPng(await inkImage(e));
    else {
      const t = await textImage(e.text, { size: e.size, color: e.color, bold: e.bold });
      img = await doc.embedPng(t.bytes);
      w = t.w;
      hh = t.h;
    }
    page.drawImage(img, placeAt(g, e.x + w / 2, e.y + hh / 2, w, hh));
  }
  done(await doc.save(), `${baseName(f.name)}-edited.pdf`);
}

const TOOLS = {
  merge: {
    name: 'מיזוג', group: 'org', icon: 'merge', multi: true, action: 'מיזוג והורדה',
    desc: 'איחוד כמה קובצי PDF לקובץ אחד, בסדר שתבחרו.',
    stage: fileGrid,
    panel: () => note('גררו את הקבצים כדי לקבוע את הסדר. הקובץ הראשון (מימין למעלה) יופיע ראשון.'),
    summary: () => `${S.files.length} קבצים · ${sum(S.files.map(f => f.n))} עמודים`,
    ready: () => S.files.length >= 2 || 'צריך לפחות שני קבצים כדי למזג',
    async run() {
      const out = await PDFDocument.create();
      for (const [i, f] of S.files.entries()) {
        await progress(`ממזג קובץ ${i + 1} מתוך ${S.files.length}…`);
        const src = await libDoc(f);
        (await out.copyPages(src, src.getPageIndices())).forEach(p => out.addPage(p));
      }
      done(await out.save(), `${baseName(S.files[0].name)}-merged.pdf`);
    },
  },

  split: {
    name: 'פיצול', group: 'org', icon: 'split', action: 'פיצול והורדה',
    desc: 'חלוקת קובץ לכמה קבצים: כל עמוד בנפרד, כל כמה עמודים או לפי טווחים.',
    defaults: { mode: 'every', chunk: 2, ranges: '' },
    stage: () => pageGrid({
      decorate: (c, p, i, groupOf) => {
        const g = groupOf[i];
        c.classList.toggle('is-off', g < 0);
        c.classList.toggle('grp', g >= 0);
        c.style.setProperty('--g', COLORS[Math.max(0, g) % COLORS.length]);
        c.querySelector('.pg-badge').textContent = g >= 0 ? `קובץ ${g + 1}` : '';
      },
    }),
    ctx() {
      const groupOf = S.pages.map(() => -1);
      (splitGroups() || []).forEach((g, gi) => g.forEach(i => groupOf[i] < 0 && (groupOf[i] = gi)));
      return groupOf;
    },
    panel() {
      const o = S.opt, upd = () => (updateCards(), renderFoot());
      return [
        field('איך לפצל', seg([['every', 'כל עמוד'], ['chunk', 'כל N עמודים'], ['ranges', 'טווחים']], o.mode, v => { o.mode = v; renderPanel(); updateCards(); })),
        o.mode === 'chunk' && field('כמה עמודים בכל קובץ', numInput(o.chunk, 1, S.pages.length, v => { o.chunk = v; upd(); })),
        o.mode === 'ranges' && field('טווחים', textInput(o.ranges, 'לדוגמה: 1-3, 4, 5-8', v => { o.ranges = v; upd(); }, 'ltr'), 'כל טווח שמופרד בפסיק יהפוך לקובץ נפרד'),
      ];
    },
    summary() {
      const g = splitGroups();
      return g && g.length ? `ייווצרו ${g.length} קבצים` : null;
    },
    ready() {
      const g = splitGroups();
      if (!g) return 'הטווחים לא תקינים';
      if (!g.length) return 'הקלידו טווחי עמודים';
      if (g.length === 1 && g[0].length === S.pages.length) return 'ככה הקובץ לא יתפצל';
      return true;
    },
    async run() {
      const f = S.files[0], groups = splitGroups(), base = baseName(f.name);
      const src = await libDoc(f);
      const make = async g => {
        const out = await PDFDocument.create();
        (await out.copyPages(src, g)).forEach(p => out.addPage(p));
        return out.save();
      };
      if (groups.length === 1) return done(await make(groups[0]), `${base}-part.pdf`);
      const zip = new JSZip(), pad = String(groups.length).length;
      for (const [i, g] of groups.entries()) {
        await progress(`יוצר קובץ ${i + 1} מתוך ${groups.length}…`);
        zip.file(`${base}-${String(i + 1).padStart(pad, '0')}.pdf`, await make(g));
      }
      await progress('אורז לקובץ ZIP…');
      done(await zip.generateAsync({ type: 'blob' }), `${base}-split.zip`);
    },
  },

  extract: {
    name: 'חילוץ עמודים', group: 'org', icon: 'copy', action: 'חילוץ והורדה',
    desc: 'בחירת עמודים מסוימים ושמירתם כקובץ חדש.',
    defaults: { separate: false },
    stage: () => pageGrid({ onClick: p => toggleKey(p, 'sel'), decorate: (c, p) => c.classList.toggle('is-sel', p.sel) }),
    panel: () => [selField('עמודים לחילוץ', 'sel'), selButtons('sel'), check('כל עמוד כקובץ נפרד (ZIP)', S.opt.separate, v => (S.opt.separate = v))],
    summary: () => `נבחרו ${count('sel')} מתוך ${S.pages.length} עמודים`,
    ready: () => count('sel') > 0 || 'בחרו עמודים בלחיצה או הקלידו טווח',
    async run() {
      const list = S.pages.filter(p => p.sel), base = baseName(S.files[0].name);
      if (!S.opt.separate || list.length === 1) return done(await pagesToPdf(list), `${base}-extract.pdf`);
      const zip = new JSZip();
      const src = await libDoc(S.files[0]);
      for (const [i, p] of list.entries()) {
        await progress(`מחלץ עמוד ${i + 1} מתוך ${list.length}…`);
        zip.file(`${base}-p${p.index + 1}.pdf`, await pagesToPdf([p], src));
      }
      done(await zip.generateAsync({ type: 'blob' }), `${base}-pages.zip`);
    },
  },

  remove: {
    name: 'מחיקת עמודים', group: 'org', icon: 'trash', action: 'מחיקה והורדה',
    desc: 'הסרת עמודים מיותרים מהקובץ.',
    stage: () => pageGrid({ onClick: p => toggleKey(p, 'del'), decorate: (c, p) => c.classList.toggle('is-del', p.del) }),
    panel: () => [selField('עמודים למחיקה', 'del'), selButtons('del')],
    summary: () => `${count('del')} למחיקה · יישארו ${S.pages.length - count('del')} עמודים`,
    ready: () => (!count('del') ? 'לחצו על העמודים שתרצו למחוק' : count('del') === S.pages.length ? 'אי אפשר למחוק את כל העמודים' : true),
    async run() {
      const f = S.files[0], doc = await libDoc(f);
      selected('del').reverse().forEach(i => doc.removePage(i));
      done(await doc.save(), `${baseName(f.name)}-trimmed.pdf`);
    },
  },

  reorder: {
    name: 'סידור עמודים', group: 'org', icon: 'reorder', action: 'שמירה והורדה',
    desc: 'שינוי סדר העמודים בגרירה.',
    stage() {
      const move = (a, b) => {
        moveItem(S.pages, a, b);
        renderStage();
        renderFoot();
      };
      return pageGrid({
        onMove: move,
        tools: (p, i) => moveBtns(i, S.pages.length, move),
        decorate: (c, p, i) => {
          const num = c.querySelector('.pg-num');
          num.replaceChildren(String(i + 1), p.index !== i ? h('small', null, ` (במקור ${p.index + 1})`) : '');
        },
      });
    },
    panel: () => [
      note('גררו עמוד למקום החדש שלו, או השתמשו בחיצים שמתחת לכל עמוד.'),
      h('div', { class: 'row' },
        btn('היפוך סדר', 'reorder', () => { S.pages.reverse(); renderStage(); renderFoot(); }),
        btn('איפוס', 'undo', () => { S.pages.sort((a, b) => a.index - b.index); renderStage(); renderFoot(); })),
    ],
    summary() {
      const n = S.pages.filter((p, i) => p.index !== i).length;
      return n ? `${n} עמודים זזו ממקומם` : null;
    },
    ready: () => S.pages.some((p, i) => p.index !== i) || 'עוד לא שיניתם את הסדר',
    run: async () => done(await pagesToPdf(S.pages), `${baseName(S.files[0].name)}-reordered.pdf`),
  },

  rotate: {
    name: 'סיבוב', group: 'org', icon: 'rotR', action: 'שמירה והורדה', livePanel: true,
    desc: 'סיבוב עמודים בודדים או של כל הקובץ.',
    stage: () => pageGrid({
      onClick: p => toggleKey(p, 'sel'),
      decorate: (c, p) => c.classList.toggle('is-sel', p.sel),
      tools: p => h('span', { class: 'mini-row' },
        miniBtn('rotL', 'סיבוב שמאלה', () => rotatePages([p], -90)),
        miniBtn('rotR', 'סיבוב ימינה', () => rotatePages([p], 90))),
    }),
    panel() {
      const n = count('sel');
      const targets = () => (count('sel') ? S.pages.filter(p => p.sel) : S.pages);
      return [
        note(n ? `הכפתורים יסובבו רק את ${n} העמודים שבחרתם.` : 'הכפתורים יסובבו את כל העמודים. לחצו על עמודים כדי לסובב רק אותם.'),
        h('div', { class: 'row' }, btn('שמאלה', 'rotL', () => rotatePages(targets(), -90)), btn('ימינה', 'rotR', () => rotatePages(targets(), 90))),
        h('div', { class: 'row' },
          btn('ניקוי בחירה', null, () => { S.pages.forEach(p => (p.sel = false)); afterSel(); }),
          btn('איפוס', 'undo', () => { S.pages.forEach(p => (p.rot = 0)); updateCards(); renderFoot(); })),
      ];
    },
    summary() {
      const n = S.pages.filter(p => norm(p.rot)).length;
      return n ? `${n} עמודים יסובבו` : null;
    },
    ready: () => S.pages.some(p => norm(p.rot)) || 'עוד לא סובבתם אף עמוד',
    async run() {
      const f = S.files[0], doc = await libDoc(f);
      doc.getPages().forEach((pg, i) => {
        const r = norm(S.pages[i].rot);
        if (r) pg.setRotation(degrees(norm(pg.getRotation().angle + r)));
      });
      done(await doc.save(), `${baseName(f.name)}-rotated.pdf`);
    },
  },

  edit: {
    name: 'עריכה', group: 'edit', icon: 'edit', action: 'שמירה והורדה',
    desc: 'הוספת טקסט, תמונות, הדגשות, כיסוי מידע וחתימה בכתב יד.',
    stage: edStage,
    panel: edPanel,
    summary() {
      const els = S.ed.els;
      return els.length ? `${els.length} תוספות ב-${new Set(els.map(e => e.page)).size} עמודים` : null;
    },
    ready: () => S.ed.els.length > 0 || 'עוד לא הוספתם כלום לקובץ',
    run: edExport,
  },

  numbers: {
    name: 'מספור עמודים', group: 'edit', icon: 'hash', action: 'הוספה והורדה',
    desc: 'הוספת מספרי עמודים בפינה או במרכז, בפורמט שתבחרו.',
    defaults: { pos: 'bc', fmt: 'n', size: 12, start: 1, skipFirst: false, color: '#1d1a26' },
    stage: () => previewStage(drawNumbers),
    panel() {
      const o = S.opt, upd = drawNumbers;
      return [
        field('מיקום', posPicker(o.pos, v => { o.pos = v; upd(); })),
        field('תבנית', seg([['n', '1'], ['nN', '1 / 9'], ['he', 'עמוד 1 מתוך 9']], o.fmt, v => { o.fmt = v; upd(); })),
        h('div', { class: 'row' },
          field('גודל', numInput(o.size, 6, 72, v => { o.size = v; upd(); })),
          field('מתחילים מ-', numInput(o.start, 0, 99999, v => { o.start = v; upd(); }))),
        field('צבע', swatches(o.color, INK_COLORS, v => { o.color = v; upd(); })),
        check('בלי מספר בעמוד הראשון', o.skipFirst, v => { o.skipFirst = v; upd(); }),
      ];
    },
    summary: () => `${S.pages.length - (S.opt.skipFirst ? 1 : 0)} עמודים ימוספרו`,
    ready: () => S.pages.length - (S.opt.skipFirst ? 1 : 0) > 0 || 'אין עמודים למספור',
    async run() {
      const f = S.files[0], o = S.opt, doc = await libDoc(f), pages = doc.getPages();
      for (const [i, page] of pages.entries()) {
        const text = numberText(i);
        if (!text) continue;
        if (i % 10 === 0) await progress(`ממספר עמוד ${i + 1} מתוך ${pages.length}…`);
        const t = await textImage(text, { size: o.size, color: o.color });
        const g = pageGeom(page);
        const [cx, cy] = numPos(g.w, g.h, t.w, t.h, o.pos, o.size);
        page.drawImage(await doc.embedPng(t.bytes), placeAt(g, cx, cy, t.w, t.h));
      }
      done(await doc.save(), `${baseName(f.name)}-numbered.pdf`);
    },
  },

  compress: {
    name: 'דחיסה', group: 'edit', icon: 'shrink', action: 'דחיסה והורדה',
    desc: 'הקטנת נפח הקובץ על ידי המרת העמודים לתמונות קלות יותר.',
    defaults: { level: 'mid' },
    stage: () => pageGrid(),
    panel() {
      const r = S.result;
      return [
        field('רמת דחיסה', seg([['low', 'קלה'], ['mid', 'בינונית'], ['high', 'חזקה']], S.opt.level, v => (S.opt.level = v))),
        note('העמודים הופכים לתמונות, כך שבקובץ החדש לא יהיה אפשר לסמן או לחפש טקסט. הכי מתאים לסריקות ולקבצים עם הרבה תמונות.'),
        r && h('div', { class: `result${r.after >= r.before ? ' bad' : ''}` },
          r.after >= r.before
            ? [h('b', null, 'לא קטן יותר'), `הקובץ כבר דחוס היטב (${fmtSize(r.before)}). נסו רמה חזקה יותר.`]
            : [h('b', null, `קטן ב-${Math.round((1 - r.after / r.before) * 100)}%`), `${fmtSize(r.before)} ← ${fmtSize(r.after)}`]),
      ];
    },
    summary: () => `גודל נוכחי: ${fmtSize(S.files[0].size)}`,
    async run() {
      const L = { low: { dpi: 150, q: 0.8 }, mid: { dpi: 110, q: 0.65 }, high: { dpi: 80, q: 0.5 } }[S.opt.level];
      const f = S.files[0], out = await PDFDocument.create();
      for (let i = 0; i < f.n; i++) {
        await progress(`דוחס עמוד ${i + 1} מתוך ${f.n}…`);
        const page = await f.pdf.getPage(i + 1);
        const v = page.getViewport({ scale: 1 });
        const c = await pageCanvas(f, i, L.dpi / 72);
        const jpg = await out.embedJpg(await canvasBytes(c, 'image/jpeg', L.q));
        c.width = c.height = 0;
        out.addPage([v.width, v.height]).drawImage(jpg, { x: 0, y: 0, width: v.width, height: v.height });
      }
      const bytes = await out.save();
      S.result = { before: f.size, after: bytes.length };
      renderPanel();
      if (bytes.length < f.size) done(bytes, `${baseName(f.name)}-compressed.pdf`);
    },
  },

  img2pdf: {
    name: 'תמונות ל-PDF', group: 'convert', icon: 'image', multi: true, accept: 'image', action: 'יצירת PDF',
    desc: 'הפיכת תמונות לקובץ PDF אחד, תמונה בכל עמוד.',
    defaults: { size: 'a4', orient: 'auto', margin: 'small' },
    stage: fileGrid,
    panel() {
      const o = S.opt;
      return [
        field('גודל עמוד', seg([['a4', 'A4'], ['letter', 'Letter'], ['fit', 'לפי התמונה']], o.size, v => { o.size = v; renderPanel(); })),
        o.size !== 'fit' && field('כיוון', seg([['auto', 'אוטומטי'], ['port', 'לאורך'], ['land', 'לרוחב']], o.orient, v => (o.orient = v))),
        field('שוליים', seg([['none', 'ללא'], ['small', 'קטנים'], ['large', 'גדולים']], o.margin, v => (o.margin = v))),
        note('גררו את התמונות כדי לקבוע את סדר העמודים.'),
      ];
    },
    summary: () => `${S.files.length} תמונות · ${S.files.length} עמודים`,
    async run() {
      const o = S.opt, doc = await PDFDocument.create();
      const m = { none: 0, small: 24, large: 56 }[o.margin];
      for (const [i, im] of S.files.entries()) {
        await progress(`מוסיף תמונה ${i + 1} מתוך ${S.files.length}…`);
        const emb = await embedImage(doc, im);
        const iw = im.iw * 0.75, ih = im.ih * 0.75;
        let pw, ph;
        if (o.size === 'fit') [pw, ph] = [iw + 2 * m, ih + 2 * m];
        else {
          [pw, ph] = o.size === 'a4' ? [595.28, 841.89] : [612, 792];
          if (o.orient === 'land' || (o.orient === 'auto' && im.iw > im.ih)) [pw, ph] = [ph, pw];
        }
        const sc = Math.min((pw - 2 * m) / iw, (ph - 2 * m) / ih, o.size === 'fit' ? 1 : Infinity);
        const dw = iw * sc, dh = ih * sc;
        doc.addPage([pw, ph]).drawImage(emb, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
      }
      done(await doc.save(), `${baseName(S.files[0].name)}.pdf`);
    },
  },

  pdf2img: {
    name: 'PDF לתמונות', group: 'convert', icon: 'images', action: 'המרה והורדה',
    desc: 'שמירת עמודים כתמונות PNG או JPG.',
    defaults: { fmt: 'png', dpi: 150 },
    stage: () => pageGrid({ onClick: p => toggleKey(p, 'sel'), decorate: (c, p) => c.classList.toggle('is-sel', p.sel) }),
    panel() {
      const o = S.opt;
      return [
        field('פורמט', seg([['png', 'PNG'], ['jpg', 'JPG']], o.fmt, v => (o.fmt = v))),
        field('איכות', seg([[72, 'מסך · 72'], [150, 'רגילה · 150'], [300, 'הדפסה · 300']], o.dpi, v => (o.dpi = v)), 'נקודות לאינץ׳ (DPI)'),
        selField('עמודים', 'sel'),
        selButtons('sel'),
      ];
    },
    summary: () => `${count('sel')} עמודים יומרו`,
    ready: () => count('sel') > 0 || 'בחרו לפחות עמוד אחד',
    async run() {
      const f = S.files[0], o = S.opt, list = S.pages.filter(p => p.sel), base = baseName(f.name);
      const type = o.fmt === 'png' ? 'image/png' : 'image/jpeg', pad = String(f.n).length, out = [];
      for (const [k, p] of list.entries()) {
        await progress(`ממיר עמוד ${k + 1} מתוך ${list.length}…`);
        const c = await pageCanvas(f, p.index, o.dpi / 72);
        out.push([`${base}-${String(p.index + 1).padStart(pad, '0')}.${o.fmt}`, await canvasBlob(c, type, 0.92)]);
        c.width = c.height = 0;
      }
      if (out.length === 1) return done(out[0][1], out[0][0]);
      await progress('אורז לקובץ ZIP…');
      const zip = new JSZip();
      out.forEach(([n, b]) => zip.file(n, b));
      done(await zip.generateAsync({ type: 'blob' }), `${base}-images.zip`);
    },
  },
};

function rotatePages(list, d) {
  list.forEach(p => (p.rot += d));
  updateCards();
  renderFoot();
}

function topbar() {
  const t = TOOLS[S.tool];
  return h('header', { class: 'top' },
    h('button', { class: 'brand', type: 'button', onclick: () => go('') }, h('span', { class: 'brand-mark' }, icon('file', 16)), 'Pdfer'),
    t && h('span', { class: 'crumb' }, h('span', null, '/'), h('b', null, t.name)),
    h('div', { class: 'spacer' }),
    t && h('button', { class: 'btn btn-dark', type: 'button', onclick: () => go('') }, icon('grid', 16), h('span', { class: 'hide-sm' }, 'כל הכלים')));
}

function home() {
  return h('main', { class: 'scroll' }, h('div', { class: 'wrap' },
    h('h1', { class: 'title' }, 'חה חה חה, מו'),
    GROUPS.map(([g, label]) => [
      h('h2', { class: 'section-h' }, label),
      h('div', { class: 'tools' }, Object.entries(TOOLS).filter(([, t]) => t.group === g).map(([id, t]) =>
        h('a', { class: 'tool', href: `#${id}` },
          h('span', { class: 'tool-ic' }, icon(t.icon, 22)),
          h('span', { class: 'tool-body' }, h('span', { class: 'tool-name' }, t.name))))),
    ])));
}

function dropzone(t) {
  const img = t.accept === 'image';
  return h('button', { class: 'drop', type: 'button', onclick: pickFiles },
    h('span', { class: 'drop-ic' }, icon('upload', 30)),
    h('span', { class: 'drop-title' }, img ? 'גררו לכאן תמונות, או לחצו לבחירה' : t.multi ? 'גררו לכאן קובצי PDF, או לחצו לבחירה' : 'גררו לכאן קובץ PDF, או לחצו לבחירה'),
    h('span', { class: 'drop-sub' }, img ? 'JPG, PNG, WEBP ועוד. אפשר לבחור כמה בבת אחת.' : t.multi ? 'אפשר לבחור כמה קבצים בבת אחת.' : 'הקובץ נשאר אצלכם ולא עולה לשום מקום.'),
    h('span', { class: 'btn btn-accent' }, img ? 'בחירת תמונות' : t.multi ? 'בחירת קבצים' : 'בחירת קובץ'));
}

function stageHead() {
  const t = TOOLS[S.tool];
  if (t.multi) return null;
  const f = S.files[0];
  return h('div', { class: 'file-chip' },
    h('span', { class: 'fc-ic' }, icon('file', 18)),
    h('div', { class: 'fc-meta' }, h('div', { class: 'fc-title', dir: 'auto', title: f.name }, f.name), h('div', { class: 'fc-sub' }, `${f.n} עמודים · ${fmtSize(f.size)}`)),
    h('button', { class: 'btn btn-ghost', type: 'button', onclick: pickFiles }, icon('refresh', 16), h('span', { class: 'hide-sm' }, 'קובץ אחר')));
}

function toolScreen() {
  const t = TOOLS[S.tool];
  S.ui = {};
  if (!S.files.length)
    return h('main', { class: 'scroll' }, h('div', { class: 'wrap narrow' },
      h('a', { class: 'back', href: '#' }, icon('arrowRight', 16), 'כל הכלים'),
      h('div', { class: 'intro' }, h('span', { class: 'tool-ic lg' }, icon(t.icon, 26)), h('h1', { class: 'title' }, t.name)),
      dropzone(t)));
  S.ui.stage = h('section', { class: 'stage' });
  S.ui.panel = h('aside', { class: 'panel' });
  renderStage();
  renderPanel();
  return h('main', { class: 'scroll' }, h('div', { class: 'work' }, S.ui.stage, S.ui.panel));
}

function renderStage() {
  io?.disconnect();
  S.ui.cards = [];
  S.ui.decorate = null;
  S.ui.stage.replaceChildren(...[stageHead(), TOOLS[S.tool].stage()].flat().filter(Boolean));
}

function foot() {
  const t = TOOLS[S.tool];
  const ready = t.ready ? t.ready() : true;
  const s = t.summary?.();
  return h('div', { class: 'panel-foot' },
    s && h('div', { class: 'summary' }, s),
    ready !== true && h('div', { class: 'hint' }, ready),
    h('button', { class: 'btn btn-accent btn-lg', type: 'button', disabled: ready !== true, onclick: runTool }, icon('download', 18), t.action));
}

function renderPanel() {
  if (!S.ui.panel) return;
  const t = TOOLS[S.tool];
  S.ui.foot = foot();
  S.ui.panel.replaceChildren(h('div', { class: 'panel-h' }, icon(t.icon, 19), t.name), ...[t.panel?.() ?? []].flat().filter(Boolean), S.ui.foot);
}

function renderFoot() {
  if (!S.ui.foot?.isConnected) return;
  const f = foot();
  S.ui.foot.replaceWith(f);
  S.ui.foot = f;
}

function render() {
  $('#app').replaceChildren(topbar(), S.tool ? toolScreen() : home());
}

async function runTool() {
  const t = TOOLS[S.tool];
  if (S.busy || (t.ready && t.ready() !== true)) return;
  const tool = S.tool;
  await progress('מעבד…');
  try {
    await t.run();
  } catch (e) {
    console.error(e);
    if (S.tool === tool) toast('משהו השתבש בעיבוד הקובץ');
  } finally {
    setBusy(null);
  }
}

function pickFiles() {
  const t = TOOLS[S.tool];
  const inp = h('input', { type: 'file', accept: t.accept === 'image' ? 'image/*' : 'application/pdf,.pdf', multiple: !!t.multi });
  inp.onchange = () => addFiles([...inp.files]);
  inp.click();
}

function releaseFile(f) {
  if (!f) return;
  f.pdf?.destroy();
  if (f.url) URL.revokeObjectURL(f.url);
  for (const m of [thumbReady, thumbPending])
    for (const k of [...m.keys()]) if (k.startsWith(`${f.id}:`)) m.delete(k);
}

function releaseAll() {
  S.files.forEach(releaseFile);
}

async function loadPdfFile(f) {
  const bytes = new Uint8Array(await f.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
  try {
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
    if (doc.isEncrypted) toast(`הקובץ "${f.name}" מוצפן - ייתכן שהתוצאה לא תהיה תקינה`);
  } catch {}
  return { id: uid(), name: f.name, size: f.size, bytes, pdf, n: pdf.numPages };
}

async function loadImageFile(f) {
  return { id: uid(), name: f.name, size: f.size, ...(await prepareImage(f)) };
}

function buildPages() {
  const f = S.files[0], t = TOOLS[S.tool];
  S.pages = !t.multi && f ? Array.from({ length: f.n }, (_, i) => ({ index: i, rot: 0, sel: S.tool === 'pdf2img', del: false })) : [];
}

async function addFiles(list) {
  const t = TOOLS[S.tool];
  if (!t || !list.length || S.busy) return;
  const img = t.accept === 'image';
  const ok = list.filter(f => (img ? f.type.startsWith('image/') : f.type === 'application/pdf' || /\.pdf$/i.test(f.name)));
  if (ok.length < list.length) toast(img ? 'אפשר להעלות כאן רק תמונות' : 'אפשר להעלות כאן רק קובצי PDF');
  if (!ok.length) return;
  const take = t.multi ? ok : ok.slice(0, 1);
  const loaded = [];
  for (const [i, f] of take.entries()) {
    await progress(take.length > 1 ? `טוען ${i + 1} מתוך ${take.length}…` : 'טוען את הקובץ…');
    try {
      loaded.push(img ? await loadImageFile(f) : await loadPdfFile(f));
    } catch (e) {
      console.error(e);
      toast(e?.name === 'PasswordException' ? `הקובץ "${f.name}" מוגן בסיסמה` : `לא הצלחנו לקרוא את "${f.name}"`);
    }
  }
  setBusy(null);
  if (!loaded.length) return;
  if (t.multi) S.files.push(...loaded);
  else {
    releaseAll();
    S.files = loaded;
    S.view = 0;
    S.result = null;
    if (S.tool === 'edit') S.ed = newEd();
  }
  buildPages();
  render();
}

function go(id) {
  location.hash = id;
}

function route() {
  const id = location.hash.slice(1);
  const tool = TOOLS[id] ? id : null;
  if (tool !== S.tool) {
    S.tool = tool;
    releaseAll();
    S.files = [];
    S.pages = [];
    S.view = 0;
    S.result = null;
    S.opt = structuredClone(TOOLS[tool]?.defaults || {});
    S.ed = tool === 'edit' ? newEd() : null;
  }
  render();
  window.scrollTo(0, 0);
}

const hasFiles = e => [...(e.dataTransfer?.types || [])].includes('Files');
let dragDepth = 0;

window.addEventListener('dragenter', e => {
  if (!hasFiles(e) || !S.tool) return;
  dragDepth++;
  document.body.classList.add('dragging');
});
window.addEventListener('dragleave', e => {
  if (!hasFiles(e) || !S.tool) return;
  if (--dragDepth <= 0) {
    dragDepth = 0;
    document.body.classList.remove('dragging');
  }
});
window.addEventListener('dragover', e => hasFiles(e) && e.preventDefault());
window.addEventListener('drop', e => {
  if (!hasFiles(e)) return;
  e.preventDefault();
  dragDepth = 0;
  document.body.classList.remove('dragging');
  if (S.tool) addFiles([...e.dataTransfer.files]);
  else toast('בחרו קודם מה לעשות עם הקובץ');
});

document.addEventListener('keydown', e => {
  if (S.tool !== 'edit' || !S.files.length || !S.ed || S.ed.editing) return;
  if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
  if ((e.key === 'Delete' || e.key === 'Backspace') && S.ed.sel) {
    e.preventDefault();
    edDelete();
  } else if (e.key === 'Escape') edSelect(null);
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (S.ui.ed?.wrap.isConnected && !S.ed?.editing) edRender();
    if (S.ui.pv?.wrap.isConnected) renderPreview();
  }, 150);
});

document.fonts?.ready.then(() => S.ui.pv?.draw?.());
window.addEventListener('hashchange', route);
route();
