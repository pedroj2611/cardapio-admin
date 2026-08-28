/**
 * ==========================================================================
 * VIEW LAYER - TOAST & CONFIRMATION VIEW (src/js/views/ToastView.js)
 * ==========================================================================
 */

export class ToastView {
  static mostrarToast(mensagem, icone = "✅") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.innerHTML = `<span>${icone}</span> <span>${mensagem}</span>`;
    toast.classList.add("show");

    clearTimeout(toast.tempo);
    toast.tempo = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  static solicitarConfirmacao(titulo, mensagem, icone, acao) {
    const modalConf = document.getElementById("modal-confirmacao");
    const elTitulo = document.getElementById("confirm-titulo");
    const elMensagem = document.getElementById("confirm-mensagem");
    const elIcone = document.getElementById("confirm-icon");
    const btnOk = document.getElementById("btn-confirm-ok");
    const btnCancel = document.getElementById("btn-confirm-cancelar");

    if (!modalConf) {
      if (confirm(mensagem)) acao();
      return;
    }

    if (elTitulo) elTitulo.textContent = titulo;
    if (elMensagem) elMensagem.textContent = mensagem;
    if (elIcone) elIcone.textContent = icone || "⚠️";

    // Bind direto e desacoplado dos botões de ação do modal
    if (btnOk) {
      btnOk.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        ToastView.fecharModalConfirmacao();
        setTimeout(() => {
          if (typeof acao === "function") {
            acao();
          }
        }, 50);
      };
    }

    if (btnCancel) {
      btnCancel.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        ToastView.fecharModalConfirmacao();
      };
    }

    if (typeof modalConf.showModal === "function") {
      try {
        modalConf.showModal();
      } catch (err) {
        modalConf.setAttribute("open", "true");
        modalConf.style.display = "block";
      }
    } else {
      modalConf.setAttribute("open", "true");
      modalConf.style.display = "block";
    }
  }

  static fecharModalConfirmacao() {
    const modalConf = document.getElementById("modal-confirmacao");
    if (modalConf) {
      if (typeof modalConf.close === "function") {
        try {
          modalConf.close();
        } catch (err) {
          modalConf.removeAttribute("open");
          modalConf.style.display = "none";
        }
      } else {
        modalConf.removeAttribute("open");
        modalConf.style.display = "none";
      }
    }
  }
}
