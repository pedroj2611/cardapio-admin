// ==========================================================================
// SERVICE WORKER (PWA - FANESE AULA 05: CACHE V4 & OFFLINE)
// ==========================================================================

// Nome da "caixa" do cache (v4 conforme Aula 05 da FANESE)
const CACHE = "cardapio-admin-v4";

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
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./qrcode_projeto.png"
];

// 1) INSTALAR: guarda os arquivos no cache v3.
self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[SW] Armazenando no cache v3:", CACHE);
      return cache.addAll(ARQUIVOS);
    })
  );
});

// 2) ATIVAR: apaga caches de versões antigas (ex: v1).
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
    })
  );
});

// 3) BUSCAR: responde do cache (Cache First); se não achar, vai à rede.
self.addEventListener("fetch", function (evento) {
  evento.respondWith(
    caches.match(evento.request).then(function (guardado) {
      return guardado || fetch(evento.request);
    })
  );
});
