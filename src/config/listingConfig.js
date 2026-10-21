import { currentYear } from '../utils';

/**
 * ==============================================================================
 * UNIFIED DECLARATIVE CATEGORY REGISTRY FOR VISHWAM-LISTINGS
 * ==============================================================================
 * Developers: To add or update any category in the listing portal:
 * 1. Define its metadata (label, icons, colors, subcategories).
 * 2. Define its formFields (intake fields in Phase 2).
 * 3. Define its detailFields (attributes displayed on the Listing Details page).
 * 
 * Everything else (table badges, search filters, form validation, details view,
 * and dashboard counts) is dynamically and automatically derived from this single registry.
 * ==============================================================================
 */

export const CATEGORY_REGISTRY = {
  properties: {
    id: 'properties',
    aliases: ['property', 'real-estate', 'realestate', 'real_estate'],
    label: 'Properties',
    singularLabel: 'Property',
    icon: 'fa-house-chimney',
    lucideIconName: 'Home',
    color: 'bg-blue-50 text-brand-blue border-blue-100',
    gradient: 'from-blue-600 to-indigo-600',
    iconBg: 'bg-blue-50 text-blue-600',
    hoverBorder: 'hover:border-blue-300',
    badge: 'Channel Partner Intake',
    desc: 'Plots, Layouts, Villas, Agricultural Land & Commercial Spaces',
    popular: ['Residential', 'Villas', 'Plots', 'Agricultural', 'Commercial', 'Industrial'],
    subcategories: ['Residential', 'Villas', 'Plots', 'Agricultural Land', 'Commercial Space', 'Industrial Land'],
    priceUnits: ['exact', 'lakh', 'crore'],
    defaultPriceType: 'fixed',
    priceSuffixes: ['/ Total Price', '/ Sq.ft', '/ Per Month', '/ Per Year'],
    formFields: [
      { name: 'bhk', label: 'BHK', type: 'text', placeholder: 'e.g. 2, 3 & 4 BHK or EOI' },
      { name: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4+'] },
      { name: 'area_sqft', label: 'Area / Size', type: 'text', placeholder: 'e.g. 1348 - 2016 Sq.ft or 4+4 Acres' },
      { name: 'furnishing', label: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
      { name: 'floor', label: 'Floor', type: 'text', placeholder: 'e.g. 20th of 20 Floors' },
      { name: 'floors', label: 'Floors / Blocks', type: 'text', placeholder: 'e.g. B+G+11 Floors · 3 Towers · 6 Blocks' },
      { name: 'towers', label: 'Towers', type: 'text', placeholder: 'e.g. 3 Towers' },
      { name: 'approval', label: 'Approval Authority', type: 'text', placeholder: 'e.g. BDA, BBMP, BMRDA, RERA, EOI' },
      { name: 'possessionStatus', label: 'Possession Status', type: 'select', options: ['Ready to Move', 'Under Construction', 'Immediate Possession', 'New Launch', 'Upcoming'] },
      { name: 'loanApproved', label: 'Bank Loan Approved', type: 'select', options: ['Yes', 'No'] },
      { name: 'parking', label: 'Parking', type: 'text', placeholder: 'e.g. 2 Covered + 2 Open' },
      { name: 'extraRoom', label: 'Extra Room', type: 'text', placeholder: 'e.g. Pooja Room, Study' },
      { name: 'projectCount', label: 'Total Projects', type: 'number', placeholder: 'e.g. 120' },
      { name: 'totalUnits', label: 'Total Units', type: 'text', placeholder: 'e.g. 200 Units' },
      { name: 'availableUnits', label: 'Available Units', type: 'number', placeholder: 'e.g. 5' },
    ],
    detailFields: [
      { key: 'subcategory', altKeys: ['propertyType'], label: 'Subcategory' },
      { key: 'bhk', label: 'BHK' },
      { key: 'bathrooms', label: 'Bathrooms' },
      { key: 'area_sqft', altKeys: ['area'], label: 'Area', format: (v) => `${v}${String(v).toLowerCase().includes('sq') ? '' : ' Sq. Ft.'}` },
      { key: 'floors', altKeys: ['floor'], label: 'Floors / Block' },
      { key: 'towers', label: 'Towers' },
      { key: 'approval', label: 'Approval Authority' },
      { key: 'furnishing', label: 'Furnishing' },
      { key: 'possessionStatus', altKeys: ['possession'], label: 'Possession Status' },
      { key: 'parking', label: 'Parking' },
      { key: 'extraRoom', label: 'Extra Room' },
      { key: 'loanApproved', label: 'Bank Loan Approved', format: (v) => (v === 'Yes' || v === true ? 'Yes' : 'No') },
      { key: 'vendorName', label: 'Vendor / Owner' },
      { key: 'channelPartnerName', label: 'Channel Partner' },
      { key: 'contactEmail', altKeys: ['email'], label: 'Contact Email' },
      { key: 'projectCount', label: 'Total Projects' },
      { key: 'totalUnits', label: 'Total Units' },
      { key: 'availableUnits', label: 'Available Units' },
    ],
  },

  vehicles: {
    id: 'vehicles',
    aliases: ['vehicle', 'automobile', 'automobiles', 'car', 'cars', 'bike', 'bikes', '4-wheeler', '2-wheeler', '3-wheeler', 'commercial', 'commercial vehicle', 'electric vehicle'],
    label: 'Vehicles',
    singularLabel: 'Vehicle',
    icon: 'fa-car-side',
    lucideIconName: 'Car',
    color: 'bg-amber-50 text-amber-700 border-amber-300',
    gradient: 'from-amber-500 to-amber-600',
    iconBg: 'bg-amber-50 text-amber-600',
    hoverBorder: 'hover:border-amber-300',
    badge: 'Automotive',
    desc: 'Cars, Two-Wheelers, Commercial Trucks & Electric Vehicles',
    popular: ['Cars', 'Bikes', 'Hatchback', 'SUV', 'Sedan', 'Commercial', 'Electric Vehicles'],
    subcategories: ['4-Wheeler', '2-Wheeler', '3-Wheeler', 'Commercial Vehicle', 'Electric Vehicle'],
    priceUnits: ['exact', 'lakh', 'crore'],
    defaultPriceType: 'fixed',
    priceSuffixes: ['Ex-Showroom', 'On-Road', 'Negotiable'],
    formFields: [
      { name: 'brand', label: 'Brand / Make', type: 'text', placeholder: 'e.g. Maruti Suzuki, Tata, Hyundai, Toyota', required: true },
      { name: 'model', label: 'Model Name', type: 'text', placeholder: 'e.g. Swift, Brezza, Creta, Nexon', required: true },
      { name: 'bodyType', label: 'Body Type', type: 'select', options: ['Hatchback', 'Sedan', 'SUV', 'Cruiser / Bike', 'Commercial', 'MUV', 'Coupe'] },
      { name: 'categoryVehicle', label: 'Wheeler Classification', type: 'select', options: ['4-Wheeler', '2-Wheeler', '3-Wheeler', 'Commercial'] },
      { name: 'year', label: 'Manufacturing Year', type: 'select', required: true, options: Array.from({ length: 32 }, (_, i) => String(currentYear() - i)) },
      { name: 'condition', label: 'Condition & Ownership', type: 'select', required: true, options: ['Brand New', 'Certified Pre-Owned', 'Used - Excellent', 'Used - Good'] },
      { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] },
      { name: 'transmission', label: 'Transmission', type: 'select', options: ['Manual', 'Automatic (AGS / AMT)', 'Automatic (Torque Converter)', 'CVT', 'DCT'] },
      { name: 'mileage', label: 'ARAI Mileage / Economy', type: 'text', placeholder: 'e.g. 24.8 km/l or 32.85 km/kg' },
      { name: 'kmDriven', label: 'KM Driven', type: 'number', placeholder: '0 for brand-new, or odometer in km' },
      { name: 'loanApproved', label: 'Pre-Approved Bank Loan', type: 'select', options: ['Yes', 'No'] },
      { name: 'variants', label: 'Available Trim Variants & Prices', type: 'text', placeholder: 'e.g. LXi - ₹ 6.49 L, VXi - ₹ 7.29 L, ZXi - ₹ 8.29 L' },
      { name: 'features', label: 'Key Equipment & Features', type: 'text', placeholder: 'e.g. 6 Airbags Standard, Touchscreen, Cruise Control, Camera' },
      { name: 'showroomName', label: 'Showroom / Dealer Name', type: 'text', placeholder: 'e.g. Kalyani Motors Pvt Ltd' },
      { name: 'showroomPhone', label: 'Dealership Contact Phone', type: 'text', placeholder: 'e.g. 8546996622' },
      { name: 'showroomAddress', label: 'Showroom Full Address', type: 'text', placeholder: 'e.g. Outer Ring Road, Bengaluru' },
    ],
    detailFields: [
      { key: 'brand', label: 'Brand / Make' },
      { key: 'model', label: 'Model' },
      { key: 'bodyType', label: 'Body Type' },
      { key: 'year', label: 'Manufacturing Year' },
      { key: 'condition', label: 'Condition', format: (v) => (v === 'new' ? 'Brand New' : v) },
      { key: 'category', label: 'Classification' },
      { key: 'fuelType', label: 'Fuel System' },
      { key: 'transmission', label: 'Transmission' },
      { key: 'mileage', label: 'ARAI Mileage / Economy' },
      { key: 'kmDriven', label: 'KM Driven', format: (v) => `${parseInt(v || 0, 10).toLocaleString()} km` },
      { key: 'loanApproved', label: 'Bank Loan Pre-Approved', format: (v) => (v === 'Yes' || v === true ? 'Yes' : 'No') },
      { key: 'showroom.name', altKeys: ['showroomName'], label: 'Showroom / Dealer' },
      { key: 'showroom.address', altKeys: ['showroomAddress'], label: 'Showroom Address' },
      { key: 'showroom.phone', altKeys: ['showroomPhone'], label: 'Dealership Phone' },
      { key: 'variants', label: 'Available Variants', format: (v) => (Array.isArray(v) ? v.map((item) => (typeof item === 'object' ? `${item.variant || item.name} (${item.price || ''})` : item)).join(', ') : v) },
      { key: 'features', label: 'Features & Equipment', format: (v) => (Array.isArray(v) ? v.join(', ') : v) },
    ],
  },

  groceries: {
    id: 'groceries',
    aliases: ['grocery', 'daily-essentials', 'supermarket', 'food'],
    label: 'Groceries',
    singularLabel: 'Grocery',
    icon: 'fa-basket-shopping',
    lucideIconName: 'ShoppingBag',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gradient: 'from-emerald-500 to-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-600',
    hoverBorder: 'hover:border-emerald-300',
    badge: 'Daily Essentials',
    desc: 'Fresh Farm Produce, Dairy, Packaged Food & Daily Essentials',
    popular: ['Fruits & Veg', 'Dairy & Eggs', 'Packaged Food', 'Spices'],
    subcategories: ['Fresh Produce', 'Dairy & Eggs', 'Packaged Food', 'Beverages', 'Spices & Staples'],
    priceUnits: ['exact'],
    defaultPriceType: 'fixed',
    priceSuffixes: ['/ Kg', '/ Liter', '/ Piece', '/ Pack', '/ Dozen', '/ Box'],
    formFields: [
      { name: 'quantity', label: 'Quantity / Available Stock', type: 'number', placeholder: 'e.g. 100' },
      { name: 'unit', label: 'Unit of Measurement', type: 'select', options: ['Kg', 'Gram', 'Liter', 'Milliliter', 'Piece', 'Pack', 'Dozen', 'Box'] },
      { name: 'brand', label: 'Brand Name', type: 'text', placeholder: 'e.g. Aashirvaad, Amul, Tata' },
      { name: 'stock', label: 'Current Inventory Level', type: 'number', placeholder: 'e.g. 50' },
    ],
    detailFields: [
      { key: 'quantity', altKeys: ['stock'], label: 'Stock / Quantity Available' },
      { key: 'unit', label: 'Unit' },
      { key: 'brand', label: 'Brand' },
    ],
  },

  garments: {
    id: 'garments',
    aliases: ['garment', 'clothing', 'fashion', 'apparel'],
    label: 'Garments',
    singularLabel: 'Garment',
    icon: 'fa-shirt',
    lucideIconName: 'Shirt',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    gradient: 'from-purple-500 to-violet-600',
    iconBg: 'bg-purple-50 text-purple-600',
    hoverBorder: 'hover:border-purple-300',
    badge: 'Fashion & Retail',
    desc: 'Men, Women & Kids Apparel, Ethnic Wear & Footwear',
    popular: ['Ethnic Wear', "Men's Wear", "Women's Wear", 'Footwear'],
    subcategories: ["Men's Wear", "Women's Wear", "Kids' Wear", 'Ethnic Wear', 'Footwear', 'Accessories'],
    priceUnits: ['exact'],
    defaultPriceType: 'fixed',
    priceSuffixes: ['/ Piece', '/ Pair', '/ Set'],
    formFields: [
      { name: 'size', label: 'Available Sizes', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Custom'] },
      { name: 'color', label: 'Color / Shade', type: 'text', placeholder: 'e.g. Navy Blue, Maroon, Beige' },
      { name: 'material', label: 'Fabric / Material', type: 'text', placeholder: 'e.g. 100% Pure Cotton, Silk, Linen' },
      { name: 'brand', label: 'Brand / Label', type: 'text', placeholder: 'e.g. Raymond, Manyavar, FabIndia' },
    ],
    detailFields: [
      { key: 'size', label: 'Size' },
      { key: 'color', label: 'Color' },
      { key: 'material', label: 'Fabric / Material' },
      { key: 'brand', label: 'Brand' },
    ],
  },

  jewellery: {
    id: 'jewellery',
    aliases: ['jewelry', 'gold', 'diamonds', 'silver', 'platinum'],
    label: 'Jewellery',
    singularLabel: 'Jewellery',
    icon: 'fa-gem',
    lucideIconName: 'Gem',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-50 text-rose-600',
    hoverBorder: 'hover:border-rose-300',
    badge: 'Precious Metals',
    desc: 'Certified Gold, Silver, Diamonds, Platinum & Solitaires',
    popular: ['Gold', 'Diamond', 'Silver', 'Platinum', 'Gemstones'],
    subcategories: ['Gold Jewellery', 'Diamond Jewellery', 'Silver Ornaments', 'Platinum', 'Gemstones'],
    priceUnits: ['exact', 'lakh'],
    defaultPriceType: 'fixed',
    priceSuffixes: ['/ Gram', '/ Piece', 'Making Charges Extra'],
    formFields: [
      { name: 'material', label: 'Metal / Material', type: 'text', placeholder: 'e.g. Gold, Silver, Platinum', required: true },
      { name: 'purity', label: 'Purity / Hallmark', type: 'text', placeholder: 'e.g. 22K (916), 18K (750), 925 Sterling' },
      { name: 'weight', label: 'Weight (grams)', type: 'number', placeholder: 'e.g. 14.5' },
      { name: 'gemstone', label: 'Gemstone Details', type: 'text', placeholder: 'e.g. VVS Diamond 0.5ct, Natural Emerald' },
      { name: 'certification', label: 'Hallmark / Certification', type: 'text', placeholder: 'e.g. BIS Hallmarked, IGI Certified' },
    ],
    detailFields: [
      { key: 'material', label: 'Metal / Material' },
      { key: 'purity', label: 'Purity / Hallmark' },
      { key: 'weight', label: 'Gross Weight', format: (v) => `${v} g` },
      { key: 'gemstone', label: 'Gemstone / Diamonds' },
      { key: 'certification', label: 'Certification' },
    ],
  },

  finance: {
    id: 'finance',
    aliases: ['financial', 'loans', 'banking', 'investment'],
    label: 'Finance',
    singularLabel: 'Financial Service',
    icon: 'fa-building-columns',
    lucideIconName: 'Landmark',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    gradient: 'from-teal-500 to-cyan-600',
    iconBg: 'bg-teal-50 text-teal-600',
    hoverBorder: 'hover:border-teal-300',
    badge: 'Loans & Banking',
    desc: 'Home Loans, Project APF Approvals, Business Credit & Insurance',
    popular: ['Home Loans', 'Project APF', 'Business Loans', 'Insurance'],
    subcategories: ['Home Loan', 'Project APF Approval', 'Vehicle Loan', 'Business Loan', 'Mortgage Loan', 'Insurance'],
    priceUnits: ['exact', 'lakh', 'crore'],
    defaultPriceType: 'fixed',
    priceSuffixes: ['p.a. Interest Rate', 'Starting ROI', 'Processing Fee Included'],
    formFields: [
      { name: 'serviceType', label: 'Loan / Financial Product', type: 'select', options: ['Home Loan', 'Project APF Approval', 'Vehicle Loan', 'Personal Loan', 'Business Loan', 'Mortgage Loan', 'Insurance'] },
      { name: 'provider', label: 'Bank / Institution Provider', type: 'text', placeholder: 'e.g. SBI, HDFC Bank, ICICI Bank' },
      { name: 'interestRate', label: 'Interest Rate (% p.a.)', type: 'text', placeholder: 'e.g. 8.40% - 9.15%' },
      { name: 'experience', label: 'Institution Experience (Years)', type: 'number', placeholder: 'e.g. 25' },
    ],
    detailFields: [
      { key: 'serviceType', altKeys: ['type'], label: 'Service / Loan Type' },
      { key: 'provider', label: 'Financial Institution' },
      { key: 'interestRate', label: 'Interest Rate' },
      { key: 'experience', label: 'Experience', format: (v) => `${v} Years` },
    ],
  },

  services: {
    id: 'services',
    aliases: ['service', 'on-demand', 'contractor', 'maintenance'],
    label: 'Services',
    singularLabel: 'Service',
    icon: 'fa-wrench',
    lucideIconName: 'Wrench',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    gradient: 'from-slate-700 to-slate-800',
    iconBg: 'bg-slate-100 text-slate-700',
    hoverBorder: 'hover:border-slate-400',
    badge: 'On-Demand',
    desc: 'Plumbing, Electrical, Interior Design, Contracting & Maintenance',
    popular: ['Interior Design', 'Plumbing', 'Electrical', 'Repairs'],
    subcategories: ['Interior Design', 'Plumbing', 'Electrical & Wiring', 'Painting', 'Deep Cleaning', 'Civil Contracting'],
    priceUnits: ['exact'],
    defaultPriceType: 'fixed',
    priceSuffixes: ['/ Visit', '/ Hour', '/ Project', 'Quote on Inspection'],
    formFields: [
      { name: 'serviceType', label: 'Specialization / Trade', type: 'text', placeholder: 'e.g. Master Electrician, Modular Kitchen Specialist' },
      { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g. 8' },
      { name: 'coverageArea', label: 'Service Coverage Area', type: 'text', placeholder: 'e.g. Entire Bangalore Urban & Rural' },
    ],
    detailFields: [
      { key: 'serviceType', label: 'Service Type' },
      { key: 'experience', label: 'Experience', format: (v) => `${v} Years` },
      { key: 'coverageArea', label: 'Coverage Area' },
    ],
  },

  bedding: {
    id: 'bedding',
    aliases: ['bedding-comfort', 'mattress', 'sleep', 'comfort'],
    label: 'Bedding & Comfort',
    singularLabel: 'Bedding Product',
    icon: 'fa-bed',
    lucideIconName: 'Bed',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    gradient: 'from-sky-500 to-blue-600',
    iconBg: 'bg-sky-50 text-sky-600',
    hoverBorder: 'hover:border-sky-300',
    badge: 'Home & Living',
    desc: 'Mattresses, Pillows, Bedsheets & Sleep Comfort Essentials',
    popular: ['Mattresses', 'Pillows', 'Orthopedic Bedding', 'Bedsheets'],
    subcategories: ['Orthopedic Mattress', 'Memory Foam Mattress', 'Natural Latex', 'Premium Pillows', 'Bed Linen'],
    priceUnits: ['exact'],
    defaultPriceType: 'fixed',
    priceSuffixes: ['/ Unit', '/ Set'],
    formFields: [
      { name: 'brand', label: 'Brand Name', type: 'text', placeholder: 'e.g. Vishwam Comfort, Sleepwell, Wakefit' },
      { name: 'material', label: 'Core Material / Fill', type: 'text', placeholder: 'e.g. High Density Foam, Natural Latex, Organic Cotton' },
      { name: 'size', label: 'Size', type: 'select', options: ['Single', 'Double', 'Queen', 'King', 'Custom'] },
      { name: 'thickness', label: 'Thickness', type: 'select', options: ['4 Inches', '6 Inches', '8 Inches', '10 Inches', '12 Inches'] },
      { name: 'firmness', label: 'Firmness Level', type: 'select', options: ['Soft', 'Medium Soft', 'Medium Firm', 'Firm', 'Dual Firm / Orthopedic'] },
      { name: 'warranty', label: 'Warranty Period', type: 'text', placeholder: 'e.g. 10 Years Warranty' },
    ],
    detailFields: [
      { key: 'brand', label: 'Brand' },
      { key: 'material', label: 'Core Material / Fill' },
      { key: 'size', label: 'Size' },
      { key: 'thickness', label: 'Thickness' },
      { key: 'firmness', label: 'Firmness Level' },
      { key: 'warranty', label: 'Warranty' },
    ],
  },

  electronics: {
    id: 'electronics',
    aliases: ['consumer-electronics', 'gadgets', 'appliances', 'tech'],
    label: 'Electronics',
    singularLabel: 'Electronic Device',
    icon: 'fa-laptop',
    lucideIconName: 'Laptop',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    gradient: 'from-indigo-500 to-purple-600',
    iconBg: 'bg-indigo-50 text-indigo-600',
    hoverBorder: 'hover:border-indigo-300',
    badge: 'Smart Tech',
    desc: 'Mobiles, Laptops, TV & Audio, Smart Home Devices',
    popular: ['Smartphones', 'Laptops', 'Audio & Sound', 'Smart Home'],
    subcategories: ['Smartphones & Accessories', 'Laptops & Computers', 'Television & Home Audio', 'Smart Home & Wearables'],
    priceUnits: ['exact', 'lakh'],
    defaultPriceType: 'fixed',
    priceSuffixes: ['/ Unit', 'Inclusive of Taxes'],
    formFields: [
      { name: 'brand', label: 'Brand / Make', type: 'text', placeholder: 'e.g. Apple, Samsung, Sony, Dell', required: true },
      { name: 'model', label: 'Model Name / Number', type: 'text', placeholder: 'e.g. iPhone 15 Pro, XPS 15, Bravia 55' },
      { name: 'condition', label: 'Condition', type: 'select', options: ['Brand New Sealed', 'Certified Refurbished', 'Used - Like New', 'Used - Good'] },
      { name: 'warranty', label: 'Official Warranty', type: 'text', placeholder: 'e.g. 1 Year Brand Warranty' },
    ],
    detailFields: [
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'condition', label: 'Condition' },
      { key: 'warranty', label: 'Warranty' },
    ],
  },
};

/**
 * Normalizes any category string or alias to its canonical key.
 */
export function normalizeCategoryKey(key) {
  if (!key) return 'properties';
  const k = String(key).toLowerCase().trim();

  for (const [canonicalId, cat] of Object.entries(CATEGORY_REGISTRY)) {
    if (k === canonicalId || cat.aliases?.includes(k)) {
      return canonicalId;
    }
  }

  // Fallbacks for common variations
  if (k.endsWith('s')) {
    const singular = k.slice(0, -1);
    for (const [canonicalId, cat] of Object.entries(CATEGORY_REGISTRY)) {
      if (singular === canonicalId || cat.aliases?.includes(singular)) {
        return canonicalId;
      }
    }
  }

  return k;
}

/**
 * Returns full configuration object for a category with safe fallback.
 */
export function getCategoryConfig(type, fallback = CATEGORY_REGISTRY.properties) {
  const normalized = normalizeCategoryKey(type);
  return CATEGORY_REGISTRY[normalized] || fallback;
}

/**
 * Declaratively extracts all specifications and attributes for a listing
 * without any hardcoded switch statements.
 */
export function getCategoryFields(listing) {
  if (!listing) return [];
  const normalizedKey = normalizeCategoryKey(listing._type || listing.category || '');
  const config = CATEGORY_REGISTRY[normalizedKey];
  const fields = [];

  const getVal = (key, altKeys = []) => {
    const keysToCheck = [key, ...(altKeys || [])];
    for (const k of keysToCheck) {
      if (k.includes('.')) {
        const [objKey, prop] = k.split('.');
        if (listing[objKey]?.[prop] !== undefined && listing[objKey]?.[prop] !== null && listing[objKey]?.[prop] !== '') {
          return listing[objKey][prop];
        }
      }
      if (listing[k] !== undefined && listing[k] !== null && listing[k] !== '') {
        return listing[k];
      }
      if (listing.details?.[k] !== undefined && listing.details?.[k] !== null && listing.details?.[k] !== '') {
        return listing.details[k];
      }
    }
    return undefined;
  };

  if (config?.detailFields && config.detailFields.length > 0) {
    for (const spec of config.detailFields) {
      const rawVal = typeof spec.getter === 'function' ? spec.getter(listing) : getVal(spec.key, spec.altKeys);
      if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
        const valStr = typeof spec.format === 'function' ? spec.format(rawVal, listing) : rawVal;
        if (valStr !== undefined && valStr !== null && valStr !== '') {
          fields.push({ label: spec.label, value: String(valStr) });
        }
      }
    }
  } else if (config?.formFields && config.formFields.length > 0) {
    for (const formField of config.formFields) {
      const rawVal = getVal(formField.name);
      if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
        fields.push({ label: formField.label, value: String(rawVal) });
      }
    }
  }

  // Include any extra attributes stored in listing.details not already extracted
  if (listing.details && typeof listing.details === 'object') {
    const existingLabels = new Set(fields.map((f) => f.label.toLowerCase()));
    for (const [detailKey, detailVal] of Object.entries(listing.details)) {
      if (detailVal !== undefined && detailVal !== null && detailVal !== '' && typeof detailVal !== 'object') {
        const readableLabel = detailKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        if (!existingLabels.has(readableLabel.toLowerCase()) && !existingLabels.has(detailKey.toLowerCase())) {
          fields.push({ label: readableLabel, value: String(detailVal) });
        }
      }
    }
  }

  return fields;
}

/**
 * Array of all primary categories for dropdowns, filters, and navs.
 */
export const PRIMARY_CATEGORIES = Object.values(CATEGORY_REGISTRY).map((cat) => ({
  key: cat.id,
  id: cat.id,
  label: cat.label,
  singularLabel: cat.singularLabel,
  icon: cat.icon,
  lucideIconName: cat.lucideIconName,
  badge: cat.badge,
  desc: cat.desc,
  color: cat.color,
  gradient: cat.gradient,
  iconBg: cat.iconBg,
  hoverBorder: cat.hoverBorder,
  popular: cat.popular,
}));

/**
 * Backward-compatible SERVICE_CONFIG dictionary.
 * Includes both canonical IDs and all aliases.
 */
export const SERVICE_CONFIG = {};

Object.values(CATEGORY_REGISTRY).forEach((cat) => {
  const visualMeta = {
    label: cat.label,
    icon: cat.icon,
    color: cat.color,
    gradient: cat.gradient,
  };
  SERVICE_CONFIG[cat.id] = visualMeta;
  cat.aliases?.forEach((alias) => {
    SERVICE_CONFIG[alias] = visualMeta;
  });
});

/**
 * Standard Status Configuration
 */
export const STATUS_BADGE = {
  pending: { variant: 'pending', icon: 'fa-clock', label: 'Pending Approval' },
  approved: { variant: 'blue', icon: 'fa-circle-check', label: 'Approved' },
  'changes-required': { variant: 'warning', icon: 'fa-pen-to-square', label: 'Changes Required' },
  cancelled: { variant: 'danger', icon: 'fa-circle-xmark', label: 'Cancelled' },
  rejected: { variant: 'danger', icon: 'fa-circle-xmark', label: 'Cancelled' },
};

/**
 * Category form fields dictionary mapped by canonical ID and aliases.
 */
export const CATEGORY_FIELDS = {};
Object.values(CATEGORY_REGISTRY).forEach((cat) => {
  CATEGORY_FIELDS[cat.id] = cat.formFields || [];
  cat.aliases?.forEach((alias) => {
    CATEGORY_FIELDS[alias] = cat.formFields || [];
  });
});

/**
 * Subcategories dictionary mapped by canonical ID and aliases.
 */
export const SUBCATEGORIES = {};
Object.values(CATEGORY_REGISTRY).forEach((cat) => {
  SUBCATEGORIES[cat.id] = cat.subcategories || [];
  cat.aliases?.forEach((alias) => {
    SUBCATEGORIES[alias] = cat.subcategories || [];
  });
});

/**
 * Price suffixes dictionary mapped by canonical ID and aliases.
 */
export const PRICE_SUFFIXES_BY_CATEGORY = {};
Object.values(CATEGORY_REGISTRY).forEach((cat) => {
  PRICE_SUFFIXES_BY_CATEGORY[cat.id] = cat.priceSuffixes || [];
  cat.aliases?.forEach((alias) => {
    PRICE_SUFFIXES_BY_CATEGORY[alias] = cat.priceSuffixes || [];
  });
});