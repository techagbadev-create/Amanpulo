import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { MainLayout, AdminLayout } from "@/layouts";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  HomePage,
  RoomsPage,
  RoomDetailsPage,
  CheckoutPage,
  SuccessPage,
  AboutPage,
  ContactPage,
  LoginPage,
  AdminDashboardPage,
  AdminRoomsPage,
  AdminBookingsPage,
} from "@/pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Owner Login */}
        <Route path="/owner/login" element={<LoginPage />} />

        {/* Protected Owner Routes */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="rooms" element={<AdminRoomsPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
