'use strict';

const KEY = 'progres.v1';
const S = 52, COLW = 118, ROWH = 82;
const XP = { task: 10, goal: 25, challenge: 50 };
const XP_COUNTRY = 5;
// Thème : l'habillage (CSS dans themes.css) + le vocabulaire qui va avec.
// Un seul pour l'instant, mais la structure permet d'en rajouter.
const THEMES = {
  arcanes: {
    name: 'Arcanes', brand: 'Arcanes du Destin', xp: 'essence',
    types: { task: 'Rune', goal: 'Sceau', challenge: 'Relique' },
    toasts: { task: 'Rune éveillée', goal: 'Sceau brisé', challenge: 'Relique obtenue' },
  },
};
const T = () => THEMES[st.theme] || THEMES.arcanes;
const PICKS = '🏆⭐🔥💪🏃🚴🏊🧗🤸⛷️🏄🥊⚽🏀🎾🏐🧘🎯🏔️🌍✈️🎒⛺🎨📷🎬🎸🎤💻📚🧠🗣️🍳❤️🤝🎉💰🏢🔧🌱💧😴🐉🌟🎮🛸🚀'.match(/\p{Extended_Pictographic}️?/gu);

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => new Date().toISOString().slice(0, 10);
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const fmtDate = d => d ? new Date(d + 'T12:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

// ---------- État ----------
function blank() {
  return {
    v: 1,
    done: {},       // id -> 'YYYY-MM-DD'
    progress: {},   // id -> nombre
    notes: {},      // id -> texte
    hidden: {},     // id -> true (branche "pas pour moi")
    countries: {},  // code ISO du pays -> date de première visite (carte du monde)
    custom: [],     // nœuds perso { id, tab, parent, icon, title, desc, type, target, unit }
    customTabs: [{ id: 'mes', title: 'Mes quêtes', icon: '⭐', color: '#8a5cff', root: 'mes.root' }],
    unverified: {}, // id -> true : pré-rempli, pas encore confirmé
    preset: 0,      // version du lot pré-rempli déjà appliqué
    showHidden: false,
    theme: 'arcanes',
    tab: null,
  };
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s) return Object.assign(blank(), s);
  } catch (e) { /* état corrompu : on repart de zéro */ }
  const s = blank();
  s.custom.push({ id: 'mes.root', tab: 'mes', parent: null, icon: '⭐', title: 'Mes quêtes', desc: 'Tes objectifs à toi. Clique puis « ＋ Sous-objectif » pour en ajouter.', type: 'task' });
  return s;
}
const save = () => localStorage.setItem(KEY, JSON.stringify(st));

let st = load();
let nodes = {}, tabs = [];
let view = { x: 40, y: 0, s: 1 };

function build() {
  nodes = {}; tabs = [];
  const walk = (o, parent, tab) => {
    nodes[o.id] = { id: o.id, icon: o.icon, title: o.title, desc: o.desc || '', type: o.type || 'task', target: o.target || 0, unit: o.unit || '', hub: !!o.hub, parent, tab, children: [] };
    if (parent) nodes[parent].children.push(o.id);
    (o.children || []).forEach(c => walk(c, o.id, tab));
  };
  for (const t of window.DEFAULT_TABS) {
    tabs.push({ id: t.id, title: t.title, icon: t.icon, color: t.color, root: t.tree.id });
    walk(t.tree, null, t.id);
  }
  if (window.WORLD) tabs.splice(tabs.findIndex(t => t.id === 'aventure') + 1, 0,
    { id: 'carte', title: 'Carte', icon: '🗺️', color: '#2a6f9a', map: true });
  for (const t of st.customTabs) tabs.push({ ...t, custom: true });
  for (const c of st.custom) nodes[c.id] = { type: 'task', target: 0, unit: '', desc: '', ...c, custom: true, children: [] };
  for (const c of st.custom) if (nodes[c.parent]) nodes[c.parent].children.push(c.id);
  if (!tabs.some(t => t.id === st.tab)) st.tab = tabs[0].id;
}

function applyPreset() {
  const P = window.PRESET;
  if (!P || (st.preset || 0) >= P.version) return 0;
  let n = 0;
  for (const [id, d] of Object.entries(P.done)) {
    if (!nodes[id] || st.done[id]) continue;
    st.done[id] = d; n++;
    if (P.unverified.includes(id)) st.unverified[id] = true;
  }
  for (const [id, v] of Object.entries(P.progress || {})) if (nodes[id]) st.progress[id] = Math.max(st.progress[id] || 0, v);
  for (const [id, t] of Object.entries(P.notes || {})) if (nodes[id] && !st.notes[id]) st.notes[id] = t;
  for (const [cc, d] of Object.entries(P.countries || {})) if (!st.countries[cc]) st.countries[cc] = d;
  // ce que tu as confirmé entre-temps n'est plus « à vérifier »
  for (const id of P.verified || []) delete st.unverified[id];
  st.preset = P.version;
  save();
  return n;
}
const toVerify = () => Object.keys(st.unverified).filter(id => nodes[id] && st.done[id]);

const tabOf = id => tabs.find(t => t.id === id);
function isHidden(id) {
  for (let n = nodes[id]; n; n = nodes[n.parent]) if (st.hidden[n.id]) return true;
  return false;
}
const visible = id => st.showHidden || !isHidden(id);
const tabNodes = tabId => Object.values(nodes).filter(n => n.tab === tabId && !isHidden(n.id));

function totalXP() {
  let xp = 0;
  for (const id in st.done) if (nodes[id]) xp += XP[nodes[id].type] || 0;
  xp += visitedStats().n * XP_COUNTRY;
  return xp;
}
function levelOf(xp) { // chaque niveau coûte un peu plus que le précédent
  let lvl = 0, need = 40;
  while (xp >= need) { xp -= need; lvl++; need = 40 + lvl * 15; }
  return { lvl, cur: xp, need };
}

// ---------- Rendu ----------
function applyTheme() {
  const q = new URLSearchParams(location.search).get('theme');
  if (q && THEMES[q]) st.theme = q;
  if (!THEMES[st.theme]) st.theme = 'arcanes';
  document.documentElement.dataset.theme = st.theme;
  $('.brand span').textContent = T().brand;
  document.title = `${T().brand} — les trophées de ma vie`;
}

function render() {
  applyTheme();
  renderTabs();
  renderTree();
  renderXP();
}

function renderXP() {
  const xp = totalXP(), { lvl, cur, need } = levelOf(xp);
  const all = Object.values(nodes).filter(n => !isHidden(n.id));
  const done = all.filter(n => st.done[n.id]).length;
  $('#lvl').textContent = lvl;
  $('#xpfill').style.width = (cur / need * 100) + '%';
  $('#xptext').textContent = `${xp} ${T().xp} · ${done}/${all.length} débloqués`;
}

function tabProgress(t) {
  if (t.map) { const v = visitedStats(); return { d: v.n, n: window.WORLD.countries.length, pct: v.pct }; }
  const ns = tabNodes(t.id), d = ns.filter(n => st.done[n.id]).length;
  return { d, n: ns.length, pct: ns.length ? Math.round(d / ns.length * 100) : 0 };
}

function renderTabs() {
  $('#tabs').innerHTML = tabs.map(t => {
    const { pct } = tabProgress(t);
    return `<div class="tab ${t.id === st.tab ? 'active' : ''}" data-tab="${esc(t.id)}" style="--c:${esc(t.color)}" title="${esc(t.title)} — ${pct}%">
      <span class="t-ic">${esc(t.icon)}</span><span class="t-name">${esc(t.title)}</span><span class="t-pct"><i style="width:${pct}%"></i></span></div>`;
  }).join('');
}

let pos = {};
// ---------- Globe ----------
const CC = window.WORLD ? Object.fromEntries(window.WORLD.countries.map(c => [c.id, c])) : {};
function visitedStats() {
  if (!window.WORLD) return { n: 0, conts: 0, pct: 0 };
  const ids = Object.keys(st.countries).filter(id => CC[id]);
  return { n: ids.length, conts: new Set(ids.map(id => CC[id].cont)).size, pct: Math.round(ids.length / window.WORLD.countries.length * 100) };
}
// le globe gère lui-même rotation (glisser) et zoom (molette / pincer) : pas de transform CSS
const globe = { rot: [-15, -42, 0], k: 1, feats: null };
const isGlobe = () => !!tabOf(st.tab)?.map;
function globeInit() {
  if (globe.feats) return;
  const T = window.WORLD.topo;
  globe.feats = topojson.feature(T, T.objects.countries).features;
  globe.proj = d3.geoOrthographic().clipAngle(90).precision(0.4);
  globe.path = d3.geoPath(globe.proj);
  globe.grat = d3.geoGraticule10();
}
function globeDraw() {
  const svg = $('#nodes svg.world'); if (!svg) return;
  const stage = $('#stage'), W = stage.clientWidth, H = stage.clientHeight;
  const r = Math.min(W, H - 60) / 2 - 14;
  globe.proj.scale(r * globe.k).translate([W / 2, (H - 30) / 2]).rotate(globe.rot);
  svg.setAttribute('width', W); svg.setAttribute('height', H);
  const [cx, cy] = globe.proj.translate(), R = globe.proj.scale();
  const atmo = svg.querySelector('.atmo');
  atmo.setAttribute('cx', cx); atmo.setAttribute('cy', cy); atmo.setAttribute('r', R * 1.08);
  svg.querySelector('.sphere').setAttribute('d', globe.path({ type: 'Sphere' }));
  svg.querySelector('.grat').setAttribute('d', globe.path(globe.grat));
  const ps = svg.querySelectorAll('.c');
  for (let i = 0; i < ps.length; i++) ps[i].setAttribute('d', globe.path(globe.feats[i]) || '');
}
let globeRaf = 0;
const globeRedraw = () => { if (!globeRaf) globeRaf = requestAnimationFrame(() => { globeRaf = 0; globeDraw(); }); };
function renderMap(t) {
  globeInit();
  const v = visitedStats();
  pos = {};
  view = { x: 0, y: 0, s: 1 };
  const svg = $('#links');
  svg.innerHTML = ''; svg.setAttribute('width', 0); svg.setAttribute('height', 0);
  $('#nodes').innerHTML = `<svg class="world">
    <defs><radialGradient id="atmo-g"><stop offset="86%" stop-color="#6ff7e8" stop-opacity=".22"/><stop offset="100%" stop-color="#7a4dff" stop-opacity="0"/></radialGradient>
    <radialGradient id="sea-g" cx="38%" cy="32%"><stop offset="0%" stop-color="#1b2a6b"/><stop offset="100%" stop-color="#070620"/></radialGradient></defs>
    <circle class="atmo" fill="url(#atmo-g)"/><path class="sphere" fill="url(#sea-g)"/><path class="grat"/>` +
    globe.feats.map(f => `<path class="c${st.countries[f.id] ? ' v' : ''}" data-cc="${f.id}"/>`).join('') + '</svg>';
  globeDraw();
  $('#tabinfo').innerHTML = `<b>${esc(t.icon)} Carte du monde</b>${v.n} pays · ${v.conts} continent${v.conts > 1 ? 's' : ''} · ${v.pct} % du monde`;
  applyView();
}
function toggleCountry(cc) {
  const c = CC[cc]; if (!c) return;
  if (st.countries[cc]) {
    if (!confirm(`Retirer ${c.name} de ta carte ?`)) return;
    delete st.countries[cc]; save(); render(); return;
  }
  const conts = new Set(Object.keys(st.countries).map(id => CC[id]?.cont));
  st.countries[cc] = today(); save(); render();
  toast({ icon: '📍', type: 'task', title: c.name }, 'Nouvelle terre foulée');
  if (!conts.has(c.cont)) setTimeout(() => toast({ icon: '🌍', type: 'challenge', title: window.WORLD.continents[c.cont] }, 'Nouveau continent'), 700);
}
function openCountryList() {
  const W = window.WORLD, v = visitedStats();
  const norm = x => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const groups = Object.entries(W.continents).map(([k, name]) => {
    const cs = W.countries.filter(c => c.cont === k);
    return `<h3>${esc(name)} <span class="muted">${cs.filter(c => st.countries[c.id]).length}/${cs.length}</span></h3><div class="clist">` +
      cs.map(c => `<label data-name="${esc(norm(c.name))}"><input type="checkbox" data-cc="${c.id}" ${st.countries[c.id] ? 'checked' : ''}> ${esc(c.name)}</label>`).join('') + '</div>';
  }).join('');
  show(`<div class="head"><h2>🗺️ Pays visités</h2><button type="button" class="mc x" data-close>✕</button></div>
    <p class="muted">${v.n} pays · ${v.conts} continents · ${v.pct} % du monde. Les pays trop petits pour la carte sont ici aussi.</p>
    <input type="text" id="f-search" placeholder="Chercher un pays…">${groups}`, m => {
    const search = m.querySelector('#f-search');
    search.oninput = () => {
      const q = norm(search.value);
      m.querySelectorAll('.clist label').forEach(l => { l.hidden = !!q && !l.dataset.name.includes(q); });
    };
    m.querySelectorAll('input[data-cc]').forEach(cb => cb.onchange = () => {
      if (cb.checked) st.countries[cb.dataset.cc] = today(); else delete st.countries[cb.dataset.cc];
      save(); render();
    });
  });
}

function renderTree() {
  const t = tabOf(st.tab);
  document.documentElement.style.setProperty('--tab', t.color);
  $('#btn-list').hidden = !t.map;
  if (t.map) return renderMap(t);
  pos = {};
  let row = 0;
  const lay = (id, d) => {
    const kids = nodes[id].children.filter(visible);
    let y;
    if (!kids.length) y = row++ * ROWH;
    else { const ys = kids.map(k => lay(k, d + 1)); y = (ys[0] + ys[ys.length - 1]) / 2; }
    pos[id] = { x: d * COLW, y, d };
    return y;
  };
  if (nodes[t.root]) lay(t.root, 0);

  const ids = Object.keys(pos);
  let html = '', outs = '', ins = '', flows = '', maxX = 0, maxY = 0;
  for (const id of ids) {
    const n = nodes[id], p = pos[id];
    maxX = Math.max(maxX, p.x + S); maxY = Math.max(maxY, p.y + S);
    html += nodeHTML(n, p);
    if (n.parent && pos[n.parent]) {
      const a = pos[n.parent], mid = a.x + S + (COLW - S) / 2;
      const d = `M${a.x + S} ${a.y + S / 2}H${mid}V${p.y + S / 2}H${p.x}`;
      const cls = (st.done[id] ? 'done' : st.done[n.parent] ? '' : 'locked') + (isHidden(id) ? ' dim' : '');
      outs += `<path class="out${isHidden(id) ? ' dim' : ''}" d="${d}"/>`;
      ins += `<path class="in ${cls}" d="${d}"/>`;
      if (st.done[id]) flows += `<path class="flow" d="${d}"/>`;
    }
  }
  const svg = $('#links');
  svg.setAttribute('width', maxX + 10); svg.setAttribute('height', maxY + 10);
  svg.innerHTML = outs + ins + flows;
  $('#nodes').innerHTML = html;

  const ns = tabNodes(t.id), d = ns.filter(n => st.done[n.id]).length;
  $('#tabinfo').innerHTML = `<b>${esc(t.icon)} ${esc(t.title)}</b>${d}/${ns.length} · ${ns.length ? Math.round(d / ns.length * 100) : 0}%`;
  applyView();
}

function nodeState(n) {
  if (st.done[n.id]) return 'done';
  if (!n.parent || st.done[n.parent]) return 'avail';
  return 'locked';
}
function nodeHTML(n, p) {
  const cls = [n.type, nodeState(n), n.custom ? 'custom' : '', isHidden(n.id) ? 'hiddenn' : '', st.unverified[n.id] && st.done[n.id] ? 'unverified' : ''].join(' ');
  const style = p ? `left:${p.x}px;top:${p.y}px` : '';
  let bar = '';
  if (n.target && !st.done[n.id]) {
    const v = Math.min(1, (st.progress[n.id] || 0) / n.target);
    bar = `<div class="bar"><i style="width:${v * 100}%"></i></div>`;
  }
  // les branches qui partent de la racine sont les sous-catégories : on affiche leur nom
  // (et les nœuds marqués `hub` plus loin dans l'arbre, ex. les continents)
  const label = p && (p.d === 1 || n.hub) ? `<div class="label">${esc(n.title)}</div>` : '';
  return `<div class="node ${cls}" data-id="${esc(n.id)}" style="${style}">${label}<div class="frame"><span class="ic">${esc(n.icon)}</span></div>${bar}</div>`;
}

// ---------- Vue : pan / zoom ----------
function applyView() {
  $('#viewport').style.transform = `translate(${view.x}px,${view.y}px) scale(${view.s})`;
  // seules les étoiles (1re couche) suivent le déplacement ; les nébuleuses restent fixes
  $('#stage').style.backgroundPosition = `${view.x}px ${view.y}px, 0 0, 0 0`;
}
function centerView() {
  const stage = $('#stage'), W = stage.clientWidth, H = stage.clientHeight - 60; // 60 : place pour l'info en bas
  if (isGlobe()) {
    view = { x: 0, y: 0, s: 1 }; globe.k = 1;
    applyView(); return globeDraw();
  }
  const h = Math.max(...Object.values(pos).map(p => p.y)) + S + 14;
  const w = Math.max(...Object.values(pos).map(p => p.x)) + S;
  // on ne dézoome pas en dessous d'un seuil lisible : un grand arbre se parcourt en glissant
  view.s = Math.max(.6, Math.min(1, (H - 20) / h, (W - 60) / w));
  view.x = Math.max(24, (W - w * view.s) / 2);
  const r = pos[tabOf(st.tab).root];
  view.y = h * view.s > H - 20 ? H / 2 - (r.y + S / 2) * view.s : (H - h * view.s) / 2;
  applyView();
}
function zoomAt(f, cx, cy) {
  if (isGlobe()) { globe.k = Math.max(.8, Math.min(20, globe.k * f)); return globeRedraw(); } // ×20 pour les micro-États
  const s = Math.max(.3, Math.min(2.5, view.s * f));
  view.x = cx - (cx - view.x) * (s / view.s);
  view.y = cy - (cy - view.y) * (s / view.s);
  view.s = s;
  applyView();
}

(function setupPan() {
  const stage = $('#stage'), ptrs = new Map();
  let moved = 0, last = null, pinch = null;
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('#zoom')) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = 0; last = { x: e.clientX, y: e.clientY };
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) };
    }
  });
  window.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2 && pinch) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = stage.getBoundingClientRect();
      zoomAt(d / pinch.d, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      pinch.d = d; moved = 99; return;
    }
    const dx = e.clientX - last.x, dy = e.clientY - last.y;
    moved += Math.abs(dx) + Math.abs(dy);
    last = { x: e.clientX, y: e.clientY };
    if (moved > 6) {
      if (isGlobe()) {
        const k = 0.28 / globe.k; // plus on zoome, plus la rotation est fine
        globe.rot[0] += dx * k;
        globe.rot[1] = Math.max(-89, Math.min(89, globe.rot[1] - dy * k));
        globeRedraw();
      } else { view.x += dx; view.y += dy; applyView(); }
      stage.classList.add('dragging'); hideHover();
    }
  });
  const up = e => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (ptrs.size === 0) {
      stage.classList.remove('dragging');
      if (moved <= 6) {
        const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('#nodes .node');
        if (el) openNode(el.dataset.id);
        else {
          const c = document.elementFromPoint(e.clientX, e.clientY)?.closest('#nodes [data-cc]');
          if (c) toggleCountry(c.dataset.cc);
        }
      }
    }
    if (ptrs.size === 1) last = [...ptrs.values()][0];
  };
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  stage.addEventListener('wheel', e => {
    e.preventDefault();
    const r = stage.getBoundingClientRect();
    zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
  $('#zoom').addEventListener('click', e => {
    const z = e.target.dataset.z; if (z === undefined) return;
    if (z === '0') return centerView();
    zoomAt(z === '1' ? 1.2 : 1 / 1.2, stage.clientWidth / 2, stage.clientHeight / 2);
  });
})();

// ---------- Infobulle ----------
const hover = $('#hover');
function hideHover() { hover.style.display = 'none'; }
$('#nodes').addEventListener('mouseover', e => {
  const ce = e.target.closest('[data-cc]');
  if (ce && !$('#stage').classList.contains('dragging')) {
    const c = CC[ce.dataset.cc], d = st.countries[c.id];
    hover.className = d ? 'done' : '';
    hover.innerHTML = `<div class="h-title">${esc(c.name)}</div><div class="h-desc">${esc(window.WORLD.continents[c.cont])}${d ? `<small>Visité · noté le ${fmtDate(d)}</small>` : '<small>Clique pour le cocher</small>'}</div>`;
    hover.style.display = 'block';
    hover.style.left = Math.min(e.clientX + 14, innerWidth - hover.offsetWidth - 8) + 'px';
    hover.style.top = Math.min(e.clientY + 14, innerHeight - hover.offsetHeight - 8) + 'px';
    return;
  }
  const el = e.target.closest('.node'); if (!el || $('#stage').classList.contains('dragging')) return;
  const n = nodes[el.dataset.id], done = st.done[n.id];
  let extra = '';
  if (done) extra = `<small>${st.unverified[n.id] ? '🔮 Pré-rempli, à vérifier · ' : ''}Débloqué le ${fmtDate(done)}</small>`;
  else if (n.target) extra = `<small>${st.progress[n.id] || 0} / ${n.target} ${esc(n.unit)}</small>`;
  hover.className = `${n.type} ${done ? 'done' : ''}`;
  hover.innerHTML = `<div class="h-title">${esc(n.title)}</div><div class="h-desc">${esc(n.desc)}${extra}</div>`;
  const r = el.getBoundingClientRect();
  hover.style.display = 'block';
  const left = Math.min(r.right + 8, window.innerWidth - hover.offsetWidth - 8);
  hover.style.left = left + 'px';
  hover.style.top = Math.min(r.top, window.innerHeight - hover.offsetHeight - 8) + 'px';
});
$('#nodes').addEventListener('mouseout', e => { if (e.target.closest('.node, [data-cc]')) hideHover(); });

// ---------- Actions ----------
function setDone(id, on) {
  const n = nodes[id];
  delete st.unverified[id];
  if (on) {
    if (st.done[id]) return;
    st.done[id] = today();
    const before = levelOf(totalXP() - XP[n.type]).lvl, after = levelOf(totalXP()).lvl;
    toast(n);
    if (after > before) setTimeout(() => toast({ icon: '✨', type: 'goal', title: `Niveau ${after} !` }, 'Montée de niveau'), 600);
    // un onglet complété à 100 % ?
    const ns = tabNodes(n.tab);
    if (ns.length > 1 && ns.every(x => st.done[x.id])) {
      const t = tabOf(n.tab);
      setTimeout(() => toast({ icon: t.icon, type: 'challenge', title: `${t.title} : 100 % !` }, 'Onglet terminé'), 1200);
    }
  } else delete st.done[id];
  save(); render();
  if (on) burst(id);
}

function burst(id) {
  const el = document.querySelector(`#nodes .node[data-id="${CSS.escape(id)}"]`);
  if (!el) return;
  const b = document.createElement('div');
  b.className = 'burst';
  b.innerHTML = Array.from({ length: 12 }, (_, i) => {
    const a = i / 12 * Math.PI * 2, r = 50 + Math.random() * 30;
    return `<i style="--dx:${Math.cos(a) * r}px;--dy:${Math.sin(a) * r}px"></i>`;
  }).join('');
  el.appendChild(b);
  setTimeout(() => b.remove(), 1000);
}

function setProgress(id, v) {
  const n = nodes[id];
  v = Math.max(0, Math.round(v * 100) / 100 || 0);
  st.progress[id] = v;
  save();
  if (n.target && v >= n.target && !st.done[id]) { modal.close(); setDone(id, true); }
  else render();
}

function toast(n, header) {
  const el = document.createElement('div');
  el.className = `toast ${n.type}`;
  el.innerHTML = `<div class="t-ic">${esc(n.icon)}</div><div><div class="t-h">${esc(header || T().toasts[n.type])}</div><div class="t-t">${esc(n.title)}</div></div>`;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), 4800);
  ding(n.type);
}

let audio;
function ding(type) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    // carillon mystique : arpège mineur, sinus + écho
    const notes = type === 'challenge' ? [440, 523, 659, 880, 1047, 1319] : type === 'goal' ? [523, 659, 988] : [659, 988];
    const echo = audio.createDelay(), fb = audio.createGain(), out = audio.createGain();
    echo.delayTime.value = 0.18; fb.gain.value = 0.35; out.gain.value = 1;
    echo.connect(fb).connect(echo); echo.connect(out); out.connect(audio.destination);
    notes.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + i * 0.11;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.09, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
      o.connect(g); g.connect(audio.destination); g.connect(echo);
      o.start(t0); o.stop(t0 + 1);
    });
  } catch (e) { /* pas de son, tant pis */ }
}

// ---------- Modale : détail d'un nœud ----------
const modal = $('#modal');
function show(html, wire) {
  modal.innerHTML = `<form method="dialog" class="card">${html}</form>`;
  modal.querySelectorAll('[data-close]').forEach(b => b.onclick = () => modal.close());
  // Entrée dans un champ = enregistrer (et pas fermer la fenêtre)
  modal.querySelector('form').onsubmit = e => { e.preventDefault(); modal.querySelector('#b-save')?.click(); };
  wire && wire(modal);
  if (!modal.open) modal.showModal();
}
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

function openNode(id) {
  hideHover();
  const n = nodes[id], done = st.done[id], t = tabOf(n.tab);
  const crumbs = [];
  for (let p = nodes[n.parent]; p; p = nodes[p.parent]) crumbs.unshift(p.title);
  const isTabRoot = n.custom && !n.parent && t.custom;
  const prog = st.progress[id] || 0;

  show(`
    <div class="head">
      ${nodeHTML(n)}
      <div>
        <div class="kind ${n.type}">${T().types[n.type]} · ${XP[n.type]} ${T().xp}${n.custom ? ' · perso' : ''}</div>
        <h2>${esc(n.title)}</h2>
        <div class="crumbs">${esc(t.icon)} ${esc([t.title, ...crumbs].join(' › '))}</div>
      </div>
      <button type="button" class="mc x" data-close>✕</button>
    </div>
    ${done && st.unverified[id] ? `
      <div class="verify">🔮 Pré-rempli d'après ton Instagram et nos échanges. C'est juste ?
        <div class="btns"><button type="button" id="b-yes" class="mc primary">✔ Oui, validé</button><button type="button" id="b-no" class="mc danger">✖ Non, annuler</button></div>
      </div>` : ''}
    <p class="desc">${esc(n.desc)}</p>
    ${n.target ? `
      <div class="counter">
        <button type="button" class="mc" data-step="-1">−</button>
        <input type="number" id="f-prog" value="${prog}" min="0" step="any">
        <button type="button" class="mc" data-step="1">+</button>
        <span>/ ${n.target} ${esc(n.unit)}</span>
      </div>
      <div class="counter"><div class="bigbar"><i style="width:${Math.min(100, prog / n.target * 100)}%"></i></div></div>` : ''}
    ${done ? `<div class="ok">✔ Débloqué le <input type="date" id="f-date" value="${done}"></div>` : ''}
    <label>Notes / souvenirs<textarea id="f-note" placeholder="Où, avec qui, comment c'était…">${esc(st.notes[id] || '')}</textarea></label>
    <div class="btns">
      <button type="button" id="b-toggle" class="mc ${done ? '' : 'primary'}">${done ? '↩ Annuler' : '✔ Débloquer !'}</button>
      <button type="button" id="b-add" class="mc">＋ Sous-objectif</button>
      ${n.custom ? `<button type="button" id="b-edit" class="mc">✎ Modifier</button>
                    <button type="button" id="b-del" class="mc danger">🗑 ${isTabRoot ? 'Supprimer l\'onglet' : 'Supprimer'}</button>`
                 : `<button type="button" id="b-hide" class="mc">${st.hidden[id] ? '👁 Réafficher' : '🚫 Pas pour moi'}</button>`}
    </div>`,
  m => {
    const yes = m.querySelector('#b-yes');
    if (yes) {
      yes.onclick = () => { delete st.unverified[id]; save(); render(); openNode(id); };
      m.querySelector('#b-no').onclick = () => { setDone(id, false); openNode(id); };
    }
    m.querySelector('#b-toggle').onclick = () => { if (done) { setDone(id, false); openNode(id); } else { modal.close(); setDone(id, true); } };
    m.querySelector('#b-add').onclick = () => openForm({ parent: id, tab: n.tab });
    m.querySelector('#f-note').oninput = e => { const v = e.target.value.trim(); if (v) st.notes[id] = e.target.value; else delete st.notes[id]; save(); };
    const date = m.querySelector('#f-date');
    if (date) date.onchange = e => { if (e.target.value) { st.done[id] = e.target.value; save(); } };
    const pf = m.querySelector('#f-prog');
    if (pf) {
      // si le compteur débloque le nœud, la fenêtre se ferme pour laisser voir l'éclat
      const step = v => { const was = st.done[id]; setProgress(id, v); if (was || !st.done[id]) openNode(id); };
      pf.onchange = () => step(+pf.value);
      m.querySelectorAll('[data-step]').forEach(b => b.onclick = () => step((st.progress[id] || 0) + +b.dataset.step));
    }
    const hide = m.querySelector('#b-hide');
    if (hide) hide.onclick = () => { if (st.hidden[id]) delete st.hidden[id]; else st.hidden[id] = true; save(); render(); modal.close(); };
    const edit = m.querySelector('#b-edit');
    if (edit) edit.onclick = () => openForm({ edit: id });
    const del = m.querySelector('#b-del');
    if (del) del.onclick = () => {
      if (!confirm(isTabRoot ? `Supprimer l'onglet « ${t.title} » et tout son contenu ?` : `Supprimer « ${n.title} » et ses sous-objectifs ?`)) return;
      deleteCustom(id, isTabRoot ? t.id : null);
      modal.close();
    };
  });
}

function deleteCustom(id, tabId) {
  const kill = new Set();
  const rec = x => { kill.add(x); nodes[x].children.forEach(rec); };
  rec(id);
  st.custom = st.custom.filter(c => !kill.has(c.id));
  for (const k of kill) { delete st.done[k]; delete st.progress[k]; delete st.notes[k]; delete st.hidden[k]; }
  if (tabId) { st.customTabs = st.customTabs.filter(t => t.id !== tabId); st.tab = null; }
  save(); build(); render();
  if (tabId) centerView();
}

// ---------- Formulaire : créer / modifier un objectif ----------
function openForm({ parent, tab, edit }) {
  const n = edit ? nodes[edit] : { icon: '⭐', title: '', desc: '', type: 'task', target: 0, unit: '' };
  show(`
    <div class="head"><h2>${edit ? 'Modifier' : 'Nouvel objectif'}</h2><button type="button" class="mc x" data-close>✕</button></div>
    ${parent ? `<div class="muted">Sous « ${esc(nodes[parent].title)} »</div>` : ''}
    <label>Icône (un emoji)<input type="text" id="f-icon" value="${esc(n.icon)}"></label>
    <div class="picks">${PICKS.map(p => `<span>${p}</span>`).join('')}</div>
    <label>Titre<input type="text" id="f-title" value="${esc(n.title)}" placeholder="Ex. : Faire un 360 en ski" required></label>
    <label>Description / condition<textarea id="f-desc" placeholder="Ce qu'il faut faire exactement">${esc(n.desc)}</textarea></label>
    <label>Type
      <select id="f-type">
        ${Object.keys(XP).map(k => `<option value="${k}" ${n.type === k ? 'selected' : ''}>${T().types[k]} (${XP[k]} ${T().xp})</option>`).join('')}
      </select></label>
    <div class="grid2">
      <label>Compteur (optionnel)<input type="number" id="f-target" min="0" value="${n.target || ''}" placeholder="Ex. 100"></label>
      <label>Unité<input type="text" id="f-unit" value="${esc(n.unit)}" placeholder="km, livres, jours…"></label>
    </div>
    <div class="btns"><button type="button" id="b-save" class="mc primary">💾 Enregistrer</button></div>`,
  m => {
    const icon = m.querySelector('#f-icon');
    m.querySelector('.picks').onclick = e => { if (e.target.tagName === 'SPAN') icon.value = e.target.textContent; };
    m.querySelector('#b-save').onclick = () => {
      const title = m.querySelector('#f-title').value.trim();
      if (!title) return m.querySelector('#f-title').focus();
      const data = {
        icon: icon.value.trim() || '⭐', title,
        desc: m.querySelector('#f-desc').value.trim(),
        type: m.querySelector('#f-type').value,
        target: Math.max(0, +m.querySelector('#f-target').value || 0),
        unit: m.querySelector('#f-unit').value.trim(),
      };
      let id = edit;
      if (edit) {
        Object.assign(st.custom.find(c => c.id === edit), data);
        const t = st.customTabs.find(t => t.root === edit);
        if (t) { t.title = data.title; t.icon = data.icon; }
      } else {
        id = uid('c.');
        st.custom.push({ id, tab, parent, ...data });
      }
      save(); build(); render();
      openNode(id);
    };
  });
  setTimeout(() => modal.querySelector('#f-title').focus(), 50);
}

function openTabForm() {
  show(`
    <div class="head"><h2>Nouvel onglet</h2><button type="button" class="mc x" data-close>✕</button></div>
    <p class="muted">Un nouvel arbre pour un domaine à toi (ski, musique, un projet, une année…).</p>
    <label>Icône<input type="text" id="f-icon" value="🌟"></label>
    <div class="picks">${PICKS.map(p => `<span>${p}</span>`).join('')}</div>
    <label>Nom<input type="text" id="f-title" placeholder="Ex. : Ski & Snow" required></label>
    <label>Couleur de fond<input type="color" id="f-color" value="#4a3b6b"></label>
    <div class="btns"><button type="button" id="b-save" class="mc primary">Créer</button></div>`,
  m => {
    const icon = m.querySelector('#f-icon');
    m.querySelector('.picks').onclick = e => { if (e.target.tagName === 'SPAN') icon.value = e.target.textContent; };
    m.querySelector('#b-save').onclick = () => {
      const title = m.querySelector('#f-title').value.trim();
      if (!title) return m.querySelector('#f-title').focus();
      const id = uid('t.'), root = uid('c.');
      st.customTabs.push({ id, title, icon: icon.value.trim() || '🌟', color: m.querySelector('#f-color').value, root });
      st.custom.push({ id: root, tab: id, parent: null, icon: icon.value.trim() || '🌟', title, desc: 'Racine de l\'onglet. Ajoute des sous-objectifs !', type: 'task', target: 0, unit: '' });
      st.tab = id;
      save(); build(); render(); centerView();
      openNode(root);
    };
  });
}

// ---------- Menu : journal, stats, sauvegarde ----------
function openMenu() {
  const journal = Object.entries(st.done).filter(([id]) => nodes[id])
    .sort((a, b) => b[1].localeCompare(a[1])).slice(0, 50);
  const stats = tabs.map(t => {
    const { d, n, pct } = tabProgress(t);
    return `<div class="stat">${esc(t.icon)} <span style="width:110px">${esc(t.title)}</span><div class="bigbar"><i style="width:${pct}%"></i></div><span>${d}/${n}</span></div>`;
  }).join('');
  const tv = toVerify();
  show(`
    <div class="head"><h2>☰ Menu</h2><button type="button" class="mc x" data-close>✕</button></div>
    ${tv.length ? `<h3>🔮 À vérifier (${tv.length})</h3>
    <p class="muted">Pré-remplis pour toi. ✔ si c'est juste, ✖ si c'est une erreur.</p>
    <ul class="journal verify-list">${tv.map(id => `<li data-id="${esc(id)}">${esc(nodes[id].icon)} ${esc(nodes[id].title)}
      <span class="d">${esc(tabOf(nodes[id].tab).title)}</span>
      <button type="button" class="mc primary" data-yes>✔</button><button type="button" class="mc danger" data-no>✖</button></li>`).join('')}</ul>
    <div class="btns"><button type="button" id="b-allyes" class="mc">✔ Tout valider</button></div>` : ''}
    <h3>📜 Journal</h3>
    ${journal.length ? `<ul class="journal">${journal.map(([id, d]) => `<li data-id="${esc(id)}">${esc(nodes[id].icon)} ${esc(nodes[id].title)}<span class="d">${fmtDate(d)}</span></li>`).join('')}</ul>`
                     : '<p class="muted">Rien encore… va débloquer ton premier progrès !</p>'}
    <h3>📊 Par onglet</h3>${stats}
    <h3>⚙️ Réglages</h3>
    ${Object.keys(THEMES).length > 1 ? `<label>Thème <select id="f-theme">${Object.entries(THEMES).map(([k, v]) => `<option value="${k}" ${st.theme === k ? 'selected' : ''}>${v.name}</option>`).join('')}</select></label>` : ''}
    <label><input type="checkbox" id="f-showhidden" ${st.showHidden ? 'checked' : ''}> Afficher les branches masquées (« pas pour moi »)</label>
    <h3>💾 Sauvegarde</h3>
    <p class="muted">Ta progression est stockée dans ce navigateur. Exporte-la pour la sauvegarder ou la passer sur un autre appareil.</p>
    <div class="btns">
      <button type="button" id="b-export" class="mc">⬇ Exporter</button>
      <button type="button" id="b-import" class="mc">⬆ Importer</button>
      <button type="button" id="b-reset" class="mc danger">Tout réinitialiser</button>
      <input type="file" id="f-file" accept=".json,application/json" hidden>
    </div>`,
  m => {
    m.querySelector('.verify-list')?.addEventListener('click', e => {
      const li = e.target.closest('li'); if (!li) return;
      const id = li.dataset.id;
      if (e.target.closest('[data-yes]')) { delete st.unverified[id]; save(); render(); openMenu(); }
      else if (e.target.closest('[data-no]')) { setDone(id, false); openMenu(); }
      else { st.tab = nodes[id].tab; save(); render(); centerView(); openNode(id); }
    });
    const allyes = m.querySelector('#b-allyes');
    if (allyes) allyes.onclick = () => {
      if (!confirm(`Valider les ${tv.length} hauts faits pré-remplis ?`)) return;
      st.unverified = {}; save(); render(); openMenu();
    };
    m.querySelector('.journal:not(.verify-list)')?.addEventListener('click', e => {
      const li = e.target.closest('li'); if (!li) return;
      st.tab = nodes[li.dataset.id].tab; save(); render(); centerView(); openNode(li.dataset.id);
    });
    const th = m.querySelector('#f-theme');
    if (th) th.onchange = e => { st.theme = e.target.value; history.replaceState(null, '', location.pathname); save(); render(); openMenu(); };
    m.querySelector('#f-showhidden').onchange = e => { st.showHidden = e.target.checked; save(); render(); };
    m.querySelector('#b-export').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(st, null, 2)], { type: 'application/json' }));
      a.download = `progres-${today()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    const file = m.querySelector('#f-file');
    m.querySelector('#b-import').onclick = () => file.click();
    file.onchange = async () => {
      try {
        const data = JSON.parse(await file.files[0].text());
        if (typeof data !== 'object' || !data.done) throw new Error('format');
        if (data.merge) {
          // fichier partiel (ex. hauts faits préparés à l'avance) : on ajoute sans rien écraser
          const n = Object.keys(data.done).filter(id => !st.done[id]).length;
          if (!confirm(`Ajouter ${n} haut(s) fait(s) à ta progression ?`)) return;
          for (const [id, d] of Object.entries(data.done)) if (!st.done[id]) st.done[id] = d;
          for (const [id, v] of Object.entries(data.progress || {})) st.progress[id] = Math.max(st.progress[id] || 0, v);
          for (const [id, t] of Object.entries(data.notes || {})) if (!st.notes[id]) st.notes[id] = t;
        } else {
          if (!confirm('Remplacer ta progression actuelle par ce fichier ?')) return;
          st = Object.assign(blank(), data);
        }
        save(); build(); render(); centerView(); modal.close();
      } catch (e) { alert('Fichier invalide.'); }
    };
    m.querySelector('#b-reset').onclick = () => {
      if (!confirm('Effacer TOUTE ta progression et tes objectifs perso ?')) return;
      if (!confirm('Vraiment ? (pense à exporter avant)')) return;
      localStorage.removeItem(KEY); st = load();
      build(); applyPreset(); save(); render(); centerView(); modal.close();
    };
  });
}

// ---------- Démarrage ----------
$('#tabs').addEventListener('click', e => {
  const el = e.target.closest('.tab'); if (!el) return;
  st.tab = el.dataset.tab; save(); render(); centerView();
});
$('#btn-menu').onclick = openMenu;
$('#btn-list').onclick = openCountryList;
$('#btn-new-tab').onclick = openTabForm;
// sur mobile la barre d'adresse redimensionne sans cesse : on ne perd pas le zoom du globe
window.addEventListener('resize', () => isGlobe() ? globeDraw() : centerView());

build();
const prefilled = applyPreset();
render();
centerView();
if (prefilled) setTimeout(() => toast({ icon: '🔮', type: 'challenge', title: `${prefilled} hauts faits pré-remplis — ☰ pour vérifier` }, 'L\'Oracle a parlé'), 800);
