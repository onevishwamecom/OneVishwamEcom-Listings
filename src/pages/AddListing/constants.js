import { cities } from "../../data/locations";

export const CATEGORIES = [
  {
    id: "real-estate",
    label: "Real Estate",
    icon: "fa-house-chimney",
    desc: "Plots, Layouts, Villas, Agricultural Land & Commercial Spaces",
    badge: "Channel Partner Intake",
    popular: ["Residential", "Villas", "Plots", "Agricultural", "Commercial", "Industrial"],
    gradient: "from-blue-600 to-indigo-600",
    bgSoft: "bg-blue-50/70",
    borderActive: "border-brand-blue",
    textActive: "text-brand-blue",
    accent: "blue",
    featured: true,
  },
  {
    id: "vehicle",
    label: "Vehicle",
    icon: "fa-car-side",
    desc: "Cars, Two-Wheelers, Commercial Trucks & Electric Vehicles",
    badge: "Automotive",
    popular: ["Cars", "Bikes", "Commercial", "Electric Vehicles"],
    gradient: "from-amber-500 to-amber-600",
    bgSoft: "bg-amber-50/70",
    borderActive: "border-amber-500",
    textActive: "text-amber-700",
    accent: "amber",
  },
  {
    id: "grocery",
    label: "Grocery",
    icon: "fa-basket-shopping",
    desc: "Fresh Farm Produce, Dairy, Packaged Food & Daily Essentials",
    badge: "Daily Essentials",
    popular: ["Fruits & Veg", "Dairy & Eggs", "Packaged Food", "Spices"],
    gradient: "from-emerald-500 to-emerald-600",
    bgSoft: "bg-emerald-50/70",
    borderActive: "border-emerald-500",
    textActive: "text-emerald-700",
    accent: "emerald",
  },
  {
    id: "garment",
    label: "Garments",
    icon: "fa-shirt",
    desc: "Men, Women & Kids Apparel, Ethnic Wear & Footwear",
    badge: "Fashion & Retail",
    popular: ["Ethnic Wear", "Men's Wear", "Women's Wear", "Footwear"],
    gradient: "from-purple-500 to-violet-600",
    bgSoft: "bg-purple-50/70",
    borderActive: "border-purple-500",
    textActive: "text-purple-700",
    accent: "purple",
  },
  {
    id: "jewellery",
    label: "Jewellery",
    icon: "fa-gem",
    desc: "Certified Gold, Silver, Diamonds, Platinum & Solitaires",
    badge: "Precious Metals",
    popular: ["Gold", "Diamond", "Silver", "Platinum", "Gemstones"],
    gradient: "from-rose-500 to-pink-600",
    bgSoft: "bg-rose-50/70",
    borderActive: "border-rose-500",
    textActive: "text-rose-700",
    accent: "rose",
  },
  {
    id: "finance",
    label: "Financial",
    icon: "fa-building-columns",
    desc: "Home Loans, Project APF Approvals, Business Credit & Insurance",
    badge: "Loans & Banking",
    popular: ["Home Loans", "Project APF", "Business Loans", "Insurance"],
    gradient: "from-teal-500 to-cyan-600",
    bgSoft: "bg-teal-50/70",
    borderActive: "border-teal-500",
    textActive: "text-teal-700",
    accent: "teal",
  },
  {
    id: "service",
    label: "Services",
    icon: "fa-screwdriver-wrench",
    desc: "Plumbing, Electrical, Interior Design, Contracting & Maintenance",
    badge: "On-Demand",
    popular: ["Interior Design", "Plumbing", "Electrical", "Repairs"],
    gradient: "from-slate-700 to-slate-800",
    bgSoft: "bg-slate-100",
    borderActive: "border-slate-700",
    textActive: "text-slate-800",
    accent: "slate",
  },
];

export const SUBCATEGORIES = {
  "real-estate": [
    "Apartment",
    "Villa",
    "Plot"
  ],
  vehicle: [
    "Car",
    "Bike",
    "Commercial Vehicle",
    "Auto Rickshaw",
    "Electric Vehicle",
  ],
  grocery: [
    "Fruits",
    "Vegetables",
    "Packaged Food",
    "Dairy & Eggs",
    "Beverages",
    "Snacks",
    "Spices & Condiments",
  ],
  garment: [
    "Men's Wear",
    "Women's Wear",
    "Kids' Wear",
    "Ethnic Wear",
    "Footwear",
    "Accessories",
  ],
  jewellery: [
    "Gold",
    "Silver",
    "Diamond",
    "Platinum",
    "Gemstones",
    "Artificial / Fashion",
  ],
  finance: [
    "Home Loan",
    "Vehicle Loan",
    "Personal Loan",
    "Business Loan",
    "Investment Plans",
    "Insurance",
  ],
  service: [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Cleaning",
    "AC Repair",
    "Painting",
    "Pest Control",
  ],
};

export const STATES = [
  { value: "karnataka", label: "Karnataka" },
];

export const DISTRICTS = {
  karnataka: [
    "Bengaluru Urban",
    "Bengaluru Rural",
  ],
};

export const PRICE_TYPES = [
  { value: "fixed", label: "Fixed Price" },
  { value: "negotiable", label: "Negotiable" },
  { value: "per-month", label: "Per Month (Rent/Lease)" },
  { value: "per-year", label: "Per Year" },
  { value: "on-request", label: "Price on Request" },
];

export const PRICE_UNITS = [
  { value: "exact", label: "₹ (Exact Amount)", multiplier: 1 },
  { value: "thousand", label: "Thousands (K)", multiplier: 1000 },
  { value: "lakh", label: "Lakhs (L)", multiplier: 100000 },
  { value: "crore", label: "Crores (Cr)", multiplier: 10000000 },
];

export const PRICE_SUFFIXES_BY_CATEGORY = {
  "real-estate": ["", "/ Sq. Ft.", "/ month", "/ year", "Onwards"],
  vehicle: ["", "Onwards", "EMI Available"],
  grocery: ["", "/ kg", "/ piece", "/ pack", "/ liter", "/ dozen"],
  garment: ["", "Onwards", "/ piece"],
  jewellery: ["", "/ gram", "/ piece", "+ Making Charges"],
  finance: ["", "% p.a.", "/ year"],
  service: ["", "/ visit", "/ hour", "/ job"],
};

export const CATEGORY_TO_MOCK = {
  "real-estate": "properties",
  vehicle: "vehicles",
  grocery: "groceries",
  garment: "garments",
  jewellery: "jewellery",
  finance: "finance",
};

export const SERVICE_TYPE_TO_CATEGORY = {
  properties: "real-estate",
  vehicles: "vehicle",
  groceries: "grocery",
  garments: "garment",
  jewellery: "jewellery",
  finance: "finance",
};

export const CITY_DATA = cities;