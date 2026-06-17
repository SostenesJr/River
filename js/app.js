/* --- RIVER OPS - Core Logic --- */
// Importando ou assumindo que data.js foi carregado antes.

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const app = {
    currentView: 'triagem',
    recentSearches: [],
    currentMunicipio: null,
    zoom: { x: 0, y: 0, scale: 1 },
    drag: { isDragging: false, startX: 0, startY: 0 },
};

function initApp() {
    renderMap();
    initNavEvents();
    initSearchEvents();
    initMapControls();
    loadRecentSearches();
    updateNextDepartures();
}

// --- Navigation & View Manager ---
function initNavEvents() {
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = e.target.id;
            const viewName = tabId.replace('-tab', '');
            switchView(viewName);
        });
    });
}

function switchView(viewName) {
    app.currentView = viewName;
    const views = document.querySelectorAll('main > div');
    views.forEach(v => v.classList.remove('active-view', 'active')); // Reseta
    
    const tabs = document.querySelectorAll('header nav a');
    tabs.forEach(t => t.classList.remove('active'));

    const currentTab = document.getElementById(`${viewName}-tab`);
    const currentViewDiv = document.querySelector(`.${viewName}-dashboard, .${viewName}-container`);

    if (currentTab && currentViewDiv) {
        currentTab.classList.add('active');
        currentViewDiv.classList.add('active-view', 'active'); // Suporte a múltiplas classes de style
    }
    
    // Fecha o sheet mobile ao trocar de view
    closeMobileSheet();

    // Rotinas específicas ao carregar view
    if(viewName === 'guia') { renderGuide(); }
    if(viewName === 'embarcacoes') { renderVessels(); }
}

// --- Search Logic ---
function initSearchEvents() {
    const searchInput = document.getElementById('search-input');
    const dropdown = document.getElementById('search-results-dropdown');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            dropdown.style.display = 'none';
            return;
        }
        performSearch(query);
    });

    searchInput.addEventListener('focus', (e) => {
        if (e.target.value.trim().length >= 2) {
            dropdown.style.display = 'block';
        }
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

function performSearch(query) {
    const q = removeAccents(query.toLowerCase());
    const results = [];

    // Busca por CEP
    if (/^\d{5}/.test(q)) {
        for (const [mName, mData] of Object.entries(MUNIC_DATA)) {
            if (mData.cep.startsWith(q.substring(0, 5))) {
                results.push({ type: 'cep', name: mName, data: mData });
            }
        }
    } 
    // Busca por SLAM ou Nome
    else {
        for (const [mName, mData] of Object.entries(MUNIC_DATA)) {
            const mDataStr = removeAccents((mName + mData.slam).toLowerCase());
            if (mDataStr.includes(q)) {
                results.push({ type: 'm', name: mName, data: mData });
            }
        }
    }
    
    // Ordenação simples (Mãos exatas no topo)
    results.sort((a, b) => a.name.localeCompare(b.name));

    renderDropdown(results);
}

function renderDropdown(results) {
    const dropdown = document.getElementById('search-results-dropdown');
    dropdown.innerHTML = '';
    
    if(results.length === 0) {
        dropdown.innerHTML = '<div class="no-results">Nenhum resultado encontrado.</div>';
        dropdown.style.display = 'block';
        return;
    }

    results.slice(0, 10).forEach(res => {
        const item = document.createElement('div');
        const slamTag = res.data.slam ? ` [${res.data.slam}]` : '';
        item.textContent = `${res.name} (CEP: ${res.data.cep})${slamTag}`;
        item.addEventListener('click', () => {
            selectMunicipio(res.name, res.data);
            dropdown.style.display = 'none';
            document.getElementById('search-input').value = res.name;
        });
        dropdown.appendChild(item);
    });
    
    dropdown.style.display = 'block';
}

function selectMunicipio(mName, mData) {
    app.currentMunicipio = { name: mName, ...mData };
    addToRecentSearches(mName);
    
    const rId = mData.rota;
    const rota = ROUTES.find(r => r.id === rId);
    if (!rota) { console.error('Rota não encontrada:', rId); return; }

    // No desktop, o mapa é o foco principal e mostra o detalhe.
    highlightRouteOnMap(rId, mName);

    // No mobile, abrimos o Sheet
    if (window.innerWidth <= 640) {
        openMobileSheetForMunicipio(mName, mData, rota);
    }
}

// --- Map Rendering & Controls ---
function renderMap() {
    const svg = document.getElementById('msvg');
    svg.innerHTML = ''; // Limpa anterior

    // Contorno AM
    const border = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    border.setAttribute('points', AM_BORDER);
    border.classList.add('border-line');
    svg.appendChild(border);

    // Rios
    for (const [rName, rPath] of Object.entries(RIOS)) {
        const river = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        river.setAttribute('points', rPath);
        river.classList.add('river-line');
        // river.classList.add(`river-${rName}`); // Opcional
        svg.appendChild(river);
    }

    // Pontos (Municípios)
    for (const [mName, mLat] of Object.entries(LATLNG)) {
        const p = mercator(mLat[0], mLat[1]);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', p.x);
        circle.setAttribute('cy', p.y);
        circle.setAttribute('r', 1.5); // Raio menor para não sobrecarregar
        circle.classList.add('municipio-point');
        circle.setAttribute('data-name', mName);
        
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', p.x + 3);
        label.setAttribute('y', p.y + 1);
        label.textContent = mName;
        label.classList.add('point-label');

        svg.appendChild(circle);
        svg.appendChild(label);
        
        // Evento de clique no ponto
        circle.addEventListener('click', (e) => {
            const mName = e.target.getAttribute('data-name');
            const mData = MUNIC_DATA[mName];
            if(mData) {
                selectMunicipio(mName, mData);
            }
        });
    }
}

function initMapControls() {
    const svg = document.getElementById('msvg');
    
    // Zoom com scroll
    svg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY;
        const scaleFactor = delta > 0 ? 0.9 : 1.1;
        app.zoom.scale *= scaleFactor;
        app.zoom.scale = Math.max(0.5, Math.min(10, app.zoom.scale)); // Limites
        applyZoom();
    });

    // Arrasto (Mouse)
    svg.addEventListener('mousedown', (e) => {
        if (e.target.tagName !== 'circle') { // Não arrasta se clicar no ponto
            app.drag.isDragging = true;
            app.drag.startX = e.clientX;
            app.drag.startY = e.clientY;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!app.drag.isDragging) return;
        const dx = e.clientX - app.drag.startX;
        const dy = e.clientY - app.drag.startY;
        app.drag.startX = e.clientX;
        app.drag.startY = e.clientY;
        
        // Compensação do zoom
        app.zoom.x += dx / app.zoom.scale;
        app.zoom.y += dy / app.zoom.scale;
        applyZoom();
    });

    document.addEventListener('mouseup', () => app.drag.isDragging = false);
    
    // Suporte a Toque (Swipe/Pinch - Simplificado para responsividade)
    let initialDist = null;
    let initialScale = 1;

    svg.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) { // Pinch Zoom
            initialDist = getPinchDist(e);
            initialScale = app.zoom.scale;
        } else if (e.touches.length === 1 && e.target.tagName !== 'circle') { // Arrasto Toque
            app.drag.isDragging = true;
            app.drag.startX = e.touches[0].clientX;
            app.drag.startY = e.touches[0].clientY;
        }
    }, { passive: true });

    svg.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) { // Pinch Zoom
            const dist = getPinchDist(e);
            const scale = initialScale * (dist / initialDist);
            app.zoom.scale = Math.max(0.5, Math.min(10, scale));
            applyZoom();
        } else if (app.drag.isDragging && e.touches.length === 1) { // Arrasto Toque
            const dx = e.touches[0].clientX - app.drag.startX;
            const dy = e.touches[0].clientY - app.drag.startY;
            app.drag.startX = e.touches[0].clientX;
            app.drag.startY = e.touches[0].clientY;
            app.zoom.x += dx / app.zoom.scale;
            app.zoom.y += dy / app.zoom.scale;
            applyZoom();
        }
    }, { passive: true });

    svg.addEventListener('touchend', () => {
        app.drag.isDragging = false;
        initialDist = null;
    });
}

function getPinchDist(e) {
    return Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
}

function applyZoom() {
    const svg = document.getElementById('msvg');
    // Aplica o viewBox transformado
    // O viewBox base é 0 0 900 600
    const w = 900 / app.zoom.scale;
    const h = 600 / app.zoom.scale;
    
    // Centraliza o zoom
    const viewBoxStr = `${-app.zoom.x} ${-app.zoom.y} ${w} ${h}`;
    svg.setAttribute('viewBox', viewBoxStr);
}

function highlightRouteOnMap(rId, activeMName) {
    const points = document.querySelectorAll('.municipio-point');
    points.forEach(p => p.classList.remove('active-route', 'active-m'));
    
    // Destaca os pontos da rota
    ROUTES.find(r => r.id === rId).stops.forEach(s => {
        const point = document.querySelector(`.municipio-point[data-name="${s}"]`);
        if(point) {
            point.classList.add('active-route');
        }
    });

    // Destaca o município ativo
    const activePoint = document.querySelector(`.municipio-point[data-name="${activeMName}"]`);
    if(activePoint) { activePoint.classList.add('active-m'); }
}

// --- Mobile Sheet Manager ---
function openMobileSheetForMunicipio(mName, mData, rota) {
    const sheet = document.getElementById('sh');
    const content = sheet.querySelector('.sh-content');
    content.innerHTML = ''; // Limpa anterior

    // Constrói o HTML para o mobile
    let calha = rota.calhas.join(', ');
    const embarcacoes = buildEmbarcacoesMobileHTML(mData, rota);

    content.innerHTML = `
        <div class="m-sheet-header">
            <h4>${mName} (CEP: ${mData.cep})</h4>
            <span class="m-sheet-slam">${mData.slam || '--'}</span>
        </div>
        <div class="m-sheet-route">
            <span class="m-sheet-route-id">${rota.id}</span>
            <span class="m-sheet-calha">${calha}</span>
        </div>
        <div class="m-sheet-emb">
            <h5>Embarcações Disponíveis</h5>
            ${embarcacoes}
        </div>
        <div class="m-sheet-details">
            <p><strong>Carga:</strong> Gaiola #${mData.seq.padStart(2, '0')}</p>
        </div>
    `;

    // Fecha o sheet se clicar no handle (barrinha de fechar)
    const handle = sheet.querySelector('.sh-handle');
    handle.onclick = () => closeMobileSheet();

    sheet.classList.add('open');
}

function buildEmbarcacoesMobileHTML(mData, rota) {
    if(rota.id === '10 (RIO JURUÁ)') { // Rota 10 (especial)
        const embName = getEmbR10(mData);
        const emb = EMBS[embName];
        if(!emb) return '<p class="emb-vazio">Embarcação não encontrada.</p>';
        return renderVesselCard(embName, emb);
    }

    const vessels = getEmb(mNameCore(mData), rota);
    if(vessels.length === 0) return '<p class="emb-vazio">Nenhuma embarcação cadastrada.</p>';

    let html = '';
    vessels.forEach(v => {
        html += renderVesselCard(v.nome, v.data);
    });
    return html;
}

function renderVesselCard(nome, data) {
    const days = daysToDepart(data.DP);
    let tag = '';
    let cls = '';
    if (days === 0) { tag = "HOJE"; cls = "h"; }
    else if (days === 1) { tag = "AMANHÃ"; cls = "a"; }
    else if (days >= 0) { tag = `em ${days}d`; }

    const tagHTML = tag ? `<span class="vessel-tag ${cls}">${tag}</span>` : '';

    return `
        <div class="vessel-card">
            <span class="vessel-type">${data.TP}</span>
            <span class="vessel-name">${nome}</span>
            <span class="vessel-time">Transit Time: ${data.TT}</span>
            ${tagHTML}
        </div>
    `;
}

function closeMobileSheet() {
    document.getElementById('sh').classList.remove('open');
}

// --- Guia de Impressão (Responsivo no desktop) ---
function renderGuide() {
    const content = document.getElementById('guide-content');
    content.innerHTML = ''; // Limpa

    ROUTES.forEach(r => {
        const section = document.createElement('section');
        section.classList.add('guide-section');
        section.innerHTML = `
            <h4>Rota ${r.id} (${r.calhas.join(', ')})</h4>
            <table>
                <thead><tr><th>SEQ</th><th>MUNICÍPIO</th><th>CEP</th><th>SLAM</th></tr></thead>
                <tbody>
                    ${r.stops.map(s => {
                        const mData = MUNIC_DATA[s];
                        return `<tr><td>${mData.seq.padStart(2,'0')}</td><td>${s}</td><td>${mData.cep}</td><td>${mData.slam || '--'}</td></tr>`;
                    }).join('')}
                </tbody>
            </table>
        `;
        content.appendChild(section);
    });
}

// --- Embarcações Cadastradas (Responsivo no desktop) ---
function renderVessels() {
    const list = document.getElementById('vessels-list');
    list.innerHTML = ''; // Limpa

    for (const [nome, data] of Object.entries(EMBS)) {
        list.innerHTML += renderVesselCard(nome, data);
    }
}

// --- Utils & Buscas Recentes ---
function loadRecentSearches() {
    const stored = localStorage.getItem('riveropsRecents');
    if(stored) { app.recentSearches = JSON.parse(stored); }
    renderRecentSearches();
}

function addToRecentSearches(mName) {
    if(app.recentSearches.includes(mName)) { // Traz pro topo se já existe
        app.recentSearches = app.recentSearches.filter(s => s !== mName);
    }
    app.recentSearches.unshift(mName); // Adiciona no início
    app.recentSearches = app.recentSearches.slice(0, 10); // Limita a 10
    localStorage.setItem('riveropsRecents', JSON.stringify(app.recentSearches));
    renderRecentSearches();
}

function renderRecentSearches() {
    const list = document.getElementById('recent-searches-list');
    if(!list) return;
    list.innerHTML = '';
    app.recentSearches.forEach(mName => {
        const item = document.createElement('li');
        item.textContent = mName;
        item.addEventListener('click', () => {
            const mData = MUNIC_DATA[mName];
            if(mData) selectMunicipio(mName, mData);
        });
        list.appendChild(item);
    });
}

function updateNextDepartures() {
    // Implementar lógica similar à renderDropdown/renderVessels para o painel da direita no desktop
}

// Projeção Mercator Simples (coordenadas AM_BORDER para pixels 900x600)
function mercator(lat, lon) {
    // Projeção AM_BORDER original é [450x600], projetando para 900x600
    const x = ((lon - (-73.9872)) / ((-51.378) - (-73.9872))) * 900;
    const y = ((lat - (2.2599)) / ((-9.8228) - (2.2599))) * 600;
    return { x: x, y: y };
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
