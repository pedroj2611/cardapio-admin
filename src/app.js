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
  document.body.classList.add('modal-aberto');
  document.documentElement.classList.add('modal-aberto');
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
  document.body.classList.remove('modal-aberto');
  document.documentElement.classList.remove('modal-aberto');
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
  document.body.classList.add('modal-aberto');
  document.documentElement.classList.add('modal-aberto');
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
  document.body.classList.remove('modal-aberto');
  document.documentElement.classList.remove('modal-aberto');
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
  document.body.classList.add('modal-aberto');
  document.documentElement.classList.add('modal-aberto');
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
  document.body.classList.remove('modal-aberto');
  document.documentElement.classList.remove('modal-aberto');
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
  document.body.classList.add('modal-aberto');
  document.documentElement.classList.add('modal-aberto');
  atualizarInterface();
  if (modalPedido && typeof modalPedido.showModal === "function") {
    modalPedido.showModal();
  } else if (modalPedido) {
    modalPedido.setAttribute("open", "true");
  }
}

function fecharModal() {
  document.body.classList.remove('modal-aberto');
  document.documentElement.classList.remove('modal-aberto');
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
  const statusConexao = document.getElementById("statusConexao");
  const barraInstalar = document.getElementById("barraInstalar");
  const btnInstalar = document.getElementById("btnInstalar");
  const dicaIOS = document.getElementById("dicaIOS");

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
  // Desenha na tela as tarefas (Cards Modernos: busca + filtro + ordenação + subtarefas).
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
      atualizarContador();
      atualizarResumo();
      atualizarProgresso();
      marcarFiltroAtivo();
      return;
    }

    // 5) Desenha cada tarefa em Card Moderno independente.
    for (let i = 0; i < visiveis.length; i++) {
      const tarefa = visiveis[i];
      const estaFeita = Boolean(tarefa.feito || tarefa.concluido);
      const atraso = estaAtrasada(tarefa);
      const prioridadeNome = (tarefa.prioridade || "media").toLowerCase();
      const categoriaNome = (tarefa.categoria || "pessoal").toLowerCase();

      const item = document.createElement("li");
      item.className = "card-tarefa-moderna" + (estaFeita ? " feita" : "") + (atraso ? " card-atrasada" : "");
      item.dataset.id = tarefa.id;

      // Header: Badges + Prazo + Lixeira
      const cardHeader = document.createElement("div");
      cardHeader.className = "card-tarefa-header";

      const badgesWrap = document.createElement("div");
      badgesWrap.className = "card-tarefa-badges";

      const badgePrioridade = document.createElement("span");
      badgePrioridade.className = "badge-prioridade " + prioridadeNome;
      badgePrioridade.textContent = prioridadeNome.toUpperCase();

      const badgeCategoria = document.createElement("span");
      badgeCategoria.className = "categoria " + categoriaNome;
      badgeCategoria.textContent = categoriaNome;

      badgesWrap.appendChild(badgePrioridade);
      badgesWrap.appendChild(badgeCategoria);

      if (atraso) {
        const badgeAtrasada = document.createElement("span");
        badgeAtrasada.className = "atrasada";
        badgeAtrasada.innerHTML = "⏰ ATRASADA";
        badgesWrap.appendChild(badgeAtrasada);
      }

      const headerRight = document.createElement("div");
      headerRight.className = "card-tarefa-header-right";

      const spanPrazo = document.createElement("span");
      spanPrazo.className = "card-prazo";
      spanPrazo.title = "Prazo da tarefa";
      spanPrazo.innerHTML = "<span class='prazo-icon'>📅</span> <span class='prazo-txt'>" + (tarefa.vence || "Hoje") + "</span>";

      const btnApagar = document.createElement("button");
      btnApagar.type = "button";
      btnApagar.className = "btn-apagar-card";
      btnApagar.title = "Apagar tarefa";
      btnApagar.innerHTML = "<span class='trash-icon'>🗑️</span>";
      btnApagar.addEventListener("click", function (e) {
        e.stopPropagation();
        tarefas = tarefas.filter(function (t) { return t.id !== tarefa.id; });
        salvar();
        mostrar();
        if (typeof mostrarToast === "function") mostrarToast("Tarefa excluída!", "🗑️");
      });

      headerRight.appendChild(spanPrazo);
      headerRight.appendChild(btnApagar);

      cardHeader.appendChild(badgesWrap);
      cardHeader.appendChild(headerRight);

      // Centro: Checkbox Customizado + Texto nítido
      const cardBody = document.createElement("div");
      cardBody.className = "card-tarefa-body";

      const checkLabel = document.createElement("label");
      checkLabel.className = "custom-checkbox-wrap";
      checkLabel.title = estaFeita ? "Marcar como pendente" : "Marcar como concluída";

      const checkInput = document.createElement("input");
      checkInput.type = "checkbox";
      checkInput.className = "custom-checkbox-input";
      checkInput.checked = estaFeita;

      const checkMark = document.createElement("span");
      checkMark.className = "custom-checkbox-mark";

      checkLabel.appendChild(checkInput);
      checkLabel.appendChild(checkMark);

      const infoWrap = document.createElement("div");
      infoWrap.className = "card-tarefa-info";

      const spanTexto = document.createElement("span");
      spanTexto.className = "card-tarefa-texto texto";
      spanTexto.textContent = tarefa.texto;

      infoWrap.appendChild(spanTexto);

      if (tarefa.criadaEm) {
        const metaCriacao = document.createElement("span");
        metaCriacao.className = "card-tarefa-meta";
        const d = new Date(tarefa.criadaEm);
        metaCriacao.textContent = !isNaN(d.getTime()) ? "Criada em " + d.toLocaleDateString("pt-BR") : "Criada em " + tarefa.criadaEm;
        infoWrap.appendChild(metaCriacao);
      }

      function alternarStatus() {
        tarefa.feito = !tarefa.feito;
        salvar();
        mostrar();
      }

      checkInput.addEventListener("change", alternarStatus);
      spanTexto.addEventListener("click", alternarStatus);

      cardBody.appendChild(checkLabel);
      cardBody.appendChild(infoWrap);

      // Subtarefas (Passos)
      if (!tarefa.subtarefas) tarefa.subtarefas = [];
      const subtarefasArea = document.createElement("div");
      subtarefasArea.className = "card-subtarefas-area subtarefas";

      const totalSub = tarefa.subtarefas.length;
      const feitasSub = tarefa.subtarefas.filter(function (s) { return s.feito; }).length;
      const pctSub = totalSub === 0 ? 0 : Math.round((feitasSub / totalSub) * 100);

      if (totalSub > 0) {
        const progressoSubWrap = document.createElement("div");
        progressoSubWrap.className = "sub-progresso-bar-wrap";

        const subInfoRow = document.createElement("div");
        subInfoRow.className = "sub-progresso-info";
        subInfoRow.innerHTML = "<span class='sub-progresso-label'>Passos da tarefa</span><span class='sub-progresso-count sub-contador'>" + feitasSub + "/" + totalSub + " concluídos</span>";

        const trilho = document.createElement("div");
        trilho.className = "sub-progresso-trilho";

        const fill = document.createElement("div");
        fill.className = "sub-progresso-fill";
        fill.style.width = pctSub + "%";

        trilho.appendChild(fill);
        progressoSubWrap.appendChild(subInfoRow);
        progressoSubWrap.appendChild(trilho);
        subtarefasArea.appendChild(progressoSubWrap);

        const subLista = document.createElement("div");
        subLista.className = "subtarefas-lista";

        for (let j = 0; j < tarefa.subtarefas.length; j++) {
          const sub = tarefa.subtarefas[j];

          const subItem = document.createElement("div");
          subItem.className = "sub-item-card sub-item" + (sub.feito ? " sub-feita" : "");

          const subCheck = document.createElement("button");
          subCheck.type = "button";
          subCheck.className = "sub-check-btn sub-check";
          subCheck.textContent = sub.feito ? "✅" : "⬜";
          subCheck.addEventListener("click", function () {
            sub.feito = !sub.feito;
            salvar();
            mostrar();
          });

          const subTexto = document.createElement("span");
          subTexto.className = "sub-item-texto sub-texto";
          subTexto.textContent = sub.texto;

          const subApagar = document.createElement("button");
          subApagar.type = "button";
          subApagar.className = "sub-apagar-btn sub-apagar";
          subApagar.textContent = "×";
          subApagar.addEventListener("click", function () {
            tarefa.subtarefas = tarefa.subtarefas.filter(function (s) { return s.id !== sub.id; });
            salvar();
            mostrar();
          });

          subItem.appendChild(subCheck);
          subItem.appendChild(subTexto);
          subItem.appendChild(subApagar);
          subLista.appendChild(subItem);
        }

        subtarefasArea.appendChild(subLista);
      }

      // Campo de adicionar novo passo
      const subForm = document.createElement("div");
      subForm.className = "sub-form-compacto sub-form";

      const subInput = document.createElement("input");
      subInput.type = "text";
      subInput.className = "sub-input-modern sub-input";
      subInput.placeholder = "Novo passo...";

      const subAdd = document.createElement("button");
      subAdd.type = "button";
      subAdd.className = "btn-add-passo sub-add";
      subAdd.textContent = "+ Passo";

      function adicionarPasso() {
        const txt = subInput.value.trim();
        if (txt === "") return;
        tarefa.subtarefas.push({
          id: Date.now() + "-" + Math.floor(Math.random() * 100000),
          texto: txt,
          feito: false
        });
        salvar();
        mostrar();
      }

      subAdd.addEventListener("click", adicionarPasso);
      subInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          adicionarPasso();
        }
      });

      subForm.appendChild(subInput);
      subForm.appendChild(subAdd);
      subtarefasArea.appendChild(subForm);

      item.appendChild(cardHeader);
      item.appendChild(cardBody);
      item.appendChild(subtarefasArea);

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
  // Gera e imprime relatório de turno das tarefas em PDF
  function gerarRelatorioPDF() {
    const agora = new Date();
    const dataHoraStr = agora.toLocaleDateString("pt-BR") + " às " + agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const total = tarefas.length;
    let concluidas = 0;
    let pendentes = 0;
    let atrasadas = 0;

    for (let i = 0; i < tarefas.length; i++) {
      if (tarefas[i].feito) concluidas++;
      else pendentes++;
      if (estaAtrasada(tarefas[i])) atrasadas++;
    }
    const percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100);

    const linhasHtml = tarefas.map(function (t, idx) {
      const feita = Boolean(t.feito);
      const atraso = estaAtrasada(t);
      const prioridade = (t.prioridade || "media").toUpperCase();
      const categoria = (t.categoria || "trabalho").toUpperCase();
      const statusBadge = feita ? "✔ CONCLUÍDA" : (atraso ? "⏰ ATRASADA" : "⏳ PENDENTE");
      const statusColor = feita ? "#10b981" : (atraso ? "#ef4444" : "#f59e0b");
      const subInfo = (t.subtarefas && t.subtarefas.length > 0)
        ? t.subtarefas.filter(function (s) { return s.feito; }).length + "/" + t.subtarefas.length + " passos"
        : "-";

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; ${feita ? 'background: #f8fafc; color: #64748b;' : ''}">
          <td style="padding: 10px; font-weight: bold; text-align: center;">${t.id || (idx + 1)}</td>
          <td style="padding: 10px; text-align: center;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 800; ${
              t.prioridade === 'alta' ? 'background: #fee2e2; color: #b91c1c;' :
              t.prioridade === 'baixa' ? 'background: #dcfce7; color: #15803d;' :
              'background: #fef3c7; color: #b45309;'
            }">${prioridade}</span>
          </td>
          <td style="padding: 10px; text-align: center; font-size: 12px; font-weight: 600;">${categoria}</td>
          <td style="padding: 10px;">
            <strong style="color: #0f172a; font-size: 13px; ${feita ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${t.texto || 'Tarefa'}</strong>
          </td>
          <td style="padding: 10px; text-align: center; font-size: 12px;">${t.vence || 'Hoje'}</td>
          <td style="padding: 10px; text-align: center; font-size: 11px; font-weight: 600;">${subInfo}</td>
          <td style="padding: 10px; text-align: center;">
            <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; background: ${statusColor}18; color: ${statusColor}; border: 1px solid ${statusColor}40;">
              ${statusBadge}
            </span>
          </td>
        </tr>
      `;
    }).join("");

    const printHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório Operacional de Turno - Hambúrguer dos Amigos</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { color: #0f172a; margin: 0; padding: 20px; background: #fff; font-size: 13px; }
    .header-print { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 20px; }
    .brand-title { font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 4px; text-transform: uppercase; }
    .report-subtitle { font-size: 13px; color: #475569; margin: 0; font-weight: 600; }
    .meta-info { text-align: right; font-size: 11px; color: #64748b; line-height: 1.5; }
    .kpis-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
    .kpi-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center; background: #f8fafc; }
    .kpi-val { font-size: 18px; font-weight: 900; color: #0f172a; }
    .kpi-lbl { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; }
    th { background: #f1f5f9; color: #334155; padding: 10px; text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
    .footer-print { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #cbd5e1; padding-top: 16px; margin-top: 30px; font-size: 11px; color: #64748b; }
    .signature-line { border-top: 1px solid #0f172a; width: 220px; text-align: center; padding-top: 4px; font-weight: 600; }
    .no-print-bar { background: #1e293b; color: #fff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; margin-bottom: 20px; }
    .btn-print { background: #10b981; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 13px; }
    @media print { .no-print-bar { display: none !important; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>📄 <strong>Visualização de Impressão / PDF</strong> — Folha de Turno</span>
    <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
  </div>
  <div class="header-print">
    <div>
      <h1 class="brand-title">🍔 Hambúrguer dos Amigos</h1>
      <p class="report-subtitle">Relatório Operacional de Tarefas & Monitoramento de Turno</p>
    </div>
    <div class="meta-info">
      <div><strong>Emissão:</strong> ${dataHoraStr}</div>
      <div><strong>Sistema:</strong> Cardápio Digital & Admin PWA</div>
    </div>
  </div>
  <div class="kpis-grid">
    <div class="kpi-card"><div class="kpi-val">${total}</div><div class="kpi-lbl">Total Tarefas</div></div>
    <div class="kpi-card"><div class="kpi-val" style="color: #d97706;">${pendentes}</div><div class="kpi-lbl">Pendentes</div></div>
    <div class="kpi-card"><div class="kpi-val" style="color: #10b981;">${concluidas}</div><div class="kpi-lbl">Concluídas</div></div>
    <div class="kpi-card"><div class="kpi-val" style="color: #ef4444;">${atrasadas}</div><div class="kpi-lbl">Atrasadas</div></div>
    <div class="kpi-card"><div class="kpi-val">${percentual}%</div><div class="kpi-lbl">Taxa Conclusão</div></div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 50px; text-align: center;">#</th>
        <th style="width: 90px; text-align: center;">Prioridade</th>
        <th style="width: 90px; text-align: center;">Categoria</th>
        <th>Descrição da Tarefa</th>
        <th style="width: 90px; text-align: center;">Prazo</th>
        <th style="width: 90px; text-align: center;">Subtarefas</th>
        <th style="width: 110px; text-align: center;">Status</th>
      </tr>
    </thead>
    <tbody>${linhasHtml}</tbody>
  </table>
  <div class="footer-print">
    <div>Documento gerado automaticamente para controle operacional e acadêmico (AV1).</div>
    <div class="signature-line">Visto do Responsável</div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 350);
    };
  </script>
</body>
</html>`;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printHtml);
      printWin.document.close();
      if (typeof mostrarToast === "function") mostrarToast("Relatório PDF pronto para impressão!", "📄");
    } else {
      window.print();
    }
  }

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
    if (typeof mostrarToast === "function") mostrarToast("Backup de tarefas exportado!", "💾");
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
          if (typeof mostrarToast === "function") mostrarToast(lista.length + " tarefas importadas com sucesso!", "📥");
          else alert("Tarefas importadas com sucesso!");
        } else {
          if (typeof mostrarToast === "function") mostrarToast("Esse arquivo não parece um backup válido.", "⚠️");
          else alert("Esse arquivo nao parece um backup de tarefas.");
        }
      } catch (erro) {
        if (typeof mostrarToast === "function") mostrarToast("Não consegui ler o arquivo JSON.", "⚠️");
        else alert("Nao consegui ler o arquivo. Ele esta correto?");
      }
    };
    leitor.readAsText(arquivo);
  }

  const btnRelatorioPdf = document.getElementById("btn-relatorio-pdf");
  if (btnRelatorioPdf) {
    btnRelatorioPdf.addEventListener("click", gerarRelatorioPDF);
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

  // ==========================================================================
  // FANESE AULA 09 (PARTE 2): STATUS DE CONEXÃO (ONLINE / OFFLINE - PASSO 31)
  // ==========================================================================

  // Mostra ou esconde o aviso de "offline".
  function atualizarConexao() {
    if (navigator.onLine) {
      if (statusConexao) statusConexao.hidden = true;
    } else {
      if (statusConexao) statusConexao.hidden = false;
    }
  }

  // O navegador avisa quando a conexão cai ou volta.
  window.addEventListener("online", atualizarConexao);
  window.addEventListener("offline", atualizarConexao);

  // Checa a conexão assim que o app abre.
  atualizarConexao();

  // ==========================================================================
  // FANESE AULA 09 (PARTE 1): INSTALAR O APP (PWA - PASSO 30)
  // ==========================================================================

  // Guarda o convite de instalação que o navegador oferece.
  let eventoInstalar = null;
  // Ponto de entrada único no desktop: botão "Instalar App" da sidebar.
  const btnSidebarInstalar = document.getElementById("btn-instalar-pwa");
  const btnFecharInstalar = document.getElementById("btnFecharInstalar");
  const mqMobile = window.matchMedia("(max-width: 768px)");

  // Sidebar no desktop; convite compacto (dispensável) apenas no mobile.
  function atualizarUIInstalacao() {
    const podeInstalar = Boolean(eventoInstalar);
    const dispensado = sessionStorage.getItem("convite-instalar-dispensado") === "true";
    if (btnSidebarInstalar) btnSidebarInstalar.style.display = podeInstalar ? "flex" : "none";
    if (barraInstalar) barraInstalar.hidden = !(podeInstalar && mqMobile.matches && !dispensado);
  }

  // O navegador avisa que o app PODE ser instalado.
  window.addEventListener("beforeinstallprompt", function (evento) {
    evento.preventDefault();
    eventoInstalar = evento;
    atualizarUIInstalacao();
  });

  function instalarApp() {
    if (!eventoInstalar) return;
    eventoInstalar.prompt();
    eventoInstalar.userChoice.then(function () {
      eventoInstalar = null;
      atualizarUIInstalacao();
    });
  }

  // Ao clicar no botão da sidebar ou no convite compacto do mobile.
  if (btnSidebarInstalar) btnSidebarInstalar.addEventListener("click", instalarApp);
  if (btnInstalar) btnInstalar.addEventListener("click", instalarApp);
  if (btnFecharInstalar) {
    btnFecharInstalar.addEventListener("click", function () {
      sessionStorage.setItem("convite-instalar-dispensado", "true");
      atualizarUIInstalacao();
    });
  }

  // Quando o app é instalado, esconde todos os pontos de instalação.
  window.addEventListener("appinstalled", function () {
    eventoInstalar = null;
    atualizarUIInstalacao();
  });

  // No iPhone não existe o convite automático: mostramos a dica do Safari.
  function checarIOS() {
    const ehIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const instalado = window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true;
    if (ehIOS && !instalado) {
      if (dicaIOS) dicaIOS.hidden = false;
    }
  }
  checarIOS();

  // Expor funções e variáveis úteis para console e testes
  window.atualizarConexao = atualizarConexao;
  window.checarIOS = checarIOS;

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

