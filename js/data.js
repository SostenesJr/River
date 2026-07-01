/* ============================================================
   COORDENADAS POR NODE (lat, lng) — usadas no mapa.
   Chave = codigo do node (mesmo valor de `seq`). Sem CEP.
   ============================================================ */
const LATLNG = {
  // Calha A · Baixo Amazonas
  RAU9:{lat:-3.580,lng:-59.129}, RUC9:{lat:-2.838,lng:-57.747}, RAO9:{lat:-2.655,lng:-57.698},
  RUR9:{lat:-2.532,lng:-57.755}, RME9:{lat:-3.388,lng:-57.720}, RRA9:{lat:-2.974,lng:-57.575},
  RBA9:{lat:-2.793,lng:-57.049}, RPA9:{lat:-2.629,lng:-56.735}, RNH9:{lat:-2.195,lng:-56.709},

  // Calha B · Metro Fluvial
  RRE9:{lat:-3.360,lng:-59.870}, RQI9:{lat:-3.486,lng:-60.458}, RPI9:{lat:-3.940,lng:-61.350},
  RAN9:{lat:-3.583,lng:-61.392}, RNA9:{lat:-3.769,lng:-61.656},

  // Calha C · Rio Madeira
  RNO9:{lat:-3.894,lng:-59.094}, RBO9:{lat:-4.392,lng:-59.594},
  RPU9:{lat:-5.121,lng:-60.381}, RNI9:{lat:-5.808,lng:-61.297},

  // Calha D · Medio Solimoes  (coordenadas corrigidas: Tefe/Alvaraes/Uarini)
  RDA9:{lat:-3.836,lng:-62.059}, RCO9:{lat:-4.085,lng:-63.141},
  RTE9:{lat:-3.354,lng:-64.711}, RAL9:{lat:-3.215,lng:-64.867}, RUA9:{lat:-3.189,lng:-65.341},
  RAA9:{lat:-1.835,lng:-65.356}, RJA9:{lat:-1.879,lng:-66.160}, RFO9:{lat:-2.513,lng:-66.095},

  // Calha E · Alto Solimoes
  RJT9:{lat:-2.744,lng:-66.778}, RIN9:{lat:-2.872,lng:-67.797},
  RTO9:{lat:-3.094,lng:-67.944}, RAM9:{lat:-3.355,lng:-68.216},
  RUI9:{lat:-3.462,lng:-68.984}, RBE9:{lat:-4.381,lng:-70.031},
  RAT9:{lat:-4.375,lng:-70.193}, RUT9:{lat:-4.253,lng:-69.937},

  // Calha F · Rio Negro
  RRC9:{lat:-0.980,lng:-62.921}, RIP9:{lat:0.414,lng:-65.016}, RGA9:{lat:0.130,lng:-67.089},

  // Calha G · Rio Purus
  RRU9:{lat:-3.900,lng:-61.359}, RRR9:{lat:-5.626,lng:-63.195}, RBL9:{lat:-6.532,lng:-64.393},

  // Calha H · Rodoviario
  RIR9:{lat:-3.281,lng:-60.185}, RMA9:{lat:-3.297,lng:-60.621}, RFB9:{lat:-2.630,lng:-60.932},
  RPR9:{lat:-2.019,lng:-60.030}, RBB9:{lat:-1.920,lng:-59.473}, RAC9:{lat:-2.698,lng:-59.695},
  RIT9:{lat:-3.143,lng:-58.444}, RNR9:{lat:-3.143,lng:-58.700}, RSI9:{lat:-2.840,lng:-58.210},
  RNG9:{lat:-2.746,lng:-58.027}, RAR9:{lat:-3.743,lng:-59.287},

  // Calha I · Sul do Amazonas
  RAP9:{lat:-7.198,lng:-59.889}, RHU9:{lat:-7.503,lng:-63.019}, RLA9:{lat:-7.259,lng:-64.793},

  // Calha J · Rio Jurua
  RRI9:{lat:-4.872,lng:-66.896}, RJU9:{lat:-3.493,lng:-66.045}, RRT9:{lat:-4.280,lng:-68.049}
};

const AM_BORDER=[[-8.95,-64.14],[-9.04,-64.92],[-9.23,-64.92],[-9.45,-65.14],[-9.26,-65.25],[-9.32,-65.45],[-9.47,-65.43],[-9.41,-65.6],[-9.59,-65.79],[-9.41,-65.97],[-9.41,-66.41],[-9.63,-66.5],[-9.82,-66.81],[-9.05,-68.65],[-7.85,-70.05],[-7.55,-72.58],[-7.11,-73.8],[-6.76,-73.64],[-6.5,-73.14],[-6.03,-73.24],[-5.65,-72.96],[-5.11,-72.81],[-4.52,-71.88],[-4.39,-70.94],[-4.13,-70.65],[-4.15,-70.33],[-4.37,-70.2],[-4.3,-69.96],[-1.13,-69.4],[-0.75,-69.63],[-0.51,-69.61],[-0.19,-70.06],[0.56,-70.04],[0.74,-69.48],[0.61,-69.36],[0.65,-69.11],[1.06,-69.26],[1.09,-69.84],[1.72,-69.84],[1.73,-68.16],[1.83,-68.27],[1.98,-68.18],[1.83,-67.94],[2.24,-67.39],[1.89,-67.29],[1.73,-67.1],[1.17,-67.09],[1.23,-66.86],[0.74,-66.32],[1.01,-65.58],[0.65,-65.54],[0.93,-65.33],[0.92,-65.18],[1.16,-65.1],[1.31,-64.81],[1.23,-64.75],[1.53,-64.4],[1.36,-64.34],[1.62,-64.09],[1.98,-63.99],[2.18,-63.16],[2.03,-63.05],[1.94,-62.7],[1.59,-62.8],[0.97,-62.44],[0.51,-62.53],[-0.33,-62.19],[-0.65,-62.3],[-0.76,-62.51],[-1.14,-62.02],[-1.4,-61.9],[-1.58,-61.47],[-1.39,-61.62],[-0.94,-61.58],[-0.66,-61.46],[-0.5,-61.22],[-0.56,-60.92],[-0.89,-60.67],[-0.72,-60.31],[-0.51,-60.4],[0.26,-60.04],[0.26,-58.9],[-0.34,-58.87],[-1.14,-58.32],[-1.23,-58.16],[-1.11,-58.02],[-1.4,-57.96],[-1.72,-57.39],[-1.72,-57.16],[-1.91,-57.04],[-2.02,-56.73],[-2.21,-56.68],[-2.03,-56.1],[-2.42,-56.47],[-6.45,-58.25],[-6.7,-58.48],[-7.36,-58.14],[-7.84,-58.38],[-8.09,-58.29],[-8.77,-58.39],[-8.8,-61.58],[-8.69,-61.71],[-8.88,-61.98],[-7.99,-62.84],[-7.97,-63.62],[-8.33,-63.78],[-8.33,-63.94],[-8.57,-63.92],[-8.74,-64.14],[-8.95,-64.14]];

const RIOS=[{name:'Amazonas/Solimoes',w:4,op:0.4,coords:[[-2.05,-54.0],[-2.33,-54.07],[-2.45,-54.57],[-2.41,-54.68],[-2.15,-54.72],[-2.07,-54.91],[-2.2,-55.09],[-1.91,-55.64],[-2.01,-56.05],[-2.57,-56.64],[-2.51,-57.0],[-2.57,-57.19],[-2.39,-57.54],[-2.75,-57.81],[-2.88,-58.11],[-3.2,-58.21],[-3.16,-58.5],[-3.34,-58.66],[-3.08,-59.81],[-3.34,-60.17],[-3.33,-60.69],[-3.61,-60.91],[-3.62,-61.4],[-3.96,-61.88],[-3.69,-62.41],[-3.84,-62.46],[-3.89,-62.79],[-4.08,-63.12],[-3.95,-63.2],[-3.83,-63.91],[-3.57,-64.42],[-3.41,-64.51],[-2.59,-65.49],[-2.62,-65.71],[-2.46,-65.95],[-2.5,-66.07],[-2.42,-66.18],[-2.57,-66.31],[-2.42,-66.54],[-2.69,-66.66],[-2.73,-67.99],[-2.58,-67.35],[-2.75,-67.49],[-2.84,-67.79],[-3.06,-67.93],[-3.34,-67.97],[-3.29,-68.35],[-3.5,-69.33],[-3.71,-69.42],[-3.94,-69.4],[-4.09,-69.5],[-4.19,-69.41],[-4.34,-69.6],[-4.33,-69.93],[-3.82,-70.35],[-4.0,-71.08],[-3.86,-71.25],[-3.86,-71.47],[-3.72,-71.68],[-3.39,-71.74],[-3.34,-71.84],[-3.52,-72.26],[-3.45,-72.81],[-3.52,-73.05],[-3.73,-73.25],[-4.1,-73.18],[-4.11,-73.37],[-4.44,-73.49]]},{name:'Rio Negro',w:2.5,op:0.35,coords:[[2.06,-70.34],[2.12,-69.78],[2.29,-69.34],[2.21,-68.99],[2.22,-68.75],[2.41,-68.55],[2.29,-68.33],[2.36,-68.25],[2.49,-68.24],[2.61,-68.12],[2.58,-68.08],[2.67,-68.05],[2.78,-67.92],[2.84,-67.75],[2.81,-67.63],[2.69,-67.58],[2.68,-67.5],[2.47,-67.33],[2.39,-67.19],[2.27,-67.22],[2.1,-67.12],[1.99,-67.13],[1.35,-66.88],[0.96,-66.86],[0.89,-66.94],[0.89,-67.2],[0.58,-67.25],[0.43,-67.32],[0.07,-67.26],[-0.18,-67.03],[-0.16,-66.89],[-0.36,-66.55],[-0.39,-66.42],[-0.4,-66.33],[-0.33,-66.24],[-0.32,-65.96],[-0.25,-65.87],[-0.3,-65.74],[-0.29,-65.51],[-0.41,-65.24],[-0.42,-65.05],[-0.48,-64.93],[-0.3,-64.1],[-0.33,-63.71],[-0.55,-63.41],[-0.7,-63.03],[-0.93,-62.83],[-1.15,-62.43],[-1.37,-61.95],[-1.38,-61.77],[-1.46,-61.59],[-1.7,-61.44],[-1.85,-61.43],[-2.15,-61.12],[-2.43,-61.01],[-2.79,-60.65],[-3.03,-60.49],[-3.07,-60.21],[-3.17,-60.0],[-3.13,-59.91]]},{name:'Madeira',w:2.5,op:0.35,coords:[[-10.39,-65.4],[-10.21,-65.29],[-9.97,-65.34],[-9.84,-65.3],[-9.64,-65.45],[-9.53,-65.33],[-9.59,-65.16],[-9.6,-64.94],[-9.54,-64.84],[-9.37,-64.82],[-9.36,-64.74],[-9.19,-64.59],[-9.15,-64.51],[-9.18,-64.37],[-9.01,-64.26],[-8.96,-64.08],[-8.86,-64.07],[-8.76,-63.92],[-8.64,-63.91],[-8.55,-63.67],[-8.58,-63.54],[-8.48,-63.57],[-8.42,-63.47],[-8.17,-63.33],[-8.22,-63.21],[-8.03,-62.89],[-7.92,-62.86],[-7.86,-62.91],[-7.62,-62.93],[-7.46,-63.02],[-7.04,-62.87],[-6.96,-62.69],[-6.77,-62.58],[-6.72,-62.36],[-6.65,-62.33],[-6.58,-62.38],[-6.41,-62.26],[-6.23,-62.23],[-6.19,-62.15],[-6.24,-61.85],[-6.12,-61.82],[-6.0,-61.67],[-5.9,-61.67],[-5.89,-61.59],[-5.84,-61.63],[-5.86,-61.5],[-5.8,-61.39],[-5.84,-61.33],[-5.66,-61.24],[-5.57,-61.07],[-5.6,-60.98],[-5.49,-60.74],[-5.33,-60.72],[-5.18,-60.43],[-4.91,-60.2],[-4.92,-60.07],[-4.83,-59.93],[-4.68,-59.93],[-4.45,-59.82],[-4.33,-59.72],[-4.37,-59.59],[-4.24,-59.4],[-3.99,-59.31],[-3.84,-59.08],[-3.68,-59.09],[-3.34,-58.71]]},{name:'Purus',w:2,op:0.3,coords:[[-10.5,-71.37],[-10.37,-71.13],[-9.97,-71.0],[-9.57,-70.57],[-9.36,-70.51],[-9.14,-70.29],[-9.06,-69.6],[-8.71,-68.93],[-8.83,-68.66],[-9.04,-68.57],[-9.08,-68.17],[-8.72,-67.38],[-8.45,-67.44],[-8.1,-67.23],[-7.99,-67.26],[-7.68,-66.96],[-7.64,-66.52],[-7.49,-66.33],[-7.58,-66.33],[-7.56,-66.21],[-7.71,-66.04],[-7.72,-65.68],[-7.44,-65.15],[-7.29,-65.14],[-7.29,-64.84],[-7.14,-64.64],[-7.05,-64.65],[-7.07,-64.56],[-6.88,-64.66],[-6.84,-64.55],[-6.72,-64.59],[-6.54,-64.31],[-5.95,-64.32],[-5.88,-64.47],[-5.6,-64.33],[-5.59,-63.88],[-5.72,-63.79],[-5.7,-63.61],[-5.82,-63.57],[-5.62,-63.13],[-5.71,-63.15],[-5.75,-63.05],[-5.58,-63.07],[-5.55,-62.98],[-5.46,-63.04],[-5.45,-62.83],[-5.18,-62.87],[-5.08,-62.76],[-5.0,-62.79],[-4.87,-62.64],[-4.98,-62.66],[-4.95,-62.6],[-4.81,-62.62],[-4.87,-62.53],[-4.7,-62.36],[-4.72,-62.16],[-4.49,-61.97],[-4.49,-62.06],[-4.44,-62.03],[-4.23,-61.63],[-3.89,-61.38],[-3.67,-61.48]]},{name:'Jurua',w:2,op:0.3,coords:[[-10.09,-72.4],[-10.06,-72.51],[-9.93,-72.55],[-9.9,-72.65],[-9.66,-72.8],[-9.49,-72.79],[-9.32,-72.67],[-9.21,-72.72],[-9.12,-72.67],[-8.78,-72.86],[-8.51,-72.88],[-8.29,-72.75],[-8.14,-72.83],[-8.02,-72.76],[-7.87,-72.78],[-7.79,-72.65],[-7.65,-72.7],[-7.5,-72.58],[-7.52,-72.53],[-7.24,-72.37],[-7.15,-71.87],[-6.95,-71.47],[-6.95,-71.33],[-6.76,-71.07],[-6.83,-70.79],[-6.75,-70.63],[-6.8,-70.56],[-6.7,-70.37],[-6.78,-70.32],[-6.7,-70.13],[-6.75,-69.96],[-6.68,-69.89],[-6.7,-69.81],[-6.56,-69.8],[-6.51,-69.67],[-6.51,-69.6],[-6.59,-69.57],[-6.52,-69.45],[-6.6,-69.37],[-6.53,-69.31],[-6.6,-69.14],[-6.53,-69.12],[-6.52,-69.01],[-6.58,-69.02],[-6.45,-68.78],[-6.51,-68.37],[-6.45,-68.2],[-6.24,-68.19],[-6.27,-68.12],[-6.16,-68.11],[-6.21,-68.02],[-6.12,-68.0],[-6.08,-67.88],[-5.93,-67.81],[-5.85,-67.87],[-5.48,-67.66],[-5.36,-67.31],[-5.08,-67.17],[-5.11,-66.97],[-5.04,-66.87],[-4.83,-66.82],[-4.45,-66.55],[-4.38,-66.61],[-4.19,-66.57],[-3.64,-66.27],[-3.52,-66.25],[-3.47,-66.29],[-3.41,-66.15],[-3.27,-66.09],[-3.26,-66.02],[-3.05,-66.01],[-2.95,-65.87],[-2.88,-65.92],[-2.61,-65.74]]}];

// Calhas organizadas por Letras e Nomenclatura Amazon
const ROTAS=[
{num:'A',nome:'Baixo Amazonas',cor:'#0ea5e9',dir:'Manaus -> leste',municipios:[
{seq:'RAU9', nome:'Autazes',km:100, tt:'2d'},
{seq:'RUC9', nome:'Urucurituba',km:210, tt:'2d'},
{seq:'RAO9', nome:'Sao Sebastiao do Uatuma',km:305, tt:'1d'},
{seq:'RUR9', nome:'Urucara',km:320, tt:'1d'},
{seq:'RME9', nome:'Maues',km:360, tt:'2d'},
{seq:'RRA9', nome:'Boa Vista Ramos',km:348, tt:'1d'},
{seq:'RBA9', nome:'Barreirinha',km:440, tt:'1d'},
{seq:'RPA9', nome:'Parintins',km:420, tt:'2d'},
{seq:'RNH9', nome:'Nhamunda',km:480, tt:'2d'}]},
{num:'B',nome:'Metro Fluvial',cor:'#22d3ee',dir:'Manaus -> proximidades',municipios:[
{seq:'RRE9',nome:'Careiro da Varzea',km:40,  tt:'6h'},
{seq:'RQI9',nome:'Manaquiri',km:80,  tt:'6h'},
{seq:'RPI9',nome:'Caapiranga',km:120, tt:'1d'},
{seq:'RAN9',nome:'Anama',km:170, tt:'1d'},
{seq:'RNA9',nome:'Anori',km:180, tt:'1d'}]},
{num:'C',nome:'Rio Madeira',cor:'#a855f7',dir:'Manaus -> sul',municipios:[
{seq:'RNO9',nome:'Nova Olinda Norte',km:135, tt:'1d'},
{seq:'RBO9',nome:'Borba',km:200, tt:'2d'},
{seq:'RPU9',nome:'Novo Aripuana',km:310, tt:'3d'},
{seq:'RNI9',nome:'Manicore',km:380, tt:'3d'}]},
{num:'D',nome:'Medio Solimoes',cor:'#f97316',dir:'Manaus -> oeste',municipios:[
{seq:'RDA9',nome:'Codajas',km:240, tt:'2d'},
{seq:'RCO9',nome:'Coari',km:363, tt:'2d'},
{seq:'RTE9',nome:'Tefe',km:523, tt:'3d'},
{seq:'RAL9',nome:'Alvaraes',km:495, tt:'3d'},
{seq:'RUA9',nome:'Uarini',km:475, tt:'4d'},
{seq:'RAA9',nome:'Maraa',km:600, tt:'5d'},
{seq:'RJA9',nome:'Japura',km:640, tt:'5d'},
{seq:'RFO9',nome:'Fonte Boa',km:680, tt:'4d'}]},
{num:'E',nome:'Alto Solimoes',cor:'#f59e0b',dir:'Fronteira oeste',municipios:[
{seq:'RJT9',nome:'Jutai',km:780, tt:'6d'},
{seq:'RIN9',nome:'Tonantins',km:900, tt:'6d'},
{seq:'RTO9',nome:'Santo Antonio do Ica',km:960, tt:'7d'},
{seq:'RAM9',nome:'Amatura',km:1020,tt:'7d'},
{seq:'RUI9',nome:'Sao Paulo Olivenca',km:1080,tt:'7d'},
{seq:'RBE9',nome:'Benjamin Constant',km:1120,tt:'8d'},
{seq:'RAT9',nome:'Atalaia do Norte',km:1150,tt:'8d'},
{seq:'RUT9',nome:'Tabatinga',km:1160,tt:'8d'}]},
{num:'F',nome:'Rio Negro',cor:'#3b82f6',dir:'Manaus -> noroeste',municipios:[
{seq:'RRC9',nome:'Barcelos',km:400, tt:'3d'},
{seq:'RIP9',nome:'Sta. Isabel Rio Negro',km:620, tt:'5d'},
{seq:'RGA9',nome:'Sao Gabriel Cachoeira',km:850, tt:'4d'}]},
{num:'G',nome:'Rio Purus',cor:'#22c55e',dir:'Manaus -> sudoeste',municipios:[
{seq:'RRU9',nome:'Beruri',km:270, tt:'1d'},
{seq:'RRR9',nome:'Tapaua',km:460, tt:'4d'},
{seq:'RBL9',nome:'Canutama',km:620, tt:'5d'}]},
{num:'H',nome:'Rodoviario',cor:'#ff6644',dir:'Malha Rodoviaria estadual',municipios:[
{seq:'RIR9',nome:'Iranduba',km:27,  tt:'6h'},
{seq:'RMA9',nome:'Manacapuru',km:68,  tt:'1d'},
{seq:'RFB9',nome:'Novo Airao',km:115, tt:'1d'},
{seq:'RPR9',nome:'Pres. Figueiredo',km:107, tt:'1d'},
{seq:'RBB9',nome:'Balbina',km:140, tt:'1d'},
{seq:'RAC9',nome:'Rio Preto Eva',km:88,  tt:'1d'},
{seq:'RIT9',nome:'Itacoatiara',km:176, tt:'1d'},
{seq:'RNR9',nome:'Novo Remanso',km:100, tt:'1d'},
{seq:'RSI9',nome:'Silves',km:200, tt:'2d'},
{seq:'RNG9',nome:'Itapiranga',km:255, tt:'2d'},
{seq:'RAR9',nome:'Careiro Castanho',km:90,  tt:'1d'}]},
{num:'I',nome:'Sul do Amazonas',cor:'#84cc16',dir:'Rodoviario sul - BR-319 / BR-230',municipios:[
{seq:'RAP9',nome:'Apui',km:454, tt:'4d'},
{seq:'RHU9',nome:'Humaita',km:590, tt:'5d'},
{seq:'RLA9',nome:'Labrea',km:874, tt:'6d'}]},
{num:'J',nome:'Rio Jurua',cor:'#ec4899',dir:'Alto Jurua',municipios:[
{seq:'RRI9',nome:'Carauari',km:800, tt:'15d'},
{seq:'RJU9',nome:'Jurua',km:820, tt:'15d'},
{seq:'RRT9',nome:'Itamarati',km:985, tt:'13d'}]}
];

const EMBS = {
  "AMATURA": {"estream": [
    {"n":"BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"LADY MARY","d":"Quinta-feira","p":"","t":""},
    {"n":"PP 2003","d":"Quinta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"COMANDANTE NUNES","d":"Quinta-feira","p":"","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"SAMAUMA","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"RIO NEGRO","d":"Quarta-feira","p":"","t":""},
    {"n":"MARIA MONTEIRO","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"COMANDANTE TAVARES","d":"Sabado","p":"","t":""}
  ]},
  "ATALAIA DO NORTE": {"estream": [
    {"n":"AMAZONIA","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"PPJ","d":"Quinta-feira","p":"BALSA BRANCA","t":""},
    {"n":"CIDADE SANTAREM","d":"Quinta-feira","p":"","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"SAMAUMA","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"MARIA MONTEIRO","d":"Sexta-feira","p":"ROADWAY","t":""}
  ]},
  "BENJAMIN CONSTANT": {"estream": [
    {"n":"AMAZONIA","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"CARLOS ALBERTO","d":"Quinta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"RIO MADEIRA","d":"Quinta-feira","p":"DEMETRIO","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"SAMAUMA","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"RIO NEGRO","d":"Quarta-feira","p":"","t":""},
    {"n":"MARIA MONTEIRO","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"ESMERALDA","d":"Sabado","p":"","t":""}
  ]},
  "CAAPIRANGA": {"estream": [
    {"n":"CMT DEIVID","d":"Quinta-feira","p":"","t":""},
    {"n":"COMANDANTE DAVID","d":"Quinta-feira","p":"BALSA VERDE","t":""},
    {"n":"PROTEGIDO POR CRISTO","d":"Segunda-feira","p":"","t":""}
  ]},
  "CAREIRO DA VARZEA": {"estream": [
    {"n":"AMADA MINHA 9","d":"Quinta-feira","p":"","t":""},
    {"n":"EXP BARBOSA II","d":"Quinta-feira","p":"","t":""},
    {"n":"YONE","d":"Quinta-feira","p":"CEASA","t":""},
    {"n":"MONTE MORIA","d":"Quinta-feira","p":"","t":""},
    {"n":"DE MELO V","d":"Segunda-feira","p":"","t":""},
    {"n":"LANCHA ELOA","d":"Quarta-feira","p":"","t":""}
  ]},
  "FONTE BOA": {"estream": [
    {"n":"BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"RAINHA ESTHER","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"IRMAO MIRANDA","d":"Sabado","p":"","t":""},
    {"n":"MARIA MONTEIRO","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"COMANDANTE TAVARES","d":"Sabado","p":"","t":""}
  ]},
  "JAPURA": {"estream": [
    {"n":"AMERICA","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"BALSA DIAS E MENEZES","d":"Quinta-feira","p":"","t":""},
    {"n":"COMANDANTE OLIVEIRA","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"IRMAO MIRANDA","d":"Sabado","p":"","t":""},
    {"n":"ITAPURANGA","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"LADY ZANYS III","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"MADAME GORETHE","d":"Terca-feira","p":"","t":""},
    {"n":"MANOEL MONTEIRO","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"PROFETA DANIEL","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"LEAO DE JUDA V","d":"Quarta-feira","p":"ROADWAY","t":""},
    {"n":"PRINCIPE JOSE","d":"Quinta-feira","p":"ROADWAY","t":""}
  ]},
  "JURUA": {"estream": [
    {"n":"LADY LUIZA","d":"Sabado","p":"PORTO DE SAO RAIMUNDO","t":""},
    {"n":"ALMIRANTE OLIVEIRA","d":"Quinta-feira","p":"","t":""},
    {"n":"JESUS TE AMA","d":"Terca-feira","p":"","t":""}
  ]},
  "JUTAI": {"estream": [
    {"n":"BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"BARCO RIO NEGRO","d":"Quarta-feira","p":"","t":""},
    {"n":"CMT TAVARES","d":"Sabado","p":"","t":""},
    {"n":"ELION FERNANDES","d":"Terca-feira","p":"","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"FB SAFIRA","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"IZABEL L","d":"Sabado","p":"","t":""},
    {"n":"MARIA MONTEIRO","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"VITORIA REGIA","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"SAMAUMA","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"COMANDANTE TAVARES","d":"Sabado","p":"","t":""}
  ]},
  "MANAQUIRI": {"estream": [
    {"n":"BARBOSA V","d":"Quarta-feira","p":"BALSA AMARELA","t":""},
    {"n":"EXP ZECA","d":"Segunda-feira","p":"","t":""},
    {"n":"EXPRESSO BARBOSSA","d":"Sexta-feira","p":"","t":""},
    {"n":"J MIGUEIS BECIL","d":"Segunda-feira","p":"","t":""},
    {"n":"LANCHA ESPERANCA","d":"Quarta-feira","p":"","t":""},
    {"n":"MENEZES","d":"Segunda-feira","p":"BALSA AMARELA","t":""},
    {"n":"NR DA SILVA","d":"Quinta-feira","p":"","t":""}
  ]},
  "MANICORE": {"estream": [
    {"n":"ELIZABETH IV","d":"Sexta-feira","p":"DEMETRIO","t":""},
    {"n":"FREI GALVAO","d":"Terca-feira","p":"DEMETRIO","t":""},
    {"n":"LINDO AMANHECER","d":"Sabado","p":"BALSA AMARELA","t":""},
    {"n":"LUIZ GRACA","d":"Quarta-feira","p":"DEMETRIO","t":""},
    {"n":"PP MAUES","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"RAIMUNDO COIMBRA","d":"Segunda-feira","p":"DEMETRIO","t":""},
    {"n":"RIO MADEIRA","d":"Quinta-feira","p":"DEMETRIO","t":""},
    {"n":"MARLENE COIMBRA","d":"Segunda-feira","p":"DEMETRIO","t":""}
  ]},
  "MARAA": {"estream": [
    {"n":"ITAPURANGA","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"MANAUARA","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"LADY ZANIS","d":"Sabado","p":"","t":""},
    {"n":"MANOEL MONTEIRO","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"RAINHA ESTHER","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"IRMAO MIRANDA","d":"Sabado","p":"","t":""},
    {"n":"LEAO DE JUDA V","d":"Quarta-feira","p":"ROADWAY","t":""}
  ]},
  "MAUES": {"estream": [
    {"n":"ALMIRANTE DINELSIN","d":"Sexta-feira","p":"","t":""},
    {"n":"DOM JACKSON","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"ESTRELA PP","d":"Quarta-feira","p":"ROADWAY","t":""},
    {"n":"ESTRELA PP II","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"ESTRELA PP III","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"ESTRELA PP IV","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"EXPRESSO PP","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"PP MAUES IV","d":"Quarta-feira","p":"ROADWAY","t":""}
  ]},
  "NHAMUNDA": {"estream": [
    {"n":"MARIA FLOR","d":"Quinta-feira","p":"BALSA AMARELA","t":""},
    {"n":"VIP","d":"Segunda-feira","p":"BALSA AMARELA","t":""}
  ]},
  "NOVA OLINDA DO NORTE": {"estream": [
    {"n":"AMAZONIA","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"COMANDANTE PAIVA","d":"Quarta-feira","p":"PORTO DO GELAO","t":""},
    {"n":"JOAO FONSECA","d":"Segunda-feira","p":"PORTO DO GELAO","t":""},
    {"n":"LUIZ GRACA","d":"Quarta-feira","p":"DEMETRIO","t":""},
    {"n":"MESTRE JOAO FONSECA","d":"Segunda-feira","p":"PORTO DO GELAO","t":""},
    {"n":"SEIS IRMAOS","d":"Sexta-feira","p":"PORTO DO GELAO","t":""},
    {"n":"SAO FRANCISCO DE ASSIS 1","d":"Quinta-feira","p":"","t":""},
    {"n":"BARCO SAO FRANCISCO","d":"Quarta-feira","p":"","t":""}
  ]},
  "NOVO ARIPUANA": {"estream": [
    {"n":"CIDADE DE NOVO ARIPUANA","d":"Quarta-feira","p":"DEMETRIO","t":""},
    {"n":"ELIZABETH IV","d":"Sexta-feira","p":"DEMETRIO","t":""},
    {"n":"FREI GALVAO","d":"Terca-feira","p":"DEMETRIO","t":""},
    {"n":"LUIZ GRACA","d":"Quarta-feira","p":"DEMETRIO","t":""},
    {"n":"PP MAUES","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"RAIMUNDO COIMBRA","d":"Segunda-feira","p":"DEMETRIO","t":""},
    {"n":"RIO MADEIRA","d":"Quinta-feira","p":"DEMETRIO","t":""},
    {"n":"ZE HOLANDA","d":"Sabado","p":"BALSA AMARELA","t":""},
    {"n":"MARLENE COIMBRA","d":"Segunda-feira","p":"DEMETRIO","t":""}
  ]},
  "PARINTINS": {"estream": [
    {"n":"ANA REBECA III","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"FB PARINTINS","d":"Quinta-feira","p":"","t":""},
    {"n":"LIZ PINHEIRO","d":"Quinta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"NAVIO PARINTINS","d":"Quinta-feira","p":"","t":""},
    {"n":"SERGIO BRELAS","d":"Terca-feira","p":"","t":""},
    {"n":"OLIVEIRA V","d":"Sexta-feira","p":"","t":""},
    {"n":"PRINCIPE DO AMAZONAS","d":"Segunda-feira","p":"","t":""}
  ]},
  "SANTO ANTONIO DO ICA": {"estream": [
    {"n":"BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"CORONEL TAVARES","d":"Sabado","p":"","t":""},
    {"n":"ELION FERNANDES","d":"Terca-feira","p":"","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"IZABEL L","d":"Sexta-feira","p":"","t":""},
    {"n":"MARIA MONTEIRO","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"RIO NEGRO","d":"Quarta-feira","p":"","t":""},
    {"n":"VITORIA REGIA","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"SAMAUMA","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"COMANDANTE TAVARES","d":"Sabado","p":"","t":""}
  ]},
  "SAO GABRIEL DA CACHOEIRA": {"estream": [
    {"n":"LADY LUIZA","d":"Sexta-feira","p":"PORTO DE SAO RAIMUNDO","t":""},
    {"n":"LANCHA TURQUEZA","d":"Quinta-feira","p":"","t":""},
    {"n":"CMT NATAL","d":"Quinta-feira","p":"","t":""}
  ]},
  "SAO GABRIEL CACHOEIRA": {"estream": [
    {"n":"LADY LUIZA","d":"Sexta-feira","p":"PORTO DE SAO RAIMUNDO","t":""},
    {"n":"LANCHA TURQUEZA","d":"Quinta-feira","p":"","t":""},
    {"n":"CMT NATAL","d":"Quinta-feira","p":"","t":""}
  ]},
  "SAO PAULO DE OLIVENCA": {"estream": [
    {"n":"BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"CMT TAVARES","d":"Sabado","p":"","t":""},
    {"n":"ELION FERNANDES","d":"Terca-feira","p":"","t":""},
    {"n":"IZABEL L","d":"Sexta-feira","p":"","t":""},
    {"n":"MARIA MONTEIRO","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"RIO NEGRO","d":"Quarta-feira","p":"","t":""},
    {"n":"VITORIA REGIA","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"COMANDANTE TAVARES","d":"Sabado","p":"","t":""}
  ]},
  "SAO PAULO OLIVENCA": {"estream": [
    {"n":"BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"CMT TAVARES","d":"Sabado","p":"","t":""},
    {"n":"ELION FERNANDES","d":"Terca-feira","p":"","t":""},
    {"n":"IZABEL L","d":"Sexta-feira","p":"","t":""},
    {"n":"MARIA MONTEIRO","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"RIO NEGRO","d":"Quarta-feira","p":"","t":""},
    {"n":"VITORIA REGIA","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"COMANDANTE TAVARES","d":"Sabado","p":"","t":""}
  ]},
  "SAO SEBASTIAO DO UATUMA": {"estream": [
    {"n":"ALMIRANTE GUIMARAES","d":"Quarta-feira","p":"","t":""},
    {"n":"BM DONA LIKA","d":"Segunda-feira","p":"BALSA BRANCA","t":""},
    {"n":"CANDIDO X","d":"Sabado","p":"","t":""},
    {"n":"COMANDANTE NATAL","d":"Sabado","p":"BALSA VERMELHA","t":""},
    {"n":"MS VITORIA","d":"Terca-feira","p":"BALSA BRANCA","t":""},
    {"n":"PP MAUES III","d":"Quinta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"PRINCIPE DE URUCARA","d":"Sexta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"DONA LIKA","d":"Segunda-feira","p":"BALSA BRANCA","t":""},
    {"n":"O NOIVO","d":"Sabado","p":"","t":""},
    {"n":"VITORIA REGIA","d":"Segunda-feira","p":"","t":""}
  ]},
  "TABATINGA": {"estream": [
    {"n":"BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"ELION FERNANDES","d":"Terca-feira","p":"","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"GM OLIVEIRA","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"RIO NEGRO","d":"Quarta-feira","p":"","t":""},
    {"n":"RIO SOLIMOES","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"VITORIA REGIA","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"SAMAUMA","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"MARIA MONTEIRO","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"ESMERALDA","d":"Sabado","p":"","t":""}
  ]},
  "TAPAUA": {"estream": [
    {"n":"CMT WILLIAN","d":"Quarta-feira","p":"","t":""},
    {"n":"LADY ZANYS","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"MAJOR CURIO","d":"Sexta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"MANOEL SILVA","d":"Quarta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"PP MAUES","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"REI DAVI","d":"Sabado","p":"","t":""}
  ]},
  "TEFE": {"estream": [
    {"n":"ESTRELA DO PURUS","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"IRMAO MIRANDA","d":"Sabado","p":"","t":""},
    {"n":"LEAO DE JUDA","d":"Quarta-feira","p":"BALSA VERDE","t":""},
    {"n":"PROFETA DANIEL","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"RAINHA ESTHER","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"LEAO DE JUDA V","d":"Quarta-feira","p":"ROADWAY","t":""},
    {"n":"PRINCIPE JOSE","d":"Quinta-feira","p":"ROADWAY","t":""}
  ]},
  "TONANTINS": {"estream": [
    {"n":"CMT TAVARES","d":"Sabado","p":"","t":""},
    {"n":"CORONEL TAVARES","d":"Sabado","p":"","t":""},
    {"n":"ELION FERNANDES","d":"Terca-feira","p":"","t":""},
    {"n":"EMBAIXADOR","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"FB SAFIRA","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"IZABEL L","d":"Sexta-feira","p":"","t":""},
    {"n":"MARIA MONTEIRO","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"VITORIA REGIA","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"FB BANZEIRO","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"COMANDANTE TAVARES","d":"Sabado","p":"","t":""}
  ]},
  "UARINI": {"estream": [
    {"n":"AMERICA","d":"Terca-feira","p":"ROADWAY","t":""},
    {"n":"ESTRELA DO PURUS","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"IRMAO MIRANDA","d":"Sabado","p":"","t":""},
    {"n":"LEAO DE JUDA","d":"Quarta-feira","p":"BALSA VERDE","t":""},
    {"n":"PROFETA DANIEL","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"RAINHA ESTHER","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"LEAO DE JUDA V","d":"Quarta-feira","p":"ROADWAY","t":""},
    {"n":"PRINCIPE JOSE","d":"Quinta-feira","p":"ROADWAY","t":""}
  ]},
  "URUCARA": {"estream": [
    {"n":"ALMIRANTE GUIMARAES","d":"Quarta-feira","p":"","t":""},
    {"n":"BM DONA LIKA","d":"Segunda-feira","p":"BALSA BRANCA","t":""},
    {"n":"CANDIDO XII","d":"Sabado","p":"","t":""},
    {"n":"COMANDANTE NATAL","d":"Sexta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"MS VITORIA","d":"Terca-feira","p":"BALSA BRANCA","t":""},
    {"n":"O NOIVO","d":"Sabado","p":"","t":""},
    {"n":"PP MAUES","d":"Quarta-feira","p":"ROADWAY","t":""},
    {"n":"PRINCIPE DE URUCARA","d":"Sexta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"DONA LIKA","d":"Segunda-feira","p":"BALSA BRANCA","t":""},
    {"n":"PP MAUES II","d":"Quarta-feira","p":"ROADWAY","t":""}
  ]},
  "URUCURITUBA": {"estream": [
    {"n":"CIDADE DE URUCURITUBA","d":"Quinta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"M GOMES","d":"Quarta-feira","p":"BALSA AMARELA","t":""},
    {"n":"TITO NOGUEIRA","d":"Segunda-feira","p":"BALSA VERMELHA","t":""},
    {"n":"YASMIN","d":"Sexta-feira","p":"BALSA VERMELHA","t":""},
    {"n":"TITO NOGUEIRA II","d":"Segunda-feira","p":"BALSA VERMELHA","t":""}
  ]},
  "ALVARAES": {"estream": [
    {"n":"LEAO DE JUDA","d":"Quarta-feira","p":"BALSA VERDE","t":""},
    {"n":"PROFETA DANIEL","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"RAINHA ESTHER","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"LEAO DE JUDA V","d":"Quarta-feira","p":"ROADWAY","t":""},
    {"n":"ESTRELA DO PURUS","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"IRMAO MIRANDA","d":"Sabado","p":"","t":""}
  ]},
  "ANAMA": {"estream": [
    {"n":"ARTHUR OLIVEIRA","d":"Sexta-feira","p":"","t":""},
    {"n":"INGRID BEATRIZ","d":"Quinta-feira","p":"","t":""},
    {"n":"LIZ PINHEIRO","d":"Terca-feira","p":"","t":""},
    {"n":"PODEROSO","d":"Segunda-feira","p":"","t":""},
    {"n":"ZE HOLANDA","d":"Quarta-feira","p":"","t":""}
  ]},
  "ANORI": {"estream": [
    {"n":"PODEROSO","d":"Segunda-feira","p":"","t":""},
    {"n":"LIZ PINHEIRO","d":"Terca-feira","p":"","t":""},
    {"n":"ZE HOLANDA","d":"Quarta-feira","p":"","t":""}
  ]},
  "AUTAZES": {"estream": [
    {"n":"6 DE JULHO II","d":"Segunda-feira","p":"","t":""},
    {"n":"DONA MARIA","d":"Terca-feira","p":"","t":""},
    {"n":"PIMENTEL FILHO V","d":"Terca-feira","p":"","t":""},
    {"n":"PPJ","d":"Quarta-feira","p":"","t":""}
  ]},
  "BARCELOS": {"estream": [
    {"n":"CMT NATAL","d":"Quinta-feira","p":"","t":""}
  ]},
  "BARREIRINHA": {"estream": [
    {"n":"ESTRELA PP II","d":"Sabado","p":"ROADWAY","t":""},
    {"n":"CIDADE SANTAREM","d":"Quarta-feira","p":"","t":""},
    {"n":"MARIA CARDOSO","d":"Segunda-feira","p":"","t":""}
  ]},
  "BERURI": {"estream": [
    {"n":"ARTHUR OLIVEIRA","d":"Segunda-feira","p":"","t":""},
    {"n":"CARLOS ALBERTO XV","d":"Terca-feira","p":"","t":""},
    {"n":"INGRID BEATRIZ","d":"Quinta-feira","p":"","t":""}
  ]},
  "BOA VISTA DO RAMOS": {"estream": [
    {"n":"MARIA CARDOSO","d":"Segunda-feira","p":"","t":""},
    {"n":"ALMIR ARAUJO","d":"Terca-feira","p":"","t":""}
  ]},
  "BOA VISTA RAMOS": {"estream": [
    {"n":"MARIA CARDOSO","d":"Segunda-feira","p":"","t":""},
    {"n":"ALMIR ARAUJO","d":"Terca-feira","p":"","t":""}
  ]},
  "CARAUARI": {"estream": [
    {"n":"ALMIRANTE OLIVEIRA","d":"Segunda-feira","p":"","t":""},
    {"n":"JESUS TE AMA","d":"Terca-feira","p":"","t":""},
    {"n":"ARAFER IX","d":"Quinta-feira","p":"","t":""}
  ]},
  "COARI": {"estream": [
    {"n":"RAINHA ESTHER","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"LEAO DE JUDA V","d":"Quarta-feira","p":"ROADWAY","t":""},
    {"n":"PRINCIPE JOSE","d":"Quinta-feira","p":"ROADWAY","t":""},
    {"n":"IRMAO MIRANDA","d":"Sabado","p":"","t":""},
    {"n":"VENCEDOR VIII","d":"Segunda-feira","p":"","t":""},
    {"n":"ESTRELA DO PURUS","d":"Quinta-feira","p":"ROADWAY","t":""}
  ]},
  "CODAJAS": {"estream": [
    {"n":"RAINHA ESTHER","d":"Segunda-feira","p":"ROADWAY","t":""},
    {"n":"CMT LORO","d":"Terca-feira","p":"","t":""},
    {"n":"PROFETA DANIEL","d":"Sexta-feira","p":"ROADWAY","t":""},
    {"n":"IRMAO MIRANDA","d":"Sabado","p":"","t":""},
    {"n":"INGRID BEATRIZ","d":"Segunda-feira","p":"","t":""},
    {"n":"MONTE MORIA","d":"Quarta-feira","p":"","t":""},
    {"n":"ESTRELA DO PURUS","d":"Quinta-feira","p":"ROADWAY","t":""}
  ]},
  "ITACOATIARA": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "MANACAPURU": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "NOVO AIRAO": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "PRESIDENTE FIGUEIREDO": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "PRES. FIGUEIREDO": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "CAREIRO CASTANHO": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "ITAPIRANGA": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "NOVO REMANSO": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "RIO PRETO DA EVA": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "RIO PRETO EVA": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "SILVES": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "APUI": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "HUMAITA": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "LABREA": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "IRANDUBA": {"estream": [
    {"n":"TRANSAMAZONICA","d":"Segunda-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Terca-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quarta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Quinta-feira","p":"RODOVIARIO","t":""},
    {"n":"TRANSAMAZONICA","d":"Sexta-feira","p":"RODOVIARIO","t":""}
  ]},
  "ITAMARATI": {"estream": [
    {"n":"DONA CANDIDA II","d":"Terca-feira","p":"","t":""}
  ]},
  "CARAUARI": {"estream": [
    {"n":"ALMIRANTE OLIVEIRA","d":"Segunda-feira","p":"","t":""},
    {"n":"JESUS TE AMA","d":"Terca-feira","p":"","t":""},
    {"n":"ARAFER IX","d":"Quinta-feira","p":"","t":""}
  ]}
};

const DP={'domingo':0,'segunda':1,'terca':2,'quarta':3,'quinta':4,'sexta':5,'sabado':6};
