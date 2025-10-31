const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function generateLicenseKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = 4;
  const segmentLength = 4;
  
  let key = 'HTJ-';
  
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segmentLength; j++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    if (i < segments - 1) key += '-';
  }
  
  return key;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, email } = req.body;

  if (!sessionId || !email) {
    return res.status(400).json({ error: 'Session ID and email are required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const licenseKey = generateLicenseKey();

    res.status(200).json({
      success: true,
      licenseKey: licenseKey
    });
  } catch (error) {
    console.error('License generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate license',
      details: error.message 
    });
  }
}
```

4. Commit message: `Add license generation API`
5. Click **"Commit new file"**

---

## ✅ Final Result on GitHub:

Your repository structure will look like:
```
health-tracker-pro/
├── api/                           ← NEW!
│   ├── create-stripe-checkout.js  ← NEW!
│   ├── create-paypal-order.js     ← NEW!
│   ├── capture-paypal-payment.js  ← NEW!
│   └── generate-license.js        ← NEW!
├── public/
├── src/
├── package.json
└── ...
