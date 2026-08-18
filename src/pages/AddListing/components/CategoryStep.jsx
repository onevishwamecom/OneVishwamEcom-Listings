import { CATEGORIES } from "../constants";

export function CategoryStep({ category, setCategory, isEditing }) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Select Category</h2>
        <p className="text-sm text-slate-500 mt-1">What kind of item are you listing?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          const disabled = isEditing && cat.id !== category;
          return (
            <button
              key={cat.id}
              onClick={() => !disabled && setCategory(cat.id)}
              disabled={disabled}
              className={`group flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                disabled
                  ? "opacity-50 cursor-not-allowed border-slate-100 bg-slate-50"
                  : isActive
                  ? "border-brand-blue bg-blue-50/50 shadow-glow-sm"
                  : "border-slate-100 bg-white hover:border-blue-200 hover:shadow-card hover:-translate-y-1"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${cat.gradient} text-white shadow-sm`
                    : "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-brand-blue"
                }`}
              >
                <i className={`fa-solid ${cat.icon}`} />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <h3 className={`font-bold text-base ${isActive ? "text-brand-blue" : "text-slate-700 group-hover:text-brand-blue"}`}>
                  {cat.label}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">{cat.desc}</p>
              </div>
              {isActive && (
                <div className="shrink-0 pt-1">
                  <i className="fa-solid fa-circle-check text-brand-blue text-xl animate-scale-in" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}