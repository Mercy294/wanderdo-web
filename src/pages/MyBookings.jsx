import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  X,
  CheckCircle,
  Clock as ClockIcon,
} from "lucide-react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBookings([
        {
          id: 1,
          experience: {
            id: 1,
            title: "Cooking Class in Tuscany",
            image_url:
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&h=100&fit=crop",
          },
          date: "2026-07-15",
          time: "10:00 AM",
          participants: 2,
          total: 178,
          status: "confirmed",
          created_at: "2026-06-20",
        },
        {
          id: 2,
          experience: {
            id: 4,
            title: "Football Training Session",
            image_url:
              "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&h=100&fit=crop",
          },
          date: "2026-07-20",
          time: "8:00 AM",
          participants: 1,
          total: 65,
          status: "pending",
          created_at: "2026-06-22",
        },
        {
          id: 3,
          experience: {
            id: 2,
            title: "Mountain Hiking Adventure",
            image_url:
              "https://images.unsplash.com/photo-1551632811-561732d1e306?w=100&h=100&fit=crop",
          },
          date: "2026-08-01",
          time: "7:00 AM",
          participants: 3,
          total: 360,
          status: "completed",
          created_at: "2026-06-18",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle };
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: ClockIcon };
      case "cancelled":
        return { color: "bg-red-100 text-red-800", icon: X };
      case "completed":
        return { color: "bg-blue-100 text-blue-800", icon: CheckCircle };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: ClockIcon };
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-500">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <span className="text-sm text-gray-500">
          {bookings.length} bookings
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-400 mb-4">
            <Calendar className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-500">
            Start exploring and book your first experience!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => {
            const StatusIcon = getStatusConfig(booking.status).icon;
            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={booking.experience.image_url}
                      alt={booking.experience.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.experience.title}
                        </h3>
                        <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>
                              {booking.participants} participant
                              {booking.participants > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              ${booking.total}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1.5 ${getStatusConfig(booking.status).color}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {booking.status}
                        </span>
                        {booking.status === "pending" && (
                          <button className="text-sm text-red-600 hover:text-red-800 transition font-medium">
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
