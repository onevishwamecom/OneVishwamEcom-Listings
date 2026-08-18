function PageContainer({ className = '', children, ...props }) {
  // If a page explicitly sets its own max-width, drop the default so the
  // override wins instead of conflicting with max-w-6xl.
  const hasCustomMaxWidth = /\bmax-w-\S+/.test(className);
  const baseClass = hasCustomMaxWidth ? 'mx-auto' : 'max-w-6xl mx-auto';
  const mergedClassName = [baseClass, className].filter(Boolean).join(' ');

  return (
    <div className={mergedClassName} {...props}>
      {children}
    </div>
  );
}

export default PageContainer;