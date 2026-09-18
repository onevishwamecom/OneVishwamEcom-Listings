import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { cities, defaultCity } from "../../data/locations";
import { formatINR } from "../../utils";
import { INITIAL_FORM, STEPS, CATEGORY_FIELDS, REQUIRED_BY_STEP } from "./formConfig";
import { validateStep, canNext } from "./validation";
import { createNewListingData, createUpdatedListingData } from "./payloadBuilder";
import { CATEGORY_TO_MOCK, SERVICE_TYPE_TO_CATEGORY, SUBCATEGORIES } from "./constants";
import { findListing, createListing, updateListing, invalidateListings, uploadImages, uploadBrochure, uploadVideo } from "../../services/listings";
import { getCachedUser } from "../../services/userCache";
import { useListingStats } from "../../components/ListingStats";

export function useAddListingForm() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const editType = searchParams.get("type");
  const isEditing = Boolean(editId && editType);
  const { refresh: refreshStats } = useListingStats();

  const [step, setStep] = useState(isEditing ? 1 : 0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
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
  const videoRef = useRef(null);
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
    setPhotos((prev) => {
      const removed = prev[index];
      if (removed?.url) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter((_, idx) => idx !== index);
    });

  const removeDocument = (index) =>
    setDocuments((prev) => {
      const removed = prev[index];
      if (removed?.url) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter((_, idx) => idx !== index);
    });

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
      });
      documents.forEach((d) => {
        if (d.url && d.url.startsWith('blob:')) URL.revokeObjectURL(d.url);
      });
      if (brochureUrl && brochureUrl.startsWith('blob:')) URL.revokeObjectURL(brochureUrl);
      if (videoUrl && videoUrl.startsWith('blob:')) URL.revokeObjectURL(videoUrl);
    };
  }, []);

  const handleAddPhoto = async (file) => {
    if (!file) return;
    if (photos.length >= 5) {
      Swal.fire({
        icon: "warning",
        title: "Limit Reached",
        text: "You can add a maximum of 5 photos.",
      });
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum allowed photo size is 1MB.`,
      });
      return;
    }

    const tempId = Date.now() + Math.random();
    setPhotos((prev) => [
      ...prev,
      { id: tempId, name: file.name, size: file.size, file, uploading: true },
    ]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const url = URL.createObjectURL(file);
      setPhotos((prev) =>
        prev.map((p) => (p.id === tempId ? { ...p, url, uploading: false } : p)),
      );
    } catch (err) {
      console.warn("Photo preview failed:", err?.message);
      setPhotos((prev) => prev.filter((p) => p.id !== tempId));
      Swal.fire({ icon: "error", title: "Upload Failed", text: "Failed to process photo." });
    }
  };

  const handleAddVideo = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Video Too Large",
        text: `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum allowed video size is 10MB.`,
      });
      return;
    }
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideo(file);
    setVideoUrl(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    if (videoUrl && videoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideo(null);
    setVideoUrl(null);
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
      console.warn("Save draft failed:", err?.message);
      Swal.fire({ icon: "error", title: "Save Failed", text: "Failed to save draft." });
    }
  };

  const handlePublish = () => {
    const isStepValid = validateStep(
      form,
      step,
      catFields,
      imageUrls,
      STEPS,
      REQUIRED_BY_STEP,
      setValidationErrors,
    );
    if (!isStepValid) return;
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    setSubmitError(null);
    try {
      const typeKey = CATEGORY_TO_MOCK[category] || category;

      // Extract File objects from photos for upload (filter out existing images without file)
      const photoFiles = photos.filter((p) => p.file).map((p) => p.file);

      // Upload new photos to backend
      let uploadedImageUrls = [];
      if (photoFiles.length > 0) {
        const uploadResult = await uploadImages(photoFiles);
        uploadedImageUrls = uploadResult.images || [];
      }

      // Combine existing image URLs (from editing) with newly uploaded URLs
      const finalImageUrls = [...imageUrls.filter((url) => !url.startsWith('blob:')), ...uploadedImageUrls];

      // Upload brochure PDF if a file was selected
      let finalBrochureUrl = brochureUrl && !brochureUrl.startsWith('blob:') ? brochureUrl : null;
      if (brochure && (brochure instanceof File || brochure.name)) {
        try {
          const brochureRes = await uploadBrochure(brochure);
          if (brochureRes?.brochureUrl) {
            finalBrochureUrl = brochureRes.brochureUrl;
            setBrochureUrl(finalBrochureUrl);
          }
        } catch (bErr) {
          console.error("Failed to upload brochure PDF:", bErr);
        }
      }

      // Upload any document files
      const docFiles = documents.filter((d) => d.file).map((d) => d.file);
      let uploadedDocUrls = [];
      if (docFiles.length > 0) {
        for (const docFile of docFiles) {
          try {
            const docRes = await uploadBrochure(docFile);
            if (docRes?.brochureUrl) {
              uploadedDocUrls.push({ name: docFile.name, url: docRes.brochureUrl, size: docFile.size });
            }
          } catch (dErr) {
            console.error("Failed to upload document file:", dErr);
          }
        }
      }
      const existingDocUrls = (docUrls || []).filter((d) => {
        const u = typeof d === 'string' ? d : d?.url;
        return u && !u.startsWith('blob:');
      });
      const finalDocUrls = [...existingDocUrls, ...uploadedDocUrls];

      // Upload video if a file was selected
      let finalVideoUrl = videoUrl && !videoUrl.startsWith('blob:') ? videoUrl : null;
      if (video && (video instanceof File || video.name)) {
        try {
          const videoRes = await uploadVideo(video);
          if (videoRes?.videoUrl || (videoRes?.videos && videoRes.videos[0])) {
            finalVideoUrl = videoRes.videoUrl || videoRes.videos[0];
            setVideoUrl(finalVideoUrl);
          }
        } catch (vErr) {
          console.error("Failed to upload video:", vErr);
        }
      }

      if (isEditing && originalListingId) {
        await updateListing(typeKey, originalListingId, createUpdatedListingData(form, category, subcategory, finalImageUrls, finalDocUrls, finalBrochureUrl, finalVideoUrl, cities));
      } else {
        const listingPayload = createNewListingData(form, category, subcategory, finalImageUrls, finalDocUrls, finalBrochureUrl, finalVideoUrl, cities);
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
        nextForm.priceType = item.priceType || nextForm.priceType || "fixed";
        nextForm.area = item.area || item.location || "";
        nextForm.city = item.city || defaultCity;
        nextForm.pincode = item.pincode || "";
        nextForm.contact = item.contact || item.contactPhone || "9876543210";
        nextForm.category = serviceType;

        // Resolve subcategory robustly
        const rawSubcategory =
          item.subcategory ||
          item.subCategory ||
          (serviceType === "real-estate" && item.category) ||
          (serviceType === "vehicle" && (
            item.wheelerType ||
            item.categoryVehicle ||
            (item.category === "2-wheeler" ? "Bike" : item.category === "3-wheeler" ? "Auto Rickshaw" : item.category === "commercial" ? "Commercial Vehicle" : item.category === "4-wheeler" ? "Car" : item.category)
          )) ||
          (serviceType === "jewellery" && (item.metalType || item.material || item.category)) ||
          (serviceType === "finance" && (item.serviceType || item.type || item.category)) ||
          (serviceType === "grocery" && item.category) ||
          (serviceType === "garment" && item.category) ||
          "";

        const validSubcategories = SUBCATEGORIES[serviceType] || [];
        const matchedSub = validSubcategories.find(
          (s) => s.toLowerCase() === String(rawSubcategory).trim().toLowerCase()
        );
        nextForm.subcategory = matchedSub || rawSubcategory || "";

        if (serviceType === "real-estate") {
          nextForm.bhk = item.bhk || "";
          nextForm.bathrooms = item.bathrooms || "";
          nextForm.area_sqft = item.area_sqft || item.numericArea || (item.area ? String(item.area).replace(/[^\d.]/g, '') : "");
          nextForm.furnishing = item.furnishing || item.furnishingStatus || "";
          nextForm.floor = item.floor || "";
          nextForm.parking = item.parking || "";
          nextForm.extraRoom = item.extraRoom || "";
          nextForm.projectCount = item.projectCount ?? "";
          nextForm.totalUnits = item.totalUnits ?? "";
          nextForm.availableUnits = item.availableUnits ?? "";
        }
        if (serviceType === "vehicle") {
          nextForm.brand = item.brand || item.make || "";
          nextForm.model = item.model || "";
          nextForm.year = item.year ? String(item.year) : "";
          nextForm.condition = item.condition || "used";
          nextForm.fuelType = item.fuelType || "";
          nextForm.kmDriven = item.kmDriven ?? "";
          nextForm.transmission = item.transmission || "";
          nextForm.categoryVehicle = item.categoryVehicle || item.wheelerType || item.category || "";
        }
        if (serviceType === "grocery") {
          nextForm.quantity = item.stock ?? item.quantity ?? nextForm.quantity;
          nextForm.unit = item.unit || nextForm.unit;
        }
        if (serviceType === "garment") {
          nextForm.size = item.size || "";
          nextForm.color = item.color || "";
        }
        if (serviceType === "jewellery") {
          nextForm.weight = item.weight ?? item.weightGrams ?? nextForm.weight;
          nextForm.material = item.metalType || item.material || nextForm.subcategory || "";
          nextForm.purity = item.purity || "";
          nextForm.gemstone = item.gemstone || "";
        }
        if (serviceType === "finance") {
          nextForm.serviceType = item.serviceType || item.type || item.category || nextForm.subcategory || nextForm.serviceType;
          nextForm.experience = item.experience ?? "";
        }
        if (serviceType === "service") {
          nextForm.serviceType = item.serviceType || item.type || item.category || nextForm.subcategory || nextForm.serviceType;
          nextForm.experience = item.experience ?? "";
        }

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
        const existingVideo = item.video || item.videoUrl || (Array.isArray(item.videos) && item.videos[0]) || null;
        if (existingVideo) setVideoUrl(existingVideo);
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
    video,
    setVideo,
    videoUrl,
    setVideoUrl,
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
    videoRef,
    brochureRef,
    documentRef,
    dragOver,
    setDragOver,
    docDragOver,
    setDocDragOver,
    // Handlers
    updateForm,
    handleAddPhoto,
    handleAddVideo,
    removeVideo,
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