// Nome da "caixa" do cache. Troque para v2, v3... ao mudar os arquivos.
const CACHE = "cardapio-admin-v1";

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
  "./icons/icon-512.png"
];

// 1) INSTALAR: guarda os arquivos no cache.
self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ARQUIVOS);
    })
  );
});

// 2) ATIVAR: apaga caches de versões antigas.
self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(
        nomes.map(function (nome) {
          if (nome !== CACHE) {
            return caches.delete(nome);
          }
        })
      );
    })
  );
});

// 3) BUSCAR: responde do cache; se não achar, vai à rede.
self.addEventListener("fetch", function (evento) {
  evento.respondWith(
    caches.match(evento.request).then(function (guardado) {
      return guardado || fetch(evento.request);
    })
  );
});
