export function ImageLightbox({ selectedImage, images, displayTitle, onClose, onPrevious, onNext, onImageClick }) {
  if (selectedImage === null || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        aria-label="Close"
      >
        <i className="fa-solid fa-xmark text-xl" />
      </button>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrevious(); }}
            className="absolute left-6 w-12 h-full flex items-center justify-center text-white hover:text-brand-gold transition-colors z-10"
            aria-label="Previous"
          >
            <i className="fa-solid fa-chevron-left text-3xl" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-6 w-12 h-full flex items-center justify-center text-white hover:text-brand-gold transition-colors z-10"
            aria-label="Next"
          >
            <i className="fa-solid fa-chevron-right text-3xl" />
          </button>
        </>
      )}
      <img
        src={images[selectedImage]}
        alt={`${displayTitle} - Image ${selectedImage + 1}`}
        className="max-h-[85vh] max-w-[90vw] object-contain"
      />
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); onImageClick(index); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === selectedImage ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}