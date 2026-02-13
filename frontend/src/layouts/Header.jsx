import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

/**
 * Main navigation header component
 * Luxury styling with responsive mobile menu
 */
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/rooms", label: "Accommodations" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sand-200">
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Amanpulo Resort"
              className="h-10 w-auto"
            />
            <span className="font-serif text-2xl tracking-[0.1em] text-sand-900">
              AMANPULO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm uppercase tracking-[0.15em] transition-colors ${
                  isActive(link.href)
                    ? "text-sand-900 font-medium"
                    : "text-sand-600 hover:text-sand-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/rooms">
              <Button variant="luxury" size="sm">
                Book Now
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80">
              <nav className="flex flex-col space-y-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg tracking-wide transition-colors ${
                      isActive(link.href)
                        ? "text-sand-900 font-medium"
                        : "text-sand-600 hover:text-sand-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/rooms" onClick={() => setIsOpen(false)}>
                  <Button variant="luxury" className="w-full mt-4">
                    Book Now
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
