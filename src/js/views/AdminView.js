/**
 * ==========================================================================
 * VIEW LAYER - ADMIN DASHBOARD VIEW (src/js/views/AdminView.js)
 * ==========================================================================
 */

import { formatarPreco } from "./ProductView.js";

export const PEDIDOS_INICIAIS = [
  {
    id: "0001",
    hora: "07/08/2021 11:30",
    atendente: "João Silva",
    local: "Aberto",
    itens: "X-Bacon",
    total: 25.90,
    tempo: "30 min",
    status: "Aberto"
  },
  {
    id: "0002",
    hora: "07/08/2021 11:30",
    atendente: "Batata Frita",
    local: "Mesa 05",
    itens: "X-Salada",
    total: 15.90,
    tempo: "20 min",
    status: "Mesa 05"
  },
  {
    id: "0003",
    hora: "07/08/2021 13:30",
    atendente: "João Silva",
    local: "Mesa 05",
    itens: "3 Itens",
    total: 22.90,
    tempo: "20 min",
    status: "Mesa 05"
  },
  {
    id: "0004",
    hora: "07/08/2021 13:30",
    atendente: "Mario Mants",
    local: "Mesa 05",
    itens: "2x Mario Maras OS",
    total: 45.90,
    tempo: "30 min",
    status: "Mesa 05"
  },
  {
    id: "0005",
    hora: "07/08/2021 13:50",
    atendente: "Batata Frita",
    local: "Mesa 07",
    itens: "2x Coca-Cola Lata",
    total: 45.50,
    tempo: "20 min",
    status: "Mesa 07"
  },
  {
    id: "0006",
    hora: "07/08/2021 13:50",
    atendente: "Carlos Lims",
    local: "Delivery",
    itens: "2x Batata Fritada",
    total: 55.60,
    tempo: "20 min",
    status: "Delivery"
  },
  {
    id: "0007",
    hora: "07/08/2021 12:50",
    atendente: "Suco Natural",
    local: "Mesa 05",
    itens: "X-Salada",
    total: 86.90,
    tempo: "20 min",
    status: "Mesa 05"
  },
  {
    id: "0008",
    hora: "07/08/2021 12:35",
    atendente: "Ania Paula",
    local: "Mesa 07",
    itens: "X-Bacon",
    total: 55.90,
    tempo: "20 min",
    status: "Mesa 07"
  }
];

export class AdminView {
  constructor() {
    this.pedidos = [...PEDIDOS_INICIAIS];
    this.tbody = document.getElementById("admin-orders-table-body");
    this.elTotais = document.getElementById("admin-card-totais");
    this.elVendas = document.getElementById("admin-card-vendas");
    this.elTempo = document.getElementById("admin-card-tempo");
    this.elPendentes = document.getElementById("admin-card-pendentes");
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

    if (lista.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">
            Nenhum pedido localizado para os filtros selecionados.
          </td>
        </tr>
      `;
      return;
    }

    lista.forEach(ped => {
      const tr = document.createElement("tr");

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
            <button class="btn-action-outline btn-detalhes-ped" data-id="${ped.id}">
              ${ped.status === "Aberto" ? "Ver Detalhes" : "Mudar Status"}
            </button>
            <button class="btn-action-cancel btn-cancelar-ped" data-id="${ped.id}">
              Cancelar
            </button>
          </div>
        </td>
      `;

      this.tbody.appendChild(tr);
    });

    this.atualizarCards();
  }

  atualizarCards() {
    const totalPedidos = 145 + (this.pedidos.length - PEDIDOS_INICIAIS.length);
    const totalVendas = 7420.50 + this.pedidos.reduce((acc, p) => acc + p.total, 0) - PEDIDOS_INICIAIS.reduce((acc, p) => acc + p.total, 0);

    if (this.elTotais) this.elTotais.textContent = totalPedidos;
    if (this.elVendas) this.elVendas.textContent = formatarPreco(totalVendas);
    if (this.elTempo) this.elTempo.textContent = "18 min";
    if (this.elPendentes) this.elPendentes.textContent = this.pedidos.filter(p => p.status === "Aberto").length + 24;
  }

  alternarStatusPedido(id) {
    const ped = this.pedidos.find(p => p.id === id);
    if (ped) {
      ped.status = ped.status === "Aberto" ? "Em Preparo" : "Aberto";
      this.renderizarTabela();
    }
  }

  cancelarPedido(id) {
    this.pedidos = this.pedidos.filter(p => p.id !== id);
    this.renderizarTabela();
  }
}
