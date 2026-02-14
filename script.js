// Typing carousel effect for subtitle
(function () {
    const subtitle = document.getElementById('subtitle');
    const typingText = subtitle?.querySelector('.typing-text');
    if (!typingText) return;

    const roles = [
        'software developer',
        'systems programmer',
        'web developer',
        'problem solver',
        'c++ enthusiast'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    subtitle.style.opacity = '1';

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isPaused) {
            setTimeout(type, 2000);
            isPaused = false;
            return;
        }

        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2000;
            isPaused = true;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 1200);
})();

// Particle burst on click
(function () {
    const getColors = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' 
            ? ['#555555', '#888888'] 
            : ['var(--accent)', 'var(--text-muted)'];
    };
    
    document.addEventListener('click', (e) => {
        // Don't create particles on button/link clicks
        if (e.target.closest('button, a')) return;
        
        const particleCount = 6;
        const colors = getColors();
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 30 + Math.random() * 20;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.cssText = `
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                --tx: ${tx}px;
                --ty: ${ty}px;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 600);
        }
    });
})();

// Smooth card hover effect
(function () {
    const cards = document.querySelectorAll('.box');
    
    cards.forEach(card => {
        // Add subtle gradient shift on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
})();

// Konami code easter egg
(function () {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const overlay = document.getElementById('konamiOverlay');
    const closeBtn = document.getElementById('konamiClose');
    
    if (!overlay || !closeBtn) return;
    
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                overlay.classList.add('active');
                showToast('konami code unlocked!');
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
})();

// Animated skill bars
(function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-bar');
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        const level = bar.dataset.level;
                        bar.style.width = level + '%';
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const skillsSection = document.querySelector('.skills-visual');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
})();

// Command Palette
(function () {
    const overlay = document.getElementById('commandPalette');
    const input = document.getElementById('commandInput');
    const results = document.getElementById('commandResults');
    
    if (!overlay || !input || !results) return;

    const commands = [
        { title: 'About', icon: '>', action: () => scrollToSection('#about') },
        { title: 'Projects', icon: '>', action: () => scrollToSection('#projects') },
        { title: 'Resume', icon: '>', action: () => scrollToSection('#resume') },
        { title: 'Contact', icon: '>', action: () => scrollToSection('#contact') },
        { title: 'Toggle Theme', icon: '*', key: 'T', action: () => document.getElementById('themeToggle')?.click() },
        { title: 'Scroll to Top', icon: '^', key: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { title: 'GitHub Profile', icon: '#', action: () => window.open('https://github.com/udaykiriti', '_blank') },
        { title: 'LeetCode Profile', icon: '#', action: () => window.open('https://leetcode.com/u/Uday9__/', '_blank') },
        { title: 'Copy Email', icon: '@', action: () => {
            navigator.clipboard.writeText('udaykiriti624@gmail.com');
            showToast('email copied');
            closeCommandPalette();
        }}
    ];

    let selectedIndex = 0;

    function scrollToSection(id) {
        closeCommandPalette();
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function openCommandPalette() {
        overlay.classList.add('active');
        input.value = '';
        input.focus();
        renderCommands(commands);
    }

    function closeCommandPalette() {
        overlay.classList.remove('active');
        selectedIndex = 0;
    }

    function renderCommands(items) {
        selectedIndex = 0;
        results.innerHTML = items.map((cmd, idx) => `
            <div class="command-palette-item ${idx === 0 ? 'selected' : ''}" data-index="${idx}">
                <span class="command-palette-item-icon">${cmd.icon}</span>
                <span class="command-palette-item-title">${cmd.title}</span>
                ${cmd.key ? `<span class="command-palette-item-key">${cmd.key}</span>` : ''}
            </div>
        `).join('');

        // Add click handlers
        results.querySelectorAll('.command-palette-item').forEach((el, idx) => {
            el.addEventListener('click', () => executeCommand(items[idx]));
            el.addEventListener('mouseenter', () => {
                selectedIndex = idx;
                updateSelection(items);
            });
        });
    }

    function updateSelection(items) {
        results.querySelectorAll('.command-palette-item').forEach((el, idx) => {
            el.classList.toggle('selected', idx === selectedIndex);
        });
    }

    function executeCommand(cmd) {
        if (cmd.action) cmd.action();
        closeCommandPalette();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Open with Ctrl+K or Cmd+K or /
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openCommandPalette();
        } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            e.preventDefault();
            openCommandPalette();
        }
        
        // Close with Escape
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeCommandPalette();
        }
    });

    // Input handling
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = commands.filter(cmd => 
            cmd.title.toLowerCase().includes(query)
        );
        renderCommands(filtered);
    });

    // Arrow key navigation
    input.addEventListener('keydown', (e) => {
        const items = results.querySelectorAll('.command-palette-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection(commands);
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection(commands);
            items[selectedIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const query = input.value.toLowerCase();
            const filtered = commands.filter(cmd => 
                cmd.title.toLowerCase().includes(query)
            );
            if (filtered[selectedIndex]) {
                executeCommand(filtered[selectedIndex]);
            }
        }
    });

    // Close when clicking overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeCommandPalette();
    });
})();

// Theme toggle
(function () {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Get saved theme or default to rust
    const savedTheme = localStorage.getItem('theme') || 'rust';
    html.setAttribute('data-theme', savedTheme);
    
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'rust' ? 'light' : 'rust';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Show toast notification
        showToast(`switched to ${newTheme} mode`);
        
        // Add pulse effect
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
    });
})();

// Typing animation
(function () {
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        subtitle.style.opacity = '1';
        return;
    }

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    let i = 0;
    function type() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 60);
        }
    }
    setTimeout(type, 1200);
})();

// Progress bar
(function () {
    const bar = document.querySelector('.progress-bar-fill');
    if (!bar) return;

    let ticking = false;
    function update() {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = h > 0 ? (window.scrollY / h) * 100 : 0;
        bar.style.width = p + '%';
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
    update();
})();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Back to top button
(function () {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    function toggleVisibility() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// Toast notification
function showToast(message, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Copy to clipboard
(function () {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        const textSpan = btn.querySelector('.copy-text');
        const originalText = textSpan ? textSpan.textContent : 'copy';
        
        btn.addEventListener('click', async () => {
            const textToCopy = btn.dataset.copy;

            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast('copied to clipboard');
                
                // Visual feedback
                btn.classList.add('copied');
                if (textSpan) textSpan.textContent = 'copied!';
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    if (textSpan) textSpan.textContent = originalText;
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showToast('copied to clipboard');
                    
                    btn.classList.add('copied');
                    if (textSpan) textSpan.textContent = 'copied!';
                    
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        if (textSpan) textSpan.textContent = originalText;
                    }, 2000);
                } catch (e) {
                    showToast('failed to copy');
                }
                document.body.removeChild(textarea);
            }
        });
    });
})();

// Keyboard navigation
(function () {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (e.key === 'Home' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (e.key === 'End' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
})();

// Focus management
(function () {
    document.body.addEventListener('mousedown', () => {
        document.body.classList.add('using-mouse');
    });

    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });
})();

// Scroll reveal animation
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 50);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add reveal class to sections
    document.querySelectorAll('.box').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Stagger project items
    document.querySelectorAll('.project-list li').forEach((el, idx) => {
        el.classList.add('stagger-item');
        el.style.transitionDelay = `${idx * 0.05}s`;
        observer.observe(el);
    });
})();

// Smooth parallax effect for header
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const header = document.querySelector('header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrolled < 300) {
                    header.style.transform = `translateY(${scrolled * 0.15}px)`;
                    header.style.opacity = 1 - (scrolled / 400);
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// Add ripple effect to buttons
(function () {
    const buttons = document.querySelectorAll('.copy-btn, .back-to-top, nav li a, .social-links a');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                background: rgba(160, 160, 160, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();
