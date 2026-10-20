# 🍔 Hambúrguer dos Amigos | Cardápio Digital & Gestão PWA (MVC)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

> Sistema de cardápio digital e gestão de pedidos para restaurantes e delivery. Funciona como **Progressive Web App (PWA)** offline e responsivo, desenvolvido 100% em tecnologias Web (HTML5, CSS3 e JavaScript ES Modules com **Arquitetura MVC**).

---

## 🎓 Informações Acadêmicas

- **Instituição:** FANESE · Faculdade de Administração, Negócios e Saúde de Sergipe
- **Disciplina:** Programação para Dispositivos Móveis
- **Professor:** Márcio Rodrigo
- **Alunos:** Pedro Joaquim e Carlos Fonseca
- **Relatório Acadêmico:** [`docs/TRABALHO_ACADEMICO.md`](docs/TRABALHO_ACADEMICO.md)

---

## 📁 Arquitetura e Estrutura de Pastas (MVC)

O projeto adota o padrão **MVC (Model-View-Controller)**, separando claramente os dados e persistência (`models/`), a renderização de interface (`views/`) e o controle de eventos/regras de negócio (`controllers/`):

```text
cardapio-admin/
├── 📁 src/                      # Código-fonte principal (Single Source of Truth)
│   ├── 📁 css/                  # Módulos CSS (base.css, components.css, modals.css)
│   ├── 📁 icons/                # Ícones PWA, logo e imagens do cardápio
│   ├── 📁 js/                   # JavaScript modularizado em Arquitetura MVC
│   │   ├── 📁 models/           # Camada Model (Dados, Estado e LocalStorage)
│   │   │   ├── 📄 ProductModel.js   # Catálogo de produtos, filtros e CRUD
│   │   │   ├── 📄 CartModel.js      # Carrinho de compras e cálculo de totais
│   │   │   ├── 📄 ConfigModel.js    # Configurações da loja (WhatsApp, PIX, Taxa)
│   │   │   └── 📄 OrderModel.js     # Pedidos, Tarefas PRO, Subtarefas e Backup (.json)
│   │   ├── 📁 views/            # Camada View (Renderização DOM desacoplada)
│   │   │   ├── 📄 ProductView.js    # Cards de produtos e estados vazios
│   │   │   ├── 📄 CartView.js       # Barra flutuante e itens do modal de checkout
│   │   │   ├── 📄 ModalView.js      # Controle de modais e formulários
│   │   │   ├── 📄 ToastView.js      # Toasts e modal de confirmação customizado
│   │   │   └── 📄 AdminView.js      # Dashboard Admin, tabelas e lista de subtarefas
│   │   └── 📁 controllers/      # Camada Controller (Orquestração e Eventos)
│   │       └── 📄 AppController.js  # Controlador principal, sessão Admin, PWA e Nuvem
│   ├── 📄 index.html            # Estrutura HTML5 semântica (Sidebar Retrátil + Abas)
│   ├── 📄 app.js                # Script consolidado de compatibilidade das aulas
│   ├── 📄 style.css             # Bundle CSS unificado gerado pelo build
│   ├── 📄 sw.js                 # Service Worker (Cache v7 + Network First)
│   └── 📄 manifest.json         # Manifesto PWA para instalação Mobile/Desktop
├── 📁 css/ · 📁 js/ · 📁 icons/ # Espelho sincronizado na raiz para GitHub Pages
├── 📁 docs/                     # Documentação acadêmica e relatórios
├── 📄 build.js                  # Script automatizado de build e sincronização MVC
├── 📄 server.js                 # Servidor HTTP local para testes (porta 8080)
├── 📄 package.json              # Scripts e configuração do projeto
└── 📄 README.md                 # Documentação principal
```

---

## ✨ Funcionalidades Principais

- 🔍 **Catálogo com Categorias & Busca Instantânea**: Navegação entre abas (*Lanches, Porções, Bebidas, Sobremesas*) com filtro por nome e ingredientes.
- 🛒 **Carrinho Interativo & Stepper**: Controle rápido de quantidade (`+` / `-`) e remoção de itens.
- 💾 **Persistência de Dados**: Gestão de estado salva no `LocalStorage` para manter dados do usuário.
- 📲 **Checkout Estruturado para WhatsApp**: Formulário com validação de dados (*Consumo no Local, Delivery, Balcão*, *Mesa*, *Forma de Pagamento*) e geração de comprovante direto no WhatsApp.
- 📶 **Suporte Offline (PWA)**: Carregamento instantâneo via Service Worker com estratégia *Network First* para navegação.
- 📱 **Otimização Nativa**: Compatível com entalhes de tela (*notch*) e gestos em smartphones Android e iOS.

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
Ter o **Node.js** (v18+) instalado no computador.

### 2. Instalação de Dependências
```bash
npm install
```

### 3. Rodar em Ambiente de Desenvolvimento Web
Abra o arquivo `src/index.html` com a extensão **Live Server** no VS Code ou acesse via navegador.

### 4. Executar o Build do Aplicativo
```bash
npm run build
```
*(Esse comando compila os arquivos de `src/` para a pasta `www/` e sincroniza a raiz).*

---

## 📱 Instalação e Execução Mobile (PWA)

O aplicativo foi desenvolvido como **Progressive Web App (PWA)**, dispensando código nativo ou compilação complexa:

1. **Acesso Online**: Acesse o link do projeto pelo navegador do smartphone:  
   👉 [https://pedroj2611.github.io/cardapio-admin/](https://pedroj2611.github.io/cardapio-admin/)
2. **Instalação na Tela Inicial**: Clique em **"Instalar App"** no banner da página ou no menu do navegador (três pontos > *"Adicionar à tela inicial"* / *"Instalar aplicativo"*).
3. **Modo Offline**: Uma vez instalado, o Service Worker garante o funcionamento integral do cardápio mesmo sem internet (Modo Avião).

---

## 📄 Licença e Uso

Projeto desenvolvido para fins acadêmicos na disciplina de Programação para Dispositivos Móveis (FANESE).
