import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

/**
 * Contact Us page with form and embedded map
 */
export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["Pamalican Island", "Palawan, Philippines 5316"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+63 2 8976 5200", "+63 917 123 4567"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["reservations@amanpulo.com", "info@amanpulo.com"],
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["24/7 Reservations", "Front Desk: Always Available"],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[350px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-white/80 uppercase tracking-[0.3em] text-sm mb-4">
            Get In Touch
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white/80 max-w-xl">
            We're here to help you plan your perfect island escape
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container-luxury">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <Card key={info.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sand-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-sand-700" />
                    </div>
                    <h3 className="font-medium text-sand-900 mb-2">
                      {info.title}
                    </h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sand-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-sand-50">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <p className="text-sand-500 uppercase tracking-[0.3em] text-sm mb-4">
                Send a Message
              </p>
              <h2 className="font-serif text-3xl text-sand-900 mb-6">
                We'd Love to Hear From You
              </h2>
              <p className="text-sand-600 mb-8">
                Whether you have questions about our accommodations, need
                assistance planning your stay, or simply want to learn more
                about Amanpulo, our team is here to help.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Reservation Inquiry"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="flex w-full rounded-md border border-sand-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-sand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="luxury"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Map */}
            <div>
              <p className="text-sand-500 uppercase tracking-[0.3em] text-sm mb-4">
                Find Us
              </p>
              <h2 className="font-serif text-3xl text-sand-900 mb-6">
                Our Location
              </h2>
              <div className="h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
                {/* Google Maps Embed - Pamalican Island, Palawan */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124704.46814686697!2d120.65!3d11.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33b5a1d21c93a593%3A0x8e4bdfb9d0e9a1f7!2sPamalican%20Island!5e0!3m2!1sen!2sph!4v1699999999999!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Amanpulo Location"
                />
              </div>
              <p className="text-sand-500 text-sm mt-4 text-center">
                Pamalican Island is accessible only by private aircraft from
                Manila
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container-luxury max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-sand-500 uppercase tracking-[0.3em] text-sm mb-4">
              FAQ
            </p>
            <h2 className="font-serif text-3xl text-sand-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How do I get to Amanpulo?",
                a: "Amanpulo is accessible exclusively by private aircraft from Manila. Our island aviation team operates daily flights, weather permitting. The flight takes approximately 70 minutes.",
              },
              {
                q: "What is the best time to visit?",
                a: "The Philippines enjoys tropical weather year-round. The dry season (November to May) offers the best conditions for outdoor activities and water sports.",
              },
              {
                q: "Is Amanpulo family-friendly?",
                a: "Absolutely! We welcome families and offer a range of activities suitable for all ages, including kids' programs, family-friendly dining options, and spacious villa accommodations.",
              },
              {
                q: "What activities are available on the island?",
                a: "Guests can enjoy diving, snorkeling, island hopping, spa treatments, private beach dinners, water sports, nature walks, and stargazing, among many other experiences.",
              },
            ].map((faq, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <h3 className="font-medium text-sand-900 mb-2">{faq.q}</h3>
                  <p className="text-sand-600 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
