import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { PageContainer, PageHeader } from "../../components/ui/PageContainer";
import { CATEGORIES } from "../AddListing/constants";
import {
  downloadCategoryTemplate,
  validateUploadedFilename,
  getCategorySlug,
  getBulkListingFilename,
  parseExcelFileForPreview,
} from "../../utils/bulkTemplateGenerator";
import { bulkUploadListings } from "../../services/listings";

export default function BulkListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Supported bulk upload categories (focus on top 5 marketplace categories)
  const bulkCategories = CATEGORIES.filter((c) =>
    ["real-estate", "vehicle", "grocery", "garment", "jewellery"].includes(c.id)
  );

  const [selectedCategory, setSelectedCategory] = useState(bulkCategories[0]?.id || "real-estate");
  const [downloadedFilename, setDownloadedFilename] = useState("");
  const [downloadTimestamp, setDownloadTimestamp] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileValidation, setFileValidation] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const currentCategoryObj = bulkCategories.find((c) => c.id === selectedCategory) || bulkCategories[0];
  const canonicalSlug = getCategorySlug(selectedCategory);

  // Handle template download
  const handleDownloadTemplate = () => {
    setIsDownloading(true);
    try {
      const res = downloadCategoryTemplate(selectedCategory);
      setDownloadedFilename(res.filename);
      setDownloadTimestamp(res.timestamp);

      Swal.fire({
        icon: "success",
        title: "Template Downloaded!",
        html: `
          <div class="text-left text-sm space-y-2">
            <p>Your Excel template <b>${res.filename}</b> has been downloaded.</p>
            <div class="p-2.5 bg-blue-50 text-blue-800 rounded-lg text-xs">
              <i class="fa-solid fa-circle-info mr-1"></i>
              <b>Important:</b> Please keep this exact filename format (<code>${canonicalSlug}_bulklisting_${res.timestamp}.xlsx</code>) when you upload.
            </div>
          </div>
        `,
        confirmButtonColor: "#2563eb",
      });
    } catch (err) {
      console.error("Template download error:", err);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Could not generate Excel template. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle file selection
  const handleFileChange = async (file) => {
    if (!file) return;

    // Validate filename
    const validation = validateUploadedFilename(file.name, selectedCategory);
    setFileValidation(validation);
    setUploadedFile(file);
    setUploadResult(null);

    if (!validation.valid) {
      setPreviewData(null);
      return;
    }

    // Parse Excel for preview
    setPreviewLoading(true);
    try {
      const preview = await parseExcelFileForPreview(file, selectedCategory);
      setPreviewData(preview);
    } catch (err) {
      console.error("Error reading Excel:", err);
      setFileValidation({
        valid: false,
        error: `Could not read Excel file: ${err.message}`,
      });
      setPreviewData(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Reset file
  const handleClearFile = () => {
    setUploadedFile(null);
    setFileValidation(null);
    setPreviewData(null);
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit bulk listing
  const handleSubmit = async () => {
    if (!uploadedFile || !fileValidation?.valid) {
      Swal.fire({
        icon: "warning",
        title: "Invalid File",
        text: fileValidation?.error || "Please select a valid Excel file first.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("category", selectedCategory);

      const result = await bulkUploadListings(formData);
      setUploadResult(result);

      Swal.fire({
        icon: "success",
        title: "Upload Successful!",
        html: `
          <div class="text-left space-y-3 text-sm">
            <p class="font-medium text-slate-800">
              Successfully processed <b>${result?.insertedCount || previewData?.totalRows || 0}</b> listing(s)!
            </p>
            <div class="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs space-y-1">
              <p class="font-bold flex items-center gap-1.5 text-amber-800">
                <i class="fa-solid fa-clock-rotate-left"></i> Status: Pending Admin Review
              </p>
              <p>All items have been queued in pending status. Once our administration team verifies the details, they will go live on One Vishwam.</p>
            </div>
          </div>
        `,
        confirmButtonText: "View My Listings (Pending)",
        confirmButtonColor: "#2563eb",
        showCancelButton: true,
        cancelButtonText: "Upload More",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/listings?status=pending");
        } else {
          handleClearFile();
        }
      });
    } catch (err) {
      console.error("Bulk upload error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to process bulk upload.";
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: msg,
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      {/* ── Page Header ── */}
      <PageHeader
        title="Bulk Product Listing"
        subtitle="Download category-specific Excel templates, fill your inventory, and upload in bulk."
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/add-listing"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <i className="fa-solid fa-plus text-xs text-brand-blue"></i>
              Single Listing Form
            </Link>
            <Link
              to="/listings?status=pending"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all shadow-sm"
            >
              <i className="fa-solid fa-hourglass-half text-xs"></i>
              Pending Approvals
            </Link>
          </div>
        }
      />

      {/* ── Progress & Workflow Banner ── */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <i className="fa-solid fa-bolt text-amber-400"></i> Fast Multi-Item Intake
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              List Tens or Hundreds of Items in Minutes
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Select your category below, download the official Excel template, add your records, and upload.
              Uploaded items are automatically placed in <span className="text-amber-300 font-semibold">Pending Review</span> for prompt admin approval.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-xl font-bold text-blue-300">1</span>
              <span className="text-[11px] text-slate-300">Pick Category</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-xl font-bold text-amber-300">2</span>
              <span className="text-[11px] text-slate-300">Get Template</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="block text-xl font-bold text-emerald-300">3</span>
              <span className="text-[11px] text-slate-300">Upload & Save</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* ── STEP 1: Select Category ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-brand-blue font-bold text-sm">
                1
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Select Listing Category</h3>
                <p className="text-xs text-slate-500">Each category has its own tailored Excel columns and instructions</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              Active: {currentCategoryObj.label}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {bulkCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    handleClearFile();
                  }}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 relative ${
                    isSelected
                      ? "border-brand-blue bg-blue-50/60 ring-2 ring-brand-blue/30 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected
                        ? "bg-brand-blue text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    }`}
                  >
                    <i className={`fa-solid ${cat.icon} text-lg`}></i>
                  </div>
                  <span className={`font-bold text-sm ${isSelected ? "text-brand-blue" : "text-slate-900"}`}>
                    {cat.label}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</span>

                  {isSelected && (
                    <span className="absolute top-3 right-3 text-brand-blue">
                      <i className="fa-solid fa-circle-check text-base"></i>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── STEP 2: Download Template Button & Guidelines ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-brand-blue font-bold text-sm">
                2
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Download Official Excel Template</h3>
                <p className="text-xs text-slate-500">
                  Pre-configured with headers, valid dropdowns, sample rows, and format rules
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <i className="fa-solid fa-file-excel mr-1"></i> Microsoft Excel (.xlsx)
                </span>
                <span className="text-xs text-slate-500">
                  Category: <b>{currentCategoryObj.label}</b>
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <b>Naming convention:</b> When downloaded, the template is named:
                </p>
                <div className="font-mono text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
                  {canonicalSlug}_bulklisting_YYYYMMDD_HHmmss.xlsx
                </div>
                <p className="text-[11px] text-slate-500">
                  <i className="fa-solid fa-triangle-exclamation text-amber-500 mr-1"></i>
                  The uploaded file name must match this pattern so the backend routes and parses it accurately.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 shrink-0 transform active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-file-arrow-down text-lg"></i>
                  <span>Download {currentCategoryObj.label} Template</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── STEP 3: Upload Excel File ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-brand-blue font-bold text-sm">
                3
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Upload Filled Excel File</h3>
                <p className="text-xs text-slate-500">
                  Drop your saved file here. Filename will be verified against the download pattern.
                </p>
              </div>
            </div>

            {uploadedFile && (
              <button
                type="button"
                onClick={handleClearFile}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
              >
                <i className="fa-solid fa-trash-can"></i> Remove File
              </button>
            )}
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-brand-blue bg-blue-50/80 scale-[1.01]"
                : uploadedFile
                ? fileValidation?.valid
                  ? "border-emerald-400 bg-emerald-50/30"
                  : "border-rose-400 bg-rose-50/30"
                : "border-slate-300 hover:border-brand-blue hover:bg-slate-50/70"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {!uploadedFile ? (
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shadow-inner">
                  <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Click to browse or drag and drop your Excel file here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Accepts <b>.xlsx</b> or <b>.xls</b> up to 25MB
                  </p>
                </div>
                <div className="pt-1">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium font-mono">
                    Expected: {canonicalSlug}_bulklisting_YYYYMMDD_HHmmss.xlsx
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-sm ${
                    fileValidation?.valid ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      fileValidation?.valid ? "fa-file-circle-check" : "fa-file-circle-xmark"
                    } text-2xl`}
                  ></i>
                </div>

                <div>
                  <p className="font-mono text-sm font-bold text-slate-900">{uploadedFile.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Size: {(uploadedFile.size / 1024).toFixed(1)} KB · Last Modified:{" "}
                    {new Date(uploadedFile.lastModified).toLocaleString()}
                  </p>
                </div>

                {/* Validation Status Badge */}
                {fileValidation?.valid ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <i className="fa-solid fa-circle-check text-emerald-600"></i>
                    Filename verified! Matches template pattern ({canonicalSlug}_bulklisting_{fileValidation.timestamp}.xlsx)
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs text-left max-w-lg mx-auto space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-rose-900">
                      <i className="fa-solid fa-triangle-exclamation"></i> Filename Validation Failed
                    </p>
                    <p>{fileValidation?.error}</p>
                    <p className="text-slate-600 mt-1">
                      💡 Tip: Download the template first or rename your file to match{" "}
                      <code>{canonicalSlug}_bulklisting_YYYYMMDD_HHmmss.xlsx</code>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── STEP 4: Pre-Upload Preview Table ── */}
          {previewLoading && (
            <div className="p-6 text-center text-slate-500 text-sm">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i> Reading Excel data...
            </div>
          )}

          {previewData && previewData.rows && previewData.rows.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-brand-blue rounded-lg font-bold text-xs">
                    {previewData.totalRows} Item(s) Detected
                  </span>
                  <span className="text-xs text-slate-500">
                    Sheet: <b>{previewData.sheetName}</b>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  <i className="fa-solid fa-hourglass-half"></i>
                  Will be submitted with Pending Admin Approval status
                </div>
              </div>

              {/* Responsive preview table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Title / Name</th>
                      <th className="py-2.5 px-3">Type / Category</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Location / City</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {previewData.rows.slice(0, 15).map((row, idx) => {
                      const title =
                        row["Title*"] ||
                        row["Product Name*"] ||
                        row["Brand*"] ||
                        row["Item Name / Title*"] ||
                        row.Title ||
                        row.Name ||
                        `Product ${idx + 1}`;

                      const type =
                        row["Property Type*"] ||
                        row["Vehicle Type*"] ||
                        row["Category*"] ||
                        row.Category ||
                        currentCategoryObj.label;

                      const price = row["Price*"] || row.Price || "-";
                      const city = row["City*"] || row.City || row.Location || "-";

                      return (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900 max-w-xs truncate">{title}</td>
                          <td className="py-2 px-3 text-slate-600">{type}</td>
                          <td className="py-2 px-3 font-bold text-emerald-700">{price}</td>
                          <td className="py-2 px-3 text-slate-600">{city}</td>
                          <td className="py-2 px-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                              Pending
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {previewData.totalRows > 15 && (
                <p className="text-[11px] text-slate-500 text-center">
                  Showing first 15 of {previewData.totalRows} products. All {previewData.totalRows} products will be submitted upon upload.
                </p>
              )}

              {/* Upload Submit Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  <i className="fa-solid fa-shield-check text-emerald-600 mr-1"></i>
                  Data verified. Ready to upload {previewData.totalRows} product(s) to MongoDB Atlas.
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleClearFile}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !fileValidation?.valid}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Processing & Uploading...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-upload"></i>
                        <span>Upload & Submit for Approval</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
