/**
 * Elite Promotion — Contact form email relay (Google Apps Script).
 *
 * Receives the contact form POST from the website and emails the lead to the
 * agency's Gmail, using the owner's own Google account. Free, no server, no
 * Google Cloud Console / billing required.
 *
 * IMPORTANT: you can deploy this under ANY Google account you control — it does
 * NOT have to be the client's Gmail. The script simply RELAYS each lead by
 * email to whatever address you put in TO_EMAIL below. So you (the developer)
 * can host it on your own Google account and the leads still land in the
 * client's inbox. The client can later re-deploy it under their own account if
 * they want full ownership — only TO_EMAIL / the account changes.
 *
 * ── SETUP (5 minutes) ───────────────────────────────────────────────────────
 * 1. Sign in to ANY Google account you control and open
 *    https://script.google.com  →  "New project".
 * 2. Delete the default code, paste THIS whole file, and set TO_EMAIL below to
 *    the client's address (mar.elitee@gmail.com).
 * 3. Deploy ▸ New deployment ▸ type "Web app".
 *      - Execute as:  Me (your account)
 *      - Who has access:  Anyone
 *    Click Deploy, authorize the permissions when prompted, and COPY the
 *    "Web app URL" (it ends with /exec).
 * 4. Put that URL in the site env var VITE_CONTACT_ENDPOINT (see .env.example),
 *    on Vercel (Project ▸ Settings ▸ Environment Variables) and on the VPS,
 *    then redeploy. Done — the form now emails every demande to TO_EMAIL.
 *
 * Each email's reply-to is the visitor's address, so the client just hits
 * Reply to answer the prospect (even though the relay is your account).
 *
 * If VITE_CONTACT_ENDPOINT is left empty, the form safely falls back to opening
 * a pre-filled WhatsApp message instead, so the site never breaks.
 */

var TO_EMAIL = 'mar.elitee@gmail.com'; // ← agency inbox that receives the leads

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var nom = (data.nom || '').toString().slice(0, 200);
    var subject = 'Nouvelle demande — ' + (data.sujet || 'Contact') + ' — ' + nom;
    var body = [
      'Nouvelle demande depuis le site Elite Promotion Immobilière',
      '',
      'Nom        : ' + (data.nom || ''),
      'Téléphone  : ' + (data.telephone || ''),
      'Email      : ' + (data.email || ''),
      'Sujet      : ' + (data.sujet || ''),
      '',
      'Message :',
      (data.message || ''),
      '',
      '— ' + (data.source || 'site web'),
    ].join('\n');

    MailApp.sendEmail({
      to: TO_EMAIL,
      subject: subject,
      body: body,
      replyTo: (data.email || '').toString() || undefined,
      name: 'Site Elite Promotion',
    });

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Simple GET so you can open the URL in a browser to confirm it's live.
function doGet() {
  return json({ ok: true, service: 'elite-contact-relay' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
