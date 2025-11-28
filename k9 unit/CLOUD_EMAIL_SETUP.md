# Cloud Email Setup for AJA Capital Dashboard

Instead of running a local server, you can use these **free cloud services**:

## Option 1: Formspree (Easiest - 50 free emails/month)

1. Go to https://formspree.io/
2. Sign up with your email
3. Create a new form
4. Copy your endpoint URL (looks like: `https://formspree.io/f/XXXXX`)
5. In Dashboard Settings → Webhook URL, paste: `https://formspree.io/f/XXXXX`
6. Done! Emails will go to your registered email

## Option 2: Discord Webhook (Free, Unlimited)

If you have Discord:

1. Go to your Discord server
2. Right-click channel → Edit Channel → Integrations → Webhooks
3. Click "New Webhook" → copy the URL
4. In Dashboard Settings → Webhook URL, paste the Discord webhook URL
5. Emails will appear as Discord messages

## Option 3: Make.com (formerly Integromat - Free tier)

1. Go to https://www.make.com/
2. Sign up for free
3. Create new scenario:
   - Trigger: Webhooks → Custom webhook
   - Action: Gmail or Outlook (connect your email)
4. Get the webhook URL
5. Paste in Dashboard Settings

## Option 4: Zapier (Free tier limited)

1. Go to https://zapier.com/
2. Create a "Zap"
3. Trigger: Webhooks by Zapier (catch raw hook)
4. Action: Send Email
5. Get webhook URL and paste in Dashboard

## Option 5: Twilio SendGrid (Free tier - 100 emails/day)

1. Go to https://sendgrid.com/
2. Sign up for free
3. Get API key
4. Modify the dashboard to use SendGrid API directly

---

## Quick Test:

1. Copy any webhook URL from above
2. In Dashboard → Settings → "Email Webhook Configuration"
3. Paste the URL
4. Click "Test Email"
5. Check your email/Discord for the test message

**Which service would you prefer to use?**
