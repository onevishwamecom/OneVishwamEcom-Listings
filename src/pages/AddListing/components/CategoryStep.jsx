import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Car,
  ShoppingBag,
  Shirt,
  Gem,
  Landmark,
  Wrench,
  Bed,
  Laptop,
  Check,
} from "lucide-react";

export const CATEGORIES_CONFIG = [
  {
    id: "real-estate",
    title: "Real Estate",
    description: "Plots, villas, apartments, commercial & agricultural land",
    icon: Home,
    iconBg: "bg-blue-50 text-blue-600",
    hoverBorder: "hover:border-blue-300",
  },
  {
    id: "vehicle",
    title: "Vehicle",
    description: "Cars, motorcycles, commercial vehicles & EVs",
    icon: Car,
    iconBg: "bg-amber-50 text-amber-600",
    hoverBorder: "hover:border-amber-300",
  },
  {
    id: "grocery",
    title: "Grocery",
    description: "Fresh produce, daily essentials, packaged food & beverages",
    icon: ShoppingBag,
    iconBg: "bg-emerald-50 text-emerald-600",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    id: "garment",
    title: "Garments",
    description: "Men, women & kids apparel, footwear & fashion",
    icon: Shirt,
    iconBg: "bg-purple-50 text-purple-600",
    hoverBorder: "hover:border-purple-300",
  },
  {
    id: "jewellery",
    title: "Jewellery",
    description: "Certified gold, diamonds, silver, platinum & gemstones",
    icon: Gem,
    iconBg: "bg-rose-50 text-rose-600",
    hoverBorder: "hover:border-rose-300",
  },
  {
    id: "finance",
    title: "Financial",
    description: "Home loans, business credit, APF approvals & investments",
    icon: Landmark,
    iconBg: "bg-teal-50 text-teal-600",
    hoverBorder: "hover:border-teal-300",
  },
  {
    id: "service",
    title: "Services",
    description: "Plumbing, electrical, interior design & repairs",
    icon: Wrench,
    iconBg: "bg-slate-100 text-slate-700",
    hoverBorder: "hover:border-slate-400",
  },
  {
    id: "bedding",
    title: "Bedding & Comfort",
    description: "Mattresses, pillows, bedsheets & sleep comfort essentials",
    icon: Bed,
    iconBg: "bg-sky-50 text-sky-600",
    hoverBorder: "hover:border-sky-300",
  },
  {
    id: "electronics",
    title: "Electronics",
    description: "Mobiles, laptops, TV & audio, smart home devices",
    icon: Laptop,
    iconBg: "bg-indigo-50 text-indigo-600",
    hoverBorder: "hover:border-indigo-300",
  },
];

export function CategoryStep({ category, setCategory, isEditing }) {
  const navigate = useNavigate();

  const handleSelect = (categoryId) => {
    if (isEditing && categoryId !== category) return;
    if (setCategory) {
      setCategory(categoryId);
    }
    navigate(`/add-listing/${categoryId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
      {CATEGORIES_CONFIG.map((cat) => {
        const Icon = cat.icon;
        const isSelected = category === cat.id;
        const isDisabled = isEditing && cat.id !== category;

        return (
          <button
            key={cat.id}
            type="button"
            disabled={isDisabled}
            onClick={() => handleSelect(cat.id)}
            className={`group relative flex items-start gap-3.5 p-4 rounded-xl border text-left bg-white transition-all duration-150 ${
              isDisabled
                ? "opacity-40 cursor-not-allowed border-slate-100 bg-slate-50"
                : isSelected
                ? "border-brand-blue bg-blue-50/40 ring-2 ring-brand-blue/20 shadow-xs"
                : `border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-xs ${cat.hoverBorder}`
            }`}
          >
            {/* Soft-Colored Icon Badge */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 ${cat.iconBg}`}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Title & Description */}
            <div className="min-w-0 flex-1 pr-2">
              <h3
                className={`text-sm font-bold truncate transition-colors ${
                  isSelected ? "text-brand-blue" : "text-slate-800 group-hover:text-brand-blue"
                }`}
              >
                {cat.title}
              </h3>
              <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-snug">
                {cat.description}
              </p>
            </div>

            {/* Selection Checkmark */}
            {isSelected && (
              <div className="w-4 h-4 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 shadow-xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}