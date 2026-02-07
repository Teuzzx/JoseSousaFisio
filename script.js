/**
 * Dr. José Sousa - Fisioterapeuta
 * JavaScript Principal - Versão Moderna 2025
 */

// ============================================
// CONFIGURAÇÕES GLOBAIS
// ============================================

const CONFIG = {
    whatsappNumber: '5589994584100',
    instagramUrl: 'https://www.instagram.com/josedsousafisio/',
    animationDuration: 600,
    scrollOffset: 80,
    carouselInterval: 5000
};

// ============================================
// ESTADO GLOBAL
// ============================================

const state = {
    currentTestimonial: 0,
    isMenuOpen: false,
    isScrolling: false
};

// ============================================
// DEPOIMENTOS
// ============================================

const testimonials = [
    {
        text: "Dr. José transformou minha vida! Sofria com dores nas costas há anos e hoje estou completamente recuperada. Profissional excepcional e muito atencioso.",
        author: "Maria Silva",
        role: "Paciente de Pilates"
    },
    {
        text: "Após a cirurgia no joelho, pensei que não voltaria a correr. Com o tratamento do Dr. José, não só voltei como melhorei minha performance. Muito grato!",
        author: "Carlos Oliveira",
        role: "Atleta Amador"
    },
    {
        text: "Excelente profissional! O tratamento para minha tendinite foi muito eficaz. Recomendo para todos que precisam de um fisioterapeuta competente.",
        author: "Ana Costa",
        role: "Paciente de Fisioterapia"
    },
    {
        text: "Depois de meses com dor ciática, finalmente encontrei alívio. Dr. José é muito dedicado e explica tudo detalhadamente. Super recomendo!",
        author: "Roberto Santos",
        role: "Paciente de Reabilitação"
    }
];

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Marca que JS está habilitado para ativar animações
    document.body.classList.add('js-enabled');
    
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initTestimonialsCarousel();
    initLazyLoading();
});

// ============================================
// HEADER
// ============================================

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    handleScroll();
}

// ============================================
// MENU MOBILE
// ============================================

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = () => {
        state.isMenuOpen = !state.isMenuOpen;
        mobileMenu.classList.toggle('active', state.isMenuOpen);
        menuBtn.setAttribute('aria-expanded', state.isMenuOpen);
        mobileMenu.setAttribute('aria-hidden', !state.isMenuOpen);
        
        // Update icon
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', state.isMenuOpen ? 'x' : 'menu');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (state.isMenuOpen) toggleMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) {
            toggleMenu();
        }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && state.isMenuOpen) {
            toggleMenu();
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                scrollToSection(href);
            }
        });
    });
}

function scrollToSection(sectionId) {
    const target = document.querySelector(sectionId);
    if (!target) return;

    const headerOffset = CONFIG.scrollOffset;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function initScrollReveal() {
    // Seleciona elementos para animar
    const revealElements = document.querySelectorAll(
        '.service-card, .feature-card, .ebook-card, .timeline-item, .stat-card, .contact-info-card'
    );

    // Se IntersectionObserver não for suportado, mantém elementos visíveis
    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => {
            el.classList.add('reveal');
        });
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, index) => {
        el.classList.add('reveal', 'animate-on-scroll');
        el.style.transitionDelay = `${index * 0.05}s`;
        revealObserver.observe(el);
    });
    
    // Fallback de segurança: revela todos os elementos após 2 segundos
    // caso o IntersectionObserver não funcione corretamente
    setTimeout(() => {
        revealElements.forEach(el => {
            if (!el.classList.contains('revealed')) {
                el.classList.add('revealed');
            }
        });
    }, 2000);
}

// ============================================
// DEPOIMENTOS CAROUSEL
// ============================================

function initTestimonialsCarousel() {
    updateTestimonial();
    
    // Auto-advance carousel
    setInterval(() => {
        nextTestimonial();
    }, CONFIG.carouselInterval);
}

function updateTestimonial() {
    const card = document.getElementById('testimonialCard');
    const text = document.getElementById('testimonialText');
    const author = document.getElementById('testimonialAuthor');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!card || !text || !author) return;

    // Fade out
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        const testimonial = testimonials[state.currentTestimonial];
        text.textContent = `"${testimonial.text}"`;
        author.textContent = testimonial.author;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === state.currentTestimonial);
        });
        
        // Fade in
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 300);
}

function nextTestimonial() {
    state.currentTestimonial = (state.currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
}

function previousTestimonial() {
    state.currentTestimonial = (state.currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
}

function goToTestimonial(index) {
    state.currentTestimonial = index;
    updateTestimonial();
}

// Make functions available globally
window.nextTestimonial = nextTestimonial;
window.previousTestimonial = previousTestimonial;
window.goToTestimonial = goToTestimonial;

// ============================================
// WHATSAPP FUNCTIONS
// ============================================

function openWhatsApp() {
    const message = `Olá Dr. José! 

Tenho interesse em cuidar da minha saúde através do Método Pilates.

Gostaria de saber mais sobre:
• Atendimentos presenciais no Studio de Postura Barroso
• Atendimentos online personalizados
• Programas para postura e alívio de dores
• Agendamento de avaliação

Aguardo seu contato!`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openProfessionalWhatsApp() {
    const message = `Olá Dr. José! 

Tenho interesse em me profissionalizar no Método Pilates.

Gostaria de saber mais sobre:
• Formação Completa em Pilates (200h)
• Workshops especializados
• Mentoria online para gestão de estúdios
• Materiais digitais e e-books

Aguardo informações sobre os cursos!`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openConsultationWhatsApp() {
    const message = `Olá Dr. José! 

Gostaria de agendar uma consulta de Fisioterapia.

Tenho interesse em:
• Avaliação fisioterapêutica
• Tratamento de dores
• Reabilitação
• Método Pilates

Quando seria possível agendar?

Aguardo seu contato!`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openServiceWhatsApp(serviceType) {
    const messages = {
        'pilates-presencial': `Olá Dr. José! 

Tenho interesse no Atendimento de Pilates Presencial no Studio de Postura Barroso.

Gostaria de saber mais sobre:
• Programas personalizados para postura
• Tratamento de dores específicas
• Fortalecimento muscular
• Valores e horários disponíveis

Aguardo seu contato!`,

        'pilates-online': `Olá Dr. José! 

Tenho interesse no Atendimento de Pilates Online.

Gostaria de saber mais sobre:
• Aulas ao vivo personalizadas
• Adaptação para meu espaço em casa
• Flexibilidade de horários
• Equipamentos necessários

Aguardo informações!`,

        'formacao-pilates': `Olá Dr. José! 

Tenho interesse na Formação Completa em Pilates (200h).

Gostaria de saber mais sobre:
• Conteúdo do curso (Solo, Bola, Aparelhos)
• Prática supervisionada
• Certificação
• Valores e formas de pagamento

Aguardo informações sobre a próxima turma!`,

        'workshops': `Olá Dr. José! 

Tenho interesse nos Workshops especializados.

Gostaria de saber mais sobre:
• Pilates Kids
• Mat Pilates
• Pilates nas Disfunções da Coluna Vertebral
• Datas e valores

Aguardo informações!`,

        'mentoria': `Olá Dr. José! 

Tenho interesse na Mentoria Online.

Gostaria de saber mais sobre:
• Gestão de estúdios de Pilates
• Planejamento de aulas
• Desenvolvimento de carreira
• Estratégias de crescimento profissional

Aguardo seu contato!`,

        'modelos-editaveis': `Olá Dr. José! 

Tenho interesse nos Modelos Editáveis para estúdios.

Gostaria de saber mais sobre:
• Documentos para administração
• Templates de padronização
• Materiais inclusos
• Valores e formas de acesso

Aguardo informações!`
    };

    const message = messages[serviceType] || messages['pilates-presencial'];
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openMentoriaWhatsApp() {
    const message = `Olá Dr. José! 

Tenho interesse na mentoria personalizada para acelerar minha carreira e transformar meu estúdio de Pilates em um negócio de sucesso.

Gostaria de saber mais sobre:
• Consultoria personalizada
• Plano de ação específico
• Suporte contínuo
• Materiais exclusivos

Aguardo seu contato!`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Make functions available globally
window.openWhatsApp = openWhatsApp;
window.openProfessionalWhatsApp = openProfessionalWhatsApp;
window.openConsultationWhatsApp = openConsultationWhatsApp;
window.openServiceWhatsApp = openServiceWhatsApp;
window.openMentoriaWhatsApp = openMentoriaWhatsApp;

// ============================================
// FORM HANDLING
// ============================================

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();

    // Validation
    if (!name || name.length < 3) {
        showNotification('Por favor, insira seu nome completo.', 'error');
        return;
    }

    if (!email || !isValidEmail(email)) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    if (!message || message.length < 10) {
        showNotification('Por favor, escreva uma mensagem mais detalhada.', 'error');
        return;
    }

    const whatsappMessage = `Olá Dr. José! 

Meu nome é: ${name}
E-mail: ${email}

Mensagem: ${message}`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
    
    form.reset();
    showNotification('Mensagem enviada com sucesso!', 'success');
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]')?.value?.trim();

    if (!email || !isValidEmail(email)) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    // Store in localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    
    if (subscribers.includes(email)) {
        showNotification('Este e-mail já está cadastrado!', 'warning');
        return;
    }

    subscribers.push(email);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

    // Send notification via WhatsApp
    const message = `Nova inscrição na newsletter!

E-mail: ${email}`;
    
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    form.reset();
    showNotification('Inscrição realizada com sucesso!', 'success');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Make functions available globally
window.handleFormSubmit = handleFormSubmit;
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" aria-label="Fechar notificação">
            <i data-lucide="x" style="width: 16px; height: 16px;"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// CHECKOUT REDIRECTION
// ============================================

function redirectToCheckout(productId) {
    const checkoutUrl = `checkout.html?product=${productId}`;
    window.location.href = checkoutUrl;
}

window.redirectToCheckout = redirectToCheckout;

// ============================================
// LAZY LOADING
// ============================================

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

if (window.location.search.includes('debug')) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⏱️ Tempo de carregamento: ${pageLoadTime}ms`);
    });
}

// ============================================
// SERVICE WORKER (PWA Support)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker falhou:', error);
            });
    });
}
