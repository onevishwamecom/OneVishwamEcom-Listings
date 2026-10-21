import React from 'react';
import MediaUploadSection from '../shared/MediaUploadSection';

const POPULAR_BANKS = [
  'SBI',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Canara Bank',
  'Bank of Baroda',
  'PNB',
  'LIC HFL',
  'Union Bank',
  'Kotak Mahindra',
];

export default function Phase3FinalFields({
  form = {},
  bankLoanDetails = '',
  onChange,
  photos = [],
  onAddPhoto,
  onRemovePhoto,
  video = null,
  videoPreview = null,
  onVideoSelect,
  onRemoveVideo,
  brochure = null,
  brochureUrl = null,
  onBrochureSelect,
  onRemoveBrochure,
  errors = {},
}) {
  const handleAppendBank = (bank) => {
    const trimmed = (bankLoanDetails || '').trim();
    if (!trimmed) {
      onChange?.('bankLoanDetails', `Approved by ${bank}`);
    } else if (trimmed.toLowerCase().includes(bank.toLowerCase())) {
      return;
    } else {
      onChange?.('bankLoanDetails', `${trimmed}, ${bank}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Bank Loan Details & Approval */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-building-columns text-brand-blue" />
            <span>Bank Approvals &amp; Loan Facilities (Optional)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            List approved financial institutions for faster homebuyer financing
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Approved Bank Names &amp; Loan Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Approved by SBI, HDFC, ICICI, Axis Bank"
              value={bankLoanDetails || ''}
              onChange={(e) => onChange?.('bankLoanDetails', e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Add Popular Banks:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_BANKS.map((bank) => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => handleAppendBank(bank)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-brand-blue hover:text-brand-blue bg-slate-50 text-[11px] font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  + {bank}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shared Media Upload Section */}
      <MediaUploadSection
        photos={photos}
        onAddPhoto={onAddPhoto}
        onRemovePhoto={onRemovePhoto}
        video={video}
        videoPreview={videoPreview}
        onVideoSelect={onVideoSelect}
        onRemoveVideo={onRemoveVideo}
        brochure={brochure}
        brochureUrl={brochureUrl}
        onBrochureSelect={onBrochureSelect}
        onRemoveBrochure={onRemoveBrochure}
        form={form}
        updateForm={onChange}
        errors={errors}
      />
    </div>
  );
}
