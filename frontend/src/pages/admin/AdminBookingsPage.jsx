import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { adminBookingService } from "@/services";
import { formatCurrency } from "@/lib/utils";

/**
 * Admin Bookings Management page
 */
export function AdminBookingsPage() {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all",
  );

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminBookingService.getBookings({
        status: statusFilter === "all" ? undefined : statusFilter,
        page: pagination.page,
        limit: 10,
        search: searchQuery || undefined,
      });
      setBookings(response.data || []);
      setPagination((prev) => ({ ...prev, ...response.pagination }));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, pagination.page, searchQuery]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await adminBookingService.updateStatus(bookingId, { status: newStatus });
      toast.success(
        `Booking ${newStatus === "confirmed" ? "confirmed" : "updated"} successfully`,
      );
      fetchBookings();
      setSelectedBooking(null);
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: { variant: "success", icon: CheckCircle, label: "Confirmed" },
      awaiting_payment: { variant: "warning", icon: Clock, label: "Pending" },
      expired: { variant: "destructive", icon: XCircle, label: "Expired" },
      cancelled: { variant: "destructive", icon: XCircle, label: "Cancelled" },
    };
    const {
      variant,
      icon: Icon,
      label,
    } = variants[status] || variants.awaiting_payment;
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-sand-900 mb-2">
          Bookings Management
        </h1>
        <p className="text-sand-600">View and manage all reservations</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                placeholder="Search by reference, email, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPagination({ ...pagination, page: 1 });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="awaiting_payment">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sand-900 mx-auto" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-sand-600">
              No bookings found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>
                      <span className="font-mono text-sm font-medium">
                        {booking.bookingReference}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.guestName}</div>
                        <div className="text-sm text-sand-500">
                          {booking.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.roomId?.name || "N/A"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(new Date(booking.checkIn), "MMM d")}</div>
                        <div className="text-sand-500">
                          to {format(new Date(booking.checkOut), "MMM d, yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                    <TableCell>
                      {getStatusBadge(booking.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                              Reference: {selectedBooking?.bookingReference}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedBooking && (
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-sand-500">Guest Name</p>
                                  <p className="font-medium">
                                    {selectedBooking.guestName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sand-500">Email</p>
                                  <p className="font-medium">
                                    {selectedBooking.email}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sand-500">Phone</p>
                                  <p className="font-medium">
                                    {selectedBooking.phone}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sand-500">Room</p>
                                  <p className="font-medium">
                                    {selectedBooking.roomId?.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sand-500">Check-in</p>
                                  <p className="font-medium">
                                    {format(
                                      new Date(selectedBooking.checkIn),
                                      "MMM d, yyyy",
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sand-500">Check-out</p>
                                  <p className="font-medium">
                                    {format(
                                      new Date(selectedBooking.checkOut),
                                      "MMM d, yyyy",
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sand-500">Guests</p>
                                  <p className="font-medium">
                                    {selectedBooking.guests?.adults} Adults
                                    {selectedBooking.guests?.children > 0 &&
                                      `, ${selectedBooking.guests.children} Children`}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sand-500">Total Amount</p>
                                  <p className="font-medium">
                                    {formatCurrency(
                                      selectedBooking.totalAmount,
                                    )}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-sand-500">Status</p>
                                  {getStatusBadge(
                                    selectedBooking.paymentStatus,
                                  )}
                                </div>
                                {selectedBooking.verificationCode && (
                                  <div className="col-span-2 p-4 bg-amber-50 rounded-lg">
                                    <p className="text-sand-500 text-xs mb-1">
                                      Verification Code (for guest)
                                    </p>
                                    <p className="font-mono text-2xl font-bold text-amber-700">
                                      {selectedBooking.verificationCode}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            {selectedBooking?.paymentStatus ===
                              "awaiting_payment" && (
                              <Button
                                onClick={() =>
                                  handleStatusChange(
                                    selectedBooking._id,
                                    "confirmed",
                                  )
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm Booking
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={pagination.page <= 1}
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sand-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page >= pagination.pages}
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default AdminBookingsPage;
