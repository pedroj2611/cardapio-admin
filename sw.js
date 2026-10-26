// ==========================================================================
// SERVICE WORKER (PWA - FANESE AULA 09: INSTALAR, ONLINE/OFFLINE & CACHE MVC)
// ==========================================================================

// Nome da "caixa" do cache. Troque para nova versão ao mudar os arquivos (Aula 08/09).
const CACHE = "minhas-tarefas-v16";

// Arquivos que o app precisa para funcionar offline (Arquitetura MVC limpa).
const ARQUIVOS = [
  "./",
  "./index.html",
  "./css/base.css",
  "./css/components.css",
  "./css/modals.css",
  "./js/controllers/AppController.js",
  "./js/models/ProductModel.js",
  "./js/models/CartModel.js",
  "./js/models/ConfigModel.js",
  "./js/models/OrderModel.js",
  "./js/views/ProductView.js",
  "./js/views/CartView.js",
  "./js/views/ModalView.js",
  "./js/views/ToastView.js",
  "./js/views/AdminView.js",
  "./manifest.json",
  "./icons/logo.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/fundo-madeira.jpg",
  "./icons/ui/cardapio.svg",
  "./icons/ui/config.svg",
  "./icons/ui/instalar.svg",
  "./icons/ui/tema-escuro.svg",
  "./icons/ui/tema-claro.svg",
  "./icons/ui/offline.svg",
  "./icons/ui/busca.svg",
  "./icons/ui/editar.svg",
  "./icons/ui/apagar.svg",
  "./icons/ui/exportar.svg",
  "./icons/ui/importar.svg",
  "./icons/ui/check.svg",
  "./icons/ui/pdf.svg",
  "./icons/ui/plus.svg",
  "./icons/ui/clock.svg",
  "./icons/ui/cart.svg",
  "./icons/ui/sync.svg",
  "./icons/ui/lock.svg"
];

// 1) INSTALAR: força ativação imediata e guarda os arquivos essenciais.
self.addEventListener("install", function (evento) {
  self.skipWaiting(); // Não espera as outras abas fecharem
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[SW] Armazenando no cache PWA:", CACHE);
      return cache.addAll(ARQUIVOS);
    })
  );
});

// 2) ATIVAR: limpa caches antigos e assume o controle dos clientes na hora.
self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(
        nomes.map(function (nome) {
          if (nome !== CACHE) {
            console.log("[SW] Limpando cache antigo:", nome);
            return caches.delete(nome);
          }
        })
      );
    }).then(function () {
      return self.clients.claim(); // Assume o controle imediatamente
    })
  );
});

// 3) BUSCAR: Network First com fallback para Cache (garante código atualizado online e funcionamento offline).
self.addEventListener("fetch", function (evento) {
  // Ignora requisições de outras origens (ex: ntfy.sh ou APIs externas de sincronização)
  if (!evento.request.url.startsWith(self.location.origin)) {
    return;
  }

  evento.respondWith(
    fetch(evento.request, { cache: "no-cache" })
      .then(function (respostaRede) {
        if (respostaRede && respostaRede.status === 200 && respostaRede.type === "basic") {
          const clone = respostaRede.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(evento.request, clone);
          });
        }
        return respostaRede;
      })
      .catch(function () {
        // Se estiver sem conexão (Modo Offline), entrega do cache!
        return caches.match(evento.request);
      })
  );
});
