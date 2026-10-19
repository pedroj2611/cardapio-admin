/**
 * ==========================================================================
 * SISTEMA EMPRESARIAL GOURMET DE CARDÁPIO DIGITAL & PEDIDOS
 * ==========================================================================
 */

// ==========================================================================
// 1. PRODUTOS PADRÃO DO RESTAURANTE (COM IMAGENS GOURMET E BADGES)
// ==========================================================================
const PRODUTOS_PADRAO = [
  {
    id: 1,
    nome: "X-Bacon Artesanal Gourmet",
    categoria: "lanches",
    preco: 32.90,
    icone: "🥓",
    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    badge: "Mais Pedido",
    descricao: "Pão brioche selado na manteiga, blend bovino 180g, fatias de bacon crocante, cheddar e maionese artesanal."
  },
  {
    id: 2,
    nome: "Smash Burger Duplo",
    categoria: "lanches",
    preco: 28.00,
    icone: "🍔",
    imagem: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
    badge: "Chef Special",
    descricao: "2 carnes smash 90g prensadas na chapa com crostinha crocante, dobro de queijo prato e cebola caramelizada."
  },
  {
    id: 3,
    nome: "Chicken Crispy Supreme",
    categoria: "lanches",
    preco: 29.90,
    icone: "🍗",
    imagem: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
    badge: "Novo",
    descricao: "Filé de frango empanado ultra crocante, alface americana fresca, picles e molho tártaro especial."
  },
  {
    id: 4,
    nome: "Batata Rústica Cheddar & Bacon",
    categoria: "porcoes",
    preco: 26.00,
    icone: "🍟",
    imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    badge: "Mais Pedido",
    descricao: "Batatas rústicas douradas temperadas com páprica e alecrim, cobertas com cheddar cremoso e bacon."
  },
  {
    id: 5,
    nome: "Anéis de Cebola Empanados",
    categoria: "porcoes",
    preco: 22.00,
    icone: "🧅",
    imagem: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=600&q=80",
    badge: "",
    descricao: "Porção generosa de onion rings crocantes e sequinhas, acompanhadas de molho barbecue da casa."
  },
  {
    id: 6,
    nome: "Coca-Cola Original Lata 350ml",
    categoria: "bebidas",
    preco: 6.50,
    icone: "🥤",
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    badge: "",
    descricao: "Refrigerante lata 350ml trincando de gelada."
  },
  {
    id: 7,
    nome: "Suco Natural de Laranja 500ml",
    categoria: "bebidas",
    preco: 10.00,
    icone: "🍊",
    imagem: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
    badge: "Vegetariano",
    descricao: "Suco natural feito na hora com 100% de laranjas frescas selecionadas, sem adição de açúcar."
  },
  {
    id: 8,
    nome: "Brownie Belga com Sorvete",
    categoria: "sobremesas",
    preco: 18.00,
    icone: "🍫",
    imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    badge: "Chef Special",
    descricao: "Brownie de chocolate belga morno com nozes, acompanhado de bola generosa de sorvete de baunilha."
  },
  {
    id: 9,
    nome: "Cerveja Heineken Long Neck 330ml",
    categoria: "bebidas",
    preco: 12.00,
    icone: "🍺",
    imagem: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80",
    badge: "Mais Pedido",
    descricao: "Cerveja Premium Lager Heineken Long Neck 330ml trincando de gelada."
  }
];

const CONFIG_PADRAO = {
  nomeLoja: "Hambúrguer dos Amigos",
  whatsapp: "5579999820686",
  taxaEntrega: 0,
  chavePix: "pedrojoaquimbisposantana1897@gmail.com"
};

// ==========================================================================
// 2. ESTADO DA APLICAÇÃO
// ==========================================================================
let produtos = carregarProdutos();
let carrinho = carregarCarrinho();
let configLoja = carregarConfig();
let categoriaAtiva = "todos";
let termoBusca = "";
let acaoConfirmacaoPendente = null;

// ==========================================================================
// 3. PERSISTÊNCIA (LOCALSTORAGE)
// ==========================================================================
function carregarProdutos() {
  try {
    const salvos = localStorage.getItem("cardapio_pro_produtos");
    if (!salvos) {
      localStorage.setItem("cardapio_pro_produtos", JSON.stringify(PRODUTOS_PADRAO));
      return [...PRODUTOS_PADRAO];
    }
    const lista = JSON.parse(salvos);
    if (!Array.isArray(lista) || lista.length === 0) {
      localStorage.setItem("cardapio_pro_produtos", JSON.stringify(PRODUTOS_PADRAO));
      return [...PRODUTOS_PADRAO];
    }
    lista.forEach(p => {
      if (p.id === 2 && (p.preco === 2 || p.preco === 2.00 || p.preco === 28.50)) {
        p.preco = 28.00;
      }
    });
    localStorage.setItem("cardapio_pro_produtos", JSON.stringify(lista));
    return lista;
  } catch (e) {
    return [...PRODUTOS_PADRAO];
  }
}

function salvarProdutos() {
  try {
    localStorage.setItem("cardapio_pro_produtos", JSON.stringify(produtos));
  } catch (e) {
    console.error("Erro ao salvar produtos:", e);
  }
}

function carregarCarrinho() {
  try {
    const salvos = localStorage.getItem("cardapio_pro_carrinho");
    if (!salvos) return [];
    return JSON.parse(salvos);
  } catch (e) {
    return [];
  }
}

function salvarCarrinho() {
  try {
    localStorage.setItem("cardapio_pro_carrinho", JSON.stringify(carrinho));
  } catch (e) {
    console.error("Erro ao salvar carrinho:", e);
  }
}

function carregarConfig() {
  try {
    const salvos = localStorage.getItem("cardapio_pro_config");
    if (!salvos) return { ...CONFIG_PADRAO };
    const conf = JSON.parse(salvos);
    if (!conf.nomeLoja || conf.nomeLoja === "Sabor & Cia Gourmet" || conf.nomeLoja === "Sabor & Arte Gourmet") {
      conf.nomeLoja = CONFIG_PADRAO.nomeLoja;
    }
    if (!conf.whatsapp || conf.whatsapp === "5579999999999") {
      conf.whatsapp = CONFIG_PADRAO.whatsapp;
    }
    if (conf.taxaEntrega === 5 || conf.taxaEntrega === undefined || conf.taxaEntrega === null || isNaN(Number(conf.taxaEntrega))) {
      conf.taxaEntrega = 0;
    }
    if (!conf.chavePix || conf.chavePix.includes("pix@") || conf.chavePix.includes("saborearte") || conf.chavePix.includes("hamburguerdosamigos")) {
      conf.chavePix = CONFIG_PADRAO.chavePix;
    }
    localStorage.setItem("cardapio_pro_config", JSON.stringify(conf));
    return conf;
  } catch (e) {
    return { ...CONFIG_PADRAO };
  }
}

function salvarConfig() {
  try {
    localStorage.setItem("cardapio_pro_config", JSON.stringify(configLoja));
  } catch (e) {
    console.error("Erro ao salvar configurações:", e);
  }
}

// ==========================================================================
// 4. FORMATADORES E TOAST
// ==========================================================================
const formatadorMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatarPreco(valor) {
  return formatadorMoeda.format(valor || 0);
}

function mostrarToast(mensagem, icone = "✅") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerHTML = `<span>${icone}</span> <span>${mensagem}</span>`;
  toast.classList.add("show");

  clearTimeout(toast.tempo);
  toast.tempo = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// MODAL DE CONFIRMAÇÃO CUSTOMIZADO (Substitui confirm NATIVO)
function solicitarConfirmacao(titulo, mensagem, icone, acao) {
  const modalConf = document.getElementById("modal-confirmacao");
  const elTitulo = document.getElementById("confirm-titulo");
  const elMensagem = document.getElementById("confirm-mensagem");
  const elIcone = document.getElementById("confirm-icon");

  if (!modalConf) {
    if (confirm(mensagem)) acao();
    return;
  }

  if (elTitulo) elTitulo.textContent = titulo;
  if (elMensagem) elMensagem.textContent = mensagem;
  if (elIcone) elIcone.textContent = icone || "⚠️";

  acaoConfirmacaoPendente = acao;

  if (typeof modalConf.showModal === "function") {
    modalConf.showModal();
  } else {
    modalConf.setAttribute("open", "true");
  }
}

function fecharModalConfirmacao() {
  const modalConf = document.getElementById("modal-confirmacao");
  if (modalConf) {
    if (typeof modalConf.close === "function") modalConf.close();
    else modalConf.removeAttribute("open");
  }
  acaoConfirmacaoPendente = null;
}

// ==========================================================================
// 5. GERENCIAMENTO DO CARRINHO
// ==========================================================================
function obterQtdItem(produtoId) {
  const item = carrinho.find(it => it.id === produtoId);
  return item ? item.quantidade : 0;
}

function adicionarAoCarrinho(produtoId) {
  const produto = produtos.find(p => p.id === produtoId);
  if (!produto) return;

  const existente = carrinho.find(it => it.id === produtoId);
  if (existente) {
    existente.quantidade += 1;
    existente.preco = produto.preco;
    existente.nome = produto.nome;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      icone: produto.icone,
      imagem: produto.imagem,
      quantidade: 1
    });
  }

  salvarCarrinho();
  atualizarInterface();
  mostrarToast(`${produto.nome} adicionado ao pedido!`, "🛒");
}

function alterarQuantidade(produtoId, delta) {
  const index = carrinho.findIndex(it => it.id === produtoId);
  if (index === -1) return;

  carrinho[index].quantidade += delta;

  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
    mostrarToast("Item removido do pedido", "🗑️");
  }

  salvarCarrinho();
  atualizarInterface();
}

function removerItemCarrinho(produtoId) {
  carrinho = carrinho.filter(it => it.id !== produtoId);
  salvarCarrinho();
  atualizarInterface();
  mostrarToast("Item removido", "🗑️");
}

function limparCarrinho() {
  if (carrinho.length === 0) return;
  solicitarConfirmacao(
    "Esvaziar Carrinho?",
    "Deseja remover todos os itens selecionados do seu pedido?",
    "🧹",
    () => {
      carrinho = [];
      salvarCarrinho();
      atualizarInterface();
      fecharModal();
      mostrarToast("Carrinho esvaziado!", "🧹");
    }
  );
}

function calcularTotais() {
  const totalQtd = carrinho.reduce((soma, it) => soma + it.quantidade, 0);
  const subtotalValor = carrinho.reduce((soma, it) => soma + (it.preco * it.quantidade), 0);
  
  const selectAtendimento = document.getElementById("tipo-atendimento");
  const ehDelivery = selectAtendimento ? selectAtendimento.value === "Delivery" : true;
  const taxaEntrega = (ehDelivery && totalQtd > 0) ? (configLoja.taxaEntrega || 0) : 0;
  const totalGeral = subtotalValor + taxaEntrega;

  return { totalQtd, subtotalValor, taxaEntrega, totalGeral };
}

// ==========================================================================
// 6. RENDERIZAÇÃO DOS PRODUTOS
// ==========================================================================
function renderizarProdutos() {
  const grid = document.getElementById("grid-produtos");
  const alertaVazio = document.getElementById("vazio-alerta");
  const tituloCat = document.getElementById("titulo-categoria");
  const badgeTotal = document.getElementById("badge-total-itens");

  if (!grid) return;

  // Filtragem combinada
  const filtrados = produtos.filter(p => {
    const matchCat = categoriaAtiva === "todos" || p.categoria === categoriaAtiva;
    const matchBusca = termoBusca === "" || 
      p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (p.descricao && p.descricao.toLowerCase().includes(termoBusca.toLowerCase()));
    return matchCat && matchBusca;
  });

  // Atualiza título da seção
  const nomesCategorias = {
    todos: "Todos os Produtos",
    lanches: "🍔 Lanches Artesanais",
    porcoes: "🍟 Porções & Petiscos",
    bebidas: "🥤 Bebidas Geladas",
    sobremesas: "🍰 Sobremesas Gourmet"
  };

  if (tituloCat) {
    tituloCat.textContent = termoBusca ? `Resultados para "${termoBusca}"` : (nomesCategorias[categoriaAtiva] || "Cardápio");
  }
  if (badgeTotal) {
    badgeTotal.textContent = `${filtrados.length} ${filtrados.length === 1 ? "produto" : "produtos"}`;
  }

  // Estado vazio
  if (filtrados.length === 0) {
    grid.innerHTML = "";
    if (alertaVazio) alertaVazio.style.display = "block";
    return;
  }
  if (alertaVazio) alertaVazio.style.display = "none";

  // Gera os cards dos produtos
  grid.innerHTML = filtrados.map(p => {
    const qtdNoCarrinho = obterQtdItem(p.id);
    const estaNoCarrinho = qtdNoCarrinho > 0;

    let badgeClass = "";
    if (p.badge === "Mais Pedido") badgeClass = "mais-pedido";
    else if (p.badge === "Chef Special") badgeClass = "chef";
    else if (p.badge === "Novo") badgeClass = "novo";
    else if (p.badge === "Vegetariano") badgeClass = "vegetariano";

    return `
      <article class="card-item ${estaNoCarrinho ? 'no-carrinho' : ''}" data-id="${p.id}">
        ${p.badge ? `<span class="card-badge-tag ${badgeClass}">${p.badge}</span>` : ''}

        <div class="card-foto-wrapper">
          ${p.imagem ? `
            <img src="${p.imagem}" alt="${p.nome}" class="card-foto" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'card-foto-fallback\\'>${p.icone || '🍽️'}</div>';">
          ` : `
            <div class="card-foto-fallback">${p.icone || '🍽️'}</div>
          `}
        </div>

        <div class="card-topo">
          <h3 class="card-nome">${p.nome}</h3>
          <p class="card-descricao">${p.descricao || 'Sem descrição informada.'}</p>
        </div>

        <div class="card-rodape">
          <div class="card-preco">${formatarPreco(p.preco)}</div>
          
          <div class="card-acoes">
            ${estaNoCarrinho ? `
              <div class="stepper-box">
                <button class="btn-step" onclick="alterarQuantidade(${p.id}, -1)" title="Diminuir" aria-label="Diminuir quantidade">-</button>
                <span class="step-valor">${qtdNoCarrinho}</span>
                <button class="btn-step" onclick="alterarQuantidade(${p.id}, 1)" title="Aumentar" aria-label="Aumentar quantidade">+</button>
              </div>
            ` : `
              <button class="btn-pedir-card" onclick="adicionarAoCarrinho(${p.id})">
                + Adicionar
              </button>
            `}
            <button class="btn-card-action" onclick="abrirModalEdicao(${p.id})" title="Editar produto" aria-label="Editar produto">✏️</button>
            <button class="btn-card-action" onclick="excluirProdutoDoCardapio(${p.id})" title="Remover produto" aria-label="Remover produto">🗑️</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Excluir produto do cardápio geral
function excluirProdutoDoCardapio(produtoId) {
  const prod = produtos.find(p => p.id === produtoId);
  if (!prod) return;

  solicitarConfirmacao(
    "Excluir Produto?",
    `Deseja remover "${prod.nome}" permanentemente do cardápio?`,
    "🗑️",
    () => {
      produtos = produtos.filter(p => p.id !== produtoId);
      carrinho = carrinho.filter(it => it.id !== produtoId);

      salvarProdutos();
      salvarCarrinho();
      atualizarInterface();
      fecharModalConfirmacao();
      mostrarToast("Produto excluído do cardápio!", "🗑️");
    }
  );
}

// ==========================================================================
// 7. EDIÇÃO E CONFIGURAÇÕES
// ==========================================================================
const modalEditar = document.getElementById("modal-editar-produto");
const modalConfig = document.getElementById("modal-configuracoes");

function abrirModalEdicao(id) {
  const prod = produtos.find(p => p.id === id);
  if (!prod) return;

  document.getElementById("edit-id").value = prod.id;
  document.getElementById("edit-nome").value = prod.nome;
  document.getElementById("edit-categoria").value = prod.categoria;
  document.getElementById("edit-preco").value = prod.preco;
  document.getElementById("edit-badge").value = prod.badge || "";
  document.getElementById("edit-imagem").value = prod.imagem || "";
  document.getElementById("edit-descricao").value = prod.descricao || "";

  if (modalEditar && typeof modalEditar.showModal === "function") {
    modalEditar.showModal();
  } else if (modalEditar) {
    modalEditar.setAttribute("open", "true");
  }
}

function fecharModalEdicao() {
  if (modalEditar && typeof modalEditar.close === "function") {
    modalEditar.close();
  } else if (modalEditar) {
    modalEditar.removeAttribute("open");
  }
}

function salvarEdicaoProduto() {
  const id = parseInt(document.getElementById("edit-id").value);
  const nome = document.getElementById("edit-nome").value.trim();
  const categoria = document.getElementById("edit-categoria").value;
  const preco = parseFloat(document.getElementById("edit-preco").value);
  const badge = document.getElementById("edit-badge").value;
  const imagem = document.getElementById("edit-imagem").value.trim();
  const descricao = document.getElementById("edit-descricao").value.trim();

  if (!nome || isNaN(preco) || preco <= 0) {
    mostrarToast("Preencha nome e preço válido!", "⚠️");
    return;
  }

  const idx = produtos.findIndex(p => p.id === id);
  if (idx !== -1) {
    produtos[idx].nome = nome;
    produtos[idx].categoria = categoria;
    produtos[idx].preco = preco;
    produtos[idx].badge = badge;
    produtos[idx].imagem = imagem;
    produtos[idx].descricao = descricao;

    // Atualiza carrinho se já tiver esse item
    const itemCar = carrinho.find(c => c.id === id);
    if (itemCar) {
      itemCar.nome = nome;
      itemCar.preco = preco;
      itemCar.imagem = imagem;
    }

    salvarProdutos();
    salvarCarrinho();
    atualizarInterface();
    fecharModalEdicao();
    mostrarToast("Produto atualizado com sucesso!", "✨");
  }
}

function abrirModalConfig() {
  document.getElementById("config-nome-loja").value = configLoja.nomeLoja || "";
  document.getElementById("config-whatsapp").value = configLoja.whatsapp || "";
  document.getElementById("config-taxa-entrega").value = configLoja.taxaEntrega || 0;
  document.getElementById("config-chave-pix").value = configLoja.chavePix || "";

  if (modalConfig && typeof modalConfig.showModal === "function") {
    modalConfig.showModal();
  } else if (modalConfig) {
    modalConfig.setAttribute("open", "true");
  }
}

function fecharModalConfig() {
  if (modalConfig && typeof modalConfig.close === "function") {
    modalConfig.close();
  } else if (modalConfig) {
    modalConfig.removeAttribute("open");
  }
}

function salvarConfiguracoesLoja() {
  const nome = document.getElementById("config-nome-loja")?.value.trim() || CONFIG_PADRAO.nomeLoja;
  const wa = document.getElementById("config-whatsapp")?.value.replace(/\D/g, "") || CONFIG_PADRAO.whatsapp;
  const taxaVal = document.getElementById("config-taxa-entrega")?.value;
  const taxa = (taxaVal === "" || isNaN(parseFloat(taxaVal))) ? 0 : parseFloat(taxaVal);
  const pix = document.getElementById("config-chave-pix")?.value.trim() || CONFIG_PADRAO.chavePix;

  configLoja = {
    nomeLoja: nome,
    whatsapp: wa,
    taxaEntrega: taxa,
    chavePix: pix
  };

  salvarConfig();
  atualizarInterface();
  fecharModalConfig();
  mostrarToast("Configurações salvas com sucesso!", "⚙️");
}

// ==========================================================================
// 8. ATUALIZAÇÃO DA INTERFACE GERAL (BARRA & MODAL)
// ==========================================================================
function atualizarInterface() {
  // Atualiza dados visíveis da loja no cabeçalho
  const elNomeLoja = document.getElementById("display-nome-loja");
  const elTaxaBadge = document.getElementById("display-taxa-badge");
  const elPixChave = document.getElementById("pix-chave-texto");

  if (elNomeLoja) elNomeLoja.textContent = configLoja.nomeLoja;
  if (elTaxaBadge) {
    if (!configLoja.taxaEntrega || Number(configLoja.taxaEntrega) === 0) {
      elTaxaBadge.textContent = "🛵 Entrega Grátis";
    } else {
      elTaxaBadge.textContent = `🛵 Entrega ${formatarPreco(configLoja.taxaEntrega)}`;
    }
  }
  if (elPixChave) elPixChave.textContent = configLoja.chavePix;

  renderizarProdutos();

  const { totalQtd, subtotalValor, taxaEntrega, totalGeral } = calcularTotais();

  // 1. Atualizar Barra Flutuante
  const carrinhoQtd = document.getElementById("carrinho-qtd");
  const carrinhoResumo = document.getElementById("carrinho-resumo-texto");
  const carrinhoTotal = document.getElementById("carrinho-total-valor");

  if (carrinhoQtd) carrinhoQtd.textContent = totalQtd;
  if (carrinhoResumo) {
    carrinhoResumo.textContent = totalQtd === 0 
      ? "Nenhum item selecionado" 
      : `${totalQtd} ${totalQtd === 1 ? "item selecionado" : "itens selecionados"}`;
  }
  if (carrinhoTotal) carrinhoTotal.textContent = formatarPreco(subtotalValor);

  // 2. Atualizar Lista no Modal de Checkout
  const listaModal = document.getElementById("pedido-itens-lista");
  const modalSubtotalValor = document.getElementById("modal-subtotal-valor");
  const modalTaxaValor = document.getElementById("modal-taxa-valor");
  const modalValorTotal = document.getElementById("modal-valor-total");

  if (listaModal) {
    if (carrinho.length === 0) {
      listaModal.innerHTML = `
        <div style="text-align: center; padding: 24px; color: #64748b;">
          <span style="font-size: 2rem; display: block; margin-bottom: 6px;">🛒</span>
          <p style="font-size: 1.05rem; font-weight: 700; color: var(--dark); margin-bottom: 4px;">Seu carrinho está vazio</p>
          <p style="font-size: 0.85rem;">Selecione delícias do nosso cardápio para montar seu pedido.</p>
        </div>
      `;
    } else {
      listaModal.innerHTML = carrinho.map(item => `
        <div class="modal-item-linha">
          <div class="modal-item-detalhes">
            <div class="modal-item-nome">${item.icone || '🍽️'} ${item.nome}</div>
            <div class="modal-item-unit">${item.quantidade}x de ${formatarPreco(item.preco)}</div>
          </div>
          <div class="stepper-box">
            <button class="btn-step" onclick="alterarQuantidade(${item.id}, -1)" title="Diminuir" aria-label="Diminuir">-</button>
            <span class="step-valor">${item.quantidade}</span>
            <button class="btn-step" onclick="alterarQuantidade(${item.id}, 1)" title="Aumentar" aria-label="Aumentar">+</button>
          </div>
          <div class="modal-item-subtotal">${formatarPreco(item.preco * item.quantidade)}</div>
        </div>
      `).join("");
    }
  }

  if (modalSubtotalValor) modalSubtotalValor.textContent = formatarPreco(subtotalValor);
  if (modalTaxaValor) modalTaxaValor.textContent = formatarPreco(taxaEntrega);
  if (modalValorTotal) modalValorTotal.textContent = formatarPreco(totalGeral);
}

// ==========================================================================
// 9. MODAL DE FINALIZAÇÃO & WHATSAPP
// ==========================================================================
const modalPedido = document.getElementById("modal-pedido");
const btnAbrirPedido = document.getElementById("btn-abrir-pedido");
const btnFecharModal = document.getElementById("btn-fechar-modal");
const btnLimparTudo = document.getElementById("btn-limpar-tudo");
const btnEnviarWhatsApp = document.getElementById("btn-enviar-whatsapp");

const clienteNomeInput = document.getElementById("cliente-nome");
const tipoAtendimentoSelect = document.getElementById("tipo-atendimento");
const clienteLocalInput = document.getElementById("cliente-local");
const rotuloLocal = document.getElementById("rotulo-local");
const formaPagamentoSelect = document.getElementById("forma-pagamento");
const grupoPix = document.getElementById("grupo-pix");
const grupoTroco = document.getElementById("grupo-troco");
const pedidoTrocoInput = document.getElementById("pedido-troco");
const pedidoObsInput = document.getElementById("pedido-obs");
const linhaTaxaEntrega = document.getElementById("linha-taxa-entrega");

function abrirModal() {
  atualizarInterface();
  if (modalPedido && typeof modalPedido.showModal === "function") {
    modalPedido.showModal();
  } else if (modalPedido) {
    modalPedido.setAttribute("open", "true");
  }
}

function fecharModal() {
  if (modalPedido && typeof modalPedido.close === "function") {
    modalPedido.close();
  } else if (modalPedido) {
    modalPedido.removeAttribute("open");
  }
}

// Adaptação dos campos conforme tipo de atendimento e forma de pagamento
if (tipoAtendimentoSelect) {
  tipoAtendimentoSelect.addEventListener("change", () => {
    const tipo = tipoAtendimentoSelect.value;
    if (tipo === "Delivery") {
      rotuloLocal.textContent = "Endereço Completo de Entrega *";
      clienteLocalInput.placeholder = "Rua, Número, Bairro, Ponto de Referência";
      clienteLocalInput.required = true;
      if (linhaTaxaEntrega) linhaTaxaEntrega.style.display = "flex";
    } else if (tipo === "Mesa") {
      rotuloLocal.textContent = "Número da Mesa *";
      clienteLocalInput.placeholder = "Ex: Mesa 05";
      clienteLocalInput.required = true;
      if (linhaTaxaEntrega) linhaTaxaEntrega.style.display = "none";
    } else {
      rotuloLocal.textContent = "Ponto de Retirada";
      clienteLocalInput.placeholder = "Retirada no Balcão do Restaurante";
      clienteLocalInput.required = false;
      if (linhaTaxaEntrega) linhaTaxaEntrega.style.display = "none";
    }
    atualizarInterface();
  });
}

if (formaPagamentoSelect) {
  formaPagamentoSelect.addEventListener("change", () => {
    const forma = formaPagamentoSelect.value;
    if (grupoPix) grupoPix.style.display = (forma === "PIX") ? "block" : "none";
    if (grupoTroco) grupoTroco.style.display = (forma === "Dinheiro") ? "block" : "none";
  });
}

// Copiar Chave PIX
const btnCopiarPix = document.getElementById("btn-copiar-pix");
if (btnCopiarPix) {
  btnCopiarPix.addEventListener("click", () => {
    const chave = configLoja.chavePix || CONFIG_PADRAO.chavePix;
    navigator.clipboard.writeText(chave).then(() => {
      mostrarToast("Chave PIX copiada!", "⚡");
    }).catch(() => {
      mostrarToast("Chave: " + chave, "📋");
    });
  });
}

// Enviar pedido formatado para WhatsApp
function finalizarPedidoWhatsApp() {
  if (carrinho.length === 0) {
    mostrarToast("Seu carrinho está vazio!", "⚠️");
    return;
  }

  const nome = clienteNomeInput.value.trim();
  const tipo = tipoAtendimentoSelect.value;
  const local = clienteLocalInput.value.trim();
  const pagamento = formaPagamentoSelect.value;
  const troco = pedidoTrocoInput ? pedidoTrocoInput.value.trim() : "";
  const obs = pedidoObsInput.value.trim();

  if (!nome) {
    mostrarToast("Informe seu nome completo!", "⚠️");
    clienteNomeInput.focus();
    return;
  }

  if (tipo !== "Balcão" && !local) {
    mostrarToast("Informe o local ou endereço!", "⚠️");
    clienteLocalInput.focus();
    return;
  }

  const { subtotalValor, taxaEntrega, totalGeral } = calcularTotais();
  const agora = new Date().toLocaleString("pt-BR");

  // Montagem da mensagem estruturada
  let texto = `*🍽️ NOVO PEDIDO - ${configLoja.nomeLoja.toUpperCase()}*\n`;
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

  carrinho.forEach(it => {
    texto += `• ${it.quantidade}x ${it.nome} - ${formatarPreco(it.preco * it.quantidade)}\n`;
  });

  texto += `----------------------------------------\n`;
  texto += `💰 *Subtotal:* ${formatarPreco(subtotalValor)}\n`;
  if (tipo === "Delivery") {
    texto += `🛵 *Taxa de Entrega:* ${formatarPreco(taxaEntrega)}\n`;
  }
  texto += `✨ *TOTAL A PAGAR:* ${formatarPreco(totalGeral)}\n`;
  texto += `----------------------------------------\n`;

  if (obs) {
    texto += `📝 *Observações:* ${obs}\n`;
  }

  const numeroWhats = configLoja.whatsapp || CONFIG_PADRAO.whatsapp;
  const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");

  fecharModal();
  solicitarConfirmacao(
    "Pedido Enviado!",
    "Seu pedido foi direcionado para o WhatsApp. Deseja limpar o carrinho agora?",
    "📲",
    () => {
      carrinho = [];
      salvarCarrinho();
      atualizarInterface();
      fecharModalConfirmacao();
    }
  );
}

// ==========================================================================
// 10. CADASTRO DE NOVO PRODUTO NO CARDÁPIO
// ==========================================================================
const btnSalvarNovo = document.getElementById("btn-salvar-novo");
const novoNomeInput = document.getElementById("novo-nome");
const novaCategoriaSelect = document.getElementById("nova-categoria");
const novoPrecoInput = document.getElementById("novo-preco");
const novoBadgeSelect = document.getElementById("novo-badge");
const novaImagemInput = document.getElementById("nova-imagem");
const novaDescricaoInput = document.getElementById("nova-descricao");

function cadastrarNovoProduto() {
  const nome = novoNomeInput.value.trim();
  const categoria = novaCategoriaSelect.value;
  const preco = parseFloat(novoPrecoInput.value);
  const badge = novoBadgeSelect ? novoBadgeSelect.value : "";
  const imagem = novaImagemInput ? novaImagemInput.value.trim() : "";
  const descricao = novaDescricaoInput.value.trim();

  if (!nome) {
    mostrarToast("Digite o nome do produto!", "⚠️");
    novoNomeInput.focus();
    return;
  }

  if (isNaN(preco) || preco <= 0) {
    mostrarToast("Informe um preço válido!", "⚠️");
    novoPrecoInput.focus();
    return;
  }

  const iconesPorCat = {
    lanches: "🍔",
    porcoes: "🍟",
    bebidas: "🥤",
    sobremesas: "🍰"
  };

  const novoProduto = {
    id: Date.now(),
    nome,
    categoria,
    preco,
    icone: iconesPorCat[categoria] || "🍽️",
    badge,
    imagem,
    descricao: descricao || "Produto artesanal preparado na hora."
  };

  produtos.unshift(novoProduto);
  salvarProdutos();

  // Limpa os campos
  novoNomeInput.value = "";
  novoPrecoInput.value = "";
  if (novaImagemInput) novaImagemInput.value = "";
  novaDescricaoInput.value = "";

  // Fecha accordion
  const details = document.getElementById("accordion-cadastro");
  if (details) details.removeAttribute("open");

  atualizarInterface();
  mostrarToast(`"${nome}" cadastrado com sucesso!`, "✨");
}

// ==========================================================================
// 11. EVENTOS E INICIALIZAÇÃO
// ==========================================================================
function configurarEventos() {
  // Busca em tempo real
  const campoBusca = document.getElementById("campo-busca");
  const btnLimparBusca = document.getElementById("btn-limpar-busca");
  const btnResetBusca = document.getElementById("btn-reset-busca");

  if (campoBusca) {
    campoBusca.addEventListener("input", (e) => {
      termoBusca = e.target.value.trim();
      if (btnLimparBusca) btnLimparBusca.style.display = termoBusca ? "flex" : "none";
      renderizarProdutos();
    });
  }

  if (btnLimparBusca) {
    btnLimparBusca.addEventListener("click", () => {
      if (campoBusca) campoBusca.value = "";
      termoBusca = "";
      btnLimparBusca.style.display = "none";
      renderizarProdutos();
      if (campoBusca) campoBusca.focus();
    });
  }

  if (btnResetBusca) {
    btnResetBusca.addEventListener("click", () => {
      if (campoBusca) campoBusca.value = "";
      termoBusca = "";
      categoriaAtiva = "todos";
      const tabBtns = document.querySelectorAll(".tab-btn[data-cat]");
      tabBtns.forEach(b => b.classList.toggle("active", b.dataset.cat === "todos"));
      if (btnLimparBusca) btnLimparBusca.style.display = "none";
      renderizarProdutos();
    });
  }

  // Abas de categorias do cardápio
  const tabBtns = document.querySelectorAll(".tab-btn[data-cat]");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      categoriaAtiva = btn.dataset.cat;
      renderizarProdutos();
    });
  });

  // Modal de pedido
  if (btnAbrirPedido) btnAbrirPedido.addEventListener("click", abrirModal);
  if (btnFecharModal) btnFecharModal.addEventListener("click", fecharModal);
  if (btnLimparTudo) btnLimparTudo.addEventListener("click", limparCarrinho);
  if (btnEnviarWhatsApp) btnEnviarWhatsApp.addEventListener("click", finalizarPedidoWhatsApp);

  // Modal de Edição
  const btnFecharEditar = document.getElementById("btn-fechar-editar");
  const btnSalvarEdicao = document.getElementById("btn-salvar-edicao");
  if (btnFecharEditar) btnFecharEditar.addEventListener("click", fecharModalEdicao);
  if (btnSalvarEdicao) btnSalvarEdicao.addEventListener("click", salvarEdicaoProduto);

  // Modal de Configurações
  const btnAbrirConfig = document.getElementById("btn-abrir-config");
  const btnFecharConfig = document.getElementById("btn-fechar-config");
  const btnSalvarConfig = document.getElementById("btn-salvar-config");
  if (btnAbrirConfig) btnAbrirConfig.addEventListener("click", abrirModalConfig);
  if (btnFecharConfig) btnFecharConfig.addEventListener("click", fecharModalConfig);
  if (btnSalvarConfig) btnSalvarConfig.addEventListener("click", salvarConfiguracoesLoja);

  // Modal de Confirmação
  const btnCancelConfirm = document.getElementById("btn-confirm-cancelar");
  const btnOkConfirm = document.getElementById("btn-confirm-ok");
  if (btnCancelConfirm) btnCancelConfirm.addEventListener("click", fecharModalConfirmacao);
  if (btnOkConfirm) {
    btnOkConfirm.addEventListener("click", () => {
      if (typeof acaoConfirmacaoPendente === "function") {
        acaoConfirmacaoPendente();
      } else {
        fecharModalConfirmacao();
      }
    });
  }

  // Cadastro de produto
  if (btnSalvarNovo) btnSalvarNovo.addEventListener("click", cadastrarNovoProduto);

  // Fechar modais ao clicar no backdrop (Target check seguro)
  const modalAuthAdmin = document.getElementById("modal-auth-admin");
  const modais = [modalPedido, modalEditar, modalConfig, modalAuthAdmin, document.getElementById("modal-confirmacao")];
  modais.forEach(mod => {
    if (mod) {
      mod.addEventListener("click", (e) => {
        if (e.target === mod) {
          if (mod === modalPedido) fecharModal();
          else if (mod === modalEditar) fecharModalEdicao();
          else if (mod === modalConfig) fecharModalConfig();
          else if (mod === modalAuthAdmin) {
            if (typeof mod.close === "function") mod.close();
            else mod.removeAttribute("open");
          }
          else if (mod.id === "modal-confirmacao") fecharModalConfirmacao();
        }
      });
    }
  });
}

// Expor funções globais para os botões inline
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.alterarQuantidade = alterarQuantidade;
window.removerItemCarrinho = removerItemCarrinho;
window.excluirProdutoDoCardapio = excluirProdutoDoCardapio;
window.abrirModalEdicao = abrirModalEdicao;

// Inicia aplicação
document.addEventListener("DOMContentLoaded", () => {
  configurarEventos();
  atualizarInterface();
});

// ==========================================================================
// FANESE AULA 05, 07 E 08: TAREFAS PRO, CATEGORIAS, TEMA, BACKUP E SUBTAREFAS
// ==========================================================================
(function() {
  const campo = document.getElementById("campo");
  const prioridade = document.getElementById("prioridade");
  const prazo = document.getElementById("prazo");
  const botao = document.getElementById("botao");
  const busca = document.getElementById("busca");
  const ordenar = document.getElementById("ordenar");
  const lista = document.getElementById("lista");
  const contador = document.getElementById("contador");
  const limpar = document.getElementById("limpar");
  const fTodas = document.getElementById("f-todas");
  const fPendentes = document.getElementById("f-pendentes");
  const fConcluidas = document.getElementById("f-concluidas");
  const rTotal = document.getElementById("r-total");
  const rPendentes = document.getElementById("r-pendentes");
  const rConcluidas = document.getElementById("r-concluidas");
  const rAtrasadas = document.getElementById("r-atrasadas");
  const categoria = document.getElementById("categoria");
  const filtroCategoria = document.getElementById("filtroCategoria");
  const barra = document.getElementById("barra");
  const progressoTexto = document.getElementById("progresso-texto");
  const btnTema = document.getElementById("tema");
  const botaoExportar = document.getElementById("exportar");
  const botaoImportar = document.getElementById("importar");
  const inputArquivo = document.getElementById("arquivo");

  if (!campo || !botao || !lista) return;

  // Cada tarefa é um objeto com vários campos.
  let tarefas = [];
  // Qual filtro está ativo agora ("todas", "pendentes" ou "concluidas").
  let filtro = "todas";

  // Salva a lista no navegador.
  function salvar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }

  // Carrega as tarefas salvas e o estado da sidebar ao abrir o app.
  function carregar() {
    const salvas = localStorage.getItem("tarefas");
    if (salvas) {
      try {
        tarefas = JSON.parse(salvas);
      } catch (erro) {
        tarefas = [];
      }
    }

    const sidebar = document.querySelector(".sidebar") || document.getElementById("sidebarApp") || document.getElementById("sidebar-app");
    const appLayout = document.getElementById("app-layout");
    const sidebarCollapsedSalvo = localStorage.getItem("sidebarRecolhida") === "true" || localStorage.getItem("sidebarCollapsed") === "true";
    if (sidebar) {
      sidebar.classList.toggle("collapsed", sidebarCollapsedSalvo);
    }
    document.body.classList.toggle("sidebar-collapsed", sidebarCollapsedSalvo);
    if (appLayout) {
      appLayout.classList.toggle("sidebar-collapsed", sidebarCollapsedSalvo);
    }

    mostrar();
  }

  // Devolve a data de hoje como texto "aaaa-mm-dd".
  function hojeTexto() {
    return new Date().toISOString().slice(0, 10);
  }

  // Diz se a tarefa está atrasada (tem prazo, não está feita e o prazo já passou).
  function estaAtrasada(tarefa) {
    return Boolean(tarefa.vence) && tarefa.vence !== "" && !tarefa.feito && tarefa.vence < hojeTexto();
  }

  function atualizarContador() {
    let pendentes = 0;
    for (let i = 0; i < tarefas.length; i++) {
      if (!tarefas[i].feito) {
        pendentes = pendentes + 1;
      }
    }
    if (contador) {
      contador.textContent = "Faltam " + pendentes + " de " + tarefas.length;
    }
  }

  // Atualiza o resumo: total, pendentes, concluídas e atrasadas.
  function atualizarResumo() {
    let pendentes = 0;
    let concluidas = 0;
    let atrasadas = 0;
    for (let i = 0; i < tarefas.length; i++) {
      if (tarefas[i].feito) {
        concluidas = concluidas + 1;
      } else {
        pendentes = pendentes + 1;
      }
      if (estaAtrasada(tarefas[i])) {
        atrasadas = atrasadas + 1;
      }
    }
    if (rTotal) rTotal.textContent = tarefas.length;
    if (rPendentes) rPendentes.textContent = pendentes;
    if (rConcluidas) rConcluidas.textContent = concluidas;
    if (rAtrasadas) rAtrasadas.textContent = atrasadas;
  }

  // Atualiza a barra de progresso (% de tarefas concluídas).
  function atualizarProgresso() {
    let concluidas = 0;
    for (let i = 0; i < tarefas.length; i++) {
      if (tarefas[i].feito) concluidas = concluidas + 1;
    }
    const pct = tarefas.length === 0 ? 0 : Math.round((concluidas / tarefas.length) * 100);
    if (barra) barra.style.width = pct + "%";
    if (progressoTexto) progressoTexto.textContent = pct + "% concluído";
  }

  // Destaca visualmente o botão do filtro que está ativo.
  function marcarFiltroAtivo() {
    if (fTodas) fTodas.classList.remove("ativo");
    if (fPendentes) fPendentes.classList.remove("ativo");
    if (fConcluidas) fConcluidas.classList.remove("ativo");
    if (filtro === "todas" && fTodas) fTodas.classList.add("ativo");
    if (filtro === "pendentes" && fPendentes) fPendentes.classList.add("ativo");
    if (filtro === "concluidas" && fConcluidas) fConcluidas.classList.add("ativo");
  }

  // Desenha na tela as tarefas (busca + filtro + ordenação + subtarefas).
  function mostrar() {
    lista.innerHTML = "";

    // 1) Busca por texto.
    let visiveis = tarefas;
    const termo = busca ? busca.value.trim().toLowerCase() : "";
    if (termo !== "") {
      visiveis = visiveis.filter(function (t) {
        return (t.texto || "").toLowerCase().indexOf(termo) !== -1;
      });
    }

    // 2) Filtro (todas / pendentes / concluídas).
    if (filtro === "pendentes") {
      visiveis = visiveis.filter(function (t) { return !t.feito; });
    }
    if (filtro === "concluidas") {
      visiveis = visiveis.filter(function (t) { return t.feito; });
    }

    // Filtro por categoria (se não for "todas").
    if (filtroCategoria && filtroCategoria.value !== "todas") {
      visiveis = visiveis.filter(function (t) { return t.categoria === filtroCategoria.value; });
    }

    // 3) Ordenação escolhida. slice() faz uma cópia.
    const ordem = { alta: 0, media: 1, baixa: 2 };
    visiveis = visiveis.slice();
    const ordVal = ordenar ? ordenar.value : "prioridade";
    if (ordVal === "prioridade") {
      visiveis.sort(function (a, b) {
        return (ordem[a.prioridade] ?? 1) - (ordem[b.prioridade] ?? 1);
      });
    }
    if (ordVal === "prazo") {
      visiveis.sort(function (a, b) {
        const va = !a.vence || a.vence === "" ? "9999-99-99" : a.vence;
        const vb = !b.vence || b.vence === "" ? "9999-99-99" : b.vence;
        return va < vb ? -1 : (va > vb ? 1 : 0);
      });
    }
    if (ordVal === "recentes") {
      visiveis.sort(function (a, b) {
        return (b.criadaEm || "") < (a.criadaEm || "") ? -1 : ((b.criadaEm || "") > (a.criadaEm || "") ? 1 : 0);
      });
    }

    // 4) Estado vazio.
    if (visiveis.length === 0) {
      lista.innerHTML = "<p class='vazio'>Nenhuma tarefa para mostrar aqui.</p>";
    }

    // 5) Desenha cada tarefa visível.
    for (let i = 0; i < visiveis.length; i++) {
      const tarefa = visiveis[i];

      const item = document.createElement("li");
      if (tarefa.feito) {
        item.classList.add("feita");
      }

      const etiqueta = document.createElement("span");
      etiqueta.className = "prioridade " + (tarefa.prioridade || "media");
      etiqueta.textContent = tarefa.prioridade || "media";

      const chip = document.createElement("span");
      chip.className = "categoria " + (tarefa.categoria || "pessoal");
      chip.textContent = tarefa.categoria || "pessoal";

      const texto = document.createElement("span");
      texto.className = "texto";
      texto.textContent = tarefa.texto;
      texto.addEventListener("click", function () {
        tarefa.feito = !tarefa.feito;
        salvar();
        mostrar();
      });

      const info = document.createElement("span");
      info.className = "info";
      let textoInfo = tarefa.criadaEm ? new Date(tarefa.criadaEm).toLocaleDateString("pt-BR") : "";
      if (tarefa.vence && tarefa.vence !== "") {
        textoInfo = textoInfo + " · vence " + new Date(tarefa.vence).toLocaleDateString("pt-BR");
      }
      info.textContent = textoInfo;

      item.appendChild(etiqueta);
      item.appendChild(chip);
      item.appendChild(texto);

      if (estaAtrasada(tarefa)) {
        const atraso = document.createElement("span");
        atraso.className = "atrasada";
        atraso.textContent = "Atrasada";
        item.appendChild(atraso);
      }

      item.appendChild(info);

      const editar = document.createElement("button");
      editar.textContent = "✏️";
      editar.className = "editar";
      editar.addEventListener("click", function () {
        const novo = prompt("Editar tarefa:", tarefa.texto);
        if (novo !== null && novo.trim() !== "") {
          tarefa.texto = novo.trim();
          salvar();
          mostrar();
        }
      });

      const apagar = document.createElement("button");
      apagar.textContent = "🗑";
      apagar.className = "apagar";
      apagar.addEventListener("click", function () {
        tarefas = tarefas.filter(function (t) { return t.id !== tarefa.id; });
        salvar();
        mostrar();
      });

      item.appendChild(editar);
      item.appendChild(apagar);

      // --- Subtarefas (os passos da tarefa) ---
      if (!tarefa.subtarefas) tarefa.subtarefas = [];

      const subBox = document.createElement("div");
      subBox.className = "subtarefas";

      // Contador de passos (ex.: "1/3 passos").
      const subContador = document.createElement("div");
      subContador.className = "sub-contador";
      const feitasSub = tarefa.subtarefas.filter(function (s) { return s.feito; }).length;
      subContador.textContent = feitasSub + "/" + tarefa.subtarefas.length + " passos";
      subBox.appendChild(subContador);

      // Desenha cada passo.
      for (let j = 0; j < tarefa.subtarefas.length; j++) {
        const sub = tarefa.subtarefas[j];

        const subItem = document.createElement("div");
        subItem.className = "sub-item" + (sub.feito ? " sub-feita" : "");

        const check = document.createElement("span");
        check.className = "sub-check";
        check.textContent = sub.feito ? "✅" : "⬜";
        check.addEventListener("click", function () {
          sub.feito = !sub.feito;
          salvar();
          mostrar();
        });

        const subTexto = document.createElement("span");
        subTexto.className = "sub-texto";
        subTexto.textContent = sub.texto;

        const subApagar = document.createElement("button");
        subApagar.className = "sub-apagar";
        subApagar.textContent = "×";
        subApagar.addEventListener("click", function () {
          tarefa.subtarefas = tarefa.subtarefas.filter(function (s) { return s.id !== sub.id; });
          salvar();
          mostrar();
        });

        subItem.appendChild(check);
        subItem.appendChild(subTexto);
        subItem.appendChild(subApagar);
        subBox.appendChild(subItem);
      }

      // Campo para adicionar um novo passo.
      const subForm = document.createElement("div");
      subForm.className = "sub-form";

      const subInput = document.createElement("input");
      subInput.className = "sub-input";
      subInput.placeholder = "Novo passo...";

      const subAdd = document.createElement("button");
      subAdd.className = "sub-add";
      subAdd.textContent = "+ Passo";
      subAdd.addEventListener("click", function () {
        const txt = subInput.value.trim();
        if (txt === "") return;
        tarefa.subtarefas.push({
          id: Date.now() + "-" + Math.floor(Math.random() * 100000),
          texto: txt,
          feito: false
        });
        salvar();
        mostrar();
      });

      subForm.appendChild(subInput);
      subForm.appendChild(subAdd);
      subBox.appendChild(subForm);

      item.appendChild(subBox);
      lista.appendChild(item);
    }

    atualizarContador();
    atualizarResumo();
    atualizarProgresso();
    marcarFiltroAtivo();
  }

  // Adiciona uma nova tarefa (com id, prioridade, categoria, prazo, subtarefas e data).
  botao.addEventListener("click", function () {
    const texto = campo.value;
    if (texto === "") return;
    tarefas.push({
      id: Date.now() + "-" + Math.floor(Math.random() * 100000),
      texto: texto,
      feito: false,
      prioridade: prioridade ? prioridade.value : "media",
      categoria: categoria ? categoria.value : "pessoal",
      vence: prazo ? prazo.value : "",
      subtarefas: [],
      criadaEm: new Date().toISOString()
    });
    salvar();
    mostrar();
    campo.value = "";
    if (prazo) prazo.value = "";
  });

  // Remove todas as tarefas já concluídas.
  if (limpar) {
    limpar.addEventListener("click", function () {
      tarefas = tarefas.filter(function (t) { return !t.feito; });
      salvar();
      mostrar();
    });
  }

  // ---- Backup: exportar e importar ----

  // Exporta todas as tarefas para um arquivo .json (download).
  function exportar() {
    const dados = JSON.stringify(tarefas, null, 2);
    const blob = new Blob([dados], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "minhas-tarefas.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  // Lê um arquivo .json escolhido pelo usuário e carrega as tarefas dele.
  function importar(arquivo) {
    const leitor = new FileReader();
    leitor.onload = function () {
      try {
        const lista = JSON.parse(leitor.result);
        if (Array.isArray(lista)) {
          tarefas = lista;
          salvar();
          mostrar();
          alert("Tarefas importadas com sucesso!");
        } else {
          alert("Esse arquivo nao parece um backup de tarefas.");
        }
      } catch (erro) {
        alert("Nao consegui ler o arquivo. Ele esta correto?");
      }
    };
    leitor.readAsText(arquivo);
  }

  if (botaoExportar) {
    botaoExportar.addEventListener("click", exportar);
  }
  if (botaoImportar && inputArquivo) {
    botaoImportar.addEventListener("click", function () {
      inputArquivo.click();
    });
    inputArquivo.addEventListener("change", function () {
      if (inputArquivo.files.length > 0) {
        importar(inputArquivo.files[0]);
      }
      inputArquivo.value = "";
    });
  }

  // Busca e ordenação redesenham a lista.
  if (busca) busca.addEventListener("input", function () { mostrar(); });
  if (ordenar) ordenar.addEventListener("change", function () { mostrar(); });
  if (filtroCategoria) filtroCategoria.addEventListener("change", function () { mostrar(); });

  // Botões de filtro: mudam o filtro e redesenham.
  if (fTodas) fTodas.addEventListener("click", function () { filtro = "todas"; mostrar(); });
  if (fPendentes) fPendentes.addEventListener("click", function () { filtro = "pendentes"; mostrar(); });
  if (fConcluidas) fConcluidas.addEventListener("click", function () { filtro = "concluidas"; mostrar(); });

  // ---- Tema claro/escuro ----
  function aplicarTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);
    if (btnTema) btnTema.textContent = tema === "escuro" ? "☀️" : "🌙";
  }

  function carregarTema() {
    let tema = localStorage.getItem("tema");
    if (!tema) {
      const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
      tema = prefereEscuro ? "escuro" : "claro";
    }
    aplicarTema(tema);
  }

  if (btnTema) {
    btnTema.addEventListener("click", function () {
      const atual = document.documentElement.getAttribute("data-theme");
      const novo = atual === "escuro" ? "claro" : "escuro";
      aplicarTema(novo);
      localStorage.setItem("tema", novo);
    });
  }

  // ---- Navegação por Abas (Tabs) com persistência no localStorage ----
  const botoesAbas = document.querySelectorAll(".tabs-nav .tab-btn");
  const conteudosAbas = document.querySelectorAll(".tab-content");

  function ativarAba(idAba) {
    if (!idAba) return;
    const alvo = document.getElementById(idAba);
    if (!alvo) return;

    botoesAbas.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === idAba);
    });

    conteudosAbas.forEach(function (sec) {
      sec.classList.toggle("active", sec.id === idAba);
    });

    localStorage.setItem("abaAtiva", idAba);
  }

  botoesAbas.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const idAba = btn.getAttribute("data-tab");
      ativarAba(idAba);
    });
  });

  const abaSalva = localStorage.getItem("abaAtiva");
  if (abaSalva && document.getElementById(abaSalva)) {
    ativarAba(abaSalva);
  }

  carregarTema();
  carregar();
})();

document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar") || document.getElementById("sidebarApp") || document.getElementById("sidebar-app");
  const btnToggle = document.getElementById("btnToggleSidebar");
  const appLayout = document.getElementById("app-layout");

  if (btnToggle && sidebar) {
    // Recupera estado salvo
    if (localStorage.getItem("sidebarRecolhida") === "true" || localStorage.getItem("sidebarCollapsed") === "true") {
      sidebar.classList.add("collapsed");
      document.body.classList.add("sidebar-collapsed");
      if (appLayout) appLayout.classList.add("sidebar-collapsed");
    }

    if (!btnToggle.dataset.sidebarBound) {
      btnToggle.dataset.sidebarBound = "true";
      btnToggle.addEventListener("click", function (e) {
        e.preventDefault();
        sidebar.classList.toggle("collapsed");
        document.body.classList.toggle("sidebar-collapsed");

        const estaRecolhida = sidebar.classList.contains("collapsed");
        if (appLayout) appLayout.classList.toggle("sidebar-collapsed", estaRecolhida);
        localStorage.setItem("sidebarRecolhida", estaRecolhida);
        localStorage.setItem("sidebarCollapsed", estaRecolhida);
      });
    }
  }
});

