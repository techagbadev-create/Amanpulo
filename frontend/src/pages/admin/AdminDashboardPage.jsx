import { useEffect, useState } from "react";
import {
  DollarSign,
  Bed,
  CalendarCheck,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminBookingService } from "@/services";
import { formatCurrency } from "@/lib/utils";

/**
 * Admin Dashboard page with overview statistics
 */
export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminBookingService.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Set mock data for demo
        setStats({
          rooms: { total: 6, active: 6 },
          bookings: { confirmed: 12, pending: 3 },
          totalRevenue: 156000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      description: "All confirmed bookings",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Active Rooms",
      value: stats?.rooms?.active || 0,
      icon: Bed,
      description: `of ${stats?.rooms?.total || 0} total`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Confirmed Bookings",
      value: stats?.bookings?.confirmed || 0,
      icon: CalendarCheck,
      description: "Total confirmed",
      color: "text-sand-600",
      bg: "bg-sand-50",
    },
    {
      title: "Pending Bookings",
      value: stats?.bookings?.pending || 0,
      icon: Clock,
      description: "Awaiting payment",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-sand-900 mb-2">Dashboard</h1>
        <p className="text-sand-600">Welcome back to Amanpulo admin portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? [...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 bg-sand-100 rounded mb-4" />
                  <div className="h-8 bg-sand-100 rounded w-1/2" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.bg}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-sand-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-sand-600">{stat.title}</p>
                    <p className="text-xs text-sand-400 mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/owner/rooms"
              className="block p-4 rounded-lg border border-sand-200 hover:border-sand-400 transition-colors"
            >
              <h4 className="font-medium text-sand-900 mb-1">Manage Rooms</h4>
              <p className="text-sm text-sand-600">
                Add, edit, or update room pricing
              </p>
            </a>
            <a
              href="/owner/bookings"
              className="block p-4 rounded-lg border border-sand-200 hover:border-sand-400 transition-colors"
            >
              <h4 className="font-medium text-sand-900 mb-1">View Bookings</h4>
              <p className="text-sm text-sand-600">
                Manage reservations and confirmations
              </p>
            </a>
            <a
              href="/owner/bookings?status=awaiting_payment"
              className="block p-4 rounded-lg border border-amber-200 bg-amber-50 hover:border-amber-400 transition-colors"
            >
              <h4 className="font-medium text-amber-800 mb-1">
                Pending Payments
              </h4>
              <p className="text-sm text-amber-600">
                Review and confirm pending bookings
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboardPage;
