// Simple email webhook server example
// Usage: set SMTP settings in environment variables below, then run: node email_webhook_server.js
// This server accepts POST /send with JSON { to, subject, text } and sends an email using Nodemailer.

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Configure SMTP using environment variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

if(!SMTP_HOST || !SMTP_USER || !SMTP_PASS){
  console.warn('Warning: SMTP credentials not fully configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars.');
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT==465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

app.post('/send', async (req, res) => {
  const { to, subject, text } = req.body || {};
  if(!to || !subject || !text) return res.status(400).json({ error: 'to, subject and text are required' });
  try{
    const info = await transporter.sendMail({ from: FROM_EMAIL, to, subject, text });
    console.log('Email sent', info.messageId);
    res.json({ ok: true, messageId: info.messageId });
  }catch(err){
    console.error('Failed to send email', err);
    res.status(500).json({ error: 'failed to send', details: err.message || String(err) });
  }
});

app.get('/', (req,res)=> res.send('K9 email webhook server running'));

app.listen(PORT, ()=> console.log('Email webhook server listening on port', PORT));
