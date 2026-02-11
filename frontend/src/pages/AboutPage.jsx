import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/**
 * About page - Amanpulo story and location
 */
export function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-4">
            About Amanpulo
          </h1>
          <p className="text-white/80 max-w-xl">
            A sanctuary of peace on a private island paradise
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container-luxury max-w-4xl text-center">
          <p className="text-sand-500 uppercase tracking-[0.3em] text-sm mb-6">
            Welcome to Paradise
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-sand-900 mb-8">
            An Island Sanctuary Unlike Any Other
          </h2>
          <p className="text-sand-600 leading-relaxed text-lg mb-6">
            Amanpulo, meaning "peaceful island," is a secluded paradise nestled
            in the heart of the Philippines. Located on Pamalican Island in the
            Sulu Sea, this exclusive resort offers an escape to pristine
            white-sand beaches, crystal-clear turquoise waters, and untouched
            natural beauty.
          </p>
          <p className="text-sand-600 leading-relaxed text-lg">
            Since its founding, Amanpulo has been dedicated to providing guests
            with an unparalleled luxury experience while preserving the island's
            delicate ecosystem. Our commitment to sustainability and excellence
            has made us one of the most sought-after destinations in the world.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-sand-50">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sand-500 uppercase tracking-[0.3em] text-sm mb-4">
                Location
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-sand-900 mb-6">
                A Private Island in the Philippines
              </h2>
              <p className="text-sand-600 leading-relaxed mb-6">
                Pamalican Island is located approximately 300 kilometers
                southwest of Manila, accessible only by private aircraft. This
                remoteness ensures complete privacy and tranquility for our
                guests.
              </p>
              <div className="space-y-4 text-sand-600">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sand-700 text-lg">✈</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sand-900 mb-1">
                      Private Air Transfer
                    </h4>
                    <p className="text-sm">
                      70-minute flight from Manila via Amanpulo's private
                      aircraft
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sand-700 text-lg">🏝</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sand-900 mb-1">
                      89 Hectares of Paradise
                    </h4>
                    <p className="text-sm">
                      Pristine beaches, lush forests, and protected marine
                      sanctuary
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sand-700 text-lg">🌊</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sand-900 mb-1">Sulu Sea</h4>
                    <p className="text-sm">
                      World-class diving and pristine coral reefs
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/map-philippines.png"
                alt="Amanpulo Location Map - Philippines"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
                alt="Luxury Villa"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sand-500 uppercase tracking-[0.3em] text-sm mb-4">
                Our Philosophy
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-sand-900 mb-6">
                Timeless Luxury, Natural Beauty
              </h2>
              <p className="text-sand-600 leading-relaxed mb-6">
                At Amanpulo, we believe that true luxury lies in simplicity and
                harmony with nature. Our casitas and villas are designed to
                complement the natural landscape, offering unobstructed views
                and seamless indoor-outdoor living.
              </p>
              <p className="text-sand-600 leading-relaxed mb-8">
                Every detail has been carefully considered to provide an
                experience of refined elegance while minimizing our
                environmental footprint. From our solar-powered facilities to
                our marine conservation programs, sustainability is at the heart
                of everything we do.
              </p>
              <Link to="/rooms">
                <Button variant="luxury">Explore Accommodations</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="py-20 bg-sand-900 text-white">
        <div className="container-luxury text-center">
          <p className="text-sand-400 uppercase tracking-[0.3em] text-sm mb-6">
            Experiences
          </p>
          <h2 className="font-serif text-3xl md:text-4xl mb-12">
            Island Adventures Await
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Diving & Snorkeling",
                description:
                  "Explore vibrant coral reefs and encounter diverse marine life in our protected waters.",
                icon: "🤿",
              },
              {
                title: "Private Dining",
                description:
                  "Savor world-class cuisine prepared by our expert chefs in stunning settings.",
                icon: "🍽",
              },
              {
                title: "Spa & Wellness",
                description:
                  "Rejuvenate body and mind with holistic treatments inspired by Filipino traditions.",
                icon: "🧘",
              },
            ].map((exp) => (
              <div key={exp.title} className="p-8">
                <div className="text-4xl mb-4">{exp.icon}</div>
                <h3 className="font-serif text-xl mb-3">{exp.title}</h3>
                <p className="text-sand-300 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-luxury text-center max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl text-sand-900 mb-6">
            Begin Your Journey
          </h2>
          <p className="text-sand-600 mb-8">
            Experience the magic of Amanpulo for yourself. Our team is ready to
            help you plan an unforgettable island escape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rooms">
              <Button variant="luxury" size="lg">
                View Accommodations
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
