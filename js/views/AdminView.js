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
        const parsed = JSON.parse(salvos);
        if (Array.isArray(parsed)) {
          return parsed;
        }
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

  renderizarTabela(filtroBusca = "", filtroStatus = "", filtroHora = "") {
    if (!this.tbody) {
      this.tbody = document.getElementById("admin-orders-table-body");
    }
    if (!this.tbody) return;

    // Sempre recarrega do localStorage para garantir sincronismo com novos pedidos
    this.pedidos = this.carregarPedidos();

    let lista = [...this.pedidos];

    if (filtroBusca) {
      const termo = filtroBusca.toLowerCase();
      lista = lista.filter(p => 
        String(p.atendente || "").toLowerCase().includes(termo) ||
        String(p.cliente || "").toLowerCase().includes(termo) ||
        String(p.local || "").toLowerCase().includes(termo) ||
        String(p.itens || "").toLowerCase().includes(termo) ||
        String(p.id || "").toLowerCase().includes(termo)
      );
    }

    if (filtroStatus) {
      const sTermo = filtroStatus.toLowerCase();
      lista = lista.filter(p => 
        String(p.local || "").toLowerCase().includes(sTermo) ||
        String(p.status || "").toLowerCase().includes(sTermo)
      );
    }

    if (filtroHora === "antigos") {
      lista.reverse();
    }

    this.tbody.innerHTML = "";

    // Estado vazio com classe .vazio (FANESE Aula 05 Parte 2)
    if (lista.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="7" class="vazio" style="text-align: center; padding: 28px; color: #888e99;">
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
      const localStr = String(ped.local || "").toLowerCase();
      if (localStr.includes("mesa")) badgeClass = "mesa";
      else if (localStr.includes("delivery")) badgeClass = "delivery";
      else if (localStr.includes("balcão") || localStr.includes("balcao")) badgeClass = "aberto";

      const nomeExibicao = ped.cliente || ped.atendente || "Cliente Online";
      const ehNovo = ped.novo && !ped.concluido;

      tr.innerHTML = `
        <td><strong>${ped.hora || "Hoje"}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            ${ehNovo ? '<span style="background: #2ecc71; color: #fff; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px;">NOVO</span>' : ''}
            <span style="font-weight: 600; color: #ffffff;">👤 ${nomeExibicao}</span>
          </div>
        </td>
        <td><span class="status-tag ${badgeClass}">${ped.local || "Balcão"}</span></td>
        <td style="max-width: 220px; font-size: 0.85rem; line-height: 1.35;">${ped.itens || "-"}</td>
        <td><strong style="color: var(--primary-gold, #f1c40f); font-size: 0.95rem;">${formatarPreco(ped.total || 0)}</strong></td>
        <td>${ped.tempo || "Recente"}</td>
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
    const totalVendas = this.pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0);
    const pendentes = this.pedidos.filter(p => !p.concluido).length;

    if (this.elTotais) this.elTotais.textContent = totalPedidos;
    if (this.elVendas) this.elVendas.textContent = formatarPreco(totalVendas);
    if (this.elTempo) this.elTempo.textContent = "15 min";
    if (this.elPendentes) this.elPendentes.textContent = pendentes;
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

  // Limpar todos os pedidos do sistema (FANESE)
  limparTodos() {
    this.pedidos = [];
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

    const nomeCliente = (dadosPedido.nome || "").trim() || "Cliente Online";
    let localFormatado = dadosPedido.tipo || "Balcão";
    if (dadosPedido.tipo === "Mesa" && dadosPedido.local) {
      localFormatado = String(dadosPedido.local).toLowerCase().includes("mesa") 
        ? dadosPedido.local 
        : `Mesa ${dadosPedido.local}`;
    } else if (dadosPedido.tipo === "Delivery" && dadosPedido.local) {
      localFormatado = `Delivery (${dadosPedido.local})`;
    } else if (dadosPedido.local) {
      localFormatado = `${dadosPedido.tipo} - ${dadosPedido.local}`;
    }

    const novoPedido = {
      id: String(proximoNumero).padStart(4, "0"),
      hora: `Hoje ${horaFormatada}`,
      cliente: nomeCliente,
      atendente: nomeCliente, // Compatibilidade com mockups anteriores
      local: localFormatado,
      itens: dadosPedido.itensTexto || "1x Pedido",
      total: Number(dadosPedido.totalGeral) || 0,
      tempo: "Recente",
      status: dadosPedido.tipo || "Aberto",
      concluido: false,
      novo: true
    };

    this.pedidos.unshift(novoPedido); // Adiciona no início para aparecer no topo do monitoramento
    this.salvarPedidos();
    this.renderizarTabela();

    // Notifica outras abas/janelas via BroadcastChannel
    try {
      const canal = new BroadcastChannel("cardapio_pedidos_channel");
      canal.postMessage({ type: "NOVO_PEDIDO", pedido: novoPedido });
      canal.close();
    } catch (e) {}

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

