import { ENV } from '../config/env';

export interface BookingNotificationData {
  bookingId?: string;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  package?: string;
  eventDate: string;
  bookingTime?: string;
  city: string;
  venue: string;
  instagramHandle?: string;
  eventDetails?: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  status: 'sent' | 'failed' | 'pending';
  messageId?: string;
  error?: string;
}

/**
 * Formats an event date into a professional readable format like "11 October 2026"
 */
export function formatEventDate(dateStr?: string): string {
  if (!dateStr || !dateStr.trim()) return 'Not provided';
  const trimmed = dateStr.trim();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Match YYYY-MM-DD (e.g. from HTML5 date inputs)
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const monthIndex = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    if (monthIndex >= 0 && monthIndex < 12 && day >= 1 && day <= 31) {
      return `${day} ${monthNames[monthIndex]} ${year}`;
    }
  }

  // Match DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const monthIndex = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    if (monthIndex >= 0 && monthIndex < 12 && day >= 1 && day <= 31) {
      return `${day} ${monthNames[monthIndex]} ${year}`;
    }
  }

  // Fallback to JS Date parsing
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  return trimmed;
}

export class WhatsAppService {
  /**
   * Format the booking notification message according to the official LEOX Master Prompt
   */
  buildBookingNotificationMessage(data: BookingNotificationData): string {
    const fullName = data.fullName?.trim() || 'Not provided';
    const phone = data.phone?.trim() || 'Not provided';
    const email = data.email?.trim() || 'Not provided';
    const instagram = data.instagramHandle?.trim() || 'Not provided';
    const service = data.service?.trim() || 'Not provided';
    const pkg = data.package?.trim() || 'Not provided';
    const formattedDate = formatEventDate(data.eventDate);
    const city = data.city?.trim() || 'Not provided';
    const venue = data.venue?.trim() || 'Not provided';

    return `LEOX — NEW BOOKING REQUEST

A new booking has been received through the website.

CLIENT DETAILS
Name: ${fullName}
Phone / WhatsApp: ${phone}
Email: ${email}
Instagram: ${instagram}

BOOKING DETAILS
Service: ${service}
Package: ${pkg}
Event Date: ${formattedDate}
City: ${city}
Venue: ${venue}

STATUS
New Booking — Pending Confirmation

Please review the booking details and contact the client to confirm the shoot.`;
  }

  /**
   * Automatically send booking notification to configured WhatsApp Business number
   * via official WhatsApp Business / Cloud API (Meta Graph API)
   */
  async sendBookingNotification(data: BookingNotificationData): Promise<WhatsAppSendResult> {
    const rawTarget = ENV.WHATSAPP_BUSINESS_NUMBER || '918374404536';
    const cleanTarget = rawTarget.replace(/[^0-9]/g, '');
    const messageText = this.buildBookingNotificationMessage(data);

    const token = ENV.WHATSAPP_API_TOKEN?.trim();
    const phoneNumberId = ENV.WHATSAPP_PHONE_NUMBER_ID?.trim();

    // If Cloud API credentials are not yet configured in environment variables
    if (!token || !phoneNumberId) {
      console.log(
        `[WhatsAppService] WhatsApp Cloud API credentials not configured. Notification recorded as pending for +${cleanTarget}.`
      );
      return {
        success: false,
        status: 'pending',
        error:
          'WhatsApp Cloud API credentials (WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID) not configured.',
      };
    }

    try {
      const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanTarget,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData: any = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg =
          resData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
        console.error('[WhatsAppService] WhatsApp Cloud API delivery error:', errorMsg);
        return {
          success: false,
          status: 'failed',
          error: errorMsg,
        };
      }

      const messageId = resData?.messages?.[0]?.id || `WA-${Date.now()}`;
      console.log(
        `[WhatsAppService] WhatsApp Cloud API notification sent successfully for booking #${data.bookingId} (ID: ${messageId})`
      );
      return {
        success: true,
        status: 'sent',
        messageId,
      };
    } catch (err: any) {
      console.error(
        '[WhatsAppService] Error dispatching WhatsApp notification:',
        err?.message || err
      );
      return {
        success: false,
        status: 'failed',
        error: err?.message || 'Network error communicating with WhatsApp Cloud API',
      };
    }
  }
}

export const whatsappService = new WhatsAppService();
