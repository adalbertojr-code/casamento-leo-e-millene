/* ============================================================
   Restante: reveal, menu, confirmação de presença, ligações
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function toast(msg, ms) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("is-on"); }, ms || 3600);
  }
  window.__toast = toast;

  /* ---------------- reveal ---------------- */

  function ligaReveal() {
    var alvos = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      alvos.forEach(function (a) { a.classList.add("is-in"); });
      return;
    }
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          obs.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    alvos.forEach(function (a) { obs.observe(a); });
  }

  /* ---------------- menu mobile ---------------- */

  function ligaMenu() {
    var btn = $("#menuBtn");
    var nav = $("#nav");
    if (!btn || !nav) return;

    function estado(aberto) {
      nav.classList.toggle("is-aberto", aberto);
      btn.setAttribute("aria-expanded", aberto ? "true" : "false");
      btn.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      document.body.style.overflow = aberto ? "hidden" : "";
    }

    btn.addEventListener("click", function () {
      estado(!nav.classList.contains("is-aberto"));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") estado(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-aberto")) estado(false);
    });
  }

  /* ---------------- confirmação de presença ---------------- */

  var CHAVE_RSVP = "casamento-leo-millene:rsvp";

  function salvaLocal(dados) {
    try { localStorage.setItem(CHAVE_RSVP, JSON.stringify(dados)); } catch (e) {}
  }

  function leLocal() {
    try { return JSON.parse(localStorage.getItem(CHAVE_RSVP) || "null"); }
    catch (e) { return null; }
  }

  function ligaForm() {
    var form = $("#formConfirmacao");
    if (!form) return;

    var campos = $("#formCampos");
    var ok = $("#formOk");
    var tituloOk = $("#formOkTitulo");
    var textoOk = $("#formOkTexto");

    var anterior = leLocal();
    if (anterior) {
      preenche(anterior);
      mostraOk(anterior);
    }

    function preenche(d) {
      var nome = $("#nome");
      var tel = $("#telefone");
      var acomp = $("#acompanhantes");
      var recado = $("#recado");
      if (nome) nome.value = d.nome || "";
      if (tel) tel.value = d.telefone || "";
      if (acomp) acomp.value = d.acompanhantes || 0;
      if (recado) recado.value = d.recado || "";
      var radios = $$('input[name="vai"]');
      radios.forEach(function (r) { r.checked = (r.value === (d.vai || "sim")); });
    }

    function mostraOk(d) {
      campos.style.display = "none";
      ok.classList.add("is-on");
      if (d.vai === "nao") {
        tituloOk.textContent = "Que pena, mas obrigado pelo carinho";
        textoOk.textContent = "A gente entende. Se mudar de ideia, é só editar a resposta.";
      } else {
        tituloOk.textContent = "Presença confirmada!";
        textoOk.textContent = "Que alegria ter você com a gente nesse dia.";
      }
    }

    $$('input[name="vai"]').forEach(function (r) {
      r.addEventListener("change", function () {
        var campo = $("#campoAcompanhantes");
        if (campo) campo.style.display = r.value === "nao" && r.checked ? "none" : "";
      });
    });

    $("#btnReenviar").addEventListener("click", function () {
      ok.classList.remove("is-on");
      campos.style.display = "";
      $("#nome").focus();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = ($("#nome").value || "").trim();
      if (nome.length < 3) {
        toast("Escreva seu nome completo, por favor.");
        $("#nome").focus();
        return;
      }

      var dados = {
        nome: nome,
        telefone: ($("#telefone").value || "").trim(),
        vai: (form.querySelector('input[name="vai"]:checked') || {}).value || "sim",
        acompanhantes: dados_num("#acompanhantes"),
        recado: ($("#recado").value || "").trim(),
        quando: new Date().toISOString()
      };

      salvaLocal(dados);
      mostraOk(dados);

      // Se houver integração de envio, ela entra aqui.
      var n = String(CFG.whatsapp || "").replace(/\D/g, "");
      if (n) {
        enviarWhats(n, dados);
      } else {
        toast("Resposta salva neste aparelho. Obrigado!");
      }
    });

    function dados_num(sel) {
      var v = parseInt(($(sel) || {}).value, 10);
      return isNaN(v) || v < 0 ? 0 : v;
    }

    function enviarWhats(numero, d) {
      var linhas = [
        "Confirmacao de presenca - Casamento Leo e Millene",
        "Nome: " + d.nome,
        "Vai: " + (d.vai === "nao" ? "Nao vou poder" : "Sim"),
        "Acompanhantes: " + d.acompanhantes
      ];
      if (d.telefone) linhas.push("WhatsApp: " + d.telefone);
      if (d.recado) linhas.push("Recado: " + d.recado);

      var url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(linhas.join("\n"));
      window.open(url, "_blank", "noopener");
      toast("Abrindo o WhatsApp para enviar sua confirmacao.");
    }
  }

  /* ---------------- arranque ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    ligaReveal();
    ligaMenu();
    ligaForm();
  });
})();
