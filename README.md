# 🍔 Sabor & Arte Gourmet | Cardápio Digital PWA

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

> Sistema de cardápio digital profissional interativo para restaurantes e delivery. Funciona como **Progressive Web App (PWA)** offline e responsivo, desenvolvido 100% em tecnologias Web (HTML5, CSS3 e JavaScript Moderno com arquitetura MVC).

---

## 🎓 Informações Acadêmicas

- **Instituição:** FANESE · Faculdade de Administração, Negócios e Saúde de Sergipe
- **Disciplina:** Programação para Dispositivos Móveis
- **Professor:** Márcio Rodrigo
- **Aluno:** Pedro Joaquim
- **Relatório Acadêmico:** [`docs/TRABALHO_ACADEMICO.md`](docs/TRABALHO_ACADEMICO.md)

---

## 📁 Arquitetura e Estrutura de Pastas (MVC)

```text
cardapio-admin/
├── 📁 src/                      # Código fonte da aplicação Web
│   ├── 📁 css/                  # Módulos CSS (base, components, modals)
│   ├── 📁 icons/                # Ícones PWA e imagens do cardápio
│   ├── 📁 js/                   # JavaScript em Arquitetura MVC
│   │   ├── 📁 controllers/      # AppController (regras de negócio e sessão)
│   │   ├── 📁 models/           # Models (CartModel, ProductModel, ConfigModel)
│   │   └── 📁 views/            # Views (ProductView, CartView, AdminView, ToastView)
│   ├── 📄 index.html            # Estrutura HTML5 semântica e acessível
│   ├── 📄 style.css             # Folha de estilo unificada
│   ├── 📄 sw.js                 # Service Worker (Estratégias de Cache PWA)
│   └── 📄 manifest.json         # Manifesto PWA para instalação no celular
├── 📁 docs/                     # Documentação acadêmica e relatórios
├── 📁 www/                      # Bundle de distribuição Web
├── 📄 build.js                  # Script de build e sincronização
├── 📄 package.json              # Configuração do projeto
├── 📄 .gitignore                # Arquivos ignorados pelo Git
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
