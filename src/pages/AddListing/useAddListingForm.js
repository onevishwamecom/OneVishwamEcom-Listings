import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { cities, defaultCity } from "../../data/locations";
import { formatINR } from "../../utils";
import { INITIAL_FORM, STEPS, CATEGORY_FIELDS, REQUIRED_BY_STEP } from "./formConfig";
import { validateStep, canNext } from "./validation";
import { createNewListingData, createUpdatedListingData } from "./payloadBuilder";
import { CATEGORY_TO_MOCK, SERVICE_TYPE_TO_CATEGORY } from "./constants";
import { findListing, createListing, updateListing, invalidateListings } from "../../services/listings";
import { getCachedUser } from "../../services/userCache";
import { useListingStats } from "../../components/ListingStats";

export function useAddListingForm() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const editType = searchParams.get("type");
  const isEditing = Boolean(editId && editType);
  const { refresh: refreshStats } = useListingStats();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [brochure, setBrochure] = useState(null);
  const [brochureUrl, setBrochureUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [originalListingId, setOriginalListingId] = useState(null);
  const [adminFeedback, setAdminFeedback] = useState(null);

  const fileRef = useRef(null);
  const brochureRef = useRef(null);
  const documentRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [docDragOver, setDocDragOver] = useState(false);

  const category = form.category;
  const subcategory = form.subcategory;
  const catFields = CATEGORY_FIELDS[category] || [];

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const imageUrls = photos.filter((p) => p.url).map((p) => p.url);
  const docUrls = documents.filter((d) => d.url).map((d) => d.url);

  const removePhoto = (index) =>
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));

  const removeDocument = (index) =>
    setDocuments((prev) => prev.filter((_, idx) => idx !== index));

  const handleAddPhoto = async (file) => {
    if (!file || photos.length >= 6) return;
    const tempId = Date.now() + Math.random();
    setPhotos((prev) => [
      ...prev,
      { id: tempId, name: file.name, size: file.size, file, uploading: true },
    ]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const url = URL.createObjectURL(file);
      setPhotos((prev) =>
        prev.map((p) => (p.id === tempId ? { ...p, url, uploading: false } : p)),
      );
    } catch (err) {
      console.warn("Image upload failed:", err?.response?.data?.message || err?.message);
      setPhotos((prev) => prev.filter((p) => p.id !== tempId));
      Swal.fire({ icon: "error", title: "Upload Failed", text: "Failed to upload photo." });
    }
  };

  const handleAddDocument = async (file) => {
    if (!file || documents.length >= 4) return;
    const tempId = Date.now() + Math.random();
    setDocuments((prev) => [
      ...prev,
      { id: tempId, name: file.name, size: file.size, file, uploading: true },
    ]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const url = URL.createObjectURL(file);
      setDocuments((prev) =>
        prev.map((d) => (d.id === tempId ? { ...d, url, uploading: false } : d)),
      );
    } catch (err) {
      console.warn("Document upload failed:", err?.message);
      setDocuments((prev) => prev.filter((d) => d.id !== tempId));
      Swal.fire({ icon: "error", title: "Upload Failed", text: "Failed to upload document." });
    }
  };

  const handleSaveDraft = () => {
    try {
      const draft = {
        step,
        category,
        subcategory,
        form,
        photos: photos.map((p) => p.url).filter(Boolean),
        documents: documents.map((d) => d.url).filter(Boolean),
        brochure: brochureUrl,
        savedAt: Date.now(),
      };
      localStorage.setItem("OneVishwam_listing_draft", JSON.stringify(draft));
      Swal.fire({
        icon: "success",
        title: "Draft Saved!",
        text: "Your draft has been saved locally. You can continue later.",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      console.warn("Failed to save draft:", err?.message);
      setSubmitError("Failed to save draft. Local storage may be full or unavailable.");
    }
  };

  const handlePublish = () => {
    if (!validateStep(form, step, catFields, imageUrls, STEPS, REQUIRED_BY_STEP, setValidationErrors)) return;
    if (imageUrls.length === 0) {
      setValidationErrors((prev) => ({ ...prev, photos: "At least one photo is required" }));
      setStep(STEPS.findIndex(s => s.id === "media"));
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    setSubmitError(null);
    try {
      const typeKey = CATEGORY_TO_MOCK[category] || category;

      if (isEditing && originalListingId) {
        await updateListing(typeKey, originalListingId, createUpdatedListingData(form, category, subcategory, imageUrls, docUrls, brochureUrl, cities));
      } else {
        const listingPayload = createNewListingData(form, category, subcategory, imageUrls, docUrls, brochureUrl, cities);
        const user = getCachedUser() || {};
        await createListing({
          ...listingPayload,
          contributor: {
            name: user.fullName || user.name || 'Unknown',
            type: user.role || 'vendor',
            email: user.email || '',
            contact: user.contact || user.phone || user.mobile || listingPayload.contact || '',
            city: user.city || listingPayload.city || '',
          },
        });
      }

      if (brochure) {
        setBrochureUrl(URL.createObjectURL(brochure));
      }

      invalidateListings();
      refreshStats();
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to publish listing",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const setValidationError = (key, message) => {
    setValidationErrors((prev) => ({ ...prev, [key]: message }));
  };

  const handleNext = () => {
    if (canNext(form, step, catFields, imageUrls, STEPS, REQUIRED_BY_STEP)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLastStep = step === STEPS.length - 1;

  useEffect(() => {
    if (!isEditing) return;
    let cancelled = false;
    const loadForEdit = async () => {
      setLoading(true);
      try {
        const serviceType = SERVICE_TYPE_TO_CATEGORY[editType] || editType;
        const typeKey = CATEGORY_TO_MOCK[serviceType] || editType;
        const item = await findListing(typeKey, editId);
        if (!item) throw new Error("Listing not found");
        if (cancelled) return;

        const nextForm = { ...INITIAL_FORM };
        Object.keys(nextForm).forEach((key) => {
          if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
            nextForm[key] = item[key];
          }
        });
        nextForm.title = item.title || item.name || nextForm.title;
        nextForm.subtitle = item.subtitle || "";
        nextForm.description = item.description || "";
        nextForm.price = item.price || "";
        nextForm.priceSuffix = item.priceSuffix || "";
        nextForm.area = item.area || item.location || "";
        nextForm.city = item.city || defaultCity;
        nextForm.pincode = item.pincode || "";
        nextForm.contact = item.contact || item.contactPhone || "9876543210";
        nextForm.category = serviceType;

        if (serviceType === "vehicle") {
          nextForm.brand = item.brand || item.make || "";
          nextForm.model = item.model || "";
          nextForm.year = item.year || "";
          nextForm.fuelType = item.fuelType || "";
          nextForm.kmDriven = item.kmDriven ?? "";
          nextForm.transmission = item.transmission || "";
        }
        if (serviceType === "grocery") {
          nextForm.quantity = item.stock ?? nextForm.quantity;
          nextForm.unit = item.unit || nextForm.unit;
        }
        if (serviceType === "garment") {
          nextForm.size = item.size || "";
          nextForm.color = item.color || "";
        }
        if (serviceType === "jewellery") {
          nextForm.weight = item.weight ?? item.weightGrams ?? nextForm.weight;
          nextForm.material = item.metalType || item.material || "";
          nextForm.purity = item.purity || "";
        }
        if (serviceType === "finance")
          nextForm.serviceType = item.type || item.category || nextForm.serviceType;

        const existingImages = (
          Array.isArray(item.images)
            ? item.images
            : item.image
            ? [item.image]
            : []
        )
          .filter(Boolean)
          .map((url, i) => ({
            id: `existing-${i}-${url}`,
            url,
            name: `photo-${i + 1}`,
          }));
        setPhotos(existingImages);
        if (item.brochure) setBrochureUrl(item.brochure);
        setForm(nextForm);

        setOriginalListingId(item._id);

        if (item.status === 'changes-required' && item.adminComment) {
          setAdminFeedback(item.adminComment);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load listing for edit:", err);
          setLoadError(
            err?.response?.data?.message ||
              "Failed to load listing. It may have been deleted.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadForEdit();
    return () => { cancelled = true; };
  }, [isEditing, editType, editId]);

return {
    // State
    step,
    setStep,
    form,
    photos,
    setPhotos,
    documents,
    setDocuments,
    brochure,
    setBrochure,
    brochureUrl,
    setBrochureUrl,
    submitted,
    submitting,
    submitError,
    loadError,
    loading,
    showConfirm,
    setShowConfirm,
    validationErrors,
    setValidationErrors,
    isEditing,
    isLastStep,
    category,
    subcategory,
    catFields,
    imageUrls,
    docUrls,
    originalListingId,
    adminFeedback,
    // Refs
    fileRef,
    brochureRef,
    documentRef,
    dragOver,
    setDragOver,
    docDragOver,
    setDocDragOver,
    // Handlers
    updateForm,
    handleAddPhoto,
    handleAddDocument,
    removePhoto,
    removeDocument,
    handleSaveDraft,
    handlePublish,
    handleConfirmSubmit,
    handleNext,
    handleBack,
    setValidationError,
    formatINR,
    canNext,
  };
}