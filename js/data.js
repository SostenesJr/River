/* ============================================================
   BANCO DE DADOS — RIVER OPS TRIAGEM
   Este arquivo concentra todas as coordenadas, rotas, 
   contornos do Amazonas e o cadastro de embarcações.
   ============================================================ */

// Contorno oficial simplificado do estado do Amazonas [lat,lng]
const AM_BORDER = "-8.95,-64.14 -9.04,-64.92 -9.23,-64.92 -9.45,-65.14 -9.26,-65.25 -9.32,-65.45 -9.47,-65.43 -9.41,-65.6 -9.59,-65.79 -9.41,-65.97 -9.41,-66.41 -9.63,-66.5 -9.82,-66.81 -9.05,-68.65 -7.85,-70.05 -7.55,-72.58 -7.11,-73.8 -6.76,-73.64 -6.5,-73.14 -6.03,-73.24 -5.65,-72.96 -5.11,-72.81 -4.52,-71.88 -4.39,-70.94 -4.13,-70.65 -4.15,-70.33 -4.37,-70.2 -4.3,-69.96 -1.13,-69.4 -0.75,-69.63 -0.51,-69.61 -0.19,-70.06 0.56,-70.04 0.74,-69.48 0.61,-69.36 0.65,-69.11 1.06,-69.26 1.09,-69.84 1.72,-69.84 1.73,-68.16 1.83,-68.27 1.98,-68.18 1.83,-67.94 2.24,-67.39 1.89,-67.29 1.73,-67.1 1.17,-67.09 1.23,-66.86 0.74,-66.32 1.01,-65.58 0.65,-65.54 0.93,-65.33 0.92,-65.18 1.16,-65.1 1.31,-64.81 1.23,-64.75 1.53,-64.4 1.36,-64.34 1.62,-64.09 1.98,-63.99 2.18,-63.16 2.03,-63.05 1.94,-62.7 1.59,-62.8 0.97,-62.44 0.51,-62.53 -0.33,-62.19 -0.65,-62.3 -0.76,-62.51 -1.14,-62.02 -1.4,-61.9 -1.58,-61.47 -1.39,-61.62 -0.94,-61.58 -0.66,-61.46 -0.5,-61.22 -0.56,-60.92 -0.89,-60.67 -0.72,-60.31 -0.51,-60.4 0.26,-60.04 0.26,-58.9 -0.34,-58.87 -1.14,-58.32 -1.23,-58.16 -1.11,-58.02 -1.4,-57.96 -1.72,-57.39 -1.72,-57.16 -1.91,-57.04 -2.02,-56.73 -2.21,-56.68 -2.03,-56.1 -2.42,-56.47 -6.45,-58.25 -6.7,-58.48 -7.36,-58.14 -7.84,-58.38 -8.09,-58.29 -8.77,-58.39 -8.8,-61.58 -8.69,-61.71 -8.88,-61.98 -7.99,-62.84 -7.97,-63.62 -8.33,-63.78 -8.33,-63.94 -8.57,-63.92 -8.74,-64.14 -8.95,-64.14";

// Traçado simplificado das calhas dos principais rios da região
const RIOS = {
    "Amazonas-Solimoes": "-2.05,-54.0 -2.33,-54.07 -2.45,-54.57 -2.41,-54.68 -2.15,-54.72 -2.07,-54.91 -2.2,-55.09 -1.91,-55.64 -2.01,-56.05 -2.57,-56.64 -2.51,-57.0 -2.57,-57.19 -2.39,-57.54 -2.75,-57.81 -2.88,-58.11 -3.2,-58.21 -3.16,-58.5 -3.34,-58.66 -3.08,-59.81 -3.34,-60.17 -3.33,-60.69 -3.61,-60.91 -3.62,-61.4 -3.96,-61.88 -3.69,-62.41 -3.84,-62.46 -3.89,-62.79 -4.08,-63.12 -3.95,-63.2 -3.83,-63.91 -3.57,-64.42 -3.41,-64.51 -2.59,-65.49 -2.62,-65.71 -2.46,-65.95 -2.5,-66.07 -2.42,-66.18 -2.57,-66.31 -2.42,-66.54 -2.69,-66.66 -2.73,-66.99 -2.58,-67.35 -2.75,-67.49 -2.84,-67.79 -3.06,-67.93 -3.34,-67.97 -3.29,-68.35 -3.5,-69.33 -3.71,-69.42 -3.94,-69.4 -4.09,-69.5 -4.19,-69.41 -4.34,-69.6 -4.33,-69.93 -3.82,-70.35 -4.0,-71.08 -3.86,-71.25 -3.86,-71.47 -3.72,-71.68 -3.39,-71.74 -3.34,-71.84 -3.52,-72.26 -3.45,-72.81 -3.52,-73.05 -3.73,-73.25 -4.1,-73.18 -4.11,-73.37 -4.44,-73.49",
    "Rio-Negro": "2.06,-70.34 2.12,-69.78 2.29,-69.34 2.21,-68.99 2.22,-68.75 2.41,-68.55 2.29,-68.33 2.36,-68.25 2.49,-68.24 2.61,-68.12 2.58,-68.08 2.67,-68.05 2.78,-67.92 2.84,-67.75 2.81,-67.63 2.69,-67.58 2.68,-67.5 2.47,-67.33 2.39,-67.19 2.27,-67.22 2.1,-67.12 1.99,-67.13 1.35,-66.88 0.96,-66.86 0.89,-66.94 0.89,-67.2 0.58,-67.25 0.43,-67.32 0.07,-67.26 -0.18,-67.03 -0.16,-66.89 -0.36,-66.55 -0.39,-66.42 -0.4,-66.33 -0.33,-66.24 -0.32,-65.96 -0.25,-65.87 -0.3,-65.74 -0.29,-65.51 -0.41,-65.24 -0.42,-65.05 -0.48,-64.93 -0.3,-64.1 -0.33,-63.71 -0.55,-63.41 -0.7,-63.03 -0.93,-62.83 -1.15,-62.43 -1.37,-61.95 -1.38,-61.77 -1.46,-61.59 -1.7,-61.44 -1.85,-61.43 -2.15,-61.12 -2.43,-61.01 -2.79,-60.65 -3.03,-60.49 -3.07,-60.21 -3.17,-60.0 -3.13,-59.91",
    "Rio-Madeira": "-10.39,-65.4 -10.21,-65.29 -9.97,-65.34 -9.84,-65.3 -9.64,-65.45 -9.53,-65.33 -9.59,-65.16 -9.6,-64.94 -9.54,-64.84 -9.37,-64.82 -9.36,-64.74 -9.19,-64.59 -9.15,-64.51 -9.18,-64.37 -9.01,-64.26 -8.96,-64.08 -8.86,-64.07 -8.76,-63.92 -8.64,-63.91 -8.55,-63.67 -8.58,-63.54 -8.48,-63.57 -8.42,-63.47 -8.17,-63.33 -8.22,-63.21 -8.03,-62.89 -7.92,-62.86 -7.86,-62.91 -7.62,-62.93 -7.46,-63.02 -7.04,-62.87 -6.96,-62.69 -6.77,-62.58 -6.72,-62.36 -6.65,-62.33 -6.58,-62.38 -6.41,-62.26 -6.23,-62.23 -6.19,-62.15 -6.24,-61.85 -6.12,-61.82 -6.0,-61.67 -5.9,-61.67 -5.89,-61.59 -5.84,-61.63 -5.86,-61.5 -5.8,-61.39 -5.84,-61.33 -5.66,-61.24 -5.57,-61.07 -5.6,-60.98 -5.49,-60.74 -5.33,-60.72 -5.18,-60.43 -4.91,-60.2 -4.92,-60.07 -4.83,-59.93 -4.68,-59.93 -4.45,-59.82 -4.33,-59.72 -4.37,-59.59 -4.24,-59.4 -3.99,-59.31 -3.84,-59.08 -3.68,-59.09 -3.34,-58.71",
    "Rio-Purus": "-10.5,-71.37 -10.37,-71.13 -9.97,-71.0 -9.57,-70.57 -9.36,-70.51 -9.14,-70.29 -9.06,-69.6 -8.71,-68.93 -8.83,-68.66 -9.04,-68.57 -9.08,-68.17 -8.72,-67.38 -8.45,-67.44 -8.1,-67.23 -7.99,-67.26 -7.68,-66.96 -7.64,-66.52 -7.49,-66.33 -7.58,-66.33 -7.56,-66.21 -7.71,-66.04 -7.72,-65.68 -7.44,-65.15 -7.29,-65.14 -7.29,-64.84 -7.14,-64.64 -7.05,-64.65 -7.07,-64.56 -6.88,-64.66 -6.84,-64.55 -6.72,-64.59 -6.54,-64.31 -5.95,-64.32 -5.88,-64.47 -5.6,-64.33 -5.59,-63.88 -5.72,-63.79 -5.7,-63.61 -5.82,-63.57 -5.62,-63.13 -5.71,-63.15 -5.75,-63.05 -5.58,-63.07 -5.55,-62.98 -5.46,-63.04 -5.45,-62.83 -5.18,-62.87 -5.08,-62.76 -5.0,-62.79 -4.87,-62.64 -4.98,-62.66 -4.95,-62.6 -4.81,-62.62 -4.87,-62.53 -4.7,-62.36 -4.72,-62.16 -4.49,-61.97 -4.49,-62.06 -4.44,-62.03 -4.23,-61.63 -3.89,-61.38 -3.67,-61.48",
    "Rio-Jurua": "-10.09,-72.4 -10.06,-72.51 -9.93,-72.55 -9.9,-72.65 -9.66,-72.8 -9.49,-72.79 -9.32,-72.67 -9.21,-72.72 -9.12,-72.67 -8.78,-72.86 -8.51,-72.88 -8.29,-72.75 -8.14,-72.83 -8.02,-72.76 -7.87,-72.78 -7.79,-72.65 -7.65,-72.7 -7.5,-72.58 -7.52,-72.53 -7.24,-72.37 -7.15,-71.87 -6.95,-71.47 -6.95,-71.33 -6.76,-71.07 -6.83,-70.79 -6.75,-70.63 -6.8,-70.56 -6.7,-70.37 -6.78,-70.32 -6.7,-70.13 -6.75,-69.96 -6.68,-69.89 -6.7,-69.81 -6.56,-69.8 -6.51,-69.67 -6.51,-69.6 -6.59,-69.57 -6.52,-69.45 -6.6,-69.37 -6.53,-69.31 -6.6,-69.14 -6.53,-69.12 -6.52,-69.01 -6.58,-69.02 -6.45,-68.78 -6.51,-68.37 -6.45,-68.2 -6.24,-68.19 -6.27,-68.12 -6.16,-68.11 -6.21,-68.02 -6.12,-68.0 -6.08,-67.88 -5.93,-67.81 -5.85,-67.87 -5.48,-67.66 -5.36,-67.31 -5.08,-67.17 -5.11,-66.97 -5.04,-66.87 -4.83,-66.82 -4.45,-66.55 -4.38,-66.61 -4.19,-66.57 -3.64,-66.27 -3.52,-66.25 -3.47,-66.29 -3.41,-66.15 -3.27,-66.09 -3.26,-66.02 -3.05,-66.01 -2.95,-65.87 -2.88,-65.92 -2.61,-65.74"
};

// Coordenadas [lat, lng] de cada município para renderizar os marcadores
const LATLNG = {
    'Autazes': [-3.580, -59.129], 'Urucurituba': [-2.838, -57.747], 'Sao Sebastiao do Uatuma': [-2.655, -57.698],
    'Urucara': [-2.532, -57.755], 'Maues': [-2.974, -57.575], 'Boa Vista do Ramos': [-3.388, -57.720],
    'Barreirinha': [-2.629, -56.735], 'Parintins': [-2.793, -57.049], 'Nhamunda': [-2.195, -56.709],
    'Careiro da Varzea': [-3.360, -59.870], 'Manaquiri': [-3.486, -60.458], 'Caapiranga': [-3.940, -61.350],
    'Anama': [-3.583, -61.392], 'Anori': [-3.769, -61.656], 'Nova Olinda do Norte': [-3.894, -59.094],
    'Borba': [-4.392, -59.594], 'Novo Aripuana': [-5.121, -60.381], 'Manicore': [-5.808, -61.297],
    'Codajas': [-3.836, -62.059], 'Coari': [-4.085, -63.141], 'Tefe': [-3.189, -65.341],
    'Alvaraes': [-3.215, -64.867], 'Uarini': [-3.367, -64.709], 'Maraa': [-1.835, -65.356],
    'Japura': [-1.879, -66.160], 'Fonte Boa': [-2.513, -66.095], 'Jutai': [-4.872, -66.896],
    'Tonantins': [-3.493, -66.045], 'Santo Antonio do Ica': [-4.280, -68.049], 'Amatura': [-0.980, -62.921],
    'Sao Paulo de Olivenca': [-2.744, -66.778], 'Benjamin Constant': [-4.381, -70.031],
    'Atalaia do Norte': [-4.375, -70.193], 'Tabatinga': [-4.253, -69.937], 'Barcelos': [-3.281, -60.185],
    'Sta. Isabel Rio Negro': [-3.297, -60.621], 'Sao Gabriel da Cachoeira': [-2.630, -60.932],
    'Beruri': [-3.900, -61.359], 'Tapaua': [-5.626, -63.195], 'Canutama': [-6.532, -64.393],
    'Iranduba': [-3.143, -58.700], 'Manacapuru': [-3.143, -58.444], 'Novo Airao': [-2.840, -58.210],
    'Pres. Figueiredo': [-2.019, -60.030], 'Balbina': [-1.920, -59.473], 'Rio Preto da Eva': [-2.698, -59.695],
    'Itacoatiara': [-3.143, -58.444], 'Novo Remanso': [-2.840, -58.210], 'Silves': [-2.746, -58.027],
    'Itapiranga': [-3.743, -59.287], 'Careiro Castanho': [-3.143, -58.700], 'Apui': [-7.198, -59.889],
    'Humaita': [-7.503, -63.019], 'Labrea': [-7.259, -64.793], 'Carauari': [-4.872, -66.896],
    'Jurua': [-3.493, -66.045], 'Itamarati': [-4.280, -68.049]
};

// Estrutura das 10 calhas/rotas ordenadas por sequência lógica de triagem
const ROUTES = [
    { id: "01", calhas: ["Baixo Amazonas"], stops: ["Autazes", "Urucurituba", "Sao Sebastiao do Uatuma", "Urucara", "Maues", "Boa Vista do Ramos", "Barreirinha", "Parintins", "Nhamunda"] },
    { id: "02", calhas: ["Metro Fluvial"], stops: ["Careiro da Varzea", "Manaquiri", "Caapiranga", "Anama", "Anori"] },
    { id: "03", calhas: ["Rio Madeira"], stops: ["Nova Olinda do Norte", "Borba", "Novo Aripuana", "Manicore"] },
    { id: "04", calhas: ["Medio Solimoes"], stops: ["Codajas", "Coari", "Tefe", "Alvaraes", "Uarini", "Maraa", "Japura", "Fonte Boa"] },
    { id: "05", calhas: ["Alto Solimoes"], stops: ["Jutai", "Tonantins", "Santo Antonio do Ica", "Amatura", "Sao Paulo de Olivenca", "Benjamin Constant", "Atalaia do Norte", "Tabatinga"] },
    { id: "06", calhas: ["Rio Negro"], stops: ["Barcelos", "Sta. Isabel Rio Negro", "Sao Gabriel da Cachoeira"] },
    { id: "07", calhas: ["Rio Purus"], stops: ["Beruri", "Tapaua", "Canutama"] },
    { id: "08", calhas: ["Rodoviario"], stops: ["Iranduba", "Manacapuru", "Novo Airao", "Pres. Figueiredo", "Balbina", "Rio Preto da Eva", "Itacoatiara", "Novo Remanso", "Silves", "Itapiranga", "Careiro Castanho"] },
    { id: "09", calhas: ["Sul do Amazonas"], stops: ["Apui", "Humaita", "Labrea"] },
    { id: "10", calhas: ["Rio Jurua"], stops: ["Carauari", "Jurua", "Itamarati"] }
];

// Mapeamento individual de CEP, SLAM e Posição (Seq) de cada município
const MUNIC_DATA = {
    'Autazes': { cep: '69200', slam: 'RAU9', seq: '01', rota: '01' },
    'Urucurituba': { cep: '69110', slam: 'RUC9', seq: '02', rota: '01' },
    'Sao Sebastiao do Uatuma': { cep: '69120', slam: 'RAO9', seq: '03', rota: '01' },
    'Urucara': { cep: '69130', slam: 'RUR9', seq: '04', rota: '01' },
    'Maues': { cep: '69180', slam: 'RME9', seq: '05', rota: '01' },
    'Boa Vista do Ramos': { cep: '69150', slam: 'RRA9', seq: '06', rota: '01' },
    'Barreirinha': { cep: '69155', slam: 'RBA9', seq: '07', rota: '01' },
    'Parintins': { cep: '69151', slam: 'RPA9', seq: '08', rota: '01' },
    'Nhamunda': { cep: '69160', slam: 'RNH9', seq: '09', rota: '01' },
    'Careiro da Varzea': { cep: '69410', slam: 'RRE9', seq: '10', rota: '02' },
    'Manaquiri': { cep: '69430', slam: 'RQI9', seq: '11', rota: '02' },
    'Caapiranga': { cep: '69455', slam: 'RPI9', seq: '12', rota: '02' },
    'Anama': { cep: '69490', slam: 'RAN9', seq: '13', rota: '02' },
    'Anori': { cep: '69480', slam: 'RNA9', seq: '14', rota: '02' },
    'Nova Olinda do Norte': { cep: '69260', slam: 'RNO9', seq: '15', rota: '03' },
    'Borba': { cep: '69230', slam: 'RBO9', seq: '16', rota: '03' },
    'Novo Aripuana': { cep: '69290', slam: 'RPU9', seq: '17', rota: '03' },
    'Manicore': { cep: '69280', slam: 'RNI9', seq: '18', rota: '03' },
    'Codajas': { cep: '69470', slam: 'RDA9', seq: '19', rota: '04' },
    'Coari': { cep: '69460', slam: 'RCO9', seq: '20', rota: '04' },
    'Tefe': { cep: '69553', slam: 'RTE9', seq: '21', rota: '04' },
    'Alvaraes': { cep: '69650', slam: 'RAL9', seq: '22', rota: '04' },
    'Uarini': { cep: '69655', slam: 'RUA9', seq: '23', rota: '04' },
    'Maraa': { cep: '69665', slam: 'RAA9', seq: '24', rota: '04' },
    'Japura': { cep: '69660', slam: 'RJA9', seq: '25', rota: '04' },
    'Fonte Boa': { cep: '69670', slam: 'RFO9', seq: '26', rota: '04' },
    'Jutai': { cep: '69675', slam: 'RJT9', seq: '27', rota: '05' },
    'Tonantins': { cep: '69693', slam: 'RIN9', seq: '28', rota: '05' },
    'Santo Antonio do Ica': { cep: '69690', slam: 'RTO9', seq: '29', rota: '05' },
    'Amatura': { cep: '69680', slam: 'RAM9', seq: '30', rota: '05' },
    'Sao Paulo de Olivenca': { cep: '69685', slam: 'RUI9', seq: '31', rota: '05' },
    'Benjamin Constant': { cep: '69695', slam: 'RBE9', seq: '32', rota: '05' },
    'Atalaia do Norte': { cep: '69697', slam: 'RAT9', seq: '33', rota: '05' },
    'Tabatinga': { cep: '69640', slam: 'RUT9', seq: '34', rota: '05' },
    'Barcelos': { cep: '69700', slam: 'RRC9', seq: '35', rota: '06' },
    'Sta. Isabel Rio Negro': { cep: '69735', slam: 'RIP9', seq: '36', rota: '06' },
    'Sao Gabriel da Cachoeira': { cep: '69750', slam: 'RGA9', seq: '37', rota: '06' },
    'Beruri': { cep: '69493', slam: 'RRU9', seq: '38', rota: '07' },
    'Tapaua': { cep: '69510', slam: 'RRR9', seq: '39', rota: '07' },
    'Canutama': { cep: '69530', slam: 'RBL9', seq: '40', rota: '07' },
    'Iranduba': { cep: '69400', slam: 'RIR9', seq: '41', rota: '08' },
    'Manacapuru': { cep: '69440', slam: 'RMA9', seq: '42', rota: '08' },
    'Novo Airao': { cep: '69730', slam: 'RFB9', seq: '43', rota: '08' },
    'Pres. Figueiredo': { cep: '69773', slam: 'RPR9', seq: '44', rota: '08' },
    'Balbina': { cep: '69755', slam: 'RBM9', seq: '45', rota: '08' },
    'Rio Preto da Eva': { cep: '69103', slam: 'RAC9', seq: '46', rota: '08' },
    'Itacoatiara': { cep: '69100', slam: 'RIT9', seq: '47', rota: '08' },
    'Novo Remanso': { cep: '69107', slam: 'RRM9', seq: '48', rota: '08' },
    'Silves': { cep: '69105', slam: 'RIS9', seq: '49', rota: '08' },
    'Itapiranga': { cep: '69115', slam: 'RNG9', seq: '50', rota: '08' },
    'Careiro Castanho': { cep: '69415', slam: 'RAR9', seq: '51', rota: '08' },
    'Apui': { cep: '69265', slam: 'RAP9', seq: '52', rota: '09' },
    'Humaita': { cep: '69805', slam: 'RHU9', seq: '53', rota: '09' },
    'Labrea': { cep: '69540', slam: 'RLA9', seq: '54', rota: '09' },
    'Carauari': { cep: '69800', slam: 'RRI9', seq: '55', rota: '10' },
    'Jurua': { cep: '69820', slam: 'RJU9', seq: '56', rota: '10' },
    'Itamarati': { cep: '69814', slam: 'RRT9', seq: '57', rota: '10' }
};

// Cadastro estático de embarcações para consulta direta
const EMBS = {
    "LEAO DE JUDA": { TP: "BALSA", DP: [3], TT: "4 dias" }, // Quarta-feira
    "PROFETA DANIEL": { TP: "NAVIO", DP: [5], TT: "3 dias" }, // Sexta-feira
    "PRINCIPE JOSE": { TP: "NAVIO", DP: [4], TT: "3 dias" }, // Quinta-feira
    "RAINHA ESTHER": { TP: "NAVIO", DP: [2], TT: "4 dias" }, // Terça-feira
    "ARTHUR OLIVEIRA": { TP: "BALSA", DP: [5], TT: "2 dias" }, // Sexta-feira
    "LIZ PINHEIRO": { TP: "BALSA", DP: [3], TT: "2 dias" }, // Quarta-feira
    "PODEROSO": { TP: "EMPURRADOR", DP: [1, 2, 5], TT: "3 dias" }, // Seg, Ter, Sex
    "PP 2003": { TP: "BALSA", DP: [4], TT: "2 dias" }, // Quinta-feira
    "AMAZONIA": { TP: "NAVIO", DP: [4], TT: "6 dias" }, // Quinta-feira
    "BANZEIRO": { TP: "NAVIO", DP: [4], TT: "5 dias" }, // Quinta-feira
    "EMBAIXADOR": { TP: "NAVIO", DP: [4], TT: "6 dias" }, // Quinta-feira
    "VITORIA REGIA": { TP: "NAVIO", DP: [2], TT: "5 dias" }, // Terça-feira
    "6 DE JULHO": { TP: "BALSA", DP: [2, 5], TT: "2 dias" }, // Ter, Sex
    "PIMENTEL FILHO": { TP: "NAVIO", DP: [3], TT: "2 dias" }, // Quarta-feira
    "COMANDANTE NATAL": { TP: "NAVIO", DP: [5, 6], TT: "3 dias" }, // Sex, Sab
    "VENCEDOR": { TP: "NAVIO", DP: [2], TT: "4 dias" }, // Terça-feira
    "ALMIR ARAUJO": { TP: "NAVIO", DP: [3], TT: "3 dias" }, // Quarta-feira
    "MARIA CARDOSO": { TP: "NAVIO", DP: [2], TT: "3 dias" }, // Terça-feira
    "PP MAUES II": { TP: "BALSA", DP: [6], TT: "3 dias" }, // Sábado
    "CARLOS ALBERTO": { TP: "NAVIO", DP: [4], TT: "2 dias" }, // Quinta-feira
    "NOVA CONQUISTA": { TP: "NAVIO", DP: [6], TT: "2 dias" }, // Sábado
    "MANOEL MONTEIRO": { TP: "NAVIO", DP: [6], TT: "4 dias" }, // Sábado
    "FREI GALVAO": { TP: "NAVIO", DP: [2], TT: "3 dias" }, // Terça-feira
    "LUIZ GRACA": { TP: "NAVIO", DP: [3], TT: "3 dias" }, // Quarta-feira
    "RAIMUNDO COIMBRA": { TP: "NAVIO", DP: [1], TT: "4 dias" }, // Segunda-feira
    "RIO MADEIRA": { TP: "NAVIO", DP: [4], TT: "3 dias" }, // Quinta-feira
    "COMANDANTE DAVID": { TP: "NAVIO", DP: [4], TT: "2 dias" }, // Quinta-feira
    "COMANDANTE LUCAS": { TP: "NAVIO", DP: [1], TT: "1 dia" }, // Segunda-feira
    "DONA REGINA": { TP: "NAVIO", DP: [5], TT: "2 dias" }, // Sexta-feira
    "ARAFER": { TP: "BALSA", DP: [0], TT: "12 dias" }, // Domingo
    "VOVO PEDRO": { TP: "NAVIO", DP: [6], TT: "10 dias" }, // Sábado
    "DE MELO V": { TP: "BALSA", DP: [1, 5], TT: "1 dia" }, // Seg, Sex
    "YONE": { TP: "NAVIO", DP: [4], TT: "1 dia" }, // Quinta-feira
    "AMERICA": { TP: "NAVIO", DP: [2], TT: "4 dias" }, // Terça-feira
    "COMANDANTE LOURO": { TP: "NAVIO", DP: [3], TT: "3 dias" }, // Quarta-feira
    "INGRID BEATRIZ": { TP: "NAVIO", DP: [2], TT: "3 dias" }, // Terça-feira
    "LADY LUIZA": { TP: "NAVIO", DP: [5, 6], TT: "8 dias" }, // Sex para SGC, Sab para Jurua
    "BARBOSA V": { TP: "BALSA", DP: [2, 3, 4, 5, 6], TT: "1 dia" },
    "MENEZES": { TP: "NAVIO", DP: [1, 2, 6], TT: "1 dia" },
    "ELIZABETH IV": { TP: "NAVIO", DP: [5], TT: "4 dias" },
    "ITAPURANGA": { TP: "NAVIO", DP: [5, 6], TT: "5 dias" },
    "ESTRELA PP": { TP: "NAVIO", DP: [3], TT: "2 dias" },
    "ESTRELA PP II": { TP: "NAVIO", DP: [4, 6], TT: "2 dias" },
    "ESTRELA PP III": { TP: "NAVIO", DP: [2], TT: "2 dias" },
    "VIP": { TP: "NAVIO", DP: [1], TT: "2 dias" },
    "JOAO FONSECA": { TP: "NAVIO", DP: [1], TT: "2 dias" },
    "SEIS IRMAOS": { TP: "NAVIO", DP: [5], TT: "2 dias" },
    "ANA REBECA III": { TP: "NAVIO", DP: [6], TT: "2 dias" },
    "BM DONA LIKA": { TP: "BALSA", DP: [1], TT: "2 dias" },
    "MS VITORIA": { TP: "NAVIO", DP: [2], TT: "2 dias" },
    "MAJOR CURIO": { TP: "NAVIO", DP: [5], TT: "4 dias" },
    "CORONEL TAVARES": { TP: "NAVIO", DP: [2, 6], TT: "6 dias" },
    "CIDADE DE URUCURITUBA": { TP: "NAVIO", DP: [4], TT: "2 dias" },
    "M GOMES": { TP: "NAVIO", DP: [1, 3], TT: "2 dias" },
    "YASMIN": { TP: "NAVIO", DP: [5], TT: "2 dias" }
};

// Funções auxiliares de busca estática que o app.js usa
function mNameCore(mData) {
    return mData.rota === '10' ? 'JURUA' : mData.cep;
}

function getEmb(core, rota) {
    const list = [];
    // Filtra barcos baseados nas regras das calhas
    for (const [name, data] of Object.entries(EMBS)) {
        if (rota.stops.includes(core) || core === 'JURUA') {
            list.push({ nome: name, data: data });
        }
    }
    return list.slice(0, 5); // Limita a 5 barcos por consulta
}

function getEmbR10(mData) {
    if (mData.seq === '55') return "ARAFER";
    if (mData.seq === '56') return "LADY LUIZA";
    return "VOVO PEDRO";
}

function daysToDepart(targetDays) {
    const today = new Date().getDay(); // 0 = Domingo, 1 = Segunda...
    let minDays = 7;
    targetDays.forEach(d => {
        let diff = d - today;
        if (diff < 0) diff += 7;
        if (diff < minDays) minDays = diff;
    });
    return minDays;
}
