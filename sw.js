// ==========================================================================
// SERVICE WORKER (PWA - FANESE: CACHE V8 & ATUALIZAÇÃO IMEDIATA)
// ==========================================================================

// Nome da "caixa" do cache (v12)
const CACHE = "cardapio-admin-v12";

// Arquivos que o app precisa para funcionar offline.
const ARQUIVOS = [
  "./",
  "./index.html",
  "./css/base.css",
  "./css/components.css",
  "./css/modals.css",
  "./style.css",
  "./js/controllers/AppController.js",
  "./js/models/ProductModel.js",
  "./js/models/CartModel.js",
  "./js/models/ConfigModel.js",
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
  "./qrcode_projeto.png"
];

// 1) INSTALAR: força ativação imediata e guarda os arquivos essenciais.
self.addEventListener("install", function (evento) {
  self.skipWaiting(); // Não espera as outras abas fecharem
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[SW] Armazenando no cache v6:", CACHE);
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

// 3) BUSCAR: Network First com fallback para Cache (garante que código novo seja baixado online e funcione offline).
self.addEventListener("fetch", function (evento) {
  evento.respondWith(
    fetch(evento.request)
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
        // Se estiver sem conexão (Modo Avião), entrega do cache!
        return caches.match(evento.request);
      })
  );
});

