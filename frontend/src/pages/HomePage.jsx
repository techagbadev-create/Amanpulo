import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Waves,
  Utensils,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { roomService } from "@/services";
import { formatCurrency } from "@/lib/utils";

/**
 * Home page with hero, featured rooms, about, amenities, and testimonials
 */
export function HomePage() {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomService.getRooms();
        // Get first 3 rooms as featured
        setFeaturedRooms(response.data?.slice(0, 3) || []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const amenities = [
    {
      icon: Waves,
      title: "Private Beach",
      description: "Pristine white sand beaches exclusive to our guests",
    },
    {
      icon: Utensils,
      title: "Fine Dining",
      description: "World-class cuisine prepared by renowned chefs",
    },
    {
      icon: Sparkles,
      title: "Spa & Wellness",
      description: "Rejuvenate with traditional Filipino healing rituals",
    },
  ];

  const testimonials = [
    {
      quote:
        "An unforgettable experience. The privacy and luxury exceeded all expectations.",
      author: "Sarah M.",
      location: "New York",
    },
    {
      quote:
        "Paradise found. The staff made us feel like royalty from the moment we arrived.",
      author: "James L.",
      location: "London",
    },
    {
      quote:
        "The most beautiful resort we've ever visited. Simply perfect in every way.",
      author: "Elena K.",
      location: "Paris",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight animate-fade-in">
            Amanpulo
          </h1>
          <p className="text-white/90 text-lg md:text-xl tracking-[0.3em] uppercase mb-12 animate-slide-up">
            Private Island Resort
          </p>
          <Link to="/rooms">
            <Button
              variant="outline"
              size="xl"
              className="bg-transparent border-white text-white hover:bg-white hover:text-sand-900 uppercase tracking-[0.2em]"
            >
              Explore Rooms
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <p className="subheading-luxury mb-4">Accommodations</p>
            <h2 className="heading-luxury">Featured Rooms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading
              ? // Loading skeleton
                [...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-sand-100 rounded-lg mb-4" />
                    <div className="h-6 bg-sand-100 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-sand-100 rounded w-1/2" />
                  </div>
                ))
              : featuredRooms.map((room) => (
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
                        <div className="absolute top-4 right-4 bg-gold-500 text-white px-3 py-1 text-xs uppercase tracking-wider">
                          {room.seasonalDiscount?.percentage}% Off
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl text-sand-900 mb-2">
                        {room.name}
                      </h3>
                      <p className="text-sand-600 text-sm mb-4 line-clamp-2">
                        {room.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sand-900 font-medium">
                            {formatCurrency(room.effectivePrice || room.price)}
                          </span>
                          <span className="text-sand-500 text-sm">
                            {" "}
                            / night
                          </span>
                        </div>
                        <Link to={`/rooms/${room._id}`}>
                          <Button
                            variant="ghost"
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

          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button variant="luxury" size="lg">
                View All Accommodations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-sand-50">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="subheading-luxury mb-4">Our Story</p>
              <h2 className="heading-luxury mb-6">A Private Paradise</h2>
              <p className="text-sand-600 leading-relaxed mb-6">
                Nestled on the pristine shores of Pamalican Island, Amanpulo
                offers an exclusive sanctuary where luxury meets untouched
                natural beauty. Our private island resort provides an
                unparalleled escape from the ordinary.
              </p>
              <p className="text-sand-600 leading-relaxed mb-8">
                Each of our accommodations has been thoughtfully designed to
                blend seamlessly with the tropical landscape while providing the
                highest standards of comfort and service.
              </p>
              <Link to="/rooms">
                <Button variant="outline">View Accommodations</Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"
                alt="Amanpulo Resort"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-sand-900 text-white p-8 hidden lg:block">
                <p className="font-serif text-3xl mb-1">30+</p>
                <p className="text-sm uppercase tracking-wider text-sand-300">
                  Years of Excellence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <p className="subheading-luxury mb-4">Experience</p>
            <h2 className="heading-luxury">Resort Amenities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sand-100 mb-6 group-hover:bg-sand-900 transition-colors">
                    <Icon className="h-8 w-8 text-sand-900 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-serif text-xl text-sand-900 mb-3">
                    {amenity.title}
                  </h3>
                  <p className="text-sand-600">{amenity.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-sand-900 text-white">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-sand-400 mb-4">
              Testimonials
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Guest Experiences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="text-center p-8 border border-sand-700 rounded-lg"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-gold-400 fill-gold-400"
                    />
                  ))}
                </div>
                <p className="text-sand-200 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-sand-400 text-sm">{testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative container-luxury text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Begin Your Journey
          </h2>
          <p className="text-white/80 mb-10 max-w-xl mx-auto">
            Experience the ultimate in luxury and tranquility. Let us create
            unforgettable moments for you.
          </p>
          <Link to="/rooms">
            <Button
              variant="outline"
              size="xl"
              className="bg-transparent border-white text-white hover:bg-white hover:text-sand-900"
            >
              Reserve Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
