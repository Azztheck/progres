'use strict';

const KEY = 'progres.v1';
const S = 52, COLW = 118, ROWH = 82;
const XP = { task: 10, goal: 25, challenge: 50 };
const TYPE_LABEL = { task: 'Progrès', goal: 'Objectif', challenge: 'Défi' };
const TOAST_TITLE = { task: 'Progrès réalisé !', goal: 'Objectif atteint !', challenge: 'Défi relevé !' };
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
    custom: [],     // nœuds perso { id, tab, parent, icon, title, desc, type, target, unit }
    customTabs: [{ id: 'mes', title: 'Mes quêtes', icon: '⭐', color: '#4a3b6b', root: 'mes.root' }],
    showHidden: false,
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
    nodes[o.id] = { id: o.id, icon: o.icon, title: o.title, desc: o.desc || '', type: o.type || 'task', target: o.target || 0, unit: o.unit || '', parent, tab, children: [] };
    if (parent) nodes[parent].children.push(o.id);
    (o.children || []).forEach(c => walk(c, o.id, tab));
  };
  for (const t of window.DEFAULT_TABS) {
    tabs.push({ id: t.id, title: t.title, icon: t.icon, color: t.color, root: t.tree.id });
    walk(t.tree, null, t.id);
  }
  for (const t of st.customTabs) tabs.push({ ...t, custom: true });
  for (const c of st.custom) nodes[c.id] = { type: 'task', target: 0, unit: '', desc: '', ...c, custom: true, children: [] };
  for (const c of st.custom) if (nodes[c.parent]) nodes[c.parent].children.push(c.id);
  if (!tabs.some(t => t.id === st.tab)) st.tab = tabs[0].id;
}

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
  return xp;
}
function levelOf(xp) { // chaque niveau coûte un peu plus que le précédent
  let lvl = 0, need = 40;
  while (xp >= need) { xp -= need; lvl++; need = 40 + lvl * 15; }
  return { lvl, cur: xp, need };
}

// ---------- Rendu ----------
function render() {
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
  $('#xptext').textContent = `${xp} XP · ${done}/${all.length} débloqués`;
}

function renderTabs() {
  $('#tabs').innerHTML = tabs.map(t => {
    const ns = tabNodes(t.id), d = ns.filter(n => st.done[n.id]).length;
    const pct = ns.length ? Math.round(d / ns.length * 100) : 0;
    return `<div class="tab ${t.id === st.tab ? 'active' : ''}" data-tab="${esc(t.id)}" style="--c:${esc(t.color)}" title="${esc(t.title)} — ${pct}%">
      <span class="t-ic">${esc(t.icon)}</span><span class="t-name">${esc(t.title)}</span><span class="t-pct"><i style="width:${pct}%"></i></span></div>`;
  }).join('');
}

let pos = {};
function renderTree() {
  const t = tabOf(st.tab);
  document.documentElement.style.setProperty('--tab', t.color);
  pos = {};
  let row = 0;
  const lay = (id, d) => {
    const kids = nodes[id].children.filter(visible);
    let y;
    if (!kids.length) y = row++ * ROWH;
    else { const ys = kids.map(k => lay(k, d + 1)); y = (ys[0] + ys[ys.length - 1]) / 2; }
    pos[id] = { x: d * COLW, y };
    return y;
  };
  if (nodes[t.root]) lay(t.root, 0);

  const ids = Object.keys(pos);
  let html = '', outs = '', ins = '', maxX = 0, maxY = 0;
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
    }
  }
  const svg = $('#links');
  svg.setAttribute('width', maxX + 10); svg.setAttribute('height', maxY + 10);
  svg.innerHTML = outs + ins;
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
  const cls = [n.type, nodeState(n), n.custom ? 'custom' : '', isHidden(n.id) ? 'hiddenn' : ''].join(' ');
  const style = p ? `left:${p.x}px;top:${p.y}px` : '';
  let bar = '';
  if (n.target && !st.done[n.id]) {
    const v = Math.min(1, (st.progress[n.id] || 0) / n.target);
    bar = `<div class="bar"><i style="width:${v * 100}%"></i></div>`;
  }
  return `<div class="node ${cls}" data-id="${esc(n.id)}" style="${style}"><div class="frame"><span class="ic">${esc(n.icon)}</span></div>${bar}</div>`;
}

// ---------- Vue : pan / zoom ----------
function applyView() {
  $('#viewport').style.transform = `translate(${view.x}px,${view.y}px) scale(${view.s})`;
  $('#stage').style.backgroundPosition = `${view.x}px ${view.y}px`;
}
function centerView() {
  const stage = $('#stage'), W = stage.clientWidth, H = stage.clientHeight - 60; // 60 : place pour l'info en bas
  const h = Math.max(...Object.values(pos).map(p => p.y)) + S + 14;
  const w = Math.max(...Object.values(pos).map(p => p.x)) + S;
  view.s = Math.max(.45, Math.min(1, (H - 20) / h, (W - 60) / w));
  view.x = Math.max(24, (W - w * view.s) / 2);
  view.y = h * view.s > H - 20 ? 20 : (H - h * view.s) / 2;
  applyView();
}
function zoomAt(f, cx, cy) {
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
    if (moved > 6) { view.x += dx; view.y += dy; applyView(); stage.classList.add('dragging'); hideHover(); }
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
  const el = e.target.closest('.node'); if (!el || $('#stage').classList.contains('dragging')) return;
  const n = nodes[el.dataset.id], done = st.done[n.id];
  let extra = '';
  if (done) extra = `<small>Débloqué le ${fmtDate(done)}</small>`;
  else if (n.target) extra = `<small>${st.progress[n.id] || 0} / ${n.target} ${esc(n.unit)}</small>`;
  hover.className = `${n.type} ${done ? 'done' : ''}`;
  hover.innerHTML = `<div class="h-title">${esc(n.title)}</div><div class="h-desc">${esc(n.desc)}${extra}</div>`;
  const r = el.getBoundingClientRect();
  hover.style.display = 'block';
  const left = Math.min(r.right + 8, window.innerWidth - hover.offsetWidth - 8);
  hover.style.left = left + 'px';
  hover.style.top = Math.min(r.top, window.innerHeight - hover.offsetHeight - 8) + 'px';
});
$('#nodes').addEventListener('mouseout', e => { if (e.target.closest('.node')) hideHover(); });

// ---------- Actions ----------
function setDone(id, on) {
  const n = nodes[id];
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
}

function setProgress(id, v) {
  const n = nodes[id];
  v = Math.max(0, Math.round(v * 100) / 100 || 0);
  st.progress[id] = v;
  save();
  if (n.target && v >= n.target && !st.done[id]) setDone(id, true);
  else render();
}

function toast(n, header) {
  const el = document.createElement('div');
  el.className = `toast ${n.type}`;
  el.innerHTML = `<div class="t-ic">${esc(n.icon)}</div><div><div class="t-h">${esc(header || TOAST_TITLE[n.type])}</div><div class="t-t">${esc(n.title)}</div></div>`;
  $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), 4800);
  ding(n.type);
}

let audio;
function ding(type) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const notes = type === 'challenge' ? [523, 659, 784, 1047, 1319] : [659, 988];
    notes.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + i * 0.09;
      o.type = 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
      o.connect(g).connect(audio.destination); o.start(t0); o.stop(t0 + 0.3);
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
        <div class="kind ${n.type}">${TYPE_LABEL[n.type]} · ${XP[n.type]} XP${n.custom ? ' · perso' : ''}</div>
        <h2>${esc(n.title)}</h2>
        <div class="crumbs">${esc(t.icon)} ${esc([t.title, ...crumbs].join(' › '))}</div>
      </div>
      <button type="button" class="mc x" data-close>✕</button>
    </div>
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
    m.querySelector('#b-toggle').onclick = () => { setDone(id, !done); openNode(id); };
    m.querySelector('#b-add').onclick = () => openForm({ parent: id, tab: n.tab });
    m.querySelector('#f-note').oninput = e => { const v = e.target.value.trim(); if (v) st.notes[id] = e.target.value; else delete st.notes[id]; save(); };
    const date = m.querySelector('#f-date');
    if (date) date.onchange = e => { if (e.target.value) { st.done[id] = e.target.value; save(); } };
    const pf = m.querySelector('#f-prog');
    if (pf) {
      pf.onchange = () => { setProgress(id, +pf.value); openNode(id); };
      m.querySelectorAll('[data-step]').forEach(b => b.onclick = () => { setProgress(id, (st.progress[id] || 0) + +b.dataset.step); openNode(id); });
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
        ${Object.keys(TYPE_LABEL).map(k => `<option value="${k}" ${n.type === k ? 'selected' : ''}>${TYPE_LABEL[k]} (${XP[k]} XP)</option>`).join('')}
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
    const ns = tabNodes(t.id), d = ns.filter(n => st.done[n.id]).length;
    return `<div class="stat">${esc(t.icon)} <span style="width:110px">${esc(t.title)}</span><div class="bigbar"><i style="width:${ns.length ? d / ns.length * 100 : 0}%"></i></div><span>${d}/${ns.length}</span></div>`;
  }).join('');
  show(`
    <div class="head"><h2>☰ Menu</h2><button type="button" class="mc x" data-close>✕</button></div>
    <h3>📜 Journal</h3>
    ${journal.length ? `<ul class="journal">${journal.map(([id, d]) => `<li data-id="${esc(id)}">${esc(nodes[id].icon)} ${esc(nodes[id].title)}<span class="d">${fmtDate(d)}</span></li>`).join('')}</ul>`
                     : '<p class="muted">Rien encore… va débloquer ton premier progrès !</p>'}
    <h3>📊 Par onglet</h3>${stats}
    <h3>⚙️ Réglages</h3>
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
    m.querySelector('.journal')?.addEventListener('click', e => {
      const li = e.target.closest('li'); if (!li) return;
      st.tab = nodes[li.dataset.id].tab; save(); render(); centerView(); openNode(li.dataset.id);
    });
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
        if (!confirm('Remplacer ta progression actuelle par ce fichier ?')) return;
        st = Object.assign(blank(), data);
        save(); build(); render(); centerView(); modal.close();
      } catch (e) { alert('Fichier invalide.'); }
    };
    m.querySelector('#b-reset').onclick = () => {
      if (!confirm('Effacer TOUTE ta progression et tes objectifs perso ?')) return;
      if (!confirm('Vraiment ? (pense à exporter avant)')) return;
      localStorage.removeItem(KEY); st = load();
      save(); build(); render(); centerView(); modal.close();
    };
  });
}

// ---------- Démarrage ----------
$('#tabs').addEventListener('click', e => {
  const el = e.target.closest('.tab'); if (!el) return;
  st.tab = el.dataset.tab; save(); render(); centerView();
});
$('#btn-menu').onclick = openMenu;
$('#btn-new-tab').onclick = openTabForm;
window.addEventListener('resize', () => centerView());

build();
render();
centerView();
