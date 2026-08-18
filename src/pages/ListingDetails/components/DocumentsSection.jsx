import { SectionCard } from './UIComponents';

export function DocumentsSection({ documents }) {
  if (!documents.length) return null;

  return (
    <SectionCard title="Documents" icon="fa-file-pdf">
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <i className="fa-solid fa-file-pdf" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">{doc.name || `Document ${index + 1}`}</p>
              <p className="text-xs font-medium text-slate-500">{doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'Size unknown'}</p>
            </div>
            <button
              type="button"
              onClick={() => doc.url && window.open(doc.url, '_blank', 'noopener,noreferrer')}
              disabled={!doc.url}
              title={doc.url ? 'View document' : 'Preview not available'}
              aria-label={`View ${doc.name || `document ${index + 1}`}`}
              className="w-8 h-8 rounded-full bg-white text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-500 flex items-center justify-center shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-500"
            >
              <i className="fa-solid fa-eye text-xs" />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}