import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import {
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { roomService } from "@/services";
import { useBookingStore } from "@/store";
import { formatCurrency, cn } from "@/lib/utils";

/**
 * Room details page with image gallery, amenities, and booking form
 */
export function RoomDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { checkIn, checkOut, guests, setSelectedRoom, setDates, setGuests } =
    useBookingStore();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await roomService.getRoomById(id);
        setRoom(response.data);
      } catch (error) {
        console.error("Failed to fetch room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleDateSelect = (range) => {
    setDates(range?.from || null, range?.to || null);
  };

  const adjustGuests = (type, increment) => {
    const newValue = guests[type] + increment;
    if (
      type === "adults" &&
      newValue >= 1 &&
      newValue <= (room?.maxGuests || 10)
    ) {
      setGuests({ ...guests, adults: newValue });
    }
    if (
      type === "children" &&
      newValue >= 0 &&
      newValue <= (room?.maxGuests || 10) - guests.adults
    ) {
      setGuests({ ...guests, children: newValue });
    }
  };

  const totalGuests = guests.adults + guests.children;
  const nights =
    checkIn && checkOut
      ? differenceInDays(new Date(checkOut), new Date(checkIn))
      : 0;
  const pricePerNight = room?.effectivePrice || room?.price || 0;
  const totalPrice = nights * pricePerNight;

  const handleReserve = () => {
    if (!checkIn || !checkOut) return;
    setSelectedRoom(room);
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sand-900" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="font-serif text-2xl text-sand-900 mb-4">
          Room not found
        </h2>
        <Button onClick={() => navigate("/rooms")}>Back to Rooms</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Image Gallery */}
      <section className="relative h-[60vh] min-h-[400px] bg-black">
        <img
          src={
            room.images?.[currentImageIndex] ||
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920"
          }
          alt={room.name}
          className="w-full h-full object-cover"
        />

        {room.images?.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? room.images.length - 1 : prev - 1,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === room.images.length - 1 ? 0 : prev + 1,
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {room.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentImageIndex ? "bg-white" : "bg-white/50",
                  )}
                />
              ))}
            </div>
          </>
        )}

        {room.hasActiveDiscount && (
          <Badge className="absolute top-4 right-4 bg-gold-500 hover:bg-gold-600 text-base px-4 py-1">
            {room.seasonalDiscount?.percentage}% Off
          </Badge>
        )}
      </section>

      {/* Content */}
      <section className="container-luxury py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Room Details */}
          <div className="lg:col-span-2">
            <button
              onClick={() => navigate("/rooms")}
              className="flex items-center text-sand-600 hover:text-sand-900 mb-6 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Rooms
            </button>

            <Badge variant="secondary" className="capitalize mb-4">
              {room.category}
            </Badge>

            <h1 className="font-serif text-4xl text-sand-900 mb-4">
              {room.name}
            </h1>

            <div className="flex items-center text-sand-600 mb-6">
              <Users className="h-5 w-5 mr-2" />
              <span>Up to {room.maxGuests} guests</span>
            </div>

            <p className="text-sand-600 leading-relaxed mb-8">
              {room.description}
            </p>

            <Separator className="my-8" />

            {/* Amenities */}
            <div>
              <h2 className="font-serif text-2xl text-sand-900 mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center text-sand-600">
                    <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    {room.hasActiveDiscount && (
                      <span className="text-sand-400 line-through text-lg mr-2 font-normal">
                        {formatCurrency(room.price)}
                      </span>
                    )}
                    <span className="text-2xl">
                      {formatCurrency(pricePerNight)}
                    </span>
                    <span className="text-sand-500 text-base font-normal">
                      {" "}
                      / night
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="text-sm font-medium text-sand-700 mb-2 block">
                    Select Dates
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkIn && "text-sand-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn && checkOut ? (
                          <>
                            {format(new Date(checkIn), "MMM d")} -{" "}
                            {format(new Date(checkOut), "MMM d, yyyy")}
                          </>
                        ) : (
                          <span>Select dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: checkIn ? new Date(checkIn) : undefined,
                          to: checkOut ? new Date(checkOut) : undefined,
                        }}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                        disabled={{ before: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guest Selection */}
                <div>
                  <label className="text-sm font-medium text-sand-700 mb-4 block">
                    Guests (Max {room.maxGuests})
                  </label>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sand-600">Adults</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => adjustGuests("adults", -1)}
                          disabled={guests.adults <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{guests.adults}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => adjustGuests("adults", 1)}
                          disabled={totalGuests >= room.maxGuests}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sand-600">Children</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => adjustGuests("children", -1)}
                          disabled={guests.children <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">
                          {guests.children}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => adjustGuests("children", 1)}
                          disabled={totalGuests >= room.maxGuests}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Summary */}
                {nights > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sand-600">
                      <span>
                        {formatCurrency(pricePerNight)} x {nights} nights
                      </span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-sand-900">
                      <span>Total</span>
                      <span>{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!checkIn || !checkOut}
                  onClick={handleReserve}
                >
                  Reserve Now
                </Button>

                <p className="text-center text-sand-500 text-sm">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RoomDetailsPage;
