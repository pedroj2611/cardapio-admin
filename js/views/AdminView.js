/**
 * ==========================================================================
 * VIEW LAYER - ADMIN DASHBOARD VIEW (src/js/views/AdminView.js)
 * ==========================================================================
 */

import { formatarPreco } from "./ProductView.js";

export const PEDIDOS_INICIAIS = [
  {
    id: "0001",
    hora: "Hoje 11:30",
    atendente: "João Silva",
    local: "Aberto",
    itens: "1x X-Bacon Artesanal",
    total: 32.90,
    tempo: "15 min",
    status: "Aberto",
    concluido: false
  },
  {
    id: "0002",
    hora: "Hoje 11:45",
    atendente: "Ana Souza",
    local: "Mesa 05",
    itens: "1x Smash Burger + 1x Coca",
    total: 35.00,
    tempo: "20 min",
    status: "Mesa 05",
    concluido: false
  },
  {
    id: "0003",
    hora: "Hoje 12:00",
    atendente: "Carlos Lima",
    local: "Delivery",
    itens: "2x Batata Rústica + 2x Suco",
    total: 72.00,
    tempo: "25 min",
    status: "Delivery",
    concluido: false
  },
  {
    id: "0004",
    hora: "Hoje 12:15",
    atendente: "Mario Santos",
    local: "Mesa 07",
    itens: "1x Chicken Crispy + 1x Brownie",
    total: 47.90,
    tempo: "10 min",
    status: "Mesa 07",
    concluido: false
  },
  {
    id: "0005",
    hora: "Hoje 12:30",
    atendente: "Juliana Silva",
    local: "Balcão",
    itens: "2x Heineken Long Neck",
    total: 24.00,
    tempo: "5 min",
    status: "Balcão",
    concluido: false
  }
];

export class AdminView {
  constructor() {
    this.pedidos = this.carregarPedidos();
    this.tbody = document.getElementById("admin-orders-table-body");
    this.elTotais = document.getElementById("admin-card-totais");
    this.elVendas = document.getElementById("admin-card-vendas");
    this.elTempo = document.getElementById("admin-card-tempo");
    this.elPendentes = document.getElementById("admin-card-pendentes");
    this.elContador = document.getElementById("contador-pedidos");
    this.tbodyProdutos = document.getElementById("admin-products-table-body");
  }

  // Carrega os pedidos do localStorage com try/catch (FANESE Aula 04 & 05)
  carregarPedidos() {
    try {
      const salvos = localStorage.getItem("cardapio_admin_pedidos");
      if (salvos) {
        return JSON.parse(salvos);
      }
      localStorage.setItem("cardapio_admin_pedidos", JSON.stringify(PEDIDOS_INICIAIS));
      return [...PEDIDOS_INICIAIS];
    } catch (e) {
      console.error("Erro ao carregar pedidos:", e);
      return [...PEDIDOS_INICIAIS];
    }
  }

  // Salva a lista de pedidos no localStorage com JSON.stringify (FANESE Aula 04 & 05)
  salvarPedidos() {
    try {
      localStorage.setItem("cardapio_admin_pedidos", JSON.stringify(this.pedidos));
    } catch (e) {
      console.error("Erro ao salvar pedidos:", e);
    }
  }

  // Conta quantas tarefas/pedidos ainda faltam atender (FANESE Aula 05 Parte 2)
  atualizarContador() {
    let pendentes = 0;
    for (let i = 0; i < this.pedidos.length; i++) {
      if (!this.pedidos[i].concluido) {
        pendentes = pendentes + 1;
      }
    }
    if (this.elContador) {
      this.elContador.textContent = "Faltam " + pendentes + " de " + this.pedidos.length + " pedidos a atender";
    }
    if (this.elPendentes) {
      this.elPendentes.textContent = pendentes;
    }
  }

  renderizarTabela(filtroBusca = "", filtroStatus = "") {
    if (!this.tbody) {
      this.tbody = document.getElementById("admin-orders-table-body");
    }
    if (!this.tbody) return;

    // Sempre recarrega do localStorage para garantir sincronismo com novos pedidos
    this.pedidos = this.carregarPedidos();

    let lista = this.pedidos;

    if (filtroBusca) {
      const termo = filtroBusca.toLowerCase();
      lista = lista.filter(p => 
        p.atendente.toLowerCase().includes(termo) ||
        p.local.toLowerCase().includes(termo) ||
        p.itens.toLowerCase().includes(termo)
      );
    }

    if (filtroStatus) {
      lista = lista.filter(p => p.local.toLowerCase().includes(filtroStatus.toLowerCase()));
    }

    this.tbody.innerHTML = "";

    // Estado vazio com classe .vazio (FANESE Aula 05 Parte 2)
    if (lista.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="7" class="vazio">
            Sua lista de pedidos está vazia no momento.
          </td>
        </tr>
      `;
      this.atualizarContador();
      this.atualizarCards();
      return;
    }

    lista.forEach(ped => {
      const tr = document.createElement("tr");
      if (ped.concluido) {
        tr.classList.add("pedido-concluido");
      }

      let badgeClass = "aberto";
      if (ped.local.includes("Mesa")) badgeClass = "mesa";
      if (ped.local.includes("Delivery")) badgeClass = "delivery";

      tr.innerHTML = `
        <td><strong>${ped.hora}</strong></td>
        <td>${ped.atendente}</td>
        <td><span class="status-tag ${badgeClass}">${ped.local}</span></td>
        <td>${ped.itens}</td>
        <td><strong>${formatarPreco(ped.total)}</strong></td>
        <td>${ped.tempo}</td>
        <td>
          <div class="action-btn-group">
            <button class="btn-action-outline btn-concluir-ped ${ped.concluido ? 'concluido' : ''}" data-id="${ped.id}" title="Marcar como concluído/aberto">
              ${ped.concluido ? "✔ Concluído" : "Marcar Pronto"}
            </button>
            <button class="btn-action-cancel btn-cancelar-ped" data-id="${ped.id}" title="Apagar pedido">
              🗑 Apagar
            </button>
          </div>
        </td>
      `;

      this.tbody.appendChild(tr);
    });

    this.atualizarContador();
    this.atualizarCards();
  }

  atualizarCards() {
    const totalPedidos = this.pedidos.length;
    const totalVendas = this.pedidos.reduce((acc, p) => acc + p.total, 0);

    if (this.elTotais) this.elTotais.textContent = totalPedidos;
    if (this.elVendas) this.elVendas.textContent = formatarPreco(totalVendas);
    if (this.elTempo) this.elTempo.textContent = "15 min";
  }

  // Marcar/Desmarcar como concluído usando operador "!" (FANESE Aula 05 Parte 1)
  alternarConcluido(id) {
    const ped = this.pedidos.find(p => p.id === id);
    if (ped) {
      ped.concluido = !ped.concluido;
      this.salvarPedidos();
      this.renderizarTabela();
    }
  }

  // Limpar todas as tarefas/pedidos já concluídos usando filter (FANESE Aula 05 Parte 2)
  limparConcluidos() {
    this.pedidos = this.pedidos.filter(function (p) {
      return !p.concluido;
    });
    this.salvarPedidos();
    this.renderizarTabela();
  }

  // Apagar tarefa/pedido específico usando splice (FANESE Aula 05 Parte 1)
  cancelarPedido(id) {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pedidos.splice(index, 1);
      this.salvarPedidos();
      this.renderizarTabela();
    }
  }

  // Registra um novo pedido feito pelo cliente (FANESE Aulas 04 e 05)
  adicionarPedido(dadosPedido) {
    this.pedidos = this.carregarPedidos();

    const proximoNumero = this.pedidos.length > 0 
      ? Math.max(...this.pedidos.map(p => parseInt(p.id) || 0)) + 1 
      : 1;

    const agora = new Date();
    const horaFormatada = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const novoPedido = {
      id: String(proximoNumero).padStart(4, "0"),
      hora: `Hoje ${horaFormatada}`,
      atendente: dadosPedido.nome || "Cliente Online",
      local: dadosPedido.tipo === "Mesa" && dadosPedido.local ? dadosPedido.local : (dadosPedido.local ? `${dadosPedido.tipo} - ${dadosPedido.local}` : dadosPedido.tipo),
      itens: dadosPedido.itensTexto,
      total: dadosPedido.totalGeral,
      tempo: "Recente",
      status: dadosPedido.tipo,
      concluido: false
    };

    this.pedidos.unshift(novoPedido); // Adiciona no início para aparecer no topo do monitoramento
    this.salvarPedidos();
    this.renderizarTabela();
    return novoPedido;
  }

  // Renderiza a tabela de produtos ativos no cardápio para consulta e alteração de preços (FANESE)
  renderizarTabelaProdutos(produtos = []) {
    if (!this.tbodyProdutos) {
      this.tbodyProdutos = document.getElementById("admin-products-table-body");
    }
    if (!this.tbodyProdutos) return;

    this.tbodyProdutos.innerHTML = "";

    if (produtos.length === 0) {
      this.tbodyProdutos.innerHTML = `
        <tr>
          <td colspan="6" class="vazio" style="text-align: center; padding: 24px; color: #888e99;">
            Nenhum produto cadastrado ou encontrado com este filtro.
          </td>
        </tr>
      `;
      return;
    }

    produtos.forEach(p => {
      const tr = document.createElement("tr");

      const fotoHtml = p.imagem
        ? `<img src="${p.imagem}" alt="${p.nome}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.12);" onerror="this.onerror=null; this.parentElement.innerHTML='<span style=\\'font-size: 1.6rem;\\'>${p.icone || '🍽️'}</span>';">`
        : `<span style="font-size: 1.6rem;">${p.icone || '🍽️'}</span>`;

      const badgeHtml = p.badge
        ? `<span class="status-tag delivery" style="font-size: 0.72rem;">${p.badge}</span>`
        : `<span style="color: #666; font-size: 0.8rem;">—</span>`;

      tr.innerHTML = `
        <td style="width: 60px; text-align: center;">${fotoHtml}</td>
        <td>
          <strong style="color: #fff; font-size: 0.9rem;">${p.nome}</strong>
          <br>
          <small style="color: #888e99; font-size: 0.75rem;">${(p.descricao || 'Sem descrição').substring(0, 48)}${(p.descricao && p.descricao.length > 48) ? '...' : ''}</small>
        </td>
        <td><span class="status-tag mesa" style="text-transform: capitalize;">${p.categoria}</span></td>
        <td>${badgeHtml}</td>
        <td><strong style="color: #2ecc71; font-size: 1rem;">${formatarPreco(p.preco)}</strong></td>
        <td>
          <div class="action-btn-group">
            <button class="btn-action-outline btn-editar-preco-prod" data-id="${p.id}" title="Alterar Preço e Informações" style="color: var(--primary-gold); border-color: var(--primary-gold);">
              ✏️ Alterar Preço
            </button>
            <button class="btn-action-cancel btn-excluir-prod-admin" data-id="${p.id}" title="Excluir Produto">
              🗑️
            </button>
          </div>
        </td>
      `;

      this.tbodyProdutos.appendChild(tr);
    });
  }
}

