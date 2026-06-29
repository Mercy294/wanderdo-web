export const CATEGORIES = [
  { name: "Culinary", icon: "Coffee", color: "bg-orange-100 text-orange-600" },
  { name: "Adventure", icon: "Mountain", color: "bg-emerald-100 text-emerald-600" },
  { name: "Sports", icon: "Trophy", color: "bg-slate-100 text-slate-700" },
  { name: "Arts", icon: "Palette", color: "bg-violet-100 text-violet-600" },
  { name: "Wellness", icon: "Leaf", color: "bg-teal-100 text-teal-600" },
  { name: "Tours", icon: "MapPin", color: "bg-amber-100 text-amber-600" },
];

export const PRICE_RANGES = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under $40", min: 0, max: 40 },
  { label: "$40 - $70", min: 40, max: 70 },
  { label: "$70 - $100", min: 70, max: 100 },
  { label: "$100+", min: 100, max: Infinity },
];
