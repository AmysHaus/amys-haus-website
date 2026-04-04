/* ============================================
   AMY'S HAUS — Main JavaScript
   ============================================ */

// --- Nav scroll behaviour ---
const nav = document.getElementById('nav');

if (nav) {
  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init on load
}

// --- Reveal on scroll ---
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// --- Mobile menu ---
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav__links');
const navCta    = document.querySelector('.nav__cta');

if (hamburger) {
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;

    if (menuOpen) {
      // Build mobile overlay
      const overlay = document.createElement('div');
      overlay.id = 'mobile-menu';
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: var(--chocolate);
        z-index: 99;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;

      const links = [
        { href: '/pages/about.html', text: 'About' },
        { href: '/pages/work-with-me.html', text: 'Work With Me' },
        { href: '/pages/journal.html', text: 'The Journal' },
        { href: '/pages/contact.html', text: 'Contact' },
      ];

      links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        a.style.cssText = `
          font-family: var(--font-serif);
          font-weight: 300;
          font-style: italic;
          font-size: clamp(2rem, 6vw, 3rem);
          color: var(--white);
          text-decoration: none;
        `;
        overlay.appendChild(a);
      });

      const ctaLink = document.createElement('a');
      ctaLink.href = '/pages/contact.html#book';
      ctaLink.textContent = 'Book a Discovery Call';
      ctaLink.style.cssText = `
        margin-top: 1rem;
        font-family: var(--font-sans);
        font-weight: 500;
        font-size: 0.8rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--white);
        border: 1.5px solid rgba(255,255,255,0.4);
        padding: 0.9rem 2rem;
        border-radius: 100px;
        text-decoration: none;
      `;
      overlay.appendChild(ctaLink);

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 1.75rem;
        right: var(--gutter, 2rem);
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        line-height: 1;
      `;
      closeBtn.addEventListener('click', closeMenu);
      overlay.appendChild(closeBtn);

      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => { overlay.style.opacity = '1'; });

    } else {
      closeMenu();
    }
  });

  function closeMenu() {
    menuOpen = false;
    const overlay = document.getElementById('mobile-menu');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
    document.body.style.overflow = '';
  }
}

// --- Smooth anchor scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
