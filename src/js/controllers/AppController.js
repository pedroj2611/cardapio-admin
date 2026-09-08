/**
 * ==========================================================================
 * CONTROLLER LAYER - APP CONTROLLER (src/js/controllers/AppController.js)
 * ==========================================================================
 */

import { ProductModel } from "../models/ProductModel.js";
import { CartModel } from "../models/CartModel.js";
import { ConfigModel, CONFIG_PADRAO } from "../models/ConfigModel.js";

import { ProductView, formatarPreco } from "../views/ProductView.js";
import { CartView } from "../views/CartView.js";
import { ModalView } from "../views/ModalView.js";
import { ToastView } from "../views/ToastView.js";
import { AdminView } from "../views/AdminView.js";

export class AppController {
  constructor() {
    this.productModel = new ProductModel();
    this.cartModel = new CartModel();
    this.configModel = new ConfigModel();

    this.productView = new ProductView();
    this.cartView = new CartView();
    this.modalView = new ModalView();
    this.adminView = new AdminView();

    this.categoriaAtiva = "todos";
    this.termoBusca = "";
    this.isAdminAutenticado = false;
  }

  iniciar() {
    this.configurarPWA();
    this.configurarEventos();
    this.configurarEventosAdmin();
    this.atualizarInterface();
    this.adminView.renderizarTabela();
    this.renderizarAdminProdutos();
  }

  atualizarInterface() {
    const config = this.configModel.obter();
    this.modalView.atualizarHeaderConfig(config);

    const produtosFiltrados = this.productModel.filtrar(this.categoriaAtiva, this.termoBusca);
    this.productView.renderizar(produtosFiltrados, this.cartModel, this.categoriaAtiva, this.termoBusca);

    const tipoAtendimento = document.getElementById("tipo-atendimento")?.value || "Delivery";
    const ehDelivery = (tipoAtendimento === "Delivery");
    const totais = this.cartModel.calcularTotais(config.taxaEntrega, ehDelivery);

    this.cartView.atualizarDock(totais);
    this.cartView.renderizarModalItens(this.cartModel.obterItens(), totais);
  }

  configurarEventosAdmin() {
    const modalAuth = document.getElementById("modal-auth-admin");
    const btnFecharAuth = document.getElementById("btn-fechar-auth-admin");
    const btnSubmitAuth = document.getElementById("btn-submit-auth-admin");
    const btnToggleVis = document.getElementById("btn-toggle-password-vis");
    const inputSenha = document.getElementById("admin-password-input");
    const errorMsg = document.getElementById("auth-error-msg");

    // Botões que disparam a autenticação Admin (somente barra lateral esquerda e barra inferior mobile)
    const btnsConfig = [
      document.getElementById("nav-item-configuracoes"),
      document.getElementById("mob-btn-config")
    ];

    btnsConfig.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          if (this.isAdminAutenticado) {
            this.exibirTelaAdmin();
          } else {
            if (inputSenha) inputSenha.value = "";
            if (errorMsg) errorMsg.style.display = "none";
            this.modalView.abrirModal(modalAuth);
            if (inputSenha) inputSenha.focus();
          }
        });
      }
    });

    if (btnFecharAuth) {
      btnFecharAuth.addEventListener("click", () => {
        this.modalView.fecharModal(modalAuth);
      });
    }

    // Toggle de visualização de senha (ícone de olho)
    if (btnToggleVis && inputSenha) {
      btnToggleVis.addEventListener("click", () => {
        const ehPass = inputSenha.type === "password";
        inputSenha.type = ehPass ? "text" : "password";
        btnToggleVis.textContent = ehPass ? "🙈" : "👁️";
      });
    }

    // Ação de validação da senha fixa "admin"
    const efetuarLogin = () => {
      const senha = inputSenha ? inputSenha.value.trim() : "";
      if (senha === "admin") {
        this.isAdminAutenticado = true;
        this.modalView.fecharModal(modalAuth);
        this.exibirTelaAdmin();
        ToastView.mostrarToast("Acesso Admin liberado!", "🔑");
      } else {
        if (errorMsg) errorMsg.style.display = "block";
        ToastView.mostrarToast("Senha incorreta! Tente novamente.", "⚠️");
      }
    };

    if (btnSubmitAuth) btnSubmitAuth.addEventListener("click", efetuarLogin);
    if (inputSenha) {
      inputSenha.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          efetuarLogin();
        }
      });
    }

    // Navegação para Pedidos / Comandas
    const btnsPedidos = [
      document.getElementById("nav-item-pedidos"),
      document.getElementById("mob-btn-pedidos")
    ];

    btnsPedidos.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".sidebar-item, .mobile-nav-btn").forEach(el => el.classList.remove("active"));
          document.getElementById("nav-item-pedidos")?.classList.add("active");
          document.getElementById("mob-btn-pedidos")?.classList.add("active");

          if (this.isAdminAutenticado) {
            this.exibirTelaAdmin();
          } else {
            const itens = this.cartModel.obterItens();
            if (itens.length > 0) {
              this.modalView.atualizarCamposAtendimento(this.configModel.obter().taxaEntrega);
              this.modalView.atualizarCamposPagamento();
              this.modalView.abrirModal(this.modalView.modalPedido);
            } else {
              ToastView.mostrarToast("Seu pedido está vazio! Adicione itens do cardápio.", "🛒");
            }
          }
        });
      }
    });

    // Voltar para o Cardápio
    const btnSairAdmin = document.getElementById("btn-sair-admin");
    const btnsCardapio = [
      document.getElementById("nav-item-cardapio"),
      document.getElementById("mob-btn-cardapio")
    ];

    if (btnSairAdmin) {
      btnSairAdmin.addEventListener("click", () => this.exibirTelaPublica());
    }

    btnsCardapio.forEach(btn => {
      if (btn) btn.addEventListener("click", () => this.exibirTelaPublica());
    });

    // Dark Mode Toggle
    const toggleDarkMode = document.getElementById("toggle-dark-mode");
    if (toggleDarkMode) {
      toggleDarkMode.addEventListener("change", (e) => {
        document.body.classList.toggle("dark-mode", e.target.checked);
      });
    }

    // Eventos dentro do Painel Admin (Filtros, Busca e Tabela)
    const adminSearchInput = document.getElementById("admin-search-input");
    const filterStatusSelect = document.getElementById("filter-status-select");

    if (adminSearchInput) {
      adminSearchInput.addEventListener("input", (e) => {
        const statusVal = filterStatusSelect ? filterStatusSelect.value : "";
        this.adminView.renderizarTabela(e.target.value.trim(), statusVal);
      });
    }

    if (filterStatusSelect) {
      filterStatusSelect.addEventListener("change", (e) => {
        const buscaVal = adminSearchInput ? adminSearchInput.value.trim() : "";
        this.adminView.renderizarTabela(buscaVal, e.target.value);
      });
    }

    const tbodyAdmin = document.getElementById("admin-orders-table-body");
    if (tbodyAdmin) {
      tbodyAdmin.addEventListener("click", (e) => {
        const btnConcluir = e.target.closest(".btn-concluir-ped");
        const btnCancelar = e.target.closest(".btn-cancelar-ped");

        if (btnConcluir) {
          const id = btnConcluir.dataset.id;
          this.adminView.alternarConcluido(id);
          ToastView.mostrarToast(`Status do pedido #${id} alterado!`, "✅");
        } else if (btnCancelar) {
          const id = btnCancelar.dataset.id;
          ToastView.solicitarConfirmacao(
            "Apagar Pedido?",
            `Deseja realmente remover o pedido #${id}?`,
            "🗑️",
            () => {
              this.adminView.cancelarPedido(id);
              ToastView.mostrarToast(`Pedido #${id} removido!`, "🗑️");
            }
          );
        }
      });
    }

    // Botão Limpar Pedidos Concluídos (FANESE Aula 05 Parte 2)
    const btnLimparConcluidos = document.getElementById("btn-limpar-pedidos-concluidos");
    if (btnLimparConcluidos) {
      btnLimparConcluidos.addEventListener("click", () => {
        const concluidos = this.adminView.pedidos.filter(p => p.concluido).length;
        if (concluidos === 0) {
          ToastView.mostrarToast("Nenhum pedido concluído para limpar!", "ℹ️");
          return;
        }
        ToastView.solicitarConfirmacao(
          "Limpar Concluídos?",
          `Deseja remover ${concluidos} pedido(s) concluído(s) da lista?`,
          "🧹",
          () => {
            this.adminView.limparConcluidos();
            ToastView.mostrarToast("Pedidos concluídos removidos!", "🧹");
          }
        );
      });
    }

    // Botão Simular Pedido de Teste no Admin
    const btnSimularPedido = document.getElementById("btn-admin-simular-pedido");
    if (btnSimularPedido) {
      btnSimularPedido.addEventListener("click", () => {
        this.adminView.adicionarPedido({
          nome: "Pedro (Teste)",
          tipo: "Mesa",
          local: "Mesa 02",
          itensTexto: "1x X-Bacon Artesanal, 1x Coca-Cola",
          totalGeral: 39.40
        });
        ToastView.mostrarToast("Pedido de teste adicionado ao topo!", "🛎️");
      });
    }

    // Ações de Gestão do Sistema e Cardápio (Painel Admin)
    const btnAdminConfigLoja = document.getElementById("btn-admin-config-loja");
    if (btnAdminConfigLoja) {
      btnAdminConfigLoja.addEventListener("click", () => {
        this.modalView.preencherFormConfig(this.configModel.obter());
        this.modalView.abrirModal(this.modalView.modalConfig);
      });
    }

    const btnAdminGerenciarProds = document.getElementById("btn-admin-gerenciar-produtos");
    if (btnAdminGerenciarProds) {
      btnAdminGerenciarProds.addEventListener("click", () => {
        const sec = document.getElementById("admin-produtos-section");
        if (sec) {
          sec.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // Gestão de Produtos do Cardápio no Admin (FANESE: consulta e alteração de preços)
    const buscaProdAdmin = document.getElementById("admin-busca-produtos");
    if (buscaProdAdmin) {
      buscaProdAdmin.addEventListener("input", () => this.renderizarAdminProdutos());
    }

    const filtroCatAdmin = document.getElementById("admin-filtro-cat-produtos");
    if (filtroCatAdmin) {
      filtroCatAdmin.addEventListener("change", () => this.renderizarAdminProdutos());
    }

    const tbodyProdAdmin = document.getElementById("admin-products-table-body");
    if (tbodyProdAdmin) {
      tbodyProdAdmin.addEventListener("click", (e) => {
        const btnEditar = e.target.closest(".btn-editar-preco-prod");
        const btnExcluir = e.target.closest(".btn-excluir-prod-admin");

        if (btnEditar) {
          const id = parseInt(btnEditar.dataset.id);
          const prod = this.productModel.obterPorId(id);
          if (prod) {
            this.modalView.preencherFormEdicao(prod);
            this.modalView.abrirModal(this.modalView.modalEditar);
          }
        } else if (btnExcluir) {
          const id = parseInt(btnExcluir.dataset.id);
          const prod = this.productModel.obterPorId(id);
          if (prod) {
            ToastView.solicitarConfirmacao(
              "Excluir Produto?",
              `Deseja remover "${prod.nome}" permanentemente do cardápio?`,
              "🗑️",
              () => {
                this.productModel.excluir(id);
                this.cartModel.removerItem(id);
                this.atualizarInterface();
                this.renderizarAdminProdutos();
                ToastView.mostrarToast("Produto excluído do cardápio!", "🗑️");
              }
            );
          }
        }
      });
    }

    // Formulário de Cadastro de Novo Produto no Accordion do Admin
    const btnSalvarNovo = document.getElementById("btn-salvar-novo");
    if (btnSalvarNovo) {
      btnSalvarNovo.addEventListener("click", () => {
        const nome = document.getElementById("novo-nome")?.value.trim();
        const categoria = document.getElementById("nova-categoria")?.value || "lanches";
        const preco = parseFloat(document.getElementById("novo-preco")?.value);
        const badge = document.getElementById("novo-badge")?.value || "";
        const imagem = document.getElementById("nova-imagem")?.value.trim() || "";
        const descricao = document.getElementById("novo-descricao")?.value.trim() || "";

        if (!nome || isNaN(preco) || preco <= 0) {
          ToastView.mostrarToast("Preencha o nome e um preço válido!", "⚠️");
          return;
        }

        const novoProduto = this.productModel.adicionar({
          nome,
          categoria,
          preco,
          badge,
          imagem,
          descricao
        });

        // Limpa campos
        document.getElementById("novo-nome").value = "";
        document.getElementById("novo-preco").value = "";
        document.getElementById("novo-imagem").value = "";
        document.getElementById("novo-descricao").value = "";
        document.getElementById("novo-badge").value = "";

        this.atualizarInterface();
        this.renderizarAdminProdutos();

        ToastView.mostrarToast(`"${novoProduto.nome}" cadastrado com sucesso!`, "✨");

        // Rola até a tabela de produtos
        document.getElementById("admin-produtos-section")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  configurarPWA() {
    // 1. Suporte a instalação PWA (beforeinstallprompt - FANESE Aula 03 & 04)
    let deferredPrompt = null;
    const btnInstalar = document.getElementById("btn-instalar-pwa");

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (btnInstalar) {
        btnInstalar.style.display = "flex";
      }
    });

    if (btnInstalar) {
      btnInstalar.addEventListener("click", async () => {
        if (!deferredPrompt) {
          ToastView.mostrarToast("App já pronto ou instalado no seu dispositivo!", "📱");
          return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          ToastView.mostrarToast("Instalando o Cardápio no seu dispositivo...", "📲");
        }
        deferredPrompt = null;
        btnInstalar.style.display = "none";
      });
    }

    window.addEventListener("appinstalled", () => {
      ToastView.mostrarToast("Cardápio instalado com sucesso na tela inicial!", "🎉");
      if (btnInstalar) btnInstalar.style.display = "none";
    });

    // 2. Monitoramento de Rede Online / Offline (Destaque da Aula 04: Modo Avião / Offline)
    const statusLabel = document.getElementById("status-rede-label");
    const statusPulse = document.getElementById("status-pulse-dot");

    const atualizarStatusRede = () => {
      const online = navigator.onLine;
      if (online) {
        if (statusLabel) statusLabel.textContent = "Aberto para Pedidos";
        if (statusPulse) {
          statusPulse.style.background = "#2ecc71";
          statusPulse.style.boxShadow = "0 0 10px #2ecc71";
        }
      } else {
        if (statusLabel) statusLabel.textContent = "Modo Offline (PWA Ativo)";
        if (statusPulse) {
          statusPulse.style.background = "#e67e22";
          statusPulse.style.boxShadow = "0 0 10px #e67e22";
        }
        ToastView.mostrarToast("Você está offline! O cardápio continua funcionando pelo Cache PWA.", "📶");
      }
    };

    window.addEventListener("online", () => {
      atualizarStatusRede();
      ToastView.mostrarToast("Conexão restabelecida! Cardápio online.", "🌐");
    });

    window.addEventListener("offline", () => {
      atualizarStatusRede();
    });

    // Verificação inicial
    if (!navigator.onLine) {
      atualizarStatusRede();
    }
  }

  exibirTelaAdmin() {
    const publicView = document.getElementById("public-view");
    const adminView = document.getElementById("admin-dashboard-view");

    if (publicView) publicView.style.display = "none";
    if (adminView) adminView.style.display = "block";

    // Atualiza active nos menus
    document.querySelectorAll(".sidebar-item, .mobile-nav-btn").forEach(el => el.classList.remove("active"));
    document.getElementById("nav-item-configuracoes")?.classList.add("active");
    document.getElementById("mob-btn-config")?.classList.add("active");

    this.adminView.renderizarTabela();
    this.renderizarAdminProdutos();
  }

  exibirTelaPublica() {
    const publicView = document.getElementById("public-view");
    const adminView = document.getElementById("admin-dashboard-view");

    if (adminView) adminView.style.display = "none";
    if (publicView) publicView.style.display = "block";

    // Atualiza active nos menus
    document.querySelectorAll(".sidebar-item, .mobile-nav-btn").forEach(el => el.classList.remove("active"));
    document.getElementById("nav-item-cardapio")?.classList.add("active");
    document.getElementById("mob-btn-cardapio")?.classList.add("active");
  }

  renderizarAdminProdutos() {
    const termo = document.getElementById("admin-busca-produtos")?.value.trim().toLowerCase() || "";
    const categoria = document.getElementById("admin-filtro-cat-produtos")?.value || "todos";

    let produtos = this.productModel.obterTodos();

    if (categoria !== "todos") {
      produtos = produtos.filter(p => p.categoria === categoria);
    }

    if (termo) {
      produtos = produtos.filter(p => 
        p.nome.toLowerCase().includes(termo) ||
        (p.descricao && p.descricao.toLowerCase().includes(termo))
      );
    }

    this.adminView.renderizarTabelaProdutos(produtos);
  }

  configurarEventos() {
    // Busca em tempo real
    const campoBusca = document.getElementById("campo-busca");
    const btnLimparBusca = document.getElementById("btn-limpar-busca");
    const btnResetBusca = document.getElementById("btn-reset-busca");

    if (campoBusca) {
      campoBusca.addEventListener("input", (e) => {
        this.termoBusca = e.target.value.trim();
        if (btnLimparBusca) btnLimparBusca.style.display = this.termoBusca ? "flex" : "none";
        this.atualizarInterface();
      });
    }

    if (btnLimparBusca) {
      btnLimparBusca.addEventListener("click", () => {
        if (campoBusca) campoBusca.value = "";
        this.termoBusca = "";
        btnLimparBusca.style.display = "none";
        this.atualizarInterface();
        if (campoBusca) campoBusca.focus();
      });
    }

    if (btnResetBusca) {
      btnResetBusca.addEventListener("click", () => {
        if (campoBusca) campoBusca.value = "";
        this.termoBusca = "";
        this.categoriaAtiva = "todos";
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.cat === "todos"));
        if (btnLimparBusca) btnLimparBusca.style.display = "none";
        this.atualizarInterface();
      });
    }

    // Abas de categorias
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.categoriaAtiva = btn.dataset.cat;
        this.atualizarInterface();
      });
    });

    // Eventos delegados na Grid de produtos
    const grid = document.getElementById("grid-produtos");
    if (grid) {
      grid.addEventListener("click", (e) => {
        const btnAdd = e.target.closest(".btn-adicionar-cart");
        const btnAumentar = e.target.closest(".btn-aumentar");
        const btnDiminuir = e.target.closest(".btn-diminuir");
        const btnEditar = e.target.closest(".btn-editar-prod");
        const btnExcluir = e.target.closest(".btn-excluir-prod");

        if (btnAdd) {
          const id = parseInt(btnAdd.dataset.id);
          const prod = this.productModel.obterPorId(id);
          if (prod) {
            this.cartModel.adicionarItem(prod);
            this.atualizarInterface();
            ToastView.mostrarToast(`${prod.nome} adicionado!`, "🛒");
          }
        } else if (btnAumentar) {
          const id = parseInt(btnAumentar.dataset.id);
          this.cartModel.alterarQuantidade(id, 1);
          this.atualizarInterface();
        } else if (btnDiminuir) {
          const id = parseInt(btnDiminuir.dataset.id);
          this.cartModel.alterarQuantidade(id, -1);
          this.atualizarInterface();
        } else if (btnEditar) {
          const id = parseInt(btnEditar.dataset.id);
          const prod = this.productModel.obterPorId(id);
          if (prod) {
            this.modalView.preencherFormEdicao(prod);
            this.modalView.abrirModal(this.modalView.modalEditar);
          }
        } else if (btnExcluir) {
          const id = parseInt(btnExcluir.dataset.id);
          const prod = this.productModel.obterPorId(id);
          if (prod) {
            ToastView.solicitarConfirmacao(
              "Excluir Produto?",
              `Deseja remover "${prod.nome}" permanentemente do cardápio?`,
              "🗑️",
              () => {
                this.productModel.excluir(id);
                this.cartModel.removerItem(id);
                this.atualizarInterface();
                ToastView.mostrarToast("Produto excluído!", "🗑️");
              }
            );
          }
        }
      });
    }

    // Eventos delegados na lista de itens dentro do Modal de Checkout
    const listaModal = document.getElementById("pedido-itens-lista");
    if (listaModal) {
      listaModal.addEventListener("click", (e) => {
        const btnAumentar = e.target.closest(".btn-modal-aumentar");
        const btnDiminuir = e.target.closest(".btn-modal-diminuir");

        if (btnAumentar) {
          const id = parseInt(btnAumentar.dataset.id);
          this.cartModel.alterarQuantidade(id, 1);
          this.atualizarInterface();
        } else if (btnDiminuir) {
          const id = parseInt(btnDiminuir.dataset.id);
          this.cartModel.alterarQuantidade(id, -1);
          this.atualizarInterface();
          if (this.cartModel.obterItens().length === 0) {
            this.modalView.fecharModal(this.modalView.modalPedido);
            ToastView.mostrarToast("Seu carrinho foi esvaziado!", "🛒");
          }
        }
      });
    }

    // Modal Checkout
    const btnAbrirPedido = document.getElementById("btn-abrir-pedido");
    const btnFecharModal = document.getElementById("btn-fechar-modal");
    const btnLimparTudo = document.getElementById("btn-limpar-tudo");
    const btnEnviarWhatsApp = document.getElementById("btn-enviar-whatsapp");

    if (btnAbrirPedido) {
      btnAbrirPedido.addEventListener("click", () => {
        if (this.cartModel.obterItens().length === 0) {
          ToastView.mostrarToast("Adicione itens ao carrinho primeiro!", "🛒");
          return;
        }
        this.modalView.atualizarCamposAtendimento(this.configModel.obter().taxaEntrega);
        this.modalView.atualizarCamposPagamento();
        this.modalView.abrirModal(this.modalView.modalPedido);
      });
    }

    if (btnFecharModal) {
      btnFecharModal.addEventListener("click", () => {
        this.modalView.fecharModal(this.modalView.modalPedido);
      });
    }

    const tipoAtendimentoSelect = document.getElementById("tipo-atendimento");
    if (tipoAtendimentoSelect) {
      tipoAtendimentoSelect.addEventListener("change", () => {
        this.modalView.atualizarCamposAtendimento(this.configModel.obter().taxaEntrega);
        this.atualizarInterface();
      });
    }

    const formaPagamentoSelect = document.getElementById("forma-pagamento");
    if (formaPagamentoSelect) {
      formaPagamentoSelect.addEventListener("change", () => {
        this.modalView.atualizarCamposPagamento();
      });
    }

    const btnCopiarPix = document.getElementById("btn-copiar-pix");
    if (btnCopiarPix) {
      btnCopiarPix.addEventListener("click", () => {
        const chave = document.getElementById("pix-chave-texto")?.textContent;
        if (chave) {
          navigator.clipboard.writeText(chave);
          ToastView.mostrarToast("Chave PIX copiada!", "⚡");
        }
      });
    }

    if (btnLimparTudo) {
      btnLimparTudo.addEventListener("click", () => {
        if (this.cartModel.obterItens().length === 0) return;
        ToastView.solicitarConfirmacao(
          "Esvaziar Carrinho?",
          "Deseja remover todos os itens do seu pedido?",
          "🗑️",
          () => {
            this.cartModel.limpar();
            this.atualizarInterface();
            this.modalView.fecharModal(this.modalView.modalPedido);
            ToastView.mostrarToast("Carrinho esvaziado com sucesso!", "🗑️");
          }
        );
      });
    }

    if (btnEnviarWhatsApp) {
      btnEnviarWhatsApp.addEventListener("click", () => this.finalizarPedidoWhatsApp());
    }

    // Modais Edição & Configurações da Loja
    const btnFecharEditar = document.getElementById("btn-fechar-editar");
    const btnSalvarEdicao = document.getElementById("btn-salvar-edicao");
    if (btnFecharEditar) {
      btnFecharEditar.addEventListener("click", () => this.modalView.fecharModal(this.modalView.modalEditar));
    }
    if (btnSalvarEdicao) {
      btnSalvarEdicao.addEventListener("click", () => this.salvarEdicaoProduto());
    }

    const btnFecharConfig = document.getElementById("btn-fechar-config");
    const btnSalvarConfig = document.getElementById("btn-salvar-config");
    if (btnFecharConfig) {
      btnFecharConfig.addEventListener("click", () => this.modalView.fecharModal(this.modalView.modalConfig));
    }
    if (btnSalvarConfig) {
      btnSalvarConfig.addEventListener("click", () => this.salvarConfiguracoesLoja());
    }
  }

  salvarEdicaoProduto() {
    const id = parseInt(document.getElementById("edit-id").value);
    const nome = document.getElementById("edit-nome").value.trim();
    const categoria = document.getElementById("edit-categoria").value;
    const preco = parseFloat(document.getElementById("edit-preco").value);
    const badge = document.getElementById("edit-badge").value;
    const imagem = document.getElementById("edit-imagem").value.trim();
    const descricao = document.getElementById("edit-descricao").value.trim();

    if (!nome || isNaN(preco)) {
      ToastView.mostrarToast("Preencha os campos obrigatórios!", "⚠️");
      return;
    }

    this.productModel.atualizar(id, { nome, categoria, preco, badge, imagem, descricao });
    this.atualizarInterface();
    this.renderizarAdminProdutos();
    this.modalView.fecharModal(this.modalView.modalEditar);
    ToastView.mostrarToast("Produto e preço atualizados!", "✏️");
  }

  salvarConfiguracoesLoja() {
    const nomeLoja = document.getElementById("config-nome-loja").value.trim();
    const whatsapp = document.getElementById("config-whatsapp").value.trim();
    const taxaEntrega = parseFloat(document.getElementById("config-taxa-entrega").value);
    const chavePix = document.getElementById("config-chave-pix").value.trim();

    this.configModel.salvar({ nomeLoja, whatsapp, taxaEntrega, chavePix });
    this.atualizarInterface();
    this.modalView.fecharModal(this.modalView.modalConfig);
    ToastView.mostrarToast("Configurações salvas com sucesso!", "⚙️");
  }

  finalizarPedidoWhatsApp() {
    const itens = this.cartModel.obterItens();
    if (itens.length === 0) return;

    const nome = document.getElementById("cliente-nome")?.value.trim();
    const tipo = document.getElementById("tipo-atendimento")?.value;
    const local = document.getElementById("cliente-local")?.value.trim();
    const pagamento = document.getElementById("forma-pagamento")?.value;
    const troco = document.getElementById("pedido-troco")?.value.trim();
    const obs = document.getElementById("pedido-obs")?.value.trim();

    if (!nome) {
      ToastView.mostrarToast("Informe seu nome completo!", "⚠️");
      document.getElementById("cliente-nome")?.focus();
      return;
    }

    if (tipo !== "Balcão" && !local) {
      ToastView.mostrarToast("Informe o endereço / mesa!", "⚠️");
      document.getElementById("cliente-local")?.focus();
      return;
    }

    const config = this.configModel.obter();
    const ehDelivery = (tipo === "Delivery");
    const { subtotalValor, taxaEntrega, totalGeral } = this.cartModel.calcularTotais(config.taxaEntrega, ehDelivery);
    const agora = new Date().toLocaleString("pt-BR");

    let texto = `*🍽️ NOVO PEDIDO - ${config.nomeLoja.toUpperCase()}*\n`;
    texto += `_Data/Hora: ${agora}_\n`;
    texto += `----------------------------------------\n`;
    texto += `👤 *Cliente:* ${nome}\n`;
    texto += `📍 *Atendimento:* ${tipo} ${local ? `(${local})` : ''}\n`;
    texto += `💳 *Forma de Pagamento:* ${pagamento}\n`;
    if (pagamento === "Dinheiro" && troco) {
      texto += `💵 *Troco para:* ${troco}\n`;
    }
    texto += `----------------------------------------\n`;
    texto += `📋 *ITENS DO PEDIDO:*\n`;

    itens.forEach(it => {
      texto += `• ${it.quantidade}x ${it.nome} - ${formatarPreco(it.preco * it.quantidade)}\n`;
    });

    texto += `----------------------------------------\n`;
    texto += `💰 *Subtotal:* ${formatarPreco(subtotalValor)}\n`;
    if (ehDelivery) {
      texto += `🛵 *Taxa de Entrega:* ${formatarPreco(taxaEntrega)}\n`;
    }
    texto += `✨ *TOTAL A PAGAR:* ${formatarPreco(totalGeral)}\n`;
    texto += `----------------------------------------\n`;

    if (obs) {
      texto += `📝 *Observações:* ${obs}\n`;
    }

    const numeroWhats = config.whatsapp || CONFIG_PADRAO.whatsapp;
    const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(texto)}`;

    // Registra o pedido em tempo real no Monitoramento de Pedidos do Admin (FANESE Aulas 04 e 05)
    const resumoItensTexto = itens.map(it => `${it.quantidade}x ${it.nome}`).join(", ");
    this.adminView.adicionarPedido({
      nome: nome,
      tipo: tipo,
      local: local,
      itensTexto: resumoItensTexto,
      totalGeral: totalGeral
    });

    window.open(url, "_blank");

    this.modalView.fecharModal(this.modalView.modalPedido);
    ToastView.solicitarConfirmacao(
      "Pedido Enviado!",
      "Seu pedido foi enviado para o WhatsApp. Deseja limpar o carrinho?",
      "📲",
      () => {
        this.cartModel.limpar();
        this.atualizarInterface();
      }
    );
  }
}

// Inicializa quando a página é carregada
document.addEventListener("DOMContentLoaded", () => {
  const app = new AppController();
  app.iniciar();
});
