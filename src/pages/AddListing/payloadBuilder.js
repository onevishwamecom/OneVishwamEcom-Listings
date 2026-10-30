import { safeParseInt, safeParseFloat } from "../../utils";
import { PRICE_UNITS } from "./constants";

export const buildPayload = (form, category, subcategory, imageUrls, docUrls, brochureUrl, CITY_DATA = {}) => {
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

  const formattedLocation = [form.address, form.area, cityLabel].filter(Boolean).join(", ");

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
    address: form.address || "",
    landmark: form.landmark || "",
    location: formattedLocation || form.area || "",
    mapUrl: form.mapUrl || "",
    pincode: form.pincode || "",
    contact: form.contact || "",
    images: (imageUrls || []).slice(0, 5),
    documents: docUrls || [],
    vendorName: form.vendorName || form.channelPartnerName || "",
    channelPartnerName: form.channelPartnerName || form.vendorName || "",
    origin: form.origin || undefined,
    propertyType: form.propertyType || finalSubcategory || "",
    bankLoanDetails: form.bankLoanDetails || "",
    loanApproved: Boolean(form.bankLoanDetails && !form.bankLoanDetails.toLowerCase().includes('no')),
    details: (() => {
      const d = { ...(form.details || {}) };
      delete d.channelPartnerName;
      delete d.vendorName;
      delete d.propertyName;
      delete d.expectedPrice;
      delete d.description;
      delete d.possessionStatus;
      delete d.listerId;
      delete d.negotiable;
      delete d.locationUrl;
      delete d.googleMapsUrl;
      delete d.googleMapUrl;
      delete d.mapEmbedUrl;
      const mUrl = form.mapUrl || "";
      if (mUrl) {
        d.mapUrl = mUrl;
      }
      return d;
    })(),
  };

  const propDetails = form.details || {};
  const propTitle =
    propDetails.propertyName ||
    propDetails.projectName ||
    form.title ||
    `${form.propertyType || 'Residential'} Property`;
  const propPrice = propDetails.expectedPrice || displayPrice || form.price || '';
  const propArea =
    propDetails.superBuiltUpArea ||
    propDetails.totalLandArea ||
    propDetails.totalLandExtent ||
    propDetails.carpetArea ||
    propDetails.builtUpArea ||
    propDetails.dimensions ||
    form.area_sqft ||
    '';

  const propertiesPayload = {
    ...base,
    title: propTitle,
    price: propPrice,
    rawPrice: numericPrice || safeParseFloat(String(propPrice).replace(/[^\d.]/g, '')),
    numericPrice: numericPrice || safeParseFloat(String(propPrice).replace(/[^\d.]/g, '')),
    propertyType: form.propertyType || finalSubcategory || "Plot",
    vendorName: form.vendorName || base.vendorName || "",
    channelPartnerName: form.channelPartnerName || base.channelPartnerName || "",
    origin: form.origin || base.origin || undefined,
    bankLoanDetails: form.bankLoanDetails || base.bankLoanDetails || (form.loanApproved === 'Yes' ? 'Bank Loan Approved' : ''),
    loanApproved: form.loanApproved === 'Yes' || form.loanApproved === true || Boolean(form.bankLoanDetails && !form.bankLoanDetails.toLowerCase().includes('no')),
    details: propDetails,
    bhk: propDetails.bhk || form.bhk || "",
    bathrooms: propDetails.bathrooms || form.bathrooms || "",
    balconies: safeParseInt(propDetails.balconies) || safeParseInt(form.balconies) || 0,
    area_sqft: propArea || form.area_sqft || "",
    area: form.area || (propArea ? `${propArea}` : ""),
    landmark: form.landmark || "",
    furnishing: propDetails.furnishing || form.furnishing || "",
    floor: propDetails.floor || form.floor || "",
    floors: propDetails.floors || propDetails.totalFloors || form.floors || "",
    towers: propDetails.towers || form.towers || "",
    facing: propDetails.facing || propDetails.plotFacing || form.facing || "",
    possessionStatus: propDetails.possessionStatus || propDetails.possession || form.possessionStatus || form.possession || "",
    parking: propDetails.parking || propDetails.parkingCapacity || form.parking || "",
    extraRoom: propDetails.extraRoom || form.extraRoom || "",
    approval: propDetails.approvalAuthority || propDetails.approvalZone || form.approval || "",
    gatedCommunity: propDetails.gatedCommunity === 'Yes',
    negotiable: propDetails.negotiable === 'Yes' || form.negotiable === true,
    amenities: Array.isArray(propDetails.amenities)
      ? propDetails.amenities
      : Array.isArray(propDetails.utilities)
      ? propDetails.utilities
      : Array.isArray(propDetails.waterAvailability)
      ? propDetails.waterAvailability
      : form.amenities || [],
    projectCount: safeParseInt(form.projectCount) || safeParseInt(propDetails.projectCount) || 0,
    totalUnits: form.totalUnits || propDetails.totalUnits || "",
    availableUnits: safeParseInt(form.availableUnits) || safeParseInt(propDetails.availableUnits) || 0,
    location: `${form.area || ""}${cityLabel ? `, ${cityLabel}` : ""}`,
  };
  delete propertiesPayload.subcategory;

  const payloads = {
    properties: propertiesPayload,
    "real-estate": propertiesPayload,
    vehicle: {
      ...base,
      _type: "vehicles",
      category: "vehicle",
      title: form.title || `${form.brand || ""} ${form.model || ""} ${form.year || ""}`.trim() || "Automobile Listing",
      brand: form.brand || "",
      make: form.brand || "",
      model: form.model || "",
      bodyType: form.bodyType || (form.categoryVehicle === "2-Wheeler" ? "Cruiser / Bike" : "Hatchback"),
      year: Math.max(1900, safeParseInt(form.year)),
      condition: (form.condition || "used").toLowerCase().includes("new") ? "new" : "old",
      subcategory: finalSubcategory || form.categoryVehicle || "Car",
      categoryVehicle: form.categoryVehicle?.toLowerCase() || (finalSubcategory === "Bike" ? "2-wheeler" : finalSubcategory === "Auto Rickshaw" ? "3-wheeler" : finalSubcategory === "Commercial Vehicle" ? "commercial" : "4-wheeler"),
      wheelerType: form.categoryVehicle?.toLowerCase() || (finalSubcategory === "Bike" ? "2-wheeler" : finalSubcategory === "Auto Rickshaw" ? "3-wheeler" : finalSubcategory === "Commercial Vehicle" ? "commercial" : "4-wheeler"),
      fuelType: form.fuelType || "Petrol",
      transmission: form.transmission || "Manual",
      mileage: form.mileage || "",
      kmDriven: Math.max(0, safeParseInt(form.kmDriven)),
      loanApproved: form.loanApproved === "Yes" || form.loanApproved === true,
      priceValue: numericPrice || Math.max(0, safeParseFloat(String(form.price).replace(/[₹,\s]/g, ""))),
      priceSuffix: form.priceSuffix || ((form.condition || "").toLowerCase().includes("new") ? "Ex-Showroom" : "Pre-Owned"),
      location: formattedLocation || form.area || (cityLabel ? `${cityLabel}, Karnataka` : "Bengaluru"),
      showroom: (form.showroomName || form.showroomAddress || form.showroomPhone || form.showroomEmail) ? {
        name: form.showroomName || `${form.brand || "Authorized"} Dealership`,
        address: form.showroomAddress || formattedLocation,
        phone: form.showroomPhone || form.contact || "8546996622",
        email: form.showroomEmail || "ceo@onevishwam.com",
        type: "Authorized Dealership",
        mapUrl: form.mapUrl || "",
      } : null,
      variants: Array.isArray(form.variants)
        ? form.variants
        : typeof form.variants === "string" && form.variants.trim()
        ? form.variants.split(",").map((v) => {
            const parts = v.split("-").map((p) => p.trim());
            return {
              variant: parts[0] || v.trim(),
              price: parts[1] || displayPrice || form.price || "",
            };
          })
        : [],
      features: Array.isArray(form.features)
        ? form.features
        : typeof form.features === "string" && form.features.trim()
        ? form.features.split(",").map((f) => f.trim()).filter(Boolean)
        : [],
      statusBadges: [
        (form.loanApproved === "Yes" || form.loanApproved === true) ? { label: "Loan Pre-Approved", className: "bg-blue-600 text-white" } : null,
        {
          label: (form.condition || "new").toLowerCase().includes("new") ? "Brand New" : "Certified Pre-Owned",
          className: (form.condition || "new").toLowerCase().includes("new") ? "bg-emerald-600 text-white" : "bg-slate-700 text-white",
        },
      ].filter(Boolean),
      cardPills: [form.fuelType || "Petrol", form.transmission || "Manual", form.year ? `${form.year}` : null].filter(Boolean),
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
    bedding: {
      ...base,
      name: form.title,
      material: form.material || "",
      size: form.size || "",
      thickness: form.thickness || "",
      firmness: form.firmness || "",
      brand: form.brand || "",
      location: `${form.area || ""}${cityLabel ? `, ${cityLabel}` : ""}`,
    },
    electronics: {
      ...base,
      name: form.title,
      brand: form.brand || "",
      model: form.model || "",
      condition: form.condition || "New",
      warranty: form.warranty || "",
      location: `${form.area || ""}${cityLabel ? `, ${cityLabel}` : ""}`,
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