/* ============================================================
   Musica de fundo
   O navegador bloqueia som comeco sem interacao (politica de
   autoplay). Estrategia:
   1. comecar tocando em MUDO, que o navegador permite;
   2. ao primeiro gesto real (toque, clique, tecla), tirar o mudo.
      Rolagem nem sempre conta, por isso nao esta na lista;
   3. se mesmo assim nao der, tocar quando a aba volta a ficar ativa.
   O visitante nunca precisa apertar "play": o som simplesmente
   comeca no primeiro toque na tela.
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };

  var audio, btnSom, aviso, avisoFechado = false, pronto = false;
  /* diferencia "o navegador bloqueou" de "a pessoa pausou de proposito" */
  var pausadoPeloUsuario = false;
  var destravado = false;

  /* so gestos que o navegador aceita como "o usuario interagiu".
     scroll e wheel ficam de fora de proposito: nao liberam audio
     em varios navegadores e davam a impressao de que nada acontecia. */
  var GESTOS = ["pointerdown", "touchstart", "keydown", "click"];

  function mostraAviso() {
    if (!btnSom || !aviso) return;
    btnSom.classList.add("is-on");
    if (avisoFechado) return;
    aviso.classList.add("is-on");
    clearTimeout(mostraAviso._t);
    mostraAviso._t = setTimeout(function () {
      aviso.classList.remove("is-on");
    }, 12000);
  }

  /* tenta tocar; resolve true so quando o som realmente comecou */
  function toca() {
    if (!audio) return Promise.resolve(false);
    var p = audio.play();
    if (!p || !p.then) {
      pronto = true;
      mostraAviso();
      return Promise.resolve(true);
    }
    return p.then(function () {
      pronto = true;
      mostraAviso();
      return true;
    }).catch(function () {
      return false;
    });
  }

  var desligaGestos = function () {};

  /* comeca mudo; o navegador sempre permite. O som entra no
     primeiro gesto, sem o visitante precisar apertar nada. */
  function tocaMudo() {
    if (!audio || pausadoPeloUsuario) return;
    audio.muted = true;
    audio.play().then(function () {
      pronto = true;
    }).catch(function () {});
  }

  function liberaSom() {
    if (!audio || destravado || pausadoPeloUsuario) return;
    destravado = true;
    audio.muted = false;
    toca().then(function (ok) {
      if (ok) {
        mostraAviso();
        desligaGestos();
      } else {
        /* o navegador recusou mesmo com gesto: volta ao mudo para
           nao parecer travado, e tenta de novo na proxima interacao */
        destravado = false;
        tocaMudo();
      }
    });
  }

  function esperaGesto() {
    function aoGesto() {
      liberaSom();
    }

    desligaGestos = function () {
      GESTOS.forEach(function (e) {
        document.removeEventListener(e, aoGesto, true);
      });
    };

    GESTOS.forEach(function (e) {
      document.addEventListener(e, aoGesto, true);
    });
  }

  function inicia() {
    audio = $("#audio");
    btnSom = $("#btnSom");
    aviso = $("#avisoMusica");
    if (!audio || !btnSom) return;

    var fonte = (CFG.musica && CFG.musica.arquivo) || "";
    if (fonte) {
      audio.src = fonte;
      audio.volume = 0.5;
    }

    audio.addEventListener("play", function () {
      btnSom.classList.remove("is-mudo");
      btnSom.setAttribute("aria-label", "Pausar musica");
      btnSom.setAttribute("aria-pressed", "true");
      /* enquanto estiver mudo nao anunciamos musica tocando */
      if (!audio.muted) mostraAviso();
    });

    audio.addEventListener("pause", function () {
      btnSom.classList.add("is-mudo");
      btnSom.setAttribute("aria-label", "Tocar musica");
      btnSom.setAttribute("aria-pressed", "false");
    });

    audio.addEventListener("playing", function () {
      pronto = true;
    });

    audio.addEventListener("error", function () {
      if (audio.networkState === 3) {
        pronto = false;
        btnSom.classList.remove("is-on");
        aviso.classList.remove("is-on");
        desligaGestos();
        if (window.__toast) window.__toast("Nao foi possivel carregar a musica.");
      }
    });

    var fechar = $("#fecharAviso");
    if (fechar) {
      fechar.addEventListener("click", function () {
        aviso.classList.remove("is-on");
        avisoFechado = true;
      });
    }

    /* o botao sempre tenta tocar: antes ele desistia quando o arquivo
       ainda nao tinha carregado, e a musica ficava muda para sempre */
    btnSom.addEventListener("click", function () {
      if (!audio.paused && !audio.muted) {
        pausadoPeloUsuario = true;
        audio.pause();
        return;
      }
      pausadoPeloUsuario = false;
      destravado = false;
      liberaSom();
    });

    if (!fonte) return;

    /* 1) comeca mudo assim que a pagina abre (o navegador permite) */
    tocaMudo();

    /* 2) o primeiro toque do visitante liga o som */
    esperaGesto();

    /* 3) rede de seguranca: se a aba voltar a ficar ativa e o som
       ainda estiver mudo, tenta liberar de novo */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden || pausadoPeloUsuario) return;
      if (!destravado && !audio.paused) liberaSom();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicia);
  } else {
    inicia();
  }
})();
