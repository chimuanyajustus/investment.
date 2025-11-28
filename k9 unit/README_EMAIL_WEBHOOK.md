K9 Unit — Email Webhook Example

Overview

This repository includes a simple example Node.js webhook server that accepts POST requests and sends email receipts using SMTP (via Nodemailer).

How it works

1. The dashboard (browser app `2index.html`) can POST a JSON payload to a webhook URL you configure in Settings (`Email (OTP) Webhook`).
2. The example server `email_webhook_server.js` shows how to receive `{ to, subject, text }` and forward it through SMTP.

Run the example server (local)

1. Install Node.js (v14+ recommended) and npm.
2. Install dependencies and run:

```powershell
cd "c:\Users\user\OneDrive\Documents\k9 unit"
npm init -y
npm install express body-parser nodemailer
# set environment variables for your SMTP provider (example for Gmail SMTP or other provider)
$env:SMTP_HOST = 'smtp.example.com'
$env:SMTP_PORT = '587'
$env:SMTP_USER = 'you@example.com'
$env:SMTP_PASS = 'your_smtp_password'
$env:FROM_EMAIL = 'K9 Unit <no-reply@example.com>'
node email_webhook_server.js
```

By default the server listens on port 3000. Configure the dashboard webhook field (Settings) to `http://<your-host>:3000/send` (for local testing `http://localhost:3000/send`).

Security notes

- Do NOT commit your SMTP credentials to source control. Use environment variables as shown.
- For production use, protect the webhook endpoint with authentication (API key, basic auth, or restrict by origin/IP).
- Many email providers require application-specific passwords or OAuth; consult your provider's docs.

Alternative: Email service APIs

You can also point the dashboard webhook to a serverless function (AWS Lambda, Vercel, Netlify) or directly to a transactional email API (SendGrid, Mailgun) if you build a small server endpoint to sign requests and hide API keys.

If you want, I can implement a direct EmailJS (client-side) integration instead — that requires an EmailJS account & client keys and is less secure for production.
