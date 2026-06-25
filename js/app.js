/* ============================================================
   RIVER OPS — TRIAGEM — LÓGICA CORE TOTALMENTE ATUALIZADA
   ============================================================ */

const IDX={}; const SLAMIDX={}; const NODEIDX={};
ROTAS.forEach(r=>r.municipios.forEach((m,i)=>{
  const rec={rota:r,mun:m,pos:i+1,total:r.municipios.length,
    prev:r.municipios[i-1]||null,
    next:r.municipios[i+1]||null};
  IDX[m.cep]=rec;
  NODEIDX[String(m.seq)]=rec; // Indexação prioritária chaveada por NODE
  if(m.slam){
    if(!SLAMIDX[m.slam]) SLAMIDX[m.slam]=[];
    SLAMIDX[m.slam].push(rec); 
  }
}));

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function emitirBipe(sucesso) {
  try {
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    if (sucesso) {
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    } else {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, audioCtx.currentTime); gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.start(); osc.stop(audioCtx.currentTime + 0.35);
    }
  } catch(e) {}
}

function pD(s){
  if(!s)return [];
  const t=s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/-feira/g,'');
  const o=new Set();
  Object.entries(DP).forEach(([k,v])=>{ if(t.includes(k)) o.add(v); });
  return [...o].sort();
}

function nD(s){
  const d=pD(s); if(!d.length)return null;
  const td=new Date().getDay(); let m=7;
  d.forEach(x=>{ let df=x-td; if(df<0)df+=7; if(df<m)m=df; });
  return m;
}

function nL(d){
  if(d===null)return{l:'?',c:'ns'};
  if(d===0)return{l:'HOJE',c:'nt'}; 
  if(d===1)return{l:'AMANHA',c:'nw'}; 
  return{l:'em '+d+'d',c:'ns'}; 
}

let ultimaRotaAtiva = null; let timerAutoLimpeza = null;

function onCI(v){
  const text=v.trim();
  if(!text) return;
  const hasLetter=/[A-Za-z]/.test(text);
  if(hasLetter){
    const sig=text.toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(sig.length>=3) lookupSlam(sig);
  } else {
    if(NODEIDX[text]) lookupNode(text);
  }
}

function lookupNode(nodeId){
  const hit=NODEIDX[nodeId];
  if(hit) renderCard(hit);
}

function lookupSlam(sig){
  const rc=document.getElementById('rcard'); const recs=SLAMIDX[sig];
  if(!recs||!recs.length){ emitirBipe(false); return; }
  if(recs.length===1){ renderCard(recs[0]); return; }
  let h='<div class="nfd" style="text-align:left; background: #1a1e26; padding:10px; border-radius:6px;">';
  recs.forEach(rec=>{
    h+='<div onclick="NODEIDX[\''+rec.mun.seq+'\']?renderCard(NODEIDX[\''+rec.mun.seq+'\']):null" style="display:flex;align-items:center;gap:10px;padding:8px;background:#12151b;margin-bottom:5px;cursor:pointer;border-radius:4px;"><div style="background:'+rec.rota.cor+';padding:4px 10px;border-radius:4px;font-weight:bold;">'+rec.mun.seq+'</div><div>'+rec.mun.nome+' (Rota '+rec.rota.num+')</div></div>';
  });
  h+='</div>'; rc.innerHTML=h; rc.className='show';
}

function onK(e){if(e.key==='Enter') onCI(document.getElementById('ci').value);}

function renderCard(hit){
  const rc=document.getElementById('rcard'); const{rota:r,mun:m,prev,next}=hit;
  const nb=bB(m.nome); const nx=nL(nb?nb.days:null);
  
  if (ultimaRotaAtiva===null||ultimaRotaAtiva===r.num) emitirBipe(true); else emitirBipe(false);
  ultimaRotaAtiva=r.num;

  if (timerAutoLimpeza) clearTimeout(timerAutoLimpeza);
  timerAutoLimpeza = setTimeout(() => {
    document.getElementById('ci').value = ''; document.getElementById('ci').focus();
  }, 3000);

  rc.innerHTML='<div class="rcm" style="border:2px solid '+r.cor+'; border-radius:12px; padding:15px; background:#12151b;"><div style="display:flex; justify-content:space-between; align-items:center;"><div style="font-size:42px; font-weight:900; color:'+r.cor+'">Node '+m.seq+'</div><div style="background:'+r.cor+'; padding:5px 12px; border-radius:6px; font-weight:bold; color:#fff;">Rota '+r.num+'</div></div><div style="font-size:22px; font-weight:bold; margin:10px 0;">'+m.nome+'</div><div style="color:#737a8c; font-size:13px;">Transit Time: '+m.tt+' | Próxima Saída: '+nx.l+'</div></div>';
  rc.className='show';
}

// ── SISTEMA INTEGRADO DA ABA DE PORTOS (DADOS DO EXCEL) ──
let manifestoPortos = { esc: [], rod: [], "v-rod": [] };

// Amarra a listagem oficial extraída direto do seu documento de manifesto
const LISTA_PADRAO_PORTOS = {
  esc: [
    NODEIDX["1"], NODEIDX["2"], NODEIDX["3"], NODEIDX["4"], NODEIDX["10"], NODEIDX["11"],
    NODEIDX["12"], NODEIDX["13"], NODEIDX["14"], NODEIDX["15"], NODEIDX["19"], NODEIDX["36"],
    NODEIDX["38"], NODEIDX["39"], NODEIDX["55"], NODEIDX["56"]
  ],
  rod: [
    NODEIDX["5"], NODEIDX["6"], NODEIDX["7"], NODEIDX["8"], NODEIDX["20"], NODEIDX["21"],
    NODEIDX["22"], NODEIDX["23"], NODEIDX["24"], NODEIDX["25"], NODEIDX["26"], NODEIDX["27"],
    NODEIDX["28"], NODEIDX["29"], NODEIDX["30"], NODEIDX["31"], NODEIDX["32"], NODEIDX["33"],
    NODEIDX["34"], NODEIDX["35"], NODEIDX["37"]
  ],
  "v-rod": [
    NODEIDX["9"], NODEIDX["16"], NODEIDX["17"], NODEIDX["18"], NODEIDX["41"], NODEIDX["42"],
    NODEIDX["43"], NODEIDX["44"], NODEIDX["46"], NODEIDX["47"], NODEIDX["48"], NODEIDX["49"],
    NODEIDX["50"], NODEIDX["51"], NODEIDX["52"], NODEIDX["53"], NODEIDX["54"]
  ]
};

function popularSeletorPortos() {
  const select = document.getElementById('p-select-mun'); if(!select) return;
  select.innerHTML = '';
  ROTAS.forEach(r => r.municipios.forEach(m => {
    let opt = document.createElement('option'); opt.value = m.seq; opt.textContent = `[Node ${m.seq}] ${m.nome}`;
    select.appendChild(opt);
  }));
}

function addMunToPorto() {
  const nodeVal = document.getElementById('p-select-mun').value;
  const targetPorto = document.getElementById('p-select-target').value;
  const hit = NODEIDX[nodeVal]; if(!hit) return;

  if(manifestoPortos.esc.concat(manifestoPortos.rod, manifestoPortos["v-rod"]).some(x => x.mun.seq === hit.mun.seq)) {
    alert("Município já está distribuído."); return;
  }
  manifestoPortos[targetPorto].push(hit); renderTabelaPortos();
}

function removeMunPorto(porto, seq) {
  manifestoPortos[porto] = manifestoPortos[porto].filter(x => x.mun.seq !== seq);
  renderTabelaPortos();
}

function renderTabelaPortos() {
  ['esc', 'rod', 'v-rod'].forEach(p => {
    const container = document.querySelector(`#col-${p} .p-items-list`); if(!container) return;
    container.innerHTML = '';
    manifestoPortos[p].forEach(hit => {
      if(!hit) return;
      let item = document.createElement('div'); item.className = 'p-item';
      item.innerHTML = `<span><b>${hit.mun.seq}</b> - ${hit.mun.nome}</span><button onclick="removeMunPorto('${p}', ${hit.mun.seq})">✕</button>`;
      container.appendChild(item);
    });
  });
}

function resetarTabelaPortos() {
  manifestoPortos.esc = [...LISTA_PADRAO_PORTOS.esc];
  manifestoPortos.rod = [...LISTA_PADRAO_PORTOS.rod];
  manifestoPortos["v-rod"] = [...LISTA_PADRAO_PORTOS.v-rod];
  renderTabelaPortos();
}

function gerarImagemWhatsapp() {
  const area = document.getElementById('capture-area');
  html2canvas(area, { backgroundColor: "#0b0d11" }).then(canvas => {
    let link = document.createElement('a'); link.download = 'despacho-facil-express.png';
    link.href = canvas.toDataURL(); link.click();
  });
}

// ── DESENHO VETORIAL DO MAPA COM TRAÇADOS AMPLIADOS ──
let T={s:1,x:0,y:0},focR=null,mttTimer=null;
function gR(n){return ROTAS.find(r=>r.num===n);}
function renderMap(){
  const svg=document.getElementById('msvg'); if(!svg)return; svg.innerHTML='';
  const NS='http://www.w3.org/2000/svg'; const W=900,H=600;
  const LNG0=-74.5,LNG1=-53.5,LAT0=-10.6,LAT1=2.7;
  function merc(lat){return Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));}
  const m0=merc(LAT0),m1=merc(LAT1);
  function proj(lat,lng){ return {x:(lng-LNG0)/(LNG1-LNG0)*W, y:(m1-merc(lat))/(m1-m0)*H}; }
  
  const defs=document.createElementNS(NS,'defs');
  defs.innerHTML='<pattern id="gr" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0L0 0 0 30" fill="none" stroke="#0f172a" stroke-width=".4"/></pattern><filter id="gw"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  svg.appendChild(defs);
  
  const g=document.createElementNS(NS,'g'); g.id='mg'; g.setAttribute('transform','translate('+T.x+','+T.y+') scale('+T.s+')');
  const bg=document.createElementNS(NS,'rect'); bg.setAttribute('width',W); bg.setAttribute('height',H); bg.setAttribute('fill','#070c14'); g.appendChild(bg); 
  const gr=document.createElementNS(NS,'rect'); gr.setAttribute('width',W); gr.setAttribute('height',H); gr.setAttribute('fill','url(#gr)'); g.appendChild(gr);
  
  const bPts=AM_BORDER.map(([lat,lng])=>{const p=proj(lat,lng);return p.x+','+p.y;}).join(' ');
  const border=document.createElementNS(NS,'polygon'); border.setAttribute('points',bPts); border.setAttribute('fill','#0f1b2d'); border.setAttribute('stroke','#1e3552'); border.setAttribute('stroke-width','2'); g.appendChild(border);
  
  RIOS.forEach(rv=>{
    const pts=rv.coords.map(([lat,lng])=>{const p=proj(lat,lng);return p.x+' '+p.y;});
    const path=document.createElementNS(NS,'polyline'); path.setAttribute('points',pts.join(', ')); path.setAttribute('fill','none'); path.setAttribute('stroke','#0284c7'); path.setAttribute('stroke-width',rv.w); path.setAttribute('opacity','0.75'); path.setAttribute('stroke-linecap','round'); g.appendChild(path);
  });
  
  const hub=proj(-3.119,-60.021);
  const hc=document.createElementNS(NS,'circle'); hc.setAttribute('cx',hub.x); hc.setAttribute('cy',hub.y); hc.setAttribute('r','6'); hc.setAttribute('fill','#14b8a6'); hc.setAttribute('filter','url(#gw)'); g.appendChild(hc);
  
  ROTAS.forEach(r=>{
    const pts=r.municipios.map(m=> LATLNG[m.cep] ? proj(LATLNG[m.cep].lat, LATLNG[m.cep].lng) : null).filter(Boolean);
    if(pts.length){
      const lineCoords=[[hub.x,hub.y],...pts.map(p=>[p.x,p.y])];
      const polyPts=lineCoords.map(p=>p[0]+' '+p[1]).join(', ');
      const line=document.createElementNS(NS,'polyline'); line.setAttribute('points',polyPts); line.setAttribute('fill','none'); line.setAttribute('stroke',r.cor); line.setAttribute('stroke-width','2'); line.setAttribute('opacity','0.55'); line.setAttribute('stroke-linecap','round'); g.appendChild(line);
    }
  });
  
  ROTAS.forEach(r=>{
    r.municipios.forEach(m=>{
      const ll=LATLNG[m.cep]; if(!ll)return;
      const p=proj(ll.lat,ll.lng);
      const grp=document.createElementNS(NS,'g'); grp.style.cursor='pointer';
      
      // AMPLIAÇÃO DOS MARCADORES DO MAPA SOLICITADO
      const bb=document.createElementNS(NS,'rect');
      bb.setAttribute('x',p.x-11); bb.setAttribute('y',p.y-9);
      bb.setAttribute('width','22'); bb.setAttribute('height','18');
      bb.setAttribute('rx','4'); bb.setAttribute('fill',r.cor);
      bb.setAttribute('filter','url(#gw)'); grp.appendChild(bb);
      
      const nt=document.createElementNS(NS,'text');
      nt.setAttribute('x',p.x); nt.setAttribute('y',p.y+3.5);
      nt.setAttribute('text-anchor','middle'); nt.setAttribute('font-size','11');
      nt.setAttribute('font-weight','900'); nt.setAttribute('fill','#fff');
      nt.setAttribute('font-family','monospace'); nt.textContent=m.seq; grp.appendChild(nt);
      
      grp.addEventListener('click', () => renderCard(NODEIDX[m.seq]));
      g.appendChild(grp);
    });
  });
  svg.appendChild(g);
}

function bRO(){
  const body=document.getElementById('rbdy'); if(!body) return; body.innerHTML='';
  ROTAS.forEach(r=>{
    const mH=r.municipios.map(m=> `<div class="mrow" style="padding:10px; background:#1a1e26; margin-bottom:4px; border-radius:4px; cursor:pointer;" onclick="lookupNode('${m.seq}')"><span style="color:${r.cor}; font-weight:bold; margin-right:10px;">Node ${m.seq}</span><span>${m.nome}</span></div>`).join('');
    let d=document.createElement('div'); d.innerHTML=`<div style="font-weight:bold; margin:12px 0 6px; color:${r.cor}">Calha ${r.nome} (Rota ${r.num})</div>`+mH; body.appendChild(d);
  });
}

function fR(q){ q=q.toLowerCase(); document.querySelectorAll('.mrow').forEach(el=> el.style.display=el.textContent.toLowerCase().includes(q)?'':'none'); }
function SS(name,btn,mid) {
  cur=name; ['t','r','m','l','p'].forEach(s=>{
    const el=document.getElementById('sc-'+s); if(el) el.className=(s===name)?'scr':'scr h';
  });
  if(btn){document.querySelectorAll('.htab').forEach(b=>b.classList.remove('on')); btn.classList.add('on');}
  if(name==='m') renderMap();
  if(name==='l') { popularSeletorPortos(); renderTabelaPortos(); }
}

function initMapInteractions(){
  const msvg=document.getElementById('msvg'); if(!msvg) return; let drag=false,ds={};
  msvg.addEventListener('mousedown',e=>{drag=true;ds={x:e.clientX-T.x,y:e.clientY-T.y};});
  document.addEventListener('mousemove',e=>{if(!drag)return;T.x=e.clientX-ds.x;T.y=e.clientY-ds.y;document.getElementById("mg").setAttribute("transform","translate("+T.x+","+T.y+") scale("+T.s+")");});
  document.addEventListener('mouseup',()=>{drag=false;});
}

bRO(); initMapInteractions(); popularSeletorPortos(); resetarTabelaPortos();
function zI(){T.s*=1.3; renderMap();} function zO(){T.s/=1.3; renderMap();} function zR(){T={s:1,x:0,y:0}; renderMap();}
function cSh(){} function printGuide(){}
