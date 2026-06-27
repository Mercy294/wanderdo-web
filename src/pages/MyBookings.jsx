import { useState, useEffect } from "react";
import { X, Calendar, Clock, Users, Ticket, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function MyBookingsModal({ onClose }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from("experience_bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setBookings(data || []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-orange-500" /> My bookings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Ticket className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold">No bookings yet</p>
              <p className="text-sm">
                Book an experience and it'll show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-gray-900">
                      {b.experience_title}
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 capitalize shrink-0">
                      {b.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />{" "}
                      {new Date(b.booking_date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {b.booking_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {b.participants}{" "}
                      {b.participants > 1 ? "guests" : "guest"}
                    </span>
                  </div>
                  <div className="mt-2 text-right font-extrabold text-gray-900">
                    ${b.total}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
