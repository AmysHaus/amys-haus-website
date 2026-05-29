// api/intake.js
// Handles discovery call intake questionnaire submissions
// Sends lead summary to Amy, confirmation to prospect

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
  } = req.body;

  if (!businessName || !contactName || !contactEmail || !painPoints) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const fieldRow = (label, value) => value ? `
    <tr>
      <td style="padding:0.6rem 0;border-bottom:1px solid rgba(86,52,51,0.1);font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:#563433;opacity:0.5;width:160px;vertical-align:top;">${label}</td>
      <td style="padding:0.6rem 0;border-bottom:1px solid rgba(86,52,51,0.1);font-size:0.95rem;color:#1A1A1A;line-height:1.6;">${value}</td>
    </tr>` : '';

  try {
    // 1. Lead notification to Amy
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Amy's Haus <hello@amys-haus.com>",
        to: ['amy@amys-haus.com'],
        subject: `New Discovery Call Lead — ${businessName}`,
        html: `
          <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:2rem;background:#F5F0EA;color:#1A1A1A;">
            <p style="font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#563433;opacity:0.5;margin-bottom:1.5rem;">Amy's Haus · New Lead</p>
            <h1 style="font-size:1.75rem;font-weight:300;color:#563433;margin-bottom:0.5rem;">Discovery Call Request</h1>
            <p style="font-size:0.95rem;color:#5a4a48;margin-bottom:2rem;font-style:italic;">${businessName}</p>

            <p style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#563433;opacity:0.4;margin-bottom:0.75rem;">Contact</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:2rem;">
              ${fieldRow('Name', contactName)}
              ${fieldRow('Email', `<a href="mailto:${contactEmail}" style="color:#563433;">${contactEmail}</a>`)}
              ${fieldRow('Phone', contactPhone ? `<a href="tel:${contactPhone}" style="color:#563433;">${contactPhone}</a>` : null)}
            </table>

            <p style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#563433;opacity:0.4;margin-bottom:0.75rem;">About the Business</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:2rem;">
              ${fieldRow('Business Name', businessName)}
              ${fieldRow('Location', location)}
              ${fieldRow('Property Type', propertyType)}
              ${fieldRow('Years Operating', yearsOperating)}
            </table>

            <p style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#563433;opacity:0.4;margin-bottom:0.75rem;">The Challenge</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:2rem;">
              ${fieldRow('Pain Points', painPoints)}
              ${fieldRow('What a Win Looks Like', winLooksLike)}
            </table>

            <p style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#563433;opacity:0.4;margin-bottom:0.75rem;">Practical</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:2rem;">
              ${fieldRow('Budget', budget)}
              ${fieldRow('Timeline', timeline)}
              ${fieldRow('How They Heard', howHeard)}
            </table>

            <hr style="border:none;border-top:1px solid rgba(86,52,51,0.15);margin:2rem 0;">
            <p style="font-size:0.75rem;color:#5a4a48;opacity:0.5;">Amy's Haus · amys-haus.com</p>
          </div>
        `,
      }),
    });

    // 2. Confirmation to prospect
    await fetch('https://api.resend.com/emails', {
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
            <h1 style="font-size:2rem;font-weight:300;color:#563433;margin-bottom:1rem;line-height:1.2;">Hi ${contactName},</h1>
            <p style="font-size:1rem;line-height:1.8;color:#5a4a48;margin-bottom:1.5rem;">
              Thank you for reaching out. We've received your inquiry about ${businessName} and will be in touch shortly to schedule your discovery call.
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

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
