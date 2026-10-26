# Hambúrguer dos Amigos | Cardápio Digital & Gestão PWA (MVC)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

> Sistema de cardápio digital e gestão de pedidos para restaurantes e delivery. Funciona como **Progressive Web App (PWA)** instalável, offline e responsivo, desenvolvido em tecnologias Web nativas (HTML5, CSS3 e JavaScript ES Modules) com **Arquitetura MVC** e ícones vetoriais SVG.

---

## Informações Acadêmicas

- **Instituição:** FANESE · Faculdade de Administração, Negócios e Saúde de Sergipe
- **Disciplina:** Programação para Dispositivos Móveis
- **Professor:** Márcio Rodrigo
- **Alunos:** Pedro Joaquim e Carlos Fonseca
- **Documentação Acadêmica:** [`docs/TRABALHO_ACADEMICO.md`](docs/TRABALHO_ACADEMICO.md) · [`docs/EXPLICACAO.txt`](docs/EXPLICACAO.txt) · [`docs/QuemSomos.txt`](docs/QuemSomos.txt)

---

## Arquitetura e Estrutura de Pastas (MVC Limpa)

O projeto adota o padrão **MVC (Model-View-Controller)** diretamente na raiz (sem duplicações de código ou etapas artificiais de build), separando de forma clara os dados e persistência (`models/`), a renderização de interface (`views/`), o controle de eventos (`controllers/`) e os estilos modulares (`css/`):

```text
cardapio-admin/
├── css/                        # Estilos CSS modularizados
│   ├── base.css                # Variáveis de tema (claro/escuro), reset e tipografia
│   ├── components.css          # Componentes de UI, cards, sidebar, tabelas e ícones SVG (.svg-icon)
│   └── modals.css              # Modais <dialog>, notificações toast e animações
├── icons/                      # Ativos visuais do sistema
│   ├── icon-192.png            # Ícone PWA (192x192)
│   ├── icon-512.png            # Ícone PWA (512x512)
│   ├── logo.png                # Logomarca da hamburgueria
│   ├── fundo-madeira.jpg       # Banner de cabeçalho
│   └── ui/                     # Ícones vetoriais SVG (estilo Lucide/Feather) da interface
├── js/                         # JavaScript modularizado em Arquitetura MVC (ES Modules)
│   ├── models/                 # Camada Model (Dados, Regras de Negócio e LocalStorage)
│   │   ├── ProductModel.js     # Catálogo de produtos, filtros e CRUD
│   │   ├── CartModel.js        # Carrinho de compras e cálculo de subtotais
│   │   ├── ConfigModel.js      # Configurações da loja (WhatsApp, PIX, Taxa de Entrega)
│   │   └── OrderModel.js       # Pedidos, Tarefas PRO, Subtarefas e Backup (.json)
│   ├── views/                  # Camada View (Renderização DOM desacoplada)
│   │   ├── ProductView.js      # Renderização dos cards de produtos e estados vazios
│   │   ├── CartView.js         # Barra flutuante e itens do modal de checkout
│   │   ├── ModalView.js        # Controle de modais e formulários
│   │   ├── ToastView.js        # Toasts e modal de confirmação customizado
│   │   └── AdminView.js        # Dashboard Admin, tabelas, relatórios PDF e subtarefas
│   └── controllers/            # Camada Controller (Orquestração e Eventos)
│       └── AppController.js    # Controlador principal, sessão Admin, PWA (Instalar/Offline) e Nuvem
├── docs/                       # Documentação acadêmica e entregas das aulas
│   ├── TRABALHO_ACADEMICO.md   # Relatório técnico detalhado
│   ├── EXPLICACAO.txt          # Respostas conceituais das aulas de PWA
│   └── QuemSomos.txt           # Identificação da dupla e links publicados
├── index.html                  # Estrutura HTML5 semântica (Cardápio Público + Painel Admin)
├── sw.js                       # Service Worker (Cache Offline + Estratégia Network First)
├── manifest.json               # Manifesto Web App para instalação Mobile e Desktop
├── server.js                   # Servidor HTTP local opcional (porta 8080)
├── package.json                # Metadados e script de inicialização local
└── README.md                   # Documentação principal do repositório
```

---

## Funcionalidades Principais (Aulas 01 a 09)

- **Catálogo com Categorias & Busca Instantânea:** Navegação fluida entre abas (*Lanches, Porções, Bebidas, Sobremesas*) com pesquisa em tempo real.
- **Carrinho Interativo & Checkout WhatsApp:** Controle de quantidades (`+` / `-`), cálculo automático em Reais (`R$`) e envio estruturado do pedido via WhatsApp.
- **Painel Admin & Tarefas PRO (Aula 08):** Monitoramento de pedidos com **Subtarefas** (checklist de preparo), filtros por prioridade/categoria/status, **Relatório em PDF** e **Backup Offline Completo (`.json`)** para exportar e importar dados.
- **PWA Instalável & Detector Online/Offline (Aula 09):** Botão nativo de instalação (`beforeinstallprompt`), instrução automática para iOS e faixa de aviso em tempo real quando a conexão cai ou retorna (`navigator.onLine`).
- **Interface Vetorial & Tema Claro/Escuro (Aula 07):** Ícones 100% em SVG organizados em `icons/ui/` e alternância de tema persistida no `localStorage`.

---

## Como Executar o Projeto

### Opção 1: VS Code Live Server (Recomendado)
Basta abrir a pasta do projeto no **VS Code**, clicar com o botão direito no arquivo `index.html` e selecionar **"Open with Live Server"**. Qualquer edição nos arquivos `css/` ou `js/` reflete imediatamente no navegador.

### Opção 2: Servidor Node.js Local
```bash
npm start
```
Acesse no navegador: `http://localhost:8080`

---

## Licença e Uso

Projeto desenvolvido para fins acadêmicos na disciplina de Programação para Dispositivos Móveis (FANESE).
