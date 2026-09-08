import { Request, Response } from 'express';
import { BookingModel, InquiryModel } from '../models/index';
import { emailService } from '../services/emailService';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      phone,
      email,
      service,
      package: pkg,
      eventDate,
      city,
      venue,
      eventDetails,
      expectedGuests,
      budgetRange,
      instagramHandle,
      additionalRequirements,
    } = req.body;

    // Required fields validation
    if (!fullName || !phone || !email || !service || !eventDate || !city || !venue || !eventDetails) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Full Name, Phone, Email, Service, Event Date, City, Venue, and Event Details.',
      });
      return;
    }

    // Basic format validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 7) {
      res.status(400).json({ success: false, message: 'Please provide a valid contact number.' });
      return;
    }

    const booking = await BookingModel.create({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      service,
      package: pkg || '',
      eventDate,
      city: city.trim(),
      venue: venue.trim(),
      eventDetails: eventDetails.trim(),
      expectedGuests: expectedGuests || '',
      budgetRange: budgetRange || '',
      instagramHandle: instagramHandle ? instagramHandle.trim().replace(/^@/, '') : '',
      additionalRequirements: additionalRequirements || '',
      status: 'NEW',
      internalNotes: '',
    });

    // Also mirror into inquiries for the admin unified inbox
    await InquiryModel.create({
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service,
      eventDate,
      city: city.trim(),
      venue: venue.trim(),
      message: `[Direct Booking Request - ${pkg || 'Custom'}] ${eventDetails}`,
      status: 'NEW',
    });

    // Asynchronously send emails (does not block response)
    const bookingId = booking.id || booking._id!;
    emailService.sendNewInquiryAdminNotification({
      name: fullName,
      email,
      phone,
      service,
      package: pkg,
      eventDate,
      city,
      venue,
      eventDetails,
      budget: budgetRange,
    }).catch(err => console.error('[Email] Failed to send admin alert:', err));

    emailService.sendBookingConfirmationCustomerEmail({
      name: fullName,
      email,
      service,
      package: pkg,
      eventDate,
      city,
      venue,
      bookingId,
    }).catch(err => console.error('[Email] Failed to send customer confirmation:', err));

    res.status(201).json({
      success: true,
      message: 'Your booking request has been submitted successfully! Check your email for confirmation.',
      booking,
    });
  } catch (error: any) {
    console.error('[Booking] Creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit booking. Please try again or reach out directly.' });
  }
};

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, city, service, q } = req.query;
    let all = await BookingModel.find();

    if (status && typeof status === 'string' && status !== 'ALL') {
      all = all.filter(b => b.status === status);
    }
    if (city && typeof city === 'string' && city !== 'ALL') {
      all = all.filter(b => b.city?.toLowerCase().includes(city.toLowerCase()));
    }
    if (service && typeof service === 'string' && service !== 'ALL') {
      all = all.filter(b => b.service?.toLowerCase().includes(service.toLowerCase()));
    }
    if (q && typeof q === 'string') {
      const search = q.toLowerCase();
      all = all.filter(b =>
        b.fullName.toLowerCase().includes(search) ||
        b.email.toLowerCase().includes(search) ||
        b.phone.includes(search) ||
        b.city?.toLowerCase().includes(search) ||
        b.venue?.toLowerCase().includes(search) ||
        b.service?.toLowerCase().includes(search) ||
        (b.id && b.id.toLowerCase().includes(search))
      );
    }

    res.json({ success: true, count: all.length, bookings: all });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings.' });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving booking.' });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await BookingModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }
    res.json({ success: true, message: 'Booking updated successfully.', booking: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update booking.' });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await BookingModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Booking not found.' });
      return;
    }
    res.json({ success: true, message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete booking.' });
  }
};
