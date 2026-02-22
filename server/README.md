# Infinity Pay webhook server

Pequeno servidor Node.js (Express) que recebe webhooks da Infinity Pay, atualiza um arquivo `orders.json` e envia e-mails de confirmação ao cliente e ao dono do site.

Instalação e execução:

1. Abra o terminal na pasta `server`:

```bash
cd server
```

2. Instale dependências:

```bash
npm install
```

3. Crie um arquivo `.env` a partir do `.env.example` e configure as variáveis necessárias:

```text
PORT=3000
INFINITY_PAY_WEBHOOK_SECRET=seu_secret_opcional
SENDGRID_API_KEY=seu_sendgrid_api_key   # ou configure SMTP_*
FROM_EMAIL="Seu Nome <contato@seudominio.com>"
OWNER_EMAIL=suporte@seudominio.com
```

4. Inicie o servidor:

```bash
npm start
```

5. Na plataforma Infinity Pay, configure o webhook apontando para:

```
https://SEU-DOMINIO.com/webhook/infinitypay
```

Se você configurou `INFINITY_PAY_WEBHOOK_SECRET`, configure a mesma chave na Infinity Pay para que o header `x-infinitypay-signature` contenha o HMAC-SHA256 do body com essa chave.

Observações:
- O servidor grava pedidos em `orders.json`.
- Envio de e-mail: suporta SendGrid (via `SENDGRID_API_KEY`) ou SMTP (via `SMTP_HOST`, `SMTP_USER`, etc.). Se nenhum configurado, o servidor apenas grava o pedido.
- Ajuste o mapeamento `products` em `server.js` caso altere IDs/links nos arquivos do site.
