import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LiveSupport } from "@/components/LiveSupport";

/**
 * Main layout component
 * Wraps pages with header and footer
 * Includes global LiveSupport chat button
 */
export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
      {/* Global Live Support button - visible on all pages */}
      <LiveSupport />
    </div>
  );
}

export default MainLayout;
