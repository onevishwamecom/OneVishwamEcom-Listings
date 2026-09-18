import { SERVICE_CONFIG } from './constants';

export function getCategoryInfo(listing) {
  const config = SERVICE_CONFIG[listing._type] || { label: listing._type, icon: 'fa-box', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  return config;
}

export function getSubcategory(listing) {
  if (listing.subcategory || listing.subCategory) return listing.subcategory || listing.subCategory;
  if (listing._type === 'vehicles' && listing.category) return listing.category;
  if (listing._type === 'groceries') return 'Packaged Food';
  if (listing._type === 'garments') return "Men's Wear";
  if (listing._type === 'jewellery' && listing.material) return listing.material;
  if (listing._type === 'finance' && listing.type) return listing.type;
  return '—';
}

export function getLocationDetails(listing) {
  return {
    state: listing.state || 'Karnataka',
    district: listing.district || 'Bengaluru Urban',
    city: listing.city || 'bengaluru',
    area: listing.area || '—',
    pincode: listing.pincode || '—',
  };
}

export function getPriceType(listing) {
  if (listing.priceType) return listing.priceType;
  if (listing.priceSuffix === '/ Per Month' || listing.priceSuffix === '/ Per Year') return 'rent';
  if (listing.priceSuffix === 'Negotiable') return 'negotiable';
  return 'fixed';
}

export function getPriceTypeLabel(type) {
  const labels = {
    fixed: 'Fixed Price',
    negotiable: 'Negotiable',
    rent: 'Rent / Lease',
    'per-month': 'Per Month',
    'per-year': 'Per Year',
    'on-request': 'Price on Request',
  };
  return labels[type] || labels.fixed;
}

export function getCategoryFields(listing) {
  const type = listing._type;
  const fields = [];

  if (type === 'properties') {
    if (listing.subcategory || listing.subCategory || listing.propertyType) fields.push({ label: 'Subcategory', value: listing.subcategory || listing.subCategory || listing.propertyType });
    if (listing.bhk) fields.push({ label: 'BHK', value: listing.bhk });
    if (listing.bathrooms) fields.push({ label: 'Bathrooms', value: listing.bathrooms });
    if (listing.area_sqft) fields.push({ label: 'Area', value: `${listing.area_sqft} Sq. Ft.` });
    else if (listing.area) fields.push({ label: 'Area', value: listing.area });
    if (listing.floors) fields.push({ label: 'Floors', value: listing.floors });
    else if (listing.floor) fields.push({ label: 'Floor', value: listing.floor });
    if (listing.towers) fields.push({ label: 'Towers', value: listing.towers });
    if (listing.approval) fields.push({ label: 'Approval', value: listing.approval });
    if (listing.possession || listing.possessionStatus) fields.push({ label: 'Possession', value: listing.possession || listing.possessionStatus });
    if (listing.furnishing) fields.push({ label: 'Furnishing', value: listing.furnishing });
    if (listing.parking) fields.push({ label: 'Parking', value: listing.parking });
    if (listing.extraRoom) fields.push({ label: 'Extra Room', value: listing.extraRoom });
    if (listing.loanApproved) fields.push({ label: 'Bank Loan Approved', value: 'Yes' });
    if (listing.vendorName) fields.push({ label: 'Vendor Name', value: listing.vendorName });
    if (listing.email || listing.contactEmail) fields.push({ label: 'Contact Email', value: listing.email || listing.contactEmail });
    if (listing.projectCount) fields.push({ label: 'Total Projects', value: listing.projectCount });
    if (listing.totalUnits) fields.push({ label: 'Total Units', value: listing.totalUnits });
    if (listing.availableUnits) fields.push({ label: 'Available Units', value: listing.availableUnits });
  }

  if (type === 'vehicles') {
    if (listing.brand) fields.push({ label: 'Brand', value: listing.brand });
    if (listing.model) fields.push({ label: 'Model', value: listing.model });
    if (listing.year) fields.push({ label: 'Year', value: listing.year });
    if (listing.condition) fields.push({ label: 'Condition', value: listing.condition });
    if (listing.category) fields.push({ label: 'Category', value: listing.category });
    if (listing.fuelType) fields.push({ label: 'Fuel Type', value: listing.fuelType });
    if (listing.transmission) fields.push({ label: 'Transmission', value: listing.transmission });
    if (listing.kmDriven) fields.push({ label: 'KM Driven', value: `${parseInt(listing.kmDriven).toLocaleString()} km` });
  }

  if (type === 'groceries') {
    if (listing.unit) fields.push({ label: 'Unit', value: listing.unit });
    if (listing.stock !== undefined) fields.push({ label: 'Stock', value: listing.stock });
  }

  if (type === 'garments') {
    if (listing.size) fields.push({ label: 'Size', value: listing.size });
    if (listing.color) fields.push({ label: 'Color', value: listing.color });
  }

  if (type === 'jewellery') {
    if (listing.material) fields.push({ label: 'Material', value: listing.material });
    if (listing.purity) fields.push({ label: 'Purity', value: listing.purity });
    if (listing.weight) fields.push({ label: 'Weight', value: `${listing.weight} g` });
    if (listing.gemstone) fields.push({ label: 'Gemstone', value: listing.gemstone });
  }

  if (type === 'finance') {
    if (listing.type) fields.push({ label: 'Service Type', value: listing.type });
    if (listing.provider) fields.push({ label: 'Provider', value: listing.provider });
    if (listing.interestRate) fields.push({ label: 'Interest Rate', value: listing.interestRate });
    if (listing.amountMin || listing.amountMax) fields.push({ label: 'Amount Range', value: `${listing.amountMin || 0} - ${listing.amountMax || 0}` });
    if (listing.tenureMin || listing.tenureMax) fields.push({ label: 'Tenure', value: `${listing.tenureMin || 1} - ${listing.tenureMax || 30} years` });
  }

  return fields;
}

export function getAdminFeedback(listing, ADMIN_FEEDBACKS) {
  if (listing.status === 'changes-required') {
    return listing.adminComment || ADMIN_FEEDBACKS[listing._id] || 'Please review and update the listing as per admin feedback.';
  }
  return null;
}

export function getTimeline(listing, getAdminFeedback) {
  const base = [
    { date: listing.createdAt, title: 'Listing Created', description: 'Listing submitted for review', type: 'created' },
  ];

  if (listing.status === 'approved') {
    base.push({ date: listing.updatedAt || listing.createdAt, title: 'Listing Approved', description: 'Approved by admin and now live', type: 'approved' });
  } else if (listing.status === 'changes-required') {
    base.push({ date: listing.updatedAt || listing.createdAt, title: 'Changes Required', description: getAdminFeedback(listing), type: 'changes' });
  } else if (listing.status === 'cancelled') {
    base.push({ date: listing.updatedAt || listing.createdAt, title: 'Listing Cancelled', description: listing.adminComment || 'Cancelled by admin', type: 'cancelled' });
  }

  return base;
}