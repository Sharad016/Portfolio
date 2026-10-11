
function jsonResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

export async function onRequestPost({ request, env }) {
  // Accept submissions only from this website's origin.
  const origin = request.headers.get("Origin");

  if (!origin || origin !== new URL(request.url).origin) {
    return jsonResponse({ error: "Invalid request origin." }, 403);
  }

  if (!request.headers.get("Content-Type")?.includes("application/json")) {
    return jsonResponse({ error: "Expected JSON." }, 415);
  }

  const length = Number(request.headers.get("Content-Length") || 0);

  if (length > 12000) {
    return jsonResponse({ error: "Message is too large." }, 413);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }

  // Hidden honeypot field for basic bot detection.
  if (cleanText(body.website, 200)) {
    return jsonResponse({ success: true });
  }

  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254);
  const message = cleanText(body.message, 5000);

  if (!name || !email || !message) {
    return jsonResponse({ error: "All fields are required." }, 400);
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    /[\r\n]/.test(email)
  ) {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }

  if (name.length < 2 || message.length < 5) {
    return jsonResponse({ error: "Please enter a longer name and message." }, 400);
  }

  if (!env.DB || !env.RESEND_API_KEY ||
      !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return jsonResponse({ error: "Contact service is not configured." }, 500);
  }

  // Save first so an email delivery problem won't lose the message.
  try {
    await env.DB.prepare(
      `INSERT INTO contact_messages (name, email, message)
       VALUES (?, ?, ?)`
    ).bind(name, email, message).run();
  } catch (error) {
    console.error("D1 insert failed:", error);
    return jsonResponse({ error: "Could not save your message." }, 500);
  }

  // Send notification through Resend.
  try {
    const emailResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL,
          to: [env.CONTACT_TO_EMAIL],
          reply_to: email,
          subject: `Portfolio contact from ${name}`,
          text:
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`,
          html:
            `<h2>New portfolio contact</h2>` +
            `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
            `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
            `<p><strong>Message:</strong><br>` +
            `${escapeHtml(message).replace(/\n/g, "<br>")}</p>`
        })
      }
    );

    if (!emailResponse.ok) {
      console.error("Resend rejected email:", emailResponse.status);
      return jsonResponse({
        success: true,
        notificationSent: false
      });
    }

    return jsonResponse({
      success: true,
      notificationSent: true
    });

  } catch (error) {
    console.error("Email delivery request failed:", error);

    // The database insert already succeeded.
    return jsonResponse({
      success: true,
      notificationSent: false
    });
  }
}

// Reject methods other than POST.
export async function onRequest({ request }) {
  return jsonResponse(
    { error: "Method not allowed." },
    405
  );
}
