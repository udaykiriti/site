'use strict';

// ── Skill bars (resume.html) ──
document.querySelectorAll('.skill-bar').forEach(bar => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        bar.style.width = bar.dataset.level + '%';
        io.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  io.observe(bar);
});

// ── Copy email (contact.html) ──
const copyBtn = document.querySelector('.copy-btn');
const toast   = document.getElementById('toast');
if (copyBtn && toast) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(copyBtn.dataset.copy).then(() => {
      toast.textContent = 'copied';
      toast.classList.add('show');
      copyBtn.textContent = 'copied';
      setTimeout(() => {
        toast.classList.remove('show');
        copyBtn.textContent = 'copy';
      }, 2000);
    });
  });
}
