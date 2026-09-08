# RELATÓRIO ACADÊMICO DE DESENVOLVIMENTO — FANESE
## Disciplina: Programação para Dispositivos Móveis
**Instituição:** FANESE – Faculdade de Administração, Negócios e Saúde de Sergipe  
**Professor:** Márcio Rodrigo Carvalho  
**Projeto:** Sabor & Cia Gourmet — Cardápio Digital Interativo & Painel Administrativo PWA  
**Link da Aplicação Publicada (HTTPS):** [https://pedroj2611.github.io/cardapio-admin/](https://pedroj2611.github.io/cardapio-admin/)  
**Repositório Oficial no GitHub:** [https://github.com/pedroj2611/cardapio-admin](https://github.com/pedroj2611/cardapio-admin)  

---

## 1. Visão Geral do Projeto e Arquitetura

O projeto **Sabor & Cia Gourmet** foi concebido como uma solução empresarial completa para bares e restaurantes, unindo uma **área pública de atendimento ao cliente** (cardápio online interativo com montagem de comanda e finalização direta para o WhatsApp) e um **Painel de Monitoramento & Administração (Admin Dashboard)** restrito por autenticação de segurança.

A estrutura foi modelada seguindo o padrão arquitetural **MVC (Model-View-Controller)** puro, sem dependência de frameworks pesados, garantindo alta velocidade de carregamento, compatibilidade universal e conformidade integral com os critérios modernos de **Progressive Web Apps (PWA)** ensinados em sala de aula.

```
c:\Fanese\Facudade\
├── icons/                      -> Ícones PWA (192px e 512px)
├── src/                        -> Código-fonte modular MVC
│   ├── css/                    -> Folhas de estilo (base.css, components.css, modals.css)
│   ├── js/
│   │   ├── controllers/        -> AppController.js (Eventos, PWA e fluxo geral)
│   │   ├── models/             -> ProductModel.js, CartModel.js, ConfigModel.js (LocalStorage)
│   │   └── views/              -> ProductView.js, CartView.js, ModalView.js, AdminView.js, ToastView.js
│   ├── index.html              -> Estrutura semântica HTML5
│   ├── manifest.json           -> Manifesto PWA
│   └── sw.js                   -> Service Worker com Cache Offline
├── qrcode_projeto.png          -> QR Code para acesso direto no celular
├── build.js                    -> Script Node.js de compilação e sincronização
└── RELATORIO_AULAS_FANESE.md   -> Este relatório
```

---

## 2. Correlação Aula por Aula com o Projeto

### Aulas 01 e 02: Estrutura Semântica, Design Responsivo e Dinamismo com DOM
* **Conceito ensinado:** Estrutura HTML5 moderna, CSS Flexbox/Grid, responsividade Mobile-First e manipulação dinâmica do DOM através de eventos em JavaScript.
* **Aplicação no Projeto:**
  1. **HTML5 Semântico:** Utilização de tags modernas como `<header>`, `<main>`, `<section>`, `<aside>`, `<details>` (accordion para formulários) e `<dialog>` nativo para modais acessíveis com foco protegido.
  2. **Design Responsivo Avançado:** O sistema adapta-se automaticamente entre celular e desktop:
     - No **Desktop**: Barra lateral esquerda de navegação 100% fixa (`position: fixed`), grid de produtos em 3 colunas e painel de monitoramento com tabela gerencial e gráficos de barras.
     - No **Celular**: Ocultamento automático da barra lateral volumosa em favor de uma barra de navegação inferior flutuante (`mobile-bottom-nav`) e barra de fechamento de pedido fixada na parte inferior (dock).
  3. **Manipulação de DOM:** Criação dinâmica de cards de produtos, badges de status, contadores de quantidade e cálculo automático de totais da comanda em tempo real.

---

### Aula 03: Progressive Web Apps (PWA) e Service Worker com Cache Offline
* **Conceito ensinado:** Transformar uma aplicação web em um app instalável no celular/computador com capacidade de funcionamento mesmo sem internet (offline), através do `manifest.json` e `sw.js`.
* **Aplicação no Projeto:**
  1. **Manifesto (`manifest.json`):**
     - Configurado com `display: "standalone"` para abrir em tela cheia sem a barra de endereço do navegador.
     - Ícones nos tamanhos exigidos de **192x192px** e **512x512px** com especificação `purpose: "any maskable"`.
     - Definição de `start_url: "index.html"`, `theme_color` e `background_color` para estilização da splash screen e barra do sistema operacional.
  2. **Service Worker (`sw.js`):**
     - **Registro Seguro:** Inicializado no `index.html` validando se `"serviceWorker" in navigator`.
     - **Ciclo de Instalação (`install`):** Faz o pré-cache dos arquivos fundamentais (`index.html`, CSS, módulos JS MVC, ícones e manifesto) através de `caches.open()` e `cache.addAll()`.
     - **Ciclo de Ativação (`activate`):** Identifica e expurga caches legados usando `caches.keys()` e `caches.delete()`.
     - **Interceptação de Rede (`fetch`):** Estratégia **Cache First** (`caches.match(request) || fetch(request)`), permitindo que o cliente abra e navegue pelo cardápio no celular mesmo com o aparelho em modo avião ou sem sinal de operadora.

---

### Aula 04 — Parte 1: Persistência no Navegador com `localStorage`
* **Conceito ensinado:** Uso da Web Storage API (`localStorage`) para persistir dados no aparelho do usuário (~5MB por origem), utilizando os comandos `setItem`, `getItem`, `removeItem`, `clear`, acompanhados da serialização com `JSON.stringify` e `JSON.parse` protegidos por blocos `try/catch`. Padrão "o estado manda na tela".
* **Aplicação no Projeto:**
  1. **Padrão "O Estado Manda na Tela":** Nenhuma informação visual é manipulada isoladamente no HTML; o estado sempre reside nos Models em memória e é imediatamente refletido na tela após persistir no `localStorage`.
  2. **Modelos Implementados com LocalStorage:**
     - **`ProductModel.js`:** Armazena todo o cardápio sob a chave `"cardapio_gourmet_v2_produtos"`. Novos produtos cadastrados via Admin são salvos imediatamente com `JSON.stringify`, sobrevivendo a recarregamentos de página (F5) e reabertura do navegador.
     - **`CartModel.js`:** Mantém a comanda do cliente sob a chave `"cardapio_pro_carrinho"`. Se o cliente fechar o app no meio do pedido ou atualizar a tela, todos os itens selecionados, quantidades e observações continuam salvos.
     - **`ConfigModel.js`:** Salva as configurações de cobrança sob a chave `"cardapio_pro_config"`, incluindo nome do restaurante, número do WhatsApp para recebimento do pedido, chave PIX e valor da taxa de entrega.
  3. **Blindagem contra Falhas (`try / catch`):** Toda leitura e escrita em `localStorage` é encapsulada em blocos `try { ... } catch (e) { ... }`, garantindo que, caso os dados estejam corrompidos ou o usuário esteja em uma aba que bloqueie armazenamento, o app inicialize com valores padrão sem travar.

---

### Aula 04 — Parte 2: Publicação com HTTPS e Instalação no Celular Real
* **Conceito ensinado:** Hospedagem em servidores com certificado SSL (HTTPS) obrigatório para contextos de Service Worker, instalação nativa ("Adicionar à tela inicial") e entendimento do isolamento de dados por origem.
* **Aplicação no Projeto:**
  1. **Deploy Oficial no GitHub Pages com HTTPS:**
     - URL Oficial: `https://pedroj2611.github.io/cardapio-admin/`
     - O protocolo HTTPS fornece o **Contexto Seguro** indispensável para que o Chrome e Safari reconheçam os critérios de instalação PWA.
  2. **Isolamento por Origem:** Explicado e verificado na prática: os dados salvos em `http://127.0.0.1:5500` pertencem exclusivamente à origem de desenvolvimento local, enquanto o site no ar (`pedroj2611.github.io`) opera com sua gavetinha própria de `localStorage`.
  3. **Versionamento do Cache (`sw.js`):**
     - O cache foi versionado como `cardapio-admin-v3`. Sempre que um arquivo é modificado e a versão é incrementada, o evento `activate` limpa o cache antigo, garantindo que o usuário receba as novidades sem ficar preso a arquivos desatualizados.
  4. **Instalação Integrada via Código (`beforeinstallprompt`):**
     - O aplicativo escuta o evento `beforeinstallprompt` e exibe o botão **"📲 Instalar App"** na barra lateral. Ao clicar, abre o diálogo nativo do sistema operacional para adicionar o ícone à tela inicial do celular.

---

### Aula 04 — Parte 3 (Extra): Monitoramento de Rede e Teste Offline (Bônus)
* **Conceito ensinado:** Prova prática do app funcionando offline (modo avião), instalação e comprovação avaliativa.
* **Aplicação no Projeto:**
  1. **Detector de Rede Dinâmico:** Implementados os eventos `window.addEventListener('online')` e `window.addEventListener('offline')`.
  2. **Feedback Visual Imediato:**
     - Quando conectado: O badge no topo exibe uma luz verde pulsante com o texto `"Aberto para Pedidos"`.
     - Ao ativar o **Modo Avião**: A luz torna-se laranja instantaneamente e o texto muda para `"Modo Offline (PWA Ativo)"`, emitindo um aviso na tela comprovando que o cardápio continua 100% navegável graças ao Service Worker.
  3. **QR Code Integrado:** Gerado e disponibilizado na raiz do projeto (`qrcode_projeto.png`) para permitir que o professor e colegas escaneiem com a câmera e instalem o app instantaneamente.

---

### Aula 05 — Parte 1: Tarefas como Objetos, Marcar Concluída e Apagar
* **Conceito ensinado:** Evolução de listas simples para coleções de **Objetos** (`{ id, ..., feito: boolean }`), alternância de estado booleano com o operador lógico de negação `!` (`tarefa.feito = !tarefa.feito`), exclusão pontual por índice com `splice(i, 1)` e sincronização imediata com `localStorage`.
* **Aplicação no Projeto:**
  1. **Estrutura de Objeto nos Pedidos:** Cada comanda e pedido no Admin passou a ser um objeto com propriedade `concluido: boolean`.
  2. **Operador `!` para Alternar Estado:** Ao clicar no botão *"Marcar Pronto"*, a função executa `ped.concluido = !ped.concluido`. Se estava aberto (`false`), vira concluído (`true`) e vice-versa.
  3. **Feedback Visual de Conclusão:** O CSS aplica a classe `tr.pedido-concluido` com `text-decoration: line-through` e opacidade reduzida, identificando os pedidos que já foram servidos.
  4. **Exclusão com `splice(index, 1)`:** A função `cancelarPedido(id)` localiza a posição do item e o remove com `this.pedidos.splice(index, 1)`, persistindo a nova lista no `localStorage`.

---

### Aula 05 — Parte 2: Contador de Pendentes, Limpar Concluídas e Estado Vazio
* **Conceito ensinado:**
  - Contador de itens pendentes calculado via laço de repetição (`for`) checando `!item.feito` ("Faltam X de Y").
  - Remoção em lote de itens concluídos através do método funcional `Array.filter()`.
  - Tratamento de **Estado Vazio (`.vazio`)** para quando não houver itens na lista.
  - Incremento de versão do Service Worker Cache para `v4`.
* **Aplicação no Projeto:**
  1. **Contador Dinâmico:** Implementada a função `atualizarContador()` que percorre os pedidos e exibe no topo da tabela: `Faltam X de Y pedidos a atender`.
  2. **Limpar Concluídos com `filter`:** Implementado o botão **`🧹 Limpar concluídos`**. Ao clicar, o sistema executa:
     ```javascript
     this.pedidos = this.pedidos.filter(function (p) {
       return !p.concluido;
     });
     ```
     Removendo instantaneamente todos os pedidos que já foram atendidos e reorganizando a tabela.
  3. **Estado Vazio Elegante:** Quando todos os pedidos são finalizados ou limpos, a tabela exibe uma mensagem amigável com a classe `.vazio`: *"Sua lista de pedidos está vazia no momento."*
  4. **Atualização do Cache do Service Worker (v4):** O arquivo `sw.js` foi atualizado para `const CACHE = "cardapio-admin-v4"`, assegurando que o evento `activate` descarte as versões antigas.

---

### Aula 05 — Parte 3 (Extra): Teste no Celular (Android / iOS) e Entrega
* **Conceito ensinado:** Diferença entre "copiar arquivos" e "instalar a PWA através do link publicado com HTTPS". Como instalar no Android (via menu ⋮ ou prompt nativo) e no iOS (via Safari > Compartilhar > Adicionar à Tela de Início). Teste offline e entrega de e-mail.
* **Aplicação no Projeto:**
  - O app é 100% acessível pelo link publicado `https://pedroj2611.github.io/cardapio-admin/` e pode ser adicionado à tela inicial sem passar pela Play Store ou App Store.
  - Funciona perfeitamente em modo avião (offline), preservando os dados cadastrados e as alterações de estado no `localStorage` de cada aparelho.

---

## 3. Resumo das Alterações e Melhorias Específicas do Projeto

1. **Ajuste de Fluxo no Modal de Confirmação:** Refatorado o método `ToastView.solicitarConfirmacao` desacoplando o fechamento do `<dialog>` da execução do callback de limpeza com timeout de 50ms, eliminando qualquer travamento de interface ao esvaziar a comanda.
2. **Barra Lateral 100% Fixa:** Atualizado `.sidebar-app` no CSS com `position: fixed; height: 100vh;` e compensação de `margin-left` no workspace central, impedindo que a barra role junto com o conteúdo da página.
3. **Painel Admin Exclusivo e Protegido:** 
   - Acesso restrito com autenticação por senha (`admin`).
   - Remoção do botão de configurações do cabeçalho público e remoção do resumo de compras da área administrativa.
   - Migração da seção **"Cadastrar Novo Produto no Cardápio"** do cardápio público para dentro do Painel Admin.
4. **Botão de Atalho "Organizar Cardápio":** Ajustado para expandir o accordion de cadastro e rolar suavemente a tela dentro da própria visão administrativa.
5. **Botão de Instalação PWA Inteligente (`beforeinstallprompt`):** Integrado à barra lateral para instalação com 1 toque.
6. **Detector Dinâmico de Rede (Online/Offline):** Altera o badge do topo para laranja com texto explicativo quando o usuário ativa o Modo Avião.
7. **Gestão de Pedidos com Estado Booleano, Contador e Limpar Concluídos (Aula 05):**
   - Pedidos como objetos com `concluido: boolean`.
   - Alternância com operador `!`.
   - Remoção de itens com `splice`.
   - Limpeza em lote com `filter`.
   - Contador de pendentes e mensagem de lista vazia.
8. **Cache PWA v4:** Versionado no `sw.js` com limpeza automática de versões anteriores.

---

## 4. Modelos de E-mail Prontos para Envio ao Professor Márcio

### Modelo 1: Entrega da Aula 04 (Assunto: PWA-Aula-04)
```text
Para: marciocarvalho@prof.fanese.edu.br
Assunto: PWA-Aula-04
Anexos: 
  - print-salvou.png (print mostrando as tarefas/itens persistindo após dar F5)
  - print-instalado.png (print do ícone do app instalado na tela inicial do celular)
  - print-offline.png [BÔNUS] (print do app funcionando com o celular em modo avião)

----------------------------------------------------------------------
Olá, professor Márcio. Segue a entrega da minha PWA da Aula 04.

Nome: Pedro (coloque seu nome completo aqui)
Turma: Programação para Dispositivos Móveis - FANESE

Link publicado: https://pedroj2611.github.io/cardapio-admin/
Repositório GitHub: https://github.com/pedroj2611/cardapio-admin

• O que faz o localStorage (com minhas palavras):
O localStorage funciona como uma "gaveta de memória" permanente dentro do próprio navegador 
do celular ou computador. Ele permite guardar informações em formato de texto (pares chave/valor) 
que continuam salvas mesmo se o usuário recarregar a página (F5), fechar o navegador ou desligar 
o aparelho. No meu projeto, utilizamos o localStorage junto com JSON.stringify e JSON.parse 
para salvar o cardápio de produtos cadastrados, as comandas dos clientes e as configurações 
do restaurante sem precisar de um banco de dados externo.

• Por que HTTPS é necessário:
O HTTPS é a versão segura da internet (com criptografia e certificado SSL). Ele é um requisito 
técnico obrigatório pelos navegadores para que qualquer PWA funcione fora do localhost. Sem HTTPS, 
o navegador bloqueia o registro do Service Worker e não autoriza a instalação do app na tela 
inicial ("Adicionar à tela inicial"), pois exige um "Contexto Seguro" para garantir que os 
arquivos guardados no cache e os dados do usuário não sejam interceptados ou alterados por terceiros.

Seguem em anexo os prints comprovando o salvamento dos dados, a instalação no celular e o 
funcionamento offline em modo avião.
----------------------------------------------------------------------
```

---

### Modelo 2: Entrega da Aula 05 (Assunto: PWA-Aula-05)
```text
Para: marciocarvalho@prof.fanese.edu.br
Assunto: PWA-Aula-05
Anexos: 
  - concluida.png (print de um item/pedido marcado como concluído/riscado)
  - contador.png (print do contador "Faltam X de Y" e do estado vazio)

----------------------------------------------------------------------
Olá, professor Márcio. Segue a entrega da minha PWA da Aula 05.

Nome: Pedro (coloque seu nome completo aqui)
Turma: Programação para Dispositivos Móveis - FANESE

Link publicado: https://pedroj2611.github.io/cardapio-admin/
Repositório GitHub: https://github.com/pedroj2611/cardapio-admin

• O que é um objeto { texto, feito } (com minhas palavras):
Um objeto é uma estrutura em JavaScript que permite agrupar várias informações relacionadas 
em uma única variável, usando o formato { chave: valor }. Antes, tínhamos apenas uma string de 
texto simples; ao transformá-la em objeto { texto: "...", feito: false }, o item passa a 
carregar seu próprio estado (se está concluído ou pendente) junto com o seu nome. No meu projeto, 
cada pedido é um objeto que guarda seus dados e a propriedade "concluido", permitindo que ao 
clicar usemos o operador de negação (!) para marcar/desmarcar e riscar o item visualmente na tela.

• O que faz o "Limpar concluídas":
A função "Limpar concluídas" utiliza o método Array.filter() para filtrar e recriar a lista em 
memória mantendo apenas os itens que NÃO estão concluídos (!item.concluido ou !item.feito). 
Todos os itens que já foram marcados como prontos são descartados de uma só vez, e a nova 
lista filtrada é salva no localStorage e redesenhada na tela, atualizando o contador e exibindo 
o estado vazio caso não reste nenhum pedido pendente.

• Testei no celular?
Sim! Testei no celular através do link publicado com HTTPS (e via QR Code do projeto), adicionei 
à tela inicial como PWA standalone e testei o funcionamento offline em modo avião com cache v4.

Seguem em anexo os prints comprovando a marcação de itens concluídos e o funcionamento do contador.
----------------------------------------------------------------------
```

---
*Relatório acadêmico completo e atualizado em conformidade com as diretrizes das Aulas 01 a 05 de Programação para Dispositivos Móveis — FANESE 2026.*
