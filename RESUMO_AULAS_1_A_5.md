# RESUMO GERAL DO PROJETO — AULA 01 À AULA 05
## Disciplina: Programação para Dispositivos Móveis
**Instituição:** FANESE – Faculdade de Administração, Negócios e Saúde de Sergipe  
**Professor:** Márcio Rodrigo Carvalho  
**Aluno:** Pedro  
**Projeto:** Sabor & Cia Gourmet — Cardápio Digital Interativo & Painel Administrativo PWA  
**Link da Aplicação no Ar (HTTPS):** [https://pedroj2611.github.io/cardapio-admin/](https://pedroj2611.github.io/cardapio-admin/)  
**Repositório Oficial no GitHub:** [https://github.com/pedroj2611/cardapio-admin](https://github.com/pedroj2611/cardapio-admin)  

---

## Sumário Executivo
Este documento apresenta um resumo consolidado de todo o aprendizado e de todas as implementações realizadas no projeto **Sabor & Cia Gourmet**, correlacionando o conteúdo teórico e prático ensinado em sala de aula pelo Professor Márcio Rodrigo da **Aula 01 até a Aula 05**.

O projeto expandiu a base de uma lista de tarefas convencional para uma **solução empresarial completa de Cardápio Digital e Painel de Monitoramento/Administração**, aplicando a arquitetura **MVC (Model-View-Controller)** pura em JavaScript Vanilla, CSS3 e HTML5, transformando o sistema em uma **Progressive Web App (PWA)** instalável e com funcionamento offline.

---

## 📘 AULA 01: Fundamentos Web, Estrutura Semântica e Mobile-First
### 🎯 O que o professor ensinou:
- Criação de páginas web com **HTML5 Semântico**.
- Importância da meta tag viewport para dispositivos móveis (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`).
- Organização do conteúdo em seções lógicas: `<header>`, `<main>`, `<section>`, `<aside>`.
- Separação entre marcação (HTML) e lógica inicial de apresentação.

### 💻 O que foi implementado no projeto:
1. **Estrutura Base do Cardápio:** Criado o documento `index.html` com layout semântico estruturado para restaurantes (banner da empresa, cabeçalho com dados do estabelecimento, área principal de produtos e comanda lateral).
2. **Componentes Nativos Acessíveis:** Inclusão de elementos nativos do HTML5, como `<dialog>` para caixas de diálogo e modais (checkout, confirmação de exclusão e configurações) e `<details>`/`<summary>` para seções expansíveis (accordions).
3. **Visão Dupla do Sistema:** Divisão do HTML em duas visões principais:
   - `#public-view`: Cardápio digital visualizado pelos clientes.
   - `#admin-dashboard-view`: Painel de monitoramento de pedidos restrito para a gerência.

---

## 🎨 AULA 02: Estilização Moderna, CSS Responsivo e Manipulação de DOM
### 🎯 O que o professor ensinou:
- **CSS Moderno:** Reset universal de CSS (`* { margin: 0; padding: 0; box-sizing: border-box; }`), uso de variáveis CSS (`:root`) e tipografia legível.
- **Layouts Flexíveis:** Alinhamentos com **Flexbox** e grades com **CSS Grid**.
- **Design Responsivo (Mobile-First):** Uso de Media Queries (`@media`) para adaptar o aplicativo a diferentes tamanhos de tela.
- **Dinamismo no JavaScript:** Manipulação de elementos através do DOM com `document.getElementById()`, escuta de eventos com `addEventListener()` e criação de elementos com `document.createElement()`.

### 💻 O que foi implementado no projeto:
1. **Design System Personalizado (`base.css` e `components.css`):**
   - Criação de uma paleta de cores gourmet escura e dourada com variáveis CSS (`--primary-gold`, `--dark`, `--bg-app`, etc.).
   - Grid de produtos adaptável: 3 colunas em telas grandes (Desktop), 2 colunas em tablets e 1 coluna vertical no celular.
2. **Navegação Inteligente por Dispositivo:**
   - **Desktop:** Barra lateral esquerda fixa (`.sidebar-app`) com `position: fixed`, que permanece sempre visível sem rolar junto com o conteúdo da página.
   - **Celular:** Barra de navegação inferior flutuante (`.mobile-bottom-nav`) e dock inferior de finalização de pedido (`.barra-flutuante`).
3. **Renderização Dinâmica do Catálogo:**
   - Criação dinâmica dos cards de lanches, bebidas, porções e sobremesas a partir de uma lista JavaScript, com injeção direta de nome, preço formatado em Real (`R$`), imagem e badges de destaque (*"Mais Pedido"*, *"Chef Special"*).

---

## ⚡ AULA 03: Progressive Web Apps (PWA) e Service Worker com Cache Offline
### 🎯 O que o professor ensinou:
- O que é uma PWA: unir o alcance da web à experiência de um aplicativo nativo.
- Configuração do **Manifesto da Web (`manifest.json`)**:
  - Propriedades `name`, `short_name`, `start_url`, `display: standalone`, `theme_color`, `background_color` e ícones nos tamanhos 192x192px e 512x512px.
- **Service Worker (`sw.js`)**:
  - O que é um worker em segundo plano e seu ciclo de vida.
  - Registro seguro com `navigator.serviceWorker.register("sw.js")`.
  - Evento `install`: abrir cache e salvar arquivos essenciais com `caches.open()` e `cache.addAll()`.
  - Evento `activate`: limpeza de versões legadas de cache usando `caches.keys()` e `caches.delete()`.
  - Evento `fetch`: interceptar requisições com estratégia **Cache First** (`caches.match() || fetch()`).
- Funcionamento e testes em modo offline (modo avião).

### 💻 O que foi implementado no projeto:
1. **Manifesto PWA Completo (`manifest.json`):**
   - Nome configurado para *"Sabor & Arte Gourmet - Cardápio Digital"*, ícone de inicialização, modo `display: "standalone"` para abrir em tela cheia sem barra do navegador e cor de tema que pinta a barra do sistema operacional.
2. **Service Worker com Cache Offline (`sw.js`):**
   - Lista de pré-cache (`ARQUIVOS`) contemplando todos os assets necessários para abrir e usar o app sem internet: HTML, CSS modularizado, scripts MVC, ícones e imagem do QR Code.
   - Estratégia Cache First funcional: o cliente consegue abrir o cardápio e navegar pelos itens mesmo sem conexão de rede.

---

## 💾 AULA 04: Persistência com LocalStorage, Publicação HTTPS e Instalação Real
### 🎯 O que o professor ensinou:
- **Parte 1 (Armazenamento Local):**
  - O que é e para que serve o `localStorage` (~5MB de limite por origem, guarda apenas texto).
  - Os 4 métodos: `setItem`, `getItem`, `removeItem`, `clear`.
  - Conversão de listas/objetos para texto e vice-versa: `JSON.stringify()` e `JSON.parse()`.
  - Tratamento defensivo com `try { ... } catch (erro) { ... }` para evitar falhas em dados corrompidos.
  - Padrão arquitetural *"A lista manda na tela"*: atualizar o estado em memória -> salvar no localStorage -> redesenhar a tela.
- **Parte 2 (Hospedagem & HTTPS):**
  - Por que HTTPS é obrigatório: exigência do navegador para Contexto Seguro em PWAs.
  - Publicação em nuvem (Netlify Drop / GitHub Pages).
  - Instalação no celular via navegador ("Adicionar à tela inicial").
  - Isolamento de dados por origem (o que foi salvo em `localhost` não mistura com o site publicado).
- **Parte 3 Extra (Comprovação & Bônus):**
  - Teste em modo avião (offline) no celular e entrega de relatório por e-mail com prints.

### 💻 O que foi implementado no projeto:
1. **Persistência Completa com Modelos MVC:**
   - [`ProductModel.js`](file:///c:/Fanese/Facudade/src/js/models/ProductModel.js): persiste os produtos sob a chave `"cardapio_gourmet_v2_produtos"`.
   - [`CartModel.js`](file:///c:/Fanese/Facudade/src/js/models/CartModel.js): persiste a comanda do cliente sob a chave `"cardapio_pro_carrinho"`. Se o usuário atualizar a página (F5) ou fechar o app, o pedido continua intacto.
   - [`ConfigModel.js`](file:///c:/Fanese/Facudade/src/js/models/ConfigModel.js): persiste dados do restaurante, chave PIX e WhatsApp sob a chave `"cardapio_pro_config"`.
2. **Publicação com HTTPS no GitHub Pages:**
   - Hospedagem oficial configurada e ativa: [https://pedroj2611.github.io/cardapio-admin/](https://pedroj2611.github.io/cardapio-admin/).
3. **Detector Dinâmico de Rede (Online/Offline):**
   - Ouvintes dos eventos `online` e `offline` no [`AppController.js`](file:///c:/Fanese/Facudade/src/js/controllers/AppController.js). Quando o celular entra em modo avião, a luz no topo muda para laranja com o aviso *"Modo Offline (PWA Ativo)"*, perfeito para a captura do print bônus.
4. **Instalação Integrada (`beforeinstallprompt`):**
   - Botão **`📲 Instalar App`** na barra lateral que aciona o prompt nativo de instalação do sistema.
5. **QR Code Oficial do Projeto:**
   - Imagem `qrcode_projeto.png` gerada e disponibilizada na raiz do projeto para permitir que qualquer pessoa aponte a câmera e abra o app na hora.

---

## 🧩 AULA 05: Tarefas como Objetos, Estado Booleano, Contador, Limpeza e Polimento
### 🎯 O que o professor ensinou:
- **Parte 1 (Objetos com Estado e Ações):**
  - Evolução de listas simples (strings) para **Objetos** (`{ id, texto, feito }`).
  - Alternância de estado booleano usando o operador de negação **`!`** (`tarefa.feito = !tarefa.feito`).
  - Aplicação de classe visual com texto riscado (`.feita { text-decoration: line-through; }`).
  - Remoção de itens por posição usando `Array.prototype.splice(i, 1)`.
- **Parte 2 (Contador, Limpeza em Lote e Estado Vazio):**
  - Contador dinâmico de itens pendentes calculado via laço de repetição (`for`) checando `!item.feito` (*"Faltam X de Y"*).
  - Remoção em lote de itens concluídos através do método funcional `Array.prototype.filter()`.
  - Tratamento de **Estado Vazio (`.vazio`)** quando a lista não possuir itens.
  - Subida de versão do Cache do Service Worker para `v4`.
- **Parte 3 Extra (Testes no Celular e Entrega):**
  - Roteiro de testes: marcar concluído, apagar com lixeira, limpar concluídos, recarregar e conferir no celular.

### 💻 O que foi implementado no projeto:
1. **Comandas e Pedidos como Objetos:**
   - No [`AdminView.js`](file:///c:/Fanese/Facudade/src/js/views/AdminView.js), cada pedido é estruturado como um objeto contendo a propriedade `concluido: boolean`.
2. **Alternância de Conclusão com o Operador `!`:**
   - O botão de ação de cada pedido executa:
     ```javascript
     ped.concluido = !ped.concluido;
     ```
     Invertendo o estado booleano de `false` para `true`. A linha da tabela ganha a classe CSS `tr.pedido-concluido`, ficando com texto riscado e opacidade reduzida para indicar que já foi atendido.
3. **Exclusão Pontual com `splice`:**
   - O botão **`🗑 Apagar`** localiza o índice do pedido e executa `this.pedidos.splice(index, 1)`, removendo o registro da lista e persistindo a alteração no `localStorage`.
4. **Contador de Pedidos Pendentes:**
   - Adicionada a barra superior com `atualizarContador()`, que conta os pedidos com `!ped.concluido` e exibe: *"Faltam X de Y pedidos a atender"*.
5. **Limpar Concluídos com `filter`:**
   - O botão **`🧹 Limpar concluídos`** executa:
     ```javascript
     this.pedidos = this.pedidos.filter(p => !p.concluido);
     ```
     Removendo de uma só vez todos os pedidos finalizados e atualizando o `localStorage`.
6. **Estado Vazio:**
   - Quando não há pedidos na tabela, exibe a mensagem centralizada com a classe `.vazio`: *"Sua lista de pedidos está vazia no momento."*
7. **Cache do Service Worker v4:**
   - Versão do cache no `sw.js` atualizada para **`cardapio-admin-v4`**, garantindo descarte automático de caches antigos no evento `activate`.

---

## 🛠️ Resumo das Melhorias Especiais do Projeto
Além do conteúdo padrão das aulas, as seguintes melhorias foram implementadas para garantir a excelência do trabalho:
1. **Desacoplamento do Modal de Esvaziar Comanda:** Correção de conflito de foco no fechamento do modal `<dialog>`, garantindo que o botão *"Confirmar"* limpe o carrinho instantaneamente sem travar a interface.
2. **Barra Lateral 100% Fixa:** Posicionamento fixo que impede que a navegação do sistema role para baixo junto com a página no desktop.
3. **Painel Admin Protegido por Senha:**
   - Acesso às configurações protegido por senha fixa (`admin`).
   - Remoção do botão de configurações do cabeçalho público.
   - Remoção da comanda falsa do Admin, deixando o painel focado em métricas, monitoramento de pedidos e organização do cardápio.
4. **Migração do Cadastro de Produtos para o Admin:**
   - O formulário *"Cadastrar Novo Produto no Cardápio"* foi transferido do cardápio público para dentro do Painel Admin, garantindo que apenas administradores possam adicionar novos itens.
5. **Automação de Build (`build.js`):**
   - Script Node.js que compila o bundle CSS unificado (`style.css`), sincroniza a pasta `src/` com a pasta `www/` e a raiz do projeto.

---

## 📋 Tabela Resumo das Tecnologias por Aula

| Aula | Tema Central | Conceitos Chave | Onde está no Projeto |
|---|---|---|---|
| **01** | Estrutura Semântica | HTML5 Semântico, tags estruturais, viewport | `src/index.html` (visão pública e admin) |
| **02** | CSS & Responsividade | Flexbox, Grid, Media Queries, manipulação de DOM | `src/css/`, `src/js/views/ProductView.js` |
| **03** | PWA & Offline | `manifest.json`, Service Worker, Cache First | `src/manifest.json`, `src/sw.js` (cache v1 e v2) |
| **04** | LocalStorage & Deploy | `localStorage`, `JSON.stringify`/`parse`, HTTPS, `try/catch` | `src/js/models/`, GitHub Pages, `qrcode_projeto.png` |
| **05** | Objetos & Ações | Objetos com boolean, operador `!`, `splice`, `filter`, contador | `src/js/views/AdminView.js`, `src/sw.js` (cache v4) |

---
*Relatório de resumo consolidado gerado para comprovação das atividades das Aulas 01 a 05 da disciplina de Programação para Dispositivos Móveis — FANESE 2026.*
