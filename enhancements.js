/**
 * Enhancements para melhorar experiência visual e dinâmica do site
 * Animações, efeitos visuais e otimizações de interação
 */

// ===== ANIMAÇÕES DE ENTRADA =====

/**
 * Observador para animar elementos quando entram na viewport
 */
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos com classe animável
    const animateElements = document.querySelectorAll(
        '.service-card, .ebook-card, .feature-card, .stat-card, .testimonial-card, .guarantee-card'
    );

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== EFEITOS DE MOUSE =====

/**
 * Adicionar efeito de luz ao passar o mouse em cards
 */
function initMouseGlow() {
    const cards = document.querySelectorAll('.service-card, .ebook-card, .feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const glowElement = document.createElement('div');
            glowElement.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, rgba(255,255,255,0.3), transparent);
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                transform: translate(-50%, -50%);
                border-radius: 50%;
                z-index: 1;
            `;

            card.appendChild(glowElement);

            setTimeout(() => glowElement.remove(), 300);
        });
    });
}

// ===== CONTADOR ANIMADO =====

/**
 * Animar números quando entram em viewport
 */
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number, .proof-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const finalValue = parseInt(entry.target.textContent);
                const startValue = 0;
                const duration = 2000;
                const increment = finalValue / (duration / 50);
                let current = startValue;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalValue) {
                        entry.target.textContent = finalValue;
                        clearInterval(timer);
                        entry.target.dataset.animated = 'true';
                    } else {
                        entry.target.textContent = Math.floor(current);
                    }
                }, 50);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// ===== TIPOGRAFIA DINÂMICA =====

/**
 * Efeito de digitação para textos especiais
 */
function initTypewriterEffect() {
    const elements = document.querySelectorAll('[data-typewriter]');

    elements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';

        let index = 0;
        const speed = parseInt(el.dataset.typewriter) || 50;

        const type = () => {
            if (index < text.length) {
                el.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };

        // Iniciar quando visível
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && index === 0) {
                type();
                observer.unobserve(el);
            }
        });

        observer.observe(el);
    });
}

// ===== SCROLL PARALLAX =====

/**
 * Efeito parallax em scroll para elementos com data-parallax
 */
function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');

    if (elements.length === 0) return;

    window.addEventListener('scroll', () => {
        elements.forEach(el => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = el.offsetTop;
            const elementHeight = el.offsetHeight;
            const windowHeight = window.innerHeight;

            if (scrollPosition + windowHeight > elementPosition) {
                const offset = (scrollPosition - elementPosition + windowHeight) * 0.3;
                el.style.transform = `translateY(${offset}px)`;
            }
        });
    });
}

// ===== LOADING STATES =====

/**
 * Adicionar efeito de loading em botões
 */
function initButtonLoadingStates() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.dataset.loading === 'true') {
                return;
            }

            // Adicionar classe de loading
            const originalHTML = this.innerHTML;
            const originalWidth = this.offsetWidth;

            this.style.width = originalWidth + 'px';
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            this.dataset.loading = 'true';
            this.disabled = true;

            // Remover loading após 2 segundos (se não foi redirecionado)
            setTimeout(() => {
                if (this.dataset.loading === 'true') {
                    this.innerHTML = originalHTML;
                    this.dataset.loading = 'false';
                    this.disabled = false;
                    this.style.width = 'auto';
                }
            }, 2000);
        });
    });
}

// ===== EFEITOS DE HOVER EM ÍCONES =====

/**
 * Adicionar efeitos dinâmicos em ícones
 */
function initIconEffects() {
    const icons = document.querySelectorAll('.service-icon i, .feature-icon i, .proof-icon i');

    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'bounce 0.6s ease-in-out infinite';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
}

// ===== SCROLL REVEAL =====

/**
 * Revelar elementos durante scroll
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
}

// ===== DARK MODE TOGGLE =====

/**
 * Toggle dark mode (opcional)
 */
function initDarkModeToggle() {
    const button = document.getElementById('darkModeToggle');
    if (!button) return;

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    button.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
    });
}

// ===== SMOOTH SCROLL POLYFILL =====

/**
 * Melhorar smooth scroll
 */
function initEnhancedSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== LAZY LOADING IMAGES =====

/**
 * Lazy load de imagens para melhor performance
 */
function initLazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// ===== PERFORMANCE MONITORING =====

/**
 * Monitor performance e exibir métricas (desenvolvimento)
 */
function initPerformanceMonitoring() {
    if (window.location.search.includes('debug')) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⏱️ Tempo de carregamento: ${pageLoadTime}ms`);

            // Core Web Vitals
            if ('web-vital' in window) {
                console.log('✅ Web Vitals disponíveis');
            }
        });
    }
}

// ===== INICIALIZAR TUDO =====

/**
 * Função para inicializar todos os enhancements
 */
function initAllEnhancements() {
    // Aguardar DOM estar completamente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initIntersectionObserver();
            animateNumbers();
            initTypewriterEffect();
            initParallax();
            initButtonLoadingStates();
            initIconEffects();
            initScrollReveal();
            initDarkModeToggle();
            initEnhancedSmoothScroll();
            initLazyLoadImages();
            initPerformanceMonitoring();
        });
    } else {
        initIntersectionObserver();
        animateNumbers();
        initTypewriterEffect();
        initParallax();
        initButtonLoadingStates();
        initIconEffects();
        initScrollReveal();
        initDarkModeToggle();
        initEnhancedSmoothScroll();
        initLazyLoadImages();
        initPerformanceMonitoring();
    }
}

// Executar ao carregar script
initAllEnhancements();

// Exportar para uso global
window.initAllEnhancements = initAllEnhancements;
