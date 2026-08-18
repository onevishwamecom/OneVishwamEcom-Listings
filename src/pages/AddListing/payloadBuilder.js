import { safeParseInt, safeParseFloat } from "../../utils";

export const buildPayload = (form, category, subcategory, imageUrls, docUrls, brochureUrl, CITY_DATA) => {
  const base = {
    title: form.title,
    subtitle: form.subtitle,
    description: form.description,
    category,
    subcategory,
    price: form.price,
    priceType: form.priceType,
    priceSuffix: form.priceSuffix,
    state: form.state,
    district: form.district,
    city: form.city,
    area: form.area,
    pincode: form.pincode,
    contact: form.contact,
    images: imageUrls,
    documents: docUrls,
    brochure: brochureUrl,
  };

  const payloads = {
    "real-estate": {
      ...base,
      propertyType: form.propertyType,
      bhk: form.bhk,
      bathrooms: form.bathrooms,
      area: `${form.area_sqft} Sq.Ft.`,
      furnishing: form.furnishing,
      floor: form.floor,
      parking: form.parking,
      extraRoom: form.extraRoom,
      projectCount: Math.max(0, safeParseInt(form.projectCount)),
      totalUnits: Math.max(0, safeParseInt(form.totalUnits)),
      availableUnits: Math.max(0, safeParseInt(form.availableUnits)),
      location: `${form.area}, ${CITY_DATA[form.city]?.label || form.city}`,
    },
    vehicle: {
      ...base,
      make: form.brand,
      model: form.model,
      year: Math.max(1900, safeParseInt(form.year)),
      condition: form.condition || "used",
      category: form.categoryVehicle || "4-wheeler",
      fuelType: form.fuelType || "Petrol",
      transmission: form.transmission || undefined,
      kmDriven: Math.max(0, safeParseInt(form.kmDriven)),
      priceValue: Math.max(0, safeParseFloat(String(form.price).replace(/[₹,\s]/g, ""))),
      location: form.area,
    },
    grocery: {
      ...base,
      name: form.title,
      unit: form.unit,
      stock: Math.max(0, safeParseInt(form.quantity)),
      location: `${form.area}, ${CITY_DATA[form.city]?.label || form.city}`,
    },
    garment: {
      ...base,
      name: form.title,
      size: form.size,
      color: form.color,
      location: `${form.area}, ${CITY_DATA[form.city]?.label || form.city}`,
    },
    jewellery: {
      ...base,
      name: form.title,
      material: form.material,
      purity: form.purity,
      weight: Math.max(0, safeParseFloat(form.weight)),
      weightUnit: "grams",
      gemstone: form.gemstone,
      location: `${form.area}, ${CITY_DATA[form.city]?.label || form.city}`,
    },
    finance: {
      ...base,
      name: form.title,
      type: form.serviceType,
      provider: "OneVishwam Finance",
      location: `${form.area}, ${CITY_DATA[form.city]?.label || form.city}`,
    },
    service: { ...base, location: form.area },
  };

  return payloads[category];
};

export const createNewListingData = (form, category, subcategory, imageUrls, docUrls, brochureUrl) => {
  const listingId = `LST${Date.now().toString().slice(-6)}`;
  return {
    _id: `lst-${Date.now()}`,
    listingId,
    title: form.title,
    subtitle: form.subtitle || "",
    description: form.description || "",
    price: form.price,
    priceSuffix: form.priceSuffix || "",
    priceType: form.priceType,
    category,
    subcategory,
    city: form.city,
    area: form.area,
    state: form.state,
    district: form.district,
    pincode: form.pincode,
    contact: form.contact,
    status: "pending",
    images: imageUrls,
    documents: docUrls,
    brochure: brochureUrl,
    createdAt: new Date().toISOString(),
  };
};

export const createUpdatedListingData = (form, category, subcategory, imageUrls, docUrls, brochureUrl) => {
  return {
    title: form.title,
    subtitle: form.subtitle || "",
    description: form.description || "",
    price: form.price,
    priceSuffix: form.priceSuffix || "",
    priceType: form.priceType,
    category,
    subcategory,
    city: form.city,
    area: form.area,
    state: form.state,
    district: form.district,
    pincode: form.pincode,
    contact: form.contact,
    status: "pending",
    images: imageUrls,
    documents: docUrls,
    brochure: brochureUrl,
    updatedAt: new Date().toISOString(),
    adminComment: null,
  };
};