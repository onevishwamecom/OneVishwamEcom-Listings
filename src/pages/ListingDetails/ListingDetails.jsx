import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import PageContainer from '@/components/ui/PageContainer';
import { DetailPageSkeleton } from '@/components/skeleton';
import useCachedData from '@/hooks/useCachedData';
import { fetchListingById } from '@/services/listings';
import { CACHE_TTL } from '@/services/cacheService';
import { getDisplayId, formatDate, formatINR } from '@/utils';
import { STATUS_CONFIG, ADMIN_FEEDBACKS } from './constants';
import { getCategoryInfo, getSubcategory, getLocationDetails, getPriceType, getPriceTypeLabel, getCategoryFields, getAdminFeedback, getTimeline } from './helpers';
import { ImageGallery } from './components/ImageGallery';
import { BasicInformation } from './components/BasicInformation';
import { CategoryInformation } from './components/CategoryInformation';
import { ProductDetails } from './components/ProductDetails';
import { LocationInformation } from './components/LocationInformation';
import { PricingInformation } from './components/PricingInformation';
import { DocumentsSection } from './components/DocumentsSection';
import { TimelineSection } from './components/TimelineSection';
import { StatusCard } from './components/StatusCard';
import { ImageLightbox } from './components/ImageLightbox';

function ListingDetails() {
  const { listingId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    data: listing,
    loading,
    error,
    retry,
  } = useCachedData(
    () => fetchListingById(listingId),
    `listing:${listingId}`,
    [listingId],
    { ttl: CACHE_TTL.listingDetail, fallback: null },
  );

  if (loading) {
    return (
      <PageContainer>
        <DetailPageSkeleton related={0} />
      </PageContainer>
    );
  }

  if (!listing || error) {
    return (
      <PageContainer>
        <PageHeader
          title="Listing Details"
          subtitle="Full details and activity for this listing"
          action={
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-glow-blue hover:bg-brand-blue/90 transition-all duration-200 hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-arrow-left text-xs" /> Back to All Listings
            </Link>
          }
        />

        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-center px-4 animate-fade-in">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 flex items-center justify-center mb-4 border border-rose-100">
            <i className="fa-solid fa-house-crack text-2xl text-rose-400" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Listing not found</h3>
          <p className="text-sm font-medium text-slate-500 max-w-sm">
            This listing may have been removed or does not exist.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 text-slate-700 px-4 py-2 text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              <i className="fa-solid fa-rotate-right text-xs" aria-hidden="true" /> Try Again
            </button>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-blue text-white px-4 py-2 text-sm font-bold hover:bg-brand-blue/90 transition-colors"
            >
              <i className="fa-solid fa-list text-xs" /> View All Listings
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const config = STATUS_CONFIG[listing.status] || STATUS_CONFIG.pending;

  const categoryInfo = getCategoryInfo(listing);
  const subcategory = getSubcategory(listing);
  const location = getLocationDetails(listing);
  const priceType = getPriceType(listing);
  const priceTypeLabel = getPriceTypeLabel(priceType);
  const categoryFields = getCategoryFields(listing);
  const adminFeedback = getAdminFeedback(listing, ADMIN_FEEDBACKS);
  const timeline = getTimeline(listing, (l) => getAdminFeedback(l, ADMIN_FEEDBACKS));
  const images = Array.isArray(listing?.images) ? listing.images : listing?.image ? [listing.image] : [];
  const documents = listing.documents || [];
  const price = listing?.price !== undefined && listing.price !== null && listing.price !== '' ? formatINR(listing.price) : '';
  const displayTitle = listing.title || listing.name || listing.brand || 'Untitled Listing';

  const handleImageClick = (index) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);
  const previousImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title={displayTitle}
        subtitle={`${categoryInfo.label} • ${subcategory}`}
        action={
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-glow-blue hover:bg-brand-blue/90 transition-all duration-200 hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-arrow-left text-xs" /> Back to Listed Items
          </Link>
        }
      />

      {/* Listing Summary & Status */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image Gallery */}
          <ImageGallery images={images} displayTitle={displayTitle} onImageClick={handleImageClick} selectedImage={selectedImage} />

          {/* Basic Information */}
          <BasicInformation listing={listing} displayTitle={displayTitle} />

          {/* Category Information */}
          <CategoryInformation categoryInfo={categoryInfo} subcategory={subcategory} />

          {/* Product Details */}
          <ProductDetails categoryFields={categoryFields} />

          {/* Location */}
          <LocationInformation location={location} />

          {/* Pricing */}
          <PricingInformation listing={listing} price={price} priceTypeLabel={priceTypeLabel} />

          {/* Documents */}
          <DocumentsSection documents={documents} />

          {/* Timeline */}
          <TimelineSection timeline={timeline} formatDate={formatDate} />
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-5">
          <StatusCard
            listing={listing}
            config={config}
            categoryInfo={categoryInfo}
            subcategory={subcategory}
            adminFeedback={adminFeedback}
            formatDate={formatDate}
            getDisplayId={getDisplayId}
          />
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        selectedImage={selectedImage}
        images={images}
        displayTitle={displayTitle}
        onClose={closeLightbox}
        onPrevious={previousImage}
        onNext={nextImage}
        onImageClick={handleImageClick}
      />
    </PageContainer>
  );
}

export default ListingDetails;