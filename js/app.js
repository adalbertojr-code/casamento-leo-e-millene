/* ============================================================
   Léo & Millene — textos, contagem regressiva e contatos
   Depende apenas de js/config.js.
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var MESES = ["janeiro","fevereiro","março","abril","maio","junho",
               "julho","agosto","setembro","outubro","novembro","dezembro"];

  var pad = function (n) { return n < 10 ? "0" + n : String(n); };

  function toast(msg, ms) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("is-on"); }, ms || 3200);
  }

  /* ---------- data ---------- */

  var ALVO = new Date(CFG.data || "2027-08-20T16:00:00-03:00");

  var diaMesAno = ALVO.getDate() + " de " + (MESES[ALVO.getMonth()] || "") + " de " + ALVO.getFullYear();
  var diaSemana = ALVO.toLocaleDateString("pt-BR", { weekday: "long" });

  /* ---------- contagem ---------- */

  function restante() {
    var ms = ALVO.getTime() - Date.now();
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    return {
      dias: Math.floor(s / 86400),
      horas: Math.floor((s % 86400) / 3600),
      min: Math.floor((s % 3600) / 60),
      seg: s % 60
    };
  }

  function pintaContagem() {
    var r = restante();
    var pares = [
      ["cDias", String(r.dias)],
      ["cHoras", pad(r.horas)],
      ["cMin", pad(r.min)],
      ["cSeg", pad(r.seg)]
    ];
    pares.forEach(function (p) {
      var el = document.getElementById(p[0]);
      if (el) el.textContent = p[1];
    });
  }

  /* ---------- textos ---------- */

  function aplicaConfig() {
    var dataScript = $("#heroDataScript");
    if (dataScript) dataScript.textContent = diaMesAno;

    var diaData = $("#diaData");
    if (diaData) diaData.textContent = diaMesAno + " · " + diaSemana;

    var mapa = {
      horaCerimonia: CFG.cerimonia && CFG.cerimonia.hora,
      localCerimonia: CFG.cerimonia && CFG.cerimonia.local,
      endCerimonia: CFG.cerimonia && CFG.cerimonia.endereco,
      horaRecepcao: CFG.recepcao && CFG.recepcao.hora,
      localRecepcao: CFG.recepcao && CFG.recepcao.local,
      endRecepcao: CFG.recepcao && CFG.recepcao.endereco,
      trajeTxt: CFG.traje
    };
    Object.keys(mapa).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && mapa[id]) el.textContent = mapa[id];
    });

    var mapaBtn = $("#mapaBtn");
    if (mapaBtn) {
      if (CFG.mapaUrl) { mapaBtn.href = CFG.mapaUrl; mapaBtn.hidden = false; }
      else { mapaBtn.hidden = true; }
    }

    if ($("#musicaTitulo")) $("#musicaTitulo").textContent = (CFG.musica && CFG.musica.titulo) || "";
    if ($("#musicaArtista")) $("#musicaArtista").textContent = (CFG.musica && CFG.musica.artista) || "";

    montaContatos();
  }

  function linkWhats() {
    var n = String(CFG.whatsapp || "").replace(/\D/g, "");
    return n.length >= 10 ? "https://wa.me/" + n : "";
  }

  function montaContatos() {
    var w = linkWhats();
    var alvo = $("#botoesContato");
    var pe = $("#rodapeLinks");

    if (alvo) {
      alvo.innerHTML = w
        ? '<a class="botao" href="' + w + '" target="_blank" rel="noopener">Falar no WhatsApp</a>'
        : "";
    }

    if (pe) {
      pe.innerHTML = w
        ? '<a href="' + w + '" target="_blank" rel="noopener">WhatsApp dos noivos</a>'
        : "";
      pe.innerHTML += '<a href="#presentes">Lista de presentes</a>' +
                      '<a href="#confirmacao">Confirmar presença</a>';
    }
  }

  /* ---------- arranque ---------- */

  function inicia() {
    aplicaConfig();
    pintaContagem();
    setInterval(pintaContagem, 1000);
    window.__toast = toast;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicia);
  } else {
    inicia();
  }
})();
