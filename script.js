/* ══════════════════════════════════════════════════
   DONNÉES — modifie les chemins et textes ici
══════════════════════════════════════════════════ */
const slides = [
  {
    image: "images/image1.jpg",
    text: "Il y a des gens qui arrivent dans ta vie et qui la changent pour toujours. Toi, tu en fais partie."
  },
  {
    image: "images/image2.jpg",
    text: "Ce sourire-là… impossible de l'oublier. Même quand tu fais semblant de ne pas être fier(e) de toi. 😄"
  },
  {
    image: "images/image3.jpg",
    text: "Les années passent, tu restes toi. Et honnêtement ? C'est la meilleure version."
  },
  {
    image: "images/image4.jpg",
    text: "On a ri, on a galéré, on a recommencé. Et à chaque fois, c'était mieux avec toi à côté."
  },
  {
    image: "images/image5.jpg",
    text: "Tu avais l'air de rien ce jour-là. Mais tu étais déjà inoubliable. 🌟"
  },
  {
    image: "images/image6.jpg",
    text: "Merci d'être exactement comme tu es : un peu fou/folle, très sincère, et toujours là quand ça compte."
  },
  {
    image: "images/image7.jpg",
    text: "Les souvenirs, ça ne prend pas de place dans les bagages. Heureusement, parce qu'on en a beaucoup. ❤️"
  },
  {
    image: "images/image8.jpg",
    text: "Un an de plus, c'est juste un an de mieux. On le sait tous les deux. (ou trois. ou quatre.)"
  },
  {
    image: "images/image9.jpg",
    text: "Aujourd'hui c'est ton jour. Mange du gâteau, oublie le reste, et sache qu'on t'aime beaucoup. 🎂"
  }
];

/* ══════════════════════════════════════════════════
   ÉTAT
══════════════════════════════════════════════════ */
let currentIndex = 0;
let isAnimating  = false;
let musicEnabled = false;

/* ══════════════════════════════════════════════════
   ÉLÉMENTS DOM
══════════════════════════════════════════════════ */
const slideBg        = document.getElementById('slide-bg');
const slideBgNext    = document.getElementById('slide-bg-next');
const slideText      = document.getElementById('slide-text');
const progressBar    = document.getElementById('progress-bar');
const progressCount  = document.getElementById('progress-counter');
const endScreen      = document.getElementById('end-screen');
const music          = document.getElementById('bg-music');
const btnMusic       = document.getElementById('btn-music');

/* ══════════════════════════════════════════════════
   LANCEMENT
══════════════════════════════════════════════════ */
function startSlideshow() {
  // Masquer intro, afficher slideshow
  document.getElementById('intro-screen').style.animation = 'none';
  document.getElementById('intro-screen').style.opacity   = '0';
  document.getElementById('intro-screen').style.transition = 'opacity 0.7s ease';

  setTimeout(() => {
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('slideshow').classList.remove('hidden');
    loadSlide(0, true);
  }, 700);
}

/* ══════════════════════════════════════════════════
   CHARGEMENT D'UN SLIDE
══════════════════════════════════════════════════ */
function loadSlide(index, initial = false) {
  const slide = slides[index];
  if (!slide) return;

  if (initial) {
    // Première image directement
    slideBg.style.backgroundImage = `url('${slide.image}')`;
    slideBg.style.opacity = '1';
    showText(slide.text);
    updateProgress();
    return;
  }

  // Animation cross-fade
  isAnimating = true;
  hideText();

  // Préparer la prochaine image derrière
  slideBgNext.style.backgroundImage = `url('${slide.image}')`;
  slideBgNext.style.opacity = '0';

  // Forcer reflow puis lancer le fondu
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      slideBgNext.style.transition = `opacity ${getComputedStyle(document.documentElement).getPropertyValue('--transition')}`;
      slideBgNext.style.opacity = '1';

      setTimeout(() => {
        // Permuter : next devient current
        slideBg.style.backgroundImage = slideBgNext.style.backgroundImage;
        slideBg.style.opacity = '1';
        slideBgNext.style.opacity = '0';
        slideBgNext.style.transition = 'none';

        showText(slide.text);
        updateProgress();
        isAnimating = false;
      }, 920);
    });
  });
}

/* ══════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════ */
function nextSlide() {
  if (isAnimating) return;

  currentIndex++;

  if (currentIndex >= slides.length) {
    // Fin du diaporama
    showEndScreen();
    return;
  }

  loadSlide(currentIndex);
}

function prevSlide() {
  if (isAnimating || currentIndex <= 0) return;
  currentIndex--;
  loadSlide(currentIndex);
}

/* ══════════════════════════════════════════════════
   TEXTE (apparition / disparition)
══════════════════════════════════════════════════ */
function showText(text) {
  slideText.classList.remove('visible');
  slideText.textContent = text;
  // Déclenche l'animation CSS (définie via .visible dans style.css)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => slideText.classList.add('visible'));
  });
}

function hideText() {
  slideText.classList.remove('visible');
}

/* ══════════════════════════════════════════════════
   BARRE DE PROGRESSION
══════════════════════════════════════════════════ */
function updateProgress() {
  const total   = slides.length;
  const current = currentIndex + 1;
  const pct     = (current / total) * 100;

  progressBar.style.width  = pct + '%';
  progressCount.textContent = `${current} / ${total}`;
}

/* ══════════════════════════════════════════════════
   ÉCRAN DE FIN
══════════════════════════════════════════════════ */
function showEndScreen() {
  endScreen.classList.remove('hidden');
}

function restartSlideshow() {
  endScreen.classList.add('hidden');
  currentIndex = 0;
  loadSlide(0, true);
}

/* ══════════════════════════════════════════════════
   MUSIQUE
══════════════════════════════════════════════════ */
function toggleMusic() {
  musicEnabled = !musicEnabled;

  if (musicEnabled) {
    music.volume = 0.4;
    music.play().catch(() => {
      // Navigateurs bloquent parfois l'autoplay
      console.log('Lecture audio bloquée par le navigateur.');
      musicEnabled = false;
      btnMusic.classList.remove('playing');
    });
    btnMusic.classList.add('playing');
    btnMusic.title = 'Couper la musique';
  } else {
    music.pause();
    btnMusic.classList.remove('playing');
    btnMusic.title = 'Activer la musique';
  }
}

/* ══════════════════════════════════════════════════
   NAVIGATION CLAVIER
══════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (document.getElementById('slideshow').classList.contains('hidden')) return;
  if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

/* ══════════════════════════════════════════════════
   CONFETTIS (intro)
══════════════════════════════════════════════════ */
(function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#f0c060', '#ff6b6b', '#4ecdc4', '#ffe29a', '#c084fc', '#fff'];
  const count  = 55;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left   = Math.random() * 100 + '%';
    el.style.top    = '-10px';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width  = (6 + Math.random() * 7) + 'px';
    el.style.height = (6 + Math.random() * 7) + 'px';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    const duration = 2.5 + Math.random() * 3;
    const delay    = Math.random() * 2;
    el.style.animation = `confettiFall ${duration}s ${delay}s linear forwards`;
    container.appendChild(el);
  }
})();
