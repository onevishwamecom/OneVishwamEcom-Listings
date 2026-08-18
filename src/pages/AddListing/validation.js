export const getValidationErrors = (form, stepIndex, catFields, imageUrls, STEPS, REQUIRED_BY_STEP) => {
  const stepId = STEPS[stepIndex].id;
  const required = REQUIRED_BY_STEP[stepId] || [];
  const errors = {};

  required.forEach((field) => {
    const value = form[field];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
    }
  });

  if (stepId === "details" && catFields.length > 0) {
    catFields.forEach((f) => {
      if (f.required && (!form[f.name] || form[f.name].trim() === "")) {
        errors[f.name] = `${f.label} is required`;
      }
    });
  }

  if (stepId === "media" && imageUrls.length === 0) {
    errors.photos = "At least one photo is required";
  }

  return errors;
};

export const validateStep = (form, stepIndex, catFields, imageUrls, STEPS, REQUIRED_BY_STEP, setValidationErrors) => {
  const errors = getValidationErrors(form, stepIndex, catFields, imageUrls, STEPS, REQUIRED_BY_STEP);
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};

export const canNext = (form, stepIndex, catFields, imageUrls, STEPS, REQUIRED_BY_STEP) => {
  const errors = getValidationErrors(form, stepIndex, catFields, imageUrls, STEPS, REQUIRED_BY_STEP);
  return Object.keys(errors).length === 0;
};