/* =========================================================
   BRIANA LUISA · INVITACIÓN DIGITAL PREMIUM
   script.js — comentado por secciones
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1) LOADER — se oculta cuando la página termina de cargar
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      launchConfetti();               // confeti de bienvenida
      startBearLoop();                // arrancan los peluches
      tryAutoplayThenFallback();      // intenta reproducir música de una vez
    }, 900);
  });
  // Fallback por si 'load' tarda demasiado
  setTimeout(() => loader.classList.add('hidden'), 3500);


  /* ---------------------------------------------------------
     2) CURSOR PERSONALIZADO
  --------------------------------------------------------- */
  const cursorDot  = document.getElementById('custom-cursor');
  const cursorRing = document.getElementById('custom-cursor-ring');
  let ringX = 0, ringY = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top  = e.clientY + 'px';
      ringX = e.clientX; ringY = e.clientY;
    });
    const animateRing = () => {
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .gallery-item, .detail-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('grow');
        cursorRing.classList.add('grow');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('grow');
        cursorRing.classList.remove('grow');
      });
    });
  }


  /* ---------------------------------------------------------
     3) SCROLL REVEAL — IntersectionObserver
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? entry.target.dataset.delay * 110 : 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));


  /* ---------------------------------------------------------
     4) CONTADOR REGRESIVO REAL
     Fecha del evento: 18 de julio (5:00 PM), año actual o siguiente
     si la fecha ya pasó.
  --------------------------------------------------------- */
  function getEventDate() {
    const now = new Date();
    let year = now.getFullYear();
    let target = new Date(year, 6, 18, 17, 0, 0); // mes 6 = julio (0-index)
    if (target.getTime() < now.getTime()) {
      target = new Date(year + 1, 6, 18, 17, 0, 0);
    }
    return target;
  }

  const eventDate = getEventDate();
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');
  const countdownBox = document.getElementById('countdown-timer');
  const todayMsg = document.getElementById('today-message');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();

    if (diff <= 0) {
      countdownBox.hidden = true;
      todayMsg.hidden = false;
      clearInterval(countdownInterval);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    elDays.textContent = pad(d);
    elHours.textContent = pad(h);
    elMinutes.textContent = pad(m);
    elSeconds.textContent = pad(s);
  }

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);


  /* ---------------------------------------------------------
     5) FONDO — PARTÍCULAS BRILLANTES en <canvas> con
     requestAnimationFrame + elementos flotantes (corazones,
     estrellas, mariposas, flores) como capa CSS.
  --------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.6,
        speedY: Math.random() * 0.25 + 0.05,
        speedX: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  createParticles(window.innerWidth < 700 ? 40 : 80);

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.pulse += 0.02;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 161, 90, ${a})`;
      ctx.fill();

      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(drawParticles);
  }
  requestAnimationFrame(drawParticles);

  // Capa flotante: corazones / estrellas / mariposas / flores cayendo
  const floatingLayer = document.getElementById('floating-layer');
  const floatEmojis = {
    heart: ['💗', '💕'],
    star: ['✦', '⭐'],
    butterfly: ['🦋'],
    flower: ['🌸', '🌼']
  };

  function spawnFloatItem() {
    const types = ['heart', 'star', 'butterfly', 'flower'];
    const type = types[Math.floor(Math.random() * types.length)];
    const emoji = floatEmojis[type][Math.floor(Math.random() * floatEmojis[type].length)];

    const el = document.createElement('span');
    el.className = 'float-item';
    el.textContent = emoji;

    const size = Math.random() * 14 + 14;
    el.style.fontSize = size + 'px';
    el.style.left = Math.random() * 100 + 'vw';

    const duration = Math.random() * 8 + 10;
    const drift = (Math.random() - 0.5) * 120;
    const rot = (Math.random() - 0.5) * 180;
    el.style.setProperty('--drift', drift + 'px');
    el.style.setProperty('--rot', rot + 'deg');
    el.style.animationDuration = duration + 's';

    // flores caen, el resto sube flotando
    if (type === 'flower') {
      el.style.top = '-5vh';
      el.style.animationName = 'drift-down';
    } else {
      el.style.top = '100vh';
      el.style.animationName = 'drift-up';
    }

    floatingLayer.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 500);
  }

  // Aparición aleatoria, sin saturar
  function floatLoop() {
    spawnFloatItem();
    const next = Math.random() * 1400 + 700;
    setTimeout(floatLoop, next);
  }
  floatLoop();


  /* ---------------------------------------------------------
     6) PELUCHES ANIMADOS — dos personajes caminan por la
     parte inferior. El OSITO invita a la fiesta y señala el
     botón de confirmar asistencia. La CONEJITA anima a
     seguir bajando para descubrir más.
     Función genérica reutilizada por ambos personajes.
  --------------------------------------------------------- */
  function createCharacterRoutine(stageId, {
    exitPosition,
    walkDuration = 7,
    firstBubbleDelay = 1900,
    firstBubbleText,
    secondBubbleDelay = 2700,
    secondBubbleText,
    pauseBeforeExit = 5600,
    exitDuration = 3.5,
    loopMin = 10000,
    loopVariance = 6000,
    startDelay = 2200
  }) {
    const stage = document.getElementById(stageId);
    const bubble = stage.querySelector('[id$="-bubble"]');

    function setBubble(text) { if (text) bubble.textContent = text; }

    function walkAcross(onDone) {
      stage.classList.remove('point', 'wave', 'bounce', 'jump', 'show-bubble');
      stage.style.left = '-120px';
      stage.style.transition = 'none';
      requestAnimationFrame(() => {
        stage.style.transition = `left ${walkDuration}s linear`;
        stage.classList.add('walking');
        void stage.offsetWidth;
        stage.style.left = exitPosition;
      });
      setTimeout(() => {
        stage.classList.remove('walking');
        onDone && onDone();
      }, walkDuration * 1000 + 100);
    }

    function wave(duration = 1800) {
      stage.classList.add('wave');
      setTimeout(() => stage.classList.remove('wave'), duration);
    }

    function jump() {
      stage.classList.add('jump');
      setTimeout(() => stage.classList.remove('jump'), 650);
    }

    function showBubble(text, duration = 2600) {
      setBubble(text);
      stage.classList.add('point', 'show-bubble');
      setTimeout(() => stage.classList.remove('point', 'show-bubble'), duration);
    }

    function routine() {
      walkAcross(() => {
        wave();
        setTimeout(jump, firstBubbleDelay - 800 > 0 ? firstBubbleDelay - 800 : 900);
        setTimeout(() => showBubble(secondBubbleText || firstBubbleText), secondBubbleDelay);
        setTimeout(() => {
          stage.style.transition = `left ${exitDuration}s linear`;
          stage.classList.add('walking');
          stage.style.left = 'calc(100vw + 20px)';
        }, pauseBeforeExit);
        setTimeout(routine, pauseBeforeExit + exitDuration * 1000 + loopMin + Math.random() * loopVariance);
      });
    }

    return { start: () => setTimeout(routine, startDelay) };
  }

  const bearCharacter = createCharacterRoutine('bear-stage', {
    exitPosition: '62vw',
    firstBubbleText: '¡Ven a celebrar conmigo! 🎉',
    secondBubbleText: '¡Confirma tu asistencia! 👉',
    startDelay: 2200
  });

  const bunnyCharacter = createCharacterRoutine('bunny-stage', {
    exitPosition: '30vw',
    walkDuration: 6.4,
    firstBubbleText: '¡Sigue bajando! 👇',
    secondBubbleText: '¡Hay más sorpresas abajo! 👇',
    pauseBeforeExit: 5200,
    exitDuration: 3.2,
    startDelay: 3600
  });

  function startBearLoop() {
    bearCharacter.start();
    bunnyCharacter.start();
  }


  /* ---------------------------------------------------------
     7) MÚSICA — se reproduce automáticamente apenas alguien
     entra. Los navegadores bloquean el autoplay con sonido
     sin interacción previa, así que intentamos de una vez y,
     si es bloqueado, arrancamos en el primer toque/clic que
     la persona haga en cualquier parte de la página.
  --------------------------------------------------------- */
  const bgMusic = document.getElementById('bg-music');
  if (bgMusic) {
    bgMusic.volume = 0.45;
    bgMusic.preload = 'auto';
    bgMusic.autoplay = true;
    bgMusic.muted = true;
  }

  function playMusic() {
    if (!bgMusic) return Promise.resolve();
    const promise = bgMusic.play();
    if (promise && typeof promise.then === 'function') {
      return promise.then(() => {
        bgMusic.muted = false;
      }).catch(() => {
        setTimeout(() => {
          bgMusic.muted = false;
          bgMusic.play().catch(() => {});
        }, 300);
      });
    }
    return Promise.resolve();
  }

  function tryAutoplayThenFallback() {
    playMusic();
    setTimeout(() => {
      if (!bgMusic.paused) {
        bgMusic.muted = false;
      } else {
        playMusic();
      }
    }, 800);
    window.addEventListener('pointerdown', () => {
      bgMusic.muted = false;
      playMusic();
    }, { once: true });
    window.addEventListener('keydown', () => {
      bgMusic.muted = false;
      playMusic();
    }, { once: true });
    window.addEventListener('focus', () => {
      bgMusic.muted = false;
      playMusic();
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        bgMusic.muted = false;
        playMusic();
      }
    });
  }


  /* ---------------------------------------------------------
     8) CONFETI DE ENTRADA
  --------------------------------------------------------- */
  function launchConfetti() {
    const layer = document.getElementById('confetti-layer');
    const colors = ['#C9A15A', '#F7D9DE', '#E9D3A3', '#FFFFFF', '#EAC79A'];
    const total = window.innerWidth < 700 ? 45 : 80;

    for (let i = 0; i < total; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = Math.random() * 8 + 5;
      piece.style.width = size + 'px';
      piece.style.height = size * 0.4 + 'px';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (Math.random() * 2.5 + 2.5) + 's';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      layer.appendChild(piece);
      setTimeout(() => piece.remove(), 5500);
    }
  }


  /* ---------------------------------------------------------
     9) GALERÍA — LIGHTBOX
  --------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightboxContent.innerHTML = item.innerHTML;
      lightbox.classList.add('open');
    });
  });

  function closeLightbox() { lightbox.classList.remove('open'); }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });


  /* ---------------------------------------------------------
     10) PARALLAX SUAVE EN EL HERO
  --------------------------------------------------------- */
  const heroGlow = document.querySelector('.hero-glow');
  const medallion = document.querySelector('.medallion');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroGlow) heroGlow.style.transform = `translateX(-50%) translateY(${y * 0.15}px)`;
    if (medallion) medallion.style.setProperty('--parallax', `${y * 0.08}px`);
  }, { passive: true });

});
