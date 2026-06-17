# RIVER OPS · Triagem (Manaus)

O **RIVER OPS · Triagem** é uma aplicação web estática de alta performance desenvolvida especificamente para a triagem de pacotes na malha de distribuição fluvial e rodoviária do estado do Amazonas. 

A ferramenta converte instantaneamente dados postais (CEP) ou siglas operacionais de logística (SLAM) em rotas físicas de separação (calhas) e sequências exatas de carregamento para o galpão de expedição em Manaus.

## 🚀 Funcionalidades Principais

- ⚡ **Latência Zero:** Funciona 100% no lado do cliente (Client-side). Sem banco de dados, sem requisições de rede pesadas e sem travamentos.
- 🗺️ **Mapa SVG Interativo:** Renderização matemática do contorno geográfico do Amazonas e dos seus principais rios (Solimões, Negro, Madeira, Purus e Juruá) com suporte a zoom e arrasto.
- 📱 **Interface 100% Responsiva:** Otimizado com CSS Flexbox/Grid para funcionar perfeitamente em computadores desktop no galpão ou em smartphones/coletores de dados na beira do rio.
- 🔍 **Fuzzy Matching & Anti-Erro:** Algoritmo inteligente que resolve colisões de CEPs de prefixos semelhantes e valida siglas SLAM de forma precisa.
- 🖨️ **Guia Prontos para Impressão:** Aba dedicada para gerar folhas de triagem limpas (via `@media print`), ideais para serem coladas em gaiolas, pallets ou paredes do galpão.

## 📁 Estrutura do Repositório

Para garantir que o deploy em plataformas como o **Vercel** ou **GitHub Pages** funcione de forma automatizada, mantenha a seguinte estrutura na raiz do projeto:

```text
├── index.html        # Estrutura principal e casca do app
├── README.md         # Documentação do projeto
├── css/
│   └── style.css     # Design, Dark Mode e regras de responsividade
└── js/
    ├── data.js       # BANCO DE DADOS (Rotas, CEPs, Coordenadas e Embarcações)
    └── app.js        # Lógica de negócios, buscas e desenho do mapa