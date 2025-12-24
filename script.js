// Typing animation for header
(function () {
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    let i = 0;
    const typeSpeed = 50;

    function type() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, typeSpeed);
        }
    }

    // Start typing after a brief delay
    setTimeout(type, 300);
})();

// Random glitch effect for marquee
(function () {
    const marquee = document.querySelector('.marquee-inner');
    if (!marquee) return;

    function glitch() {
        marquee.classList.add('glitch');
        setTimeout(() => {
            marquee.classList.remove('glitch');
        }, 100);
    }

    // Random glitch every 5-10 seconds
    setInterval(() => {
        if (Math.random() > 0.5) {
            glitch();
        }
    }, 7000);
})();

// Scroll progress bar
(function () {
    const progressBar = document.querySelector('.progress-bar-fill');
    if (!progressBar) return;

    function updateProgressBar() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar(); // Initial update
})();
