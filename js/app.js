/* ============================================================
   RIVER OPS — TRIAGEM — lógica da aplicação
   Depende de js/data.js (deve ser carregado ANTES deste arquivo).
   ============================================================ */

const IDX={};const SLAMIDX={};
ROTAS.forEach(r=>r.municipios.forEach((m,i)=>{
  const rec={rota:r,mun:m,pos:i+1,total:r.municipios.length,
    prev:r.municipios[i-1]||null,
    next:r.municipios[i+1]||null};
  IDX[m.cep]=rec;
  if(m.slam){if(!SLAMIDX[m.slam])SLAMIDX[m.slam]=[];SLAMIDX[m.slam].push(rec);}
}));

function pD(s){if(!s)return[];const t=s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/-feira/g,'');const o=new Set();Object.entries(DP).forEach(([k,v])=>{if(t.includes(k))o.add(v);});return[...o].sort();}
function nD(s){const d=pD(s);if(!d.length)return null;const td=new Date().getDay();let m=7;d.forEach(x=>{let df=x-td;if(df<0)df+=7;if(df<m)m=df;});return m;}
function nL(d){if(d===null)return{l:'?',c:'ns'};if(d===0)return{l:'HOJE',c:'nt'};if(d===1)return{l:'AMANHA',c:'nw'};return{l:'em '+d+'d',c:'ns'};}
function nm(s){return s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9 ]/g,'').trim();}
const STOPWORDS=['DE','DA','DO','DOS','DAS'];
function nmCore(s){return nm(s).split(' ').filter(w=>!STOPWORDS.includes(w)).join(' ');}
function gE(nome){
  const k=nm(nome);
  let h=null;
  Object.keys(EMBS).forEach(ek=>{if(!h&&nm(ek)===k)h=EMBS[ek];});
  if(!h){
    const kc=nmCore(nome);
    Object.keys(EMBS).forEach(ek=>{if(!h&&nmCore(ek)===kc)h=EMBS[ek];});
  }
  if(!h){
    const k2=k.split(' ').slice(0,2).join(' ');
    Object.keys(EMBS).forEach(ek=>{if(!h&&nm(ek).split(' ').slice(0,2).join(' ')===k2)h=EMBS[ek];});
  }
  return h;
}

function bB(nome){
  const e=gE(nome);
  if(!e)return null;
  const boats = e.e || e.estream;
  if(!boats || !boats.forEach) return null;
  let min=8,best=null;
  boats.forEach(b=>{const d=nD(b.d);if(d!==null&&d<min){min=d;best=b;}});
  return best?{boat:best,days:min}:null;
}

let recent=[];try{recent=JSON.parse(localStorage.getItem('rv4')||'[]');}catch(e){}
function sR(c){if(!recent.includes(c)){recent.unshift(c);if(recent.length>8)recent=recent.slice(0,8);try{localStorage.setItem('rv4',JSON.stringify(recent));}catch(e){}}rR();}
function rR(){const b=document.getElementById('recb'),ch=document.getElementById('rchp');if(!recent.length){b.style.display='none';return;}b.style.display='block';ch.innerHTML=recent.map(c=>'<div class="chip" onclick="lookup(\''+c+'\')">'+c+'</div>').join('');}

let lC='';
function onCI(v){
  const hasLetter=/[A-Za-z]/.test(v);
  if(hasLetter){
    const sig=v.toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(sig.length>=3){lookupSlam(sig);}
    else{const rc=document.getElementById('rcard');rc.className='';rc.innerHTML='';lC='';}
    return;
  }
  const c=v.replace(/\D/g,'');if(c.length>=5){const c5=c.slice(0,5);if(c5!==lC){lC=c5;lookup(c5);}}else{const rc=document.getElementById('rcard');rc.className='';rc.innerHTML='';lC='';}
}
function lookupSlam(sig){
  const rc=document.getElementById('rcard');
  const recs=SLAMIDX[sig];
  if(!recs||!recs.length){
    rc.innerHTML='<div class="nfd"><div class="nfi">&#128269;</div><div class="nft">Sigla '+sig+' nao encontrada</div><div class="nfs">Verifique a sigla SLAM ou digite o CEP.</div></div>';
    rc.className='show';return;
  }
  if(recs.length===1){lookup(recs[0].mun.cep);return;}
  let h='<div class="nfd" style="text-align:left"><div style="font-size:13px;font-weight:700;margin-bottom:10px;text-align:center">Sigla '+sig+' atende '+recs.length+' municipios</div>';
  recs.forEach(rec=>{
    h+='<div onclick="lookup(\''+rec.mun.cep+'\')" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--s2);border:1px solid var(--bd);border-radius:8px;margin-bottom:6px;cursor:pointer"><div style="width:34px;height:34px;border-radius:8px;background:'+rec.rota.cor+';display:flex;align-items:center;justify-content:center;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;font-weight:700;color:#fff;flex-shrink:0">'+String(rec.mun.seq).padStart(2,"0")+'</div><div style="flex:1"><div style="font-size:13px;font-weight:600">'+rec.mun.nome+'</div><div style="font-size:10px;color:var(--mu)">Rota '+String(rec.rota.num).padStart(2,"0")+' - '+rec.rota.nome+' - CEP '+rec.mun.cep+'</div></div></div>';
  });
  h+='</div>';
  rc.innerHTML=h;rc.className='show';
}
function onK(e){if(e.key==='Enter'){const v=document.getElementById('ci').value.replace(/\D/g,'');if(v.length>=5)lookup(v.slice(0,5));}}
function lookup(cep5){
  document.getElementById('ci').value=cep5;lC=cep5;
  const rc=document.getElementById('rcard');
  const hit=IDX[cep5];
  if(!hit){
    const matches=Object.keys(IDX).filter(k=>k.slice(0,4)===cep5.slice(0,4));
    if(matches.length===1){lookup(matches[0]);return;}
    if(matches.length>1){
      let h='<div class="nfd" style="text-align:left"><div style="font-size:13px;font-weight:700;margin-bottom:4px;text-align:center">CEP '+cep5+' nao encontrado exatamente</div><div style="font-size:11px;color:var(--mu);text-align:center;margin-bottom:10px">Encontrei '+matches.length+' municipios com CEP parecido — confirme qual e o correto:</div>';
      matches.forEach(k=>{
        const rec=IDX[k];
        h+='<div onclick="lookup(\''+k+'\')" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--s2);border:1px solid var(--bd);border-radius:8px;margin-bottom:6px;cursor:pointer"><div style="width:34px;height:34px;border-radius:8px;background:'+rec.rota.cor+';display:flex;align-items:center;justify-content:center;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;font-weight:700;color:#fff;flex-shrink:0">'+String(rec.mun.seq).padStart(2,"0")+'</div><div style="flex:1"><div style="font-size:13px;font-weight:600">'+rec.mun.nome+'</div><div style="font-size:10px;color:var(--mu)">Rota '+String(rec.rota.num).padStart(2,"0")+' - '+rec.rota.nome+' - CEP '+k+'-000</div></div></div>';
      });
      h+='</div>';
      rc.innerHTML=h;rc.className='show';return;
    }
    rc.innerHTML='<div class="nfd"><div class="nfi">&#128269;</div><div class="nft">CEP '+cep5+' nao encontrado nas rotas RIVER</div><div class="nfs">CEPs 690xx-699xx dentro de Manaus = modal SPO9, nao RIVER.<br>Verifique os 5 digitos na etiqueta e tente novamente.</div></div>';
    rc.className='show';return;
  }
  sR(cep5);
  const{rota:r,mun:m,prev,next}=hit;
  const nb=bB(m.nome);const nx=nL(nb?nb.days:null);
  const nS=String(r.num).padStart(2,'0');
  const emb=gE(m.nome);
  const boats = emb ? (emb.e || emb.estream || []) : [];
  const aP=prev
    ?'<div class="adjc"><div class="adjd">anterior na calha</div><div class="adjn">'+prev.nome+'</div><div class="adjcep">CEP '+prev.cep+'-000</div><div class="adjkm">'+prev.km+'km de Manaus</div></div>'
    :'<div class="adjc"><div class="adjd">anterior</div><div class="adjn" style="color:var(--mu);font-style:italic">Inicio da rota</div><div class="adjkm">Proximo de Manaus</div></div>';
  const aN=next
    ?'<div class="adjc"><div class="adjd">proximo na calha</div><div class="adjn">'+next.nome+'</div><div class="adjcep">CEP '+next.cep+'-000</div><div class="adjkm">'+next.km+'km de Manaus</div></div>'
    :'<div class="adjc"><div class="adjd">proximo</div><div class="adjn" style="color:var(--mu);font-style:italic">Fim da rota</div><div class="adjkm">Municipio mais distante</div></div>';
  let bH='';
  if(boats.length){
    bH='<div class="bttl">Proximas embarcacoes</div>';
    boats.slice(0,4).forEach(b=>{
      const bx=nL(nD(b.d));
      bH+='<div class="brow2"><span class="bnx '+bx.c+'">'+bx.l+'</span><div style="flex:1"><div class="bnm">'+b.n+'</div><div class="binfo">'+b.d+(b.p?' - '+b.p:'')+'</div></div>'+(b.t?'<a href="tel:'+b.t.replace(/\D/g,'')+'" style="font-size:20px;text-decoration:none;margin-left:6px">&#128222;</a>':'')+'</div>';
    });
    if(boats.length>4)bH+='<div style="font-size:10px;color:var(--mu);text-align:center;padding:5px">+'+(boats.length-4)+' embarcacoes - ver aba Rotas</div>';
  }
  rc.innerHTML='<div class="rcm" style="border-color:'+r.cor+'"><div class="rch" style="background:'+r.cor+'1a"><div class="rcnum" style="color:'+r.cor+'">'+nS+'</div><div><div class="rcrl">ROTA - POSICAO NA CALHA</div><div style="margin-bottom:6px"><span class="rcpos" style="background:'+r.cor+'">'+String(hit.pos).padStart(2,'0')+' de '+hit.total+'</span></div><div class="rcrn" style="color:'+r.cor+'">'+r.nome+'</div><div class="rcmn">'+m.nome+' - '+m.km+'km de Manaus</div>'+(m.slam?'<div style="margin-top:6px"><span style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;font-weight:700;background:rgba(255,255,255,.12);padding:3px 10px;border-radius:6px;letter-spacing:.05em">SLAM '+m.slam+'</span></div>':'')+'</div></div><div class="rcb"><div class="rcgrid"><div class="rcs"><div class="rcsl">CEP</div><div class="rcsv" style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px">'+cep5+'-000</div></div><div class="rcs"><div class="rcsl">Posicao</div><div class="rcsv">'+hit.pos+'/'+hit.total+'</div></div><div class="rcs"><div class="rcsl">Transit Time</div><div class="rcsv">'+m.tt+'</div></div><div class="rcs"><div class="rcsl">Prox. Saida</div><div class="rcsv '+(nb?(nb.days===0?'re':nb.days===1?'wa':'ok'):'')+'">'+nx.l+'</div></div></div><div class="adjr">'+aP+aN+'</div>'+bH+'</div></div>';
  rc.className='show';
}

function bRO(){
  const body=document.getElementById('rbdy');body.innerHTML='';
  ROTAS.forEach(r=>{
    const nS=String(r.num).padStart(2,'0');
    const mH=r.municipios.map(m=>{
      const nb=bB(m.nome);const nx=nL(nb?nb.days:null);const cepK=m.cep+'_'+m.seq;
      return '<div class="mrow" data-cep="'+cepK+'" onclick="mrowClick(event,\''+cepK+'\','+r.num+','+m.seq+')">'+
        '<div style="width:18px;height:18px;border-radius:4px;border:1.5px solid var(--bd);flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-right:2px;font-size:10px" id="chk_'+cepK+'"></div>'+
        '<span class="mseq" style="color:'+r.cor+'">'+String(m.seq).padStart(2,'0')+'</span><span class="mcep">'+m.cep+'</span><span class="mname">'+m.nome+(m.slam?' <span style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:9px;color:'+r.cor+';font-weight:700">'+m.slam+'</span>':'')+'</span><span class="mkm">'+m.km+'km</span><span class="mtt">'+m.tt+'</span><span class="mnx '+nx.c+'">'+nx.l+'</span></div>';
    }).join('');
    const d=document.createElement('div');d.className='rcard';d.dataset.n=r.num;
    d.innerHTML='<div class="rhead" onclick="this.closest(\'.rcard\').classList.toggle(\'open\')"><div class="rnb" style="background:'+r.cor+'">'+nS+'</div><div class="rinfo"><div class="rnome">'+r.nome+'</div><div class="rsub">'+r.dir+' - '+r.municipios.length+' municipios</div></div><span class="rchv">&#9658;</span></div><div class="rbody">'+mH+'</div>';
    body.appendChild(d);
  });
}
function fR(q){q=q.toLowerCase().trim();document.querySelectorAll('.rcard').forEach(c=>{const ok=!q||c.textContent.toLowerCase().includes(q);c.style.display=ok?'':'none';if(ok&&q)c.classList.add('open');});}

function buildGuideHTML(){
  let css='*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#000;background:#fff;padding:8px}h1{font-size:15px;margin-bottom:2px}'+
    '.sub{font-size:10px;color:#555;margin-bottom:10px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}'+
    '.card{border:2px solid #ddd;border-radius:7px;overflow:hidden;break-inside:avoid}'+
    '.head{display:flex;align-items:center;gap:8px;padding:7px 10px;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
    '.num{font-family:monospace;font-size:22px;font-weight:700;width:34px;text-align:center}'+
    '.hnm{font-size:12px;font-weight:700}.hdir{font-size:8px;opacity:.85}'+
    '.body{padding:4px 8px}.row{display:flex;align-items:baseline;gap:5px;padding:2px 0;border-bottom:1px solid #eee}'+
    '.row:last-child{border-bottom:none}.rseq{font-family:monospace;font-size:10px;font-weight:700;width:20px;text-align:center}'+
    '.rcode{font-family:monospace;font-size:9px;color:#666;width:46px}.rnm{font-size:10px;font-weight:600;flex:1}.rkm{font-size:8px;color:#999}'+
    '@media print{body{padding:0}}';
  let body='<h1>Guia RIVER - Triagem Sequencial por Calha</h1>'+
    '<div class="sub">Sigla SLAM / CEP -> Rota (papelao no chao) -> Posicao | '+(new Date().toLocaleDateString('pt-BR'))+'</div>'+
    '<div class="grid">';
  ROTAS.forEach(r=>{
    const nS=String(r.num).padStart(2,'0');
    let rows='';
    r.municipios.forEach(m=>{
      rows+='<div class="row"><span class="rseq" style="color:'+r.cor+'">'+String(m.seq).padStart(2,'0')+'</span>'+
        '<span class="rcode">'+(m.slam||m.cep)+'</span><span class="rnm">'+m.nome+'</span><span class="rkm">'+m.km+'km</span></div>';
    });
    body+='<div class="card"><div class="head" style="background:'+r.cor+'">'+
      '<div class="num">'+nS+'</div><div><div class="hnm">'+r.nome+'</div><div class="hdir">'+r.dir+'</div></div></div>'+
      '<div class="body">'+rows+'</div></div>';
  });
  body+='</div>';
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>Guia RIVER</title><style>'+css+'</style></head><body>'+body+'</body></html>';
}
function printGuide(){
  const html=buildGuideHTML();
  let ov=document.getElementById('guide-overlay');
  if(!ov){
    ov=document.createElement('div');ov.id='guide-overlay';
    ov.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#fff;display:flex;flex-direction:column';
    const bar=document.createElement('div');
    bar.style.cssText='background:#14b8a6;color:#fff;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;font-family:-apple-system,sans-serif';
    bar.innerHTML='<span style="font-size:13px;font-weight:700">Guia RIVER - use o menu do navegador para imprimir/salvar PDF</span>'+
      '<button onclick="document.getElementById(\'guide-overlay\').remove()" style="background:rgba(0,0,0,.3);border:none;color:#fff;padding:6px 12px;border-radius:5px;font-family:-apple-system,sans-serif;font-size:12px;cursor:pointer;font-weight:600">&#10005; Fechar</button>';
    const frame=document.createElement('iframe');
    frame.id='guide-frame';frame.style.cssText='flex:1;border:none;width:100%';
    ov.appendChild(bar);ov.appendChild(frame);
    document.body.appendChild(ov);
    frame.contentDocument.open();frame.contentDocument.write(html);frame.contentDocument.close();
  } else {
    ov.style.display='flex';
    const frame=document.getElementById('guide-frame');
    if(frame){frame.contentDocument.open();frame.contentDocument.write(html);frame.contentDocument.close();}
  }
}
function bPrint(){
  const g=document.getElementById('pgrid');g.innerHTML='';
  ROTAS.forEach(r=>{
    const nS=String(r.num).padStart(2,'0');
    const mH=r.municipios.map(m=>'<div class="pcm"><span class="pcmseq" style="color:'+r.cor+'">'+String(m.seq).padStart(2,'0')+'</span><span class="pcmcep">'+(m.slam||m.cep)+'</span><span class="pcmnm">'+m.nome+'</span><span class="pcmkm">'+m.km+'km</span></div>').join('');
    const d=document.createElement('div');d.className='pc';
    d.innerHTML='<div class="pch" style="background:'+r.cor+'"><div class="pcnum">'+nS+'</div><div><div class="pcinm">'+r.nome+'</div><div class="pcidir">'+r.dir+'</div></div></div><div class="pcb">'+mH+'</div>';
    g.appendChild(d);
  });
}

let T={s:1,x:0,y:0},focR=null;
function gR(n){return ROTAS.find(r=>r.num===n);}
function renderMap(){
  const svg=document.getElementById('msvg');
  if(!svg)return;
  svg.innerHTML='';
  const NS='http://www.w3.org/2000/svg';
  const W=900,H=600;
  const LNG0=-74.5,LNG1=-53.5,LAT0=-10.6,LAT1=2.7;
  function merc(lat){return Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));}
  const m0=merc(LAT0),m1=merc(LAT1);
  function proj(lat,lng){
    return {x:(lng-LNG0)/(LNG1-LNG0)*W, y:(m1-merc(lat))/(m1-m0)*H};
  }
  const defs=document.createElementNS(NS,'defs');
  defs.innerHTML=
    '<pattern id="gr" width="30" height="30" patternUnits="userSpaceOnUse">'+
    '<path d="M30 0L0 0 0 30" fill="none" stroke="#0d1520" stroke-width=".4"/></pattern>'+
    '<filter id="gw"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
    '<filter id="gs"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
    '<style>.cm-dot{transition:transform .15s ease;transform-box:fill-box;transform-origin:center}'+
    '.cm-marker:hover .cm-dot{transform:scale(2.1)}'+
    '.cm-label{transition:opacity .12s ease;opacity:0;pointer-events:none}'+
    '.cm-marker:hover .cm-label{opacity:1}</style>';
  svg.appendChild(defs);
  const g=document.createElementNS(NS,'g');
  g.id='mg';
  g.setAttribute('transform','translate('+T.x+','+T.y+') scale('+T.s+')');
  const bg=document.createElementNS(NS,'rect');
  bg.setAttribute('width',W);bg.setAttribute('height',H);
  bg.setAttribute('fill','#0e1a2b');g.appendChild(bg);
  const gr=document.createElementNS(NS,'rect');
  gr.setAttribute('width',W);gr.setAttribute('height',H);
  gr.setAttribute('fill','url(#gr)');g.appendChild(gr);
  const bPts=AM_BORDER.map(([lat,lng])=>{const p=proj(lat,lng);return p.x+','+p.y;}).join(' ');
  const border=document.createElementNS(NS,'polygon');
  border.setAttribute('points',bPts);
  border.setAttribute('fill','#142840');
  border.setAttribute('stroke','#2a4a6e');
  border.setAttribute('stroke-width','1.5');
  border.setAttribute('opacity','0.95');
  g.appendChild(border);
  const lbl=proj(-6.3,-67.2);
  const wm=document.createElementNS(NS,'text');
  wm.setAttribute('x',lbl.x);wm.setAttribute('y',lbl.y);
  wm.setAttribute('text-anchor','middle');wm.setAttribute('font-size','22');
  wm.setAttribute('font-weight','700');wm.setAttribute('letter-spacing','3');
  wm.setAttribute('fill','#24405e');wm.setAttribute('font-family','-apple-system,sans-serif');
  wm.setAttribute('pointer-events','none');wm.textContent='AMAZONAS';
  g.appendChild(wm);
  RIOS.forEach(rv=>{
    const pts=rv.coords.map(([lat,lng])=>{const p=proj(lat,lng);return p.x+' '+p.y;});
    const path=document.createElementNS(NS,'polyline');
    path.setAttribute('points',pts.join(', '));
    path.setAttribute('fill','none');
    path.setAttribute('stroke','#1e4a7a');
    path.setAttribute('stroke-width',rv.w);
    path.setAttribute('opacity',rv.op);
    path.setAttribute('stroke-linecap','round');
    path.setAttribute('stroke-linejoin','round');
    g.appendChild(path);
  });
  const hub=proj(-3.119,-60.021);
  [20,13,7].forEach(r=>{
    const p=document.createElementNS(NS,'circle');
    p.setAttribute('cx',hub.x);p.setAttribute('cy',hub.y);p.setAttribute('r',r);
    p.setAttribute('fill','none');p.setAttribute('stroke','#14b8a6');
    p.setAttribute('stroke-width','1');
    p.setAttribute('opacity',r===20?'.1':r===13?'.2':'.7');
    g.appendChild(p);
  });
  const hc=document.createElementNS(NS,'circle');
  hc.setAttribute('cx',hub.x);hc.setAttribute('cy',hub.y);hc.setAttribute('r','6');
  hc.setAttribute('fill','#14b8a6');hc.setAttribute('filter','url(#gw)');
  const hg=document.createElementNS(NS,'g');hg.style.cursor='pointer';hg.appendChild(hc);
  hg.addEventListener('click',()=>{focR=null;renderMap();updL();});
  const hl=document.createElementNS(NS,'text');
  hl.setAttribute('x',hub.x+10);hl.setAttribute('y',hub.y+4);
  hl.setAttribute('font-size','11');hl.setAttribute('fill','#14b8a6');
  hl.setAttribute('font-weight','700');hl.setAttribute('font-family','-apple-system,sans-serif');
  hl.setAttribute('pointer-events','none');hl.textContent='MANAUS';
  hg.appendChild(hl);g.appendChild(hg);
  ROTAS.forEach(r=>{
    const isRoad=(r.num===9||r.num===10);
    const pts=r.municipios.map(m=>LATLNG[m.cep]?proj(LATLNG[m.cep].lat,LATLNG[m.cep].lng):null).filter(Boolean);
    if(pts.length){
      const lineCoords=[[hub.x,hub.y],...pts.map(p=>[p.x,p.y])];
      const polyPts=lineCoords.map(p=>p[0]+' '+p[1]).join(', ');
      const line=document.createElementNS(NS,'polyline');
      line.setAttribute('points',polyPts);
      line.setAttribute('fill','none');
      line.setAttribute('stroke',r.cor);
      line.setAttribute('stroke-width',focR&&focR!==r.num?'1':'2');
      line.setAttribute('opacity',focR&&focR!==r.num?'0.05':'0.5');
      line.setAttribute('stroke-linecap','round');
      if(isRoad)line.setAttribute('stroke-dasharray','6,4');
      g.appendChild(line);
    }
  });
  ROTAS.forEach(r=>{
    r.municipios.forEach(m=>{
      const ll=LATLNG[m.cep];if(!ll)return;
      const p=proj(ll.lat,ll.lng);
      const dim=focR&&focR!==r.num;
      const grp=document.createElementNS(NS,'g');
      grp.setAttribute('class','cm-marker');
      grp.style.cursor='pointer';
      grp.setAttribute('opacity',dim?'0.06':'1');
      const dot=document.createElementNS(NS,'g');
      dot.setAttribute('class','cm-dot');
      const bb=document.createElementNS(NS,'rect');
      bb.setAttribute('x',p.x-5);bb.setAttribute('y',p.y-4.5);
      bb.setAttribute('width','10');bb.setAttribute('height','9');
      bb.setAttribute('rx','3');bb.setAttribute('fill',r.cor);
      bb.setAttribute('filter','url(#gw)');dot.appendChild(bb);
      const nt=document.createElementNS(NS,'text');
      nt.setAttribute('x',p.x);nt.setAttribute('y',p.y+2.6);
      nt.setAttribute('text-anchor','middle');nt.setAttribute('font-size','6');
      nt.setAttribute('font-weight','700');nt.setAttribute('fill','#fff');
      nt.setAttribute('font-family','ui-monospace,Menlo,Consolas,monospace');
      nt.setAttribute('pointer-events','none');
      nt.textContent=String(m.seq).padStart(2,'0');dot.appendChild(nt);
      grp.appendChild(dot);
      const lbl=document.createElementNS(NS,'text');
      lbl.setAttribute('class','cm-label');
      lbl.setAttribute('x',p.x+9);lbl.setAttribute('y',p.y+3.5);
      lbl.setAttribute('font-size','8');
      lbl.setAttribute('fill',dim?'#0e1a2b':'#bcd4dd');
      lbl.setAttribute('font-family','-apple-system,sans-serif');
      lbl.textContent=m.nome.split(' ')[0];grp.appendChild(lbl);
      const mob=window.innerWidth<768;
      if(mob){
        grp.addEventListener('touchend',e=>{e.preventDefault();e.stopPropagation();oMS(m,r);});
      } else {
        grp.addEventListener('mouseenter',e=>{if(focR&&focR!==r.num)return;grp.parentNode.appendChild(grp);sMT(e,m,r);});
        grp.addEventListener('mouseleave',()=>{document.getElementById('mtt').className='';});
        grp.addEventListener('click',()=>{focR=focR===r.num?null:r.num;renderMap();updL();});
      }
      g.appendChild(grp);
    });
  });
  svg.appendChild(g);
}

// MODIFICAÇÃO DE SEGURANÇA: Bloqueia a renderização se o usuário passar o mouse em um item ocultado por filtro
function sMT(e,c,rArg){
  const r=rArg||gR(c.rota);
  if(focR && focR !== r.num) return; 
  
  const color=r?r.cor:'#14b8a6';
  const ri=r?r.municipios.findIndex(m=>m.seq===c.seq):-1;
  const rm=ri>=0?r.municipios[ri]:null;
  const prev=ri>0?r.municipios[ri-1]:null;
  const next=(ri>=0&&ri<r.municipios.length-1)?r.municipios[ri+1]:null;
  const nb=rm?bB(rm.nome):null;const nx=nL(nb?nb.days:null);
  const tt=document.getElementById('mtt');
  tt.innerHTML='<div style="padding:10px 12px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div style="min-width:38px;height:30px;border-radius:6px;background:'+color+';display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10px;font-weight:700;color:#fff;padding:0 6px"><div style="font-size:7px;opacity:.7">R'+String(c.rota).padStart(2,'0')+'</div><div>'+String(c.seq).padStart(2,'0')+'</div></div><div><div style="font-size:13px;font-weight:700">'+c.nome+'</div><div style="font-size:10px;color:'+color+'">'+(r?r.nome:'')+'</div></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:10px;margin-bottom:6px"><div><div style="color:var(--mu);font-size:8px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:1px">Anterior</div>'+(prev?prev.nome:'Inicio')+'</div><div><div style="color:var(--mu);font-size:8px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:1px">Proximo</div>'+(next?next.nome:'Fim da rota')+'</div></div>'+(nb?'<div style="font-size:10px;display:flex;align-items:center;gap:6px"><span class="'+nx.c+'" style="font-size:9px;font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;padding:1px 6px;border-radius:3px">'+nx.l+'</span><span style="font-weight:600">'+nb.boat.n+'</span></div>':'')+'</div>';
  const mc=document.getElementById('sc-m').getBoundingClientRect();
  let lx=e.clientX-mc.left+14,ty=e.clientY-mc.top-12;
  if(lx+230>mc.width)lx-=244;if(ty+120>mc.height)ty-=120;
  tt.style.left=lx+'px';tt.style.top=ty+'px';tt.className='on';
}

function oMS(c,rArg){
  const r=rArg||gR(c.rota);const color=r?r.cor:'#14b8a6';
  const ri=r?r.municipios.findIndex(m=>m.seq===c.seq):-1;
  const rm=ri>=0?r.municipios[ri]:null;
  const prev=ri>0?r.municipios[ri-1]:null;
  const next=(ri>=0&&ri<r.municipios.length-1)?r.municipios[ri+1]:null;
  const nb=rm?bB(rm.nome):null;const nx=nL(nb?nb.days:null);
  const emb=rm?gE(rm.nome):null;
  const boats=emb ? (emb.e || emb.estream || []) : [];
  let bH='';
  if(boats.length){
    bH='<div class="bttl" style="margin-top:12px">Embarcacoes</div>';
    boats.slice(0,3).forEach(b=>{const bx=nL(nD(b.d));bH+='<div class="brow2"><span class="bnx '+bx.c+'">'+bx.l+'</span><div style="flex:1"><div class="bnm">'+b.n+'</div><div class="binfo">'+b.d+(b.p?' - '+b.p:'')+'</div></div>'+(b.t?'<a href="tel:'+b.t.replace(/\D/g,'')+'" style="font-size:20px;text-decoration:none;margin-left:6px">&#128222;</a>':'')+'</div>';});
  }
  document.getElementById('shc').innerHTML='<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="min-width:60px;height:52px;border-radius:12px;background:'+color+';display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;flex-shrink:0"><div style="font-size:9px;opacity:.7;letter-spacing:.08em">ROTA '+String(c.rota).padStart(2,'0')+'</div><div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:22px;font-weight:700;line-height:1">'+String(c.seq).padStart(2,'0')+'</div></div><div><div style="font-size:18px;font-weight:700">'+c.nome+'</div><div style="font-size:12px;color:'+color+';margin-top:2px">'+(r?r.nome:'')+' - '+c.seq+' de '+(r?r.municipios.length:'-')+'</div></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="background:var(--s2);border:1px solid var(--bd);border-radius:8px;padding:10px 12px"><div style="font-size:9px;color:var(--mu);text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px">Anterior na calha</div><div style="font-size:13px;font-weight:600">'+(prev?prev.nome:'Inicio (Manaus)')+'</div></div><div style="background:var(--s2);border:1px solid var(--bd);border-radius:8px;padding:10px 12px"><div style="font-size:9px;color:var(--mu);text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px">Proximo na calha</div><div style="font-size:13px;font-weight:600">'+(next?next.nome:'Fim da rota')+'</div></div></div>'+(nb?'<div style="background:var(--s2);border:1px solid var(--bd);border-radius:8px;padding:10px 12px;margin-bottom:12px"><div style="font-size:9px;color:var(--mu);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px">Proxima embarcacao</div><div style="display:flex;align-items:center;gap:8px"><span class="'+nx.c+'" style="font-size:10px;font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;padding:2px 7px;border-radius:4px">'+nx.l+'</span><span style="font-size:13px;font-weight:600">'+nb.boat.n+'</span>'+(nb.boat.t?'<a href="tel:'+nb.boat.t.replace(/\D/g,'')+'" style="font-size:20px;text-decoration:none;margin-left:auto">&#128222;</a>':'')+'</div></div>':'')+bH;
  document.getElementById('sh').classList.add('on');
}
function bL(){
  const l=document.getElementById('mleg');l.innerHTML='<div class="mlttl">Rotas</div>';
  ROTAS.forEach(r=>{const row=document.createElement('div');row.className='mlr';row.dataset.rota=r.num;row.innerHTML='<div class="mlnum" style="background:'+r.cor+'">'+String(r.num).padStart(2,'0')+'</div><span class="mlnm">'+r.nome+'</span>';row.onclick=()=>{focR=focR===r.num?null:r.num;renderMap();updL();};l.appendChild(row);});
}
function updL(){document.querySelectorAll('.mlr[data-rota]').forEach(el=>el.classList.toggle('dim',!!focR&&parseInt(el.dataset.rota)!==focR));}
function applyT(){const g=document.getElementById("mg");if(g)g.setAttribute("transform","translate("+T.x+","+T.y+") scale("+T.s+")");}
function zI(){T.s=Math.min(5,T.s*1.3);applyT();}function zO(){T.s=Math.max(0.4,T.s/1.3);applyT();}function zR(){T={s:1,x:0,y:0};focR=null;renderMap();updL();}

let cur='t';

function initMapInteractions(){
  const msvg=document.getElementById('msvg');
  let drag=false,ds={};
  msvg.addEventListener('mousedown',e=>{drag=true;ds={x:e.clientX-T.x,y:e.clientY-T.y};msvg.style.cursor='grabbing';});
  document.addEventListener('mousemove',e=>{if(!drag)return;T.x=e.clientX-ds.x;T.y=e.clientY-ds.y;applyT();});
  document.addEventListener('mouseup',()=>{drag=false;msvg.style.cursor='';});
  msvg.addEventListener('wheel',e=>{e.preventDefault();e.deltaY<0?zI():zO();},{passive:false});
  let tS={},lD=null;
  msvg.addEventListener('touchstart',e=>{e.preventDefault();if(e.touches.length===1){const t=e.touches[0];tS={x:t.clientX-T.x,y:t.clientY-T.y};}else if(e.touches.length===2){const a=e.touches[0],b=e.touches[1];lD=Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY);}},{passive:false});
  msvg.addEventListener('touchmove',e=>{e.preventDefault();if(e.touches.length===1&&!lD){const t=e.touches[0];T.x=t.clientX-tS.x;T.y=t.clientY-tS.y;applyT();}else if(e.touches.length===2){const a=e.touches[0],b=e.touches[1];const d=Math.hypot(b.clientX-a.clientX,b.clientY-a.clientY);if(lD){T.s=Math.min(5,Math.max(0.4,T.s*(d/lD)));applyT();}lD=d;}},{passive:false});
  msvg.addEventListener('touchend',e=>{if(e.touches.length===0)lD=null;});
}

let SEL={};
function toggleSel(cepKey,mun,rota){
  if(SEL[cepKey]){delete SEL[cepKey];}
  else{SEL[cepKey]={mun,rota};}
  renderSelBar();
}
function renderSelBar(){
  const keys=Object.keys(SEL);
  const bar=document.getElementById('sel-bar');
  const cnt=document.getElementById('sel-count');
  const chips=document.getElementById('sel-chips');
  if(!keys.length){bar.classList.remove('on');document.querySelectorAll('.mrow.selected').forEach(el=>el.classList.remove('selected'));return;}
  bar.classList.add('on');
  cnt.textContent=keys.length+' selecionado'+(keys.length>1?'s':'');
  chips.innerHTML=keys.map(k=>{
    const {mun,rota}=SEL[k];
    return '<div class="sel-chip"><div class="sel-chip-dot" style="background:'+rota.cor+'"></div>'+
      '<span class="sel-chip-seq">'+String(mun.seq).padStart(2,'0')+'</span>'+
      '<span class="sel-chip-nm">'+mun.nome+'</span>'+
      '<span class="sel-chip-r">R'+String(rota.num).padStart(2,'0')+'</span></div>';
  }).join('');
  document.querySelectorAll('.mrow[data-cep]').forEach(el=>{
    el.classList.toggle('selected',!!SEL[el.dataset.cep]);
  });
}
function clearSel(){SEL={};renderSelBar();}
function openSelPanel(){
  const keys=Object.keys(SEL);
  if(!keys.length)return;
  const byRota={};
  keys.forEach(k=>{
    const{mun,rota}=SEL[k];
    if(!byRota[rota.num])byRota[rota.num]={rota,muns:[]};
    byRota[rota.num].muns.push(mun);
  });
  const body=document.getElementById('sp-body');
  body.innerHTML='';
  const totalRotas=Object.keys(byRota).length;
  document.getElementById('sp-ttl').textContent=keys.length+' municípios · '+totalRotas+' rota'+(totalRotas>1?'s':'');
  Object.values(byRota).sort((a,b)=>a.rota.num-b.rota.num).forEach(({rota,muns})=>{
    const sorted=muns.sort((a,b)=>a.seq-b.seq);
    const block=document.createElement('div');block.className='sp-rota-block';
    let html='<div class="sp-rota-head" style="background:'+rota.cor+'1a">'+
      '<div class="sp-rota-num" style="background:'+rota.cor+'">'+String(rota.num).padStart(2,'0')+'</div>'+
      '<div style="flex:1"><div>'+rota.nome+'</div><div style="font-size:10px;color:var(--mu);font-weight:400">'+rota.dir+'</div></div>'+
      '<div style="font-size:11px;color:'+rota.cor+';font-weight:700">'+sorted.length+' mun.</div></div>';
    sorted.forEach(m=>{
      const ri=rota.municipios.findIndex(x=>x.seq===m.seq);
      const prev=ri>0?rota.municipios[ri-1]:null;
      const next=ri<rota.municipios.length-1?rota.municipios[ri+1]:null;
      html+='<div class="sp-mun">'+
        '<span class="sp-mun-seq" style="color:'+rota.cor+'">'+String(m.seq).padStart(2,'0')+'</span>'+
        '<span class="sp-mun-slam">'+(m.slam||m.cep)+'</span>'+
        '<div style="flex:1">'+
          '<div class="sp-mun-nm">'+m.nome+'</div>'+
          '<div class="sp-prev-next">⬆ '+(prev?prev.nome:'Manaus (hub)')+' &nbsp;·&nbsp; ⬇ '+(next?next.nome:'Fim da rota')+'</div>'+
        '</div>'+
        '<span class="sp-mun-km">'+m.km+'km</span>'+
        '<span class="sp-mun-tt" style="margin-left:8px">'+m.tt+'</span>'+
      '</div>';
    });
    block.innerHTML=html;body.appendChild(block);
  });
  document.getElementById('sel-panel').classList.add('on');
}
function closeSelPanel(){document.getElementById('sel-panel').classList.remove('on');}
function mrowClick(e,cepK,rNum,mSeq){
  const rota=ROTAS.find(r=>r.num===rNum);
  if(!rota)return;
  const mun=rota.municipios.find(m=>m.seq===mSeq);
  if(!mun)return;
  const rect=e.currentTarget.getBoundingClientRect();
  const clickX=e.clientX-rect.left;
  const selMode=Object.keys(SEL).length>0||clickX<28;
  if(selMode){
    toggleSel(cepK,mun,rota);
    const chk=document.getElementById('chk_'+cepK);
    if(chk)chk.innerHTML=SEL[cepK]?'<span style="color:var(--re);font-weight:700">✓</span>':'';
  } else {
    lookup(mun.cep);SS('t',document.querySelector('.htab.on'));
  }
}

function SS(name,btn,mid){
  cur=name;
  ['t','r','m','p'].forEach(s=>{
    const el=document.getElementById('sc-'+s);if(!el)return;
    if(s===name)el.className='scr';else el.className='scr h';
    if(s==='t'&&name==='t'){el.style.flexDirection='column';el.style.alignItems='center';el.style.overflowY='auto';el.style.padding='20px 16px';el.style.gap='14px';}
  });
  if(btn){document.querySelectorAll('.htab').forEach(b=>b.classList.remove('on'));if(btn&&btn.classList)btn.classList.add('on');}
  if(mid){document.querySelectorAll('.btab').forEach(b=>b.classList.remove('on'));const el=document.getElementById(mid);if(el)el.classList.add('on');}
  cSh();
  if(name==='m'){renderMap();bL();updL();}
}
function cSh(){document.getElementById('sh').classList.remove('on');}
function setup(){
  const m=window.innerWidth<768;
  document.getElementById('btabs').style.display=m?'block':'none';
  document.getElementById('app').style.bottom=m?'58px':'0';
  document.querySelector('.htabs').style.display=m?'none':'flex';
  document.getElementById('hbg').style.display=m?'none':'';
}

setup();
window.addEventListener('resize',()=>{setup();if(cur==='m')renderMap();});
initMapInteractions();
bRO();bPrint();rR();
if(window.innerWidth>=768)setTimeout(()=>document.getElementById('ci').focus(),100);
