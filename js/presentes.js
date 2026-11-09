/* ============================================================
   Lista de presentes — reservas
   Dois modos: "local" (este aparelho) e "firebase" (todos juntos).

   Sobre a corrida entre convidados: no Firebase usamos a API REST de
   transacao (X-Firebase-ETag). O servidor so grava se o etag enviado
   ainda for o atual. Se outro convidado reservou no meio do caminho,
   o servidor recusa e nos tentamos de novo. Sem isso, dois cliques
   simultaneos reservariam o mesmo item.
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.CONFIG || {};

  var CHAVE_MEUS = "casamento-leo-millene:minhas-reservas";
  var CHAVE_PUB  = "casamento-leo-millene:reservas";

  function lsGet(k, padrao) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; }
    catch (e) { return padrao; }
  }

  function lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  function marcaMeu(id) {
    var meus = lsGet(CHAVE_MEUS, []);
    if (meus.indexOf(id) === -1) meus.push(id);
    lsSet(CHAVE_MEUS, meus);
  }

  function desmarcaMeu(id) {
    lsSet(CHAVE_MEUS, lsGet(CHAVE_MEUS, []).filter(function (x) { return x !== id; }));
  }

  /* ---------------- modo local ---------------- */

  var Local = {
    nome: "local",
    buscar: function () {
      return Promise.resolve(lsGet(CHAVE_PUB, {}));
    },
    reservar: function (id) {
      var pub = lsGet(CHAVE_PUB, {});
      if (pub[id]) return Promise.resolve({ ok: false, motivo: "ocupado" });
      pub[id] = 1;
      lsSet(CHAVE_PUB, pub);
      marcaMeu(id);
      return Promise.resolve({ ok: true });
    },
    liberar: function (id) {
      var pub = lsGet(CHAVE_PUB, {});
      delete pub[id];
      lsSet(CHAVE_PUB, pub);
      desmarcaMeu(id);
      return Promise.resolve({ ok: true });
    },
    meus: function () { return lsGet(CHAVE_MEUS, []); },
    aoMudar: function (cb) {
      window.addEventListener("storage", function (e) {
        if (e.key === CHAVE_PUB) cb(lsGet(CHAVE_PUB, {}));
      });
    }
  };

  /* ---------------- modo firebase ---------------- */

  var Firebase = {
    nome: "firebase",
    base: "",

    monta: function () {
      var url = String((CFG.infra && CFG.infra.firebaseUrl) || "").replace(/\/+$/, "");
      if (!url) {
        this.erro = "firebaseUrl está vazio em js/config.js";
        return false;
      }
      if (!/^https?:\/\//.test(url)) {
        this.erro = "firebaseUrl precisa começar com https://";
        return false;
      }
      this.base = url + "/reservas";
      return true;
    },

    url: function (id) {
      return this.base + (id ? "/" + encodeURIComponent(id) : "") + ".json";
    },

    buscar: function () {
      if (!this.base) return Promise.resolve({});
      return fetch(this.url(), { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (d) { return d && typeof d === "object" ? d : {}; })
        .catch(function (e) {
          Firebase.erro = "Falha ao ler a lista: " + e.message;
          return {};
        });
    },

    // le o etag atual e tenta gravar condicionado a ele; repete se houve corrida
    reservar: function (id, tentativa) {
      var self = this;
      tentativa = tentativa || 1;
      if (!this.base) return Promise.resolve({ ok: false, motivo: "sem-conexao" });

      return fetch(this.url(id), { cache: "no-store" })
        .then(function (r) {
          var etag = r.headers.get("ETag");
          return r.json().then(function (atual) {
            return { etag: etag, atual: atual };
          });
        })
        .then(function (estado) {
          if (estado.atual) {
            return { ok: false, motivo: "ocupado" };
          }

          var headers = { "Content-Type": "application/json" };
          if (estado.etag) headers["if-match"] = estado.etag;
          else headers["if-match"] = "null_etag";

          return fetch(self.url(id), {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ t: Date.now() })
          }).then(function (r) {
            if (r.ok) return { ok: true };
            if (r.status === 412) {
              // outro convidado chegou primeiro
              if (tentativa < 3) return self.reservar(id, tentativa + 1);
              return { ok: false, motivo: "ocupado" };
            }
            return { ok: false, motivo: "erro", status: r.status };
          });
        })
        .then(function (res) {
          if (res.ok) marcaMeu(id);
          return res;
        })
        .catch(function (e) {
          self.erro = "Falha ao reservar: " + e.message;
          return { ok: false, motivo: "offline" };
        });
    },

    liberar: function (id) {
      var self = this;
      if (!this.base) return Promise.resolve({ ok: false });
      return fetch(this.url(id), {
        method: "DELETE",
        headers: { "if-match": "*" }
      })
        .then(function () { desmarcaMeu(id); return { ok: true }; })
        .catch(function () { return { ok: false }; });
    },

    meus: function () { return lsGet(CHAVE_MEUS, []); },

    aoMudar: function (cb) {
      var self = this;
      if (!this.base) return;

      // polling leve: o EventSource do REST nao expoe o snapshot de forma
      // confiavel entre navegadores; 20s e suficiente para um site de festa
      setInterval(function () {
        if (document.hidden) return;
        self.buscar().then(cb);
      }, 20000);

      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) self.buscar().then(cb);
      });
    }
  };

  var querFirebase = String(CFG.infra && CFG.infra.modo) === "firebase";
  var Store = querFirebase && Firebase.monta() ? Firebase : Local;

  Store.motivoLocal = querFirebase && Store === Local ? (Firebase.erro || "configuração incompleta") : "";

  window.Reservas = Store;
})();
