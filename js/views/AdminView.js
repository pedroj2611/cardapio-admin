/**
 * ==========================================================================
 * VIEW LAYER - ADMIN DASHBOARD VIEW (src/js/views/AdminView.js)
 * ==========================================================================
 */

import { formatarPreco } from "./ProductView.js";

// ==========================================================================
// FUNÇÕES AUXILIARES DA AV1 (FANESE - MINHAS TAREFAS PRO)
// ==========================================================================

// Devolve a data de hoje como texto "aaaa-mm-dd" (Slide 11 da AV1)
export function hojeTexto() {
  return new Date().toISOString().slice(0, 10);
}

// Diz se a tarefa/pedido está atrasada (tem prazo, não está feita e o prazo já passou)
export function estaAtrasada(tarefa) {
  const prazo = tarefa.vence || tarefa.prazo || "";
  const feito = tarefa.concluido ?? tarefa.feito ?? false;
  return prazo !== "" && !feito && prazo < hojeTexto();
}

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
    concluido: false,
    prioridade: "alta",
    vence: "2026-09-14", // Data passada para demonstrar a tag "ATRASADA" da AV1
    criadaEm: "2026-09-14T11:30:00.000Z"
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
    concluido: false,
    prioridade: "media",
    vence: "2026-09-15",
    criadaEm: "2026-09-15T11:45:00.000Z"
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
    concluido: false,
    prioridade: "alta",
    vence: "2026-09-16",
    criadaEm: "2026-09-15T12:00:00.000Z"
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
    concluido: false,
    prioridade: "baixa",
    vence: "2026-09-17",
    criadaEm: "2026-09-15T12:15:00.000Z"
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
    concluido: true,
    prioridade: "baixa",
    vence: "2026-09-15",
    criadaEm: "2026-09-15T12:30:00.000Z"
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

  // Carrega os pedidos do localStorage com try/catch (FANESE Aula 04 & 05 e AV1)
  carregarPedidos() {
    try {
      const salvos = localStorage.getItem("cardapio_admin_pedidos");
      if (salvos) {
        const parsed = JSON.parse(salvos);
        if (Array.isArray(parsed)) {
          // Garante que pedidos já salvos tenham os campos da AV1 preenchidos
          return parsed.map(p => ({
            ...p,
            prioridade: p.prioridade || "media",
            vence: p.vence || hojeTexto(),
            criadaEm: p.criadaEm || new Date().toISOString()
          }));
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

  // Atualiza o painel de resumo: total, pendentes, concluídas e atrasadas (Slide 13 da AV1)
  atualizarResumo() {
    let pendentes = 0;
    let concluidas = 0;
    let atrasadas = 0;

    for (let i = 0; i < this.pedidos.length; i++) {
      const p = this.pedidos[i];
      if (p.concluido) {
        concluidas = concluidas + 1;
      } else {
        pendentes = pendentes + 1;
      }
      if (estaAtrasada(p)) {
        atrasadas = atrasadas + 1;
      }
    }

    const rTotal = document.getElementById("r-total");
    const rPendentes = document.getElementById("r-pendentes");
    const rConcluidas = document.getElementById("r-concluidas");
    const rAtrasadas = document.getElementById("r-atrasadas");

    if (rTotal) rTotal.textContent = this.pedidos.length;
    if (rPendentes) rPendentes.textContent = pendentes;
    if (rConcluidas) rConcluidas.textContent = concluidas;
    if (rAtrasadas) rAtrasadas.textContent = atrasadas;

    this.atualizarContador();
    this.atualizarCards();
  }

  renderizarTabela(filtroBusca = "", filtroStatus = "", filtroOrdenacao = "prioridade") {
    if (!this.tbody) {
      this.tbody = document.getElementById("admin-orders-table-body");
    }
    if (!this.tbody) return;

    // Sempre recarrega do localStorage para garantir sincronismo com novos pedidos
    this.pedidos = this.carregarPedidos();

    let lista = [...this.pedidos];

    // 1) Busca por texto (Slide 12 da AV1: filter + indexOf)
    if (filtroBusca) {
      const termo = filtroBusca.trim().toLowerCase();
      if (termo !== "") {
        lista = lista.filter(function (p) {
          const textoGeral = (
            (p.atendente || "") + " " +
            (p.cliente || "") + " " +
            (p.local || "") + " " +
            (p.itens || "") + " " +
            (p.id || "") + " " +
            (p.prioridade || "")
          ).toLowerCase();
          return textoGeral.indexOf(termo) !== -1;
        });
      }
    }

    // 2) Filtro por local/status
    if (filtroStatus) {
      const sTermo = filtroStatus.toLowerCase();
      lista = lista.filter(p => 
        String(p.local || "").toLowerCase().includes(sTermo) ||
        String(p.status || "").toLowerCase().includes(sTermo)
      );
    }

    // 3) Ordenação escolhida (Slide 12 da AV1: sort numa cópia com slice)
    const ordem = { alta: 0, media: 1, baixa: 2 };
    lista = lista.slice();

    if (filtroOrdenacao === "prioridade") {
      lista.sort(function (a, b) {
        const pa = ordem[a.prioridade || "media"] ?? 1;
        const pb = ordem[b.prioridade || "media"] ?? 1;
        return pa - pb;
      });
    } else if (filtroOrdenacao === "prazo") {
      lista.sort(function (a, b) {
        const va = (a.vence || "") === "" ? "9999-99-99" : a.vence;
        const vb = (b.vence || "") === "" ? "9999-99-99" : b.vence;
        return va < vb ? -1 : (va > vb ? 1 : 0);
      });
    } else if (filtroOrdenacao === "recentes") {
      lista.sort(function (a, b) {
        const ca = a.criadaEm || a.hora || "";
        const cb = b.criadaEm || b.hora || "";
        return cb < ca ? -1 : (cb > ca ? 1 : 0);
      });
    } else if (filtroOrdenacao === "antigos") {
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
      this.atualizarResumo();
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
      const ehAtrasada = estaAtrasada(ped);
      const prioridadeNome = (ped.prioridade || "media").toLowerCase();

      tr.innerHTML = `
        <td>
          <span class="badge-prioridade ${prioridadeNome}">
            ${prioridadeNome.toUpperCase()}
          </span>
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <strong>${ped.hora || "Hoje"}</strong>
            <div style="font-size: 0.74rem; color: #888e99; display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
              <span>Prazo: ${ped.vence || "Hoje"}</span>
              ${ehAtrasada ? '<span class="atrasada">ATRASADA</span>' : ''}
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
            ${ehNovo ? '<span style="background: #2ecc71; color: #fff; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px;">NOVO</span>' : ''}
            <span style="font-weight: 700; color: var(--text-main, #1e293b); font-size: 0.95rem; display: inline-flex; align-items: center; gap: 6px;">
              <span style="font-size: 1rem;">👤</span>
              <strong style="color: var(--text-main, #1e293b);">${nomeExibicao}</strong>
            </span>
          </div>
        </td>
        <td><span class="status-tag ${badgeClass}">${ped.local || "Balcão"}</span></td>
        <td style="max-width: 200px; font-size: 0.85rem; line-height: 1.35;">${ped.itens || "-"}</td>
        <td><strong style="color: var(--primary-gold, #f1c40f); font-size: 0.95rem;">${formatarPreco(ped.total || 0)}</strong></td>
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

    this.atualizarResumo();
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
  obterExcluidos() {
    try {
      const salvos = localStorage.getItem("cardapio_pedidos_excluidos");
      return salvos ? JSON.parse(salvos) : [];
    } catch (e) {
      return [];
    }
  }

  registrarExcluido(idOuUid) {
    if (!idOuUid) return;
    try {
      const excluidos = this.obterExcluidos();
      const str = String(idOuUid);
      if (!excluidos.includes(str)) {
        excluidos.push(str);
        if (excluidos.length > 200) excluidos.shift();
        localStorage.setItem("cardapio_pedidos_excluidos", JSON.stringify(excluidos));
      }
    } catch (e) {}
  }

  foiExcluido(idOuUid) {
    if (!idOuUid) return false;
    const excluidos = this.obterExcluidos();
    return excluidos.includes(String(idOuUid));
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
    this.pedidos.forEach(p => this.registrarExcluido(p.uid || p.id));
    this.pedidos = [];
    this.salvarPedidos();
    this.renderizarTabela();
  }

  // Apagar tarefa/pedido específico usando splice (FANESE Aula 05 Parte 1)
  cancelarPedido(id) {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
      const ped = this.pedidos[index];
      this.registrarExcluido(ped.uid || ped.id);
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
      uid: dadosPedido.uid || `ped_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      hora: dadosPedido.hora || `Hoje ${horaFormatada}`,
      cliente: nomeCliente,
      atendente: nomeCliente, // Compatibilidade com mockups anteriores
      local: localFormatado,
      itens: dadosPedido.itensTexto || "1x Pedido",
      total: Number(dadosPedido.totalGeral) || 0,
      tempo: "Recente",
      status: dadosPedido.tipo || "Aberto",
      concluido: false,
      novo: true,
      prioridade: dadosPedido.prioridade || "media",
      vence: dadosPedido.vence || hojeTexto(),
      criadaEm: dadosPedido.criadaEm || new Date().toISOString()
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

