import nodemailer, { type Transporter } from 'nodemailer';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured = false;
  private adminEmail = process.env.CONTACT_EMAIL || process.env.NOTIFICATION_EMAIL || 'mesapamharsha@gmail.com';

  constructor() {
    this.init();
  }

  private init() {
    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD;
    const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 587;

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });
        this.isConfigured = true;
        console.log('[EmailService] SMTP Transporter configured successfully for', user);
      } catch (err) {
        console.warn('[EmailService] Failed to initialize SMTP:', err);
        this.isConfigured = false;
      }
    } else {
      console.log('[EmailService] SMTP credentials not fully provided; notifications will be logged to console.');
      this.isConfigured = false;
    }
  }

  public async sendMail(payload: EmailPayload): Promise<{ success: boolean; preview?: boolean }> {
    console.log(`\n================== [LEOX EMAIL NOTIFICATION] ==================`);
    console.log(`TO: ${payload.to}`);
    console.log(`SUBJECT: ${payload.subject}`);
    console.log(`TIMESTAMP: ${new Date().toISOString()}`);
    console.log(`===============================================================\n`);

    if (!this.isConfigured || !this.transporter) {
      return { success: true, preview: true };
    }

    try {
      const fromAddress = process.env.SMTP_USER || process.env.EMAIL_USER || this.adminEmail;
      await this.transporter.sendMail({
        from: `"LEOX Productions" <${fromAddress}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });
      return { success: true, preview: false };
    } catch (error) {
      console.error('[EmailService] SMTP Send Error:', error);
      // Return success true so booking/inquiry does not block the customer
      return { success: true, preview: true };
    }
  }

  public async sendNewInquiryAdminNotification(data: {
    name: string;
    email: string;
    phone: string;
    service: string;
    package?: string;
    eventDate?: string;
    city?: string;
    venue?: string;
    eventDetails?: string;
    budget?: string;
  }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background-color: #08080a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f2f2f4; }
          .container { max-width: 600px; margin: 20px auto; background: #111217; border: 1px solid #22242c; border-radius: 12px; overflow: hidden; }
          .header { background: #08080a; padding: 30px; text-align: center; border-bottom: 2px solid #E50914; }
          .brand-title { color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 4px; margin: 0; }
          .brand-accent { color: #E50914; }
          .content { padding: 30px; }
          .badge { display: inline-block; background: rgba(229, 9, 20, 0.15); color: #FF4D55; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
          .field-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #1f2027; }
          .label { color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
          .value { color: #ffffff; font-weight: 600; font-size: 14px; }
          .message-box { margin-top: 20px; padding: 16px; background: #181a22; border-radius: 8px; border-left: 3px solid #E50914; font-size: 14px; line-height: 1.6; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #1f2027; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-title">LEO<span class="brand-accent">X</span></h1>
            <p style="margin: 6px 0 0; color: #9ca3af; font-size: 12px; letter-spacing: 2px;">NEW CLIENT INQUIRY</p>
          </div>
          <div class="content">
            <span class="badge">🔥 New Booking / Inquiry Request</span>
            <div class="field-row"><span class="label">Client Name</span><span class="value">${data.name}</span></div>
            <div class="field-row"><span class="label">Email Address</span><span class="value">${data.email}</span></div>
            <div class="field-row"><span class="label">Phone / WhatsApp</span><span class="value">${data.phone}</span></div>
            <div class="field-row"><span class="label">Requested Service</span><span class="value" style="color: #FF4D55;">${data.service}</span></div>
            ${data.package ? `<div class="field-row"><span class="label">Selected Package</span><span class="value">${data.package}</span></div>` : ''}
            <div class="field-row"><span class="label">Event Date</span><span class="value">${data.eventDate || 'TBD'}</span></div>
            <div class="field-row"><span class="label">Location</span><span class="value">${data.city || 'N/A'}, ${data.venue || 'N/A'}</span></div>
            ${data.budget ? `<div class="field-row"><span class="label">Budget Estimate</span><span class="value">${data.budget}</span></div>` : ''}
            
            <div class="message-box">
              <strong style="color: #f2f2f4; display: block; margin-bottom: 6px;">Event Details / Brief:</strong>
              ${data.eventDetails || 'No details provided.'}
            </div>
          </div>
          <div class="footer">
            LEOX Productions &bull; ${this.adminEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({
      to: this.adminEmail,
      subject: `🚨 [LEOX INQUIRY] New Booking Request from ${data.name} (${data.service})`,
      html,
    });
  }

  public async sendBookingConfirmationCustomerEmail(data: {
    name: string;
    email: string;
    service: string;
    package?: string;
    eventDate: string;
    city: string;
    venue: string;
    bookingId: string;
  }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background-color: #08080a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f2f2f4; }
          .container { max-width: 600px; margin: 20px auto; background: #111217; border: 1px solid #22242c; border-radius: 12px; overflow: hidden; }
          .header { background: #08080a; padding: 35px 30px; text-align: center; border-bottom: 2px solid #E50914; }
          .brand-title { color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: 5px; margin: 0; }
          .brand-accent { color: #E50914; }
          .content { padding: 35px 30px; line-height: 1.6; }
          .greeting { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 15px; }
          .summary-card { background: #171821; border-radius: 10px; border: 1px solid #282a36; padding: 20px; margin: 25px 0; }
          .summary-item { margin-bottom: 10px; font-size: 14px; }
          .summary-item:last-child { margin-bottom: 0; }
          .cta-btn { display: inline-block; background: #E50914; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 700; letter-spacing: 1px; font-size: 14px; margin-top: 20px; text-transform: uppercase; }
          .footer { text-align: center; padding: 25px; color: #6b7280; font-size: 12px; border-top: 1px solid #1f2027; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-title">LEO<span class="brand-accent">X</span></h1>
            <p style="margin: 8px 0 0; color: #9ca3af; font-size: 11px; letter-spacing: 3px;">CINEMATIC PHOTOGRAPHY & REELS</p>
          </div>
          <div class="content">
            <div class="greeting">Thank you, ${data.name}!</div>
            <p style="color: #d1d5db; font-size: 14px;">
              Your inquiry has been received by LeoX and the production team. We are thrilled at the opportunity to capture your upcoming event with cinematic precision.
            </p>

            <div class="summary-card">
              <div class="summary-item"><strong style="color:#9ca3af;">Reference Code:</strong> <span style="color:#FF4D55; font-weight:700;">#${data.bookingId.slice(-6).toUpperCase()}</span></div>
              <div class="summary-item"><strong style="color:#9ca3af;">Service:</strong> <span style="color:#ffffff;">${data.service}</span></div>
              ${data.package ? `<div class="summary-item"><strong style="color:#9ca3af;">Package:</strong> <span style="color:#ffffff;">${data.package}</span></div>` : ''}
              <div class="summary-item"><strong style="color:#9ca3af;">Target Event Date:</strong> <span style="color:#ffffff;">${data.eventDate}</span></div>
              <div class="summary-item"><strong style="color:#9ca3af;">Location:</strong> <span style="color:#ffffff;">${data.venue}, ${data.city}</span></div>
            </div>

            <p style="color: #9ca3af; font-size: 13px;">
              Our team will review date availability, schedule our camera rig & lighting checklist, and get in touch directly via phone or WhatsApp within 12–24 hours.
            </p>

            <div style="text-align: center;">
              <a href="https://www.instagram.com/leox_shoots/" class="cta-btn" target="_blank">Explore Our Reels on Instagram</a>
            </div>
          </div>
          <div class="footer">
            LEOX Productions<br/>
            Email: ${this.adminEmail} &bull; Instagram: @leox_shoots
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({
      to: data.email,
      subject: `🎬 Your LEOX Booking Request Received (#${data.bookingId.slice(-6).toUpperCase()})`,
      html,
    });
  }

  public async sendContactNotification(data: {
    name: string;
    email: string;
    phone: string;
    service?: string;
    subject: string;
    message: string;
  }) {
    const safeMessage = data.message ? data.message.replace(/\n/g, '<br/>') : '';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background-color: #08080a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f2f2f4; }
          .container { max-width: 600px; margin: 20px auto; background: #111217; border: 1px solid #22242c; border-radius: 12px; overflow: hidden; }
          .header { background: #08080a; padding: 26px; text-align: center; border-bottom: 2px solid #E50914; }
          .brand-title { color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 4px; margin: 0; }
          .brand-accent { color: #E50914; }
          .content { padding: 26px; }
          .badge { display: inline-block; background: rgba(229, 9, 20, 0.15); color: #FF4D55; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 18px; }
          .field-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1f2027; font-size: 14px; }
          .label { color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
          .value { color: #ffffff; font-weight: 600; text-align: right; }
          .message-box { margin-top: 18px; padding: 16px; background: #181a22; border-radius: 8px; border-left: 3px solid #E50914; font-size: 14px; line-height: 1.6; color: #e5e7eb; }
          .footer { text-align: center; padding: 18px; color: #6b7280; font-size: 12px; border-top: 1px solid #1f2027; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-title">LEO<span class="brand-accent">X</span></h1>
            <p style="margin: 6px 0 0; color: #9ca3af; font-size: 12px; letter-spacing: 2px;">NEW CONTACT ENQUIRY</p>
          </div>
          <div class="content">
            <span class="badge">📩 Contact Form Submission</span>
            <div class="field-row"><span class="label">Visitor Name</span><span class="value">${data.name}</span></div>
            <div class="field-row"><span class="label">Email Address</span><span class="value"><a href="mailto:${data.email}" style="color:#FF4D55; text-decoration:none;">${data.email}</a></span></div>
            <div class="field-row"><span class="label">Phone / WhatsApp</span><span class="value">${data.phone || 'Not provided'}</span></div>
            <div class="field-row"><span class="label">Shoot / Service Type</span><span class="value" style="color: #FF4D55;">${data.service || 'General Enquiry'}</span></div>
            <div class="field-row"><span class="label">Subject</span><span class="value">${data.subject || 'Website Enquiry'}</span></div>
            
            <div class="message-box">
              <strong style="color: #ffffff; display: block; margin-bottom: 8px;">Message / Event Details:</strong>
              ${safeMessage}
            </div>
          </div>
          <div class="footer">
            LEOX Visual Media &bull; Notification Sent to: ${this.adminEmail}
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({
      to: this.adminEmail,
      subject: `💬 [LEOX ENQUIRY] ${data.subject || 'Website Message'} from ${data.name}`,
      html,
    });
  }
}

export const emailService = new EmailService();
