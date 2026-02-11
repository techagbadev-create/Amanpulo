import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roomService } from "@/services";
import { useRoomStore } from "@/store";
import { formatCurrency } from "@/lib/utils";

/**
 * Rooms listing page with filtering
 */
export function RoomsPage() {
  const {
    rooms,
    setRooms,
    filters,
    setFilters,
    isLoading,
    setLoading,
    setError,
  } = useRoomStore();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await roomService.getRooms();
        setRooms(response.data || []);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [setRooms, setLoading, setError]);

  // Filter rooms based on selected filters
  const filteredRooms = rooms.filter((room) => {
    if (
      filters.category &&
      filters.category !== "all" &&
      room.category !== filters.category
    )
      return false;
    if (
      filters.guests &&
      filters.guests !== "all" &&
      room.maxGuests < parseInt(filters.guests)
    )
      return false;
    return true;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "villa", label: "Villas" },
    { value: "casita", label: "Casitas" },
    { value: "pavilion", label: "Pavilions" },
    { value: "suite", label: "Suites" },
  ];

  const guestOptions = [
    { value: "all", label: "Any Guests" },
    { value: "2", label: "2+ Guests" },
    { value: "4", label: "4+ Guests" },
    { value: "6", label: "6+ Guests" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4">
            Discover
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-4">
            Our Accommodations
          </h1>
          <p className="text-white/80 max-w-xl">
            Choose from our collection of luxurious casitas, villas, and
            pavilions, each offering unparalleled comfort and privacy.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b border-sand-200 bg-white sticky top-20 z-40">
        <div className="container-luxury py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div
                className={`${showFilters ? "flex" : "hidden"} lg:flex flex-wrap gap-4`}
              >
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters({ category: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.guests}
                  onValueChange={(value) => setFilters({ guests: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {guestOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-sand-600 text-sm">
              {filteredRooms.length}{" "}
              {filteredRooms.length === 1 ? "accommodation" : "accommodations"}{" "}
              available
            </p>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="section-padding bg-sand-50">
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-sand-200 rounded-lg mb-4" />
                  <div className="h-6 bg-sand-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-sand-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="font-serif text-2xl text-sand-900 mb-4">
                No accommodations found
              </h3>
              <p className="text-sand-600 mb-6">
                Try adjusting your filters to see more options.
              </p>
              <Button onClick={() => setFilters({ category: "", guests: "" })}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <Card
                  key={room._id}
                  className="card-luxury overflow-hidden group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        room.images?.[0] ||
                        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                      }
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {room.hasActiveDiscount && (
                      <Badge className="absolute top-4 right-4 bg-gold-500 hover:bg-gold-600">
                        {room.seasonalDiscount?.percentage}% Off
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute top-4 left-4 capitalize"
                    >
                      {room.category}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl text-sand-900 mb-2">
                      {room.name}
                    </h3>
                    <p className="text-sand-600 text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    <div className="flex items-center text-sand-500 text-sm mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Up to {room.maxGuests} guests</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        {room.hasActiveDiscount && (
                          <span className="text-sand-400 line-through text-sm mr-2">
                            {formatCurrency(room.price)}
                          </span>
                        )}
                        <span className="text-sand-900 font-semibold text-lg">
                          {formatCurrency(room.effectivePrice || room.price)}
                        </span>
                        <span className="text-sand-500 text-sm"> / night</span>
                      </div>
                      <Link to={`/rooms/${room._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="group/btn"
                        >
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default RoomsPage;
