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

  // Duração da sessão de administrador: exatamente 20 minutos em milissegundos (1.200.000 ms)
  static DURACAO_SESSAO_MS = 20 * 60 * 1000;

  // Salva no localStorage o status de autenticação junto com o timestamp atual
  salvarSessaoAdmin() {
    try {
      const sessao = {
        autenticado: true,
        timestamp: Date.now() // Hora exata em que o login foi feito
      };
      localStorage.setItem("cardapio_admin_session", JSON.stringify(sessao));
      localStorage.setItem("cardapio_active_view", "admin");
      this.isAdminAutenticado = true;
    } catch (e) {
      console.error("Erro ao salvar sessão admin no localStorage:", e);
    }
  }

  // Verifica se o login de admin ainda é válido (não ultrapassou os 20 minutos)
  verificarSessaoAdmin(notificarExpiracao = false) {
    try {
      const dados = localStorage.getItem("cardapio_admin_session");
      if (!dados) {
        this.isAdminAutenticado = false;
        return false;
      }

      const sessao = JSON.parse(dados);
      if (!sessao || !sessao.autenticado || !sessao.timestamp) {
        this.limparSessaoAdmin();
        return false;
      }

      const agora = Date.now();
      const tempoDecorrido = agora - sessao.timestamp;

      if (tempoDecorrido < AppController.DURACAO_SESSAO_MS) {
        this.isAdminAutenticado = true;
        return true;
      } else {
        // Ultrapassou 20 minutos: limpa e exige a senha novamente
        this.limparSessaoAdmin();
        if (notificarExpiracao) {
          ToastView.mostrarToast("Sua sessão de admin expirou após 20 minutos. Faça login novamente.", "⏳");
        }
        return false;
      }
    } catch (e) {
      this.limparSessaoAdmin();
      return false;
    }
  }

  // Remove a sessão do localStorage e redefine as credenciais
  limparSessaoAdmin() {
    this.isAdminAutenticado = false;
    try {
      localStorage.removeItem("cardapio_admin_session");
      localStorage.setItem("cardapio_active_view", "public");
    } catch (e) {}
  }

  // Encerramento voluntário da sessão de administrador
  encerrarSessaoAdminManual() {
    this.limparSessaoAdmin();
    this.exibirTelaPublica();
    ToastView.mostrarToast("Sessão de administrador encerrada com sucesso!", "🔒");
  }

  // Retorna o tempo restante formatado (ex: "18m 42s")
  obterTempoRestanteSessao() {
    try {
      const dados = localStorage.getItem("cardapio_admin_session");
      if (!dados) return null;
      const sessao = JSON.parse(dados);
      if (!sessao || !sessao.timestamp) return null;
      const restanteMs = AppController.DURACAO_SESSAO_MS - (Date.now() - sessao.timestamp);
      if (restanteMs <= 0) return null;
      const minutos = Math.floor(restanteMs / 60000);
      const segundos = Math.floor((restanteMs % 60000) / 1000);
      return `${minutos}m ${segundos < 10 ? '0' : ''}${segundos}s`;
    } catch (e) {
      return null;
    }
  }

  // Atualiza o crachá visual de tempo restante da sessão no topo do admin
  atualizarIndicadorSessao() {
    const badge = document.getElementById("admin-session-badge");
    if (!badge) return;

    if (!this.verificarSessaoAdmin(false)) {
      badge.textContent = "⏱️ Sessão expirada";
      badge.style.borderColor = "#e74c3c";
      badge.style.color = "#e74c3c";
      badge.style.background = "rgba(231, 76, 60, 0.15)";
      return;
    }

    const restante = this.obterTempoRestanteSessao();
    if (restante) {
      badge.textContent = `⏱️ Sessão: ${restante}`;
      badge.style.borderColor = "#2ecc71";
      badge.style.color = "#2ecc71";
      badge.style.background = "rgba(46, 204, 113, 0.15)";
    }
  }

  // Restaura o estado da aplicação ao atualizar a página (F5)
  restaurarEstadoSessao() {
    const sessaoValida = this.verificarSessaoAdmin(false);
    const telaAtiva = localStorage.getItem("cardapio_active_view");

    if (sessaoValida && telaAtiva === "admin") {
      this.exibirTelaAdmin(false);
      const tempo = this.obterTempoRestanteSessao();
      if (tempo) {
        ToastView.mostrarToast(`Sessão admin restaurada (${tempo} restantes)`, "⏱️");
      }
    } else {
      this.exibirTelaPublica(false);
    }
  }

  iniciar() {
    this.configurarPWA();
    this.configurarEventos();
    this.configurarEventosAdmin();
    this.configurarSincronizacaoPedidos();
    this.configurarSincronizacaoDispositivos();
    this.restaurarEstadoSessao();
    this.verificarParametroSincronizacao();
    this.atualizarInterface();
    this.adminView.renderizarTabela();
    this.renderizarAdminProdutos();

    // Verificação periódica automática a cada 15 segundos
    setInterval(() => {
      if (this.isAdminAutenticado) {
        if (!this.verificarSessaoAdmin(true)) {
          this.exibirTelaPublica();
        } else {
          this.atualizarIndicadorSessao();
        }
      }
    }, 15000);
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

    // Função para abrir o modal de autenticação admin
    const abrirAuthAdmin = () => {
      if (inputSenha) {
        inputSenha.value = "";
        inputSenha.type = "password";
      }
      if (btnToggleVis) btnToggleVis.textContent = "👁️";
      if (errorMsg) errorMsg.style.display = "none";
      this.modalView.abrirModal(modalAuth);
      setTimeout(() => {
        if (inputSenha) inputSenha.focus();
      }, 100);
    };

    // Botões que disparam a autenticação Admin (Configurações na sidebar e mobile bottom bar)
    const btnsConfig = [
      document.getElementById("nav-item-configuracoes"),
      document.getElementById("mob-btn-config")
    ];

    btnsConfig.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          if (this.verificarSessaoAdmin(false)) {
            this.exibirTelaAdmin();
          } else {
            abrirAuthAdmin();
          }
        });
      }
    });

    if (btnFecharAuth) {
      btnFecharAuth.addEventListener("click", () => {
        this.modalView.fecharModal(modalAuth);
      });
    }

    if (modalAuth) {
      modalAuth.addEventListener("click", (e) => {
        const rect = modalAuth.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
          && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          this.modalView.fecharModal(modalAuth);
        }
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

    // Ação de validação da senha fixa "admin" com salvamento de sessão por 20 min
    const efetuarLogin = () => {
      const senha = inputSenha ? inputSenha.value.trim() : "";
      if (senha === "admin") {
        this.salvarSessaoAdmin();
        this.modalView.fecharModal(modalAuth);
        this.exibirTelaAdmin();
        ToastView.mostrarToast("Acesso Admin liberado! Sessão válida por 20 minutos.", "🔑");
      } else {
        if (errorMsg) errorMsg.style.display = "block";
        if (inputSenha) {
          inputSenha.value = "";
          inputSenha.focus();
        }
        ToastView.mostrarToast("Senha incorreta! Digite 'admin'.", "⚠️");
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

    // Navegação para Pedidos / Comandas (Monitoramento do Restaurante)
    const btnsPedidos = [
      document.getElementById("nav-item-pedidos"),
      document.getElementById("mob-btn-pedidos")
    ];

    btnsPedidos.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          if (this.verificarSessaoAdmin(false)) {
            this.exibirTelaAdmin();
          } else {
            abrirAuthAdmin();
          }
        });
      }
    });

    // Voltar para o Cardápio (mantém sessão ativa por 20 min se desejar retornar)
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

    // Botão de Logout Explicito do Admin (encerra a sessão e apaga do localStorage)
    const btnLogoutAdmin = document.getElementById("btn-logout-admin");
    if (btnLogoutAdmin) {
      btnLogoutAdmin.addEventListener("click", () => {
        ToastView.solicitarConfirmacao(
          "Encerrar Sessão?",
          "Deseja realmente sair e invalidar a sessão de administrador?",
          "🔒",
          () => {
            this.encerrarSessaoAdminManual();
          }
        );
      });
    }

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
    const filterHoraSelect = document.getElementById("filter-hora-select");

    const aplicarFiltrosAdmin = () => {
      const buscaVal = adminSearchInput ? adminSearchInput.value.trim() : "";
      const statusVal = filterStatusSelect ? filterStatusSelect.value : "";
      const horaVal = filterHoraSelect ? filterHoraSelect.value : "";
      this.adminView.renderizarTabela(buscaVal, statusVal, horaVal);
    };

    if (adminSearchInput) {
      adminSearchInput.addEventListener("input", aplicarFiltrosAdmin);
    }

    if (filterStatusSelect) {
      filterStatusSelect.addEventListener("change", aplicarFiltrosAdmin);
    }

    if (filterHoraSelect) {
      filterHoraSelect.addEventListener("change", aplicarFiltrosAdmin);
    }

    const tbodyAdmin = document.getElementById("admin-orders-table-body");
    if (tbodyAdmin) {
      tbodyAdmin.addEventListener("click", (e) => {
        if (!this.verificarSessaoAdmin(true)) {
          this.exibirTelaPublica();
          return;
        }

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
              if (!this.verificarSessaoAdmin(true)) {
                this.exibirTelaPublica();
                return;
              }
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
        if (!this.verificarSessaoAdmin(true)) {
          this.exibirTelaPublica();
          return;
        }

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
            if (!this.verificarSessaoAdmin(true)) {
              this.exibirTelaPublica();
              return;
            }
            this.adminView.limparConcluidos();
            ToastView.mostrarToast("Pedidos concluídos removidos!", "🧹");
          }
        );
      });
    }

    // Botão Limpar Todos os Pedidos
    const btnResetarPedidos = document.getElementById("btn-resetar-pedidos");
    if (btnResetarPedidos) {
      btnResetarPedidos.addEventListener("click", () => {
        if (!this.verificarSessaoAdmin(true)) {
          this.exibirTelaPublica();
          return;
        }

        if (this.adminView.pedidos.length === 0) {
          ToastView.mostrarToast("A lista de pedidos já está vazia!", "ℹ️");
          return;
        }
        ToastView.solicitarConfirmacao(
          "Limpar Todos os Pedidos?",
          "Deseja realmente apagar todos os pedidos do sistema? O monitoramento ficará vazio.",
          "🗑️",
          () => {
            if (!this.verificarSessaoAdmin(true)) {
              this.exibirTelaPublica();
              return;
            }
            this.adminView.limparTodos();
            ToastView.mostrarToast("Todos os pedidos foram removidos!", "🗑️");
          }
        );
      });
    }

    // Botão Simular Pedido de Teste no Admin
    const btnSimularPedido = document.getElementById("btn-admin-simular-pedido");
    if (btnSimularPedido) {
      btnSimularPedido.addEventListener("click", () => {
        if (!this.verificarSessaoAdmin(true)) {
          this.exibirTelaPublica();
          return;
        }

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
        if (!this.verificarSessaoAdmin(true)) {
          this.exibirTelaPublica();
          return;
        }

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
        if (!this.verificarSessaoAdmin(true)) {
          this.exibirTelaPublica();
          return;
        }

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
                if (!this.verificarSessaoAdmin(true)) {
                  this.exibirTelaPublica();
                  return;
                }
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
        if (!this.verificarSessaoAdmin(true)) {
          this.exibirTelaPublica();
          return;
        }

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

  configurarSincronizacaoPedidos() {
    // Sincronização entre abas/janelas via storage event (FANESE Aula 04 e 05)
    window.addEventListener("storage", (e) => {
      if (e.key === "cardapio_admin_pedidos" || !e.key) {
        this.adminView.renderizarTabela();
      }
    });

    // Sincronização em tempo real instantânea via BroadcastChannel
    try {
      const canal = new BroadcastChannel("cardapio_pedidos_channel");
      canal.onmessage = (msg) => {
        if (msg.data && msg.data.type === "NOVO_PEDIDO") {
          this.adminView.renderizarTabela();
          const ped = msg.data.pedido;
          ToastView.mostrarToast(`Novo pedido recebido: #${ped.id} (${ped.cliente || ped.atendente})!`, "🔔");
        }
      };
    } catch (e) {}
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

  exibirTelaAdmin(salvarEstado = true) {
    if (!this.verificarSessaoAdmin(true)) {
      this.exibirTelaPublica();
      return;
    }

    if (salvarEstado) {
      localStorage.setItem("cardapio_active_view", "admin");
    }

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
    this.atualizarIndicadorSessao();
  }

  exibirTelaPublica(salvarEstado = true) {
    if (salvarEstado) {
      localStorage.setItem("cardapio_active_view", "public");
    }

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
    if (!this.verificarSessaoAdmin(true)) {
      this.modalView.fecharModal(this.modalView.modalEditar);
      this.exibirTelaPublica();
      return;
    }

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
    if (!this.verificarSessaoAdmin(true)) {
      this.modalView.fecharModal(this.modalView.modalConfig);
      this.exibirTelaPublica();
      return;
    }

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
    const novoPed = this.adminView.adicionarPedido({
      nome: nome,
      tipo: tipo,
      local: local,
      itensTexto: resumoItensTexto,
      totalGeral: totalGeral
    });

    // Abre o WhatsApp com a mensagem do pedido formatada
    try {
      window.open(url, "_blank");
    } catch (e) {
      window.location.href = url;
    }

    // Fecha o modal de fechamento e esvazia o carrinho
    this.modalView.fecharModal(this.modalView.modalPedido);
    this.cartModel.limpar();
    this.atualizarInterface();

    // Notificação visual do pedido concluído
    ToastView.mostrarToast(`Pedido #${novoPed.id} de "${nome}" enviado ao WhatsApp e salvo com sucesso!`, "📲");
  }

  // ==========================================================================
  // SINCRONIZAÇÃO ENTRE DISPOSITIVOS (PC <-> CELULAR)
  // ==========================================================================

  gerarPayloadSincronizacao() {
    return {
      produtos: this.productModel.obterTodos(),
      config: this.configModel.obter(),
      timestamp: Date.now()
    };
  }

  codificarSincronizacao(data) {
    try {
      const json = JSON.stringify(data);
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } catch (e) {
      console.error("Erro ao codificar sincronização:", e);
      return null;
    }
  }

  decodificarSincronizacao(b64) {
    try {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const json = new TextDecoder().decode(bytes);
      return JSON.parse(json);
    } catch (e) {
      console.error("Erro ao decodificar sincronização:", e);
      return null;
    }
  }

  obterLinkSincronizacao() {
    const payload = this.gerarPayloadSincronizacao();
    const b64 = this.codificarSincronizacao(payload);
    if (!b64) return null;
    const base = window.location.origin + window.location.pathname;
    return `${base}#sync=${encodeURIComponent(b64)}`;
  }

  abrirModalSincronizar() {
    if (!this.modalView.modalSincronizar) return;

    const payload = this.gerarPayloadSincronizacao();
    const b64 = this.codificarSincronizacao(payload);
    const link = this.obterLinkSincronizacao();

    const textarea = document.getElementById("textarea-sync-code");
    if (textarea) textarea.value = b64 || "";

    const btnWhats = document.getElementById("btn-sync-whatsapp");
    if (btnWhats && link) {
      btnWhats.onclick = () => {
        const msg = `*Cardápio Atualizado do PC*\n\nAbra o link abaixo no seu celular para atualizar produtos e configurações:\n\n${link}`;
        const whatsUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
        window.open(whatsUrl, "_blank");
      };
    }

    const btnCopiar = document.getElementById("btn-sync-copiar-link");
    if (btnCopiar && link) {
      btnCopiar.onclick = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(() => {
            ToastView.mostrarToast("Link de sincronização copiado!", "📋");
          }).catch(() => {
            if (textarea) {
              textarea.select();
              document.execCommand("copy");
              ToastView.mostrarToast("Link copiado para a área de transferência!", "📋");
            }
          });
        } else if (textarea) {
          textarea.select();
          document.execCommand("copy");
          ToastView.mostrarToast("Link copiado para a área de transferência!", "📋");
        }
      };
    }

    // QR Code
    const imgQr = document.getElementById("sync-qrcode-img");
    const loadingQr = document.getElementById("sync-qrcode-loading");
    if (imgQr && loadingQr) {
      if (link && link.length <= 2500) {
        loadingQr.style.display = "block";
        loadingQr.textContent = "Gerando QR Code...";
        imgQr.style.display = "none";

        imgQr.onload = () => {
          loadingQr.style.display = "none";
          imgQr.style.display = "block";
        };
        imgQr.onerror = () => {
          loadingQr.textContent = "Use o botão 'Copiar Link' ou 'Enviar para meu WhatsApp' acima!";
          loadingQr.style.display = "block";
          imgQr.style.display = "none";
        };
        imgQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(link)}`;
      } else {
        imgQr.style.display = "none";
        loadingQr.textContent = "Use os botões de Link ou WhatsApp acima para sincronizar!";
        loadingQr.style.display = "block";
      }
    }

    this.modalView.abrirModal(this.modalView.modalSincronizar);
  }

  aplicarDadosSincronizados(dados) {
    try {
      if (dados.produtos && Array.isArray(dados.produtos) && dados.produtos.length > 0) {
        localStorage.setItem("cardapio_gourmet_v2_produtos", JSON.stringify(dados.produtos));
        this.productModel.produtos = [...dados.produtos];
      }
      if (dados.config) {
        localStorage.setItem("cardapio_pro_config", JSON.stringify(dados.config));
        this.configModel.config = { ...dados.config };
      }
      this.atualizarInterface();
      this.modalView.atualizarHeaderConfig(this.configModel.obter());
      this.adminView.renderizarTabela();
      this.renderizarAdminProdutos();

      ToastView.mostrarToast("Cardápio sincronizado com sucesso!", "✨");
    } catch (e) {
      console.error("Erro ao aplicar sincronização:", e);
      ToastView.mostrarToast("Erro ao aplicar sincronização.", "⚠️");
    }
  }

  configurarSincronizacaoDispositivos() {
    const btnsAbrir = [
      document.getElementById("btn-admin-sincronizar"),
      document.getElementById("btn-admin-sync-top"),
      document.getElementById("btn-abrir-sync-via-config")
    ];

    btnsAbrir.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          this.abrirModalSincronizar();
        });
      }
    });

    const btnsFechar = [
      document.getElementById("btn-fechar-sincronizar"),
      document.getElementById("btn-fechar-sync-modal")
    ];

    btnsFechar.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          this.modalView.fecharModal(this.modalView.modalSincronizar);
        });
      }
    });

    if (this.modalView.modalSincronizar) {
      this.modalView.modalSincronizar.addEventListener("click", (e) => {
        const rect = this.modalView.modalSincronizar.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
          && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          this.modalView.fecharModal(this.modalView.modalSincronizar);
        }
      });
    }

    // Exportar JSON
    const btnExportarJson = document.getElementById("btn-sync-exportar-json");
    if (btnExportarJson) {
      btnExportarJson.addEventListener("click", () => {
        const payload = this.gerarPayloadSincronizacao();
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cardapio_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        ToastView.mostrarToast("Arquivo de backup baixado!", "💾");
      });
    }

    // Importar JSON
    const inputArquivo = document.getElementById("input-sync-arquivo");
    if (inputArquivo) {
      inputArquivo.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const dados = JSON.parse(evt.target.result);
            if (dados && (dados.produtos || dados.config)) {
              this.aplicarDadosSincronizados(dados);
              this.modalView.fecharModal(this.modalView.modalSincronizar);
            } else {
              ToastView.mostrarToast("Arquivo de backup inválido!", "⚠️");
            }
          } catch (err) {
            ToastView.mostrarToast("Erro ao ler arquivo JSON!", "⚠️");
          }
        };
        reader.readAsText(file);
      });
    }

    // Aplicar código colado
    const btnAplicarCodigo = document.getElementById("btn-sync-aplicar-codigo");
    if (btnAplicarCodigo) {
      btnAplicarCodigo.addEventListener("click", () => {
        const code = document.getElementById("textarea-sync-code")?.value.trim();
        if (!code) {
          ToastView.mostrarToast("Cole o código de sincronização no campo!", "⚠️");
          return;
        }
        let dados = null;
        try {
          if (code.startsWith("{")) {
            dados = JSON.parse(code);
          } else {
            dados = this.decodificarSincronizacao(code);
          }
        } catch (e) {
          ToastView.mostrarToast("Código de sincronização inválido!", "⚠️");
          return;
        }

        if (dados && (dados.produtos || dados.config)) {
          this.aplicarDadosSincronizados(dados);
          this.modalView.fecharModal(this.modalView.modalSincronizar);
        } else {
          ToastView.mostrarToast("Nenhum dado encontrado no código!", "⚠️");
        }
      });
    }
  }

  verificarParametroSincronizacao() {
    try {
      const hash = window.location.hash;
      if (!hash || !hash.includes("sync=")) return;

      const raw = hash.split("sync=")[1];
      if (!raw) return;

      const dados = this.decodificarSincronizacao(decodeURIComponent(raw));
      if (!dados || (!dados.produtos && !dados.config)) return;

      const totalProds = (dados.produtos && Array.isArray(dados.produtos)) ? dados.produtos.length : 0;
      const nomeLoja = (dados.config && dados.config.nomeLoja) ? dados.config.nomeLoja : "Restaurante";

      setTimeout(() => {
        ToastView.solicitarConfirmacao(
          "Sincronizar do PC?",
          `Detectamos ${totalProds} produtos e configurações de "${nomeLoja}" enviados do computador. Deseja atualizar este celular agora?`,
          "📲",
          () => {
            this.aplicarDadosSincronizados(dados);
            try {
              history.replaceState(null, "", window.location.pathname + window.location.search);
            } catch (e) {}
          },
          () => {
            try {
              history.replaceState(null, "", window.location.pathname + window.location.search);
            } catch (e) {}
          }
        );
      }, 600);
    } catch (e) {
      console.error("Erro ao verificar parâmetro de sincronização:", e);
    }
  }
}

// Inicializa quando a página é carregada
document.addEventListener("DOMContentLoaded", () => {
  const app = new AppController();
  app.iniciar();
});
