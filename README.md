# Minha Discoteca 🎵

O **Minha Discoteca** é uma aplicação web responsiva projetada para colecionadores gerenciarem seus acervos de mídias físicas (vinis, CDs e fitas K7) em uma estante virtual elegante, interativa e luxuosa.

## 🛠️ Tecnologias Utilizadas e Justificativas

* **Framework CSS:** [Bootstrap 5](https://getbootstrap.com/)
  * *Por que escolhemos:* O Bootstrap 5 (Licença MIT) foi escolhido por seu sistema de Grid extremamente maduro e suporte mobile-first. Ele atende perfeitamente ao nosso protótipo fornecendo componentes essenciais prontos (como Cards para a estante de discos e Modals para detalhes). Além disso, possui um ecossistema independente de jQuery, classes utilitárias ricas para ajustes finos de layout, e um repositório no GitHub altamente ativo, garantindo longevidade e segurança ao projeto.
* **API Pública:** [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html)
  * *Por que escolhemos:* Para um sistema de arquivamento de mídia física, a precisão visual é fundamental. A API pública do iTunes permite buscar metadados reais de álbuns (ano, artista, gênero) e, principalmente, URLs de capas de alta resolução de forma gratuita e sem necessidade de autenticação complexa por tokens.
* **Outras Tecnologias:** HTML5, CSS3, Sass, jQuery, JSON Server, Figma e Stitch.AI.

## ✅ Checklist | Indicadores de Desempenho (ID)

### RA1 - Utilizar Frameworks CSS e layouts responsivos
- [ ] **ID 01** - Prototipa interfaces adaptáveis para mobile e desktop (Figma/Stitch).
- [ ] **ID 02** - Implementa layout responsivo com Framework CSS usando Flexbox/Grid.
- [ ] **ID 03** - Implementa layout responsivo com CSS puro.
- [ ] **ID 04** - Utiliza componentes prontos de um Framework CSS e JavaScript.
- [ ] **ID 05** - Cria layout fluido usando unidades relativas (vw, vh, %, em, rem).
- [ ] **ID 06** - Aplica um Design System consistente (cores, tipografia, padrões).
- [ ] **ID 07** - Utiliza Sass (SCSS) aplicando variáveis, mixins e funções.
- [ ] **ID 08** - Aplica tipografia responsiva ou fluida.
- [ ] **ID 09** - Aplica técnicas de responsividade de imagens usando CSS.
- [ ] **ID 10** - Otimiza imagens usando formatos modernos (WebP) e carregamento adaptativo.

### RA2 - Tratamento de formulários e validações
- [ ] **ID 11** - Implementa validação HTML nativa com mensagens customizadas.
- [ ] **ID 12** - Aplica expressões regulares (REGEX) para validações customizadas.
- [ ] **ID 13** - Utiliza elementos de seleção em formulários (checkbox, radio, select).
- [ ] **ID 14** - Implementa leitura e escrita no Web Storage (localStorage/sessionStorage).

### RA3 - Otimização do processo de desenvolvimento web
- [ ] **ID 15** - Configura ambiente com Node.js e NPM.
- [ ] **ID 16** - Utiliza boas práticas de versionamento no Git/GitHub.
- [ ] **ID 17** - Mantém um README.md padronizado, com checklist preenchido.
- [ ] **ID 18** - Organiza arquivos do projeto de forma modular na pasta docs.
- [ ] **ID 19** - Configura linters e formatadores (ESLint, Prettier).

### RA4 - Bibliotecas e componentes JavaScript
- [ ] **ID 20** - Utiliza jQuery para manipulação do DOM e interatividade.
- [ ] **ID 21** - Integra e configura um plugin jQuery relevante.

### RA5 - Requisições assíncronas e APIs
- [ ] **ID 22** - Realiza requisições assíncronas para uma API fake persistindo dados.
- [ ] **ID 23** - Realiza requisições assíncronas para uma API fake exibindo dados.
- [ ] **ID 24** - Realiza requisições assíncronas para APIs públicas reais.

## 📄 Documentação do Projeto
* [Product Requirements Document (PRD)](docs/prd.md)
* [Arquitetura, Modelo de Dados e Design Tokens](docs/architecture.md)

## 🎨 Protótipo Interativo
* [Acessar Protótipo Navegável (Figma / Stitch.AI)](https://stitch.withgoogle.com/projects/6420219798709879911)
