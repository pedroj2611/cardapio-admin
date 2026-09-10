/**
 * ==========================================================================
 * VIEW LAYER - CART VIEW (src/js/views/CartView.js)
 * ==========================================================================
 */

import { formatarPreco } from "./ProductView.js";

export class CartView {
  constructor() {
    this.carrinhoQtd = document.getElementById("carrinho-qtd");
    this.carrinhoResumo = document.getElementById("carrinho-resumo-texto");
    this.carrinhoTotal = document.getElementById("carrinho-total-valor");

    this.listaModal = document.getElementById("pedido-itens-lista");
    this.modalSubtotalValor = document.getElementById("modal-subtotal-valor");
    this.modalTaxaValor = document.getElementById("modal-taxa-valor");
    this.modalValorTotal = document.getElementById("modal-valor-total");
  }

  atualizarDock(totais) {
    if (this.carrinhoQtd) this.carrinhoQtd.textContent = totais.totalQtd;
    if (this.carrinhoResumo) {
      this.carrinhoResumo.textContent = totais.totalQtd === 0 
        ? "Nenhum item selecionado" 
        : `${totais.totalQtd} ${totais.totalQtd === 1 ? "item selecionado" : "itens selecionados"}`;
    }
    if (this.carrinhoTotal) this.carrinhoTotal.textContent = formatarPreco(totais.subtotalValor);
  }

  renderizarModalItens(carrinho, totais) {
    if (this.listaModal) {
      if (carrinho.length === 0) {
        this.listaModal.innerHTML = `
          <div style="text-align: center; padding: 28px 16px; color: #64748b;">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">🛒</span>
            <p style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">Seu carrinho está vazio</p>
            <p style="font-size: 0.85rem;">Selecione delícias do nosso cardápio para montar seu pedido.</p>
          </div>
        `;
      } else {
        this.listaModal.innerHTML = carrinho.map(item => `
          <div class="modal-item-card">
            <div class="modal-item-info-group">
              <div class="modal-item-title"><span class="item-icon">${item.icone || '🍽️'}</span> ${item.nome}</div>
              <div class="modal-item-subtext">${item.quantidade}x de ${formatarPreco(item.preco)}</div>
            </div>
            <div class="modal-item-controls">
              <div class="stepper-pill">
                <button class="btn-step-pill btn-modal-diminuir" data-id="${item.id}" title="Diminuir">-</button>
                <span class="step-pill-val">${item.quantidade}</span>
                <button class="btn-step-pill btn-modal-aumentar" data-id="${item.id}" title="Aumentar">+</button>
              </div>
              <div class="modal-item-price">${formatarPreco(item.preco * item.quantidade)}</div>
            </div>
          </div>
        `).join("");
      }
    }

    if (this.modalSubtotalValor) this.modalSubtotalValor.textContent = formatarPreco(totais.subtotalValor);
    if (this.modalTaxaValor) {
      this.modalTaxaValor.textContent = (totais.taxaEntrega === 0) ? "Grátis" : formatarPreco(totais.taxaEntrega);
    }
    if (this.modalValorTotal) this.modalValorTotal.textContent = formatarPreco(totais.totalGeral);
  }
}
