/**
 * Dr. José Sousa - Fisioterapeuta
 * Enhancements Visuais - Versão Moderna 2025
 * Efeitos visuais e otimizações de interação
 */

// ============================================
// CONFIGURAÇÕES
// ============================================

const ENHANCEMENT_CONFIG = {
    parallaxIntensity: 0.3,
    mouseGlowIntensity: 0.15,
    animationThreshold: 0.1,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (ENHANCEMENT_CONFIG.reducedMotion) return;
    
    initParallaxEffects();
    initMagneticButtons();
    initNumberCounter();
    initGradientShift();
    initSmoothHover();
});

// ============================================
// PARALLAX EFFECTS
// ============================================

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-image-wrapper, .about-image');
    
    let ticking = false;
    
    const handleScroll = () => {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const distance = scrollY - elementTop;
            
            if (scrollY + window.innerHeight > elementTop && scrollY < elementTop + rect.height) {
                const speed = el.classList.contains('hero-image-wrapper') ? 0.3 : 0.1;
                el.style.transform = `translateY(${distance * speed}px)`;
            }
        });
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// MAGNETIC BUTTONS
// ============================================

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .service-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
// ANIMATED NUMBER COUNTER
// ============================================

function initNumberCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                animateNumber(entry.target);
                entry.target.dataset.counted = 'true';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => observer.observe(num));
}

function animateNumber(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasText = text.replace(/[0-9+]/g, '').trim();
    const finalNumber = parseInt(text.replace(/\D/g, ''));
    
    let current = 0;
    const duration = 2000;
    const increment = finalNumber / (duration / 16);
    
    const updateNumber = () => {
        current += increment;
        
        if (current >= finalNumber) {
            element.textContent = `${hasPlus ? '+' : ''}${finalNumber}${hasText ? hasText : ''}`;
        } else {
            element.textContent = `${hasPlus ? '+' : ''}${Math.floor(current)}${hasText ? hasText : ''}`;
            requestAnimationFrame(updateNumber);
        }
    };
    
    requestAnimationFrame(updateNumber);
}

// ============================================
// GRADIENT SHIFT EFFECT
// ============================================

function initGradientShift() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    
    const animate = () => {
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        const gradientX = 50 + currentX * 10;
        const gradientY = 50 + currentY * 10;
        
        hero.style.setProperty('--gradient-position', `${gradientX}% ${gradientY}%`);
        
        requestAnimationFrame(animate);
    };
    
    animate();
}

// ============================================
// SMOOTH HOVER EFFECTS
// ============================================

function initSmoothHover() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ============================================
// CSS ANIMATIONS (injected)
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .hero::before {
        background-position: var(--gradient-position, 50% 50%);
        transition: background-position 0.3s ease;
    }
    
    .stat-number {
        font-variant-numeric: tabular-nums;
    }
`;
document.head.appendChild(style);

// ============================================
// EXPORT
// ============================================

window.Enhancements = {
    config: ENHANCEMENT_CONFIG,
    initParallax: initParallaxEffects,
    initMagnetic: initMagneticButtons,
    initCounter: initNumberCounter
};
