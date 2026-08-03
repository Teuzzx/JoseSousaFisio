# 🚀 CHECKOUT & EMAIL SYSTEM - GUIA DE CONFIGURAÇÃO

## O Que Foi Implementado

✅ **Página de Checkout Profissional**
- Formulário seguro para coletar: Nome, Email, Telefone
- Design elegante e responsivo
- Validação automática de dados
- Redirecionamento para Infinity Pay

✅ **Sistema de Emails**
- EmailJS integrado para envio de emails
- Email de confirmação para cliente (com link do Google Drive)
- Email de notificação para o dono (com dados do comprador)
- Mensagens profissionais e personalizadas

✅ **Página de Sucesso**
- Confirmação visual do pagamento
- Link direto para Google Drive
- Download de recibo
- Detalhes do pedido

✅ **Armazenamento de Dados**
- Dados do cliente salvos localmente
- Histórico de pedidos
- Acesso seguro para o dono

---

## 📋 Arquivos Criados

1. **checkout.html** - Página de checkout principal
2. **checkout.js** - Lógica e validações
3. **payment-success.html** - Página de sucesso
4. **Modificações em index.html** - Botões "Comprar" agora redirecionam para checkout
5. **Modificações em script.js** - Função redirectToCheckout()

---

## ⚙️ CONFIGURAÇÃO NECESSÁRIA

### 1️⃣ Configurar Links do Google Drive

**Arquivo**: `checkout.js` (linhas ~10-30)

```javascript
const products = {
    'pilates-kids': {
        id: 'pilates-kids',
        name: 'Pilates Kids – Guia Prático',
        // ... outros dados ...
        googleDriveLink: 'https://drive.google.com/file/d/1234567890/view?usp=sharing', // ← CONFIGURE AQUI
    },
    'exercicios-alunos': {
        id: 'exercicios-alunos',
        name: 'Guia de Exercícios de Pilates para Alunos',
        // ... outros dados ...
        googleDriveLink: 'https://drive.google.com/file/d/0987654321/view?usp=sharing', // ← CONFIGURE AQUI
    },
    'documentos-studio': {
        id: 'documentos-studio',
        name: 'Pacote de documentos obrigatório para seu studio',
        // ... outros dados ...
        googleDriveLink: 'https://drive.google.com/file/d/1111111111/view?usp=sharing', // ← CONFIGURE AQUI
    }
};
```

**Como obter o link:**
1. Faça upload do eBook no Google Drive
2. Clique com botão direito → Compartilhar
3. Mude para "Qualquer pessoa com o link"
4. Copie o link completo
5. Substitua nos locais indicados acima

---

### 2️⃣ Configurar EmailJS

**PASSO A PASSO:**

#### A) Criar Conta EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up" (criar conta gratuita)
3. Confirme seu email
4. Faça login

#### B) Conectar Email Provider

1. No painel, vá em "Email Services" (Serviços de Email)
2. Clique "Add Service"
3. Escolha seu provedor:
   - **Gmail** (recomendado)
   - Ou outro provedor

**Para Gmail:**
1. Selecione "Gmail"
2. Autorize sua conta Google
3. Clique "Create Service"
4. Copie o **Service ID**

#### C) Configurar Templates

1. Vá em "Email Templates"
2. Clique "Create New Template"

**Template 1 - Email para Cliente:**

```
Name: Welcome Email

Subject: {{product_name}} - Seu eBook está pronto! 🎉

Email Content:
---

Olá {{customer_name}},

Obrigado pela sua compra! 🎉

Seu pedido foi confirmado com sucesso.

📌 DADOS DO PEDIDO:
- Número: {{order_id}}
- Produto: {{product_name}}
- Valor: {{amount}}

📚 ACESSE SEU EBOOK:
Clique no link abaixo para acessar seu eBook no Google Drive:

{{google_drive_link}}

Se o link não funcionar, copie e cole no navegador.

❓ DÚVIDAS?
Entre em contato pelo WhatsApp: (89) 9 9458-4100

Abraços,
Dr. José Sousa

---
```

**Template 2 - Email para Dono:**

```
Name: New Order Notification

Subject: ✅ NOVA VENDA - {{product_name}}

Email Content:
---

Olá Dr. José,

Uma nova venda foi registrada! 💰

📌 DADOS DO CLIENTE:
Nome: {{customer_name}}
Email: {{customer_email}}
Telefone: {{customer_phone}}

📦 PRODUTO:
{{product_name}}
Valor: {{amount}}

🔢 Número do Pedido: {{order_id}}

Envie o eBook para o cliente e atualize o status do pedido.

---
```

#### D) Copiar IDs do EmailJS

1. Vá em "Account"
2. Copie:
   - **Public Key**: vai em PUBLIC_KEY
   - **Service ID**: vai em SERVICE_ID
   - **Template IDs**: um para cada template

---

### 3️⃣ Inserir Configurações no checkout.js

**Arquivo**: `checkout.js` (linhas ~150-165)

```javascript
// Initialize EmailJS
function initEmailJS() {
    // ⚠️ CONFIGURE SEU SERVICE ID E PUBLIC KEY DO EMAILJS
    const SERVICE_ID = 'service_xxxxx'; // ← Coloque aqui (ex: service_a1b2c3d4e5)
    const PUBLIC_KEY = 'public_xxxxx';   // ← Coloque aqui (ex: public_f6g7h8i9j0)
    
    emailjs.init(PUBLIC_KEY);
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

    // ⚠️ Configure seu template ID e service ID aqui
    emailjs.send('service_xxxxx', 'template_xxxxx', templateParams)
    //                    ↑ SERVICE_ID     ↑ TEMPLATE_ID_CLIENT
    // ...
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

    // ⚠️ Configure seu template ID e service ID aqui
    emailjs.send('service_xxxxx', 'template_xxxxx', templateParams)
    //                    ↑ SERVICE_ID     ↑ TEMPLATE_ID_OWNER
    // ...
}
```

---

### 4️⃣ Configurar Email do Dono

**Arquivo**: `checkout.js` (linha ~175)

```javascript
// Send confirmation emails
function sendConfirmationEmails(order, product) {
    // ⚠️ Configure seu email do dono do site
    const ownerEmail = 'seu-email@example.com'; // ← COLOQUE SEU EMAIL AQUI
    
    // ... resto do código ...
}
```

---

### 5️⃣ Configurar Infinity Pay

**Arquivo**: `checkout.js` (linhas ~140-145)

```javascript
// Redirect to Infinity Pay
function redirectToInfinityPay(order, product) {
    // ⚠️ CONFIGURE AQUI SEU LINK DO INFINITY PAY
    const infinityPayLink = 'https://infinitypay.io/checkout'; // ← SUBSTITUA
    
    // Você pode também usar seu link customizado
    // const infinityPayLink = 'https://seu-link-infinity-pay-aqui.com';
}
```

---

## 🧪 TESTAR O CHECKOUT

### Teste Local

1. Abra seu site em `http://localhost`
2. Clique em "Comprar agora" em qualquer eBook
3. Você será redirecionado para: `checkout.html?product=pilates-kids`
4. Preencha o formulário com dados de teste:
   ```
   Nome: João Silva
   Email: teste@email.com
   Telefone: (89) 99999-9999
   ```
5. Clique em "Pagar com Infinity Pay"
6. Você será redirecionado para o Infinity Pay (ou sua URL configurada)

### Teste de Email

Se configurou EmailJS corretamente:
1. Após o pagamento confirmado
2. Você receberá emails em:
   - `seu-email@example.com` (notificação de venda)
   - `teste@email.com` (confirmação com link do eBook)

---

## 📊 Dados Armazenados

Os dados são salvos em `localStorage` no navegador:

```javascript
// Acessar dados dos pedidos
const orders = JSON.parse(localStorage.getItem('checkout_orders'));

// Estrutura de cada pedido
{
    orderId: "ORD-1234567890",
    productId: "pilates-kids",
    productName: "Pilates Kids – Guia Prático",
    price: 67.00,
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    customerPhone: "(89) 9 9999-9999",
    timestamp: "2026-01-26T10:30:00.000Z",
    status: "pending_payment" // ou "paid"
}
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

- ⬜ Fazer upload dos eBooks no Google Drive
- ⬜ Copiar links do Google Drive dos eBooks
- ⬜ Inserir links em `checkout.js`
- ⬜ Criar conta em EmailJS
- ⬜ Criar 2 templates no EmailJS
- ⬜ Copiar Service ID e Public Key do EmailJS
- ⬜ Copiar IDs dos 2 templates
- ⬜ Inserir configurações em `checkout.js`
- ⬜ Configurar email do dono em `checkout.js`
- ⬜ Configurar link do Infinity Pay em `checkout.js`
- ⬜ Testar checkout localmente
- ⬜ Testar envio de emails
- ⬜ Publicar site em produção
- ⬜ Fazer teste com compra real (opcional)

---

## 🔗 Links Úteis

- **EmailJS**: https://www.emailjs.com/
- **Google Drive**: https://drive.google.com
- **Infinity Pay**: https://infinitypay.io
- **Documentação EmailJS**: https://www.emailjs.com/docs/

---

## 🆘 Dúvidas Frequentes

### P: Onde coloco meu email real do site?
**R**: Em `checkout.js`, linha ~175:
```javascript
const ownerEmail = 'seu-email@example.com';
```

### P: Como obtenho o link do Google Drive?
**R**: 
1. Faça upload do arquivo no Google Drive
2. Clique direito → Compartilhar
3. Mude para "Qualquer pessoa com o link"
4. Copie e cole em `checkout.js`

### P: EmailJS é gratuito?
**R**: Sim! Versão gratuita envia até 200 emails/mês.

### P: E se um cliente não receber o email?
**R**: Verifique:
1. Spam/Lixo eletrônico
2. Template ID correto no código
3. Service ID correto no código
4. Public Key correto

### P: Posso mudar as cores do checkout?
**R**: Sim! Edite as CSS variables em `checkout.html`:
```css
:root {
    --primary-hex: #1c3460;
    /* ... etc ... */
}
```

---

## 🚀 Depois de Configurar

1. Teste localmente todo fluxo
2. Faça uma compra de teste
3. Verifique emails
4. Acesse o Google Drive via link
5. Se tudo OK, está pronto para produção!

---

**Desenvolvido com ❤️ por DUOTECH**
Data: 26 de Janeiro de 2026
