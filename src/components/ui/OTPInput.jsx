import { useState, useEffect, useRef } from 'react';

export function OTPInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  error,
  label = 'OTP',
  id = 'otp',
  autoFocus = false,
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef(Array(6).fill(null).map(() => useRef(null)));

  // Sync digits with value prop
  useEffect(() => {
    if (value && value.length === 6) {
      setDigits(value.split(''));
    }
  }, [value]);

  const handleChange = (index, e) => {
    const char = e.target.value;
    if (!/^\d$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    const newValue = newDigits.join('');
    onChange?.(newValue);

    // Auto-advance to next input
    if (index < 5 && char) {
      inputRefs.current[index + 1]?.current?.focus();
    }

    // Auto-verify on 6th digit
    if (index === 5 && char && newDigits.filter(d => d).length === 6) {
      onComplete?.(newValue);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newDigits = pasted.split('');
      setDigits(newDigits);
      const newValue = pasted;
      onChange?.(newValue);
      inputRefs.current[5]?.current?.focus();
      onComplete?.(newValue);
    }
  };

  const handleFocus = (index, e) => {
    e.target.select();
  };

  const inputClass = (index) => `
    w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200
    ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}
    ${
      digits[index]
        ? 'border-brand-gold/50 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 focus:bg-white'
        : error
        ? 'border-brand-orange/50 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 focus:bg-white'
        : 'border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300'
    }
  `;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center" role="group" aria-label={label}>
        {Array.from({ length: 6 }).map((_, i) => (
          <input
            key={i}
            ref={inputRefs.current[i]}
            type="text"
            id={`${id}-${i}`}
            inputMode="numeric"
            maxLength={1}
            value={digits[i]}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => handleFocus(i, e)}
            disabled={disabled}
            autoComplete="one-time-code"
            autoFocus={autoFocus && i === 0}
            aria-label={`OTP digit ${i + 1}`}
            className={inputClass(i)}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-brand-orange animate-fade-in" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default OTPInput;