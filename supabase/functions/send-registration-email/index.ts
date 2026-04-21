import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RegistrationPayload {
  name: string;
  email: string;
  sport: string;
  ticket_id: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: RegistrationPayload = await req.json();
    const { name, email, sport, ticket_id } = body;

    if (!name || !email || !sport || !ticket_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const welcomeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We have received your application!</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
          <tr>
            <td style="background:linear-gradient(135deg,#0f4c1a 0%,#1a6b28 60%,#c8a400 100%);padding:36px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0 0 6px 0;font-size:24px;font-weight:700;letter-spacing:0.5px;">African Sports Mini Games</h1>
              <p style="color:#d4edda;margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Athlete Registration</p>
            </td>
          </tr>
          <tr>
            <td style="background:#c8a400;padding:10px 40px;text-align:center;">
              <p style="margin:0;color:#1a1a00;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Official Communication — ASMG 2026</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px 0;">Dear <strong>${name}</strong>,</p>
              <p style="color:#374151;font-size:16px;line-height:1.7;margin:0 0 24px 0;">
                Thank you for contacting us. Our team is reviewing your details and will get back to you within 24 hours.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0;font-size:13px;font-weight:700;color:#0f4c1a;letter-spacing:1px;text-transform:uppercase;">Your Registration Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#6b7280;font-size:13px;width:45%;">Ticket ID</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#111827;font-size:13px;font-family:monospace;font-weight:700;">${ticket_id}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#6b7280;font-size:13px;">Athlete Name</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#111827;font-size:13px;font-weight:600;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:13px;">Primary Sport</td>
                        <td style="padding:8px 0;color:#111827;font-size:13px;font-weight:600;">${sport}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="color:#374151;font-size:14px;line-height:1.6;margin:0;">
                Questions? Reach us at
                <a href="mailto:info@asmgafrica.com" style="color:#0f4c1a;font-weight:600;">info@asmgafrica.com</a>
                and quote your Ticket ID above.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:#374151;font-size:13px;font-weight:700;">African Sports Mini Games 2026</p>
              <p style="margin:0;color:#9ca3af;font-size:12px;">Kenyatta University, Nairobi, Kenya &nbsp;|&nbsp; July 25th, 2026</p>
              <p style="margin:8px 0 0 0;color:#d1d5db;font-size:11px;">This is an automated message. Please do not reply directly to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:8px;">
        <div style="background:linear-gradient(135deg,#0f4c1a,#1a6b28);padding:20px;border-radius:8px 8px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;font-size:20px;">New Athlete Registration</h1>
          <p style="color:#d4edda;margin:6px 0 0 0;font-size:13px;">ASMG 2026 — Registration Notification</p>
        </div>
        <div style="padding:24px;background:#f0fdf4;">
          <table style="width:100%;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #bbf7d0;">
              <td style="padding:10px 0;font-weight:bold;color:#14532d;width:40%;">Ticket ID</td>
              <td style="padding:10px 0;color:#1f2937;font-family:monospace;font-weight:bold;">${ticket_id}</td>
            </tr>
            <tr style="border-bottom:1px solid #bbf7d0;">
              <td style="padding:10px 0;font-weight:bold;color:#14532d;">Athlete Name</td>
              <td style="padding:10px 0;color:#1f2937;">${name}</td>
            </tr>
            <tr style="border-bottom:1px solid #bbf7d0;">
              <td style="padding:10px 0;font-weight:bold;color:#14532d;">Email</td>
              <td style="padding:10px 0;color:#1f2937;">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-weight:bold;color:#14532d;">Primary Sport</td>
              <td style="padding:10px 0;color:#1f2937;">${sport}</td>
            </tr>
          </table>
        </div>
        <div style="padding:16px 24px;background:#f9fafb;border-radius:0 0 8px 8px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#6b7280;font-size:13px;">Please follow up with the athlete to confirm their registration spot.</p>
        </div>
      </div>
    `;

    const [welcomeRes, adminRes] = await Promise.all([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "African Sports Mini Games <onboarding@resend.dev>",
          to: [email],
          subject: "We have received your application!",
          html: welcomeHtml,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ASMG Registration <onboarding@resend.dev>",
          to: ["tawienrichment@gmail.com"],
          subject: `New Athlete Registration: ${name} — ${sport} (${ticket_id})`,
          html: adminHtml,
        }),
      }),
    ]);

    if (!welcomeRes.ok) {
      const errText = await welcomeRes.text();
      console.error("Welcome email failed:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to send welcome email", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!adminRes.ok) {
      const errText = await adminRes.text();
      console.error("Admin notification failed:", errText);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
