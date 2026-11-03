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
  Box,
  Check,
} from "lucide-react";
import { PRIMARY_CATEGORIES } from "@/config/listingConfig";

const LUCIDE_ICONS = {
  Home,
  Car,
  ShoppingBag,
  Shirt,
  Gem,
  Landmark,
  Wrench,
  Bed,
  Laptop,
  Box,
};

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
      {PRIMARY_CATEGORIES.map((cat) => {
        const Icon = LUCIDE_ICONS[cat.lucideIconName] || Box;
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
                : `border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-xs ${cat.hoverBorder || "hover:border-blue-300"}`
            }`}
          >
            {/* Soft-Colored Icon Badge */}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                cat.iconBg || "bg-blue-50 text-blue-600"
              }`}
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
                {cat.label}
              </h3>
              <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-snug">
                {cat.desc}
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

export default CategoryStep;