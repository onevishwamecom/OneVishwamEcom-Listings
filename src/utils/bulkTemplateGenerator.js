import ExcelJS from 'exceljs';
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
  if (norm === 'vehicles' || norm === 'vehicle' || norm === 'automobile' || norm === 'automobiles' || norm === 'car' || norm === 'bike') {
    return 'vehicle';
  }
  if (norm === 'groceries' || norm === 'grocery') {
    return 'grocery';
  }
  if (norm === 'garments' || norm === 'garment' || norm === 'clothing') {
    return 'garment';
  }
  if (norm === 'jewellery' || norm === 'jewelry') {
    return 'jewellery';
  }
  if (norm === 'bedding' || norm === 'bedding-comfort') {
    return 'bedding';
  }
  if (norm === 'electronics' || norm === 'consumer-electronics') {
    return 'electronics';
  }
  return norm || 'properties';
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

// ─────────────────────────────────────────────────────────────────────────────
// Category-Specific Sheet Configurations
// Properties has all 7 official property types from the project specification
// ─────────────────────────────────────────────────────────────────────────────

export const MULTI_SHEET_CONFIGS = {
  properties: {
    categoryLabel: 'Properties',
    sheets: [
      {
        sheetName: 'Flats & Apartments',
        subcategoryId: 'Flat/Villa',
        headers: [
          'Title*',
          'Project / Apartment Name*',
          'BHK*',
          'Super Built-up Area (Sq.Ft)*',
          'Carpet Area (Sq.Ft)',
          'Price (₹)*',
          'Price Suffix',
          'Floor*',
          'Total Floors / Towers',
          'Facing*',
          'Bathrooms*',
          'Balconies*',
          'Furnishing Status*',
          'Possession Status*',
          'Parking*',
          'City*',
          'Area / Locality*',
          'Pincode',
          'Address*',
          'Bank Loan Approved',
          'Amenities',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Independent House & Villa',
        subcategoryId: 'Independent House',
        headers: [
          'Title*',
          'House / Villa Name*',
          'BHK*',
          'Built-up Area (Sq.Ft)*',
          'Plot Area (Sq.Ft)',
          'Plot Dimensions',
          'Price (₹)*',
          'Price Suffix',
          'Floors (G+1, G+2)*',
          'Facing*',
          'Bathrooms*',
          'Balconies',
          'Furnishing Status*',
          'Parking*',
          'Gated Community',
          'Garden / Terrace',
          'City*',
          'Area / Locality*',
          'Pincode',
          'Address*',
          'Bank Loan Approved',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Plots & Land',
        subcategoryId: 'Plot/Land',
        headers: [
          'Title*',
          'Layout / Project Name*',
          'Plot Type*',
          'Total Land Area (Sq.Ft)*',
          'Plot Dimensions*',
          'Price (₹)*',
          'Price per Sq.Ft',
          'Facing*',
          'Corner Plot*',
          'Approval Authority*',
          'Boundary Wall / Fencing',
          'Road Facing Width (Ft)',
          'Conversion Status',
          'Gated Community',
          'Utilities Available',
          'City*',
          'Area / Locality*',
          'Pincode',
          'Address*',
          'Bank Loan Approved',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Residential (Layout)',
        subcategoryId: 'Residential',
        headers: [
          'Title*',
          'Property / Project Name*',
          'Dimensions / Area (Sq.Ft)*',
          'Facing*',
          'Corner Plot',
          'Approved Layout',
          'Approval Authority*',
          'Price (₹)*',
          'Negotiable',
          'City*',
          'Area / Locality*',
          'Pincode',
          'Address*',
          'Bank Loan Approved',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Commercial Spaces',
        subcategoryId: 'Commercial',
        headers: [
          'Title*',
          'Commercial Type*',
          'Carpet Area (Sq.Ft)*',
          'Built-up Area (Sq.Ft)',
          'Price (₹)*',
          'Total Floors / Floor Level',
          'Main Road Frontage (Ft)',
          'Washrooms*',
          'Lift Available',
          'Power Backup',
          'Parking Capacity',
          'Occupancy Status',
          'Rental Income (₹/Month)',
          'City*',
          'Area / Locality*',
          'Pincode',
          'Address*',
          'Bank Loan Approved',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Agricultural Land',
        subcategoryId: 'Agricultural',
        headers: [
          'Title*',
          'Total Land Extent (Acres / Guntas)*',
          'Land Type*',
          'Price Total (₹)*',
          'Price Per Acre (₹)',
          'Water Availability*',
          'Electricity Availability*',
          'Current Crop / Plantation',
          'Soil Type',
          'Road Access Width (Ft)',
          'Fencing Available',
          'Farmhouse Available',
          'Survey Number',
          'City / Taluk*',
          'Village / Locality*',
          'Pincode',
          'Address*',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Industrial Property',
        subcategoryId: 'Industrial',
        headers: [
          'Title*',
          'Industrial Type*',
          'Plot Area (Sq.Ft / Acres)*',
          'Shed / Built-up Area (Sq.Ft)',
          'Price (₹)*',
          'Power Load (HP / KVA)*',
          'Industrial Zone / Area*',
          'Approach Road Width (Ft)',
          'Heavy Vehicle / Container Access',
          'Office Space Available',
          'Labour Quarters Available',
          'Pollution Board NOC Status',
          'Fire Safety Approval',
          'City*',
          'Area / Industrial Estate*',
          'Pincode',
          'Address*',
          'Description',
        ],
        sampleRows: [],
      },
    ],
  },

  vehicle: {
    categoryLabel: 'Vehicle',
    sheets: [
      {
        sheetName: '4-Wheelers & Cars',
        subcategoryId: '4-wheeler',
        headers: [
          'Title*',
          'Brand*',
          'Model*',
          'Year*',
          'Condition*',
          'Fuel Type*',
          'Transmission*',
          'KM Driven*',
          'Price (₹)*',
          'City*',
          'Location / Area*',
          'Pincode',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: '2-Wheelers & Bikes',
        subcategoryId: '2-wheeler',
        headers: [
          'Title*',
          'Brand*',
          'Model*',
          'Year*',
          'Condition*',
          'Fuel Type*',
          'KM Driven*',
          'Price (₹)*',
          'City*',
          'Location / Area*',
          'Pincode',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Commercial Vehicles',
        subcategoryId: 'commercial',
        headers: [
          'Title*',
          'Brand*',
          'Model*',
          'Year*',
          'Condition*',
          'Fuel Type*',
          'KM Driven*',
          'Price (₹)*',
          'City*',
          'Location / Area*',
          'Pincode',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Electric Vehicles',
        subcategoryId: 'electric',
        headers: [
          'Title*',
          'Brand*',
          'Model*',
          'Year*',
          'Condition*',
          'Fuel Type*',
          'KM Driven*',
          'Price (₹)*',
          'City*',
          'Location / Area*',
          'Pincode',
          'Description',
        ],
        sampleRows: [],
      },
    ],
  },

  grocery: {
    categoryLabel: 'Grocery',
    sheets: [
      {
        sheetName: 'Daily Essentials',
        subcategoryId: 'Daily Essentials',
        headers: [
          'Product Name*',
          'Category*',
          'Unit*',
          'Stock*',
          'Brand',
          'Organic',
          'Price (₹)*',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Fruits & Vegetables',
        subcategoryId: 'Fruits & Vegetables',
        headers: [
          'Product Name*',
          'Category*',
          'Unit*',
          'Stock*',
          'Brand',
          'Organic',
          'Price (₹)*',
          'Description',
        ],
        sampleRows: [],
      },
    ],
  },

  garment: {
    categoryLabel: 'Garments',
    sheets: [
      {
        sheetName: "Men's Wear",
        subcategoryId: 'Men',
        headers: [
          'Product Name*',
          'Category*',
          'Subcategory',
          'Size*',
          'Color',
          'Material',
          'Quantity*',
          'Brand',
          'Price (₹)*',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: "Women's Wear",
        subcategoryId: 'Women',
        headers: [
          'Product Name*',
          'Category*',
          'Subcategory',
          'Size*',
          'Color',
          'Material',
          'Quantity*',
          'Brand',
          'Price (₹)*',
          'Description',
        ],
        sampleRows: [],
      },
    ],
  },

  jewellery: {
    categoryLabel: 'Jewellery',
    sheets: [
      {
        sheetName: 'Gold Jewellery',
        subcategoryId: 'Gold',
        headers: [
          'Jewellery Name / Title*',
          'Category*',
          'Metal Type*',
          'Purity*',
          'Weight (Grams)*',
          'Price (₹)*',
          'Making Charges',
          'Gender',
          'Certified',
          'Description',
        ],
        sampleRows: [],
      },
      {
        sheetName: 'Diamond Jewellery',
        subcategoryId: 'Diamond',
        headers: [
          'Jewellery Name / Title*',
          'Category*',
          'Metal Type*',
          'Purity*',
          'Weight (Grams)*',
          'Price (₹)*',
          'Making Charges',
          'Gender',
          'Certified',
          'Description',
        ],
        sampleRows: [],
      },
    ],
  },
  bedding: {
    categoryLabel: 'Bedding & Comfort',
    sheets: [
      {
        sheetName: 'Bedding & Mattresses',
        subcategoryId: 'Mattress',
        headers: [
          'Title*',
          'Brand*',
          'Category*',
          'Material*',
          'Size*',
          'Thickness*',
          'Firmness*',
          'Price (₹)*',
          'Price Suffix',
          'Warranty',
          'Description',
        ],
        sampleRows: [],
      },
    ],
  },
  electronics: {
    categoryLabel: 'Electronics',
    sheets: [
      {
        sheetName: 'Consumer Electronics',
        subcategoryId: 'Electronics',
        headers: [
          'Title*',
          'Brand*',
          'Model*',
          'Category*',
          'Condition*',
          'Price (₹)*',
          'Price Suffix',
          'Warranty',
          'Description',
        ],
        sampleRows: [],
      },
    ],
  },
};

/**
 * Fallback config lookup
 */
export function getCategoryMultiSheetConfig(category) {
  const slug = getCategorySlug(category);
  return MULTI_SHEET_CONFIGS[slug] || MULTI_SHEET_CONFIGS.properties;
}

/**
 * Browser download helper for buffer
 */
function downloadBufferAsFile(buffer, filename) {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates and downloads the official Excel template file with:
 * 1. Dedicated sheets for each individual subcategory (e.g. 7 property types: Flats, House, Plots, Commercial, etc.)
 * 2. Non-editable table headers (Locked Row 1 with Sheet Protection)
 * 3. Unlocked rows (Rows 2-300) so listers can type, paste, and edit inventory freely
 */
export async function downloadCategoryTemplate(category) {
  const slug = getCategorySlug(category);
  const config = getCategoryMultiSheetConfig(slug);
  const timestamp = generateBulkListingTimestamp();
  const filename = getBulkListingFilename(slug, timestamp);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'OneVishwam';
  workbook.created = new Date();

  // Create worksheets for each subcategory
  for (const sheetDef of config.sheets) {
    const sheet = workbook.addWorksheet(sheetDef.sheetName, {
      views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }], // Freeze Row 1 header
    });

    const headers = sheetDef.headers;

    // Set columns with auto width
    sheet.columns = headers.map((header) => ({
      header,
      key: header.replace(/[^a-zA-Z0-9]/g, '_'),
      width: Math.max(header.length + 5, 20),
    }));

    // Row 1: Header styling + LOCKED PROTECTION
    const headerRow = sheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Segoe UI' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' }, // Deep Brand Navy Blue
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF64748B' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FF64748B' } },
        right: { style: 'thin', color: { argb: 'FF64748B' } },
      };
      // TABLE HEADERS ARE NON-EDITABLE (LOCKED)
      cell.protection = { locked: true };
    });

    // Pre-unlock rows 2 through 300 for clean user data entry (no sample rows added)
    for (let r = 2; r <= 300; r++) {
      const row = sheet.getRow(r);
      row.height = 22;
      for (let c = 1; c <= headers.length; c++) {
        const cell = row.getCell(c);
        cell.protection = { locked: false }; // UNLOCKED FOR DATA ENTRY
      }
    }

    // Sheet Protection:
    // Locks the Row 1 headers from any editing/deleting,
    // while explicitly allowing users to select and edit unlocked data rows!
    await sheet.protect('', {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: true,
      formatColumns: true,
      formatRows: true,
      insertColumns: false,
      insertRows: true,
      deleteColumns: false,
      deleteRows: true,
      sort: true,
      autoFilter: true,
      objects: true,
    });
  }

  // Add Instructions & Guide tab
  const guideSheet = workbook.addWorksheet('Instructions & Guide', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
  });

  guideSheet.columns = [
    { header: 'Rule / Section', key: 'section', width: 28 },
    { header: 'Details & Instructions', key: 'details', width: 60 },
    { header: 'Examples / Allowed Values', key: 'examples', width: 45 },
  ];

  const guideHeaderRow = guideSheet.getRow(1);
  guideHeaderRow.height = 30;
  guideHeaderRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Segoe UI' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F766E' }, // Teal
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.protection = { locked: true };
  });

  const guideData = [
    [
      'Subcategory Sheets',
      'Each tab represents a specific subcategory (e.g. Flats & Apartments, Plots & Land, Commercial Spaces, etc.).',
      'Select the tab matching your inventory type.',
    ],
    [
      'Non-Editable Headers',
      'Table headers (Row 1) are locked and protected to maintain database integrity.',
      'Do not attempt to alter or delete column headers.',
    ],
    [
      'Entering Data',
      'Enter one product per row starting from Row 2. You can fill multiple sheets in this workbook.',
      'Leave unused sheets empty — the system scans all sheets and automatically collects populated rows.',
    ],
    [
      'Mandatory Columns',
      'Columns ending with an asterisk (*) like Title*, Price*, City* are required.',
      'Ensure required columns have valid values.',
    ],
    [
      'Filename Format',
      'Keep the exact downloaded filename format when uploading.',
      `${slug}_bulklisting_YYYYMMDD_HHmmss.xlsx`,
    ],
    [
      'Multimedia Upload Workflow (Portal First)',
      'Excel is dedicated to your listing product data (title, price, specs, descriptions). After uploading this spreadsheet on the portal, you will be prompted: "Do you want to upload images or multimedia for this?"',
      'Streamlined 2-step process: Upload spreadsheet → Attach multimedia on portal',
    ],
    [
      'Editing Media in Uploaded Batches',
      'In the Lister portal (Listings > Bulk Batches), expand your batch and click "Edit" on any item to upload or change images (max 5, ≤1MB each), video (≤10MB), and PDF brochure (≤2MB).',
      'Instant cloud upload to Firebase Storage',
    ],
  ];

  guideData.forEach((rowVals) => {
    const row = guideSheet.addRow(rowVals);
    row.height = 24;
    row.eachCell((cell) => {
      cell.font = { size: 10, name: 'Segoe UI', color: { argb: 'FF334155' } };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      cell.protection = { locked: true };
    });
  });

  await guideSheet.protect('', {
    selectLockedCells: true,
    selectUnlockedCells: true,
  });

  // Write buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  downloadBufferAsFile(buffer, filename);

  return {
    filename,
    timestamp,
    category: slug,
    sheetCount: config.sheets.length,
  };
}

/**
 * Parses client-side Excel file for UI preview by scanning ALL sheets,
 * including extracting any embedded picture shapes inserted via VBA or Place in Cell.
 */
export async function parseExcelFileForPreview(file, expectedCategory) {
  const arrayBuffer = await file.arrayBuffer();

  // 1. Load with ExcelJS to inspect and extract any embedded pictures
  const excelJsWb = new ExcelJS.Workbook();
  let hasExcelJs = false;
  try {
    await excelJsWb.xlsx.load(arrayBuffer);
    hasExcelJs = true;
  } catch (err) {
    console.warn('ExcelJS could not inspect embedded images:', err);
  }

  // 2. Load with SheetJS for tabular data parsing
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('Excel file has no worksheets');
  }

  const allRows = [];
  const sheetBreakdown = {};

  for (const sheetName of workbook.SheetNames) {
    const lower = sheetName.toLowerCase().trim();
    if (lower.includes('instruction') || lower.includes('guide') || lower.includes('readme')) {
      continue;
    }
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    // Extract embedded images from this worksheet if ExcelJS loaded
    const embeddedImagesByRow = {};
    if (hasExcelJs) {
      try {
        const jsSheet = excelJsWb.getWorksheet(sheetName);
        if (jsSheet && typeof jsSheet.getImages === 'function') {
          const sheetImages = jsSheet.getImages() || [];
          sheetImages.forEach((imgObj) => {
            try {
              const rowAnchor = imgObj.range?.tl ? Math.floor(imgObj.range.tl.row) + 1 : null;
              if (rowAnchor && rowAnchor >= 2) {
                const imgInfo = excelJsWb.getImage(imgObj.imageId);
                if (imgInfo && imgInfo.buffer) {
                  const ext = imgInfo.extension || 'png';
                  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
                  const blob = new Blob([imgInfo.buffer], { type: mime });
                  const imgFile = new File([blob], `excel_img_r${rowAnchor}_${imgObj.imageId}.${ext}`, { type: mime });
                  if (!embeddedImagesByRow[rowAnchor]) embeddedImagesByRow[rowAnchor] = [];
                  if (embeddedImagesByRow[rowAnchor].length < 5) {
                    embeddedImagesByRow[rowAnchor].push(imgFile);
                  }
                }
              }
            } catch (imgErr) {
              console.warn('Error reading single image in worksheet:', imgErr);
            }
          });
        }
      } catch (sheetErr) {
        console.warn('Error processing worksheet images:', sheetErr);
      }
    }

    const validRows = rawRows.filter((r) => {
      const vals = Object.values(r).filter((v) => v !== '' && v !== null && v !== undefined);
      if (vals.length === 0) return false;

      // Filter out instruction or placeholder rows
      const title = String(
        r['Title*'] ||
          r.Title ||
          r.title ||
          r['Product Name*'] ||
          r['Jewellery Name / Title*'] ||
          r.Name ||
          ''
      );
      const price = String(r['Price (₹)*'] || r['Price*'] || r.Price || r.price || '');
      if (title.toLowerCase().includes('sample') && price.toLowerCase().includes('example')) {
        return false;
      }
      return true;
    });

    if (validRows.length > 0) {
      sheetBreakdown[sheetName] = validRows.length;
      validRows.forEach((r, rowIdxInValid) => {
        const rawImg1 = r['Image 1'] || r['Image 1 (Max 1MB)'] || r['Image 1*'] || '';
        const rawImg2 = r['Image 2'] || r['Image 2 (Max 1MB)'] || '';
        const rawImg3 = r['Image 3'] || r['Image 3 (Max 1MB)'] || '';
        const rawImg4 = r['Image 4'] || r['Image 4 (Max 1MB)'] || '';
        const rawImg5 = r['Image 5'] || r['Image 5 (Max 1MB)'] || '';
        const legacyImages = r['Images (Max 5, ≤1MB each)'] || r['Image URLs'] || r.Images || r.images || '';

        const rawVideo = r['Video'] || r['Video (Max 10MB)'] || r['Video (Max 1, ≤10MB)'] || r['Video URL'] || r.Video || r.video || '';
        const rawPdf = r['PDF / Brochure'] || r['PDF / Brochure (Max 2MB)'] || r['PDF / Brochure (Max 1, ≤2MB)'] || r['PDF URL'] || r.Brochure || r.pdfUrl || '';

        // Row 1 is header, data rows start at row 2
        const sheetRowNum = rowIdxInValid + 2;
        const rowExtractedImages = embeddedImagesByRow[sheetRowNum] || [];

        const discreteCols = [rawImg1, rawImg2, rawImg3, rawImg4, rawImg5];
        const legacyList = legacyImages
          ? String(legacyImages)
              .split(/[\n,;]+/)
              .map((s) => s.trim())
              .filter(Boolean)
              .filter((s) => !s.startsWith('['))
          : [];

        // Build fixed 5-slot array for Image 1 to Image 5
        const initial5Images = [null, null, null, null, null];
        for (let s = 0; s < 5; s++) {
          if (rowExtractedImages[s]) {
            initial5Images[s] = rowExtractedImages[s];
          } else if (discreteCols[s] && String(discreteCols[s]).trim() && !String(discreteCols[s]).trim().startsWith('[')) {
            initial5Images[s] = String(discreteCols[s]).trim();
          } else if (legacyList[s]) {
            initial5Images[s] = legacyList[s];
          }
        }

        allRows.push({
          ...r,
          _sheetName: sheetName,
          _initialImages: initial5Images,
          _initialVideo: String(rawVideo).trim().replace(/^\[.*\]$/, '') || null,
          _initialPdf: String(rawPdf).trim().replace(/^\[.*\]$/, '') || null,
        });
      });
    }
  }

  if (allRows.length === 0) {
    throw new Error('None of the sheets in the uploaded Excel file contain valid data rows.');
  }

  return {
    sheetNames: Object.keys(sheetBreakdown),
    sheetBreakdown,
    totalRows: allRows.length,
    rows: allRows,
  };
}
