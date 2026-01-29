# 🚀 SETUP MAKE.COM - EMAIL AUTOMÁTICO APÓS PAGAMENTO

## ⚡ RESUMO DO FLUXO

```
Cliente Clica "Pagar"
    ↓
Preenche dados checkout
    ↓
Clica "Pagar com Infinity Pay"
    ↓
Infinity Pay processa pagamento
    ↓
✅ MAKE.com recebe notificação
    ↓
MAKE.com envia EMAIL com link eBook para cliente
    ↓
MAKE.com envia EMAIL de venda para você
    ↓
Infinity Pay redireciona cliente pra success page
    ↓
Cliente vê: "Seu eBook está pronto!" + email recebido
```

---

## 📋 PASSO 1: CRIAR CONTA NO MAKE.COM (2 min)

### 1.1 Acessar Make.com
```
1. Abra: https://www.make.com
2. Clique em "Sign Up Free" (canto superior direito)
3. Escolha "Sign up with Email"
4. Preencha:
   - Email: seu-email@gmail.com
   - Senha: uma senha forte
   - Country: Brazil
5. Clique "Create Account"
6. Confirme seu email (link no Gmail)
7. Pronto! ✅
```

---

## 🔗 PASSO 2: CRIAR WEBHOOK (Receber Pagamentos) (3 min)

### 2.1 Acessar Scenarios
```
1. No painel do Make.com, clique "Scenarios" (lado esquerdo)
2. Clique "Create a new scenario"
3. Procure por "Webhooks"
4. Clique em "Custom Webhook"
5. Clique "Add"
```

### 2.2 Copiar URL do Webhook
```
1. Você vai ver um campo "Webhook URL" (tipo: https://hook.us1.make.com/abc123...)
2. COPIE ESSA URL (você vai colar no Infinity Pay!)
3. SALVE EM UM BLOCO DE NOTAS
   Exemplo: https://hook.us1.make.com/abc123xyz789

⚠️ IMPORTANTE: Esta URL é a que você vai colocar em:
Infinity Pay → Webhooks → URL do Webhook
```

---

## 📧 PASSO 3: ADICIONAR ENVIO DE EMAIL (5 min)

### 3.1 Adicionar Gmail ao Make.com
```
1. No seu scenario, clique "+" (add module)
2. Procure por "Gmail"
3. Clique "Send an Email"
4. Clique "Add"
5. Clique "Create a new connection"
6. Uma aba abrirá (Gmail login)
7. Fça login com seu Gmail
8. Autorize o Make.com
9. Voltará ao Make.com
```

### 3.2 Configurar Email para Cliente
```
1. Dentro de "Send an Email", preencha:

TO: {{2.customerEmail}}
(Este campo vem do webhook do Infinity Pay)

SUBJECT: ✅ {{2.productName}} - Seu eBook está pronto!

MESSAGE:
───────────────────────────────────────

Olá {{2.customerName}},

Obrigado pela sua compra! 🎉

Seu pagamento foi confirmado com sucesso! ✓

📚 ACESSE SEU EBOOK:
[clique aqui](https://seu-dominio.com/payment-success.html?orderId={{2.orderId}})

Seu ID de Pedido: {{2.orderId}}
Salve este ID para recuperar acesso depois.

Qualquer dúvida, entre em contato conosco!

Abraços,
Dr. José Sousa
───────────────────────────────────────

2. Clique "OK" ou "Continue"
```

### 3.3 Adicionar 2º Email (Para Você)
```
1. Clique "+" novamente
2. Procure "Gmail"
3. Clique "Send an Email"
4. Preencha:

TO: seu-email@gmail.com

SUBJECT: 💰 NOVA VENDA - {{2.productName}}

MESSAGE:
───────────────────────────────────────

Olá Dr. José,

Uma nova venda foi registrada!

📌 DADOS DO CLIENTE:
• Nome: {{2.customerName}}
• Email: {{2.customerEmail}}
• Telefone: {{2.customerPhone}}

💳 VALOR: R$ {{2.price}}
📦 PRODUTO: {{2.productName}}
🆔 PEDIDO: {{2.orderId}}

Cliente já foi notificado via email com link do eBook!

Abraços,
Sistema de Vendas
───────────────────────────────────────

2. Clique "OK"
```

---

## ⚙️ PASSO 4: CONFIGURAR INFINITY PAY (2 min)

### 4.1 Copiar URL do Webhook do Make.com
```
Você já copiou no PASSO 2, certo? (https://hook.us1.make.com/abc123...)
Se não copiou:
1. Volte pro Make.com
2. Clique seu scenario
3. Vá até "Webhooks"
4. COPIE a URL
```

### 4.2 Colar em Infinity Pay
```
1. Abra seu painel Infinity Pay
2. Vá em "Webhooks" ou "Integrações"
3. Procure por "URL do Webhook"
4. COLE: https://hook.us1.make.com/abc123...
5. Em "Eventos", marque: "payment.confirmed"
6. Clique "Salvar"
```

### 4.3 Configurar Redirecionamento
```
1. Em Infinity Pay, procure "Redirecionar após pagamento?"
2. ATIVE o toggle
3. Cole a URL de sucesso:
   https://seu-dominio.com/payment-success.html?orderId={order_id}

⚠️ Substitua "seu-dominio.com" pelo domínio do cliente!

Exemplo completo:
   https://drdossouafisio.com/payment-success.html?orderId={order_id}
```

---

## 🧪 PASSO 5: TESTAR TUDO (5 min)

### 5.1 Teste do Make.com
```
1. No Make.com, clique o botão "Test" (em cada módulo)
2. Verifique se os emails saem corretamente
3. Se der erro, verifique os campos {{2.xxx}}
```

### 5.2 Teste Completo (Simulado)
```
1. Abra seu site
2. Clique "Comprar agora" em um eBook
3. Preencha o formulário:
   Nome: João Silva
   Email: seu-email-test@gmail.com
   Telefone: (89) 99999-9999
4. Clique "Pagar com Infinity Pay"
5. Simule um pagamento no Infinity Pay
6. Você deve ser redirecionado pra success page ✅
7. Verifique seu email (test@gmail.com) - deve ter recebido! ✅
8. Verifique seu email principal - deve ter notificação de venda ✅
```

---

## 🔍 DADOS QUE INFINITY PAY ENVIA

Quando cliente paga, Infinity Pay envia esses dados pro Make.com:

```json
{
  "event": "payment.confirmed",
  "orderId": "ORD-1234567890",
  "amount": 67.00,
  "customerEmail": "joao@email.com",
  "customerName": "João Silva",
  "customerPhone": "(89) 99999-9999",
  "productId": "pilates-kids",
  "productName": "Pilates Kids – Guia Prático",
  "timestamp": "2026-01-26T10:30:00Z"
}
```

No Make.com você acessa com:
- `{{2.orderId}}`
- `{{2.customerEmail}}`
- `{{2.customerName}}`
- `{{2.customerPhone}}`
- `{{2.productName}}`
- `{{2.price}}`

---

## ❓ TROUBLESHOOTING

### Email não chegou?
```
1. Verifique spam/lixo
2. No Make.com, clique "History" pra ver se webhook foi recebido
3. Se tiver erro, verifique os campos {{2.xxx}}
4. Teste manualmente: clique "Test" no módulo de email
```

### Webhook não foi acionado?
```
1. Verifique se está habilitado em Infinity Pay
2. Faça um teste de pagamento real
3. Verifique "History" do Make.com
4. Se ainda não funcionar, teste a URL do webhook em um curl
```

### Cliente não foi redirecionado pra success page?
```
1. Verifique a URL no Infinity Pay
2. Coloque exatamente: https://seu-dominio.com/payment-success.html?orderId={order_id}
3. Teste com um pagamento simulado
```

---

## ✅ CHECKLIST FINAL

- [ ] Conta Make.com criada
- [ ] Webhook criado (URL copiada)
- [ ] Gmail conectado ao Make.com
- [ ] 2 Emails configurados (cliente + você)
- [ ] Webhook URL colada em Infinity Pay
- [ ] Redirecionamento configurado em Infinity Pay
- [ ] Teste de pagamento feito
- [ ] Emails recebidos corretamente
- [ ] Cliente redirecionado pra success page ✅

---

## 🎯 CONCLUSÃO

Agora quando cliente clica "Comprar agora":

1. ✅ Preenche dados de checkout
2. ✅ Clica "Pagar com Infinity Pay"
3. ✅ Confirma pagamento
4. ✅ **AUTOMATICAMENTE recebe email com eBook**
5. ✅ **AUTOMATICAMENTE você recebe notificação de venda**
6. ✅ É redirecionado pra página de sucesso
7. ✅ Clica link no email → acessa eBook no Google Drive

**SISTEMA FUNCIONANDO 100%! 🚀**

---

**Desenvolvido por DUOTECH**
Data: 26 de Janeiro de 2026
