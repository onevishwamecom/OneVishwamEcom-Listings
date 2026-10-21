import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { PageContainer, PageHeader } from "../../components/ui/PageContainer";
import { CATEGORIES } from "../AddListing/constants";
import {
  downloadCategoryTemplate,
  validateUploadedFilename,
  getCategorySlug,
  parseExcelFileForPreview,
} from "../../utils/bulkTemplateGenerator";
import { bulkUploadListings, recordTemplateDownloadLog } from "../../services/listings";

export default function BulkListing() {
  const navigate = useNavigate();
  const { categoryType } = useParams();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);

  // Supported bulk upload categories (declaratively configured from category registry)
  const bulkCategories = CATEGORIES;

  // Determine active category from route param (/bulk-listing/:categoryType) or query (?category=...)
  const rawParam = categoryType || searchParams.get("category") || "properties";
  const normalizedCategory = (rawParam === "real-estate" || rawParam === "realestate") ? "properties" : rawParam;

  const currentCategoryObj =
    bulkCategories.find((c) => c.id === normalizedCategory) ||
    CATEGORIES.find((c) => c.id === normalizedCategory) ||
    bulkCategories[0];

  const selectedCategory = currentCategoryObj.id;
  const canonicalSlug = getCategorySlug(selectedCategory);

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

  // Upload progress tracking
  const [uploadStatusText, setUploadStatusText] = useState("");
  const [uploadProgressPercent, setUploadProgressPercent] = useState(0);

  // Reset file state if category changes
  useEffect(() => {
    handleClearFile();
  }, [selectedCategory]);

  // Handle template download
  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      const res = await downloadCategoryTemplate(selectedCategory);
      setDownloadedFilename(res.filename);
      setDownloadTimestamp(res.timestamp);

      // Record persistent audit log in backend
      recordTemplateDownloadLog({
        category: selectedCategory,
        filename: res.filename,
        timestamp: res.timestamp,
      }).catch((logErr) => console.warn("Could not log template download:", logErr));

      Swal.fire({
        icon: "success",
        title: "Template Downloaded",
        text: `Template saved: ${res.filename}`,
        timer: 2000,
        showConfirmButton: false,
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

  // Submit bulk listing and prompt user for multimedia upload
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
    setUploadProgressPercent(30);
    setUploadStatusText("Uploading Excel spreadsheet...");

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("category", selectedCategory);

      setUploadProgressPercent(60);
      setUploadStatusText("Processing listings and validating rows...");

      const result = await bulkUploadListings(formData);
      setUploadProgressPercent(100);
      setUploadResult(result);

      const batchId = result?.batchId || "";
      const insertedCount = result?.insertedCount || previewData?.totalRows || 0;

      // Post-upload prompt: Upload multimedia or view batches
      Swal.fire({
        icon: "success",
        title: "Batch Created!",
        text: `${insertedCount} listings uploaded as batch ${batchId}. Would you like to upload multimedia now?`,
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-cloud-arrow-up mr-1.5"></i> Upload Media',
        cancelButtonText: 'View Batches',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#64748b',
        customClass: {
          confirmButton: 'rounded-xl px-4 py-2 font-bold text-xs',
          cancelButton: 'rounded-xl px-4 py-2 font-bold text-xs',
        },
      }).then((res) => {
        if (res.isConfirmed && batchId) {
          navigate(`/listings?view=bulk&batchId=${encodeURIComponent(batchId)}&openMedia=1`);
        } else {
          navigate("/listings?view=bulk");
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
      setUploadProgressPercent(0);
      setUploadStatusText("");
    }
  };

  return (
    <PageContainer>
      {/* ── Page Header ── */}
      <PageHeader
        title={`${currentCategoryObj.label} Bulk Upload`}
        subtitle="Upload multiple listings at once via Excel spreadsheet."
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/listings?view=bulk"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-xs"
            >
              <i className="fa-solid fa-layer-group text-slate-500" />
              View Batches
            </Link>
            <Link
              to={selectedCategory === "properties" ? "/add-listing" : `/add-listing/${selectedCategory}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-brand-blue bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all shadow-xs"
            >
              <i className="fa-solid fa-plus text-xs" />
              Single Listing
            </Link>
          </div>
        }
      />

      {/* ── Category Quick Switcher ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5">
        {bulkCategories.map((cat) => {
          const isActive = cat.id === selectedCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/bulk-listing/${cat.id}`)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <i className={`fa-solid ${cat.icon} ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-5">
        {/* ── STEP 1: Download Template ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-brand-blue font-extrabold text-xs shrink-0">
                1
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900">Download Template</h3>
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {canonicalSlug}_bulklisting_*.xlsx
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-configured multi-sheet Excel spreadsheet for {currentCategoryObj.label}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-file-arrow-down" />
                  <span>Download {currentCategoryObj.label} Template (.xlsx)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── STEP 2: Upload Excel File ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-brand-blue font-extrabold text-xs shrink-0">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900">Upload Filled Spreadsheet</h3>
            </div>

            {uploadedFile && (
              <button
                type="button"
                onClick={handleClearFile}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <i className="fa-solid fa-trash-can" /> Remove
              </button>
            )}
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-brand-blue bg-blue-50/70"
                : uploadedFile
                ? fileValidation?.valid
                  ? "border-emerald-400 bg-emerald-50/30"
                  : "border-rose-400 bg-rose-50/30"
                : "border-slate-300 hover:border-brand-blue hover:bg-slate-50/50"
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
              <div className="space-y-1 py-2">
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-2">
                  <i className="fa-solid fa-cloud-arrow-up text-lg" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Drop your .xlsx here, or <span className="text-brand-blue underline">browse</span>
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Format: {canonicalSlug}_bulklisting_*.xlsx
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 py-1">
                <div className="flex items-center justify-center gap-2">
                  <i
                    className={`fa-solid ${
                      fileValidation?.valid ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-rose-600"
                    } text-base`}
                  />
                  <span className="font-mono text-xs font-bold text-slate-800">{uploadedFile.name}</span>
                  <span className="text-[11px] text-slate-400">
                    ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>

                {!fileValidation?.valid && (
                  <p className="text-xs text-rose-600 font-medium">
                    {fileValidation?.error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Pre-Upload Preview Table */}
          {previewLoading && (
            <div className="py-4 text-center text-slate-500 text-xs">
              <i className="fa-solid fa-spinner fa-spin mr-1.5" /> Reading Excel data...
            </div>
          )}

          {previewData && previewData.rows && previewData.rows.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-blue-50 text-brand-blue rounded-lg font-bold text-xs border border-blue-100">
                    {previewData.totalRows} Product(s) Found
                  </span>
                  {previewData.sheetBreakdown &&
                    Object.entries(previewData.sheetBreakdown).map(([sheetName, count]) => (
                      <span
                        key={sheetName}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                      >
                        <span>{sheetName}:</span>
                        <b className="text-slate-900">{count}</b>
                      </span>
                    ))}
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  <i className="fa-solid fa-clock-rotate-left text-[10px]" />
                  Pending Review
                </span>
              </div>

              {/* Clean Preview Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] sticky top-0 z-20 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Subcategory</th>
                      <th className="py-2 px-3">Title / Name</th>
                      <th className="py-2 px-3">Price</th>
                      <th className="py-2 px-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {previewData.rows.slice(0, 15).map((row, idx) => {
                      const title =
                        row["Title*"] ||
                        row["Product Name*"] ||
                        row["Brand*"] ||
                        row["Item Name / Title*"] ||
                        row["Jewellery Name / Title*"] ||
                        row.Title ||
                        row.Name ||
                        `Item ${idx + 1}`;
                      const price = row["Price (₹)*"] || row["Price*"] || row.Price || "-";
                      const city = row["City*"] || row.City || row.Location || "-";

                      return (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 max-w-[140px] truncate">
                              {row._sheetName || "Default"}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-900 max-w-xs truncate" title={title}>
                            {title}
                          </td>
                          <td className="py-2 px-3 font-bold text-slate-900">{price}</td>
                          <td className="py-2 px-3 text-slate-600">{city}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {previewData.totalRows > 15 && (
                <p className="text-[11px] text-slate-400 text-center">
                  Showing first 15 of {previewData.totalRows} items.
                </p>
              )}

              {/* Upload Progress Bar if submitting */}
              {isSubmitting && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-xs text-blue-900">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-spinner fa-spin text-brand-blue" />
                      {uploadStatusText || "Uploading..."}
                    </span>
                    <span className="font-mono text-brand-blue">{uploadProgressPercent}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClearFile}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !fileValidation?.valid}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-upload" />
                      <span>Upload & Submit ({previewData.totalRows})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
