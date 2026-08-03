# 🔗 Como Configurar o Link do Infinity Pay

## Passo a Passo - Fácil e Rápido

### 1️⃣ Obtenha o Link do Infinity Pay

No seu painel do Infinity Pay:
1. Acesse sua conta em `https://infinitypay.io`
2. Vá em "Configurações" ou "Links de Pagamento"
3. Crie um novo link de pagamento
4. Configure as opções de pagamento (PIX, Cartão de Crédito, Débito)
5. **Copie o link completo** (exemplo: `https://infinitypay.io/...[link-longo]...`)

---

### 2️⃣ Abra o Arquivo `script.js`

Procure pela função `proceedToPayment()` (por volta da linha 844):

```javascript
function proceedToPayment() {
    // ... código aqui ...
    
    // 👇 PROCURE ESTA LINHA:
    const infinityPayLink = `https://infinitypay.io/checkout?amount=${price}&description=${encodeURIComponent(productName)}&orderId=${order.orderId}`;
    
    // ... código continua ...
}
```

---

### 3️⃣ Substitua a Linha

**REMOVA** esta linha:
```javascript
const infinityPayLink = `https://infinitypay.io/checkout?amount=${price}&description=${encodeURIComponent(productName)}&orderId=${order.orderId}`;
```

**COLOQUE** no lugar:
```javascript
const infinityPayLink = 'https://seu-link-infinity-pay-aqui.com';
```

Onde `https://seu-link-infinity-pay-aqui.com` é o seu link real do Infinity Pay.

---

### 4️⃣ Exemplo Real

Se seu link do Infinity Pay for:
```
https://infinitypay.io/pay/abc123def456ghi789
```

O código ficaria assim:
```javascript
const infinityPayLink = 'https://infinitypay.io/pay/abc123def456ghi789';
```

---

### 5️⃣ Salve o Arquivo

- Pressione `Ctrl+S` (ou `Cmd+S` no Mac)
- Ou use "Arquivo" > "Salvar"

---

### 6️⃣ Teste Localmente

1. Abra o seu site em um navegador
2. Clique em "Comprar agora" em qualquer eBook
3. O modal de confirmação deve aparecer
4. Clique em "Confirmar e Pagar"
5. Você deve ser redirecionado para o Infinity Pay

---

## ✅ Testando o Pagamento

### Em Ambiente de Desenvolvimento

Se o Infinity Pay oferece modo de teste/sandbox:
1. Use o link de teste primeiro
2. Faça um pagamento de teste
3. Confirme que funcionou
4. Depois substitua pelo link real

### Em Produção

Quando estiver tudo funcionando:
1. Substitua pelo link real do Infinity Pay
2. Teste novamente com uma compra real
3. Acompanhe as transações no painel do Infinity Pay

---

## ❓ Dúvidas Frequentes

### P: Onde encontro o link do Infinity Pay?
**R**: No seu painel em `infinitypay.io` > Configurações > Links de Pagamento

### P: Qual é a diferença entre link de teste e link real?
**R**: Link de teste = não cobra realmente; Link real = cobra mesmo

### P: Preciso colocar mais código?
**R**: Não! É só trocar essa uma linha mesmo 😊

### P: E se errar o link?
**R**: Sem problema! Clique em "Cancelar" no modal e tenta novamente

### P: Os dados do cliente são seguros?
**R**: Sim! Ele nunca sai do Infinity Pay. Seu site não recebe dados do cartão.

---

## 🔒 Segurança

### Por que funciona assim?

1. Cliente clica "Comprar"
2. Modal mostra resumo (sem dados sensíveis)
3. Cliente clica "Confirmar e Pagar"
4. **Redireciona para Infinity Pay** (seguro deles)
5. Infinity Pay trata do cartão/PIX
6. Infinity Pay envia notificação de sucesso

### Seus dados ficam seguros porque:
- ✅ Você nunca acessa dados de cartão
- ✅ O browser nunca envia dados do cartão
- ✅ Apenas redirecionamos para a Infinity Pay
- ✅ A Infinity Pay é certificada PCI-DSS (segura)

---

## 📋 Checklist de Configuração

- ⬜ Criei conta no Infinity Pay
- ⬜ Copiei o link de pagamento do Infinity Pay
- ⬜ Abri o arquivo `script.js` no VS Code
- ⬜ Procurei pela função `proceedToPayment()`
- ⬜ Substitui o link na linha `const infinityPayLink = ...`
- ⬜ Salvei o arquivo (Ctrl+S)
- ⬜ Testei clicando em "Comprar agora"
- ⬜ Modal apareceu corretamente
- ⬜ Cliquei em "Confirmar e Pagar"
- ⬜ Fui redirecionado para Infinity Pay
- ⬜ Tudo funcionou! 🎉

---

## 📍 Localização Exata do Código

**Arquivo**: `script.js`

**Função**: `proceedToPayment()` (linha ~844)

**Linha a Alterar**: `const infinityPayLink = ...`

```javascript
// Procure por este trecho no script.js:

function proceedToPayment() {
    const { productId, productName, price } = currentPaymentData;
    
    // ... validações ...
    
    // 👇 LINHA A ALTERAR ESTÁ AQUI:
    const infinityPayLink = `https://infinitypay.io/checkout?amount=${price}&description=${encodeURIComponent(productName)}&orderId=${order.orderId}`;
    
    closePaymentModal();
    
    // ... resto do código ...
}
```

---

## 🚀 Pronto!

Depois de fazer essas mudanças, seu site estará:
- ✅ Pronto para receber pagamentos
- ✅ Seguro para o cliente
- ✅ Integrado com Infinity Pay
- ✅ Funcionando perfeitamente

**Qualquer dúvida, veja os arquivos:**
- `MELHORIAS.md` - Resumo completo das alterações
- `INFINITY_PAY_SETUP.md` - Guia técnico detalhado

---

**Desenvolvido com ❤️ por DUOTECH**  
Data: 26 de Janeiro de 2026
