#!/usr/bin/env node
/**
 * AJA Capital Email Webhook Server
 * 
 * This server receives email requests from the dashboard and sends them via SMTP.
 * 
 * Usage:
 *   1. npm install express body-parser nodemailer
 *   2. Configure SMTP (Gmail, Outlook, or any SMTP provider)
 *   3. Run: node webhook-server.js
 * 
 * Gmail Setup (Recommended):
 *   - Enable 2FA on your Google account
 *   - Generate App Password: https://support.google.com/accounts/answer/185833
 *   - Set environment variables:
 *     SMTP_HOST=smtp.gmail.com
 *     SMTP_PORT=587
 *     SMTP_USER=your-email@gmail.com
 *     SMTP_PASS=your-16-char-app-password
 * 
 * Outlook Setup:
 *   SMTP_HOST=smtp-mail.outlook.com
 *   SMTP_PORT=587
 *   SMTP_USER=your-email@outlook.com
 *   SMTP_PASS=your-password
 */

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// SMTP Configuration from Environment Variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

// Validate configuration
if (!SMTP_USER || !SMTP_PASS) {
  console.error('\n❌ SMTP credentials not configured!\n');
  console.log('Set these environment variables:\n');
  console.log('  SMTP_HOST=smtp.gmail.com');
  console.log('  SMTP_USER=your-email@gmail.com');
  console.log('  SMTP_PASS=your-app-password');
  console.log('  PORT=3000 (optional)\n');
  console.log('Example (PowerShell):');
  console.log('  $env:SMTP_HOST="smtp.gmail.com"; $env:SMTP_USER="test@gmail.com"; $env:SMTP_PASS="abcd efgh ijkl mnop"; node webhook-server.js\n');
  process.exit(1);
}

console.log('📧 Initializing Email Webhook Server...');
console.log(`   SMTP Host: ${SMTP_HOST}:${SMTP_PORT}`);
console.log(`   From: ${FROM_EMAIL}\n`);

// Create mail transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'running', 
    message: 'AJA Capital Email Webhook Server',
    endpoint: '/send',
    methods: ['POST']
  });
});

// Main email sending endpoint
app.post('/send', async (req, res) => {
  const { to, subject, text } = req.body || {};
  
  // Validate input
  if (!to || !subject || !text) {
    return res.status(400).json({ 
      error: 'Missing required fields', 
      required: ['to', 'subject', 'text'],
      received: Object.keys(req.body || {})
    });
  }
  
  try {
    console.log(`📤 Sending email to: ${to}`);
    console.log(`   Subject: ${subject}`);
    
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: `<pre style="font-family: monospace; white-space: pre-wrap;">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`
    });
    
    console.log(`✅ Email sent! ID: ${info.messageId}`);
    res.json({ 
      ok: true, 
      messageId: info.messageId,
      message: 'Email sent successfully'
    });
  } catch (err) {
    console.error(`❌ Failed to send email: ${err.message}`);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: err.message,
      hint: 'Check SMTP credentials and ensure Less Secure Apps is enabled for Gmail'
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Server error', details: err.message });
});

// Start server
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:');
    console.error(error.message);
    console.log('\nTroubleshooting:');
    console.log('  1. Verify SMTP credentials');
    console.log('  2. For Gmail: Use 16-char App Password (not regular password)');
    console.log('  3. Ensure firewall allows port 587 outbound\n');
    process.exit(1);
  } else {
    console.log('✅ SMTP connection verified!\n');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📍 Webhook endpoint: http://localhost:${PORT}/send\n`);
      console.log('Ready to receive emails from AJA Capital Dashboard!\n');
    });
  }
});
