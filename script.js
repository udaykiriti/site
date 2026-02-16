(function () {
  const roles = [
    'software developer',
    'systems programmer',
    'web developer',
    'rust enthusiast'
  ];

  const subtitle = document.getElementById('subtitle');
  const typingText = subtitle?.querySelector('.typing-text');
  if (!subtitle || !typingText) return;

  subtitle.style.opacity = '1';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typingText.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function loop() {
    const role = roles[roleIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typingText.textContent = role.slice(0, Math.max(0, charIndex));

    let delay = deleting ? 45 : 80;

    if (!deleting && charIndex >= role.length) {
      deleting = true;
      delay = 1100;
    } else if (deleting && charIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 250;
    }

    window.setTimeout(loop, delay);
  }

  window.setTimeout(loop, 600);
})();

(function () {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme === 'rust' ? 'rust' : 'light';

  function applyTheme(nextTheme) {
    html.setAttribute('data-theme', nextTheme);
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', nextTheme === 'rust' ? '#181410' : '#fff4e8');
    }
  }

  applyTheme(theme);

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const nextTheme = currentTheme === 'rust' ? 'light' : 'rust';
    applyTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    showToast(`theme: ${nextTheme}`);
  });
})();

(function () {
  const bar = document.querySelector('.progress-bar-fill');
  if (!bar) return;

  let ticking = false;

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = `${percent}%`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
})();

(function () {
  const button = document.getElementById('backToTop');
  if (!button) return;

  function toggle() {
    if (window.scrollY > 260) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  }

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

function showToast(message, duration = 1800) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  window.setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

(function () {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((button) => {
    const label = button.querySelector('.copy-text');

    button.addEventListener('click', async () => {
      const text = button.dataset.copy;
      if (!text) return;

      let copied = false;

      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
          copied = document.execCommand('copy');
        } finally {
          document.body.removeChild(textarea);
        }
      }

      if (!copied) {
        showToast('copy failed');
        return;
      }

      button.classList.add('copied');
      if (label) label.textContent = 'copied';
      showToast('email copied');

      window.setTimeout(() => {
        button.classList.remove('copied');
        if (label) label.textContent = 'copy';
      }, 1400);
    });
  });
})();

(function () {
  const section = document.querySelector('#resume .skills-visual');
  if (!section) return;

  const bars = section.querySelectorAll('.skill-bar');

  function fillBars() {
    bars.forEach((bar) => {
      const level = Number(bar.dataset.level || 0);
      bar.style.width = `${Math.min(100, Math.max(0, level))}%`;
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fillBars();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      fillBars();
      observer.disconnect();
    });
  }, { threshold: 0.35 });

  observer.observe(section);
})();

(function () {
  document.body.addEventListener('mousedown', () => {
    document.body.classList.add('using-mouse');
  });

  document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.remove('using-mouse');
    }
  });
})();

(function () {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

(function () {
  const sectionIds = ['about', 'projects', 'resume', 'contact'];
  const links = sectionIds
    .map((id) => document.querySelector(`nav a[href="#${id}"]`))
    .filter(Boolean);
  if (!links.length) return;

  const sectionMap = new Map();
  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionMap.set(section, id);
  });
  if (!sectionMap.size) return;

  function setActive(id) {
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = sectionMap.get(entry.target);
      if (id) setActive(id);
    });
  }, { threshold: 0.35, rootMargin: '-20% 0px -50% 0px' });

  sectionMap.forEach((_, section) => observer.observe(section));
  setActive('about');
})();

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const revealItems = document.querySelectorAll('.box, .featured-project');
  if (!revealItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealItems.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();
