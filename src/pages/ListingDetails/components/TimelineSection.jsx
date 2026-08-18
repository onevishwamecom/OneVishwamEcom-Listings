import { SectionCard } from './UIComponents';

export function TimelineSection({ timeline, formatDate }) {
  return (
    <SectionCard title="Listing Activity" icon="fa-clock-rotate-left">
      <div className="relative pl-6 border-l border-slate-200">
        {timeline.map((event, index) => (
          <div key={index} className="relative pb-6 last:pb-0">
            <div className="absolute left-[-34px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10">
              {event.type === 'created' && <i className="fa-solid fa-plus text-brand-blue text-xs" />}
              {event.type === 'approved' && <i className="fa-solid fa-check text-brand-gold text-xs" />}
              {event.type === 'changes' && <i className="fa-solid fa-pen-to-square text-brand-orange text-xs" />}
            </div>
            <p className="text-sm font-bold text-slate-500 mb-1">{formatDate(event.date)}</p>
            <p className="text-sm font-semibold text-slate-900">{event.title}</p>
            <p className="text-sm font-medium text-slate-500">{event.description}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}