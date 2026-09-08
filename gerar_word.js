const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} = require("docx");

async function gerarDocumentoWord() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22, // 11pt
            color: "2C3E50"
          },
          paragraph: {
            spacing: { line: 276, before: 120, after: 120 }
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch (2.54cm)
              bottom: 1440,
              left: 1440,
              right: 1440
            }
          }
        },
        children: [
          // CABEÇALHO INSTITUCIONAL
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "FANESE – FACULDADE DE ADMINISTRAÇÃO, NEGÓCIOS E SAÚDE DE SERGIPE",
                bold: true,
                size: 24, // 12pt
                color: "003F43"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "DISCIPLINA: PROGRAMAÇÃO PARA DISPOSITIVOS MÓVEIS",
                bold: true,
                size: 22,
                color: "1C96A0"
              })
            ]
          }),

          // TÍTULO DO PROJETO
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.TITLE,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: "RESUMO CONSOLIDADO DO PROJETO: AULA 01 À AULA 05",
                bold: true,
                size: 32, // 16pt
                color: "06282B"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: "Projeto Sabor & Cia Gourmet — Cardápio Digital PWA & Painel Administrativo",
                italics: true,
                size: 24,
                color: "555555"
              })
            ]
          }),

          // DADOS DO ALUNO E PROFESSOR
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F1F7F7", type: ShadingType.CLEAR },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Professor: ", bold: true }),
                          new TextRun("Márcio Rodrigo Carvalho\n"),
                          new TextRun({ text: "Aluno: ", bold: true }),
                          new TextRun("Pedro\n"),
                          new TextRun({ text: "Aplicação no Ar: ", bold: true }),
                          new TextRun("https://pedroj2611.github.io/cardapio-admin/\n"),
                          new TextRun({ text: "Repositório GitHub: ", bold: true }),
                          new TextRun("https://github.com/pedroj2611/cardapio-admin")
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 300, after: 150 }, children: [] }),

          // SUMÁRIO EXECUTIVO
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({ text: "1. Sumário Executivo", bold: true, size: 28, color: "003F43" })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Este documento apresenta um resumo consolidado de todo o aprendizado e de todas as implementações realizadas no projeto Sabor & Cia Gourmet, correlacionando o conteúdo teórico e prático ensinado em sala de aula pelo Professor Márcio Rodrigo da Aula 01 até a Aula 05."
              )
            ]
          }),
          new Paragraph({
            children: [
              new TextRun(
                "O projeto expandiu a base de uma lista de tarefas convencional para uma solução empresarial completa de Cardápio Digital e Painel de Monitoramento/Administração, aplicando a arquitetura MVC (Model-View-Controller) pura em JavaScript Vanilla, CSS3 e HTML5, transformando o sistema em uma Progressive Web App (PWA) instalável e com funcionamento offline."
              )
            ]
          }),

          // AULA 01
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({ text: "2. Aula 01: Fundamentos Web, Estrutura Semântica e Mobile-First", bold: true, size: 26, color: "003F43" })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que o professor ensinou: ", bold: true }),
              new TextRun("Criação de páginas web estruturadas com HTML5 Semântico, importância da meta tag viewport para dispositivos móveis, organização em seções lógicas (<header>, <main>, <section>, <aside>) e separação entre conteúdo e apresentação.")
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que foi implementado no projeto:\n", bold: true }),
              new TextRun("  1. Estrutura semântica completa em index.html com banner empresarial, cabeçalho institucional, área de catálogo e barra lateral de comanda.\n"),
              new TextRun("  2. Emprego de tags modernas e acessíveis do HTML5, como <dialog> para modais com foco protegido e <details>/<summary> para accordions de formulários.\n"),
              new TextRun("  3. Divisão do sistema em duas visões principais: #public-view (Cardápio para clientes) e #admin-dashboard-view (Painel para administradores).")
            ]
          }),

          // AULA 02
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({ text: "3. Aula 02: Estilização Moderna, CSS Responsivo e Manipulação de DOM", bold: true, size: 26, color: "003F43" })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que o professor ensinou: ", bold: true }),
              new TextRun("Reset universal de CSS (* { box-sizing: border-box }), variáveis CSS (:root), layouts flexíveis com Flexbox e Grid, responsividade com Media Queries (@media) e dinamismo com JavaScript manipulando o DOM (getElementById, addEventListener, createElement).")
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que foi implementado no projeto:\n", bold: true }),
              new TextRun("  1. Design system completo em base.css e components.css com paleta escura gourmet e dourada baseada em variáveis CSS.\n"),
              new TextRun("  2. Grid de produtos responsivo: 3 colunas no desktop, 2 colunas em tablets e 1 coluna em smartphones.\n"),
              new TextRun("  3. Navegação inteligente: barra lateral 100% fixa (position: fixed) no desktop que nunca rola com a página, e barra de navegação inferior flutuante no celular.\n"),
              new TextRun("  4. Renderização dinâmica do catálogo via JavaScript (ProductView.js), injetando fotos, descrições, preços em Real e badges de destaque.")
            ]
          }),

          // AULA 03
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({ text: "4. Aula 03: Progressive Web Apps (PWA) e Service Worker com Cache Offline", bold: true, size: 26, color: "003F43" })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que o professor ensinou: ", bold: true }),
              new TextRun("Conceito de PWA, configuração do arquivo manifest.json (ícones 192px e 512px, display standalone, cores de tema), registro de Service Worker (sw.js), ciclo de vida (install com cache.addAll, activate com caches.delete de versões antigas e fetch com estratégia Cache First) e funcionamento offline em modo avião.")
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que foi implementado no projeto:\n", bold: true }),
              new TextRun("  1. Manifesto PWA oficial (manifest.json) com modo standalone para abrir em tela cheia como aplicativo nativo sem a barra do navegador.\n"),
              new TextRun("  2. Service Worker (sw.js) com lista de pré-cache de todos os arquivos do sistema (HTML, CSS, JS modular, ícones e QR Code).\n"),
              new TextRun("  3. Estratégia Cache First validada: a aplicação abre e funciona com navegação completa mesmo com o celular em Modo Avião ou sem internet.")
            ]
          }),

          // AULA 04
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({ text: "5. Aula 04: Persistência com LocalStorage, Publicação HTTPS e Instalação Real", bold: true, size: 26, color: "003F43" })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que o professor ensinou: ", bold: true }),
              new TextRun("Uso do localStorage para armazenamento persistente no aparelho, serialização com JSON.stringify e JSON.parse, proteção com blocos try/catch, padrão 'a lista manda na tela', necessidade obrigatória de HTTPS para contexto seguro de PWA, deploy em nuvem (GitHub Pages/Netlify) e isolamento por origem.")
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que foi implementado no projeto:\n", bold: true }),
              new TextRun("  1. Persistência de dados com 3 Models dedicados: ProductModel (cardápio cadastrado), CartModel (comanda e itens do cliente que não somem com F5) e ConfigModel (chave PIX, WhatsApp e taxas).\n"),
              new TextRun("  2. Deploy contínuo com HTTPS no GitHub Pages (https://pedroj2611.github.io/cardapio-admin/).\n"),
              new TextRun("  3. Detector de rede dinâmico: ouvintes online e offline alteram o badge do cabeçalho para laranja e emitem toast no Modo Avião ('Modo Offline PWA Ativo').\n"),
              new TextRun("  4. Botão inteligente de instalação PWA (beforeinstallprompt) adicionado à barra lateral.\n"),
              new TextRun("  5. Geração de QR Code (qrcode_projeto.png) para leitura e abertura direta na câmera de smartphones.")
            ]
          }),

          // AULA 05
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({ text: "6. Aula 05: Tarefas como Objetos, Estado Booleano, Contador, Limpeza e Polimento", bold: true, size: 26, color: "003F43" })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que o professor ensinou: ", bold: true }),
              new TextRun("Evolução de itens simples para Objetos ({ texto, feito }), alternância booleana com o operador de negação ! (item.feito = !item.feito), texto riscado via classe CSS (.feita), exclusão por posição com splice, remoção em lote de concluídos com filter, contador dinâmico de pendentes ('Faltam X de Y'), mensagem amigável de estado vazio (.vazio) e cache v4.")
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• O que foi implementado no projeto:\n", bold: true }),
              new TextRun("  1. Gestão de pedidos como objetos: cada comanda no Painel Admin possui a propriedade booleana 'concluido'.\n"),
              new TextRun("  2. Alternância com operador '!': clicar em 'Marcar Pronto' executa ped.concluido = !ped.concluido, aplicando classe CSS com texto riscado (tr.pedido-concluido) e opacidade reduzida.\n"),
              new TextRun("  3. Exclusão pontual com splice: botão '🗑 Apagar' remove o pedido por índice através de this.pedidos.splice(index, 1).\n"),
              new TextRun("  4. Contador dinâmico: barra no topo da tabela calcula via laço for os pedidos com !ped.concluido e exibe 'Faltam X de Y pedidos a atender'.\n"),
              new TextRun("  5. Limpeza com filter: botão '🧹 Limpar concluídos' descarta em lote todos os pedidos concluídos via this.pedidos.filter(p => !p.concluido).\n"),
              new TextRun("  6. Estado vazio: exibe mensagem personalizada quando não há pedidos pendentes (.vazio).\n"),
              new TextRun("  7. Versionamento do cache para cardapio-admin-v4 no sw.js.")
            ]
          }),

          // MELHORIAS ESPECIAIS
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({ text: "7. Resumo das Melhorias Especiais do Projeto", bold: true, size: 26, color: "003F43" })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun("  • Autenticação de Segurança no Admin: Acesso restrito com senha fixa ('admin'), protegendo o painel gerencial.\n"),
              new TextRun("  • Cadastro de Produtos Restrito: Formulário 'Cadastrar Novo Produto' movido do menu público para o Painel Admin, separando o acesso de clientes e gestores.\n"),
              new TextRun("  • Desacoplamento de Modais: Eliminação de conflitos de foco e travamentos na comanda através de temporizador seguro de 50ms.\n"),
              new TextRun("  • Finalização Direta no WhatsApp: Montagem automática do texto formatado com subtotal, taxa de entrega, chave PIX e envio para o WhatsApp da loja.\n"),
              new TextRun("  • Automação de Build (build.js): Script que compila o bundle CSS (style.css) e sincroniza a pasta src/ para a pasta www/ e raiz.")
            ]
          }),

          // TABELA COMPARATIVA
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({ text: "8. Tabela Resumo das Aulas 01 a 05", bold: true, size: 26, color: "003F43" })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "003F43", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Aula", bold: true, color: "FFFFFF" })] })]
                  }),
                  new TableCell({
                    shading: { fill: "003F43", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Tema Central", bold: true, color: "FFFFFF" })] })]
                  }),
                  new TableCell({
                    shading: { fill: "003F43", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Conceitos Ensinados", bold: true, color: "FFFFFF" })] })]
                  }),
                  new TableCell({
                    shading: { fill: "003F43", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Implementação no Projeto", bold: true, color: "FFFFFF" })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("01")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Estrutura Semântica")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("HTML5, semântica, viewport, layout mobile-first")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("index.html com visão pública e admin, dialog e details")] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("02")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("CSS & DOM")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Flexbox, Grid, :root, @media, addEventListener")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Barra lateral fixa, grid de pratos e navegação mobile")] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("03")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("PWA & Offline")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("manifest.json, Service Worker, Cache First, offline")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("manifest.json com standalone, sw.js com cache offline")] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("04")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("LocalStorage & Deploy")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("localStorage, JSON, try/catch, HTTPS, instalação")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Product, Cart e ConfigModel com localStorage; GitHub Pages")] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("05")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Objetos & Ações")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("Objetos com boolean, operador !, splice, filter, contador")] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun("AdminView com concluido, splice, filter e contador")] })] })
                ]
              })
            ]
          }),

          // MODELOS DE EMAIL
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 350, after: 120 },
            children: [
              new TextRun({ text: "9. Modelos Prontos de E-mail para Entrega", bold: true, size: 26, color: "003F43" })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Entrega da Aula 04 (Assunto: PWA-Aula-04):\n", bold: true }),
              new TextRun("Para: marciocarvalho@prof.fanese.edu.br\n"),
              new TextRun("Assunto: PWA-Aula-04\n"),
              new TextRun("Anexos: print-salvou.png, print-instalado.png, print-offline.png (Bônus)\n\n"),
              new TextRun({ text: "• Entrega da Aula 05 (Assunto: PWA-Aula-05):\n", bold: true }),
              new TextRun("Para: marciocarvalho@prof.fanese.edu.br\n"),
              new TextRun("Assunto: PWA-Aula-05\n"),
              new TextRun("Anexos: concluida.png (item riscado), contador.png (contador e estado vazio)\n\n"),
              new TextRun("Os textos explicativos completos prontos com as respostas do aluno encontram-se disponíveis no arquivo RELATORIO_AULAS_FANESE.md.")
            ]
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("c:/Fanese/Facudade/RESUMO_AULAS_1_A_5.docx", buffer);
  console.log("[✔] Arquivo Word gerado com sucesso: c:/Fanese/Facudade/RESUMO_AULAS_1_A_5.docx");
}

gerarDocumentoWord().catch(console.error);
