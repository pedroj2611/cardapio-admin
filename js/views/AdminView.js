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
    if (!this.tbody) return;

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
}
