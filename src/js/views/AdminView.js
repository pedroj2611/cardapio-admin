/**
 * ==========================================================================
 * VIEW LAYER - ADMIN DASHBOARD VIEW (src/js/views/AdminView.js)
 * Responsável exclusivamente pela renderização da interface do Painel Admin
 * (Tabelas, Lista de Tarefas/Subtarefas, Resumo AV1 e Barra de Progresso),
 * delegando os dados e persistência ao OrderModel (Padrão MVC).
 * ==========================================================================
 */

import { formatarPreco } from "./ProductView.js";
import { OrderModel, PEDIDOS_INICIAIS, hojeTexto, estaAtrasada } from "../models/OrderModel.js";

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
  }

  importar(arquivo) {
    this.orderModel.importar(arquivo, () => {
      this.renderizarTabela();
    });
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

      const item = document.createElement("li");
      if (tarefa.feito || tarefa.concluido) {
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
      texto.textContent = tarefa.texto || (tarefa.cliente ? `${tarefa.cliente}: ${tarefa.itens || ""}` : "Tarefa");
      texto.addEventListener("click", () => {
        tarefa.feito = !tarefa.feito;
        tarefa.concluido = tarefa.feito;
        this.salvarPedidos();
        this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
      });

      item.appendChild(etiqueta);
      item.appendChild(chip);
      item.appendChild(texto);

      if (estaAtrasada(tarefa)) {
        const atraso = document.createElement("span");
        atraso.className = "atrasada";
        atraso.textContent = "Atrasada";
        item.appendChild(atraso);
      }

      const apagar = document.createElement("button");
      apagar.textContent = "🗑";
      apagar.className = "apagar";
      apagar.setAttribute("aria-label", "Apagar tarefa");
      apagar.title = "Apagar tarefa";
      apagar.addEventListener("click", () => {
        this.pedidos = this.pedidos.filter((t) => t.id !== tarefa.id);
        this.salvarPedidos();
        this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
      });

      item.appendChild(apagar);

      // --- Subtarefas (os passos da tarefa) (FANESE Aula 08 - Passo 28) ---
      if (!tarefa.subtarefas) tarefa.subtarefas = [];

      const subBox = document.createElement("div");
      subBox.className = "subtarefas";

      const subContador = document.createElement("div");
      subContador.className = "sub-contador";
      const feitasSub = tarefa.subtarefas.filter(function (s) { return s.feito; }).length;
      subContador.textContent = feitasSub + "/" + tarefa.subtarefas.length + " passos";
      subBox.appendChild(subContador);

      for (let j = 0; j < tarefa.subtarefas.length; j++) {
        const sub = tarefa.subtarefas[j];

        const subItem = document.createElement("div");
        subItem.className = "sub-item" + (sub.feito ? " sub-feita" : "");

        const check = document.createElement("span");
        check.className = "sub-check";
        check.textContent = sub.feito ? "✅" : "⬜";
        check.addEventListener("click", () => {
          sub.feito = !sub.feito;
          this.salvarPedidos();
          this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
        });

        const subTexto = document.createElement("span");
        subTexto.className = "sub-texto";
        subTexto.textContent = sub.texto;

        const subApagar = document.createElement("button");
        subApagar.className = "sub-apagar";
        subApagar.textContent = "×";
        subApagar.addEventListener("click", () => {
          tarefa.subtarefas = tarefa.subtarefas.filter(function (s) { return s.id !== sub.id; });
          this.salvarPedidos();
          this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
        });

        subItem.appendChild(check);
        subItem.appendChild(subTexto);
        subItem.appendChild(subApagar);
        subBox.appendChild(subItem);
      }

      const subForm = document.createElement("div");
      subForm.className = "sub-form";

      const subInput = document.createElement("input");
      subInput.className = "sub-input";
      subInput.placeholder = "Novo passo...";

      const subAdd = document.createElement("button");
      subAdd.className = "sub-add";
      subAdd.textContent = "+ Passo";
      subAdd.addEventListener("click", () => {
        const txt = subInput.value.trim();
        if (txt === "") return;
        tarefa.subtarefas.push({
          id: Date.now() + "-" + Math.floor(Math.random() * 100000),
          texto: txt,
          feito: false
        });
        this.salvarPedidos();
        this.renderizarTabela(filtroBusca, filtroStatus, filtroOrdenacao, filtroCategoria);
      });

      subForm.appendChild(subInput);
      subForm.appendChild(subAdd);
      subBox.appendChild(subForm);

      item.appendChild(subBox);
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
