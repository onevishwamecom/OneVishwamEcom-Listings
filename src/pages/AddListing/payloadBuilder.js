import { safeParseInt, safeParseFloat } from "../../utils";
import { PRICE_UNITS } from "./constants";

export const buildPayload = (form, category, subcategory, imageUrls, docUrls, brochureUrl, videoUrl = null, CITY_DATA = {}) => {
  const finalSubcategory = subcategory || form.subcategory || "";
  const cityLabel = CITY_DATA?.[form.city]?.label || form.city || "";

  // Compute numeric price from raw input × unit multiplier
  const rawPrice = safeParseFloat(String(form.price).replace(/[^\d.]/g, ''));
  const unitMultiplier = PRICE_UNITS.find((u) => u.value === (form.priceUnit || 'exact'))?.multiplier || 1;
  const numericPrice = rawPrice * unitMultiplier;

  // Format display price string in Indian notation
  let displayPrice = '';
  if (numericPrice > 0) {
    if (numericPrice >= 10000000) {
      const cr = numericPrice / 10000000;
      displayPrice = `₹${cr % 1 === 0 ? cr : cr.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} Cr`;
    } else if (numericPrice >= 100000) {
      const l = numericPrice / 100000;
      displayPrice = `₹${l % 1 === 0 ? l : l.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} L`;
    } else {
      displayPrice = `₹${numericPrice.toLocaleString('en-IN')}`;
    }
  } else {
    displayPrice = form.price || '';
  }

  const base = {
    title: form.title,
    subtitle: form.subtitle || "",
    description: form.description || "",
    category,
    subcategory: finalSubcategory,
    price: displayPrice,
    numericPrice,
    priceType: form.priceType || "fixed",
    priceSuffix: form.priceSuffix || "",
    state: form.state || "karnataka",
    district: form.district || "Bengaluru Urban",
    city: form.city || "bengaluru",
    area: form.area || "",
    pincode: form.pincode || "",
    contact: form.contact || "",
    images: imageUrls || [],
    video: videoUrl || null,
    videoUrl: videoUrl || null,
    videos: videoUrl ? [videoUrl] : [],
    documents: docUrls || [],
    brochure: brochureUrl || null,
  };

  const payloads = {
    "real-estate": {
      ...base,
      subcategory: finalSubcategory || form.subcategory || "",
      propertyType: finalSubcategory || form.subcategory || "",
      bhk: form.bhk || "",
      bathrooms: form.bathrooms || "",
      area_sqft: form.area_sqft || "",
      area: form.area_sqft ? `${form.area_sqft} Sq.Ft.` : form.area || "",
      furnishing: form.furnishing || "",
      floor: form.floor || "",
      floors: form.floors || "",
      towers: form.towers || "",
      approval: form.approval || "",
      possession: form.possession || "",
      possessionStatus: form.possession || "",
      loanApproved: form.loanApproved === "Yes" || form.loanApproved === true,
      parking: form.parking || "",
      extraRoom: form.extraRoom || "",
      projectCount: Math.max(0, safeParseInt(form.projectCount)),
      totalUnits: Math.max(0, safeParseInt(form.totalUnits)),
      availableUnits: Math.max(0, safeParseInt(form.availableUnits)),
      location: `${form.area || ""}${cityLabel ? `, ${cityLabel}` : ""}`,
      details: form.description || "",
      rawPrice: numericPrice || undefined,
      pdfUrl: brochureUrl || null,
    },
    vehicle: {
      ...base,
      brand: form.brand || "",
      make: form.brand || "",
      model: form.model || "",
      year: Math.max(1900, safeParseInt(form.year)),
      condition: (form.condition || "used").toLowerCase().includes("new") ? "new" : "old",
      category: form.categoryVehicle?.toLowerCase() || (finalSubcategory === "Bike" ? "2-wheeler" : finalSubcategory === "Auto Rickshaw" ? "3-wheeler" : finalSubcategory === "Commercial Vehicle" ? "commercial" : "4-wheeler"),
      wheelerType: form.categoryVehicle?.toLowerCase() || (finalSubcategory === "Bike" ? "2-wheeler" : finalSubcategory === "Auto Rickshaw" ? "3-wheeler" : finalSubcategory === "Commercial Vehicle" ? "commercial" : "4-wheeler"),
      fuelType: form.fuelType || "Petrol",
      transmission: form.transmission || undefined,
      kmDriven: Math.max(0, safeParseInt(form.kmDriven)),
      priceValue: numericPrice || Math.max(0, safeParseFloat(String(form.price).replace(/[₹,\s]/g, ""))),
      location: form.area || "",
    },
    grocery: {
      ...base,
      name: form.title,
      unit: form.unit || "Pack",
      stock: Math.max(0, safeParseInt(form.quantity)),
      location: `${form.area || ""}${cityLabel ? `, ${cityLabel}` : ""}`,
    },
    garment: {
      ...base,
      name: form.title,
      size: form.size || "",
      color: form.color || "",
      location: `${form.area || ""}${cityLabel ? `, ${cityLabel}` : ""}`,
    },
    jewellery: {
      ...base,
      name: form.title,
      material: form.material || finalSubcategory || "Gold",
      metalType: form.material || finalSubcategory || "Gold",
      purity: form.purity || "",
      weight: Math.max(0, safeParseFloat(form.weight)),
      weightGrams: Math.max(0, safeParseFloat(form.weight)),
      weightUnit: "grams",
      gemstone: form.gemstone || "",
      location: `${form.area || ""}${cityLabel ? `, ${cityLabel}` : ""}`,
    },
    finance: {
      ...base,
      name: form.title,
      serviceName: form.title,
      serviceType: finalSubcategory || form.serviceType || "",
      type: finalSubcategory || form.serviceType || "",
      provider: "OneVishwam Finance",
      companyName: form.subtitle || form.title || "OneVishwam Finance",
      location: `${form.area || ""}${cityLabel ? `, ${cityLabel}` : ""}`,
    },
    service: {
      ...base,
      serviceType: finalSubcategory || form.serviceType || "",
      experience: Math.max(0, safeParseInt(form.experience)),
      location: form.area || "",
    },
  };

  return payloads[category] || base;
};

export const createNewListingData = (form, category, subcategory, imageUrls, docUrls, brochureUrl, videoUrl = null, CITY_DATA = {}) => {
  const data = buildPayload(form, category, subcategory, imageUrls, docUrls, brochureUrl, videoUrl, CITY_DATA);
  const listingId = `LST${Date.now().toString().slice(-6)}`;
  return {
    ...data,
    listingId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
};

export const createUpdatedListingData = (form, category, subcategory, imageUrls, docUrls, brochureUrl, videoUrl = null, CITY_DATA = {}) => {
  const data = buildPayload(form, category, subcategory, imageUrls, docUrls, brochureUrl, videoUrl, CITY_DATA);
  return {
    ...data,
    status: "pending",
    updatedAt: new Date().toISOString(),
    adminComment: null,
  };
};