import { Star, Users, MapPin } from "lucide-react";

const HERO_IMG =
  "https://d64gsuwffb70l.cloudfront.net/6a3e43d837d3c1bbffb17e9f_1782465654463_de34784b.png";

export default function Hero({ onExplore, onHostClick }) {
  return (
    <section className="relative">
      <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
        <img
          src={HERO_IMG}
          alt="People enjoying experiences"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-white text-xs font-semibold mb-5 border border-white/20">
            <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />{" "}
            12,000+ five-star experiences
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white max-w-3xl leading-[1.05] tracking-tight">
            Find your next{" "}
            <span className="text-orange-400">unforgettable</span> thing to do
          </h1>
          <p className="text-white/90 text-lg mt-5 max-w-xl">
            Book hands-on classes, guided adventures, and local tours led by
            passionate hosts around the world.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={onExplore}
              className="px-7 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/30 transition"
            >
              Explore experiences
            </button>
            <button
              onClick={onHostClick}
              className="px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur text-white font-bold border border-white/30 transition"
            >
              Host an experience
            </button>
          </div>

          <div className="flex flex-wrap gap-6 mt-10 text-white">
            <Stat
              icon={<MapPin className="w-5 h-5" />}
              value="80+"
              label="Cities"
            />
            <Stat
              icon={<Users className="w-5 h-5" />}
              value="500K+"
              label="Happy guests"
            />
            <Stat
              icon={<Star className="w-5 h-5" />}
              value="4.9"
              label="Avg rating"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
        {icon}
      </span>
      <div>
        <div className="font-extrabold text-lg leading-none">{value}</div>
        <div className="text-white/70 text-xs">{label}</div>
      </div>
    </div>
  );
}
