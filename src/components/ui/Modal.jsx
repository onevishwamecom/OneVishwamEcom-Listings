import { Fragment } from 'react';
import { createPortal } from 'react-dom';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  variant = 'default', // 'default' | 'danger'
  loading = false,
  children,
  size = 'md', // 'sm' | 'md' | 'lg'
  showCancel = true,
  closeOnOverlayClick = true,
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const modalContent = (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 animate-fade-in"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} animate-scale-in mx-auto max-h-[90vh] overflow-y-auto`}
        >
          {(title || children) && (
            <div className="p-5 border-b border-slate-100">
              {title && (
                <h3 id="modal-title" className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-slate-500">{description}</p>
              )}
              {children && !title && !description && (
                <div>{children}</div>
              )}
            </div>
          )}

          <div className="p-5 flex flex-col sm:flex-row gap-2.5 justify-end">
            {showCancel && (
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 sm:flex-none bg-white text-slate-700 border-2 border-slate-200 py-3 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
              >
                {cancelText || "Cancel"}
              </button>
            )}
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 sm:flex-none py-3 rounded-2xl font-bold transition-all disabled:opacity-50 ${
                variant === 'danger'
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90'
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin text-xs mr-2" />
                  Processing...
                </>
              ) : (
                confirmText || "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );

  return createPortal(modalContent, document.body);
}

export default Modal;