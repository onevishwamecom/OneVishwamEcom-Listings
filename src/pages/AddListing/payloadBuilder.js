import { safeParseInt, safeParseFloat } from "../../utils";

export const buildPayload = (form, category, subcategory, imageUrls, docUrls, brochureUrl, CITY_DATA = {}) => {
  const finalSubcategory = subcategory || form.subcategory || "";
  const cityLabel = CITY_DATA?.[form.city]?.label || form.city || "";

  const base = {
    title: form.title,
    subtitle: form.subtitle || "",
    description: form.description || "",
    category,
    subcategory: finalSubcategory,
    price: form.price,
    priceType: form.priceType || "fixed",
    priceSuffix: form.priceSuffix || "",
    state: form.state || "karnataka",
    district: form.district || "Bengaluru Urban",
    city: form.city || "bengaluru",
    area: form.area || "",
    pincode: form.pincode || "",
    contact: form.contact || "",
    images: imageUrls || [],
    documents: docUrls || [],
    brochure: brochureUrl || null,
  };

  const payloads = {
    "real-estate": {
      ...base,
      propertyType: finalSubcategory || form.propertyType || "",
      bhk: form.bhk || "",
      bathrooms: form.bathrooms || "",
      area_sqft: form.area_sqft || "",
      area: form.area_sqft ? `${form.area_sqft} Sq.Ft.` : form.area || "",
      furnishing: form.furnishing || "",
      floor: form.floor || "",
      parking: form.parking || "",
      extraRoom: form.extraRoom || "",
      projectCount: Math.max(0, safeParseInt(form.projectCount)),
      totalUnits: Math.max(0, safeParseInt(form.totalUnits)),
      availableUnits: Math.max(0, safeParseInt(form.availableUnits)),
      location: `${form.area || ""}${cityLabel ? `, ${cityLabel}` : ""}`,
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
      priceValue: Math.max(0, safeParseFloat(String(form.price).replace(/[₹,\s]/g, ""))),
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

export const createNewListingData = (form, category, subcategory, imageUrls, docUrls, brochureUrl, CITY_DATA = {}) => {
  const data = buildPayload(form, category, subcategory, imageUrls, docUrls, brochureUrl, CITY_DATA);
  const listingId = `LST${Date.now().toString().slice(-6)}`;
  return {
    ...data,
    listingId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
};

export const createUpdatedListingData = (form, category, subcategory, imageUrls, docUrls, brochureUrl, CITY_DATA = {}) => {
  const data = buildPayload(form, category, subcategory, imageUrls, docUrls, brochureUrl, CITY_DATA);
  return {
    ...data,
    status: "pending",
    updatedAt: new Date().toISOString(),
    adminComment: null,
  };
};