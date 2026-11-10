"use strict";

/* =========================================================
   GUARDIANES DEL AGUA
   Navegación, animaciones y comportamiento interactivo
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navAnchors = document.querySelectorAll(".nav-links a");
  const revealElements = document.querySelectorAll(".reveal");
  const videoButton = document.querySelector("#video-play");
  const video = document.querySelector("#intro-video");
  const gameLink = document.querySelector("#game-link");
  const gameNote = document.querySelector("#game-note");
  const toast = document.querySelector("#toast");
  const currentYear = document.querySelector("#current-year");

  let toastTimer;

  /* -------------------------------------------------------
     Mensajes accesibles
     ------------------------------------------------------- */

  function showToast(message) {
    if (!toast) return;

    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3800);
  }

  /* -------------------------------------------------------
     Año del footer
     ------------------------------------------------------- */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------
     Encabezado al desplazarse
     ------------------------------------------------------- */

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  /* -------------------------------------------------------
     Menú móvil
     ------------------------------------------------------- */

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Abrir menú" : "Cerrar menú"
      );

      navLinks.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navAnchors.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (
        isOpen &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  /* -------------------------------------------------------
     Aparición progresiva de las secciones
     ------------------------------------------------------- */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      const card = element.classList.contains("creator-card") ||
        element.classList.contains("value-card");

      if (card) {
        element.style.transitionDelay = `${(index % 4) * 75}ms`;
      }

      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* -------------------------------------------------------
     Reproductor audiovisual (Dentro del mismo marco)
     ------------------------------------------------------- */

  if (videoButton && video) {
    videoButton.addEventListener("click", async () => {
      const cinemaImage = document.querySelector("#cinema-img");
      const cinemaOverlay = document.querySelector("#cinema-overlay");

      const source = video.querySelector("source");
      const videoPath = source ? source.getAttribute("src") : "";

      if (!videoPath) {
        showToast("El video de presentación todavía no está configurado.");
        return;
      }

      try {
        video.load();

        // Oculta la imagen y el botón de play, y muestra el video en su lugar
        if (cinemaImage) cinemaImage.style.display = "none";
        if (cinemaOverlay) cinemaOverlay.style.display = "none";
        video.style.display = "block";

        await video.play();
      } catch (error) {
        showToast(
          "No se pudo reproducir el video. Comprueba que video-intro.mp4 esté en assets."
        );
      }
    });

    video.addEventListener("error", () => {
      showToast(
        "No se pudo cargar el video. La presentación sigue disponible."
      );
    });
  }

  /* ==========================================
  INTEGRACIÓN DEL JUEGO STORYLINE
  ========================================== */

  const gameInvitation = document.querySelector("#game-invitation");
  const gameExperience = document.querySelector("#game-experience");
  const gameFrame = document.querySelector("#guardianes-game");
  const gameButton = document.querySelector("#game-link");
  const gameBack = document.querySelector("#game-back");
  const fullscreenButton = document.querySelector("#game-fullscreen");
  const gamePlayer = document.querySelector(".game-player");

  const GAME_PATH = "./Juego/index.html";


  if (
    gameInvitation &&
    gameExperience &&
    gameFrame &&
    gameButton
  ) {
  
    let gameLoaded = false;
  
    // Abrir la aventura dentro del mismo llamado final.
    gameButton.addEventListener("click", () => {
  
      gameInvitation.hidden = true;
      gameExperience.hidden = false;
  
      if (!gameLoaded) {
        gameFrame.src = GAME_PATH;
        gameLoaded = true;
      }
  
      gameExperience.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
  
    });
  
    // Volver a la invitación sin eliminar el juego.
    if (gameBack) {
      gameBack.addEventListener("click", () => {
  
        gameExperience.hidden = true;
        gameInvitation.hidden = false;
  
        gameInvitation.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center"
        });
  
      });
    }
  
    // Pantalla completa.
    if (fullscreenButton && gamePlayer) {
  
      fullscreenButton.addEventListener("click", async () => {
  
        try {
  
          if (!document.fullscreenElement) {
            await gamePlayer.requestFullscreen();
          } else {
            await document.exitFullscreen();
          }
  
        } catch (error) {
          console.error("Error de pantalla completa:", error);
          showToast("No se pudo activar la pantalla completa.");
        }
  
      });
  
      document.addEventListener("fullscreenchange", () => {
  
        fullscreenButton.textContent =
          document.fullscreenElement === gamePlayer
            ? "✕ Salir de pantalla completa"
            : "⛶ Pantalla completa";
  
      });
  
    }
  
  }

  /* -------------------------------------------------------
     Comprobación visual de imágenes locales
     ------------------------------------------------------- */

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      console.warn(
        `No se pudo cargar la imagen local: ${image.getAttribute("src")}`
      );
      image.classList.add("asset-missing");
    });
  });

  document.documentElement.classList.add("js-ready");

  console.info("Guardianes del Agua: interfaz inicializada.");
});