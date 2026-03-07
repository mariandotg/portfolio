export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";
import { SITE } from "../../config";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, message, engagement_model, project_type, budget, timeline, _honeypot } = body;

  // Spam check
  if (_honeypot) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validation
  if (!name || !email || !engagement_model || !project_type || !budget || !timeline || !message) {
    return new Response(
      JSON.stringify({ error: "Please complete all required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email address" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: SITE.email,
      reply_to: email,
      subject: `New Contact: ${name} - ${engagement_model}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Engagement Model:</strong> ${engagement_model}</p>
        <p><strong>Project Type:</strong> ${project_type}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Timeline:</strong> ${timeline}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Resend error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send email. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
