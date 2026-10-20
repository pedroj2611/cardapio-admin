/**
 * ==========================================================================
 * MODEL LAYER - ORDER & TASK MODEL (src/js/models/OrderModel.js)
 * Responsável pelos dados, regras de negócio e persistência (LocalStorage)
 * de Pedidos e Tarefas PRO (FANESE Aulas 04, 05, 07 e 08).
 * ==========================================================================
 */

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
    texto: "João Silva: 1x X-Bacon Artesanal",
    feito: false,
    hora: "Hoje 11:30",
    atendente: "João Silva",
    cliente: "João Silva",
    local: "Aberto",
    itens: "1x X-Bacon Artesanal",
    total: 32.90,
    tempo: "15 min",
    status: "Aberto",
    concluido: false,
    prioridade: "alta",
    categoria: "trabalho",
    vence: "2026-09-14",
    subtarefas: [
      { id: "sub-1", texto: "Separar pão brioche e bacon", feito: true },
      { id: "sub-2", texto: "Selar burger 180g na chapa", feito: false }
    ],
    criadaEm: "2026-09-14T11:30:00.000Z"
  },
  {
    id: "0002",
    texto: "Ana Souza: 1x Smash Burger + 1x Coca",
    feito: false,
    hora: "Hoje 11:45",
    atendente: "Ana Souza",
    cliente: "Ana Souza",
    local: "Mesa 05",
    itens: "1x Smash Burger + 1x Coca",
    total: 35.00,
    tempo: "20 min",
    status: "Mesa 05",
    concluido: false,
    prioridade: "media",
    categoria: "pessoal",
    vence: "2026-09-15",
    subtarefas: [],
    criadaEm: "2026-09-15T11:45:00.000Z"
  },
  {
    id: "0003",
    texto: "Carlos Lima: 2x Batata Rústica + 2x Suco",
    feito: false,
    hora: "Hoje 12:00",
    atendente: "Carlos Lima",
    cliente: "Carlos Lima",
    local: "Delivery",
    itens: "2x Batata Rústica + 2x Suco",
    total: 72.00,
    tempo: "25 min",
    status: "Delivery",
    concluido: false,
    prioridade: "alta",
    categoria: "casa",
    vence: "2026-09-16",
    subtarefas: [],
    criadaEm: "2026-09-15T12:00:00.000Z"
  },
  {
    id: "0004",
    texto: "Mario Santos: 1x Chicken Crispy + 1x Brownie",
    feito: false,
    hora: "Hoje 12:15",
    atendente: "Mario Santos",
    cliente: "Mario Santos",
    local: "Mesa 07",
    itens: "1x Chicken Crispy + 1x Brownie",
    total: 47.90,
    tempo: "10 min",
    status: "Mesa 07",
    concluido: false,
    prioridade: "baixa",
    categoria: "estudos",
    vence: "2026-09-17",
    subtarefas: [],
    criadaEm: "2026-09-15T12:15:00.000Z"
  },
  {
    id: "0005",
    texto: "Juliana Silva: 2x Heineken Long Neck",
    feito: true,
    hora: "Hoje 12:30",
    atendente: "Juliana Silva",
    cliente: "Juliana Silva",
    local: "Balcão",
    itens: "2x Heineken Long Neck",
    total: 24.00,
    tempo: "5 min",
    status: "Balcão",
    concluido: true,
    prioridade: "baixa",
    categoria: "trabalho",
    vence: "2026-09-15",
    subtarefas: [],
    criadaEm: "2026-09-15T12:30:00.000Z"
  }
];

export class OrderModel {
  constructor() {
    this.pedidos = this.carregarPedidos();
  }

  normalizarPedido(p, idx = 0) {
    const textoFormatado = p.texto || (p.cliente ? `${p.cliente}: ${p.itens || ""}` : `Tarefa #${idx + 1}`);
    const estaFeito = Boolean(p.feito ?? p.concluido ?? false);
    return {
      ...p,
      id: p.id || String(idx + 1).padStart(4, "0"),
      texto: textoFormatado,
      cliente: p.cliente || p.atendente || textoFormatado,
      atendente: p.atendente || p.cliente || textoFormatado,
      itens: p.itens || textoFormatado,
      local: p.local || "Balcão",
      feito: estaFeito,
      concluido: estaFeito,
      prioridade: p.prioridade || "media",
      categoria: p.categoria || "trabalho",
      vence: p.vence ?? hojeTexto(),
      subtarefas: Array.isArray(p.subtarefas) ? p.subtarefas : [],
      criadaEm: p.criadaEm || new Date().toISOString()
    };
  }

  carregarPedidos() {
    try {
      const salvos = localStorage.getItem("cardapio_admin_pedidos") || localStorage.getItem("tarefas");
      if (salvos) {
        const parsed = JSON.parse(salvos);
        if (Array.isArray(parsed)) {
          this.pedidos = parsed.map((p, idx) => this.normalizarPedido(p, idx));
          return this.pedidos;
        }
      }
      localStorage.setItem("cardapio_admin_pedidos", JSON.stringify(PEDIDOS_INICIAIS));
      localStorage.setItem("tarefas", JSON.stringify(PEDIDOS_INICIAIS));
      this.pedidos = [...PEDIDOS_INICIAIS];
      return this.pedidos;
    } catch (e) {
      console.error("Erro ao carregar pedidos:", e);
      this.pedidos = [...PEDIDOS_INICIAIS];
      return this.pedidos;
    }
  }

  salvarPedidos() {
    try {
      localStorage.setItem("cardapio_admin_pedidos", JSON.stringify(this.pedidos));
      localStorage.setItem("tarefas", JSON.stringify(this.pedidos));
      window.tarefas = this.pedidos;
    } catch (e) {
      console.error("Erro ao salvar pedidos:", e);
    }
  }

  obterTodos() {
    return this.pedidos;
  }

  filtrarEOrdenar(filtroBusca = "", filtroStatus = "", filtroOrdenacao = "prioridade", filtroCategoria = "todas") {
    this.pedidos = this.carregarPedidos();
    let lista = [...this.pedidos];

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
            (p.prioridade || "") + " " +
            (p.categoria || "")
          ).toLowerCase();
          return textoGeral.indexOf(termo) !== -1;
        });
      }
    }

    if (filtroStatus) {
      const sTermo = filtroStatus.toLowerCase();
      lista = lista.filter(p =>
        String(p.local || "").toLowerCase().includes(sTermo) ||
        String(p.status || "").toLowerCase().includes(sTermo)
      );
    }

    if (filtroCategoria && filtroCategoria !== "todas") {
      lista = lista.filter(function (t) {
        return (t.categoria || "trabalho").toLowerCase() === filtroCategoria.toLowerCase();
      });
    }

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

    return lista;
  }

  obterEstatisticas() {
    let pendentes = 0;
    let concluidas = 0;
    let atrasadas = 0;
    let totalVendas = 0;

    for (let i = 0; i < this.pedidos.length; i++) {
      const p = this.pedidos[i];
      totalVendas += Number(p.total) || 0;
      if (p.concluido || p.feito) {
        concluidas += 1;
      } else {
        pendentes += 1;
      }
      if (estaAtrasada(p)) {
        atrasadas += 1;
      }
    }

    const total = this.pedidos.length;
    const percentualConcluido = total === 0 ? 0 : Math.round((concluidas / total) * 100);

    return {
      total,
      pendentes,
      concluidas,
      atrasadas,
      totalVendas,
      percentualConcluido
    };
  }

  alternarConcluido(id) {
    const ped = this.pedidos.find(p => p.id === id);
    if (ped) {
      ped.feito = !ped.feito;
      ped.concluido = ped.feito;
      this.salvarPedidos();
    }
    return ped;
  }

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
    return this.obterExcluidos().includes(String(idOuUid));
  }

  limparConcluidos() {
    this.pedidos = this.pedidos.filter(t => !t.feito && !t.concluido);
    this.salvarPedidos();
  }

  limparTodos() {
    this.pedidos.forEach(p => this.registrarExcluido(p.uid || p.id));
    this.pedidos = [];
    this.salvarPedidos();
  }

  cancelarPedido(id) {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
      const ped = this.pedidos[index];
      this.registrarExcluido(ped.uid || ped.id);
      this.pedidos.splice(index, 1);
      this.salvarPedidos();
    }
  }

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
      texto: `${nomeCliente}: ${dadosPedido.itensTexto || "1x Pedido"}`,
      feito: false,
      hora: dadosPedido.hora || `Hoje ${horaFormatada}`,
      cliente: nomeCliente,
      atendente: nomeCliente,
      local: localFormatado,
      itens: dadosPedido.itensTexto || "1x Pedido",
      total: Number(dadosPedido.totalGeral) || 0,
      tempo: "Recente",
      status: dadosPedido.tipo || "Aberto",
      concluido: false,
      novo: true,
      prioridade: dadosPedido.prioridade || "media",
      categoria: dadosPedido.categoria || "trabalho",
      vence: dadosPedido.vence || hojeTexto(),
      subtarefas: Array.isArray(dadosPedido.subtarefas) ? dadosPedido.subtarefas : [],
      criadaEm: dadosPedido.criadaEm || new Date().toISOString()
    };

    this.pedidos.unshift(novoPedido);
    this.salvarPedidos();
    return novoPedido;
  }

  exportar() {
    const dados = JSON.stringify(this.pedidos, null, 2);
    const blob = new Blob([dados], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "minhas-tarefas.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  importar(arquivo, aoConcluir) {
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const lista = JSON.parse(leitor.result);
        if (Array.isArray(lista)) {
          this.pedidos = lista.map((p, idx) => this.normalizarPedido(p, idx));
          this.salvarPedidos();
          if (typeof aoConcluir === "function") aoConcluir();
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
}
