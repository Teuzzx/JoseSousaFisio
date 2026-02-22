const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

dotenv.config();

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.INFINITY_PAY_WEBHOOK_SECRET || '';
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Produtos - mantenha em sincronia com checkout.js
const products = {
  'pilates-kids': {
    googleDriveLink: 'https://drive.google.com/drive/folders/1qyVV5vIQYrX1g3u0mA4PEs9vE6hJ5FJu?usp=drive_link'
  },
  'kit-fisioterapeutas': {
    googleDriveLink: 'https://drive.google.com/drive/folders/1-KuijCHXVMZ9yc0CnMFCeEmB_rIAI8g-?usp=sharing'
  },
  'kit-studio': {
    googleDriveLink: 'https://drive.google.com/drive/folders/1EpM4PXRrIAqBpOGFN-ikNkEFAFKjDJjf?usp=drive_link'
  }
};

// Ensure orders file exists
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');
}

// Configure email providers
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: (process.env.SMTP_PORT === '465'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const app = express();

// Allow simple CORS for local site to post orders to this server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-infinitypay-signature');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Route to receive orders from the client before redirecting to payment
app.post('/orders', (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || !incoming.orderId) return res.status(400).json({ error: 'orderId required' });

    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')) || [];
    const exists = orders.find(o => o.orderId === incoming.orderId);
    if (!exists) {
      orders.push(incoming);
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'server error' });
  }
});

// Get order by orderId (used by payment-success page if localStorage doesn't have the order)
app.get('/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')) || [];
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error reading order:', err);
    res.status(500).json({ error: 'server error' });
  }
});

// We need raw body for signature verification
app.post('/webhook/infinitypay', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const raw = req.body;

    // Verify signature if secret provided
    if (WEBHOOK_SECRET) {
      const signature = req.headers['x-infinitypay-signature'] || req.headers['x-signature'];
      if (!signature) {
        console.warn('Assinatura ausente');
        return res.status(401).send('Signature missing');
      }
      const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex');
      if (expected !== signature) {
        console.warn('Assinatura inválida');
        return res.status(401).send('Invalid signature');
      }
    }

    const payload = JSON.parse(raw.toString('utf8'));

    // Expected payload: { orderId, status, productId, customerEmail, customerName, customerPhone, amount }
    const { orderId, status, productId, customerEmail, customerName, customerPhone, amount } = payload;

    if (!orderId) {
      return res.status(400).send('orderId required');
    }

    // Load orders
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')) || [];

    let order = orders.find(o => o.orderId === orderId);
    if (!order) {
      // If order not present, create a minimal record
      order = {
        orderId,
        productId: productId || payload.product || null,
        productName: payload.productName || null,
        price: amount || payload.amount || 0,
        customerName: customerName || payload.customer_name || '',
        customerEmail: customerEmail || payload.customer_email || '',
        customerPhone: customerPhone || payload.customer_phone || '',
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      orders.push(order);
    }

    // Update status when payment confirmed
    if (String(status).toLowerCase() === 'paid' || String(status).toLowerCase() === 'confirmed' || payload.paid === true) {
      order.status = 'paid';
      order.paidAt = new Date().toISOString();
    } else {
      order.status = status || order.status;
    }

    // Persist orders
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');

    // Send confirmation email if paid AND SEND_EMAILS is explicitly enabled
    if (order.status === 'paid') {
      const product = products[order.productId] || {};
      const driveLink = product.googleDriveLink || payload.googleDriveLink || '';
      if (String(process.env.SEND_EMAILS).toLowerCase() === 'true') {
        await sendEmails(order, driveLink);
      } else {
        console.log('SEND_EMAILS not enabled — skipping automatic email send for order', order.orderId);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('server error');
  }
});

app.get('/health', (req, res) => res.send('ok'));

async function sendEmails(order, driveLink) {
  const from = process.env.FROM_EMAIL || process.env.OWNER_EMAIL;
  const ownerEmail = process.env.OWNER_EMAIL;

  if (!from) {
    console.warn('FROM_EMAIL não configurado — pulando envio de e-mail');
    return;
  }

  const subject = `Seu eBook ${order.productName || order.productId} - Compra confirmada`;
  const html = `
    <p>Olá ${order.customerName || ''},</p>
    <p>Obrigado pela sua compra do <strong>${order.productName || order.productId}</strong>.</p>
    <p>Valor: R$ ${Number(order.price || 0).toFixed(2).replace('.', ',')}</p>
    <p>Você pode acessar o material pelo link abaixo:</p>
    <p><a href="${driveLink}" target="_blank">Acessar eBook</a></p>
    <p>Se preferir, responda a este e-mail para que eu possa enviar os arquivos.</p>
    <p>Um abraço,<br/>Dr. José Sousa</p>
  `;

  const mailOptions = {
    to: order.customerEmail,
    from,
    subject,
    html
  };

  // Send to customer
  try {
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send({ ...mailOptions });
      console.log('Email enviado via SendGrid para cliente:', order.customerEmail);
    } else if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log('Email enviado via SMTP para cliente:', order.customerEmail);
    } else {
      console.warn('Nenhum provedor de e-mail configurado. Ative SENDGRID_API_KEY ou SMTP_*');
    }
  } catch (err) {
    console.error('Erro ao enviar email para cliente:', err);
  }

  // Send notification to owner if configured
  if (ownerEmail) {
    const ownerSubject = `Venda confirmada: ${order.productName || order.productId} - ${order.orderId}`;
    const ownerHtml = `
      <p>Pedido <strong>${order.orderId}</strong> confirmado.</p>
      <p>Cliente: ${order.customerName} (${order.customerEmail})</p>
      <p>Produto: ${order.productName || order.productId}</p>
      <p>Valor: R$ ${Number(order.price || 0).toFixed(2).replace('.', ',')}</p>
    `;

    const ownerMail = { to: ownerEmail, from, subject: ownerSubject, html: ownerHtml };
    try {
      if (process.env.SENDGRID_API_KEY) {
        await sgMail.send(ownerMail);
        console.log('E-mail enviado ao dono via SendGrid');
      } else if (transporter) {
        await transporter.sendMail(ownerMail);
        console.log('E-mail enviado ao dono via SMTP');
      }
    } catch (err) {
      console.error('Erro ao enviar email para dono:', err);
    }
  }
}

app.listen(PORT, () => {
  console.log(`Infinity Pay webhook server running on port ${PORT}`);
});
