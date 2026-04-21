import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CertificateRequestPayload {
  request_id: string;
  full_name: string;
  email: string;
  sport: string;
  certificate_id?: string;
  request_type: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: CertificateRequestPayload = await req.json();
    const { request_id, full_name, email, sport, certificate_id, request_type } = body;

    if (!full_name || !email || !sport || !request_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (request_id) {
      await supabase
        .from("certificate_requests")
        .update({ status: "processing" })
        .eq("id", request_id);
    }

    const requestTypeLabel = request_type === "renewal" ? "Renewal" : "Replacement";
    const referenceNumber = `REF-${Date.now().toString(36).toUpperCase()}`;

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificate ${requestTypeLabel} Request Received</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f4c1a 0%,#1a6b28 60%,#c8a400 100%);padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.12);border:2px solid rgba(255,255,255,0.3);border-radius:50%;width:64px;height:64px;line-height:64px;font-size:30px;margin-bottom:16px;">🏅</div>
              <h1 style="color:#ffffff;margin:0 0 6px 0;font-size:22px;font-weight:700;letter-spacing:0.5px;">African Sports Mini Games</h1>
              <p style="color:#d4edda;margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Certificate ${requestTypeLabel} Portal</p>
            </td>
          </tr>

          <!-- Official Stamp Band -->
          <tr>
            <td style="background:#c8a400;padding:10px 40px;text-align:center;">
              <p style="margin:0;color:#1a1a00;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Official Communication — ASMG Certificate Registry</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px 0;">Dear <strong>${full_name}</strong>,</p>
              <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
                We have received your certificate <strong>${requestTypeLabel.toLowerCase()}</strong> request for
                <strong>${sport}</strong>. Our registry team will review and process your request within
                <strong>3–5 business days</strong>.
              </p>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0;font-size:13px;font-weight:700;color:#0f4c1a;letter-spacing:1px;text-transform:uppercase;">Request Summary</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#6b7280;font-size:13px;width:45%;">Reference Number</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#111827;font-size:13px;font-family:monospace;font-weight:700;">${referenceNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#6b7280;font-size:13px;">Full Name</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#111827;font-size:13px;font-weight:600;">${full_name}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#6b7280;font-size:13px;">Sport</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#111827;font-size:13px;font-weight:600;">${sport}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#6b7280;font-size:13px;">Request Type</td>
                        <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#111827;font-size:13px;font-weight:600;">${requestTypeLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#6b7280;font-size:13px;">Certificate ID</td>
                        <td style="padding:8px 0;color:#111827;font-size:13px;font-weight:600;font-family:monospace;">${certificate_id || "Not provided"}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#0f4c1a;letter-spacing:1px;text-transform:uppercase;">What Happens Next</p>
              <ol style="margin:0 0 28px 0;padding-left:20px;color:#374151;font-size:14px;line-height:1.8;">
                <li>Our registry team reviews your request and verifies your participation records.</li>
                <li>A digital copy of your certificate is generated and signed by ASMG officials.</li>
                <li>Your digital certificate will be emailed to <strong>${email}</strong> within 3–5 business days.</li>
              </ol>

              <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 8px 0;">
                If you have any questions, please contact us at
                <a href="mailto:info@asmgafrica.com" style="color:#0f4c1a;font-weight:600;">info@asmgafrica.com</a>
                and quote your reference number above.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:#374151;font-size:13px;font-weight:700;">African Sports Mini Games — Certificate Registry</p>
              <p style="margin:0;color:#9ca3af;font-size:12px;">Kenyatta University, Nairobi, Kenya &nbsp;|&nbsp; July 25th, 2026</p>
              <p style="margin:8px 0 0 0;color:#d1d5db;font-size:11px;">This is an automated message from the ASMG Certificate Portal. Please do not reply directly.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const [userRes, adminRes] = await Promise.all([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "African Sports Mini Games <onboarding@resend.dev>",
          to: [email],
          cc: ["tawiglobalenrichment@gmail.com"],
          subject: "We have received your application!",
          html: emailHtml,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ASMG Certificate Registry <onboarding@resend.dev>",
          to: ["tawienrichment@gmail.com"],
          subject: `Certificate ${requestTypeLabel} Request: ${full_name} (${sport}) — ${referenceNumber}`,
          html: emailHtml,
        }),
      }),
    ]);

    if (!userRes.ok) {
      const errText = await userRes.text();
      console.error("User confirmation email failed:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to send confirmation email", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!adminRes.ok) {
      const errText = await adminRes.text();
      console.error("Admin notification email failed:", errText);
    }

    if (request_id) {
      await supabase
        .from("certificate_requests")
        .update({ status: "sent" })
        .eq("id", request_id);
    }

    return new Response(
      JSON.stringify({ success: true, reference: referenceNumber }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
