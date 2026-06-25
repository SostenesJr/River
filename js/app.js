Com certeza! Como avançamos bastante e fizemos vários ajustes finos entre o **HTML**, o **JavaScript** e o **CSS**, consolidei a aplicação inteira em uma estrutura única, limpa e blindada contra quebras.

Aqui está o código completo de cada arquivo do seu ecossistema, prontinho para você copiar e colar:

---

## 1. `index.html` (Interface e Layout)

Substitua o conteúdo do seu arquivo principal por este. Ele já conta com a separação da área de trabalho do pátio (`.p-view-grid`) e a área oculta widescreen (`#capture-area`), além do novo botão de cópia de texto.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>RIVER OPS · Triagem</title>
<link rel="stylesheet" href="css/style.css">
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
</head>
<body>

<div id="hdr">
  <div class="dot"></div>
  <div>
    <div class="lt">RIVER OPS</div>
    <div style="font-size:13px;font-weight:900;color:var(--ac);letter-spacing:.04em;margin-top:2px">FACIL EXPRESS LTDA</div>
  </div>
  <div class="htabs">
    <button class="htab on" onclick="SS('t',this)">⚡ Triagem</button>
    <button class="htab" onclick="SS('r',this)">📋 Rotas</button>
    <button class="htab" onclick="SS('m',this)">🗺️ Mapa</button>
    <button class="htab" onclick="SS('l',this)">🚢 Portos</button>
  </div>
  <div class="hbg" id="hbg">BUSCA PADRÃO AMAZON SELECIONADA</div>
</div>

<div id="btabs">
  <div class="brow">
    <button class="btab on" id="bt-t" onclick="SS('t',null)"><span class="bti">⚡</span>Triagem</button>
    <button class="btab" id="bt-r" onclick="SS('r',null)"><span class="bti">📋</span>Rotas</button>
    <button class="btab" id="bt-m" onclick="SS('m',null)"><span class="bti">🗺️</span>Mapa</button>
    <button class="btab" id="bt-l" onclick="SS('l',null)"><span class="bti">🚢</span>Portos</button>
  </div>
</div>

<div id="app">

  <!-- TRIAGEM -->
  <div class="scr" id="sc-t">
    <div class="csec">
      <label class="clbl">DIGITE OU BIPE O CÓDIGO DO NODE (EX: RAL9, RTE9, RTO9)</label>
      <input id="ci" type="text" placeholder="CÓDIGO DA ETIQUETA"
        autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="characters"
        oninput="onCI(this.value)" onkeydown="onK(event)">
      <div class="chint">Responde diretamente ao código da etiqueta Amazon.</div>
    </div>
    <div id="rcard"></div>
    <div id="recb">
      <div class="rect">Buscas recentes</div>
      <div class="chips" id="rchp"></div>
    </div>
  </div>

  <!-- ROTAS -->
  <div class="scr h" id="sc-r">
    <div class="rhdr">
      <div class="rsw">
        <span class="rsi">🔍</span>
        <input type="text" placeholder="Buscar município ou node..." oninput="fR(this.value)">
      </div>
    </div>
    <div class="rbdy" id="rbdy"></div>
  </div>

  <!-- MAPA -->
  <div class="scr h" id="sc-m" style="position:relative;display:flex;flex-direction:column;">
    <div style="display:flex;align-items:center;gap:6px;padding:8px 10px;background:#0b0d11;border-bottom:1px solid #1a1e26;flex-shrink:0;flex-wrap:wrap;">
      <span style="font-size:10px;color:#737a8c;font-weight:700;letter-spacing:1px;white-space:nowrap;">ROTA:</span>
      <div id="map-filters" style="display:flex;gap:4px;flex-wrap:wrap;flex:1;"></div>
      <div style="display:flex;gap:4px;flex-shrink:0;">
        <button class="mcb" onclick="zI()">+</button>
        <button class="mcb" onclick="zO()">-</button>
        <button class="mcb" onclick="zR()">&#x27F3;</button>
      </div>
    </div>
    <svg id="msvg" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" style="flex:1;width:100%;"></svg>
  </div>

  <!-- PORTOS -->
  <div class="scr h" id="sc-l">
    <div class="p-layout">
      
      <div class="p-pool">
        <div class="p-pool-title">Adicionar Município ao Manifesto</div>
        <div class="p-select-row">
          <select id="p-select-mun" class="p-select"></select>
          <select id="p-select-target" class="p-select">
            <option value="esc">Porto Escadaria</option>
            <option value="rod">Porto Roadway</option>
            <option value="v-rod">Rodoviário</option>
          </select>
          <button class="p-btn-add" onclick="addMunToPorto()">+ Vincular</button>
        </div>
      </div>

      <!-- ÁREA DE OPERAÇÃO VISÍVEL: Organizada em lista confortável para telas de celulares -->
      <div class="p-view-grid">
        <div class="p-col" id="view-col-esc">
          <div class="p-col-title esc">PORTO ESCADARIA (0)</div>
          <div class="p-items-list"></div>
        </div>
        <div class="p-col" id="view-col-rod">
          <div class="p-col-title rod">PORTO ROADWAY (0)</div>
          <div class="p-items-list"></div>
        </div>
        <div class="p-col" id="view-col-v-rod">
          <div class="p-col-title v-rod">RODOVIÁRIO (0)</div>
          <div class="p-items-list"></div>
        </div>
      </div>

      <!-- ÁREA OCULTA DO PRINT: Força a disposição horizontal widescreen com 3 colunas e oculta botões "X" -->
      <div id="capture-area">
        <div style="text-align:center; font-weight:900; font-size:14px; color:#14b8a6; margin-bottom:16px; letter-spacing:1px; font-family: sans-serif;">
          FÁCIL EXPRESS LTDA · DESPACHO DIÁRIO
        </div>
        <div class="p-grid-3">
          <div class="p-col" id="print-col-esc">
            <div class="p-col-title esc">PORTO ESCADARIA</div>
            <div class="p-items-list"></div>
          </div>
          <div class="p-col" id="print-col-rod">
            <div class="p-col-title rod">PORTO ROADWAY</div>
            <div class="p-items-list"></div>
          </div>
          <div class="p-col" id="print-col-v-rod">
            <div class="p-col-title v-rod">RODOVIÁRIO</div>
            <div class="p-items-list"></div>
          </div>
        </div>
      </div>

      <div class="p-action-row">
        <button class="whatsapp-btn" onclick="gerarImagemWhatsapp()">📸 Gerar Imagem</button>
        <button class="whatsapp-btn" style="background:#0284c7;" onclick="copiarTextoWhatsapp()">📋 Copiar Texto para WhatsApp</button>
        <button class="p-btn-reset" onclick="resetarTabelaPortos()">⟲ Resetar</button>
      </div>

    </div>
  </div>

</div>

<script src="js/data.js"></script>
<script src="js/app.js"></script>
</body>
</html>

```

---

## 2. `css/style.css` (Folha de Estilos e Responsividade)

Cole este código no seu arquivo CSS. Ele corrige os travamentos de tela do mobile e formata o print horizontal de modo paisagem automaticamente.

```css
/* ============================================================
   RIVER OPS — VARIÁVEIS GLOBAIS E CORES DO SISTEMA
   ============================================================ */
:root {
  --bg: #0b0d11;      /* Fundo master escuro da aplicação */
  --s1: #12151b;      /* Fundo intermediário para barras superiores e painéis */
  --s2: #1a1e26;      /* Fundo claro para cartões de informação e caixas de texto */
  --bd: #232838;      /* Tom padrão de contornos e limitadores físicos */
  --tx: #e8eaf0;      /* Texto de alto contraste para leitura rápida no galpão */
  --mu: #737a8c;      /* Texto suavizado para legendas e dados secundários */
  --ac: #14b8a6;      /* Tom corporativo institucional (Teal Suave) */
  --re: #ef4444;      /* Indicador cromático crítico (Vermelho para alertas) */
  --ok: #22c55e;      /* Indicador de conformidade (Verde para embarques ok) */
  --wa: #f59e0b;      /* Indicador de transição (Laranja para saídas de amanhã) */
  
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Roboto Mono', monospace;
}

/* Reset de Margens e Toque do Dispositivo */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent; /* Elimina atraso de clique no mobile */
}

html, body {
  background: var(--bg);
  color: var(--tx);
  font-family: var(--font-sans);
  font-size: 14px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto; /* Permite rolagem da página quando o conteúdo esticar */
}

/* ESTILIZAÇÃO DO HEADER (BARRA SUPERIOR) */
#hdr {
  position: fixed; top: 0; left: 0; right: 0;
  height: 50px;
  background: var(--s1);
  border-bottom: 1px solid var(--bd);
  display: flex; align-items: center;
  padding: 0 14px; gap: 10px;
  z-index: 300;
}

/* Ponto Pulsante Online */
.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--ac);
  box-shadow: 0 0 7px var(--ac);
  animation: bk 2s infinite;
  flex-shrink: 0;
}
@keyframes bk { 0%,100% { opacity: 1 } 50% { opacity: .3 } }

.lt { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.ls { font-size: 9px; color: var(--mu); letter-spacing: .06em; text-transform: uppercase; }

/* Abas de Navegação no Topo (Desktop) */
.htabs { display: flex; gap: 4px; margin-left: auto; }
.htab {
  padding: 5px 11px; border-radius: 5px;
  border: 1px solid var(--bd); background: var(--s2); color: var(--mu);
  font-size: 11px; font-weight: 600; cursor: pointer; font-family: var(--font-sans);
  white-space: nowrap;
}
.htab.on { background: var(--ac); border-color: var(--ac); color: #fff; }
.hbg { font-family: var(--font-mono); font-size: 9px; padding: 3px 7px; border-radius: 4px; border: 1px solid var(--bd); color: var(--mu); background: var(--s2); flex-shrink: 0; }

/* MENU INFERIOR MOBILE */
#btabs {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: 58px; background: var(--s1); border-top: 1px solid var(--bd);
  z-index: 300; display: none;
}
.brow { display: flex; height: 100%; }
.btab {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  cursor: pointer; border: none; background: transparent; color: var(--mu);
  font-family: var(--font-sans); font-size: 9px; font-weight: 600; padding: 0; text-transform: uppercase;
}
.btab.on { color: var(--ac); }
.bti { font-size: 17px; line-height: 1; }

/* ÁREA DE CONTEÚDO DINÂMICO */
#app { position: fixed; top: 50px; left: 0; right: 0; bottom: 0; display: flex; overflow: hidden; }
.scr { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
.scr.h { display: none; }

/* ABA 1: DESIGN DA TELA DE TRIAGEM */
#sc-t { align-items: center; overflow-y: auto; padding: 20px 16px; gap: 14px; }
.csec { width: 100%; max-width: 680px; margin-top: 55px; } 
.clbl { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--mu); margin-bottom: 8px; display: block; text-align: center; }

/* Input de Triagem Calibrado para Letras e Números */
#ci {
  width: 100%; height: 72px;
  font-family: var(--font-mono); font-size: 36px; font-weight: 700;
  background: var(--s1); border: 2px solid var(--bd); border-radius: 12px; color: var(--tx);
  text-align: center; letter-spacing: .18em; outline: none; transition: border-color .2s; padding: 0 16px; caret-color: var(--ac);
}
#ci:focus { border-color: var(--ac); box-shadow: 0 0 0 3px rgba(20,184,166,.15); }
#ci::placeholder { color: var(--bd); font-size: 22px; letter-spacing: normal; }
.clbl, .chint { font-size: 10px; color: var(--mu); text-align: center; margin-top: 7px; line-height: 1.6; }

/* Caixa de Resultados Expandida para 680px */
#rcard { width: 100%; max-width: 680px; display: none; }
#rcard.show { display: block; }
.rcm { border-radius: 14px; overflow: hidden; border: 2px solid; animation: pop .18s ease; }
@keyframes pop { 0% { transform: scale(.96); opacity: .5 } 100% { transform: scale(1); opacity: 1 } }
.rch { display: flex; align-items: center; gap: 14px; padding: 18px 20px; }
.rcnum { font-family: var(--font-mono); font-size: 72px; font-weight: 700; line-height: 1; flex-shrink: 0; width: 95px; text-align: center; }
.rcpos { display: inline-flex; align-items: center; justify-content: center; border-radius: 7px; font-family: var(--font-mono); font-size: 14px; font-weight: 700; padding: 3px 10px; margin-bottom: 6px; color: #fff; }
.rcrl { font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; opacity: .65; margin-bottom: 3px; }
.rcrn { font-size: 18px; font-weight: 700; line-height: 1.2; }
.rcmn { font-size: 12px; opacity: .75; margin-top: 4px; }
.rcb { background: var(--s1); padding: 14px 16px; }
.rcgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
.rcs { background: var(--s2); border: 1px solid var(--bd); border-radius: 8px; padding: 9px 11px; }
.rcsl { font-size: 8px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--mu); margin-bottom: 3px; }
.rcsv { font-size: 14px; font-weight: 700; }
.rcsv.re { color: var(--re); } .rcsv.ok { color: var(--ok); } .rcsv.wa { color: var(--wa); }
.adjr { display: flex; gap: 8px; margin-bottom: 12px; }
.adjc { flex: 1; background: var(--s2); border: 1px solid var(--bd); border-radius: 8px; padding: 10px 12px; }
.adjd { font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--mu); margin-bottom: 4px; }
.adjn { font-size: 12px; font-weight: 700; }
.adjcep { font-family: var(--font-mono); font-size: 10px; color: var(--mu); margin-top: 2px; }
.adjkm { font-size: 9px; color: var(--mu); margin-top: 1px; }
.bttl { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--mu); margin-bottom: 8px; }
.brow2 { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: var(--s2); border: 1px solid var(--bd); border-radius: 8px; margin-bottom: 5px; }
.bnx { font-family: var(--font-mono); font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; flex-shrink: 0; }
.nt { background: rgba(239,68,68,.2); color: var(--re); border: 1px solid rgba(239,68,68,.3); }
.nw { background: rgba(245,158,11,.15); color: var(--wa); border: 1px solid rgba(245,158,11,.3); }
.ns { background: rgba(34,197,94,.1); color: var(--ok); border: 1px solid rgba(34,197,94,.25); }
.bnm { font-size: 12px; font-weight: 600; flex: 1; }
.binfo { font-size: 9px; color: var(--mu); margin-top: 1px; }

/* Blocos de Consultas Recentes */
.recb { width: 100%; max-width: 680px; display: none; }
.rect { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--mu); margin-bottom: 8px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { background: var(--s2); border: 1px solid var(--bd); border-radius: 6px; padding: 5px 10px; font-family: var(--font-mono); font-size: 12px; cursor: pointer; }
.chip:active { border-color: var(--ac); color: var(--ac); }

/* ABA DE ROTAS E FILTROS COMPACTOS */
#sc-r { overflow: hidden; }
.rhdr { padding: 12px 14px; border-bottom: 1px solid var(--bd); flex-shrink: 0; }
.rsw { position: relative; }
.rsw input { width: 100%; background: var(--bg); border: 1px solid var(--bd); border-radius: 8px; padding: 9px 12px 9px 32px; color: var(--tx); font-size: 13px; font-family: var(--font-sans); outline: none; }
.rsw input:focus { border-color: var(--ac); }
.rsi { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--mu); font-size: 12px; }
.rbdy { overflow-y: auto; flex: 1; padding: 10px; }
.rcard { background: var(--s1); border: 1px solid var(--bd); border-radius: 12px; margin-bottom: 8px; overflow: hidden; }
.rhead { display: flex; align-items: center; gap: 10px; padding: 12px 14px; cursor: pointer; user-select: none; }
.rnb { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 18px; font-weight: 700; flex-shrink: 0; color: #fff; }
.rinfo { flex: 1; min-width: 0; }
.rnome { font-size: 13px; font-weight: 700; margin-bottom: 1px; }
.rsub { font-size: 10px; color: var(--mu); }
.rchv { color: var(--mu); font-size: 10px; transition: transform .2s; flex-shrink: 0; }
.rcard.open .rchv { transform: rotate(90deg); }
.rbody { display: none; border-top: 1px solid var(--bd); }
.rcard.open .rbody { display: block; }
.mrow { display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-bottom: 1px solid rgba(255,255,255,.04); cursor: pointer; min-height: 42px; }
.mrow:last-child { border-bottom: none; }
.mrow:active { background: var(--s2); }
.mseq { font-family: var(--font-mono); font-size: 11px; font-weight: 700; width: 22px; text-align: center; flex-shrink: 0; }
.mcep { font-family: var(--font-mono); font-size: 10px; color: var(--mu); width: 52px; flex-shrink: 0; }
.mkm { font-family: var(--font-mono); font-size: 9px; color: var(--mu); width: 40px; text-align: right; flex-shrink: 0; }
.mname { font-size: 12px; font-weight: 600; flex: 1; }
.mtt { font-size: 9px; color: var(--mu); flex-shrink: 0; margin-right: 4px; }
.mnx { font-size: 9px; font-family: var(--font-mono); padding: 1px 6px; border-radius: 3px; font-weight: 700; flex-shrink: 0; }

/* DESIGN INTERATIVO DO MAPA */
#sc-m { position: relative; overflow: hidden; background: #070c14; } 
#msvg { width: 100%; height: 100%; display: block; touch-action: none; background: #070c14; }
.mc2 { position: absolute; top: 10px; left: 10px; display: flex; flex-direction: column; gap: 5px; z-index: 10; }
.mcb { width: 34px; height: 34px; background: var(--s1); border: 1px solid var(--bd); border-radius: 7px; color: var(--tx); font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.mcb:active { border-color: var(--ac); color: var(--ac); }
#mleg { position: absolute; bottom: 10px; left: 10px; background: rgba(18,21,27,0.85); backdrop-filter: blur(4px); border: 1px solid var(--bd); border-radius: 9px; padding: 10px 12px; z-index: 10; max-width: 178px; }
.mlttl{ font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--mu); margin-bottom: 7px; }
.mlr { display: flex; align-items: center; gap: 7px; margin-bottom: 4px; cursor: pointer; border-radius: 4px; padding: 2px 3px; }
.mlr:active { background: var(--s2); }
.mlnum { width: 22px; height: 22px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: #fff; flex-shrink: 0; }
.mlr.dim .mlnum, .mlr.dim .mlnm { opacity: .14; }
#mtt { position: absolute; background: rgba(18,21,27,0.96); backdrop-filter: blur(6px); border: 1px solid var(--bd); border-radius: 8px; padding: 0; pointer-events: none; z-index: 100; display: none; min-width: 220px; box-shadow: 0 4px 20px rgba(0,0,0,.5); overflow: hidden; }
#mtt.on { display: block; }

/* MANIFESTO DE PORTOS (SISTEMA INTEGRADO E RESPONSIVO) */
.p-layout { display: flex; flex-direction: column; gap: 15px; padding: 15px; }

/* Área secreta do print guardada fora do fluxo visual de dados */
#capture-area {
  padding: 20px;
  background: #0b0d11;
  border-radius: 8px;
  width: 950px; /* Mantém a proporção horizontal widescreen perfeita da imagem */
  position: fixed;
  left: -9999px; /* Oculta o container mestre para não quebrar a tela de edição */
  box-sizing: border-box;
}

#capture-area .p-grid-3 { 
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important; 
  gap: 12px !important; 
  background: #12151b; 
  padding: 15px; 
  border-radius: 8px; 
  border: 1px solid #232838; 
}

/* Painel de preenchimento inteligente e responsivo */
.p-view-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.p-col { background: #1a1e26; border: 1px solid #232838; border-radius: 6px; padding: 10px; min-height: 80px; }
.p-col-title { font-weight: 800; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; text-align: center; padding-bottom: 8px; border-bottom: 2px solid #232838; margin-bottom: 10px; }
.p-col-title.esc { color: #22d3ee; } 
.p-col-title.rod { color: #f97316; } 
.p-col-title.v-rod { color: #ff6644; }
.p-item { background: #12151b; border: 1px solid #232838; border-radius: 4px; padding: 7px 10px; margin-bottom: 5px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; gap: 8px; }
.p-item span { flex: 1; }
.p-item button { background: none; border: none; color: #ef4444; font-weight: bold; cursor: pointer; font-size: 16px; line-height: 1; padding: 4px 8px; flex-shrink: 0; }
.p-pool { background: #1a1e26; border: 1px solid #232838; border-radius: 6px; padding: 15px; }
.p-pool-title { font-size: 11px; font-weight: bold; color: #737a8c; text-transform: uppercase; margin-bottom: 10px; }
.p-select-row { display: flex; gap: 8px; flex-wrap: wrap; }
.p-select { flex: 1; min-width: 120px; background: #12151b; border: 1px solid #232838; color: #e8eaf0; padding: 10px; border-radius: 6px; outline: none; font-size: 13px; }
.p-btn-add { background: #14b8a6; border: none; color: #fff; padding: 0 18px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; white-space: nowrap; }
.whatsapp-btn { background: #22c55e; border: none; color: white; padding: 12px; font-weight: bold; border-radius: 6px; flex: 1; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; }
.p-action-row { display: flex; gap: 10px; margin-top: 5px; flex-wrap: wrap; }
.p-btn-reset { background: #334155; border: none; color: #e8eaf0; padding: 0 16px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; white-space: nowrap; }

/* COMPORTAMENTO DO SISTEMA GERAL DE MARCAÇÃO EM SELEÇÃO */
#sh { position: fixed; bottom: -450px; left: 0; right: 0; background: var(--s1); border-top: 1px solid var(--bd); border-radius: 14px 14px 0 0; padding: 16px 16px 36px; z-index: 400; transition: bottom .25s ease; max-height: 88%; overflow-y: auto; }
#sh.on { bottom: 0; }
.shdl { width: 34px; height: 4px; background: var(--bd); border-radius: 2px; margin: 0 auto 14px; }
.shcl { position: absolute; top: 14px; right: 14px; background: var(--s2); border: 1px solid var(--bd); border-radius: 6px; padding: 4px 10px; font-size: 11px; color: var(--mu); cursor: pointer; }

/* BARRA DE SELEÇÃO E HISTÓRICO */
#sel-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 500; background: var(--s1); border-top: 2px solid var(--ac); padding: 10px 14px; display: none; align-items: center; gap: 10px; flex-wrap: wrap; }
#sel-bar.on { display: flex; }
.sel-count { font-size: 12px; font-weight: 700; color: var(--ac); flex-shrink: 0; }
.sel-chips { display: flex; flex-wrap: wrap; gap: 5px; flex: 1; overflow: hidden; max-height: 54px; overflow-y: auto; }

/* CONDICIONAIS DE DIMENSIONAMENTO E MEDIA QUERIES */
@media (min-width: 992px) {
  .p-view-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

@media (max-width: 991px) { 
  .p-item { flex-wrap: nowrap !important; }
}

@media (max-width: 767px) {
  #btabs { display: block; }
  .htabs, #hbg { display: none !important; }
  #app { bottom: 58px; }
  #ci { font-size: 26px; height: 60px; }
  .rcnum { font-size: 48px; width: 65px; }
  .rcgrid { grid-template-columns: repeat(2, 1fr); }
  .adjr { flex-direction: column; }
  .p-select-row { flex-direction: column; } 
  .p-btn-add { padding: 10px; }
}

/* Utilitários Extras */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bd); border-radius: 2px; }

```

---

## 3. `js/app.js` (Lógica e Regras de Negócio)

Cole este código no seu arquivo JavaScript. Ele gerencia as travas de bipes da triagem, as simplificações de rotas, as sincronizações duplas de portos e o gerador de imagens móveis.

```javascript
/* ============================================================
   RIVER OPS — TRIAGEM — APP.JS (VERSÃO FINAL UNIFICADA)
   ============================================================ */

/* ── ÍNDICES ──────────────────────────────────────────────────
   Monta três dicionários para busca rápida:
   IDX        → por CEP
   NODEIDX   → por código do node (ex: RAL9)
   SLAMIDX   → por código SLAM
   ------------------------------------------------------------ */
const IDX = {}; const SLAMIDX = {}; const NODEIDX = {};
ROTAS.forEach(r => r.municipios.forEach((m, i) => {
  const rec = {
    rota: r, mun: m,
    pos: i + 1,                         // posição na calha (1-based)
    total: r.municipios.length,        // total de municípios na calha
    prev: r.municipios[i - 1] || null, // município anterior
    next: r.municipios[i + 1] || null  // município seguinte
  };
  IDX[m.cep] = rec;
  NODEIDX[String(m.seq).toUpperCase().trim()] = rec; // Caixa alta e trim para evitar erros de busca
  if (m.slam) { if (!SLAMIDX[m.slam]) SLAMIDX[m.slam] = []; SLAMIDX[m.slam].push(rec); }
}));

/* ── ESTADO GLOBAL ─────────────────────────────────────────── */
let ultimaRotaAtiva = null;  // última calha bipada (para controle de som futuro)
let timerAutoLimpeza = null; // timer que limpa o card da triagem
let cur = 't';               // aba ativa

/* ── BARCOS: PRÓXIMA SAÍDA ────────────────────────────────────
   normKey  → normaliza string para busca sem acento
   pD        → converte string de dia (ex: "Quarta-feira") em número 0-6
   bB        → busca em EMBS e retorna o barco com saída mais próxima
   labelDays → converte número de dias em label legível
   ------------------------------------------------------------ */
function normKey(s) {
  return s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

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
      if (diff < menorDias) { menorDias = diff; melhor = { days: diff, embarcacao: emb.n, porto: emb.p, diaSemana: emb.d }; }
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

/* ── ABA TRIAGEM ──────────────────────────────────────────────
   onCI      → chamado a cada tecla no input, busca em tempo real com travas
   lookupNode → busca o node e chama renderCard
   onK       → captura Enter para confirmar
   flashError → pisca borda vermelha se node não encontrado
   ------------------------------------------------------------ */
function onCI(v) {
  // AJUSTE: Limita estritamente o tamanho máximo para 4 caracteres (Tamanho do Node)
  if (v.length > 4) {
    v = v.substring(0, 4);
    document.getElementById('ci').value = v;
  }

  const text = v.trim().toUpperCase();
  if (!text) { document.getElementById('rcard').innerHTML = ''; return; }
  
  // REGRA EXTRA DE SEGURANÇA: ignora códigos indesejados que começam com 701
  if (text.startsWith('701')) {
    document.getElementById('ci').value = '';
    document.getElementById('rcard').innerHTML = '';
    return;
  }
  
  if (NODEIDX[text]) lookupNode(text);
}

function lookupNode(nodeId) {
  const hit = NODEIDX[String(nodeId).toUpperCase().trim()]; if (hit) renderCard(hit);
}

function onK(e) {
  let v = document.getElementById('ci').value.trim().toUpperCase();
  if (v.length > 4) v = v.substring(0, 4);

  if (e.key === 'Enter' && v) {
    if (v.startsWith('701')) {
      document.getElementById('ci').value = '';
      document.getElementById('rcard').innerHTML = '';
      return;
    }
    if (NODEIDX[v]) lookupNode(v); else flashError();
  }
}

function flashError() {
  const ci = document.getElementById('ci');
  ci.style.borderColor = '#ef4444';
  setTimeout(() => { ci.style.borderColor = ''; }, 600);
}

/* ── RENDER CARD (TRIAGEM) ────────────────────────────────────
   Exibe card completo com dia da saída real adicionado
   ------------------------------------------------------------ */
function renderCard(hit) {
  const rc = document.getElementById('rcard');
  const { rota: r, mun: m, prev, next, pos, total } = hit;
  const nb = bB(m.nome);
  const nx = nb ? labelDays(nb.days) : { l: '---', c: 'ns' };
  ultimaRotaAtiva = r.num;

  // Reinicia timer de auto-limpeza (15 segundos)
  if (timerAutoLimpeza) clearTimeout(timerAutoLimpeza);
  timerAutoLimpeza = setTimeout(() => {
    document.getElementById('ci').value = '';
    document.getElementById('ci').focus();
    rc.innerHTML = ''; rc.className = ''; ultimaRotaAtiva = null;
  }, 15000);

  // AJUSTE: Bloco de info com o dia da saída real explícito
  let embInfo = '';
  if (nb) {
    embInfo = `
      <div style="margin-top:10px;padding:8px 12px;background:#0b0d11;border-radius:6px;border-left:3px solid ${r.cor};font-size:12px;color:#9ba3b4;">
        <span style="color:#fff;font-weight:700;">${nb.embarcacao}</span>
        ${nb.porto ? `<span style="color:#737a8c"> · ${nb.porto}</span>` : ''}
        <span style="color:${r.cor};font-weight:700;"> · Saída: ${nb.diaSemana} (${nx.l})</span>
      </div>`;
  }

  const prevInfo = prev
    ? `<div style="font-size:11px;color:#737a8c;margin-top:4px;">⬅ Anterior: <b style="color:#9ba3b4">${prev.seq} — ${prev.nome}</b></div>`
    : `<div style="font-size:11px;color:#334155;margin-top:4px;">⬅ Primeiro da calha</div>`;
  const nextInfo = next
    ? `<div style="font-size:11px;color:#737a8c;margin-top:4px;">➡ Próximo: <b style="color:#9ba3b4">${next.seq} — ${next.nome}</b></div>`
    : `<div style="font-size:11px;color:#334155;margin-top:4px;">➡ Último da calha</div>`;

  rc.innerHTML = `
    <div class="rcm" style="border:2px solid ${r.cor};border-radius:12px;padding:18px;background:#12151b;">

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="font-size:44px;font-weight:900;color:${r.cor};letter-spacing:2px;font-family:monospace;">${m.seq}</div>
        <div style="text-align:right;">
          <div style="background:${r.cor};padding:4px 12px;border-radius:6px;font-weight:900;color:#fff;font-size:12px;letter-spacing:1px;">CALHA ${r.nome.toUpperCase()}</div>
          <div style="font-size:10px;color:#737a8c;margin-top:4px;">Pos. ${pos} de ${total}</div>
        </div>
      </div>

      <div style="font-size:26px;font-weight:800;color:#e8eaf0;margin-bottom:12px;">${m.nome}</div>

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

      ${embInfo}

      <div style="margin-top:12px;padding:10px;background:#0b0d11;border-radius:6px;border:1px solid #1a1e26;">
        <div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Calha ${r.nome}</div>
        ${prevInfo}
        ${nextInfo}
      </div>

    </div>`;
  rc.className = 'show';
  adicionarRecente(hit);
}

/* ── RECENTES ───────────────────────────────────────────────── */
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

/* ── ABA ROTAS ────────────────────────────────────────────────
   AJUSTE: Limpo e focado estritamente em Transit Time, Distância e Barcos Disponíveis.
   ------------------------------------------------------------ */
function bRO() {
  const body = document.getElementById('rbdy'); if (!body) return; body.innerHTML = '';
  ROTAS.forEach(r => {

    const header = `
      <div style="font-weight:800;margin:18px 0 8px;color:${r.cor};font-size:12px;letter-spacing:1px;text-transform:uppercase;padding:8px 12px;background:#12151b;border-radius:6px;border-left:3px solid ${r.cor};">
        Calha ${r.nome} · Rota ${r.num} · ${r.municipios.length} municípios · ${r.dir}
      </div>`;

    const mH = r.municipios.map((m) => {
      const nb = bB(m.nome);
      const nx = nb ? labelDays(nb.days) : { l: '---', c: 'ns' };

      // Linha simplificada do barco
      const embLine = nb
        ? `<div style="margin-top:5px;font-size:11px;color:#737a8c;">
            🚢 <b style="color:#e8eaf0;">${nb.embarcacao}</b> ${nb.porto ? `· ${nb.porto}` : ''} · Saída: <b style="color:#e8eaf0;">${nb.diaSemana}</b> (<span style="color:${nx.c==='nt'?'#22c55e':nx.c==='nw'?'#f59e0b':'#9ba3b4'};">${nx.l}</span>)
           </div>`
        : `<div style="margin-top:5px;font-size:11px;color:#475569;">🚢 Nenhuma embarcação cadastrada</div>`;

      return `
        <div class="mrow"
          style="padding:12px 14px;background:#1a1e26;margin-bottom:4px;border-radius:6px;cursor:pointer;border-left:2px solid ${r.cor}22;"
          onclick="abrirModalRota('${m.seq}')">
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
            <span style="color:${r.cor};font-weight:900;font-family:monospace;font-size:14px;min-width:50px;">${m.seq}</span>
            <span style="flex:1;font-size:14px;font-weight:700;color:#e8eaf0;">${m.nome}</span>
            <div style="display:flex;gap:8px;flex-shrink:0;">
              <span style="background:#0b0d11;padding:3px 8px;border-radius:4px;font-size:11px;color:#9ba3b4;">TT: <b>${m.tt}</b></span>
              <span style="background:#0b0d11;padding:3px 8px;border-radius:4px;font-size:11px;color:#9ba3b4;"><b>${m.km}</b> km</span>
            </div>
          </div>
          ${embLine}
        </div>`;
    }).join('');

    let d = document.createElement('div');
    d.innerHTML = header + mH;
    body.appendChild(d);
  });
}

function fR(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.mrow').forEach(el =>
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none'
  );
}

/* ── MODAL DE DETALHE (ABA ROTAS) ──────────────────────────── */
function abrirModalRota(nodeSeq) {
  const hit = NODEIDX[String(nodeSeq).toUpperCase().trim()]; if (!hit) return;
  const { rota: r, mun: m, prev, next, pos, total } = hit;
  const nb = bB(m.nome);
  const nx = nb ? labelDays(nb.days) : { l: '---', c: 'ns' };

  const old = document.getElementById('modal-rota'); if (old) old.remove();

  const embInfo = nb ? `
    <div style="margin-top:10px;padding:8px 12px;background:#0b0d11;border-radius:6px;border-left:3px solid ${r.cor};font-size:12px;color:#9ba3b4;">
      <span style="color:#fff;font-weight:700;">🚢 ${nb.embarcacao}</span>
      ${nb.porto ? `<span style="color:#737a8c;"> · ${nb.porto}</span>` : ''}
      <span style="color:${r.cor};font-weight:700;"> · Dia: ${nb.diaSemana} (${nx.l})</span>
    </div>` : '';

  const overlay = document.createElement('div');
  overlay.id = 'modal-rota';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.85);z-index:999;
    display:flex;align-items:center;justify-content:center;
    padding:16px;box-sizing:border-box;`;

  overlay.innerHTML = `
    <div style="background:#12151b;border-radius:14px;padding:20px;width:100%;max-width:420px;border:2px solid ${r.cor};box-shadow:0 8px 40px rgba(0,0,0,0.9);position:relative;">
      <button onclick="document.getElementById('modal-rota').remove()"
        style="position:absolute;top:12px;right:12px;background:#1a1e26;border:none;color:#737a8c;width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer;font-weight:900;display:flex;align-items:center;justify-content:center;">✕</button>

      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
        <div style="font-size:38px;font-weight:900;color:${r.cor};font-family:monospace;letter-spacing:2px;">${m.seq}</div>
        <div>
          <div style="background:${r.cor};padding:3px 10px;border-radius:5px;font-size:11px;font-weight:900;color:#fff;letter-spacing:1px;display:inline-block;">CALHA ${r.nome.toUpperCase()}</div>
          <div style="font-size:10px;color:#737a8c;margin-top:3px;">Pos. ${pos} de ${total}</div>
        </div>
      </div>

      <div style="font-size:22px;font-weight:800;color:#e8eaf0;margin-bottom:14px;">${m.nome}</div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;">
        <div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;">
          <div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Transit Time</div>
          <div style="font-size:18px;font-weight:900;color:${r.cor};">${m.tt}</div>
        </div>
        <div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;">
          <div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Distância</div>
          <div style="font-size:18px;font-weight:900;color:#e8eaf0;">${m.km} km</div>
        </div>
        <div style="background:#0b0d11;border-radius:6px;padding:8px;text-align:center;">
          <div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;">Prox. Saída</div>
          <div style="font-size:18px;font-weight:900;color:${nx.c==='nt'?'#22c55e':nx.c==='nw'?'#f59e0b':'#9ba3b4'};">${nx.l}</div>
        </div>
      </div>

      ${embInfo}

      <div style="margin-top:10px;padding:10px;background:#0b0d11;border-radius:6px;border:1px solid #1a1e26;">
        <div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Navegação da Calha</div>
        ${prev ? `<div style="font-size:12px;color:#9ba3b4;margin-bottom:6px;cursor:pointer;padding:4px;border-radius:4px;" onclick="abrirModalRota('${prev.seq}')">⬅ <b style="color:#e8eaf0;font-family:monospace;">${prev.seq}</b> — ${prev.nome}</div>` : `<div style="font-size:12px;color:#2a2e3a;margin-bottom:6px;">⬅ Início da calha</div>`}
        <div style="font-size:12px;color:${r.cor};font-weight:700;padding:6px 4px;border-top:1px solid #1a1e26;border-bottom:1px solid #1a1e26;margin:2px 0;">● ${m.nome}</div>
        ${next ? `<div style="font-size:12px;color:#9ba3b4;margin-top:6px;cursor:pointer;padding:4px;border-radius:4px;" onclick="abrirModalRota('${next.seq}')">➡ <b style="color:#e8eaf0;font-family:monospace;">${next.seq}</b> — ${next.nome}</div>` : `<div style="font-size:12px;color:#2a2e3a;margin-top:6px;">➡ Fim da calha</div>`}
      </div>
    </div>`;

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ── MAPA ───────────────────────────────────────────────────── */
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
      const textX = p.x; const textY = p.y + 3.5;
      nt.setAttribute('x', String(textX)); nt.setAttribute('y', String(textY));
      nt.setAttribute('text-anchor', 'middle'); nt.setAttribute('font-size', '8');
      nt.setAttribute('font-weight', '900'); nt.setAttribute('fill', ativo ? '#fff' : r.cor);
      nt.setAttribute('font-family', 'monospace'); nt.textContent = label; grp.appendChild(nt);

      if (ativo) {
        // AJUSTE CRÍTICO DE AUTAZES: Garante envio limpo e exato da string de identificação
        grp.addEventListener('click', e => { 
          e.stopPropagation(); 
          showMapPopup(NODEIDX[String(m.seq).toUpperCase().trim()], p, T, label); 
        });
      }
      g.appendChild(grp);
    });
  });

  svg.appendChild(g);
}

/* ── POPUP DO MAPA ────────────────────────────────────────────
   AJUSTE: Centralizado de forma absoluta e segura na tela para evitar cantos.
   ------------------------------------------------------------ */
function showMapPopup(hit, svgPt, transform, label) {
  if (!hit) return; 
  let popup = document.getElementById('map-popup');
  if (!popup) {
    popup = document.createElement('div'); popup.id = 'map-popup';
    popup.style.cssText = 'position:absolute;z-index:200;background:#12151b;border-radius:10px;padding:14px 16px;width:240px;box-shadow:0 4px 24px rgba(0,0,0,0.85);border:2px solid #232838;font-family:inherit;top:50%;left:50%;transform:translate(-50%, -50%);';
    document.getElementById('sc-m').appendChild(popup);
  }

  const { rota: r, mun: m, prev, next } = hit;
  const nb = bB(m.nome); const nx = nb ? labelDays(nb.days) : { l: '---' };

  popup.style.display = 'block';
  popup.style.pointerEvents = 'all';

  popup.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span style="font-size:20px;font-weight:900;color:${r.cor};font-family:monospace;">${label}</span>
      <span style="font-size:10px;background:${r.cor}22;color:${r.cor};padding:2px 8px;border-radius:4px;font-weight:700;">${r.nome.toUpperCase()}</span>
    </div>
    <div style="font-size:16px;font-weight:800;color:#e8eaf0;margin-bottom:10px;">${m.nome}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
      <div style="background:#0b0d11;border-radius:6px;padding:7px;text-align:center;">
        <div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Transit Time</div>
        <div style="font-size:16px;font-weight:900;color:${r.cor};">${m.tt}</div>
      </div>
      <div style="background:#0b0d11;border-radius:6px;padding:7px;text-align:center;">
        <div style="font-size:9px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Distância</div>
        <div style="font-size:16px;font-weight:900;color:#e8eaf0;">${m.km} km</div>
      </div>
    </div>
    <div style="background:#0b0d11;border-radius:6px;padding:8px;display:flex;flex-direction:column;gap:5px;">
      <div style="font-size:10px;color:#737a8c;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;">Calha</div>
      ${prev ? `<div style="font-size:11px;color:#9ba3b4;">⬅ <b style="color:#e8eaf0;font-family:monospace;">${prev.seq}</b> ${prev.nome}</div>` : `<div style="font-size:11px;color:#334155;">⬅ Início da calha</div>`}
      <div style="font-size:11px;color:${r.cor};font-weight:700;padding:2px 0;">● ${m.nome}</div>
      ${next ? `<div style="font-size:11px;color:#9ba3b4;">➡ <b style="color:#e8eaf0;font-family:monospace;">${next.seq}</b> ${next.nome}</div>` : `<div style="font-size:11px;color:#334155;">➡ Fim da calha</div>`}
    </div>
    <button onclick="fecharPopupMapa()" style="margin-top:10px;width:100%;padding:6px;background:#1a1e26;border:none;color:#737a8c;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700;">FECHAR DETALHES</button>`;

  setTimeout(() => {
    document.addEventListener('click', fecharPopupMapa, { once: true });
  }, 50);
}

function fecharPopupMapa() {
  const p = document.getElementById('map-popup'); if (p) p.style.display = 'none';
}

/* ── FILTRO DE CALHA NO MAPA ────────────────────────────────── */
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
  all.onclick = () => {
    rotaFiltrada = null;
    document.querySelectorAll('.mfbtn').forEach(b => { b.style.opacity='1'; b.style.transform='scale(1)'; b.style.fontWeight='700'; });
    fecharPopupMapa(); renderMap();
  };
  cont.appendChild(all);

  ROTAS.forEach(r => {
    const btn = document.createElement('button'); btn.className = 'mfbtn'; btn.dataset.rota = r.num; btn.textContent = r.num; btn.title = r.nome;
    btn.style.cssText = `background:${r.cor}22;border:1.5px solid ${r.cor};color:${r.cor};padding:6px 10px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;min-width:38px;transition:all .15s;letter-spacing:.5px;`;
    btn.onclick = () => filtrarRota(r.num);
    cont.appendChild(btn);
  });
}

/* ── INTERAÇÕES DO MAPA (arrasto + pinch zoom) ─────────────── */
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
    if (!drag || e.touches.length !== 1) return;
    T.x = e.touches[0].clientX - ds.x; T.y = e.touches[0].clientY - ds.y;
    const mg = document.getElementById('mg'); if (mg) mg.setAttribute('transform', `translate(${T.x},${T.y}) scale(${T.s})`);
  }, { passive: true });
  msvg.addEventListener('touchend', () => { drag = false; });

  let lastDist = null;
  msvg.addEventListener('touchstart', e => { if (e.touches.length === 2) lastDist = null; }, { passive: true });
  msvg.addEventListener('touchmove', e => {
    if (e.touches.length !== 2) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (lastDist) {
      T.s = Math.min(Math.max(T.s * dist / lastDist, 0.5), 8);
      const mg = document.getElementById('mg'); if (mg) mg.setAttribute('transform', `translate(${T.x},${T.y}) scale(${T.s})`);
    }
    lastDist = dist;
  }, { passive: true });
}

function zI() { T.s = Math.min(T.s * 1.3, 8); renderMap(); }
function zO() { T.s = Math.max(T.s / 1.3, 0.5); renderMap(); }
function zR() { T = { s: 1, x: 0, y: 0 }; rotaFiltrada = null; renderMap(); buildMapFilters(); }

/* ── ABA PORTOS ─────────────────────────────────────────────── */
let manifestoPortos = { esc: [], rod: [], 'v-rod': [] };

function popularSeletorPortos() {
  const select = document.getElementById('p-select-mun'); if (!select) return; select.innerHTML = '';
  ROTAS.forEach(r => r.municipios.forEach(m => {
    let opt = document.createElement('option'); opt.value = m.seq; opt.textContent = '[' + m.seq + '] ' + m.nome; select.appendChild(opt);
  }));
}

function addMunToPorto() {
  const nodeVal = document.getElementById('p-select-mun').value;
  const targetPorto = document.getElementById('p-select-target').value;
  const hit = NODEIDX[String(nodeVal).toUpperCase().trim()]; if (!hit) return;
  const jaExiste = [...manifestoPortos.esc, ...manifestoPortos.rod, ...manifestoPortos['v-rod']].some(x => x && x.mun.seq === hit.mun.seq);
  if (jaExiste) { alert('Municipio ja esta distribuido.'); return; }
  manifestoPortos[targetPorto].push(hit); renderTabelaPortos();
}

function removeMunPorto(porto, seq) {
  manifestoPortos[porto] = manifestoPortos[porto].filter(x => x && x.mun.seq !== seq); renderTabelaPortos();
}

/* AJUSTE RESPONSIVO: Aloca os dados simultaneamente na lista visível do celular e na gêmea oculta do print */
function renderTabelaPortos() {
  ['esc', 'rod', 'v-rod'].forEach(p => {
    const containerView = document.querySelector('#view-col-' + p + ' .p-items-list');
    const containerPrint = document.querySelector('#print-col-' + p + ' .p-items-list');
    
    if (containerView) containerView.innerHTML = '';
    if (containerPrint) containerPrint.innerHTML = '';
    
    const tituloView = document.querySelector('#view-col-' + p + ' .p-col-title');
    const tituloPrint = document.querySelector('#print-col-' + p + ' .p-col-title');
    const nomes = { esc: 'PORTO ESCADARIA', rod: 'PORTO ROADWAY', 'v-rod': 'RODOVIÁRIO' };
    
    if (tituloView) tituloView.textContent = nomes[p] + ' (' + manifestoPortos[p].length + ')';
    if (tituloPrint) tituloPrint.textContent = nomes[p] + ' (' + manifestoPortos[p].length + ')';
    
    manifestoPortos[p].forEach(hit => {
      if (!hit) return;
      
      // Lista operacional visível no celular
      let itemView = document.createElement('div'); 
      itemView.className = 'p-item';
      itemView.innerHTML = '<span><b style="font-family:monospace">' + hit.mun.seq + '</b> - ' + hit.mun.nome + '</span><button onclick="removeMunPorto(\'' + p + '\',\'' + hit.mun.seq + '\')">X</button>';
      if (containerView) containerView.appendChild(itemView);

      // Lista do print sem botões de exclusão "X"
      let itemPrint = document.createElement('div'); 
      itemPrint.className = 'p-item';
      itemPrint.innerHTML = '<span><b style="font-family:monospace">' + hit.mun.seq + '</b> - ' + hit.mun.nome + '</span>';
      if (containerPrint) containerPrint.appendChild(itemPrint);
    });
  });
}

/* AJUSTE MESTRE: Varre a base estruturada e distribui dinamicamente 100% dos municípios pelas calhas */
function resetarTabelaPortos() {
  manifestoPortos.esc = [];
  manifestoPortos.rod = [];
  manifestoPortos['v-rod'] = [];

  ROTAS.forEach(r => {
    r.municipios.forEach(m => {
      const hit = NODEIDX[String(m.seq).toUpperCase().trim()];
      if (!hit) return;

      // Terrestres e Rodoviários (H e I) -> RODOVIÁRIO
      if (r.num === 'H' || r.num === 'I') {
        manifestoPortos['v-rod'].push(hit);
      } 
      // Médio e Alto Solimões (D e E) -> PORTO ROADWAY
      else if (r.num === 'D' || r.num === 'E') {
        manifestoPortos.rod.push(hit);
      } 
      // Demais calhas fluviais (A, B, C, F, G, J) -> PORTO ESCADARIA
      else {
        manifestoPortos.esc.push(hit);
      }
    });
  });

  renderTabelaPortos();
}

/* AJUSTE: Cópia e renderização de segurança com suporte a plano B para navegadores mobile */
function gerarImagemWhatsapp() {
  const area = document.getElementById('capture-area');
  if (typeof html2canvas === 'undefined') { alert('html2canvas nao carregado.'); return; }
  
  html2canvas(area, { backgroundColor: '#0b0d11', scale: 2 }).then(canvas => {
    canvas.toBlob(blob => {
      if (!blob) { alert('Erro ao gerar imagem.'); return; }
      
      try {
        const data = [new ClipboardItem({ 'image/png': blob })];
        navigator.clipboard.write(data).then(() => {
          alert('Imagem do manifesto HORIZONTAL copiada com sucesso! Vá ao WhatsApp e aperte Colar.');
        }).catch(err => {
          abrirImagemParaCopiaManual(canvas.toDataURL('image/png'));
        });
      } catch (e) {
        abrirImagemParaCopiaManual(canvas.toDataURL('image/png'));
      }
    }, 'image/png');
  });
}

function abrirImagemParaCopiaManual(dataUrl) {
  const old = document.getElementById('popup-print-seguro'); if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'popup-print-seguro';
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:16px; box-sizing:border-box;';

  overlay.innerHTML = `
    <div style="text-align:center; color:#fff; font-size:13px; font-weight:700; margin-bottom:12px; background:#14b8a6; padding:8px 14px; border-radius:6px;">
      📱 TOQUE E SEGURE NA IMAGEM ABAIXO PARA COPIAR OU SALVAR
    </div>
    <div style="width:100%; max-width:500px; overflow-x:auto; background:#12151b; padding:10px; border-radius:8px; border:1px solid #232838; box-shadow:0 8px 32px rgba(0,0,0,0.5);">
      <img src="${dataUrl}" style="width:100%; height:auto; display:block; border-radius:4px;" />
    </div>
    <button onclick="document.getElementById('popup-print-seguro').remove()" 
      style="margin-top:16px; padding:10px 20px; background:#ef4444; border:none; color:#fff; font-weight:bold; border-radius:6px; cursor:pointer; width:100%; max-width:200px;">
      VOLTAR PRO APP
    </button>
  `;

  document.body.appendChild(overlay);
}

/* ── NAVEGAÇÃO ENTRE ABAS ───────────────────────────────────── */
function SS(name, btn) {
  cur = name;
  ['t', 'r', 'm', 'l'].forEach(s => {
    const el = document.getElementById('sc-' + s);
    if (el) { el.className = (s === name) ? 'scr' : 'scr h'; el.style.display = (s === name) ? '' : 'none'; }
  });
  if (btn) { document.querySelectorAll('.htab').forEach(b => b.classList.remove('on')); btn.classList.add('on'); }
  ['t', 'r', 'm', 'l'].forEach(s => { const bt = document.getElementById('bt-' + s); if (bt) bt.classList.toggle('on', s === name); });
  if (name === 'm') { buildMapFilters(); renderMap(); initMapInteractions(); }
  if (name === 'l') { popularSeletorPortos(); renderTabelaPortos(); }
  if (name === 't') { setTimeout(() => { const ci = document.getElementById('ci'); if (ci) ci.focus(); }, 100); }
}

/* ── INICIALIZAÇÃO CORRIGIDA (CARGA MESTRE COMPLETA) ──────────
   AJUSTE DE FLUXO: Sincroniza a montagem da árvore mestre antes da distribuição
   ------------------------------------------------------------ */
bRO();
resetarTabelaPortos();
renderRecentes();

['r', 'm', 'l'].forEach(s => {
  const el = document.getElementById('sc-' + s);
  if (el) { el.style.display = 'none'; el.className = 'scr h'; }
});
const scT = document.getElementById('sc-t');
if (scT) { scT.style.display = ''; scT.className = 'scr'; }

window.addEventListener('load', () => { const ci = document.getElementById('ci'); if (ci) ci.focus(); });

/* ── COPIAR MANIFESTO COMO TEXTO PARA WHATSAPP ──────────────── */
function copiarTextoWhatsapp() {
  let texto = `*FÁCIL EXPRESS LTDA · DESPACHO DIÁRIO*\n`;
  texto += `------------------------------------------\n\n`;

  texto += `🚢 *PORTO ESCADARIA (${manifestoPortos.esc.length})*\n`;
  if (manifestoPortos.esc.length === 0) texto += `_(Vazio)_\n`;
  manifestoPortos.esc.forEach(hit => {
    if (hit) texto += `• *${hit.mun.seq}* - ${hit.mun.nome}\n`;
  });
  texto += `\n`;

  texto += `🚢 *PORTO ROADWAY (${manifestoPortos.rod.length})*\n`;
  if (manifestoPortos.rod.length === 0) texto += `_(Vazio)_\n`;
  manifestoPortos.rod.forEach(hit => {
    if (hit) texto += `• *${hit.mun.seq}* - ${hit.mun.nome}\n`;
  });
  texto += `\n`;

  texto += `🚚 *RODOVIÁRIO (${manifestoPortos['v-rod'].length})*\n`;
  if (manifestoPortos['v-rod'].length === 0) texto += `_(Vazio)_\n`;
  manifestoPortos['v-rod'].forEach(hit => {
    if (hit) texto += `• *${hit.mun.seq}* - ${hit.mun.nome}\n`;
  });

  navigator.clipboard.writeText(texto).then(() => {
    alert('Texto do manifesto copiado! Agora é só ir no WhatsApp e colar.');
  }).catch(err => {
    alert('Erro ao copiar texto automaticamente. Verifique as permissões do navegador.');
  });
}

```
