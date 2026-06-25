/* ============================================================
   RIVER OPS — TRIAGEM — APP.JS
   ============================================================ */

/* INDICES */
const IDX = {}; const SLAMIDX = {}; const NODEIDX = {};
ROTAS.forEach(r => r.municipios.forEach((m, i) => {
  const rec = { rota: r, mun: m, pos: i + 1, total: r.municipios.length,
    prev: r.municipios[i - 1] || null, next: r.municipios[i + 1] || null };
  IDX[m.cep] = rec; NODEIDX[String(m.seq)] = rec;
  if (m.slam) { if (!SLAMIDX[m.slam]) SLAMIDX[m.slam] = []; SLAMIDX[m.slam].push(rec); }
}));

/* ESTADO */
let ultimaRotaAtiva = null; let timerAutoLimpeza = null; let cur = 't';

/* bB: proxima saida de barco */
function normKey(s) { return s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
function pD(s) {
  if (!s) return [];
  const t = s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-feira/g, '');
  const o = new Set();
  Object.entries(DP).forEach(([k, v]) => { if (t.includes(k)) o.add(v); });
  return [...o].sort();
}
function bB(munNome) {
  const key = normKey(munNome); let embData = null;
  if (EMBS[key]) { embData = EMBS[key]; }
  else { const found = Object.keys(EMBS).find(k => key.includes(k) || k.includes(key)); if (found) embData = EMBS[found]; }
  if (!embData || !embData.estream || !embData.estream.length) return null;
  const hoje = new Date().getDay(); let melhor = null; let menorDias = 8;
  embData.estream.forEach(emb => {
    pD(emb.d).forEach(dNum => {
      let diff = dNum - hoje; if (diff < 0) diff += 7;
      if (diff < menorDias) { menorDias = diff; melhor = { days: diff, embarcacao: emb.n, porto: emb.p }; }
    });
  });
  return melhor;
}
function labelDays(d) {
  if (d === null || d === undefined) return { l: '---', c: 'ns' };
  if (d === 0) return { l: 'HOJE', c: 'nt' };
  if (d === 1) return { l: 'AMANHA', c: 'nw' };
  return { l: 'em ' + d + 'd', c: 'ns' };
}

/* TRIAGEM */
function onCI(v) {
  const text = v.trim().toUpperCase();
  if (!text) { document.getElementById('rcard').innerHTML = ''; return; }
  if (NODEIDX[text]) lookupNode(text);
}
function lookupNode(nodeId) { const hit = NODEIDX[nodeId]; if (hit) renderCard(hit); }
function onK(e) {
  const v = document.getElementById('ci').value.trim().toUpperCase();
  if (e.key === 'Enter' && v) {
    if (NODEIDX[v]) lookupNode(v);
    else { flashError(); }
  }
}
function flashError() {
  const ci = document.getElementById('ci'); ci.style.borderColor = '#ef4444';
  setTimeout(() => { ci.style.borderColor = ''; }, 600);
}

function renderCard(hit) {
  const rc = document.getElementById('rcard');
  const { rota: r, mun: m, prev, next, pos, total } = hit;
  const nb = bB(m.nome); const nx = nb ? labelDays(nb.days) : { l: '---', c: 'ns' };
  ultimaRotaAtiva = r.num;

  // Cancela timer anterior e define novo de 15 segundos
  if (timerAutoLimpeza) clearTimeout(timerAutoLimpeza);
  timerAutoLimpeza = setTimeout(() => {
    document.getElementById('ci').value = '';
    document.getElementById('ci').focus();
    rc.innerHTML = ''; rc.className = ''; ultimaRotaAtiva = null;
  }, 15000);

  // Info de barco
  let embInfo = '';
  if (nb) {
    embInfo = `
      <div style="margin-top:10px;padding:8px 12px;background:#0b0d11;border-radius:6px;border-left:3px solid ${r.cor};font-size:12px;color:#9ba3b4;">
        <span style="color:#fff;font-weight:700;">${nb.embarcacao}</span>
        ${nb.porto ? `<span style="color:#737a8c"> · ${nb.porto}</span>` : ''}
        <span style="color:${r.cor};font-weight:700;"> · ${nx.l}</span>
      </div>`;
  }

  // Municipio anterior e proximo
  const prevInfo = prev
    ? `<div style="font-size:11px;color:#737a8c;margin-top:4px;">⬅ Anterior: <b style="color:#9ba3b4">${prev.seq} — ${prev.nome}</b></div>`
    : `<div style="font-size:11px;color:#334155;margin-top:4px;">⬅ Primeiro da calha</div>`;
  const nextInfo = next
    ? `<div style="font-size:11px;color:#737a8c;margin-top:4px;">➡ Próximo: <b style="color:#9ba3b4">${next.seq} — ${next.nome}</b></div>`
    : `<div style="font-size:11px;color:#334155;margin-top:4px;">➡ Último da calha</div>`;

  rc.innerHTML = `
    <div class="rcm" style="border:2px solid ${r.cor};border-radius:12px;padding:18px;background:#12151b;">

      <!-- Header: node + calha -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="font-size:44px;font-weight:900;color:${r.cor};letter-spacing:2px;font-family:monospace;">${m.seq}</div>
        <div style="text-align:right;">
          <div style="background:${r.cor};padding:4px 12px;border-radius:6px;font-weight:900;color:#fff;font-size:12px;letter-spacing:1px;">CALHA ${r.nome.toUpperCase()}</div>
          <div style="font-size:10px;color:#737a8c;margin-top:4px;">Pos. ${pos} de ${total}</div>
        </div>
      </div>

      <!-- Nome do município -->
      <div style="font-size:26px;font-weight:800;color:#e8eaf0;margin-bottom:12px;">${m.nome}</div>

      <!-- Grid de infos -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;">
        <div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;">
          <div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Transit Time</div>
          <div style="font-size:18px;font-weight:900;color:${r.cor};">${m.tt}</div>
        </div>
        <div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;">
          <div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Distância</div>
          <div style="font-size:18px;font-weight:900;color:#e8eaf0;">${m.km} km</div>
        </div>
        <div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;">
          <div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Prox. Saída</div>
          <div style="font-size:18px;font-weight:900;color:${nx.c==='nt'?'#22c55e':nx.c==='nw'?'#f59e0b':'#9ba3b4'};">${nx.l}</div>
        </div>
      </div>

      <!-- Info de barco -->
      ${embInfo}

      <!-- Navegação da calha -->
      <div style="margin-top:12px;padding:10px;background:#0b0d11;border-radius:6px;border:1px solid #1a1e26;">
        <div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Calha ${r.nome}</div>
        ${prevInfo}
        ${nextInfo}
      </div>

    </div>`;
  rc.className = 'show';
  adicionarRecente(hit);
}

/* RECENTES */
let recentes = [];
function adicionarRecente(hit) {
  recentes = recentes.filter(x => x.mun.seq !== hit.mun.seq);
  recentes.unshift(hit); if (recentes.length > 6) recentes.pop();
  renderRecentes();
}
function renderRecentes() {
  const cont = document.getElementById('rchp'); if (!cont) return;
  const recb = document.getElementById('recb');
  if (!recentes.length) { recb.style.display = 'none'; return; }
  recb.style.display = '';
  cont.innerHTML = recentes.map(h =>
    `<button class="chip" style="border-color:${h.rota.cor};color:${h.rota.cor};" onclick="lookupNode('${h.mun.seq}')">${h.mun.seq}</button>`
  ).join('');
}

/* ABA ROTAS */
function bRO() {
  const body = document.getElementById('rbdy'); if (!body) return; body.innerHTML = '';
  ROTAS.forEach(r => {
    const mH = r.municipios.map(m =>
      `<div class="mrow" style="padding:10px 12px;background:#1a1e26;margin-bottom:4px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:12px;" onclick="lookupNode('${m.seq}');SS('t',document.querySelector('.htab'))">
        <span style="color:${r.cor};font-weight:900;font-family:monospace;font-size:13px;min-width:48px;">${m.seq}</span>
        <span style="flex:1;font-size:13px;">${m.nome}</span>
        <span style="font-size:11px;color:#737a8c;">TT: ${m.tt}</span>
      </div>`
    ).join('');
    let d = document.createElement('div');
    d.innerHTML = `<div style="font-weight:800;margin:14px 0 6px;color:${r.cor};font-size:12px;letter-spacing:1px;text-transform:uppercase;">Calha ${r.nome} - Rota ${r.num}</div>` + mH;
    body.appendChild(d);
  });
}
function fR(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.mrow').forEach(el =>
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none'
  );
}

/* =====================================================
   MAPA — labels A1, B2, etc. + filtro por rota
   ===================================================== */
let T = { s: 1, x: 0, y: 0 };
let rotaFiltrada = null;

function mapLabel(rotaNum, idx) { return rotaNum + idx; }

function renderMap() {
  const svg = document.getElementById('msvg'); if (!svg) return;
  svg.innerHTML = '';
  const NS = 'http://www.w3.org/2000/svg';
  const W = 900, H = 600;
  const LNG0 = -74.5, LNG1 = -53.5, LAT0 = -10.6, LAT1 = 2.7;
  function merc(lat) { return Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)); }
  const m0 = merc(LAT0), m1 = merc(LAT1);
  function proj(lat, lng) { return { x: (lng - LNG0) / (LNG1 - LNG0) * W, y: (m1 - merc(lat)) / (m1 - m0) * H }; }

  const defs = document.createElementNS(NS, 'defs');
  defs.innerHTML = '<pattern id="gr" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0L0 0 0 30" fill="none" stroke="#0f172a" stroke-width=".4"/></pattern><filter id="gw"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  svg.appendChild(defs);

  const g = document.createElementNS(NS, 'g'); g.id = 'mg';
  g.setAttribute('transform', `translate(${T.x},${T.y}) scale(${T.s})`);

  const bg = document.createElementNS(NS, 'rect'); bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#070c14'); g.appendChild(bg);
  const gr = document.createElementNS(NS, 'rect'); gr.setAttribute('width', W); gr.setAttribute('height', H); gr.setAttribute('fill', 'url(#gr)'); g.appendChild(gr);

  const bPts = AM_BORDER.map(([lat, lng]) => { const p = proj(lat, lng); return p.x + ',' + p.y; }).join(' ');
  const border = document.createElementNS(NS, 'polygon');
  border.setAttribute('points', bPts); border.setAttribute('fill', '#0f1b2d'); border.setAttribute('stroke', '#1e3552'); border.setAttribute('stroke-width', '2'); g.appendChild(border);

  RIOS.forEach(rv => {
    const pts = rv.coords.map(([lat, lng]) => { const p = proj(lat, lng); return p.x + ' ' + p.y; });
    const path = document.createElementNS(NS, 'polyline');
    path.setAttribute('points', pts.join(', ')); path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#0284c7'); path.setAttribute('stroke-width', rv.w);
    path.setAttribute('opacity', '0.75'); path.setAttribute('stroke-linecap', 'round'); g.appendChild(path);
  });

  const hub = proj(-3.119, -60.021);
  const hc = document.createElementNS(NS, 'circle');
  hc.setAttribute('cx', hub.x); hc.setAttribute('cy', hub.y); hc.setAttribute('r', '7'); hc.setAttribute('fill', '#14b8a6'); hc.setAttribute('filter', 'url(#gw)'); g.appendChild(hc);
  const hl = document.createElementNS(NS, 'text');
  hl.setAttribute('x', hub.x + 10); hl.setAttribute('y', hub.y + 4); hl.setAttribute('font-size', '8');
  hl.setAttribute('fill', '#14b8a6'); hl.setAttribute('font-weight', '900'); hl.setAttribute('font-family', 'monospace'); hl.textContent = 'SPO9'; g.appendChild(hl);

  ROTAS.forEach(r => {
    const ativo = rotaFiltrada === null || rotaFiltrada === r.num;
    const pts = r.municipios.map(m => LATLNG[m.cep] ? proj(LATLNG[m.cep].lat, LATLNG[m.cep].lng) : null).filter(Boolean);
    if (pts.length) {
      const lineCoords = [[hub.x, hub.y], ...pts.map(p => [p.x, p.y])];
      const polyPts = lineCoords.map(p => p[0] + ' ' + p[1]).join(', ');
      const line = document.createElementNS(NS, 'polyline');
      line.setAttribute('points', polyPts); line.setAttribute('fill', 'none');
      line.setAttribute('stroke', r.cor); line.setAttribute('stroke-width', ativo ? '2' : '1');
      line.setAttribute('opacity', ativo ? '0.55' : '0.07'); line.setAttribute('stroke-linecap', 'round'); g.appendChild(line);
    }
  });

  ROTAS.forEach(r => {
    const ativo = rotaFiltrada === null || rotaFiltrada === r.num;
    r.municipios.forEach((m, idx) => {
      const ll = LATLNG[m.cep]; if (!ll) return;
      const p = proj(ll.lat, ll.lng);
      const label = mapLabel(r.num, idx + 1);
      const grp = document.createElementNS(NS, 'g');
      grp.style.cursor = ativo ? 'pointer' : 'default';
      grp.style.opacity = ativo ? '1' : '0.07';

      const labelW = label.length <= 2 ? 26 : label.length === 3 ? 32 : 38;
      const bb = document.createElementNS(NS, 'rect');
      bb.setAttribute('x', p.x - labelW / 2); bb.setAttribute('y', p.y - 8);
      bb.setAttribute('width', String(labelW)); bb.setAttribute('height', '16'); bb.setAttribute('rx', '3');
      bb.setAttribute('fill', ativo ? r.cor : '#1a1e26');
      bb.setAttribute('stroke', r.cor); bb.setAttribute('stroke-width', ativo ? '0' : '0.8');
      if (ativo) bb.setAttribute('filter', 'url(#gw)');
      grp.appendChild(bb);

      const nt = document.createElementNS(NS, 'text');
      nt.setAttribute('x', p.x); nt.setAttribute('y', p.y + 3.5);
      nt.setAttribute('text-anchor', 'middle'); nt.setAttribute('font-size', '8');
      nt.setAttribute('font-weight', '900'); nt.setAttribute('fill', ativo ? '#fff' : r.cor);
      nt.setAttribute('font-family', 'monospace'); nt.textContent = label; grp.appendChild(nt);

      if (ativo) {
        grp.addEventListener('click', e => { e.stopPropagation(); showMapPopup(NODEIDX[m.seq], p, T, label); });
      }
      g.appendChild(grp);
    });
  });

  svg.appendChild(g);
}

/* POPUP DO MAPA */
function showMapPopup(hit, svgPt, transform, label) {
  let popup = document.getElementById('map-popup');
  if (!popup) {
    popup = document.createElement('div'); popup.id = 'map-popup';
    popup.style.cssText = 'position:absolute;z-index:200;background:#12151b;border-radius:10px;padding:14px 16px;min-width:210px;max-width:260px;box-shadow:0 4px 24px rgba(0,0,0,0.85);border:1px solid #232838;font-family:inherit;';
    document.getElementById('sc-m').appendChild(popup);
  }
  const { rota: r, mun: m } = hit;
  const nb = bB(m.nome); const nx = nb ? labelDays(nb.days) : { l: '---' };
  const svgEl = document.getElementById('msvg'); const rect = svgEl.getBoundingClientRect(); const sc = document.getElementById('sc-m').getBoundingClientRect();
  const ratioX = rect.width / 900, ratioY = rect.height / 600;
  const px = svgPt.x * transform.s * ratioX + transform.x * ratioX + (rect.left - sc.left) + 22;
  const py = svgPt.y * transform.s * ratioY + transform.y * ratioY + (rect.top - sc.top) - 75;
  popup.style.display = 'block';
  popup.style.left = Math.min(Math.max(px, 8), sc.width - 270) + 'px';
  popup.style.top = Math.max(py, 8) + 'px';
  popup.style.pointerEvents = 'none';
  popup.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="font-size:22px;font-weight:900;color:${r.cor};font-family:monospace;">${label}</span>
      <span style="font-size:10px;background:${r.cor}22;color:${r.cor};padding:2px 8px;border-radius:4px;font-weight:700;">Rota ${r.num}</span>
    </div>
    <div style="font-size:11px;color:#555;margin-bottom:4px;font-family:monospace;">${m.seq}</div>
    <div style="font-size:15px;font-weight:700;color:#e8eaf0;margin-bottom:8px;">${m.nome}</div>
    <div style="font-size:11px;color:#737a8c;display:flex;flex-direction:column;gap:4px;">
      <span>TT: <b style="color:#9ba3b4">${m.tt}</b></span>
      <span>${m.km} km de Manaus</span>
      <span>Prox. saida: <b style="color:#14b8a6">${nx.l}</b></span>
      ${nb ? `<span style="color:#555">${nb.embarcacao}${nb.porto ? ' - ' + nb.porto : ''}</span>` : ''}
    </div>
    <div style="margin-top:10px;border-top:1px solid #232838;padding-top:8px;">
      <button onclick="irParaTriagem('${m.seq}')" style="width:100%;background:${r.cor};border:none;color:#fff;padding:8px;border-radius:5px;font-weight:800;cursor:pointer;font-size:12px;pointer-events:all;">
        BIPAR ESTE NODE
      </button>
    </div>`;
  setTimeout(() => { popup.style.pointerEvents = 'all'; document.addEventListener('click', fecharPopupMapa, { once: true }); }, 50);
}
function fecharPopupMapa() { const p = document.getElementById('map-popup'); if (p) p.style.display = 'none'; }
function irParaTriagem(nodeSeq) {
  fecharPopupMapa(); SS('t', document.querySelector('.htab'));
  setTimeout(() => { const ci = document.getElementById('ci'); ci.value = nodeSeq; lookupNode(nodeSeq); ci.focus(); }, 100);
}

/* FILTRO DE ROTA */
function filtrarRota(num) {
  rotaFiltrada = (rotaFiltrada === num) ? null : num;
  document.querySelectorAll('.mfbtn').forEach(b => {
    const isActive = b.dataset.rota === rotaFiltrada;
    b.style.opacity = (rotaFiltrada === null || isActive) ? '1' : '0.3';
    b.style.transform = isActive ? 'scale(1.1)' : 'scale(1)';
    b.style.fontWeight = isActive ? '900' : '700';
  });
  fecharPopupMapa(); renderMap();
}
function buildMapFilters() {
  const cont = document.getElementById('map-filters'); if (!cont) return;
  cont.innerHTML = '';
  const all = document.createElement('button'); all.className = 'mfbtn'; all.dataset.rota = '';
  all.textContent = 'TODAS';
  all.style.cssText = 'background:#1a1e26;border:1px solid #334155;color:#e8eaf0;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;letter-spacing:.5px;transition:all .15s;white-space:nowrap;';
  all.onclick = () => { rotaFiltrada = null; document.querySelectorAll('.mfbtn').forEach(b => { b.style.opacity='1'; b.style.transform='scale(1)'; b.style.fontWeight='700'; }); fecharPopupMapa(); renderMap(); };
  cont.appendChild(all);
  ROTAS.forEach(r => {
    const btn = document.createElement('button'); btn.className = 'mfbtn'; btn.dataset.rota = r.num; btn.textContent = r.num; btn.title = r.nome;
    btn.style.cssText = `background:${r.cor}22;border:1.5px solid ${r.cor};color:${r.cor};padding:6px 10px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;min-width:38px;transition:all .15s;letter-spacing:.5px;`;
    btn.onclick = () => filtrarRota(r.num);
    cont.appendChild(btn);
  });
}

/* INTERACOES DO MAPA */
function initMapInteractions() {
  const msvg = document.getElementById('msvg'); if (!msvg) return;
  let drag = false, ds = {};
  msvg.addEventListener('mousedown', e => { drag = true; ds = { x: e.clientX - T.x, y: e.clientY - T.y }; });
  document.addEventListener('mousemove', e => {
    if (!drag) return; T.x = e.clientX - ds.x; T.y = e.clientY - ds.y;
    const mg = document.getElementById('mg'); if (mg) mg.setAttribute('transform', `translate(${T.x},${T.y}) scale(${T.s})`);
  });
  document.addEventListener('mouseup', () => { drag = false; });
  msvg.addEventListener('touchstart', e => {
    if (e.touches.length === 1) { drag = true; ds = { x: e.touches[0].clientX - T.x, y: e.touches[0].clientY - T.y }; }
  }, { passive: true });
  msvg.addEventListener('touchmove', e => {
    if (!drag || e.touches.length !== 1) return; T.x = e.touches[0].clientX - ds.x; T.y = e.touches[0].clientY - ds.y;
    const mg = document.getElementById('mg'); if (mg) mg.setAttribute('transform', `translate(${T.x},${T.y}) scale(${T.s})`);
  }, { passive: true });
  msvg.addEventListener('touchend', () => { drag = false; });
  let lastDist = null;
  msvg.addEventListener('touchstart', e => { if (e.touches.length === 2) lastDist = null; }, { passive: true });
  msvg.addEventListener('touchmove', e => {
    if (e.touches.length !== 2) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (lastDist) { T.s = Math.min(Math.max(T.s * dist / lastDist, 0.5), 8); const mg = document.getElementById('mg'); if (mg) mg.setAttribute('transform', `translate(${T.x},${T.y}) scale(${T.s})`); }
    lastDist = dist;
  }, { passive: true });
}
function zI() { T.s = Math.min(T.s * 1.3, 8); renderMap(); }
function zO() { T.s = Math.max(T.s / 1.3, 0.5); renderMap(); }
function zR() { T = { s: 1, x: 0, y: 0 }; rotaFiltrada = null; renderMap(); buildMapFilters(); }

/* PORTOS */
let manifestoPortos = { esc: [], rod: [], 'v-rod': [] };
const LISTA_PADRAO_PORTOS = {
  esc:     ['RAU9','RUC9','RAO9','RUR9','RRE9','RQI9','RPI9','RAN9','RNA9','RNO9','RDA9','RBR9','RTP9','RCR9','RJR9'].map(k => NODEIDX[k]).filter(Boolean),
  rod:     ['RME9','RRA9','RBA9','RPA9','RCO9','RTE9','RAL9','RUA9','RAA9','RJA9','RFO9','RJT9','RIN9','RTO9','RAM9','RUI9','RBE9','RAT9','RUT9','RBC9','RSG9'].map(k => NODEIDX[k]).filter(Boolean),
  'v-rod': ['RNH9','RBO9','RPU9','RMN9','RID9','RMP9','RPF9','RBL9','RPE9','RIT9','RNR9','RSV9','RIP9','RCC9','RAP9','RHM9','RLB9'].map(k => NODEIDX[k]).filter(Boolean)
};
function popularSeletorPortos() {
  const select = document.getElementById('p-select-mun'); if (!select) return; select.innerHTML = '';
  ROTAS.forEach(r => r.municipios.forEach(m => {
    let opt = document.createElement('option'); opt.value = m.seq; opt.textContent = '[' + m.seq + '] ' + m.nome; select.appendChild(opt);
  }));
}
function addMunToPorto() {
  const nodeVal = document.getElementById('p-select-mun').value;
  const targetPorto = document.getElementById('p-select-target').value;
  const hit = NODEIDX[nodeVal]; if (!hit) return;
  const jaExiste = [...manifestoPortos.esc, ...manifestoPortos.rod, ...manifestoPortos['v-rod']].some(x => x && x.mun.seq === hit.mun.seq);
  if (jaExiste) { alert('Municipio ja esta distribuido.'); return; }
  manifestoPortos[targetPorto].push(hit); renderTabelaPortos();
}
function removeMunPorto(porto, seq) {
  manifestoPortos[porto] = manifestoPortos[porto].filter(x => x && x.mun.seq !== seq); renderTabelaPortos();
}
function renderTabelaPortos() {
  ['esc', 'rod', 'v-rod'].forEach(p => {
    const container = document.querySelector('#col-' + p + ' .p-items-list'); if (!container) return;
    container.innerHTML = '';
    const titulo = document.querySelector('#col-' + p + ' .p-col-title');
    if (titulo) { const nomes = { esc: 'PORTO ESCADARIA', rod: 'PORTO ROADWAY', 'v-rod': 'RODOVIARIO' }; titulo.textContent = nomes[p] + ' (' + manifestoPortos[p].length + ')'; }
    manifestoPortos[p].forEach(hit => {
      if (!hit) return;
      let item = document.createElement('div'); item.className = 'p-item';
      item.innerHTML = '<span><b style="font-family:monospace">' + hit.mun.seq + '</b> - ' + hit.mun.nome + '</span><button onclick="removeMunPorto(\'' + p + '\',\'' + hit.mun.seq + '\')">X</button>';
      container.appendChild(item);
    });
  });
}
function resetarTabelaPortos() {
  manifestoPortos.esc = [...LISTA_PADRAO_PORTOS.esc];
  manifestoPortos.rod = [...LISTA_PADRAO_PORTOS.rod];
  manifestoPortos['v-rod'] = [...LISTA_PADRAO_PORTOS['v-rod']];
  renderTabelaPortos();
}
function gerarImagemWhatsapp() {
  const area = document.getElementById('capture-area');
  if (typeof html2canvas === 'undefined') { alert('html2canvas nao carregado.'); return; }
  html2canvas(area, { backgroundColor: '#0b0d11', scale: 2 }).then(canvas => {
    let link = document.createElement('a'); link.download = 'despacho-facil-express.png'; link.href = canvas.toDataURL(); link.click();
  });
}

/* NAVEGACAO */
function SS(name, btn) {
  cur = name;
  ['t', 'r', 'm', 'l'].forEach(s => { const el = document.getElementById('sc-' + s); if (el) el.className = (s === name) ? 'scr' : 'scr h'; });
  if (btn) { document.querySelectorAll('.htab').forEach(b => b.classList.remove('on')); btn.classList.add('on'); }
  ['t', 'r', 'm', 'l'].forEach(s => { const bt = document.getElementById('bt-' + s); if (bt) bt.classList.toggle('on', s === name); });
  if (name === 'm') { buildMapFilters(); renderMap(); initMapInteractions(); }
  if (name === 'l') { popularSeletorPortos(); renderTabelaPortos(); }
  if (name === 't') { setTimeout(() => { const ci = document.getElementById('ci'); if (ci) ci.focus(); }, 100); }
}

/* INIT */
bRO(); resetarTabelaPortos(); renderRecentes();
window.addEventListener('load', () => { const ci = document.getElementById('ci'); if (ci) ci.focus(); });
