/* ============================================================
   Interface da lista de presentes
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.CONFIG || {};
  var Store = window.Reservas;
  var lista = document.getElementById("lista");
  if (!lista || !Store) return;

  var filtros = document.getElementById("filtros");
  var fill = document.getElementById("progressoFill");
  var textoTot = document.getElementById("progressoTexto");
  var chipMeus = document.getElementById("chipMeus");
  var chipLivres = document.getElementById("chipLivres");
  var btnSurpresa = document.getElementById("btnSurpresa");

  var itens = (CFG.presentes || []).map(function (p) {
    return { id: p.id, nome: p.nome, categoria: p.categoria };
  });

  var categorias = [];
  itens.forEach(function (i) {
    if (categorias.indexOf(i.categoria) === -1) categorias.push(i.categoria);
  });

  var estado = {
    reservas: {},
    categoria: "Todos",
    filtro: "todos"
  };

  var esc = function (t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  var meus = function () { return Store.meus() || []; };
  var souEu = function (id) { return meus().indexOf(id) !== -1; };

  /* ---------------- filtros ---------------- */

  function montaFiltros() {
    var html = ['<button class="filtro" type="button" data-cat="Todos" aria-pressed="true">Todos <span class="conta">' + itens.length + "</span></button>"];
    categorias.forEach(function (c) {
      var n = itens.filter(function (i) { return i.categoria === c; }).length;
      html.push('<button class="filtro" type="button" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + ' <span class="conta">' + n + "</span></button>");
    });
    filtros.innerHTML = html.join("");

    filtros.addEventListener("click", function (e) {
      var b = e.target.closest(".filtro");
      if (!b) return;
      estado.categoria = b.dataset.cat;
      Array.prototype.forEach.call(filtros.children, function (c) {
        c.setAttribute("aria-pressed", c === b ? "true" : "false");
      });
      desenha();
    });
  }

  /* ---------------- render ---------------- */

  function desenha() {
    var visiveis = itens.filter(function (i) {
      if (estado.categoria !== "Todos" && i.categoria !== estado.categoria) return false;
      var r = !!estado.reservas[i.id];
      if (estado.filtro === "meus") return r && souEu(i.id);
      if (estado.filtro === "livres") return !r;
      return true;
    });

    if (!visiveis.length) {
      lista.innerHTML = '<li class="vazio">' +
        (estado.filtro === "meus"
          ? "Você ainda não reservou nenhum presente."
          : "Tudo reservado por aqui. Que alegria!") +
        "</li>";
    } else {
      lista.innerHTML = visiveis.map(cartao).join("");
    }

    atualizaProgresso();
  }

  function cartao(i) {
    var reservado = !!estado.reservas[i.id];
    var meu = reservado && souEu(i.id);
    var cls = "item" + (reservado ? " is-reservado" : "") + (meu ? " is-meu" : "");

    var acao = meu
      ? '<button class="item__acao" type="button" data-liberar="' + esc(i.id) + '" aria-label="Liberar ' + esc(i.nome) + '">Liberar</button>'
      : reservado
        ? '<span class="item__acao" aria-label="Já reservado">Reservado</span>'
        : '<button class="item__acao" type="button" data-reservar="' + esc(i.id) + '" aria-label="Reservar ' + esc(i.nome) + '">Reservar</button>';

    return '<li class="' + cls + '" data-id="' + esc(i.id) + '">' +
      '<span class="item__nome">' + esc(i.nome) + "</span>" +
      '<span class="item__cat">' + esc(i.categoria) + "</span>" +
      acao +
      "</li>";
  }

  function atualizaProgresso() {
    var total = itens.length;
    var feitos = itens.filter(function (i) { return estado.reservas[i.id]; }).length;
    var pct = total ? Math.round((feitos / total) * 100) : 0;
    if (fill) fill.style.width = pct + "%";
    if (textoTot) textoTot.textContent = feitos + " de " + total + " reservados";
  }

  /* ---------------- ações ---------------- */

  lista.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;

    if (b.dataset.reservar) {
      var id = b.dataset.reservar;
      b.disabled = true;
      Store.reservar(id).then(function (r) {
        if (r && r.ok) {
          estado.reservas[id] = 1;
          desenha();
          var el = lista.querySelector('[data-id="' + id + '"]');
          if (el) { el.classList.add("pulso"); }
          aviso("Reservado. Obrigado por fazer parte da nossa história.");
        } else {
          b.disabled = false;
          recarrega();
          aviso("Ops, alguém reservou esse agora há pouco.");
        }
      });
      return;
    }

    if (b.dataset.liberar) {
      var id2 = b.dataset.liberar;
      b.disabled = true;
      Store.liberar(id2).then(function () {
        delete estado.reservas[id2];
        desenha();
        aviso("Item liberado para outro convidado.");
      });
    }
  });

  function aviso(msg) {
    if (window.__toast) window.__toast(msg);
  }

  /* ---------------- carga ---------------- */

  function recarrega() {
    return Store.buscar().then(function (r) {
      estado.reservas = r || {};
      desenha();
    });
  }

  chipMeus.addEventListener("click", function () {
    estado.filtro = estado.filtro === "meus" ? "todos" : "meus";
    chipMeus.setAttribute("aria-pressed", estado.filtro === "meus" ? "true" : "false");
    chipLivres.setAttribute("aria-pressed", "false");
    desenha();
  });

  chipLivres.addEventListener("click", function () {
    estado.filtro = estado.filtro === "livres" ? "todos" : "livres";
    chipLivres.setAttribute("aria-pressed", estado.filtro === "livres" ? "true" : "false");
    chipMeus.setAttribute("aria-pressed", "false");
    desenha();
  });

  if (btnSurpresa) {
    btnSurpresa.addEventListener("click", function () {
      var livres = itens.filter(function (i) { return !estado.reservas[i.id]; });
      if (!livres.length) { aviso("A lista já foi toda reservada. Obrigado!"); return; }
      var sorteado = livres[Math.floor(Math.random() * livres.length)];
      estado.categoria = "Todos";
      Array.prototype.forEach.call(filtros.children, function (c, n) {
        c.setAttribute("aria-pressed", n === 0 ? "true" : "false");
      });
      desenha();
      var el = lista.querySelector('[data-id="' + sorteado.id + '"]');
      if (el) {
        el.classList.add("pulso");
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      aviso("Que tal " + sorteado.nome + "?");
    });
  }

  montaFiltros();
  recarrega();
  Store.aoMudar(function (r) { estado.reservas = r || {}; desenha(); });
})();
