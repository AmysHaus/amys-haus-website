// api/intake.js
// Handles discovery call intake questionnaire submissions
// Sends lead summary to Amy, confirmation to prospect

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Only accept JSON bodies of a sane size
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  if (JSON.stringify(body).length > 40000) {
    return res.status(413).json({ error: 'Request too large' });
  }

  const {
    businessName,
    location,
    propertyType,
    yearsOperating,
    painPoints,
    winLooksLike,
    budget,
    timeline,
    howHeard,
    contactName,
    contactEmail,
    contactPhone,
    turnstileToken,
    website, // honeypot — real users never fill this in
  } = body;

  // Silently accept bots that fill the hidden field
  if (website) return res.status(200).json({ success: true });

  // Every submitted field must be a string
  for (const v of [businessName, location, propertyType, yearsOperating, painPoints, winLooksLike, budget, timeline, howHeard, contactName, contactEmail, contactPhone, turnstileToken]) {
    if (v !== undefined && v !== null && typeof v !== 'string') {
      return res.status(400).json({ error: 'Invalid request' });
    }
  }

  if (!businessName || !contactName || !contactEmail || !painPoints) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Basic validation — the confirmation email goes to whatever address is submitted
  const emailOk = typeof contactEmail === 'string' && contactEmail.length <= 254 && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(contactEmail);
  if (!emailOk) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Escape everything that is interpolated into HTML emails
  const esc = (v) => String(v ?? '').slice(0, 5000)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const safe = {
    businessName: esc(businessName), location: esc(location), propertyType: esc(propertyType),
    yearsOperating: esc(yearsOperating), painPoints: esc(painPoints), winLooksLike: esc(winLooksLike),
    budget: esc(budget), timeline: esc(timeline), howHeard: esc(howHeard),
    contactName: esc(contactName), contactEmail: esc(contactEmail), contactPhone: esc(contactPhone),
  };
  // Subject lines are plain text — strip line breaks to prevent header tricks
  const subjectBiz = String(businessName).replace(/[\r\n]+/g, ' ').slice(0, 120);

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

  // Verify Turnstile token
  if (!turnstileToken || !TURNSTILE_SECRET || !RESEND_API_KEY) {
    return res.status(400).json({ error: 'Verification failed. Please try again.' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  let verificationData = {};
  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: TURNSTILE_SECRET, response: turnstileToken, ...(ip && { remoteip: ip }) }),
    });
    verificationData = await verification.json();
  } catch (e) {
    return res.status(502).json({ error: 'Verification unavailable. Please try again.' });
  }
  if (!verificationData.success) {
    return res.status(400).json({ error: 'Verification failed. Please try again.' });
  }

  const fieldRow = (label, value) => value ? `
    <tr>
      <td style="padding:0.6rem 0;border-bottom:1px solid rgba(86,52,51,0.1);font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:#563433;opacity:0.5;width:160px;vertical-align:top;">${label}</td>
      <td style="padding:0.6rem 0;border-bottom:1px solid rgba(86,52,51,0.1);font-size:0.95rem;color:#1A1A1A;line-height:1.6;">${value}</td>
    </tr>` : '';

  let r;
  try {
    // 1. Lead notification to Amy
    r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Amy's Haus <hello@amys-haus.com>",
        to: ['amy@amys-haus.com'],
        subject: `New Discovery Call Lead — ${subjectBiz}`,
        html: `
          <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:2rem;background:#F5F0EA;color:#1A1A1A;">
            <p style="font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#563433;opacity:0.5;margin-bottom:1.5rem;">Amy's Haus · New Lead</p>
            <h1 style="font-size:1.75rem;font-weight:300;color:#563433;margin-bottom:0.5rem;">Discovery Call Request</h1>
            <p style="font-size:0.95rem;color:#5a4a48;margin-bottom:2rem;font-style:italic;">${safe.businessName}</p>

            <p style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#563433;opacity:0.4;margin-bottom:0.75rem;">Contact</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:2rem;">
              ${fieldRow('Name', safe.contactName)}
              ${fieldRow('Email', `<a href="mailto:${safe.contactEmail}" style="color:#563433;">${safe.contactEmail}</a>`)}
              ${fieldRow('Phone', safe.contactPhone ? `<a href="tel:${safe.contactPhone}" style="color:#563433;">${safe.contactPhone}</a>` : null)}
            </table>

            <p style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#563433;opacity:0.4;margin-bottom:0.75rem;">About the Business</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:2rem;">
              ${fieldRow('Business Name', safe.businessName)}
              ${fieldRow('Location', safe.location)}
              ${fieldRow('Property Type', safe.propertyType)}
              ${fieldRow('Years Operating', safe.yearsOperating)}
            </table>

            <p style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#563433;opacity:0.4;margin-bottom:0.75rem;">The Challenge</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:2rem;">
              ${fieldRow('Pain Points', safe.painPoints)}
              ${fieldRow('What a Win Looks Like', safe.winLooksLike)}
            </table>

            <p style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#563433;opacity:0.4;margin-bottom:0.75rem;">Practical</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:2rem;">
              ${fieldRow('Budget', safe.budget)}
              ${fieldRow('Timeline', safe.timeline)}
              ${fieldRow('How They Heard', safe.howHeard)}
            </table>

            <hr style="border:none;border-top:1px solid rgba(86,52,51,0.15);margin:2rem 0;">
            <p style="font-size:0.75rem;color:#5a4a48;opacity:0.5;">Amy's Haus · amys-haus.com</p>
          </div>
        `,
      }),
    });

    if (!r.ok) throw new Error('Resend lead email failed: ' + r.status);

    // 2. Confirmation to prospect
    r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Amy's Haus <hello@amys-haus.com>",
        to: [contactEmail],
        subject: "We've received your inquiry — Amy's Haus",
        html: `
          <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;padding:2rem;background:#F5F0EA;color:#1A1A1A;">
            <p style="font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#563433;opacity:0.5;margin-bottom:1.5rem;">Amy's Haus</p>
            <h1 style="font-size:2rem;font-weight:300;color:#563433;margin-bottom:1rem;line-height:1.2;">Hi ${safe.contactName},</h1>
            <p style="font-size:1rem;line-height:1.8;color:#5a4a48;margin-bottom:1.5rem;">
              Thank you for reaching out. We've received your inquiry about ${safe.businessName} and will be in touch shortly to schedule your discovery call.
            </p>
            <p style="font-size:1rem;line-height:1.8;color:#5a4a48;margin-bottom:1.5rem;">
              In the meantime, if you have any questions feel free to reply directly to this email.
            </p>
            <p style="font-size:1rem;line-height:1.8;color:#5a4a48;">Warm regards,</p>
            <p style="font-size:1rem;font-style:italic;color:#563433;">Amy</p>
            <hr style="border:none;border-top:1px solid rgba(86,52,51,0.15);margin:2rem 0;">
            <p style="font-size:0.75rem;color:#5a4a48;opacity:0.5;">Amy's Haus · Nashville, TN · amys-haus.com</p>
          </div>
        `,
      }),
    });

    // Lead already delivered to Amy; a failed confirmation shouldn't fail the submission
    if (!r.ok) console.error('Resend confirmation failed:', r.status);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
