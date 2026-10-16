import * as XLSX from 'xlsx';

/**
 * Generate best timestamp format: YYYYMMDD_HHmmss (e.g. 20261016_134522)
 * Clean, ISO-compliant, cross-platform filesystem safe (no colons or slashes)
 */
export function generateBulkListingTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
}

/**
 * Normalized category slug for file naming
 */
export function getCategorySlug(category) {
  const norm = (category || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (norm === 'real-estate' || norm === 'property' || norm === 'properties') {
    return 'properties';
  }
  if (norm === 'vehicles' || norm === 'vehicle') {
    return 'vehicle';
  }
  if (norm === 'groceries' || norm === 'grocery') {
    return 'grocery';
  }
  if (norm === 'garments' || norm === 'garment') {
    return 'garment';
  }
  if (norm === 'jewellery' || norm === 'jewelry') {
    return 'jewellery';
  }
  return norm || 'product';
}

/**
 * Generate official filename: <Categoryname>_bulklisting_<timestamp>.xlsx
 */
export function getBulkListingFilename(category, timestamp = generateBulkListingTimestamp()) {
  const slug = getCategorySlug(category);
  return `${slug}_bulklisting_${timestamp}.xlsx`;
}

/**
 * Filename validation regex & category check
 */
export function validateUploadedFilename(filename, expectedCategory) {
  if (!filename || typeof filename !== 'string') {
    return {
      valid: false,
      error: 'Filename is missing or empty.',
    };
  }

  const clean = filename.trim();
  // Regex: <category>_bulklisting_<8 digits>_<4 to 6 digits>.xlsx (allowing optional copy suffix like ' (1)')
  const regex = /^([a-zA-Z0-9_-]+)_bulklisting_(\d{8}_\d{4,6})(?:\s*\(\d+\))?\.xlsx$/i;
  const match = clean.match(regex);

  const expectedSlug = getCategorySlug(expectedCategory);

  if (!match) {
    return {
      valid: false,
      error: `Invalid file name: "${clean}". The file name must match the downloaded template pattern: ${expectedSlug}_bulklisting_YYYYMMDD_HHmmss.xlsx (e.g. ${expectedSlug}_bulklisting_20261016_133000.xlsx).`,
    };
  }

  const fileCatSlug = getCategorySlug(match[1]);
  if (fileCatSlug !== expectedSlug) {
    return {
      valid: false,
      error: `Category mismatch: The file "${clean}" appears to be for "${match[1]}", but you have selected "${expectedCategory}". Please upload the file matching this category or switch category.`,
    };
  }

  return {
    valid: true,
    category: match[1],
    timestamp: match[2],
  };
}

/**
 * Category-specific Template Definitions (Headers + Realistic Sample Rows)
 */
export const TEMPLATE_CONFIGS = {
  properties: {
    categoryLabel: 'Properties / Real Estate',
    headers: [
      'Title*',
      'Property Type*',
      'Subcategory',
      'Purpose',
      'Price*',
      'Price Suffix',
      'City*',
      'Area / Locality*',
      'Pincode*',
      'Address*',
      'BHK',
      'Bathrooms',
      'Balconies',
      'Super Built-up Area',
      'Facing',
      'Furnishing Status',
      'Possession Status',
      'Bank Loan Available',
      'Amenities',
      'Description',
      'Images',
    ],
    sampleRows: [
      [
        'Luxury 3 BHK Villa in Whitefield',
        'Flat/Villa',
        'Villa',
        'Sell',
        '₹ 1.85 Cr',
        'Negotiable',
        'Bengaluru',
        'Whitefield',
        '560066',
        'Near Hope Farm Junction, Whitefield',
        '3 BHK',
        '3',
        '2',
        '2400 sq.ft',
        'East',
        'Semi-Furnished',
        'Ready to Move In',
        'SBI, HDFC approved',
        'Swimming Pool, Gym, Power Backup, Clubhouse, CCTV, Children Play Area',
        'Premium standalone villa with private garden, Italian marble flooring and solar water heater.',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      ],
      [
        'BMRDA Approved Residential Plot',
        'Plot/Land',
        'Plot',
        'Sell',
        '₹ 42 Lakh',
        'Fixed',
        'Bengaluru',
        'Sarjapur Road',
        '562125',
        'Near Sompura Gate, Sarjapur',
        '',
        '',
        '',
        '1200 sq.ft (30x40)',
        'North',
        '',
        'Ready to Move In',
        'Yes',
        'Water Connection, Electricity, Underground Drainage, Black Top Roads',
        'Gated layout plot with clear titles, immediate registration and bank loan assistance.',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
      ],
    ],
    instructions: [
      ['Column', 'Description', 'Allowed / Suggested Values'],
      ['Title*', 'Clear headline for the property listing', 'e.g. Luxury 3 BHK Villa in Whitefield'],
      ['Property Type*', 'Main property category', 'Residential, Flat/Villa, Plot/Land, Commercial, Agricultural, Industrial, Independent House'],
      ['Price*', 'Asking price (with or without ₹)', 'e.g. ₹ 1.85 Cr, 42 Lakh, 8500000'],
      ['City*', 'City where property is located', 'e.g. Bengaluru, Mysore, Hyderabad'],
      ['Area / Locality*', 'Locality or neighborhood', 'e.g. Whitefield, Indiranagar, HSR Layout'],
      ['Pincode*', '6-digit postal code', 'e.g. 560066'],
      ['Address*', 'Full or street address', 'e.g. Near Hope Farm Junction, Whitefield'],
      ['Furnishing Status', 'State of furnishing', 'Furnished, Semi-Furnished, Unfurnished'],
      ['Possession Status', 'Current possession stage', 'Ready to Move In, Under Construction'],
      ['Bank Loan Available', 'Financing availability', 'Yes, No, or bank names like SBI / HDFC'],
      ['Amenities', 'Comma-separated amenities', 'e.g. Lift, Power Backup, Gym, Pool, Security'],
      ['Images', 'Public image URLs separated by comma', 'Optional; up to 6 image URLs'],
    ],
  },

  vehicle: {
    categoryLabel: 'Vehicles',
    headers: [
      'Brand*',
      'Model*',
      'Year*',
      'Vehicle Type*',
      'Condition*',
      'Fuel Type*',
      'Transmission',
      'KM Driven',
      'Price*',
      'City*',
      'Location / Area*',
      'Pincode*',
      'Description',
      'Images',
    ],
    sampleRows: [
      [
        'Hyundai',
        'Creta SX(O) 1.5 Diesel',
        '2022',
        '4-wheeler',
        'old',
        'Diesel',
        'Automatic',
        '28000',
        '₹ 16.5 Lakh',
        'Bengaluru',
        'Indiranagar',
        '560038',
        'Single owner, comprehensive insurance valid till Dec 2026, showroom service records.',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
      ],
      [
        'Royal Enfield',
        'Classic 350 Stealth Black',
        '2023',
        '2-wheeler',
        'old',
        'Petrol',
        'Manual',
        '8500',
        '₹ 1.95 Lakh',
        'Bengaluru',
        'Koramangala',
        '560034',
        'Mint condition, dual-channel ABS, custom alloy wheels and backrest installed.',
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc',
      ],
    ],
    instructions: [
      ['Column', 'Description', 'Allowed / Suggested Values'],
      ['Brand*', 'Manufacturer name', 'e.g. Hyundai, Toyota, Honda, Royal Enfield, Tata'],
      ['Model*', 'Model name and variant', 'e.g. Creta SX, Innova Crysta, Classic 350'],
      ['Year*', 'Manufacturing year', 'e.g. 2022, 2023, 2024'],
      ['Vehicle Type*', 'Wheeler classification', '4-wheeler, 2-wheeler, 3-wheeler, commercial'],
      ['Condition*', 'Condition of vehicle', 'new, old'],
      ['Fuel Type*', 'Propulsion type', 'Petrol, Diesel, Electric, CNG'],
      ['Transmission', 'Gearbox type', 'Manual, Automatic, CVT, DCT, AMT'],
      ['KM Driven', 'Odometer reading in kilometers', 'e.g. 28000'],
      ['Price*', 'Selling price', 'e.g. ₹ 16.5 Lakh or 1650000'],
      ['City*', 'City where vehicle is available', 'e.g. Bengaluru'],
      ['Pincode*', '6-digit pincode', 'e.g. 560038'],
    ],
  },

  grocery: {
    categoryLabel: 'Grocery & Farm Produce',
    headers: [
      'Product Name*',
      'Category*',
      'Subcategory',
      'Price*',
      'Unit*',
      'Stock Quantity',
      'Brand',
      'Organic',
      'City*',
      'Description',
      'Images',
    ],
    sampleRows: [
      [
        'Organic Premium Basmati Rice',
        'Grains & Pulses',
        'Rice',
        '₹ 180',
        'kg',
        '100',
        'FarmFresh',
        'Yes',
        'Bengaluru',
        'Naturally aged long-grain basmati rice grown with zero pesticides.',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      ],
      [
        'Cold-Pressed Virgin Coconut Oil',
        'Oils & Ghee',
        'Cooking Oil',
        '₹ 320',
        'liter',
        '50',
        'PureNature',
        'Yes',
        'Bengaluru',
        '100% natural cold pressed wood-churned coconut oil from Malabar coconuts.',
        'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1',
      ],
    ],
    instructions: [
      ['Column', 'Description', 'Allowed / Suggested Values'],
      ['Product Name*', 'Full product title', 'e.g. Organic Basmati Rice'],
      ['Category*', 'Grocery category', 'Grains & Pulses, Fruits & Vegetables, Dairy & Eggs, Oils & Ghee, Spices, Snacks'],
      ['Price*', 'Price per unit (e.g. ₹ 180)', 'e.g. 180, ₹ 180'],
      ['Unit*', 'Packaging unit', 'kg, gm, liter, ml, pack, piece'],
      ['Organic', 'Whether organically certified', 'Yes / No'],
    ],
  },

  garment: {
    categoryLabel: 'Garments & Apparel',
    headers: [
      'Product Name*',
      'Category*',
      'Subcategory',
      'Size*',
      'Color',
      'Material',
      'Price*',
      'Quantity',
      'Brand',
      'Description',
      'Images',
    ],
    sampleRows: [
      [
        'Men Premium Pure Linen Casual Shirt',
        'Men',
        'Casual Shirts',
        'L',
        'Sky Blue',
        '100% Linen',
        '₹ 1,799',
        '25',
        'Vishwam Collection',
        'Breathable pure linen shirt with mandarin collar, ideal for summer and casual wear.',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
      ],
      [
        'Handloom Pure Silk Kanjeevaram Saree',
        'Women',
        'Sarees',
        'Free Size',
        'Royal Maroon & Gold',
        'Pure Silk with Zari',
        '₹ 8,499',
        '10',
        'Heritage Weaves',
        'Authentic hand-woven silk saree with rich contrast pallu and unstitched blouse piece.',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
      ],
    ],
    instructions: [
      ['Column', 'Description', 'Allowed / Suggested Values'],
      ['Product Name*', 'Product title', 'e.g. Men Pure Linen Shirt'],
      ['Category*', 'Gender/Department', 'Men, Women, Kids, Unisex'],
      ['Size*', 'Garment size', 'S, M, L, XL, XXL, Free Size, 32, 34, 36'],
      ['Price*', 'Selling price', 'e.g. ₹ 1,799'],
    ],
  },

  jewellery: {
    categoryLabel: 'Jewellery',
    headers: [
      'Item Name / Title*',
      'Category*',
      'Metal Type*',
      'Purity*',
      'Weight (Grams)*',
      'Price*',
      'Making Charges',
      'Gender',
      'Certified',
      'Description',
      'Images',
    ],
    sampleRows: [
      [
        '22K BIS Hallmarked Temple Gold Necklace',
        'Necklaces',
        'Gold',
        '22K',
        '32.5',
        '₹ 2,45,000',
        '₹ 6,500',
        'Women',
        'Yes',
        'Traditional antique finish 916 gold temple necklace featuring Lakshmi motif.',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
      ],
      [
        'Solitaire Diamond Engagement Ring',
        'Rings',
        'Diamond',
        '18K White Gold / VVS1',
        '4.2',
        '₹ 85,000',
        '₹ 3,000',
        'Women',
        'Yes',
        'IGI certified 0.50 ct round brilliant diamond set in 18K white gold prong setting.',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
      ],
    ],
    instructions: [
      ['Column', 'Description', 'Allowed / Suggested Values'],
      ['Item Name*', 'Name of jewellery piece', 'e.g. 22K Gold Temple Necklace'],
      ['Metal Type*', 'Precious metal', 'Gold, Silver, Diamond, Platinum'],
      ['Purity*', 'Karat or fineness', '22K, 18K, 14K, 925 Silver, 950 Platinum'],
      ['Weight (Grams)*', 'Net weight in grams', 'e.g. 32.5, 4.2'],
      ['Price*', 'Estimated or total price', 'e.g. ₹ 2,45,000'],
      ['Certified', 'Certification status', 'Yes / No'],
    ],
  },
};

/**
 * Fallback config for any other category (Finance, Services, Bedding)
 */
function getTemplateConfig(category) {
  const slug = getCategorySlug(category);
  return TEMPLATE_CONFIGS[slug] || TEMPLATE_CONFIGS.properties;
}

/**
 * Generates and downloads the Excel template file
 */
export function downloadCategoryTemplate(category) {
  const slug = getCategorySlug(category);
  const config = getTemplateConfig(slug);
  const timestamp = generateBulkListingTimestamp();
  const filename = getBulkListingFilename(slug, timestamp);

  // 1. Create main data worksheet
  const dataSheetData = [config.headers, ...config.sampleRows];
  const dataSheet = XLSX.utils.aoa_to_sheet(dataSheetData);

  // Auto-fit column widths
  const colWidths = config.headers.map((h, colIdx) => {
    let maxLen = h.length;
    config.sampleRows.forEach((row) => {
      const val = row[colIdx] ? String(row[colIdx]) : '';
      if (val.length > maxLen) maxLen = Math.min(val.length, 40);
    });
    return { wch: Math.max(maxLen + 4, 15) };
  });
  dataSheet['!cols'] = colWidths;

  // 2. Create Instructions sheet
  const instructionSheet = XLSX.utils.aoa_to_sheet(config.instructions);
  instructionSheet['!cols'] = [{ wch: 25 }, { wch: 35 }, { wch: 45 }];

  // 3. Assemble workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, dataSheet, 'Template');
  XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions & Guide');

  // 4. Download file
  XLSX.writeFile(workbook, filename);

  return {
    filename,
    timestamp,
    category: slug,
  };
}

/**
 * Parses client-side Excel file for instant UI preview and validation
 */
export async function parseExcelFileForPreview(file, expectedCategory) {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('Excel file has no worksheets');
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('Excel sheet contains no data rows');
  }

  const slug = getCategorySlug(expectedCategory);

  // Filter out any instruction/header repetition rows
  const cleanRows = rawRows.filter((r) => {
    const vals = Object.values(r).filter((v) => v !== '' && v !== null && v !== undefined);
    return vals.length > 0;
  });

  return {
    sheetName,
    totalRows: cleanRows.length,
    rows: cleanRows,
  };
}
