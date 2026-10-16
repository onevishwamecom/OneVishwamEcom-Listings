import React from "react";
import { Link } from "react-router-dom";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { SUBCATEGORIES, CATEGORIES } from "../constants";
import { FormSection, FormFieldGroup } from "@/components/ui/PageContainer";

export function BasicInfoStep({ form, updateForm, validationErrors }) {
  const currentCategoryObj = CATEGORIES.find((c) => c.id === form.category);
  const categoryLabel = currentCategoryObj?.label || "Products";

  return (
    <FormSection title="Basic Information" description="Provide the main information for your listing">
      <FormFieldGroup>
        <Input
          id="title"
          label="Product / Listing Name"
          value={form.title}
          onChange={(e) => updateForm("title", e.target.value)}
          placeholder="e.g. 3 BHK Luxury Apartment in Whitefield"
          required
          error={validationErrors.title}
        />

        <Input
          id="subtitle"
          label="Short Description"
          value={form.subtitle}
          onChange={(e) => updateForm("subtitle", e.target.value)}
          placeholder="e.g. Ready to move, fully furnished, near metro"
        />
      </FormFieldGroup>

      {form.category && (
        <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-blue-50/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs my-2">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <i className="fa-solid fa-file-excel text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Bulk Excel Listing Available
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Fast Intake
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Have multiple {categoryLabel.toLowerCase()} to list? Upload them all at once using our official Excel template.
              </p>
            </div>
          </div>
          <Link
            to={`/bulk-listing/${form.category}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow shrink-0 cursor-pointer"
          >
            <i className="fa-solid fa-cloud-arrow-up" />
            <span>Bulk Upload {categoryLabel}</span>
          </Link>
        </div>
      )}

      {form.category && (
        <FormFieldGroup>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Subcategory <span className="text-red-500">*</span>
          </label>
          <Select
            id="subcategory"
            label=""
            value={form.subcategory}
            onChange={(e) => updateForm("subcategory", e.target.value)}
            options={SUBCATEGORIES[form.category] || []}
            placeholder="Select Subcategory"
            required
            error={validationErrors.subcategory}
          />
        </FormFieldGroup>
      )}

      <FormFieldGroup>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Detailed Description <span className="text-xs font-normal text-slate-400 font-sans ml-1">(Optional)</span>
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => updateForm("description", e.target.value)}
          placeholder="Describe your item in detail. Highlight key features, condition, and benefits..."
          className={`w-full rounded-2xl border bg-slate-50/50 px-4 py-3 text-sm outline-none resize-none transition-all duration-200 ${
            validationErrors.description
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:bg-white"
              : "border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300"
          }`}
        />
        {validationErrors.description && (
          <p className="mt-1 text-xs font-semibold text-red-500 animate-fade-in">{validationErrors.description}</p>
        )}
      </FormFieldGroup>
    </FormSection>
  );
}