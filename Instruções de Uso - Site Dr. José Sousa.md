# Instruções de Uso - Site Dr. José Sousa

## Funcionalidades Implementadas

### 1. Seção de Administração e Gestão de Estúdios de Pilates

**Localização:** Seção `#administracao` no site

**Funcionalidades:**
- 6 cards com diferentes aspectos da gestão de estúdios
- Card principal com call-to-action para mentoria
- Botão "Quero acelerar minha carreira com mentoria" que abre WhatsApp com mensagem personalizada

**Como funciona:**
- Ao clicar no botão de mentoria, abre o WhatsApp com uma mensagem pré-formatada
- A mensagem inclui interesse na mentoria e tópicos específicos

### 2. Loja de eBooks

**Localização:** Seção `#ebooks` no site

**Produtos incluídos:**
1. **Pilates Kids – Guia Prático** (R$ 67,00)
2. **Guia de Exercícios de Pilates para Alunos** (R$ 47,00)
3. **Pacote de documentos obrigatório para seu studio** (R$ 87,00)

**Funcionalidades:**
- Cards com capas, descrições e preços
- Badges de destaque (Mais Vendido, Novidade, Essencial)
- Botões "Comprar agora" que abrem WhatsApp com mensagem de interesse
- Garantia de 7 dias destacada

**Como funciona:**
- Cada botão "Comprar agora" abre o WhatsApp com mensagem específica do eBook
- As mensagens incluem o nome do produto e interesse na compra

### 3. Sistema de Email Automático

**Funcionalidades implementadas:**

#### Newsletter
- Formulário de inscrição na seção `#newsletter`
- Coleta de email e envio via WhatsApp para notificação
- Sistema de automação com sequências de email

#### Automação de Emails
- **Sequência de Boas-vindas:**
  - Email imediato de boas-vindas
  - Email com dica após 3 dias
  - Email promocional após 7 dias

- **Sequência Pós-compra:**
  - Confirmação de compra imediata
  - Guia de uso após 1 dia
  - Solicitação de feedback após 7 dias

#### Armazenamento Local
- Dados salvos no localStorage do navegador
- Logs de emails enviados
- Lista de assinantes e compradores

## Navegação Atualizada

A navegação foi atualizada para incluir:
- **Gestão** (link para #administracao)
- **eBooks** (link para #ebooks)

## Arquivos Modificados

### 1. index.html
- Adicionadas seções de administração e eBooks
- Adicionada seção de newsletter
- Navegação atualizada (desktop e mobile)

### 2. styles.css
- Estilos para seção de administração (.pilates-management)
- Estilos para loja de eBooks (.ebooks-store)
- Estilos para newsletter (.newsletter)
- Cards, botões e layouts responsivos

### 3. script.js
- Função `openMentoriaWhatsApp()` para mentoria
- Função `buyEbook(ebookId)` para compra de eBooks
- Função `handleNewsletterSubmit()` para newsletter
- Classe `EmailAutomation` para automação de emails
- Sistema de templates de email
- Armazenamento local de dados

## Como Personalizar

### 1. Links de Compra dos eBooks
No arquivo `script.js`, na função `buyEbook()`, você pode alterar os links para suas páginas de venda reais:

```javascript
const ebookLinks = {
    'pilates-kids': 'https://pay.hotmart.com/seu-link-pilates-kids',
    'exercicios-alunos': 'https://pay.kiwify.com.br/seu-link-exercicios',
    'documentos-studio': 'https://pay.hotmart.com/seu-link-documentos'
};
```

### 2. Integração com Serviços de Email
Para integrar com serviços reais de email marketing, substitua a função `sendEmail()` na classe `EmailAutomation`:

```javascript
// Exemplo para Mailchimp
sendEmail(email, type, emailData) {
    fetch('https://api.mailchimp.com/3.0/campaigns', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer SEU_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // Dados do email
        })
    });
}
```

### 3. Imagens dos eBooks
Adicione as imagens dos eBooks na pasta `src/assets/`:
- `ebook-pilates-kids.jpg`
- `ebook-exercicios-alunos.jpg`
- `ebook-documentos-studio.jpg`

### 4. Analytics
Para rastrear conversões, o código já inclui eventos do Google Analytics:
- `purchase_intent` para intenção de compra
- `newsletter_signup` para inscrição na newsletter

## Próximos Passos Recomendados

1. **Configurar serviço de email real** (Mailchimp, ConvertKit, etc.)
2. **Adicionar as imagens dos eBooks**
3. **Configurar links de pagamento reais**
4. **Implementar Google Analytics**
5. **Testar todas as funcionalidades**
6. **Configurar domínio e hospedagem**

## Suporte

Para dúvidas sobre implementação ou personalização, entre em contato através do WhatsApp configurado no site.

