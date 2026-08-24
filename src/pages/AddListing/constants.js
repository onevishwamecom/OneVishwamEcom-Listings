import { cities } from "../../data/locations";

export const CATEGORIES = [
  {
    id: "real-estate",
    label: "Real Estate",
    icon: "fa-house-chimney",
    desc: "House, Plot, Apartment",
    gradient: "from-brand-blue to-brand-blue/60",
  },
  {
    id: "vehicle",
    label: "Vehicle",
    icon: "fa-car",
    desc: "Car, Bike, Commercial",
    gradient: "from-brand-gold to-brand-gold/60",
  },
  {
    id: "grocery",
    label: "Grocery",
    icon: "fa-basket-shopping",
    desc: "Food, Beverages, Daily",
    gradient: "from-brand-orange to-brand-orange/60",
  },
  {
    id: "garment",
    label: "Garment",
    icon: "fa-shirt",
    desc: "Clothes, Fashion",
    gradient: "from-slate-400 to-slate-500",
  },
  {
    id: "jewellery",
    label: "Jewellery",
    icon: "fa-gem",
    desc: "Gold, Silver, Stones",
    gradient: "from-brand-blue to-brand-blue/70",
  },
  {
    id: "finance",
    label: "Financial",
    icon: "fa-building-columns",
    desc: "Loan, Investment",
    gradient: "from-brand-gold to-brand-orange",
  },
  {
    id: "service",
    label: "Services",
    icon: "fa-wrench",
    desc: "Plumbing, Repairs",
    gradient: "from-slate-500 to-gray-500",
  },
];

export const SUBCATEGORIES = {
  "real-estate": [
    "Apartment",
    "Villa",
    "Plot",
    "Commercial Property",
    "PG / Co-living",
    "Office Space",
    "Warehouse",
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