// JavaScript for the physiotherapy website

// Global variables
let currentSlide = {
    results: 0,
    testimonials: 0
};

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
        
        // Close mobile menu when clicking on nav links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Smooth scroll functionality
function scrollToSection(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize smooth scroll for all navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"], .nav-link, .mobile-nav-link, .footer-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href);
            }
        });
    });
}

// WhatsApp functionality
function openWhatsApp() {
    const whatsappUrl = 'https://wa.me/5589994584100?text=Olá,%20gostaria%20de%20agendar%20uma%20consulta%20de%20fisioterapia.';
    window.open(whatsappUrl, '_blank');
}

// Instagram functionality
function openInstagram() {
    const instagramUrl = 'https://www.instagram.com/josedsousafisio/';
    window.open(instagramUrl, '_blank');
}

// Carousel functionality
function initCarousels() {
    // Initialize results carousel
    if (document.querySelector('.results-carousel')) {
        initCarousel('results', 3);
    }
    
    // Initialize testimonials carousel
    if (document.querySelector('.testimonials-carousel')) {
        initCarousel('testimonials', 4);
    }
}

function initCarousel(carouselType, totalSlides) {
    currentSlide[carouselType] = 0;
    
    // Auto-slide for testimonials
    if (carouselType === 'testimonials') {
        setInterval(() => {
            nextSlide(carouselType);
        }, 5000);
    }
}

function nextSlide(carouselType) {
    const slides = document.querySelectorAll(`.${carouselType === 'results' ? 'carousel' : 'testimonial'}-slide`);
    const dots = document.querySelectorAll(`#${carouselType}Dots .dot`);
    
    if (slides.length === 0) return;
    
    // Hide current slide
    slides[currentSlide[carouselType]].classList.remove('active');
    dots[currentSlide[carouselType]].classList.remove('active');
    
    // Move to next slide
    currentSlide[carouselType] = (currentSlide[carouselType] + 1) % slides.length;
    
    // Show new slide
    slides[currentSlide[carouselType]].classList.add('active');
    dots[currentSlide[carouselType]].classList.add('active');
}

function previousSlide(carouselType) {
    const slides = document.querySelectorAll(`.${carouselType === 'results' ? 'carousel' : 'testimonial'}-slide`);
    const dots = document.querySelectorAll(`#${carouselType}Dots .dot`);
    
    if (slides.length === 0) return;
    
    // Hide current slide
    slides[currentSlide[carouselType]].classList.remove('active');
    dots[currentSlide[carouselType]].classList.remove('active');
    
    // Move to previous slide
    currentSlide[carouselType] = currentSlide[carouselType] === 0 
        ? slides.length - 1 
        : currentSlide[carouselType] - 1;
    
    // Show new slide
    slides[currentSlide[carouselType]].classList.add('active');
    dots[currentSlide[carouselType]].classList.add('active');
}

function goToSlide(carouselType, slideIndex) {
    const slides = document.querySelectorAll(`.${carouselType === 'results' ? 'carousel' : 'testimonial'}-slide`);
    const dots = document.querySelectorAll(`#${carouselType}Dots .dot`);
    
    if (slides.length === 0 || slideIndex >= slides.length) return;
    
    // Hide current slide
    slides[currentSlide[carouselType]].classList.remove('active');
    dots[currentSlide[carouselType]].classList.remove('active');
    
    // Go to specific slide
    currentSlide[carouselType] = slideIndex;
    
    // Show new slide
    slides[currentSlide[carouselType]].classList.add('active');
    dots[currentSlide[carouselType]].classList.add('active');
}

// Form handling
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    const whatsappMessage = `Olá Dr. José! 

Meu nome é: ${name}
E-mail: ${email}

Mensagem: ${message}`;

    const whatsappUrl = `https://wa.me/5589994584100?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
        '.service-card, .qualification-card, .timeline-item, .blog-card, .contact-card, .proof-card'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing website...');
    
    // Initialize all functionality
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initCarousels();
    initScrollAnimations();
    
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    console.log('Website initialized successfully!');
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 1024) {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            }
        }
    }
});

// Keyboard navigation for carousels
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        if (document.querySelector('.results-carousel:hover')) {
            previousSlide('results');
        } else if (document.querySelector('.testimonials-carousel:hover')) {
            previousSlide('testimonials');
        }
    } else if (event.key === 'ArrowRight') {
        if (document.querySelector('.results-carousel:hover')) {
            nextSlide('results');
        } else if (document.querySelector('.testimonials-carousel:hover')) {
            nextSlide('testimonials');
        }
    }
});

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Export functions for global access
window.openWhatsApp = openWhatsApp;
window.openInstagram = openInstagram;
window.scrollToSection = scrollToSection;
window.nextSlide = nextSlide;
window.previousSlide = previousSlide;
window.goToSlide = goToSlide;
window.handleFormSubmit = handleFormSubmit;

// Mentoria WhatsApp functionality
function openMentoriaWhatsApp() {
    const mentoriaMessage = `Olá Dr. José! 

Tenho interesse na mentoria personalizada para acelerar minha carreira e transformar meu estúdio de Pilates em um negócio de sucesso.

Gostaria de saber mais sobre:
- Consultoria personalizada
- Plano de ação específico
- Suporte contínuo
- Materiais exclusivos

Aguardo seu contato!`;

    const whatsappUrl = `https://wa.me/5589994584100?text=${encodeURIComponent(mentoriaMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// eBook purchase functionality
function buyEbook(ebookId) {
    const ebookLinks = {
        'pilates-kids': 'https://pay.hotmart.com/pilates-kids-guia-pratico',
        'exercicios-alunos': 'https://pay.kiwify.com.br/exercicios-pilates-alunos',
        'documentos-studio': 'https://pay.hotmart.com/documentos-studio-pilates'
    };

    const ebookNames = {
        'pilates-kids': 'Pilates Kids – Guia Prático',
        'exercicios-alunos': 'Guia de Exercícios de Pilates para Alunos',
        'documentos-studio': 'Pacote de documentos obrigatório para seu studio'
    };

    // For demonstration, we'll use WhatsApp for now
    // In production, you would redirect to the actual payment links
    const purchaseMessage = `Olá Dr. José! 

Tenho interesse em comprar o eBook: "${ebookNames[ebookId]}"

Gostaria de saber mais sobre:
- Formas de pagamento
- Acesso ao material
- Suporte pós-compra

Aguardo informações!`;

    const whatsappUrl = `https://wa.me/5589994584100?text=${encodeURIComponent(purchaseMessage)}`;
    window.open(whatsappUrl, '_blank');

    // Track purchase intent (for analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase_intent', {
            'event_category': 'eBooks',
            'event_label': ebookNames[ebookId],
            'value': ebookId
        });
    }
}

// Newsletter subscription functionality
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    // Simulate newsletter subscription
    // In production, you would integrate with an email service like Mailchimp, ConvertKit, etc.
    
    // For now, we'll use a simple alert and WhatsApp notification
    alert('Obrigado por se inscrever! Você receberá nossas novidades em breve.');
    
    // Send notification via WhatsApp
    const newsletterMessage = `Nova inscrição na newsletter!

E-mail: ${email}

Por favor, adicionar à lista de contatos para receber conteúdos exclusivos sobre Pilates e gestão de estúdios.`;

    const whatsappUrl = `https://wa.me/5589994584100?text=${encodeURIComponent(newsletterMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    event.target.reset();
    
    // Track newsletter subscription (for analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
            'event_category': 'Newsletter',
            'event_label': 'Header Form'
        });
    }
}

// Email automation system (basic implementation)
class EmailAutomation {
    constructor() {
        this.subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        this.purchasers = JSON.parse(localStorage.getItem('ebook_purchasers') || '[]');
    }

    // Add subscriber to newsletter
    addSubscriber(email, source = 'newsletter') {
        const subscriber = {
            email: email,
            source: source,
            subscribed_at: new Date().toISOString(),
            status: 'active'
        };

        this.subscribers.push(subscriber);
        this.saveSubscribers();
        
        // Send welcome email sequence
        this.sendWelcomeSequence(email);
    }

    // Add purchaser
    addPurchaser(email, ebookId, ebookName) {
        const purchaser = {
            email: email,
            ebook_id: ebookId,
            ebook_name: ebookName,
            purchased_at: new Date().toISOString(),
            status: 'completed'
        };

        this.purchasers.push(purchaser);
        this.savePurchasers();
        
        // Send purchase confirmation and follow-up sequence
        this.sendPurchaseSequence(email, ebookName);
    }

    // Send welcome email sequence
    sendWelcomeSequence(email) {
        // Day 1: Welcome email
        setTimeout(() => {
            this.sendEmail(email, 'welcome', {
                subject: 'Bem-vindo(a) à nossa comunidade de Pilates!',
                content: this.getWelcomeEmailContent()
            });
        }, 1000);

        // Day 3: First tip email
        setTimeout(() => {
            this.sendEmail(email, 'tip_1', {
                subject: 'Dica #1: Como melhorar a postura dos seus alunos',
                content: this.getTipEmailContent(1)
            });
        }, 3 * 24 * 60 * 60 * 1000); // 3 days

        // Day 7: eBook promotion
        setTimeout(() => {
            this.sendEmail(email, 'ebook_promo', {
                subject: 'Oferta especial: eBooks com 30% de desconto',
                content: this.getPromoEmailContent()
            });
        }, 7 * 24 * 60 * 60 * 1000); // 7 days
    }

    // Send purchase follow-up sequence
    sendPurchaseSequence(email, ebookName) {
        // Immediate: Purchase confirmation
        setTimeout(() => {
            this.sendEmail(email, 'purchase_confirmation', {
                subject: `Confirmação de compra: ${ebookName}`,
                content: this.getPurchaseConfirmationContent(ebookName)
            });
        }, 1000);

        // Day 1: How to use the eBook
        setTimeout(() => {
            this.sendEmail(email, 'usage_guide', {
                subject: `Como aproveitar ao máximo seu ${ebookName}`,
                content: this.getUsageGuideContent(ebookName)
            });
        }, 24 * 60 * 60 * 1000); // 1 day

        // Day 7: Feedback request
        setTimeout(() => {
            this.sendEmail(email, 'feedback_request', {
                subject: 'Como está sendo sua experiência com o eBook?',
                content: this.getFeedbackRequestContent(ebookName)
            });
        }, 7 * 24 * 60 * 60 * 1000); // 7 days
    }

    // Simulate sending email (in production, integrate with email service)
    sendEmail(email, type, emailData) {
        console.log(`Sending email to ${email}:`, emailData);
        
        // In production, you would integrate with services like:
        // - Mailchimp API
        // - SendGrid API
        // - ConvertKit API
        // - EmailJS
        
        // For demonstration, we'll log to console and show notification
        this.logEmailSent(email, type, emailData);
    }

    // Log email sent (for tracking)
    logEmailSent(email, type, emailData) {
        const emailLog = {
            email: email,
            type: type,
            subject: emailData.subject,
            sent_at: new Date().toISOString()
        };

        const emailLogs = JSON.parse(localStorage.getItem('email_logs') || '[]');
        emailLogs.push(emailLog);
        localStorage.setItem('email_logs', JSON.stringify(emailLogs));
    }

    // Email content templates
    getWelcomeEmailContent() {
        return `
        <h2>Bem-vindo(a) à nossa comunidade!</h2>
        <p>Olá!</p>
        <p>É um prazer ter você em nossa comunidade de profissionais de Pilates.</p>
        <p>Nos próximos dias, você receberá dicas exclusivas, conteúdos especiais e ofertas imperdíveis.</p>
        <p>Fique atento(a) ao seu e-mail!</p>
        <p>Um abraço,<br>Dr. José Sousa</p>
        `;
    }

    getTipEmailContent(tipNumber) {
        const tips = {
            1: `
            <h2>Dica #1: Melhorando a postura dos seus alunos</h2>
            <p>Uma das principais queixas dos alunos de Pilates é a má postura.</p>
            <p>Aqui estão 3 exercícios fundamentais que você pode incluir em todas as aulas:</p>
            <ul>
                <li><strong>Roll Down:</strong> Fortalece o core e alonga a coluna</li>
                <li><strong>Swan Prep:</strong> Trabalha a extensão torácica</li>
                <li><strong>Shoulder Bridge:</strong> Ativa glúteos e estabiliza pelve</li>
            </ul>
            <p>Experimente incluir estes exercícios na próxima aula!</p>
            `
        };
        return tips[tipNumber] || '';
    }

    getPromoEmailContent() {
        return `
        <h2>Oferta Especial: 30% OFF em todos os eBooks!</h2>
        <p>Por tempo limitado, todos os nossos eBooks estão com 30% de desconto.</p>
        <p>Aproveite para adquirir:</p>
        <ul>
            <li>Pilates Kids – Guia Prático</li>
            <li>Guia de Exercícios para Alunos</li>
            <li>Pacote de Documentos para Estúdios</li>
        </ul>
        <p>Use o cupom: <strong>PILATES30</strong></p>
        <p><a href="#ebooks">Ver eBooks disponíveis</a></p>
        `;
    }

    getPurchaseConfirmationContent(ebookName) {
        return `
        <h2>Compra confirmada!</h2>
        <p>Parabéns pela aquisição do "${ebookName}"!</p>
        <p>Seu eBook já está disponível para download.</p>
        <p>Em caso de dúvidas, entre em contato conosco.</p>
        <p>Obrigado pela confiança!</p>
        `;
    }

    getUsageGuideContent(ebookName) {
        return `
        <h2>Como aproveitar ao máximo seu eBook</h2>
        <p>Agora que você tem o "${ebookName}", aqui estão algumas dicas:</p>
        <ul>
            <li>Leia com calma, fazendo anotações</li>
            <li>Pratique os exercícios sugeridos</li>
            <li>Adapte o conteúdo à sua realidade</li>
            <li>Compartilhe com outros profissionais</li>
        </ul>
        <p>Qualquer dúvida, estamos aqui para ajudar!</p>
        `;
    }

    getFeedbackRequestContent(ebookName) {
        return `
        <h2>Como está sendo sua experiência?</h2>
        <p>Já faz uma semana desde que você adquiriu o "${ebookName}".</p>
        <p>Gostaríamos de saber como está sendo sua experiência:</p>
        <ul>
            <li>O conteúdo atendeu suas expectativas?</li>
            <li>Conseguiu aplicar as técnicas?</li>
            <li>Tem alguma sugestão de melhoria?</li>
        </ul>
        <p>Seu feedback é muito importante para nós!</p>
        `;
    }

    // Save data to localStorage
    saveSubscribers() {
        localStorage.setItem('newsletter_subscribers', JSON.stringify(this.subscribers));
    }

    savePurchasers() {
        localStorage.setItem('ebook_purchasers', JSON.stringify(this.purchasers));
    }
}

// Initialize email automation system
const emailAutomation = new EmailAutomation();

// Export functions for global access
window.openMentoriaWhatsApp = openMentoriaWhatsApp;
window.buyEbook = buyEbook;
window.handleNewsletterSubmit = handleNewsletterSubmit;
window.emailAutomation = emailAutomation;

