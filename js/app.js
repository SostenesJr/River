/* ============================================================
   RIVER OPS — TRIAGEM — APP.JS
   ============================================================ */

/* Indice unico: codigo do node (seq) -> registro completo.
   Cada registro guarda a rota, o municipio e os vizinhos da calha. */
const NODEIDX = {};
ROTAS.forEach(function (rota) {
  rota.municipios.forEach(function (mun, i) {
    NODEIDX[mun.seq] = {
      rota: rota,
      mun: mun,
      pos: i + 1,
      total: rota.municipios.length,
      prev: rota.municipios[i - 1] || null,
      next: rota.municipios[i + 1] || null
    };
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

/* ── AUTOCOMPLETE / SUGESTAO DE NODE ──
   Lista pre-montada uma unica vez: cada entrada guarda o node (seq),
   o nome do municipio e uma chave de busca sem acento em maiusculas.  */
var LISTA_SUGESTOES = [];
ROTAS.forEach(function (rota) {
  rota.municipios.forEach(function (mun) {
    LISTA_SUGESTOES.push({
      seq: mun.seq,
      nome: mun.nome,
      cor: rota.cor,
      busca: normKey(mun.seq + ' ' + mun.nome)
    });
  });
});

var sugestaoAtiva = -1;   // indice do item destacado na lista (-1 = nenhum)

/* Chamada a cada tecla digitada no campo de codigo. */
function onCI(v) {
  var texto = v.trim();
  if (!texto) { document.getElementById('rcard').innerHTML = ''; fecharSugestoes(); return; }

  var chave = normKey(texto);

  // Se o texto ja e um node completo e valido, esconde a lista:
  // deixa o operador confirmar direto (fluxo de bipagem do scanner).
  if (NODEIDX[chave]) { fecharSugestoes(); return; }

  // Caso contrario, monta sugestoes por codigo OU por nome.
  var achados = LISTA_SUGESTOES.filter(function (s) {
    return s.busca.indexOf(chave) !== -1;
  }).slice(0, 6);

  renderSugestoes(achados);
}

/* Desenha a lista de sugestoes abaixo do campo. */
function renderSugestoes(lista) {
  var box = document.getElementById('sugest');
  if (!box) return;
  if (!lista.length) { fecharSugestoes(); return; }

  sugestaoAtiva = -1;
  box.innerHTML = lista.map(function (s, i) {
    return '<div class="sug-item" data-seq="' + s.seq + '" data-i="' + i + '" '
      + 'onclick="escolherSugestao(\'' + s.seq + '\')">'
      + '<span class="sug-cod" style="color:' + s.cor + '">' + s.seq + '</span>'
      + '<span class="sug-nome">' + s.nome + '</span>'
      + '</div>';
  }).join('');
  box.style.display = 'block';
}

/* Fecha e limpa a lista de sugestoes. */
function fecharSugestoes() {
  var box = document.getElementById('sugest');
  if (box) { box.style.display = 'none'; box.innerHTML = ''; }
  sugestaoAtiva = -1;
}

/* Clique/Enter numa sugestao: apenas PREENCHE o campo (nao abre o card).
   O operador confirma depois com Enter. */
function escolherSugestao(seq) {
  var ci = document.getElementById('ci');
  ci.value = seq;
  fecharSugestoes();
  ci.focus();
}

/* Move o destaque da lista para cima/baixo. */
function moverSugestao(delta) {
  var itens = document.querySelectorAll('#sugest .sug-item');
  if (!itens.length) return;
  sugestaoAtiva += delta;
  if (sugestaoAtiva < 0) sugestaoAtiva = itens.length - 1;
  if (sugestaoAtiva >= itens.length) sugestaoAtiva = 0;
  itens.forEach(function (el, i) { el.classList.toggle('on', i === sugestaoAtiva); });
}

function lookupNode(nodeId) { var hit = NODEIDX[nodeId]; if (hit) renderCard(hit); }

/* Teclado no campo de codigo. */
function onK(e) {
  var itens = document.querySelectorAll('#sugest .sug-item');

  // Setas e Esc controlam a lista de sugestoes, quando ela esta aberta.
  if (itens.length) {
    if (e.key === 'ArrowDown') { e.preventDefault(); moverSugestao(1);  return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moverSugestao(-1); return; }
    if (e.key === 'Escape')    { fecharSugestoes(); return; }
    // Enter com um item destacado: preenche o campo (nao abre o card).
    if (e.key === 'Enter' && sugestaoAtiva >= 0) {
      e.preventDefault();
      escolherSugestao(itens[sugestaoAtiva].dataset.seq);
      return;
    }
  }

  // Enter sem lista aberta (ou sem item destacado): confirma o codigo.
  var v = normKey(document.getElementById('ci').value.trim());
  if (e.key === 'Enter' && v) {
    if (NODEIDX[v]) { fecharSugestoes(); lookupNode(v); }
    else flashError();
  }
}

function flashError() {
  var ci = document.getElementById('ci');
  ci.style.borderColor = '#ef4444';
  setTimeout(function() { ci.style.borderColor = ''; }, 600);
}

/* ============================================================
   HELPERS DE MONTAGEM DE HTML
   Blocos visuais reutilizados por card / modal / popup.
   Mantem o mesmo visual — as diferencas de tamanho entre as
   telas sao passadas por parametro (objeto `tam`).
   ============================================================ */

/* Cor da "proxima saida" conforme proximidade (hoje/amanha/depois). */
function hCorProxSaida(nx) {
  if (nx.c === 'nt') return '#22c55e';   // hoje  -> verde
  if (nx.c === 'nw') return '#f59e0b';   // amanha -> laranja
  return '#9ba3b4';                       // depois -> cinza
}

/* Uma caixa de indicador (KPI): titulo pequeno em cima, valor grande embaixo.
   `tam` controla as pequenas diferencas entre as telas. */
function hKpi(titulo, valor, corValor, tam) {
  return '<div style="background:#0b0d11;border-radius:6px;padding:' + tam.pad + ';text-align:center;">'
    + '<div style="font-size:' + tam.tit + ';color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:' + tam.gap + ';">' + titulo + '</div>'
    + '<div style="font-size:' + tam.val + ';font-weight:900;color:' + corValor + ';">' + valor + '</div>'
    + '</div>';
}

/* Trio de KPIs (Transit Time · Distancia · Prox. Saida) usado no card e no modal. */
function hKpiTrio(m, r, nx, corNx, tam) {
  return '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;">'
    + hKpi('Transit Time', m.tt, r.cor, tam)
    + hKpi('Distância', m.km + ' km', '#e8eaf0', tam)
    + hKpi('Prox. Saída', nx.l, corNx, tam)
    + '</div>';
}

/* Linha da embarcacao mais proxima. `emoji` fica vazio no card e com barco no modal. */
function hEmbLine(nb, nx, r, emoji) {
  if (!nb) return '';
  return '<div style="margin-top:10px;padding:8px 12px;background:#0b0d11;border-radius:6px;border-left:3px solid ' + r.cor + ';font-size:12px;color:#9ba3b4;">'
    + '<span style="color:#fff;font-weight:700;">' + emoji + nb.embarcacao + '</span>'
    + (nb.porto ? '<span style="color:#737a8c;"> · ' + nb.porto + '</span>' : '')
    + '<span style="color:' + r.cor + ';font-weight:700;"> · ' + nx.l + '</span>'
    + '</div>';
}

/* Badge colorido "CALHA X". */
function hBadgeCalha(r, tam) {
  // Ordem das props de fonte preservada por tela (nao afeta render, mantem diff limpo).
  var fonte = tam.fsFirst
    ? 'font-size:' + tam.fs + ';font-weight:900;color:#fff;'
    : 'font-weight:900;color:#fff;font-size:' + tam.fs + ';';
  return '<div style="background:' + r.cor + ';padding:' + tam.pad + ';border-radius:' + tam.rad + ';' + fonte + 'letter-spacing:1px;' + (tam.inline ? 'display:inline-block;' : '') + '">CALHA ' + r.nome.toUpperCase() + '</div>';
}

function renderCard(hit) {
  var rc = document.getElementById('rcard');
  var r = hit.rota; var m = hit.mun; var prev = hit.prev; var next = hit.next;
  var pos = hit.pos; var total = hit.total;
  var nb = bB(m.nome);
  var nx = nb ? labelDays(nb.days) : { l: '---', c: 'ns' };
  var corNx = hCorProxSaida(nx);
  ultimaRotaAtiva = r.num;

  if (timerAutoLimpeza) clearTimeout(timerAutoLimpeza);
  timerAutoLimpeza = setTimeout(function() {
    document.getElementById('ci').value = '';
    document.getElementById('ci').focus();
    rc.innerHTML = ''; rc.className = ''; ultimaRotaAtiva = null;
  }, 15000);

  // Tamanhos das KPIs no card.
  var tamKpi = { pad: '8px', tit: '10px', gap: '3px', val: '18px' };

  var embInfo = hEmbLine(nb, nx, r, '');   // card: sem emoji

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
    + hBadgeCalha(r, { pad: '4px 12px', rad: '6px', fs: '12px', inline: false, fsFirst: false })
    + '<div style="font-size:10px;color:#737a8c;margin-top:4px;">Pos. ' + pos + ' de ' + total + '</div>'
    + '</div></div>'
    + '<div style="font-size:26px;font-weight:800;color:#e8eaf0;margin-bottom:12px;">' + m.nome + '</div>'
    + hKpiTrio(m, r, nx, corNx, tamKpi)
    + embInfo
    + '<div style="margin-top:12px;padding:10px;background:#0b0d11;border-radius:6px;border:1px solid #1a1e26;">'
    + '<div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Calha ' + r.nome + '</div>'
    + prevInfo + nextInfo
    + '</div></div>';

  rc.className = 'show';
  fecharSugestoes();
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

function abrirModalRota(nodeSeq) {
  var hit = NODEIDX[nodeSeq]; if (!hit) return;
  var r = hit.rota; var m = hit.mun; var prev = hit.prev; var next = hit.next;
  var pos = hit.pos; var total = hit.total;
  var nb = bB(m.nome);
  var nx = nb ? labelDays(nb.days) : { l: '---', c: 'ns' };
  var corNx = hCorProxSaida(nx);

  var old = document.getElementById('modal-rota'); if (old) old.remove();

  // Tamanhos das KPIs no modal (titulo 9px, o resto igual ao card).
  var tamKpi = { pad: '8px', tit: '9px', gap: '3px', val: '18px' };

  var embInfo = hEmbLine(nb, nx, r, '🚢 ');   // modal: com emoji de barco

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
    + '<div>' + hBadgeCalha(r, { pad: '3px 10px', rad: '5px', fs: '11px', inline: true, fsFirst: true })
    + '<div style="font-size:10px;color:#737a8c;margin-top:3px;">Pos. ' + pos + ' de ' + total + '</div></div></div>'
    + '<div style="font-size:22px;font-weight:800;color:#e8eaf0;margin-bottom:14px;">' + m.nome + '</div>'
    + hKpiTrio(m, r, nx, corNx, tamKpi)
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

  /* Linhas das calhas */
  ROTAS.forEach(function(r) {
    var ativo = rotaFiltrada === null || rotaFiltrada === r.num;
    var pts = r.municipios.map(function(m) { return LATLNG[m.seq] ? proj(LATLNG[m.seq].lat, LATLNG[m.seq].lng) : null; }).filter(Boolean);
    if (pts.length) {
      var lineCoords = [[hub.x, hub.y]].concat(pts.map(function(p) { return [p.x, p.y]; }));
      var polyPts = lineCoords.map(function(p) { return p[0] + ' ' + p[1]; }).join(', ');
      var line = document.createElementNS(NS, 'polyline');
      line.setAttribute('points', polyPts); line.setAttribute('fill', 'none');
      line.setAttribute('stroke', r.cor); line.setAttribute('stroke-width', ativo ? '2' : '1');
      line.setAttribute('opacity', ativo ? '0.55' : '0.07'); line.setAttribute('stroke-linecap', 'round'); g.appendChild(line);
    }
  });

  /* Nodes — encolhem conforme o zoom (escala inversa) para nao sobrepor.
     iz = 1/zoom: como o grupo #mg ja recebe scale(T.s), dividir as dimensoes
     por T.s mantem o marcador com tamanho ~constante na tela, separando
     municipios geograficamente proximos e mantendo cada um clicavel. */
  var iz = 1 / T.s;
  ROTAS.forEach(function(r) {
    var ativo = rotaFiltrada === null || rotaFiltrada === r.num;
    r.municipios.forEach(function(m, idx) {
      var ll = LATLNG[m.seq]; if (!ll) return;
      var p = proj(ll.lat, ll.lng);
      var label = mapLabel(r.num, idx + 1);
      var grp = document.createElementNS(NS, 'g');
      grp.style.cursor = ativo ? 'pointer' : 'default';
      grp.style.opacity = ativo ? '1' : '0.07';

      var baseW = label.length <= 2 ? 18 : label.length === 3 ? 22 : 26;
      var labelW = baseW * iz;
      var labelH = 12 * iz;
      var bb = document.createElementNS(NS, 'rect');
      bb.setAttribute('x', p.x - labelW / 2); bb.setAttribute('y', p.y - labelH / 2);
      bb.setAttribute('width', String(labelW)); bb.setAttribute('height', String(labelH));
      bb.setAttribute('rx', String(2 * iz));
      bb.setAttribute('fill', ativo ? r.cor : '#1a1e26');
      bb.setAttribute('stroke', r.cor); bb.setAttribute('stroke-width', (ativo ? 0 : 0.6) * iz);
      bb.setAttribute('opacity', '0.85');
      if (ativo) bb.setAttribute('filter', 'url(#gw)');
      grp.appendChild(bb);

      /* Area invisivel um pouco maior para clique facil no mobile (tambem encolhe). */
      var hitW = 24 * iz, hitH = 20 * iz;
      var hitArea = document.createElementNS(NS, 'rect');
      hitArea.setAttribute('x', p.x - hitW / 2); hitArea.setAttribute('y', p.y - hitH / 2);
      hitArea.setAttribute('width', String(hitW)); hitArea.setAttribute('height', String(hitH));
      hitArea.setAttribute('fill', 'transparent');
      grp.appendChild(hitArea);

      var nt = document.createElementNS(NS, 'text');
      nt.setAttribute('x', p.x); nt.setAttribute('y', p.y + 2.5 * iz);
      nt.setAttribute('text-anchor', 'middle'); nt.setAttribute('font-size', String(7 * iz));
      nt.setAttribute('font-weight', '900'); nt.setAttribute('fill', ativo ? '#fff' : r.cor);
      nt.setAttribute('font-family', 'monospace');
      nt.setAttribute('pointer-events', 'none');
      nt.textContent = label; grp.appendChild(nt);

      if (ativo) {
        grp.addEventListener('mouseenter', function() {
          var w = labelW + 6 * iz, h = 14 * iz;
          bb.setAttribute('opacity', '1');
          bb.setAttribute('width', String(w));
          bb.setAttribute('x', p.x - w / 2);
          bb.setAttribute('height', String(h));
          bb.setAttribute('y', p.y - h / 2);
          nt.setAttribute('font-size', String(8 * iz));
        });
        grp.addEventListener('mouseleave', function() {
          bb.setAttribute('opacity', '0.85');
          bb.setAttribute('width', String(labelW));
          bb.setAttribute('x', p.x - labelW / 2);
          bb.setAttribute('height', String(labelH));
          bb.setAttribute('y', p.y - labelH / 2);
          nt.setAttribute('font-size', String(7 * iz));
        });
        grp.addEventListener('click', function(e) {
          e.stopPropagation();
          showMapPopup(NODEIDX[m.seq], p, T, label);
        });
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
    document.getElementById('sc-m').appendChild(popup);
  }
  var r = hit.rota; var m = hit.mun; var prev = hit.prev; var next = hit.next;
  var nb = bB(m.nome); var nx = nb ? labelDays(nb.days) : { l: '---' };
  // Tamanhos das KPIs no popup (menores que no card/modal).
  var tamKpi = { pad: '7px', tit: '9px', gap: '2px', val: '16px' };

  // Ancoragem fixa: centralizado na parte de baixo do mapa.
  // Independe do zoom/pan, entao aparece sempre inteiro e no mesmo lugar.
  popup.style.cssText = 'position:absolute;z-index:200;left:50%;bottom:12px;transform:translateX(-50%);'
    + 'background:#12151b;border-radius:10px;padding:14px 16px;width:calc(100% - 24px);max-width:300px;'
    + 'box-sizing:border-box;box-shadow:0 4px 24px rgba(0,0,0,0.85);border:1px solid ' + r.cor + ';font-family:inherit;';
  popup.style.display = 'block';
  popup.style.pointerEvents = 'none';

  popup.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
    + '<span style="font-size:20px;font-weight:900;color:' + r.cor + ';font-family:monospace;">' + label + '</span>'
    + '<span style="font-size:10px;background:' + r.cor + '22;color:' + r.cor + ';padding:2px 8px;border-radius:4px;font-weight:700;">' + r.nome.toUpperCase() + '</span></div>'
    + '<div style="font-size:16px;font-weight:800;color:#e8eaf0;margin-bottom:10px;">' + m.nome + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">'
    + hKpi('Transit Time', m.tt, r.cor, tamKpi)
    + hKpi('Distância', m.km + ' km', '#e8eaf0', tamKpi)
    + '</div>'
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
  msvg.addEventListener('touchend', function() {
    drag = false;
    // Se acabou de dar pinch-zoom, redesenha para os marcadores reajustarem
    // ao novo nivel de zoom (encolher/crescer conforme iz).
    if (lastDist !== null) { lastDist = null; renderMap(); }
  });
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

var manifestoPortos = { esc: [], rod: [], 'v-rod': [] };

/* Porto preferido de cada municipio (usado so como sugestao no seletor).
   As colunas comecam VAZIAS; o operador preenche o despacho do dia manualmente. */
var PREF_PORTO = {
  esc:     ['RAU9','RUC9','RAO9','RUR9','RRE9','RQI9','RPI9','RAN9','RNA9','RNO9','RDA9','RRU9','RRR9','RRI9','RJU9'],
  rod:     ['RME9','RRA9','RBA9','RPA9','RCO9','RTE9','RAL9','RUA9','RAA9','RJA9','RFO9','RJT9','RIN9','RTO9','RAM9','RUI9','RBE9','RAT9','RUT9','RRC9','RGA9'],
  'v-rod': ['RNH9','RBO9','RPU9','RNI9','RIR9','RMA9','RPR9','RBB9','RAC9','RIT9','RNR9','RSI9','RNG9','RAR9','RAP9','RHU9','RLA9']
};

/* Indice reverso: node -> chave do porto preferido (ex: 'RAU9' -> 'esc'). */
var PORTO_DE = {};
Object.keys(PREF_PORTO).forEach(function (chavePorto) {
  PREF_PORTO[chavePorto].forEach(function (seq) { PORTO_DE[seq] = chavePorto; });
});

function popularSeletorPortos() {
  var select = document.getElementById('p-select-mun'); if (!select) return; select.innerHTML = '';
  ROTAS.forEach(function(r) { r.municipios.forEach(function(m) {
    var opt = document.createElement('option'); opt.value = m.seq; opt.textContent = '[' + m.seq + '] ' + m.nome; select.appendChild(opt);
  }); });
  // Ao trocar o municipio, sugere automaticamente o porto preferido dele.
  select.onchange = sugerirPortoPreferido;
  sugerirPortoPreferido();
}

/* Move o dropdown de porto para o porto preferido do municipio selecionado. */
function sugerirPortoPreferido() {
  var selMun = document.getElementById('p-select-mun');
  var selPorto = document.getElementById('p-select-target');
  if (!selMun || !selPorto) return;
  var pref = PORTO_DE[selMun.value];
  if (pref) selPorto.value = pref;
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
    var tituloView = document.querySelector('#view-col-' + p + ' .p-col-title');
    if (tituloView) {
      var aberto = viewContainer ? viewContainer.style.display !== 'none' : true;
      tituloView.textContent = nomes[p] + ' (' + manifestoPortos[p].length + ') ' + (aberto ? '▼' : '▶');
      tituloView.style.cursor = 'pointer';
      tituloView.onclick = function() {
        var lista = document.querySelector('#view-col-' + p + ' .p-items-list');
        if (!lista) return;
        var estaAberto = lista.style.display !== 'none';
        lista.style.display = estaAberto ? 'none' : '';
        tituloView.textContent = nomes[p] + ' (' + manifestoPortos[p].length + ') ' + (estaAberto ? '▶' : '▼');
      };
    }
    var tituloPrint = document.querySelector('#print-col-' + p + ' .p-col-title');
    if (tituloPrint) tituloPrint.textContent = nomes[p];
  });
}

/* Esvazia as tres colunas (despacho do dia recomeca do zero). */
function resetarTabelaPortos() {
  manifestoPortos.esc = [];
  manifestoPortos.rod = [];
  manifestoPortos['v-rod'] = [];
  renderTabelaPortos();
}

/* Gera a imagem de despacho para o WhatsApp.
   Problema resolvido: no celular, o CSS responsivo empilha as 3 colunas
   (media query < 992px), entao a foto saia em retrato. Aqui forcamos
   temporariamente o layout de 3 colunas lado a lado (paisagem, ajustado
   ao conteudo), capturamos, e restauramos o estado original. */
function gerarImagemWhatsapp() {
  var area = document.getElementById('capture-area');
  if (!area) return;
  if (typeof html2canvas === 'undefined') { alert('html2canvas nao carregado.'); return; }

  var grid = area.querySelector('.p-grid-3');

  // Guarda os estilos inline atuais para restaurar depois da captura.
  var estadoArea = area.getAttribute('style') || '';
  var estadoGrid = grid ? (grid.getAttribute('style') || '') : '';

  // Tira o elemento da tela (sem esconder) para o operador nao ver o "flash",
  // mantendo-o renderizavel pelo html2canvas.
  area.style.setProperty('position', 'fixed', 'important');
  area.style.setProperty('left', '-10000px', 'important');
  area.style.setProperty('top', '0', 'important');
  area.style.setProperty('width', 'max-content', 'important');

  // Forca as 3 colunas lado a lado, cada uma com largura minima (ajustada ao conteudo).
  if (grid) {
    grid.style.setProperty('display', 'grid', 'important');
    grid.style.setProperty('grid-template-columns', 'repeat(3, minmax(230px, max-content))', 'important');
  }

  function restaurar() {
    area.setAttribute('style', estadoArea);
    if (grid) grid.setAttribute('style', estadoGrid);
  }

  html2canvas(area, { backgroundColor: '#0b0d11', scale: 2 })
    .then(function (canvas) {
      restaurar();
      var link = document.createElement('a');
      link.download = 'despacho-facil-express.png';
      link.href = canvas.toDataURL();
      link.click();
    })
    .catch(function () {
      restaurar();
      alert('Nao foi possivel gerar a imagem. Tente novamente.');
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

function SS(name, btn) {
  cur = name;
  fecharSugestoes();
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

/* Clique fora do campo de codigo fecha a lista de sugestoes. */
document.addEventListener('click', function (e) {
  var wrap = e.target.closest ? e.target.closest('.ci-wrap') : null;
  if (!wrap) fecharSugestoes();
});
