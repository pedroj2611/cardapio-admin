/**
 * ==========================================================================
 * VIEW LAYER - ADMIN DASHBOARD VIEW (src/js/views/AdminView.js)
 * Responsável exclusivamente pela renderização da interface do Painel Admin
 * (Tabelas, Cards Modernos de Tarefas, Relatório PDF, Resumo AV1 e Progresso),
 * delegando os dados e persistência ao OrderModel (Padrão MVC).
 * ==========================================================================
 */

import { formatarPreco } from "./ProductView.js";
import { OrderModel, PEDIDOS_INICIAIS, hojeTexto, estaAtrasada } from "../models/OrderModel.js";
import { ToastView } from "./ToastView.js";

export { PEDIDOS_INICIAIS, hojeTexto, estaAtrasada };

export class AdminView {
  constructor(orderModel = null) {
    this.orderModel = orderModel || new OrderModel();

    this.tbody = document.getElementById("admin-orders-table-body");
    this.listaPwa = document.getElementById("lista");
    this.elTotais = document.getElementById("admin-card-totais");
    this.elVendas = document.getElementById("admin-card-vendas");
    this.elTempo = document.getElementById("admin-card-tempo");
    this.elPendentes = document.getElementById("admin-card-pendentes");
    this.elContador = document.getElementById("contador-pedidos");
    this.elContadorAula05 = document.getElementById("contador");
    this.tbodyProdutos = document.getElementById("admin-products-table-body");

    // Expor variáveis e funções globais no window para compatibilidade total com as Aulas 05, 07 e 08
    window.tarefas = this.pedidos;
    window.salvar = () => this.salvarPedidos();
    window.carregar = () => this.carregarPedidos();
    window.mostrar = () => this.renderizarTabela();
    window.atualizarContador = () => this.atualizarContador();
    window.exportar = () => this.exportar();
    window.importar = (arquivo) => this.importar(arquivo);
    window.gerarRelatorioPDF = () => this.gerarRelatorioPDF();
  }

  get pedidos() {
    return this.orderModel.pedidos;
  }

  set pedidos(novaLista) {
    this.orderModel.pedidos = novaLista;
  }

  carregarPedidos() {
    return this.orderModel.carregarPedidos();
  }

  salvarPedidos() {
    this.orderModel.salvarPedidos();
  }

  exportar() {
    this.orderModel.exportar();
    ToastView.mostrarToast("Backup de tarefas exportado em minhas-tarefas.json!", "💾");
  }

  importar(arquivo) {
    this.orderModel.importar(
      arquivo,
      (qtd) => {
        this.renderizarTabela();
        ToastView.mostrarToast(`${qtd} tarefa(s) restaurada(s) do backup JSON com sucesso!`, "📥");
      },
      (msgErro) => {
        ToastView.mostrarToast(msgErro || "Erro ao importar arquivo JSON!", "⚠️");
      }
    );
  }

  gerarRelatorioPDF() {
    const { total, pendentes, concluidas, atrasadas, percentualConcluido } = this.orderModel.obterEstatisticas();
    const tarefas = this.pedidos;
    const agora = new Date();
    const dataHoraStr = agora.toLocaleDateString("pt-BR") + " às " + agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const linhasHtml = tarefas.map((t, idx) => {
      const feita = Boolean(t.feito || t.concluido);
      const atrasada = estaAtrasada(t);
      const prioridade = (t.prioridade || "media").toUpperCase();
      const categoria = (t.categoria || "trabalho").toUpperCase();
      const statusBadge = feita ? "✔ CONCLUÍDA" : (atrasada ? "⏰ ATRASADA" : "⏳ PENDENTE");
      const statusColor = feita ? "#10b981" : (atrasada ? "#ef4444" : "#f59e0b");
      const subInfo = (t.subtarefas && t.subtarefas.length > 0)
        ? `${t.subtarefas.filter(s => s.feito).length}/${t.subtarefas.length} passos`
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
            <strong style="color: #0f172a; font-size: 13px; ${feita ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${t.texto || t.cliente || 'Tarefa'}</strong>
            ${t.itens && t.itens !== t.texto ? `<div style="font-size: 11px; color: #64748b;">${t.itens}</div>` : ''}
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
    .brand-title { font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
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
    <span>📄 <strong>Visualização de Impressão / PDF</strong> — Folha de Turno & Tarefas</span>
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
      <div><strong>Responsável:</strong> Gestão de Pedidos</div>
    </div>
  </div>

  <div class="kpis-grid">
    <div class="kpi-card"><div class="kpi-val">${total}</div><div class="kpi-lbl">Total Tarefas</div></div>
    <div class="kpi-card"><div class="kpi-val" style="color: #d97706;">${pendentes}</div><div class="kpi-lbl">Pendentes</div></div>
    <div class="kpi-card"><div class="kpi-val" style="color: #10b981;">${concluidas}</div><div class="kpi-lbl">Concluídas</div></div>
    <div class="kpi-card"><div class="kpi-val" style="color: #ef4444;">${atrasadas}</div><div class="kpi-lbl">Atrasadas</div></div>
    <div class="kpi-card"><div class="kpi-val">${percentualConcluido}%</div><div class="kpi-lbl">Taxa de Conclusão</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px; text-align: center;">#</th>
        <th style="width: 90px; text-align: center;">Prioridade</th>
        <th style="width: 90px; text-align: center;">Categoria</th>
        <th>Descrição da Tarefa / Pedido</th>
        <th style="width: 90px; text-align: center;">Prazo</th>
        <th style="width: 90px; text-align: center;">Subtarefas</th>
        <th style="width: 110px; text-align: center;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${linhasHtml}
    </tbody>
  </table>

  <div class="footer-print">
    <div>Documento gerado automaticamente para controle operacional e acadêmico (AV1).</div>
    <div class="signature-line">Visto do Gerente / Responsável</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printHtml);
      printWin.document.close();
      ToastView.mostrarToast("Relatório PDF aberto para impressão!", "📄");
    } else {
      window.print();
    }
  }

  atualizarContador() {
    const { total, pendentes } = this.orderModel.obterEstatisticas();

    const elContadorAula05 = document.getElementById("contador") || this.elContadorAula05;
    if (elContadorAula05) {
      elContadorAula05.textContent = "Faltam " + pendentes + " de " + total;
    }
    if (this.elContador) {
      this.elContador.textContent = "Faltam " + pendentes + " de " + total + " pedidos a atender";
    }
    if (this.elPendentes) {
      this.elPendentes.textContent = pendentes;
    }
  }

  atualizarResumo() {
    const { total, pendentes, concluidas, atrasadas } = this.orderModel.obterEstatisticas();

    const rTotal = document.getElementById("r-total");
    const rPendentes = document.getElementById("r-pendentes");
    const rConcluidas = document.getElementById("r-concluidas");
    const rAtrasadas = document.getElementById("r-atrasadas");

    if (rTotal) rTotal.textContent = total;
    if (rPendentes) rPendentes.textContent = pendentes;
    if (rConcluidas) rConcluidas.textContent = concluidas;
    if (rAtrasadas) rAtrasadas.textContent = atrasadas;

    this.atualizarContador();
    this.atualizarCards();
  }

  atualizarProgresso() {
    const { percentualConcluido } = this.orderModel.obterEstatisticas();
    const barra = document.getElementById("barra");
    const progressoTexto = document.getElementById("progresso-texto");
    if (barra) barra.style.width = percentualConcluido + "%";
    if (progressoTexto) progressoTexto.textContent = percentualConcluido + "% concluído";
  }

  atualizarCards() {
    const { total, pendentes, totalVendas } = this.orderModel.obterEstatisticas();

    if (this.elTotais) this.elTotais.textContent = total;
    if (this.elVendas) this.elVendas.textContent = formatarPreco(totalVendas);
    if (this.elTempo) this.elTempo.textContent = "15 min";
    if (this.elPendentes) this.elPendentes.textContent = pendentes;
  }

  renderizarListaTarefas(lista, filtrosAtuais) {
    const listaEl = document.getElementById("lista") || this.listaPwa;
    if (!listaEl) return;

    const { filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria } = filtrosAtuais;
    listaEl.innerHTML = "";

    if (lista.length === 0) {
      listaEl.innerHTML = "<p class='vazio'>Sua lista está vazia. Adicione a primeira tarefa!</p>";
      return;
    }

    for (let i = 0; i < lista.length; i++) {
      const tarefa = lista[i];
      const estaFeita = Boolean(tarefa.feito || tarefa.concluido);
      const ehAtrasada = estaAtrasada(tarefa);
      const prioridadeNome = (tarefa.prioridade || "media").toLowerCase();
      const categoriaNome = (tarefa.categoria || "pessoal").toLowerCase();
      const textoExibicao = tarefa.texto || (tarefa.cliente ? `${tarefa.cliente}: ${tarefa.itens || ""}` : "Tarefa");

      // Container principal do Card Moderno (border-radius: 12px, sombra e borda suave)
      const item = document.createElement("li");
      item.className = `card-tarefa-moderna ${estaFeita ? "feita" : ""} ${ehAtrasada ? "card-atrasada" : ""}`;
      item.dataset.id = tarefa.id;

      // 1. Cabeçalho do Card: Badges de Prioridade, Categoria, Atrasada, Data de Vencimento e Botão Lixeira
      const cardHeader = document.createElement("div");
      cardHeader.className = "card-tarefa-header";

      const badgesWrap = document.createElement("div");
      badgesWrap.className = "card-tarefa-badges";

      const badgePrioridade = document.createElement("span");
      badgePrioridade.className = `badge-prioridade ${prioridadeNome}`;
      badgePrioridade.textContent = prioridadeNome.toUpperCase();

      const badgeCategoria = document.createElement("span");
      badgeCategoria.className = `categoria ${categoriaNome}`;
      badgeCategoria.textContent = categoriaNome;

      badgesWrap.appendChild(badgePrioridade);
      badgesWrap.appendChild(badgeCategoria);

      if (ehAtrasada) {
        const badgeAtraso = document.createElement("span");
        badgeAtraso.className = "atrasada";
        badgeAtraso.innerHTML = "⏰ ATRASADA";
        badgesWrap.appendChild(badgeAtraso);
      }

      const headerRight = document.createElement("div");
      headerRight.className = "card-tarefa-header-right";

      const spanPrazo = document.createElement("span");
      spanPrazo.className = "card-prazo";
      spanPrazo.title = "Prazo da tarefa";
      spanPrazo.innerHTML = `<span class="prazo-icon">📅</span> <span class="prazo-txt">${tarefa.vence || "Hoje"}</span>`;

      const btnApagar = document.createElement("button");
      btnApagar.type = "button";
      btnApagar.className = "btn-apagar-card";
      btnApagar.setAttribute("aria-label", "Apagar tarefa");
      btnApagar.title = "Apagar tarefa";
      btnApagar.innerHTML = `<span class="trash-icon">🗑️</span>`;
      btnApagar.addEventListener("click", (e) => {
        e.stopPropagation();
        this.pedidos = this.pedidos.filter((t) => t.id !== tarefa.id);
        this.salvarPedidos();
        this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
        ToastView.mostrarToast("Tarefa excluída com sucesso!", "🗑️");
      });

      headerRight.appendChild(spanPrazo);
      headerRight.appendChild(btnApagar);

      cardHeader.appendChild(badgesWrap);
      cardHeader.appendChild(headerRight);

      // 2. Centro: Checkbox customizado circular/quadrado moderno com Título/Descrição nítidos
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
      spanTexto.textContent = textoExibicao;

      infoWrap.appendChild(spanTexto);

      if (tarefa.criadaEm) {
        const metaCriacao = document.createElement("span");
        metaCriacao.className = "card-tarefa-meta";
        const d = new Date(tarefa.criadaEm);
        metaCriacao.textContent = !isNaN(d.getTime())
          ? `Criada em ${d.toLocaleDateString("pt-BR")}`
          : `Criada em ${tarefa.criadaEm}`;
        infoWrap.appendChild(metaCriacao);
      }

      const alternarStatus = () => {
        tarefa.feito = !tarefa.feito;
        tarefa.concluido = tarefa.feito;
        this.salvarPedidos();
        this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
      };

      checkInput.addEventListener("change", alternarStatus);
      spanTexto.addEventListener("click", alternarStatus);

      cardBody.appendChild(checkLabel);
      cardBody.appendChild(infoWrap);

      // 3. Subtarefas (Passos): Área limpa e compacta com barra de progresso fina se houver passos
      if (!tarefa.subtarefas) tarefa.subtarefas = [];
      const subtarefasArea = document.createElement("div");
      subtarefasArea.className = "card-subtarefas-area subtarefas";

      const totalSub = tarefa.subtarefas.length;
      const feitasSub = tarefa.subtarefas.filter(s => s.feito).length;
      const pctSub = totalSub === 0 ? 0 : Math.round((feitasSub / totalSub) * 100);

      if (totalSub > 0) {
        const progressoSubWrap = document.createElement("div");
        progressoSubWrap.className = "sub-progresso-bar-wrap";

        const subInfoRow = document.createElement("div");
        subInfoRow.className = "sub-progresso-info";
        subInfoRow.innerHTML = `
          <span class="sub-progresso-label">Passos da tarefa</span>
          <span class="sub-progresso-count sub-contador">${feitasSub}/${totalSub} concluídos</span>
        `;

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
          subCheck.title = sub.feito ? "Marcar pendente" : "Marcar concluído";
          subCheck.addEventListener("click", () => {
            sub.feito = !sub.feito;
            this.salvarPedidos();
            this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
          });

          const subTexto = document.createElement("span");
          subTexto.className = "sub-item-texto sub-texto";
          subTexto.textContent = sub.texto;

          const subApagar = document.createElement("button");
          subApagar.type = "button";
          subApagar.className = "sub-apagar-btn sub-apagar";
          subApagar.textContent = "×";
          subApagar.title = "Excluir passo";
          subApagar.addEventListener("click", () => {
            tarefa.subtarefas = tarefa.subtarefas.filter(s => s.id !== sub.id);
            this.salvarPedidos();
            this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
          });

          subItem.appendChild(subCheck);
          subItem.appendChild(subTexto);
          subItem.appendChild(subApagar);
          subLista.appendChild(subItem);
        }

        subtarefasArea.appendChild(subLista);
      }

      // Campo de adicionar novo passo (discreto, moderno e compacto)
      const subForm = document.createElement("div");
      subForm.className = "sub-form-compacto sub-form";

      const subInput = document.createElement("input");
      subInput.type = "text";
      subInput.className = "sub-input-modern sub-input";
      subInput.placeholder = "Novo passo...";
      subInput.setAttribute("aria-label", "Novo passo da tarefa");

      const subAdd = document.createElement("button");
      subAdd.type = "button";
      subAdd.className = "btn-add-passo sub-add";
      subAdd.textContent = "+ Passo";

      const adicionarPasso = () => {
        const txt = subInput.value.trim();
        if (txt === "") return;
        tarefa.subtarefas.push({
          id: Date.now() + "-" + Math.floor(Math.random() * 100000),
          texto: txt,
          feito: false
        });
        this.salvarPedidos();
        this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
      };

      subAdd.addEventListener("click", adicionarPasso);
      subInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          adicionarPasso();
        }
      });

      subForm.appendChild(subInput);
      subForm.appendChild(subAdd);
      subtarefasArea.appendChild(subForm);

      // Monta o Card Completo
      item.appendChild(cardHeader);
      item.appendChild(cardBody);
      item.appendChild(subtarefasArea);

      listaEl.appendChild(item);
    }
  }

  renderizarTabela(filtroBusca = "", filtroStatus = "", filtroOrdenacao = "prioridade", filtroCategoria = "todas") {
    if (!this.tbody) {
      this.tbody = document.getElementById("admin-orders-table-body");
    }
    if (!this.tbody) return;

    const lista = this.orderModel.filtrarEOrdenar(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);

    this.renderizarListaTarefas(lista, {
      filtroBusca,
      filtroStatus,
      filtroOrdenacao,
      filtroCategoria
    });

    this.tbody.innerHTML = "";

    if (lista.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="8" class="vazio" style="text-align: center; padding: 28px; color: #888e99;">
            <p class="vazio">Sua lista está vazia. Adicione a primeira tarefa!</p>
          </td>
        </tr>
      `;
      this.atualizarResumo();
      this.atualizarProgresso();
      return;
    }

    lista.forEach(ped => {
      const tr = document.createElement("tr");
      if (ped.concluido || ped.feito) {
        tr.classList.add("pedido-concluido");
      }

      let badgeClass = "aberto";
      const localStr = String(ped.local || "").toLowerCase();
      if (localStr.includes("mesa")) badgeClass = "mesa";
      else if (localStr.includes("delivery")) badgeClass = "delivery";
      else if (localStr.includes("balcão") || localStr.includes("balcao")) badgeClass = "aberto";

      const nomeExibicao = ped.cliente || ped.atendente || "Cliente Online";
      const ehNovo = ped.novo && !ped.concluido && !ped.feito;
      const ehAtrasada = estaAtrasada(ped);
      const prioridadeNome = (ped.prioridade || "media").toLowerCase();
      const categoriaNome = (ped.categoria || "trabalho").toLowerCase();

      tr.innerHTML = `
        <td class="col-center">
          <span class="badge-prioridade ${prioridadeNome}">
            ${prioridadeNome.toUpperCase()}
          </span>
        </td>
        <td class="col-center">
          <span class="categoria ${categoriaNome}">
            ${categoriaNome}
          </span>
        </td>
        <td>
          <div class="hora-prazo-cell">
            <strong>${ped.hora || "Hoje"}</strong>
            <div class="prazo-sub">
              <span>Prazo: ${ped.vence || "Hoje"}</span>
              ${ehAtrasada ? '<span class="atrasada">ATRASADA</span>' : ''}
            </div>
          </div>
        </td>
        <td>
          <div class="cliente-cell-wrap">
            ${ehNovo ? '<span class="badge-novo-ped">NOVO</span>' : ''}
            <div class="cliente-info-row">
              <span class="cliente-icon">👤</span>
              <strong class="cliente-nome-txt">${nomeExibicao}</strong>
            </div>
          </div>
        </td>
        <td class="col-center">
          <span class="status-tag ${badgeClass}">${ped.local || "Balcão"}</span>
        </td>
        <td class="itens-pedido-cell">${ped.itens || "-"}</td>
        <td class="total-pedido-cell"><strong>${formatarPreco(ped.total || 0)}</strong></td>
        <td class="col-center">
          <div class="action-btn-group">
            <button class="btn-action-outline btn-concluir-ped ${(ped.concluido || ped.feito) ? 'concluido' : ''}" data-id="${ped.id}" title="Marcar como concluído/aberto">
              ${(ped.concluido || ped.feito) ? "✔ Concluído" : "Marcar Pronto"}
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
    this.atualizarProgresso();
  }

  alternarConcluido(id) {
    this.orderModel.alternarConcluido(id);
    this.renderizarTabela();
  }

  obterExcluidos() {
    return this.orderModel.obterExcluidos();
  }

  registrarExcluido(idOuUid) {
    this.orderModel.registrarExcluido(idOuUid);
  }

  foiExcluido(idOuUid) {
    return this.orderModel.foiExcluido(idOuUid);
  }

  limparConcluidos() {
    this.orderModel.limparConcluidos();
    this.renderizarTabela();
  }

  limparTodos() {
    this.orderModel.limparTodos();
    this.renderizarTabela();
  }

  cancelarPedido(id) {
    this.orderModel.cancelarPedido(id);
    this.renderizarTabela();
  }

  adicionarPedido(dadosPedido) {
    const novoPedido = this.orderModel.adicionarPedido(dadosPedido);
    this.renderizarTabela();

    try {
      const canal = new BroadcastChannel("cardapio_pedidos_channel");
      canal.postMessage({ type: "NOVO_PEDIDO", pedido: novoPedido });
      canal.close();
    } catch (e) {}

    return novoPedido;
  }

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
