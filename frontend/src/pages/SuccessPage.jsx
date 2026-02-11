import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import {
  Check,
  Download,
  Home,
  Mail,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "@/components/Receipt";
import { useBookingStore } from "@/store";
import { bookingService } from "@/services";
import {
  downloadReceiptPDF,
  generateReceiptPDF,
  pdfBlobToBase64,
} from "@/lib/pdfGenerator";

/**
 * Success page shown after booking confirmation
 * Includes receipt preview and PDF download/email functionality
 */
export function SuccessPage() {
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const { bookingResult, selectedRoom, guestDetails, resetBooking } =
    useBookingStore();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showReceipt, setShowReceipt] = useState(true);

  /**
   * Handle sending receipt via email
   */
  const handleSendEmail = useCallback(async () => {
    if (!receiptRef.current) {
      toast.error("Receipt not ready. Please wait.");
      return;
    }

    if (emailSent) {
      toast.info("Receipt already sent to your email.");
      return;
    }

    setIsSendingEmail(true);

    try {
      // Generate PDF blob
      const pdfBlob = await generateReceiptPDF(receiptRef.current);

      // Convert to base64
      const pdfBase64 = await pdfBlobToBase64(pdfBlob);

      // Send to backend
      await bookingService.sendReceipt(
        bookingResult?.bookingReference,
        pdfBase64,
      );

      setEmailSent(true);
      toast.success("Receipt sent to your email!");
    } catch (error) {
      console.error("Email error:", error);
      toast.error("Failed to send email. You can still download the receipt.");
    } finally {
      setIsSendingEmail(false);
    }
  }, [emailSent, bookingResult?.bookingReference]);

  useEffect(() => {
    // Redirect if no booking result
    if (!bookingResult) {
      navigate("/");
    }
  }, [bookingResult, navigate]);

  // Auto-send email on mount
  useEffect(() => {
    if (bookingResult && !emailSent && receiptRef.current) {
      // Delay to ensure receipt is rendered
      const timer = setTimeout(() => {
        handleSendEmail();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bookingResult, emailSent, handleSendEmail]);

  if (!bookingResult) {
    return null;
  }

  // Calculate room details for receipt
  const nights = differenceInDays(
    new Date(bookingResult.checkOut),
    new Date(bookingResult.checkIn),
  );

  const roomDetails = {
    name: bookingResult.roomName || selectedRoom?.name || "Luxury Villa",
    category: selectedRoom?.category || "villa",
    checkIn: bookingResult.checkIn,
    checkOut: bookingResult.checkOut,
    nights,
    guests: bookingResult.guests || { adults: 2, children: 0 },
    pricePerNight: selectedRoom?.effectivePrice || selectedRoom?.price || 0,
    totalAmount: bookingResult.totalAmount,
  };

  /**
   * Handle PDF download
   */
  const handleDownload = async () => {
    if (!receiptRef.current) {
      toast.error("Receipt not ready. Please wait.");
      return;
    }

    setIsDownloading(true);

    try {
      await downloadReceiptPDF(
        receiptRef.current,
        bookingResult.bookingReference,
      );
      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download receipt. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNewBooking = () => {
    resetBooking();
    navigate("/rooms");
  };

  return (
    <div className="min-h-screen bg-sand-50 py-12">
      <div className="container-luxury max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl text-sand-900 mb-4">
            Reservation Confirmed
          </h1>
          <p className="text-sand-600 max-w-md mx-auto">
            Thank you for choosing Amanpulo. Your booking confirmation and
            receipt have been prepared below.
          </p>
        </div>

        {/* Email Status */}
        <div
          className={`
            mb-8 p-4 rounded-lg flex items-center justify-center gap-2 text-sm
            ${emailSent ? "bg-green-50 text-green-700 border border-green-200" : "bg-sand-100 text-sand-600"}
          `}
        >
          {isSendingEmail ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending confirmation email...
            </>
          ) : emailSent ? (
            <>
              <Check className="h-4 w-4" />
              Confirmation email sent to{" "}
              <span className="font-medium">
                {bookingResult.email || guestDetails?.email}
              </span>
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Preparing to send confirmation email...
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isDownloading ? "Generating..." : "Download Confirmation"}
          </Button>

          <Button
            onClick={handleSendEmail}
            variant="outline"
            disabled={isSendingEmail || emailSent}
            className="flex items-center gap-2"
          >
            {isSendingEmail ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {emailSent
              ? "Email Sent"
              : isSendingEmail
                ? "Sending..."
                : "Resend Email"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowReceipt(!showReceipt)}
            className="flex items-center gap-2"
          >
            {showReceipt ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showReceipt ? "Hide Receipt" : "Show Receipt"}
          </Button>
        </div>

        {/* Receipt Preview */}
        {showReceipt && (
          <Card className="mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-white overflow-auto">
                <Receipt
                  ref={receiptRef}
                  guestName={bookingResult.guestName || guestDetails?.name}
                  guestEmail={bookingResult.email || guestDetails?.email}
                  guestPhone={bookingResult.phone || guestDetails?.phone}
                  bookingReference={bookingResult.bookingReference}
                  processingId={`TXN-${Date.now().toString(36).toUpperCase()}`}
                  roomDetails={roomDetails}
                  paymentStatus="confirmed"
                  confirmedAt={bookingResult.confirmedAt || new Date()}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Actions */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button variant="outline" onClick={handleNewBooking}>
            Book Another Room
          </Button>
          <Link to="/">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-sand-600 mb-2">Need to modify your reservation?</p>
          <p className="text-sand-900">
            Contact us at{" "}
            <a
              href="mailto:reservations@amanpulo.com"
              className="underline hover:text-sand-700"
            >
              reservations@amanpulo.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
