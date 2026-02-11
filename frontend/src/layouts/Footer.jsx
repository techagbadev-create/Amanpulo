import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

/**
 * Footer component with luxury resort styling
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sand-900 text-white">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl tracking-[0.1em] mb-4">
              AMANPULO
            </h3>
            <p className="text-sand-300 text-sm leading-relaxed">
              A private island paradise in the Philippines, where luxury meets
              nature in perfect harmony.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-6 text-sand-400">
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/rooms", label: "Accommodations" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sand-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-6 text-sand-400">
              Contact
            </h4>
            <ul className="space-y-3 text-sand-300 text-sm">
              <li>Pamalican Island</li>
              <li>Palawan, Philippines</li>
              <li className="pt-2">reservations@amanpulo.com</li>
              <li>+63 2 8976 5200</li>
            </ul>
          </div>

          {/* Concierge */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-6 text-sand-400">
              Concierge
            </h4>
            <p className="text-sand-300 text-sm leading-relaxed mb-4">
              Our dedicated team is available 24/7 to assist with your
              reservation and travel arrangements.
            </p>
            <a
              href="mailto:reservations@amanpulo.com"
              className="inline-block border border-white/30 px-6 py-2 text-sm uppercase tracking-wider hover:bg-white hover:text-sand-900 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>

        <Separator className="my-12 bg-sand-700" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sand-400 text-xs">
          <p>© {currentYear} Amanpulo Reservation. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
