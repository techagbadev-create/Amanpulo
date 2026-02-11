import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import {
  Clock,
  AlertCircle,
  Check,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LiveSupport } from "@/components/LiveSupport";
import { bookingService } from "@/services";
import { useBookingStore, useChatStore } from "@/store";
import { formatCurrency } from "@/lib/utils";

/**
 * Checkout page with booking form and payment confirmation code input
 */
export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    selectedRoom,
    checkIn,
    checkOut,
    guests,
    guestDetails,
    setGuestDetails,
    setBookingResult,
  } = useBookingStore();

  const [verificationCode, setVerificationCode] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);

  // Get chat store to reset auto-opened state when leaving checkout
  const { resetAutoOpened } = useChatStore();

  // Reset auto-opened state when component unmounts (leaving checkout page)
  useEffect(() => {
    return () => {
      resetAutoOpened();
    };
  }, [resetAutoOpened]);

  // Redirect if no room selected
  if (!selectedRoom || !checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50">
        <h2 className="font-serif text-2xl text-sand-900 mb-4">
          No reservation in progress
        </h2>
        <p className="text-sand-600 mb-6">
          Please select a room and dates first.
        </p>
        <Button onClick={() => navigate("/rooms")}>Browse Rooms</Button>
      </div>
    );
  }

  const nights = differenceInDays(new Date(checkOut), new Date(checkIn));
  const pricePerNight = selectedRoom.effectivePrice || selectedRoom.price;
  const totalPrice = nights * pricePerNight;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails({ [name]: value });
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!guestDetails.name || !guestDetails.email || !guestDetails.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await bookingService.createBooking({
        roomId: selectedRoom._id,
        guestName: guestDetails.name,
        email: guestDetails.email,
        phone: guestDetails.phone,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guests,
        specialRequests: guestDetails.specialRequests,
      });

      setBookingReference(response.data.bookingReference);
      setBookingCreated(true);
      toast.success("Booking created! Please complete payment.");
    } catch (error) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsConfirming(true);

    try {
      const response = await bookingService.confirmBooking(
        bookingReference,
        verificationCode,
      );
      setBookingResult(response.data);
      toast.success("Booking confirmed!");
      navigate("/success");
    } catch (error) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 py-12">
      <div className="container-luxury">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sand-600 hover:text-sand-900 mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </button>

        <h1 className="font-serif text-3xl md:text-4xl text-sand-900 mb-8">
          {bookingCreated
            ? "Complete Your Reservation"
            : "Confirm Your Reservation"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {!bookingCreated ? (
              /* Guest Details Form */
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                  <CardDescription>
                    Please provide your details for the reservation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateBooking} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={guestDetails.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={guestDetails.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={guestDetails.phone}
                          onChange={handleInputChange}
                          placeholder="+1 234 567 8900"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="specialRequests">
                          Special Requests (Optional)
                        </Label>
                        <textarea
                          id="specialRequests"
                          name="specialRequests"
                          value={guestDetails.specialRequests}
                          onChange={handleInputChange}
                          placeholder="Any special requirements?"
                          className="w-full min-h-[100px] rounded-md border border-sand-300 bg-white px-3 py-2 text-sm placeholder:text-sand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-400"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Creating Booking..."
                        : "Continue to Payment"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Payment Instructions */}
                <Card className="border-gold-300 bg-gold-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gold-600" />
                      <CardTitle className="text-gold-800">
                        Payment Required
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Your booking reference:{" "}
                      <span className="font-mono font-bold text-sand-900">
                        {bookingReference}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-gold-200">
                      <h4 className="font-medium text-sand-900 mb-2">
                        To Complete Your Reservation:
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-sand-600">
                        <li>
                          Contact our reservations team via live chat or email
                        </li>
                        <li>
                          Complete your payment through bank transfer or wire
                        </li>
                        <li>
                          Receive your unique confirmation code from our team
                        </li>
                        <li>Enter the code below to confirm your booking</li>
                      </ol>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-gold-400 text-gold-700 hover:bg-gold-100"
                      onClick={() => {
                        // Open Smartsupp chat
                        if (window.smartsupp) {
                          window.smartsupp("chat:open");
                        }
                      }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Live Support
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-sand-500">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        Your booking will expire in 6 hours if not confirmed
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Confirmation Code Input */}
                <Card>
                  <CardHeader>
                    <CardTitle>Enter Confirmation Code</CardTitle>
                    <CardDescription>
                      Enter the verification code provided by our reservations
                      team after payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="verificationCode">
                        Payment Confirmation Code
                      </Label>
                      <Input
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) =>
                          setVerificationCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter code (e.g., A1B2C3D4)"
                        className="font-mono text-lg uppercase tracking-wider"
                        maxLength={8}
                      />
                    </div>
                    <Button
                      onClick={handleConfirmBooking}
                      className="w-full"
                      size="lg"
                      disabled={isConfirming || !verificationCode}
                    >
                      {isConfirming ? "Confirming..." : "Confirm Reservation"}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Room Image */}
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={
                      selectedRoom.images?.[0] ||
                      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400"
                    }
                    alt={selectedRoom.name}
                    className="w-full h-40 object-cover"
                  />
                </div>

                <div>
                  <Badge variant="secondary" className="capitalize mb-2">
                    {selectedRoom.category}
                  </Badge>
                  <h3 className="font-serif text-xl text-sand-900">
                    {selectedRoom.name}
                  </h3>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sand-600">Check-in</span>
                    <span className="font-medium">
                      {format(new Date(checkIn), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sand-600">Check-out</span>
                    <span className="font-medium">
                      {format(new Date(checkOut), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sand-600">Guests</span>
                    <span className="font-medium">
                      {guests.adults} Adult{guests.adults > 1 ? "s" : ""}
                      {guests.children > 0 &&
                        `, ${guests.children} Child${guests.children > 1 ? "ren" : ""}`}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sand-600">
                    <span>
                      {formatCurrency(pricePerNight)} x {nights} nights
                    </span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>

                {bookingCreated && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-800">
                        Booking Created
                      </p>
                      <p className="text-green-600">
                        Awaiting payment confirmation
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 
        LiveSupport with auto-open on checkout page
        - Auto-opens after 2 seconds (adjustable via autoOpenDelay prop)
        - Prefills guest info if available
        - showButton=false since MainLayout already has the global button
      */}
      <LiveSupport
        autoOpen={true}
        autoOpenDelay={2000}
        guestName={guestDetails.name}
        guestEmail={guestDetails.email}
        bookingReference={bookingReference}
        showButton={false}
      />
    </div>
  );
}

export default CheckoutPage;
