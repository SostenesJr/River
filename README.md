# 🛶 River

> Logistics operations dashboard for river freight in the Amazon region of Brazil.

![River OPS](https://img.shields.io/badge/status-active-brightgreen)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 📌 About

**River** is a web-based operations tool built for managing river freight dispatches across **57 municipalities in Amazonas state, Brazil** — one of the most challenging logistics environments in the world.

Packages are sorted and dispatched via river vessels navigating the Amazon, Solimões, Negro, Madeira, Purus, and Juruá rivers. This dashboard was built to support the daily triage workflow of **Fácil Express**, a logistics company based in Manaus.

---

## ✨ Features

### ⚡ Triage (Triagem)
- Scan or type Amazon node codes (e.g. `RAL9`, `RTE9`) to instantly identify destination
- Displays: Transit Time, distance from Manaus, next vessel departure, and route navigation
- Auto-clear after 15 seconds — optimized for high-speed sorting environments
- Recent scans history with quick-access chips

### 📋 Routes (Rotas)
- Full list of all 10 river routes (A through J) with all municipalities
- Each entry shows: node code, transit time, distance, next vessel, and calha navigation
- Detail modal on click with previous/next municipality navigation
- Search filter by municipality name or node code

### 🗺️ Map (Mapa)
- Interactive SVG map of Amazonas state with real river geometry
- Nodes labeled A1–J11 by route and position
- Filter by route (A–J) — isolates one calha, fades the rest
- Click any node to see a popup with TT, distance, and route info
- Drag to pan, pinch to zoom on mobile

### 🚢 Dispatch (Portos)
- Manage daily dispatch manifests across 3 terminals:
  - Porto Escadaria
  - Porto Roadway
  - Rodoviário
- Add or remove municipalities per terminal
- Collapsible lists per terminal
- Export as image for WhatsApp sharing
- Copy formatted text for WhatsApp
---
## 🗺️ Coverage
10 river routes covering 57 municipalities:
| Route | Name | Direction |
|-------|------|-----------|
| A | Baixo Amazonas | Manaus → East |
| B | Metro Fluvial | Manaus → Surroundings |
| C | Rio Madeira | Manaus → South |
| D | Médio Solimões | Manaus → West |
| E | Alto Solimões | Western border |
| F | Rio Negro | Manaus → Northwest |
| G | Rio Purus | Manaus → Southwest |
| H | Rodoviário | State road network |
| I | Sul do Amazonas | BR-319 / BR-230 |
| J | Rio Juruá | Upper Juruá |
---
## 🛠️ Tech Stack

- **Vanilla JavaScript** — no frameworks, no dependencies
- **SVG** — custom interactive map with real Mercator projection
- **HTML5 + CSS3** — fully responsive, mobile-first
- **html2canvas** — dispatch image export for WhatsApp
- Pure client-side — no backend, no database
---
## 📱 Mobile First
River was designed to run on smartphones used by warehouse sorters during triage operations. Every interaction — scanning barcodes, checking routes, managing dispatch manifests — is optimized for one-handed mobile use.
---
## 🚀 Getting Started
No installation required. Just open `index.html` in any modern browser.

```bash
git clone https://github.com/your-username/river.git
cd river
open index.html
```
Or serve locally:
```bash
npx serve .
```
---

## 📂 Project Structure
river/
├── index.html          # Main application shell

├── css/

│   └── style.css       # Dark theme, responsive layout

└── js/

├── data.js         # Routes, municipalities, vessels, coordinates

└── app.js          # All application logic
---
## 🌊 Context
The Amazon river system is one of the most complex logistics environments on Earth. There are no roads connecting most municipalities — the only access is by river, with transit times ranging from 6 hours to 15 days depending on the destination.
**River** was built to solve a real operational problem: sorting hundreds of packages daily for dozens of destinations, each with different vessels, departure days, and river terminals — all managed from a smartphone on a warehouse floor in Manaus.
---

## 👤 Author
Built by **[Your Name]** as part of real-world logistics operations at Fácil Express, Manaus, Amazonas, Brazil.
- GitHub: [@your-username](https://github.com/SostenesJr)
- LinkedIn: [your-linkedin](https://www.linkedin.com/in/srcjr/)
---
## 📄 License
MIT License — feel free to adapt for other river logistics operations.
