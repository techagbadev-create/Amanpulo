import nodemailer from "nodemailer";

/**
 * Email utility using Nodemailer
 * Handles sending confirmation and notification emails
 */

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send booking confirmation email
 * @param {Object} booking - Booking document
 * @param {Object} room - Room document
 */
export const sendBookingConfirmationEmail = async (booking, room) => {
  const transporter = createTransporter();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f7f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          padding: 40px 0;
          border-bottom: 1px solid #d4c5b5;
        }
        .logo {
          font-size: 28px;
          font-weight: 400;
          color: #2c2c2c;
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .content {
          background: #ffffff;
          padding: 40px;
          border-radius: 4px;
          margin: 30px 0;
        }
        .title {
          font-size: 24px;
          color: #2c2c2c;
          text-align: center;
          margin-bottom: 30px;
        }
        .reference {
          background: #f9f7f4;
          padding: 20px;
          text-align: center;
          border-radius: 4px;
          margin-bottom: 30px;
        }
        .reference-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #888;
        }
        .reference-number {
          font-size: 24px;
          font-weight: 600;
          color: #2c2c2c;
          margin-top: 8px;
        }
        .details {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-label {
          color: #666;
        }
        .detail-value {
          font-weight: 500;
          color: #2c2c2c;
        }
        .total {
          font-size: 18px;
          font-weight: 600;
          padding-top: 20px;
          margin-top: 20px;
          border-top: 2px solid #2c2c2c;
        }
        .footer {
          text-align: center;
          padding: 30px;
          color: #888;
          font-size: 14px;
        }
        .contact {
          margin-top: 20px;
          padding: 20px;
          background: #f9f7f4;
          border-radius: 4px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Amanpulo</div>
        </div>
        
        <div class="content">
          <h1 class="title">Reservation Confirmed</h1>
          
          <p>Dear ${booking.guestName},</p>
          <p>Thank you for choosing Amanpulo. We are delighted to confirm your reservation.</p>
          
          <div class="reference">
            <div class="reference-label">Confirmation Number</div>
            <div class="reference-number">${booking.bookingReference}</div>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Room</span>
              <span class="detail-value">${room.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in</span>
              <span class="detail-value">${formatDate(booking.checkIn)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out</span>
              <span class="detail-value">${formatDate(booking.checkOut)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Guests</span>
              <span class="detail-value">${booking.guests.adults} Adults${booking.guests.children > 0 ? `, ${booking.guests.children} Children` : ""}</span>
            </div>
            <div class="detail-row total">
              <span class="detail-label">Total Amount</span>
              <span class="detail-value">₱${booking.totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="contact">
            <p><strong>Need assistance?</strong></p>
            <p>Contact our concierge team at any time.</p>
            <p>Email: reservation@amanpuloresort.com</p>
            <p>Website: amanpuloresort.com</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Amanpulo Resort</p>
          <p>Pamalican Island, Philippines</p>
          <p>&copy; ${new Date().getFullYear()} Amanpulo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from:
      process.env.EMAIL_FROM || '"Amanpulo Reservation" <noreply@amanpulo.com>',
    to: booking.email,
    subject: `Reservation Confirmed - ${booking.bookingReference}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✉️ Confirmation email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    // Don't throw - email failure shouldn't break the booking
    return { success: false, error: error.message };
  }
};

/**
 * Send new booking notification to admin
 * @param {Object} booking - Booking document
 * @param {Object} room - Room document
 */
export const sendNewBookingNotification = async (booking, room) => {
  const transporter = createTransporter();

  const htmlContent = `
    <h2>New Booking Received</h2>
    <p><strong>Reference:</strong> ${booking.bookingReference}</p>
    <p><strong>Guest:</strong> ${booking.guestName}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Phone:</strong> ${booking.phone}</p>
    <p><strong>Room:</strong> ${room.name}</p>
    <p><strong>Check-in:</strong> ${booking.checkIn}</p>
    <p><strong>Check-out:</strong> ${booking.checkOut}</p>
    <p><strong>Guests:</strong> ${booking.guests.adults} Adults, ${booking.guests.children || 0} Children</p>
    <p><strong>Total:</strong> ₱${booking.totalAmount.toLocaleString()}</p>
    <p><strong>Verification Code:</strong> ${booking.verificationCode}</p>
    <p><strong>Expires:</strong> ${booking.expiresAt}</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Amanpulo System" <noreply@amanpulo.com>',
    to: process.env.EMAIL_USER, // Send to admin email
    subject: `New Booking - ${booking.bookingReference}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✉️ Admin notification sent");
  } catch (error) {
    console.error("❌ Admin notification failed:", error);
  }
};

/**
 * Send booking receipt with PDF attachment
 * @param {Object} booking - Booking document
 * @param {Object} room - Room document
 * @param {Buffer|string} pdfData - PDF data as Buffer or base64 string
 */
export const sendReceiptEmail = async (booking, room, pdfData) => {
  const transporter = createTransporter();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Booking Confirmation</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #2c2a26;
          background-color: #faf8f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          padding: 30px 0;
          border-bottom: 2px solid #d4c5a9;
        }
        .logo {
          font-size: 28px;
          font-weight: 400;
          color: #2c2a26;
          letter-spacing: 5px;
          text-transform: uppercase;
          margin: 0;
        }
        .tagline {
          font-size: 11px;
          color: #8b7355;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-top: 5px;
        }
        .content {
          background: #ffffff;
          padding: 40px;
          margin-top: 30px;
          border: 1px solid #e8e4dd;
        }
        .title {
          font-size: 22px;
          color: #2c2a26;
          text-align: center;
          margin-bottom: 10px;
        }
        .subtitle {
          text-align: center;
          color: #6b6458;
          font-size: 14px;
          margin-bottom: 30px;
        }
        .reference-box {
          background: #faf8f5;
          padding: 20px;
          text-align: center;
          margin: 25px 0;
          border: 1px solid #e8e4dd;
        }
        .reference-label {
          font-size: 11px;
          color: #8b7355;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .reference-number {
          font-size: 24px;
          font-weight: bold;
          color: #2c2a26;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          margin-top: 8px;
        }
        .details {
          margin: 30px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e8e4dd;
        }
        .detail-label {
          color: #8b7355;
          font-size: 13px;
        }
        .detail-value {
          color: #2c2a26;
          font-weight: 500;
        }
        .total-row {
          font-size: 16px;
          font-weight: bold;
          border-bottom: none;
          padding-top: 20px;
        }
        .attachment-note {
          background: #f0ebe3;
          padding: 15px 20px;
          text-align: center;
          font-size: 13px;
          color: #6b6458;
          margin-top: 25px;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          padding: 30px 0;
          color: #8b7355;
          font-size: 12px;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">Amanpulo</h1>
          <p class="tagline">Private Island Resort • Philippines</p>
        </div>
        
        <div class="content">
          <h2 class="title">Booking Confirmation</h2>
          <p class="subtitle">Thank you for choosing Amanpulo, ${booking.guestName}</p>
          
          <div class="reference-box">
            <p class="reference-label">Confirmation Number</p>
            <p class="reference-number">${booking.bookingReference}</p>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Room</span>
              <span class="detail-value">${room.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in</span>
              <span class="detail-value">${formatDate(booking.checkIn)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out</span>
              <span class="detail-value">${formatDate(booking.checkOut)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Guests</span>
              <span class="detail-value">${booking.guests.adults} Adult${booking.guests.adults > 1 ? "s" : ""}${booking.guests.children > 0 ? `, ${booking.guests.children} Child${booking.guests.children > 1 ? "ren" : ""}` : ""}</span>
            </div>
            <div class="detail-row total-row">
              <span class="detail-label">Total Amount</span>
              <span class="detail-value">₱${booking.totalAmount.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="attachment-note">
            📎 Your detailed booking confirmation receipt is attached to this email.
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Need assistance?</strong></p>
          <p>Email: reservation@amanpuloresort.com</p>
          <p>Website: amanpuloresort.com</p>
          <p>Phone: +63 (2) 8976 5200</p>
          <p style="margin-top: 20px; color: #b0a89a;">
            © ${new Date().getFullYear()} Amanpulo Resort. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Prepare PDF attachment
  let pdfBuffer;
  if (typeof pdfData === "string") {
    // Base64 string
    pdfBuffer = Buffer.from(pdfData, "base64");
  } else if (Buffer.isBuffer(pdfData)) {
    pdfBuffer = pdfData;
  } else {
    throw new Error("Invalid PDF data format");
  }

  const mailOptions = {
    from:
      process.env.EMAIL_FROM || '"Amanpulo Reservation" <noreply@amanpulo.com>',
    to: booking.email,
    subject: `Booking Confirmation – ${booking.bookingReference} | Amanpulo Resort`,
    html: htmlContent,
    attachments: [
      {
        filename: `Booking_Confirmation_${booking.bookingReference}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✉️ Receipt email sent with PDF:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Receipt email sending failed:", error);
    return { success: false, error: error.message };
  }
};

export default {
  sendBookingConfirmationEmail,
  sendNewBookingNotification,
  sendReceiptEmail,
};
