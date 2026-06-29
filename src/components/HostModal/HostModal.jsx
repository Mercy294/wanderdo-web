import { useEffect } from "react";
import { X, Sparkles, Globe } from "lucide-react";

export default function HostModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Become a host
              </h2>
              <p className="text-sm text-gray-500">
                Share your passion with travelers worldwide.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-8 space-y-6">
          <div className="rounded-3xl bg-orange-50 p-5 text-orange-700">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Fast setup</span>
            </div>
            <p className="mt-3 text-sm text-orange-700/90">
              Create a listing, set your schedule, and host experiences in
              hours.
            </p>
          </div>

          <form className="grid gap-4">
            <label className="space-y-2 text-sm text-gray-700">
              <span>Name</span>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              <span>Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
              />
            </label>
            <label className="space-y-2 text-sm text-gray-700">
              <span>Experience type</span>
              <input
                type="text"
                placeholder="Cooking class, hiking tour, workshop..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300"
              />
            </label>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Start hosting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
