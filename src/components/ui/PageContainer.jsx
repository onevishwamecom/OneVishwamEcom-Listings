/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CENTRALIZED PAGE LAYOUT SYSTEM
 * ───────────────────────────────────────────────────────────────────────────
 * Every application page should use <PageContainer> for its global page
 * dimensions, responsive padding and vertical rhythm.
 *
 *   PAGE-LEVEL layout   → handled here (width, padding, section spacing).
 *   COMPONENT-LEVEL     → each component keeps its own internal spacing.
 *
 * Do NOT add page-level space-y / px / py / mx-auto on a page manually unless
 * the page has a specific exception (use the className / variant props).
 *
 * Design tokens live in src/index.css under --page-* so the whole app can be
 * re-spaced from a single place, e.g.:
 *   --page-section-gap: 1.5rem → 1.25rem   (space-y-6 → space-y-5)
 *   --page-padding-x:   clamp(...)          (px-6 → px-4)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Global page wrapper.
 * Controls page width, max-width, horizontal/vertical padding and the spacing
 * between top-level page sections (vertical rhythm).
 */
export function PageContainer({ children, className = '', variant = 'default', ...props }) {
  const baseClass = 'page-container page-enter';
  const variantClasses = {
    default: '',
    compact: 'page-container--compact',
    full: 'page-container--full',
  };
  const mergedClassName = [baseClass, variantClasses[variant] || '', className].filter(Boolean).join(' ');

  return (
    <div className={mergedClassName} {...props}>
      {children}
    </div>
  );
}

/**
 * Page header — standard title + description block with an optional leading
 * element (e.g. back button) and optional right-side actions.
 */
export function PageHeader({ title, subtitle, action, leading, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`.trim()}>
      <div className="flex items-center gap-3 min-w-0">
        {leading}
        <div className="min-w-0">
          {title && (
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          )}
          {subtitle && <p className="text-slate-500 font-medium mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Page section — groups the major sections of a page. The vertical spacing
 * between sections is provided by <PageContainer>; this component exists for
 * code clarity and future section-level styling only.
 */
export function PageSection({ children, className = '' }) {
  return <section className={className}>{children}</section>;
}

/**
 * Form section wrapper with consistent spacing.
 */
export function FormSection({ children, title, description, className = '', compact = false }) {
  return (
    <div className={`animate-fade-in ${className}`.trim()}>
      {(title || description) && (
        <div className={`mb-4 ${compact ? 'mb-3' : ''}`}>
          {title && <h2 className="text-lg font-bold text-slate-900">{title}</h2>}
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
      )}
      <div className={compact ? 'space-y-4' : 'space-y-5'}>
        {children}
      </div>
    </div>
  );
}

/**
 * Form field group wrapper for consistent label-input spacing.
 */
export function FormFieldGroup({ children, className = '' }) {
  return <div className={`space-y-1.5 ${className}`.trim()}>{children}</div>;
}

/**
 * Form actions bar — consistent bottom action area.
 */
export function FormActions({ children, className = '', divider = true }) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 ${divider ? 'border-t border-slate-100' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}

export default PageContainer;