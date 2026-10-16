import { useState, useRef, useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { cities, defaultCity } from "../../data/locations";
import { formatINR } from "../../utils";
import { INITIAL_FORM, STEPS, CATEGORY_FIELDS, REQUIRED_BY_STEP } from "./formConfig";
import { validateStep, canNext } from "./validation";
import { createNewListingData, createUpdatedListingData } from "./payloadBuilder";
import { CATEGORY_TO_MOCK, SERVICE_TYPE_TO_CATEGORY, SUBCATEGORIES } from "./constants";
import { findListing, createListing, updateListing, invalidateListings } from "../../services/listings";
import { uploadMediaToStorage } from "../../services/storageService";
import { getCachedUser } from "../../services/userCache";
import { useListingStats } from "../../components/ListingStats";
import { resolvePartnerIdentity } from "../../config/partnerDirectory";

export function useAddListingForm() {
  const [searchParams] = useSearchParams();
  const { categoryType } = useParams();
  const navigate = useNavigate();
  const editId = searchParams.get("edit");
  const editType = searchParams.get("type");
  const isEditing = Boolean(editId && editType);
  const { refresh: refreshStats } = useListingStats();

  const initialCategory = categoryType || "";
  const [step, setStep] = useState(isEditing ? 1 : initialCategory && initialCategory !== "properties" && initialCategory !== "real-estate" ? 1 : 0);
  const [form, setForm] = useState(initialCategory ? { ...INITIAL_FORM, category: initialCategory } : INITIAL_FORM);
  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
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
    setForm((prev) => ({
      ...prev,
      [key]: typeof value === 'function' ? value(prev[key]) : value,
    }));
    if (validationErrors[key]) {
      setValidationErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  useEffect(() => {
    if (categoryType && form.category !== categoryType) {
      setForm((prev) => ({ ...prev, category: categoryType }));
      if (categoryType !== "properties" && categoryType !== "real-estate" && step === 0 && !isEditing) {
        setStep(1);
      }
    } else if (!categoryType && !isEditing && form.category) {
      setForm((prev) => ({ ...prev, category: "" }));
      setStep(0);
    }
  }, [categoryType]);

  // Pre-fill locked partner identity and in-house tags
  useEffect(() => {
    if (!isEditing) {
      const cachedUser = getCachedUser() || {};
      const partnerInfo = resolvePartnerIdentity(cachedUser.email || cachedUser.vendorEmail);
      const assignedPartner = cachedUser.partnerName || partnerInfo.partnerName || '';
      const assignedRole = cachedUser.role || partnerInfo.role || '';
      const assignedOrigin = cachedUser.origin || partnerInfo.origin || (assignedRole === 'in_house' ? 'in_house_project' : undefined);

      setForm((prev) => {
        const updates = {};
        if (assignedPartner && !prev.channelPartnerName) {
          updates.channelPartnerName = assignedPartner;
        }
        if (assignedOrigin && !prev.origin) {
          updates.origin = assignedOrigin;
        }
        return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
      });
    }
  }, [isEditing]);

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
        if (p.url) URL.revokeObjectURL(p.url);
      });
      documents.forEach((d) => {
        if (d.url) URL.revokeObjectURL(d.url);
      });
      if (brochureUrl) URL.revokeObjectURL(brochureUrl);
    };
  }, []);

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
      console.warn("Save draft failed:", err?.message);
      Swal.fire({ icon: "error", title: "Save Failed", text: "Failed to save draft." });
    }
  };

  const handlePublish = () => {
    if (category !== "properties" && category !== "real-estate") {
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
    }
    setShowConfirm(true);
  };

  const handleVideoSelect = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Video Too Large",
        text: "Please select a short video under 10MB.",
      });
      return;
    }
    setVideo(file);
    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleRemoveVideo = () => {
    if (videoPreview && videoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideo(null);
    setVideoPreview(null);
  };

  const handleBrochureSelect = (file) => {
    if (!file) return;
    setBrochure(file);
    if (brochureUrl && brochureUrl.startsWith("blob:")) {
      URL.revokeObjectURL(brochureUrl);
    }
    setBrochureUrl(URL.createObjectURL(file));
  };

  const handleRemoveBrochure = () => {
    if (brochureUrl && brochureUrl.startsWith("blob:")) {
      URL.revokeObjectURL(brochureUrl);
    }
    setBrochure(null);
    setBrochureUrl(null);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    setSubmitError(null);
    try {
      const typeKey = CATEGORY_TO_MOCK[category] || category || 'properties';
      const targetProductId = originalListingId || `item_${Date.now()}`;

      // Upload photos directly to Firebase Storage
      const finalImageUrls = [];
      for (const photo of photos) {
        if (photo.file) {
          try {
            const uploadedUrl = await uploadMediaToStorage({
              category: typeKey,
              productId: targetProductId,
              mediaType: 'images',
              file: photo.file,
            });
            finalImageUrls.push(uploadedUrl);
          } catch (pErr) {
            console.warn("Firebase image upload failed:", pErr?.message);
          }
        } else if (photo.url && !photo.url.startsWith('blob:')) {
          finalImageUrls.push(photo.url);
        }
      }

      // Upload supporting documents to Firebase Storage
      const finalDocUrls = [];
      for (const doc of documents) {
        if (doc.file) {
          try {
            const uploadedDocUrl = await uploadMediaToStorage({
              category: typeKey,
              productId: targetProductId,
              mediaType: 'documents',
              file: doc.file,
            });
            finalDocUrls.push(uploadedDocUrl);
          } catch (dErr) {
            console.warn("Firebase document upload failed:", dErr?.message);
          }
        } else if (doc.url && !doc.url.startsWith('blob:')) {
          finalDocUrls.push(doc.url);
        }
      }

      // Upload video if present as a File
      let finalVideoUrl = form.videoUrl || form.video || null;
      if (video && typeof video !== 'string' && video instanceof File) {
        try {
          finalVideoUrl = await uploadMediaToStorage({
            category: typeKey,
            productId: targetProductId,
            mediaType: 'videos',
            file: video,
          });
        } catch (vErr) {
          console.warn("Firebase video upload failed:", vErr?.message);
        }
      }

      // Upload brochure if present as a File
      let finalBrochureUrl = brochureUrl || form.brochure || null;
      if (brochure && typeof brochure !== 'string' && brochure instanceof File) {
        try {
          finalBrochureUrl = await uploadMediaToStorage({
            category: typeKey,
            productId: targetProductId,
            mediaType: 'documents',
            file: brochure,
          });
        } catch (bErr) {
          console.warn("Firebase brochure upload failed:", bErr?.message);
        }
      }

      const user = getCachedUser() || {};
      const partnerInfo = resolvePartnerIdentity(user.email || user.vendorEmail);
      const assignedPartner = user.partnerName || partnerInfo.partnerName || form.channelPartnerName || '';
      const assignedRole = user.role || partnerInfo.role || 'lister';
      const assignedOrigin = user.origin || partnerInfo.origin || (assignedRole === 'in_house' ? 'in_house_project' : form.origin);

      const updatedForm = {
        ...form,
        channelPartnerName: assignedPartner || form.channelPartnerName,
        origin: assignedOrigin,
        videoUrl: finalVideoUrl,
        video: finalVideoUrl,
        videos: finalVideoUrl ? [finalVideoUrl] : [],
        brochure: finalBrochureUrl,
        pdfUrl: finalBrochureUrl,
      };

      if (isEditing && originalListingId) {
        await updateListing(typeKey, originalListingId, {
          ...createUpdatedListingData(updatedForm, category, subcategory, finalImageUrls, docUrls, finalBrochureUrl, cities),
          video: finalVideoUrl,
          videoUrl: finalVideoUrl,
          videos: finalVideoUrl ? [finalVideoUrl] : [],
        });
      } else {
        const listingPayload = createNewListingData(updatedForm, category, subcategory, finalImageUrls, docUrls, finalBrochureUrl, cities);
        await createListing({
          ...listingPayload,
          origin: assignedOrigin || listingPayload.origin,
          channelPartnerName: assignedPartner || listingPayload.channelPartnerName,
          video: finalVideoUrl,
          videoUrl: finalVideoUrl,
          videos: finalVideoUrl ? [finalVideoUrl] : [],
          contributor: {
            name: user.name || user.fullName || 'Unknown',
            type: assignedRole || user.role || 'vendor',
            email: user.email || '',
            contact: user.mobile || listingPayload.contact || '',
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

        // 1. Unpack nested item.details subdocument first (where MongoDB stores polymorphic fields)
        if (item.details && typeof item.details === 'object') {
          Object.keys(item.details).forEach((dKey) => {
            if (item.details[dKey] !== undefined && item.details[dKey] !== null && item.details[dKey] !== "") {
              nextForm[dKey] = item.details[dKey];
            }
          });
        }

        // 2. Unpack top-level properties
        Object.keys(nextForm).forEach((key) => {
          if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
            nextForm[key] = item[key];
          }
        });

        nextForm.title = item.title || nextForm.title;
        nextForm.subtitle = item.subtitle || "";
        nextForm.description = item.description || "";
        nextForm.price = item.price || "";
        nextForm.priceSuffix = item.priceSuffix || "";
        nextForm.priceType = item.priceType || "fixed";
        nextForm.area = item.area || "";
        nextForm.address = item.address || item.landmark || "";
        nextForm.landmark = item.landmark || "";
        nextForm.city = item.city || defaultCity;
        nextForm.pincode = item.pincode || "";
        nextForm.contact = item.contact || "9876543210";
        nextForm.category = serviceType;
        nextForm.vendorName = item.vendorName || "";
        nextForm.channelPartnerName = item.channelPartnerName || "";
        nextForm.bankLoanDetails = item.bankLoanDetails || "";

        // Resolve subcategory robustly
        const rawSubcategory =
          item.subcategory ||
          item.subCategory ||
          ((serviceType === "properties" || serviceType === "real-estate") && (item.category || item.propertyType)) ||
          (serviceType === "vehicle" && (
            item.wheelerType ||
            item.categoryVehicle ||
            (item.category === "2-wheeler" ? "Bike" : item.category === "3-wheeler" ? "Auto Rickshaw" : item.category === "commercial" ? "Commercial Vehicle" : item.category === "4-wheeler" ? "Car" : item.category)
          )) ||
          (serviceType === "jewellery" && (item.metalType || item.material || item.category)) ||
          (serviceType === "finance" && (item.serviceType || item.type || item.category)) ||
          (serviceType === "grocery" && item.category) ||
          (serviceType === "garment" && item.category) ||
          (serviceType === "bedding" && item.category) ||
          (serviceType === "electronics" && item.category) ||
          "";

        const validSubcategories = SUBCATEGORIES[serviceType] || [];
        const matchedSub = validSubcategories.find(
          (s) => s.toLowerCase() === String(rawSubcategory).trim().toLowerCase()
        );
        nextForm.subcategory = matchedSub || rawSubcategory || "";

        if (serviceType === "properties" || serviceType === "real-estate") {
          const d = item.details || {};
          nextForm.bhk = item.bhk || d.bhk || "";
          nextForm.bathrooms = item.bathrooms || d.bathrooms || "";
          nextForm.area_sqft = item.area_sqft || item.numericArea || d.dimensions || (item.area ? String(item.area) : "");
          nextForm.furnishing = item.furnishing || item.furnishingStatus || d.furnishingStatus || "";
          nextForm.facing = item.facing || d.facing || d.plotFacing || "";
          nextForm.cornerPlot = item.cornerPlot || d.cornerPlot || "";
          nextForm.boundaryWall = item.boundaryWall || d.boundaryWall || "";
          nextForm.approval = item.approval || d.approvalAuthority || d.approvedLayout || "";
          nextForm.possession = item.possessionStatus || item.possession || d.possessionStatus || d.possession || "";
        nextForm.possessionStatus = nextForm.possession;
          nextForm.loanApproved = item.loanApproved ? "Yes" : (item.bankLoanDetails ? "Yes" : "No");
          nextForm.gatedCommunity = item.gatedCommunity !== undefined ? item.gatedCommunity : d.gatedCommunity;
          nextForm.negotiable = item.negotiable !== undefined ? item.negotiable : d.negotiable;
          nextForm.floor = item.floor || "";
          nextForm.floors = item.floors || d.floors || "";
          nextForm.towers = item.towers || d.towers || "";
          nextForm.parking = item.parking || d.parkingAvailability || "";
          nextForm.extraRoom = item.extraRoom || d.extraRoom || "";
          nextForm.projectCount = item.projectCount ?? d.projectCount ?? "";
          nextForm.totalUnits = item.totalUnits ?? d.totalUnits ?? "";
          nextForm.availableUnits = item.availableUnits ?? d.availableUnits ?? "";
          nextForm.landmark = item.landmark || d.landmark || "";
          nextForm.contact = item.contact || d.contact || nextForm.contact;
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
        if (serviceType === "bedding") {
          nextForm.material = item.material || "";
          nextForm.size = item.size || "";
          nextForm.thickness = item.thickness || "";
          nextForm.firmness = item.firmness || "";
          nextForm.brand = item.brand || "";
        }
        if (serviceType === "electronics") {
          nextForm.brand = item.brand || "";
          nextForm.model = item.model || "";
          nextForm.condition = item.condition || "";
          nextForm.warranty = item.warranty || "";
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
        setForm(nextForm);

        setOriginalListingId(item._id);

        if ((item.status === 'changes-required' || item.status === 'cancelled' || item.status === 'rejected') && item.adminComment) {
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
    video,
    setVideo,
    videoPreview,
    setVideoPreview,
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
    handleVideoSelect,
    handleRemoveVideo,
    handleBrochureSelect,
    handleRemoveBrochure,
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