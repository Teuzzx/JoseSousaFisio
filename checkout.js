// ===== CHECKOUT SYSTEM =====

// Product Data
const products = {
    'pilates-kids': {
        id: 'pilates-kids',
        name: 'Pilates Kids – Guia Prático',
        description: 'Material completo para fisioterapeutas e instrutores que desejam atuar com segurança e criatividade no Pilates para crianças.',
        price: 97.00,
        googleDriveLink: 'https://drive.google.com/drive/folders/1qyVV5vIQYrX1g3u0mA4PEs9vE6hJ5FJu?usp=drive_link',
        infinityPayLink: 'https://checkout.infinitepay.io/mateushype/7KX79BXcAr', // link fornecido para teste
        image: 'src/assets/ebook-pilates-kids.jpg'
    },
    'kit-fisioterapeutas': {
        id: 'kit-fisioterapeutas',
        name: 'Kit com 18 Documentos para Fisioterapeutas',
        description: 'Pacote com 18 documentos essenciais para atendimento clínico, padronização e segurança.',
        price: 67.00,
        googleDriveLink: 'https://drive.google.com/drive/folders/1-KuijCHXVMZ9yc0CnMFCeEmB_rIAI8g-?usp=sharing',
        infinityPayLink: 'https://checkout.infinitepay.io/josedesousa_pilates/1pdLnUlmmN',
        image: 'src/assets/ebook-exercicios-alunos.jpg'
    },
    'kit-studio': {
        id: 'kit-studio',
        name: 'Kit Essencial para Studio',
        description: 'Conjunto essencial para estruturar seu studio com organização, segurança jurídica e templates prontos.',
        price: 47.00,
        googleDriveLink: 'https://drive.google.com/drive/folders/1EpM4PXRrIAqBpOGFN-ikNkEFAFKjDJjf?usp=drive_link',
        infinityPayLink: 'https://checkout.infinitepay.io/josedesousa_pilates/2RVoQhztSJ',
        image: 'src/assets/ebook-documentos-studio.jpg'
    }
};

// Get product from URL
function getProductFromURL() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    return productId && products[productId] ? products[productId] : null;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    const product = getProductFromURL();
    
    if (!product) {
        showError('Produto não encontrado. Retornando...');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    // Populate product info
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

    // Store product in session
    sessionStorage.setItem('currentProduct', JSON.stringify(product));
});

// Form validation
function validateForm(formData) {
    const { fullName, email, phone } = formData;

    // Validate full name
    if (!fullName || fullName.trim().length < 3) {
        return { valid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
    }

    if (fullName.length > 100) {
        return { valid: false, error: 'Nome muito longo' };
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { valid: false, error: 'E-mail inválido' };
    }

    // Validate phone
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phone || !phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
        return { valid: false, error: 'Telefone inválido' };
    }

    return { valid: true };
}

// Sanitize input
function sanitizeInput(input) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = input;
    return tempDiv.innerHTML;
}

// Handle checkout form submission
function handleCheckoutSubmit(event) {
    event.preventDefault();

    // Get form data
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    let fullName = sanitizeInput(formData.get('fullName'));
    let email = sanitizeInput(formData.get('email'));
    let phone = sanitizeInput(formData.get('phone'));
    const terms = formData.get('terms');

    // Validate form
    const validation = validateForm({ fullName, email, phone });
    if (!validation.valid) {
        showError(validation.error);
        return;
    }

    if (!terms) {
        showError('Você deve concordar com os termos de serviço');
        return;
    }

    // Get current product
    const product = JSON.parse(sessionStorage.getItem('currentProduct'));
    if (!product) {
        showError('Erro: Produto não encontrado');
        return;
    }

    // Create purchase order
    const order = {
        orderId: `ORD-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        price: product.price,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        timestamp: new Date().toISOString(),
        status: 'pending_payment'
    };

    // Save order
    saveOrder(order);

    // Store order in session for Infinity Pay callback
    sessionStorage.setItem('pendingOrder', JSON.stringify(order));

    // Disable button
    const paymentBtn = document.getElementById('paymentBtn');
    paymentBtn.disabled = true;
    paymentBtn.innerHTML = '<span class="loading-spinner"><i data-lucide="loader"></i></span> Processando...';

    // Redirect to Infinity Pay
    setTimeout(() => {
        // First attempt to persist order on webhook server (if configured) so server has the order when webhook arrives
        const webhookServer = localStorage.getItem('webhookServerUrl');
        if (webhookServer) {
            fetch(`${webhookServer.replace(/\/$/, '')}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            }).catch(err => console.warn('Não foi possível enviar order ao servidor webhook:', err))
              .finally(() => redirectToInfinityPay(order, product));
        } else {
            redirectToInfinityPay(order, product);
        }
    }, 1000);
}

// Save order to localStorage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('checkout_orders') || '[]');
    orders.push(order);
    localStorage.setItem('checkout_orders', JSON.stringify(orders));
}

// Redirect to Infinity Pay
function redirectToInfinityPay(order, product) {
    // ⚠️ CONFIGURE AQUI SEU LINK DO INFINITY PAY
    // Cole seu link customizado do Infinity Pay que você criou na plataforma
    // Exemplo: https://app.infinitypay.io/checkout/c1a2b3c4d5e6f7g8h9i0
    // Priority: product-specific link -> global localStorage link -> placeholder
    const infinityPayLink = (product && product.infinityPayLink) || localStorage.getItem('infinityPayLink') || 'https://app.infinitypay.io/checkout/SEU-LINK-AQUI'; // ← Cole seu link no localStorage para uso imediato
    
    // Armazenar ordem atual para recuperar quando o webhook chegar
    sessionStorage.setItem('currentPaymentOrder', JSON.stringify({
        orderId: order.orderId,
        amount: product.price,
        productName: product.name,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        productId: product.id,
        googleDriveLink: product.googleDriveLink
    }));
    
    // Redirecionar pra Infinity Pay (mesma aba)
    // O Infinity Pay vai redirecionar de volta pro payment-success.html após pagamento
    window.location.href = infinityPayLink;
}

// Utility: permite definir o link do Infinity Pay via console (ex: setInfinityPayLink('https://app.infinitypay.io/checkout/...'))
function setInfinityPayLink(link) {
    try {
        if (!link || typeof link !== 'string') throw new Error('Link inválido');
        localStorage.setItem('infinityPayLink', link);
        console.log('Infinity Pay link salvo em localStorage');
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

window.setInfinityPayLink = setInfinityPayLink;

// Utility: define a URL do servidor webhook para gravar orders antes do pagamento
function setWebhookServerUrl(url) {
    if (!url || typeof url !== 'string') return false;
    localStorage.setItem('webhookServerUrl', url);
    console.log('Webhook server url armazenada');
    return true;
}

window.setWebhookServerUrl = setWebhookServerUrl;

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorMessage.classList.add('show');

    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// ===== EMAIL SYSTEM (USANDO EmailJS) =====

// Initialize EmailJS
function initEmailJS() {
    // ⚠️ CONFIGURE SEU SERVICE ID E PUBLIC KEY DO EMAILJS
    // Vá em https://www.emailjs.com/ para criar uma conta gratuita
    const SERVICE_ID = 'service_xxxxx'; // ← Configure
    const PUBLIC_KEY = 'public_xxxxx';   // ← Configure
    
    emailjs.init(PUBLIC_KEY);
}

// Send confirmation emails
function sendConfirmationEmails(order, product) {
    // ⚠️ Configure seu email do dono do site
    const ownerEmail = 'seu-email@example.com'; // ← Configure

    // Email para o cliente
    sendClientEmail(order, product);

    // Email para o dono
    sendOwnerEmail(order, product, ownerEmail);
}

// Send email to client
function sendClientEmail(order, product) {
    const templateParams = {
        to_email: order.customerEmail,
        customer_name: order.customerName,
        product_name: product.name,
        order_id: order.orderId,
        google_drive_link: product.googleDriveLink,
        amount: `R$ ${product.price.toFixed(2).replace('.', ',')}`
    };

    // ⚠️ Configure seu template ID no EmailJS
    emailjs.send('service_xxxxx', 'template_xxxxx', templateParams)
        .then(() => {
            console.log('Email enviado para cliente');
        })
        .catch(err => {
            console.error('Erro ao enviar email:', err);
        });
}

// Send email to owner
function sendOwnerEmail(order, product, ownerEmail) {
    const templateParams = {
        to_email: ownerEmail,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        product_name: product.name,
        order_id: order.orderId,
        amount: `R$ ${product.price.toFixed(2).replace('.', ',')}`
    };

    // ⚠️ Configure seu template ID no EmailJS
    emailjs.send('service_xxxxx', 'template_xxxxx', templateParams)
        .then(() => {
            console.log('Email enviado para dono');
        })
        .catch(err => {
            console.error('Erro ao enviar email:', err);
        });
}

// ===== PAYMENT CONFIRMATION HANDLER =====

/**
 * Call this function when Infinity Pay confirms the payment
 * You can set up a webhook in Infinity Pay to call this function
 */
function handlePaymentConfirmation(orderId) {
    // Get order from localStorage
    let orders = JSON.parse(localStorage.getItem('checkout_orders') || '[]');
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        console.error('Pedido não encontrado');
        return;
    }

    // Update order status
    order.status = 'paid';
    order.paidAt = new Date().toISOString();

    // Save updated order
    const updatedOrders = orders.map(o => o.orderId === orderId ? order : o);
    localStorage.setItem('checkout_orders', JSON.stringify(updatedOrders));

    // Get product
    const product = products[order.productId];

    // Send confirmation emails
    initEmailJS();
    sendConfirmationEmails(order, product);

    // Redirect to success page
    window.location.href = `payment-success.html?orderId=${orderId}`;
}

// ===== INITIALIZATION =====
initEmailJS();
