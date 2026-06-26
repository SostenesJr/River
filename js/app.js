```javascript
/* ============================================================
   RIVER OPS — TRIAGEM — APP.JS
   ============================================================ */

const IDX = {}; const SLAMIDX = {}; const NODEIDX = {};
ROTAS.forEach(function(r) {
  r.municipios.forEach(function(m, i) {
    var rec = {
      rota: r, mun: m,
      pos: i + 1,
      total: r.municipios.length,
      prev: r.municipios[i - 1] || null,
      next: r.municipios[i + 1] || null
    };
    IDX[m.cep] = rec;
    NODEIDX[String(m.seq)] = rec;
    if (m.slam) { if (!SLAMIDX[m.slam]) SLAMIDX[m.slam] = []; SLAMIDX[m.slam].push(rec); }
  });
});

var ultimaRotaAtiva = null;
var timerAutoLimpeza = null;
var cur = 't';

function normKey(s) { return s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

function pD(s) {
  if (!s) return [];
  var t = s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-feira/g, '');
  var o = new Set();
  Object.entries(DP).forEach(function(entry) { if (t.includes(entry[0])) o.add(entry[1]); });
  return Array.from(o).sort();
}

function bB(munNome) {
  var key = normKey(munNome); var embData = null;
  if (EMBS[key]) { embData = EMBS[key]; }
  else {
    var found = Object.keys(EMBS).find(function(k) { return key.includes(k) || k.includes(key); });
    if (found) embData = EMBS[found];
  }
  if (!embData || !embData.estream || !embData.estream.length) return null;
  var hoje = new Date().getDay(); var melhor = null; var menorDias = 8;
  embData.estream.forEach(function(emb) {
    pD(emb.d).forEach(function(dNum) {
      var diff = dNum - hoje; if (diff < 0) diff += 7;
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

function onCI(v) {
  var text = v.trim().toUpperCase();
  if (!text) { document.getElementById('rcard').innerHTML = ''; return; }
  if (NODEIDX[text]) lookupNode(text);
}

function lookupNode(nodeId) { var hit = NODEIDX[nodeId]; if (hit) renderCard(hit); }

function onK(e) {
  var v = document.getElementById('ci').value.trim().toUpperCase();
  if (e.key === 'Enter' && v) { if (NODEIDX[v]) lookupNode(v); else flashError(); }
}

function flashError() {
  var ci = document.getElementById('ci');
  ci.style.borderColor = '#ef4444';
  setTimeout(function() { ci.style.borderColor = ''; }, 600);
}

function renderCard(hit) {
  var rc = document.getElementById('rcard');
  var r = hit.rota; var m = hit.mun; var prev = hit.prev; var next = hit.next;
  var pos = hit.pos; var total = hit.total;
  var nb = bB(m.nome);
  var nx = nb ? labelDays(nb.days) : { l: '---', c: 'ns' };
  var corNx = nx.c === 'nt' ? '#22c55e' : nx.c === 'nw' ? '#f59e0b' : '#9ba3b4';
  ultimaRotaAtiva = r.num;

  if (timerAutoLimpeza) clearTimeout(timerAutoLimpeza);
  timerAutoLimpeza = setTimeout(function() {
    document.getElementById('ci').value = '';
    document.getElementById('ci').focus();
    rc.innerHTML = ''; rc.className = ''; ultimaRotaAtiva = null;
  }, 15000);

  var embInfo = nb
    ? '<div style="margin-top:10px;padding:8px 12px;background:#0b0d11;border-radius:6px;border-left:3px solid ' + r.cor + ';font-size:12px;color:#9ba3b4;">'
      + '<span style="color:#fff;font-weight:700;">' + nb.embarcacao + '</span>'
      + (nb.porto ? '<span style="color:#737a8c;"> · ' + nb.porto + '</span>' : '')
      + '<span style="color:' + r.cor + ';font-weight:700;"> · ' + nx.l + '</span>'
      + '</div>'
    : '';

  var prevInfo = prev
    ? '<div style="font-size:11px;color:#737a8c;margin-top:4px;">⬅ Anterior: <b style="color:#9ba3b4">' + prev.seq + ' — ' + prev.nome + '</b></div>'
    : '<div style="font-size:11px;color:#334155;margin-top:4px;">⬅ Primeiro da calha</div>';

  var nextInfo = next
    ? '<div style="font-size:11px;color:#737a8c;margin-top:4px;">➡ Próximo: <b style="color:#9ba3b4">' + next.seq + ' — ' + next.nome + '</b></div>'
    : '<div style="font-size:11px;color:#334155;margin-top:4px;">➡ Último da calha</div>';

  rc.innerHTML =
    '<div class="rcm" style="border:2px solid ' + r.cor + ';border-radius:12px;padding:18px;background:#12151b;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
    + '<div style="font-size:44px;font-weight:900;color:' + r.cor + ';letter-spacing:2px;font-family:monospace;">' + m.seq + '</div>'
    + '<div style="text-align:right;">'
    + '<div style="background:' + r.cor + ';padding:4px 12px;border-radius:6px;font-weight:900;color:#fff;font-size:12px;letter-spacing:1px;">CALHA ' + r.nome.toUpperCase() + '</div>'
    + '<div style="font-size:10px;color:#737a8c;margin-top:4px;">Pos. ' + pos + ' de ' + total + '</div>'
    + '</div></div>'
    + '<div style="font-size:26px;font-weight:800;color:#e8eaf0;margin-bottom:12px;">' + m.nome + '</div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;">'
    + '<div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;"><div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Transit Time</div><div style="font-size:18px;font-weight:900;color:' + r.cor + ';">' + m.tt + '</div></div>'
    + '<div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;"><div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Distância</div><div style="font-size:18px;font-weight:900;color:#e8eaf0;">' + m.km + ' km</div></div>'
    + '<div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;"><div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Prox. Saída</div><div style="font-size:18px;font-weight:900;color:' + corNx + ';">' + nx.l + '</div></div>'
    + '</div>'
    + embInfo
    + '<div style="margin-top:12px;padding:10px;background:#0b0d11;border-radius:6px;border:1px solid #1a1e26;">'
    + '<div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Calha ' + r.nome + '</div>'
    + prevInfo + nextInfo
    + '</div></div>';

  rc.className = 'show';
  adicionarRecente(hit);
}

var recentes = [];

function adicionarRecente(hit) {
  recentes = recentes.filter(function(x) { return x.mun.seq !== hit.mun.seq; });
  recentes.unshift(hit); if (recentes.length > 6) recentes.pop();
  renderRecentes();
}

function renderRecentes() {
  var cont = document.getElementById('rchp'); if (!cont) return;
  var recb = document.getElementById('recb');
  if (!recentes.length) { recb.style.display = 'none'; return; }
  recb.style.display = '';
  cont.innerHTML = recentes.map(function(h) {
    return '<button class="chip" style="border-color:' + h.rota.cor + ';color:' + h.rota.cor + ';" onclick="lookupNode(\'' + h.mun.seq + '\')">' + h.mun.seq + '</button>';
  }).join('');
}

/* ── ABA ROTAS ── */
function bRO() {
  var body = document.getElementById('rbdy'); if (!body) return; body.innerHTML = '';
  ROTAS.forEach(function(r) {
    var header = '<div style="font-weight:800;margin:18px 0 8px;color:' + r.cor + ';font-size:12px;letter-spacing:1px;text-transform:uppercase;padding:8px 12px;background:#12151b;border-radius:6px;border-left:3px solid ' + r.cor + ';">'
      + 'Calha ' + r.nome + ' · Rota ' + r.num + ' · ' + r.municipios.length + ' municípios · ' + r.dir + '</div>';

    var mH = r.municipios.map(function(m, i) {
      var prev = r.municipios[i - 1] || null;
      var next = r.municipios[i + 1] || null;
      var nb = bB(m.nome);
      var nx = nb ? labelDays(nb.days) : { l: '---', c: 'ns' };
      var corNx = nx.c === 'nt' ? '#22c55e' : nx.c === 'nw' ? '#f59e0b' : '#9ba3b4';

      var embLine = nb
        ? '<div style="margin-top:5px;font-size:11px;color:#737a8c;">🚢 <b style="color:#e8eaf0;">' + nb.embarcacao + '</b>'
          + (nb.porto ? ' · ' + nb.porto : '') + ' · <b style="color:' + corNx + ';">' + nx.l + '</b></div>'
        : '';

      var navLine = '<div style="margin-top:5px;font-size:11px;color:#555;display:flex;gap:12px;flex-wrap:wrap;">'
        + (prev ? '<span>⬅ <b style="color:#737a8c;font-family:monospace;">' + prev.seq + '</b> ' + prev.nome + '</span>' : '<span style="color:#2a2e3a;">⬅ Início</span>')
        + (next ? '<span>➡ <b style="color:#737a8c;font-family:monospace;">' + next.seq + '</b> ' + next.nome + '</span>' : '<span style="color:#2a2e3a;">➡ Fim</span>')
        + '</div>';

      return '<div class="mrow" style="padding:12px 14px;background:#1a1e26;margin-bottom:4px;border-radius:6px;cursor:pointer;border-left:2px solid ' + r.cor + '44;" onclick="abrirModalRota(\'' + m.seq + '\')">'
        + '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">'
        + '<span style="color:' + r.cor + ';font-weight:900;font-family:monospace;font-size:14px;min-width:50px;">' + m.seq + '</span>'
        + '<span style="flex:1;font-size:14px;font-weight:700;color:#e8eaf0;">' + m.nome + '</span>'
        + '<div style="display:flex;gap:8px;flex-shrink:0;">'
        + '<span style="background:#0b0d11;padding:3px 8px;border-radius:4px;font-size:11px;color:#9ba3b4;">TT: <b>' + m.tt + '</b></span>'
        + '<span style="background:#0b0d11;padding:3px 8px;border-radius:4px;font-size:11px;color:#9ba3b4;"><b>' + m.km + '</b> km</span>'
        + '</div></div>'
        + embLine + navLine + '</div>';
    }).join('');

    var d = document.createElement('div');
    d.innerHTML = header + mH;
    body.appendChild(d);
  });
}

function fR(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.mrow').forEach(function(el) {
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

/* ── MODAL ROTAS ── */
function abrirModalRota(nodeSeq) {
  var hit = NODEIDX[nodeSeq]; if (!hit) return;
  var r = hit.rota; var m = hit.mun; var prev = hit.prev; var next = hit.next;
  var pos = hit.pos; var total = hit.total;
  var nb = bB(m.nome);
  var nx = nb ? labelDays(nb.days) : { l: '---', c: 'ns' };
  var corNx = nx.c === 'nt' ? '#22c55e' : nx.c === 'nw' ? '#f59e0b' : '#9ba3b4';

  var old = document.getElementById('modal-rota'); if (old) old.remove();

  var embInfo = nb
    ? '<div style="margin-top:10px;padding:8px 12px;background:#0b0d11;border-radius:6px;border-left:3px solid ' + r.cor + ';font-size:12px;color:#9ba3b4;">'
      + '<span style="color:#fff;font-weight:700;">🚢 ' + nb.embarcacao + '</span>'
      + (nb.porto ? '<span style="color:#737a8c;"> · ' + nb.porto + '</span>' : '')
      + '<span style="color:' + r.cor + ';font-weight:700;"> · ' + nx.l + '</span></div>'
    : '';

  var prevHTML = prev
    ? '<div style="font-size:12px;color:#9ba3b4;margin-bottom:6px;cursor:pointer;padding:4px;border-radius:4px;" onclick="abrirModalRota(\'' + prev.seq + '\')">⬅ <b style="color:#e8eaf0;font-family:monospace;">' + prev.seq + '</b> — ' + prev.nome + '</div>'
    : '<div style="font-size:12px;color:#2a2e3a;margin-bottom:6px;">⬅ Início da calha</div>';

  var nextHTML = next
    ? '<div style="font-size:12px;color:#9ba3b4;margin-top:6px;cursor:pointer;padding:4px;border-radius:4px;" onclick="abrirModalRota(\'' + next.seq + '\')">➡ <b style="color:#e8eaf0;font-family:monospace;">' + next.seq + '</b> — ' + next.nome + '</div>'
    : '<div style="font-size:12px;color:#2a2e3a;margin-top:6px;">➡ Fim da calha</div>';

  var overlay = document.createElement('div');
  overlay.id = 'modal-rota';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.78);z-index:999;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;';

  overlay.innerHTML =
    '<div style="background:#12151b;border-radius:14px;padding:20px;width:100%;max-width:420px;border:2px solid ' + r.cor + ';box-shadow:0 8px 40px rgba(0,0,0,0.9);position:relative;">'
    + '<button onclick="document.getElementById(\'modal-rota\').remove()" style="position:absolute;top:12px;right:12px;background:#1a1e26;border:none;color:#737a8c;width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer;font-weight:900;">✕</button>'
    + '<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">'
    + '<div style="font-size:38px;font-weight:900;color:' + r.cor + ';font-family:monospace;letter-spacing:2px;">' + m.seq + '</div>'
    + '<div><div style="background:' + r.cor + ';padding:3px 10px;border-radius:5px;font-size:11px;font-weight:900;color:#fff;letter-spacing:1px;display:inline-block;">CALHA ' + r.nome.toUpperCase() + '</div>'
    + '<div style="font-size:10px;color:#737a8c;margin-top:3px;">Pos. ' + pos + ' de ' + total + '</div></div></div>'
    + '<div style="font-size:22px;font-weight:800;color:#e8eaf0;margin-bottom:14px;">' + m.nome + '</div>'
    + '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;">'
    + '<div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;"><div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Transit Time</div><div style="font-size:18px;font-weight:900;color:' + r.cor + ';">' + m.tt + '</div></div>'
    + '<div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;"><div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Distância</div><div style="font-size:18px;font-weight:900;color:#e8eaf0;">' + m.km + ' km</div></div>'
    + '<div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;"><div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Prox. Saída</div><div style="font-size:18px;font-weight:900;color:' + corNx + ';">' + nx.l + '</div></div>'
    + '</div>'
    + embInfo
    + '<div style="margin-top:10px;padding:10px;background:#0b0d11;border-radius:6px;border:1px solid #1a1e26;">'
    + '<div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Navegação da Calha</div>'
    + prevHTML
    + '<div style="font-size:12px;color:' + r.cor + ';font-weight:700;padding:6px 4px;border-top:1px solid #1a1e26;border-bottom:1px solid #1a1e26;margin:2px 0;">● ' + m.nome + '</div>'
    + nextHTML
    + '</div></div>';

  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ── MAPA ── */
var T = { s: 1, x: 0, y: 0 };
var rotaFiltrada = null;

function mapLabel(rotaNum, idx) { return rotaNum + idx; }

function renderMap() {
  var svg = document.getElementById('msvg'); if (!svg) return;
  svg.innerHTML = '';
  var NS = 'http://www.w3.org/2000/svg';
  var W = 900, H = 600;
  var LNG0 = -74.5, LNG1 = -53.5, LAT0 = -10.6, LAT1 = 2.7;
  function merc(lat) { return Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)); }
  var m0 = merc(LAT0), m1 = merc(LAT1);
  function proj(lat, lng) { return { x: (lng - LNG0) / (LNG1 - LNG0) * W, y: (m1 - merc(lat)) / (m1 - m0) * H }; }

  var defs = document.createElementNS(NS, 'defs');
  defs.innerHTML = '<pattern id="gr" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0L0 0 0 30" fill="none" stroke="#0f172a" stroke-width=".4"/></pattern><filter id="gw"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  svg.appendChild(defs);

  var g = document.createElementNS(NS, 'g'); g.id = 'mg';
  g.setAttribute('transform', 'translate(' + T.x + ',' + T.y + ') scale(' + T.s + ')');

  var bg = document.createElementNS(NS, 'rect'); bg.setAttribute('width', W); bg.setAttribute('height', H); bg.setAttribute('fill', '#070c14'); g.appendChild(bg);
  var gr = document.createElementNS(NS, 'rect'); gr.setAttribute('width', W); gr.setAttribute('height', H); gr.setAttribute('fill', 'url(#gr)'); g.appendChild(gr);

  var bPts = AM_BORDER.map(function(c) { var p = proj(c[0], c[1]); return p.x + ',' + p.y; }).join(' ');
  var border = document.createElementNS(NS, 'polygon');
  border.setAttribute('points', bPts); border.setAttribute('fill', '#0f1b2d'); border.setAttribute('stroke', '#1e3552'); border.setAttribute('stroke-width', '2'); g.appendChild(border);

  RIOS.forEach(function(rv) {
    var pts = rv.coords.map(function(c) { var p = proj(c[0], c[1]); return p.x + ' ' + p.y; });
    var path = document.createElementNS(NS, 'polyline');
    path.setAttribute('points', pts.join(', ')); path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#0284c7'); path.setAttribute('stroke-width', rv.w);
    path.setAttribute('opacity', '0.75'); path.setAttribute('stroke-linecap', 'round'); g.appendChild(path);
  });

  var hub = proj(-3.119, -60.021);
  var hc = document.createElementNS(NS, 'circle');
  hc.setAttribute('cx', hub.x); hc.setAttribute('cy', hub.y); hc.setAttribute('r', '7'); hc.setAttribute('fill', '#14b8a6'); hc.setAttribute('filter', 'url(#gw)'); g.appendChild(hc);
  var hl = document.createElementNS(NS, 'text');
  hl.setAttribute('x', hub.x + 10); hl.setAttribute('y', hub.y + 4); hl.setAttribute('font-size', '8');
  hl.setAttribute('fill', '#14b8a6'); hl.setAttribute('font-weight', '900'); hl.setAttribute('font-family', 'monospace'); hl.textContent = 'SPO9'; g.appendChild(hl);

  ROTAS.forEach(function(r) {
    var ativo = rotaFiltrada === null || rotaFiltrada === r.num;
    var pts = r.municipios.map(function(m) { return LATLNG[m.cep] ? proj(LATLNG[m.cep].lat, LATLNG[m.cep].lng) : null; }).filter(Boolean);
    if (pts.length) {
      var lineCoords = [[hub.x, hub.y]].concat(pts.map(function(p) { return [p.x, p.y]; }));
      var polyPts = lineCoords.map(function(p) { return p[0] + ' ' + p[1]; }).join(', ');
      var line = document.createElementNS(NS, 'polyline');
      line.setAttribute('points', polyPts); line.setAttribute('fill', 'none');
      line.setAttribute('stroke', r.cor); line.setAttribute('stroke-width', ativo ? '2' : '1');
      line.setAttribute('opacity', ativo ? '0.55' : '0.07'); line.setAttribute('stroke-linecap', 'round'); g.appendChild(line);
    }
  });

  ROTAS.forEach(function(r) {
    var ativo = rotaFiltrada === null || rotaFiltrada === r.num;
    r.municipios.forEach(function(m, idx) {
      var ll = LATLNG[m.cep]; if (!ll) return;
      var p = proj(ll.lat, ll.lng);
      var label = mapLabel(r.num, idx + 1);
      var grp = document.createElementNS(NS, 'g');
      grp.style.cursor = ativo ? 'pointer' : 'default';
      grp.style.opacity = ativo ? '1' : '0.07';

      var labelW = label.length <= 2 ? 26 : label.length === 3 ? 32 : 38;
      var bb = document.createElementNS(NS, 'rect');
      bb.setAttribute('x', p.x - labelW / 2); bb.setAttribute('y', p.y - 8);
      bb.setAttribute('width', String(labelW)); bb.setAttribute('height', '16'); bb.setAttribute('rx', '3');
      bb.setAttribute('fill', ativo ? r.cor : '#1a1e26');
      bb.setAttribute('stroke', r.cor); bb.setAttribute('stroke-width', ativo ? '0' : '0.8');
      if (ativo) bb.setAttribute('filter', 'url(#gw)');
      grp.appendChild(bb);

      var nt = document.createElementNS(NS, 'text');
      nt.setAttribute('x', p.x); nt.setAttribute('y', p.y + 3.5);
      nt.setAttribute('text-anchor', 'middle'); nt.setAttribute('font-size', '8');
      nt.setAttribute('font-weight', '900'); nt.setAttribute('fill', ativo ? '#fff' : r.cor);
      nt.setAttribute('font-family', 'monospace'); nt.textContent = label; grp.appendChild(nt);

      if (ativo) {
        grp.addEventListener('click', function(e) { e.stopPropagation(); showMapPopup(NODEIDX[m.seq], p, T, label); });
      }
      g.appendChild(grp);
    });
  });

  svg.appendChild(g);
}

function showMapPopup(hit, svgPt, transform, label) {
  var popup = document.getElementById('map-popup');
  if (!popup) {
    popup = document.createElement('div'); popup.id = 'map-popup';
    popup.style.cssText = 'position:absolute;z-index:200;background:#12151b;border-radius:10px;padding:14px 16px;min-width:210px;max-width:270px;box-shadow:0 4px 24px rgba(0,0,0,0.85);border:1px solid #232838;font-family:inherit;';
    document.getElementById('sc-m').appendChild(popup);
  }
  var r = hit.rota; var m = hit.mun; var prev = hit.prev; var next = hit.next;
  var nb = bB(m.nome); var nx = nb ? labelDays(nb.days) : { l: '---' };
  var svgEl = document.getElementById('msvg');
  var rect = svgEl.getBoundingClientRect();
  var sc = document.getElementById('sc-m').getBoundingClientRect();
  var ratioX = rect.width / 900, ratioY = rect.height / 600;
  var px = svgPt.x * transform.s * ratioX + transform.x * ratioX + (rect.left - sc.left) + 22;
  var py = svgPt.y * transform.s * ratioY + transform.y * ratioY + (rect.top - sc.top) - 75;
  popup.style.display = 'block';
  popup.style.left = Math.min(Math.max(px, 8), sc.width - 280) + 'px';
  popup.style.top = Math.max(py, 8) + 'px';
  popup.style.pointerEvents = 'none';

  popup.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
    + '<span style="font-size:20px;font-weight:900;color:' + r.cor + ';font-family:monospace;">' + label + '</span>'
    + '<span style="font-size:10px;background:' + r.cor + '22;color:' + r.cor + ';padding:2px 8px;border-radius:4px;font-weight:700;">' + r.nome.toUpperCase() + '</span></div>'
    + '<div style="font-size:16px;font-weight:800;color:#e8eaf0;margin-bottom:10px;">' + m.nome + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">'
    + '<div style="background:#0b0d11;border-radius:6px;padding:7px;text-align:center;"><div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Transit Time</div><div style="font-size:16px;font-weight:900;color:' + r.cor + ';">' + m.tt + '</div></div>'
    + '<div style="background:#0b0d11;border-radius:6px;padding:7px;text-align:center;"><div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Distância</div><div style="font-size:16px;font-weight:900;color:#e8eaf0;">' + m.km + ' km</div></div></div>'
    + '<div style="background:#0b0d11;border-radius:6px;padding:8px;display:flex;flex-direction:column;gap:5px;">'
    + '<div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Calha</div>'
    + (prev ? '<div style="font-size:11px;color:#9ba3b4;">⬅ <b style="color:#e8eaf0;font-family:monospace;">' + prev.seq + '</b> ' + prev.nome + '</div>' : '<div style="font-size:11px;color:#334155;">⬅ Início da calha</div>')
    + '<div style="font-size:11px;color:' + r.cor + ';font-weight:700;padding:2px 0;">● ' + m.nome + '</div>'
    + (next ? '<div style="font-size:11px;color:#9ba3b4;">➡ <b style="color:#e8eaf0;font-family:monospace;">' + next.seq + '</b> ' + next.nome + '</div>' : '<div style="font-size:11px;color:#334155;">➡ Fim da calha</div>')
    + '</div>';

  setTimeout(function() {
    popup.style.pointerEvents = 'all';
    document.addEventListener('click', fecharPopupMapa, { once: true });
  }, 50);
}

function fecharPopupMapa() {
  var p = document.getElementById('map-popup'); if (p) p.style.display = 'none';
}

function filtrarRota(num) {
  rotaFiltrada = (rotaFiltrada === num) ? null : num;
  document.querySelectorAll('.mfbtn').forEach(function(b) {
    var isActive = b.dataset.rota === rotaFiltrada;
    b.style.opacity = (rotaFiltrada === null || isActive) ? '1' : '0.3';
    b.style.transform = isActive ? 'scale(1.1)' : 'scale(1)';
    b.style.fontWeight = isActive ? '900' : '700';
  });
  fecharPopupMapa(); renderMap();
}

function buildMapFilters() {
  var cont = document.getElementById('map-filters'); if (!cont) return;
  cont.innerHTML = '';
  var all = document.createElement('button'); all.className = 'mfbtn'; all.dataset.rota = '';
  all.textContent = 'TODAS';
  all.style.cssText = 'background:#1a1e26;border:1px solid #334155;color:#e8eaf0;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;letter-spacing:.5px;transition:all .15s;white-space:nowrap;';
  all.onclick = function() {
    rotaFiltrada = null;
    document.querySelectorAll('.mfbtn').forEach(function(b) { b.style.opacity='1'; b.style.transform='scale(1)'; b.style.fontWeight='700'; });
    fecharPopupMapa(); renderMap();
  };
  cont.appendChild(all);
  ROTAS.forEach(function(r) {
    var btn = document.createElement('button'); btn.className = 'mfbtn'; btn.dataset.rota = r.num; btn.textContent = r.num; btn.title = r.nome;
    btn.style.cssText = 'background:' + r.cor + '22;border:1.5px solid ' + r.cor + ';color:' + r.cor + ';padding:6px 10px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;min-width:38px;transition:all .15s;letter-spacing:.5px;';
    btn.onclick = function() { filtrarRota(r.num); };
    cont.appendChild(btn);
  });
}

function initMapInteractions() {
  var msvg = document.getElementById('msvg'); if (!msvg) return;
  var drag = false, ds = {};
  msvg.addEventListener('mousedown', function(e) { drag = true; ds = { x: e.clientX - T.x, y: e.clientY - T.y }; });
  document.addEventListener('mousemove', function(e) {
    if (!drag) return; T.x = e.clientX - ds.x; T.y = e.clientY - ds.y;
    var mg = document.getElementById('mg'); if (mg) mg.setAttribute('transform', 'translate(' + T.x + ',' + T.y + ') scale(' + T.s + ')');
  });
  document.addEventListener('mouseup', function() { drag = false; });
  msvg.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) { drag = true; ds = { x: e.touches[0].clientX - T.x, y: e.touches[0].clientY - T.y }; }
  }, { passive: true });
  msvg.addEventListener('touchmove', function(e) {
    if (!drag || e.touches.length !== 1) return;
    T.x = e.touches[0].clientX - ds.x; T.y = e.touches[0].clientY - ds.y;
    var mg = document.getElementById('mg'); if (mg) mg.setAttribute('transform', 'translate(' + T.x + ',' + T.y + ') scale(' + T.s + ')');
  }, { passive: true });
  msvg.addEventListener('touchend', function() { drag = false; });
  var lastDist = null;
  msvg.addEventListener('touchstart', function(e) { if (e.touches.length === 2) lastDist = null; }, { passive: true });
  msvg.addEventListener('touchmove', function(e) {
    if (e.touches.length !== 2) return;
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (lastDist) {
      T.s = Math.min(Math.max(T.s * dist / lastDist, 0.5), 8);
      var mg = document.getElementById('mg'); if (mg) mg.setAttribute('transform', 'translate(' + T.x + ',' + T.y + ') scale(' + T.s + ')');
    }
    lastDist = dist;
  }, { passive: true });
}

function zI() { T.s = Math.min(T.s * 1.3, 8); renderMap(); }
function zO() { T.s = Math.max(T.s / 1.3, 0.5); renderMap(); }
function zR() { T = { s: 1, x: 0, y: 0 }; rotaFiltrada = null; renderMap(); buildMapFilters(); }

/* ── ABA PORTOS ── */
var manifestoPortos = { esc: [], rod: [], 'v-rod': [] };

var LISTA_PADRAO_PORTOS = {
  esc:     ['RAU9','RUC9','RAO9','RUR9','RRE9','RQI9','RPI9','RAN9','RNA9','RNO9','RDA9','RRU9','RRR9','RRI9','RJU9'].map(function(k) { return NODEIDX[k]; }).filter(Boolean),
  rod:     ['RME9','RRA9','RBA9','RPA9','RCO9','RTE9','RAL9','RUA9','RAA9','RJA9','RFO9','RJT9','RIN9','RTO9','RAM9','RUI9','RBE9','RAT9','RUT9','RRC9','RGA9'].map(function(k) { return NODEIDX[k]; }).filter(Boolean),
  'v-rod': ['RNH9','RBO9','RPU9','RNI9','RIR9','RMA9','RPR9','RBB9','RAC9','RIT9','RNR9','RSI9','RNG9','RAR9','RAP9','RHU9','RLA9'].map(function(k) { return NODEIDX[k]; }).filter(Boolean)
};

function popularSeletorPortos() {
  var select = document.getElementById('p-select-mun'); if (!select) return; select.innerHTML = '';
  ROTAS.forEach(function(r) { r.municipios.forEach(function(m) {
    var opt = document.createElement('option'); opt.value = m.seq; opt.textContent = '[' + m.seq + '] ' + m.nome; select.appendChild(opt);
  }); });
}

function addMunToPorto() {
  var nodeVal = document.getElementById('p-select-mun').value;
  var targetPorto = document.getElementById('p-select-target').value;
  var hit = NODEIDX[nodeVal]; if (!hit) return;
  var jaExiste = [].concat(manifestoPortos.esc, manifestoPortos.rod, manifestoPortos['v-rod'])
    .some(function(x) { return x && x.mun.seq === hit.mun.seq; });
  if (jaExiste) { alert('Municipio ja esta distribuido.'); return; }
  manifestoPortos[targetPorto].push(hit);
  renderTabelaPortos();
}

function removeMunPorto(porto, seq) {
  manifestoPortos[porto] = manifestoPortos[porto].filter(function(x) { return x && x.mun.seq !== seq; });
  renderTabelaPortos();
}

function renderTabelaPortos() {
  var nomes = { esc: 'PORTO ESCADARIA', rod: 'PORTO ROADWAY', 'v-rod': 'RODOVIARIO' };
  ['esc', 'rod', 'v-rod'].forEach(function(p) {

    // VIEW — tela com botão X
    var viewContainer = document.querySelector('#view-col-' + p + ' .p-items-list');
    if (viewContainer) {
      viewContainer.innerHTML = '';
      manifestoPortos[p].forEach(function(hit) {
        if (!hit) return;
        var item = document.createElement('div'); item.className = 'p-item';
        item.innerHTML = '<span><b style="font-family:monospace">' + hit.mun.seq + '</b> - ' + hit.mun.nome + '</span>'
          + '<button onclick="removeMunPorto(\'' + p + '\',\'' + hit.mun.seq + '\')">X</button>';
        viewContainer.appendChild(item);
      });
    }

    // PRINT — área de captura sem botão X
    var printContainer = document.querySelector('#print-col-' + p + ' .p-items-list');
    if (printContainer) {
      printContainer.innerHTML = '';
      manifestoPortos[p].forEach(function(hit) {
        if (!hit) return;
        var item = document.createElement('div'); item.className = 'p-item';
        item.innerHTML = '<span><b style="font-family:monospace">' + hit.mun.seq + '</b> - ' + hit.mun.nome + '</span>';
        printContainer.appendChild(item);
      });
    }

    // Títulos com contagem
    var tituloView = document.querySelector('#view-col-' + p + ' .p-col-title');
    if (tituloView) tituloView.textContent = nomes[p] + ' (' + manifestoPortos[p].length + ')';
    var tituloPrint = document.querySelector('#print-col-' + p + ' .p-col-title');
    if (tituloPrint) tituloPrint.textContent = nomes[p];
  });
}

function resetarTabelaPortos() {
  manifestoPortos.esc = LISTA_PADRAO_PORTOS.esc.slice();
  manifestoPortos.rod = LISTA_PADRAO_PORTOS.rod.slice();
  manifestoPortos['v-rod'] = LISTA_PADRAO_PORTOS['v-rod'].slice();
  renderTabelaPortos();
}

function gerarImagemWhatsapp() {
  var area = document.getElementById('capture-area');
  if (typeof html2canvas === 'undefined') { alert('html2canvas nao carregado.'); return; }
  html2canvas(area, { backgroundColor: '#0b0d11', scale: 2 }).then(function(canvas) {
    var link = document.createElement('a'); link.download = 'despacho-facil-express.png'; link.href = canvas.toDataURL(); link.click();
  });
}

function copiarTextoWhatsapp() {
  var nomes = { esc: 'PORTO ESCADARIA', rod: 'PORTO ROADWAY', 'v-rod': 'RODOVIARIO' };
  var texto = 'FACIL EXPRESS LTDA - DESPACHO DIARIO\n\n';
  ['esc', 'rod', 'v-rod'].forEach(function(p) {
    if (manifestoPortos[p].length === 0) return;
    texto += '*' + nomes[p] + '*\n';
    manifestoPortos[p].forEach(function(hit) { if (hit) texto += '• ' + hit.mun.seq + ' - ' + hit.mun.nome + '\n'; });
    texto += '\n';
  });
  navigator.clipboard.writeText(texto).then(function() {
    alert('Texto copiado! Cole direto no WhatsApp.');
  }).catch(function() {
    alert('Erro ao copiar. Tente pelo botão de imagem.');
  });
}

/* ── NAVEGAÇÃO ── */
function SS(name, btn) {
  cur = name;
  ['t', 'r', 'm', 'l'].forEach(function(s) {
    var el = document.getElementById('sc-' + s);
    if (el) { el.className = (s === name) ? 'scr' : 'scr h'; el.style.display = (s === name) ? '' : 'none'; }
  });
  if (btn) { document.querySelectorAll('.htab').forEach(function(b) { b.classList.remove('on'); }); btn.classList.add('on'); }
  ['t', 'r', 'm', 'l'].forEach(function(s) { var bt = document.getElementById('bt-' + s); if (bt) bt.classList.toggle('on', s === name); });
  if (name === 'm') { buildMapFilters(); renderMap(); initMapInteractions(); }
  if (name === 'l') { popularSeletorPortos(); renderTabelaPortos(); }
  if (name === 't') { setTimeout(function() { var ci = document.getElementById('ci'); if (ci) ci.focus(); }, 100); }
}

/* ── INIT ── */
bRO();
resetarTabelaPortos();
renderRecentes();

['r', 'm', 'l'].forEach(function(s) {
  var el = document.getElementById('sc-' + s);
  if (el) { el.style.display = 'none'; el.className = 'scr h'; }
});
var scT = document.getElementById('sc-t');
if (scT) { scT.style.display = ''; scT.className = 'scr'; }

window.addEventListener('load', function() { var ci = document.getElementById('ci'); if (ci) ci.focus(); });
```
