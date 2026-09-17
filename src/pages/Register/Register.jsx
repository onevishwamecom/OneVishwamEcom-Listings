import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "@/store/authSlice";
import logo from "@/assets/logo.png";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";
import Input from "@/components/ui/Input";
import { OTPInput } from "@/components/ui/OTPInput";
import { normalizePhone, normalizePhoneForApi } from "@/utils/phone";
import { sendPhoneOtp, confirmPhoneOtp, getRecaptchaVerifier } from "@/firebase/phoneAuth";

const RULES = [
  { key: "min", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "lower", label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { key: "number", label: "One number", test: (v) => /\d/.test(v) },
  {
    key: "special",
    label: "One special character",
    test: (v) => /[!@#$%^&*()_\-+=<>?/{}[\]~|]/.test(v),
  },
];

function validateName(name) {
  const trimmed = name.trim();
  if (!trimmed) return "Full name is required";
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (trimmed.length > 50) return "Name must be at most 50 characters";
  return "";
}

function validatePhone(phone) {
  if (!phone || !phone.trim()) return "Mobile number is required";
  const digits = phone.replace(/[\s-]/g, "");
  if (digits.length === 12 && digits.startsWith('91')) {
    const tenDigit = digits.slice(2);
    if (!/^[6-9]\d{9}$/.test(tenDigit)) return "Invalid mobile number";
    return "";
  }
  if (!/^\d{10}$/.test(digits)) return "Invalid mobile number";
  if (!/^[6-9]\d{9}$/.test(digits)) return "Invalid mobile number";
  return "";
}

function validateEmail(email) {
  if (!email || !email.trim()) return "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Invalid email";
  return "";
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "At least 8 characters";
  if (!/[A-Z]/.test(password)) return "Missing uppercase letter";
  if (!/[a-z]/.test(password)) return "Missing lowercase letter";
  if (!/[0-9]/.test(password)) return "Missing number";
  if (!/[!@#$%^&*()_\-+=<>?/{}[\]~|]/.test(password))
    return "Missing special character";
  return "";
}

function validateConfirm(password, confirm) {
  if (!confirm) return "Confirm password is required";
  if (password !== confirm) return "Passwords do not match";
  return "";
}

function RegisterPage() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, register, loading, error, clearError, successMessage } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [firebaseIdToken, setFirebaseIdToken] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Render reCAPTCHA widget
  useEffect(() => {
    if (!phoneVerified) {
      try {
        const verifier = getRecaptchaVerifier("recaptcha-container");
        verifier?.render().catch(() => {});
      } catch (err) {
        // ignore
      }
    }
  }, [phoneVerified]);

  function getFieldError(field, data = form) {
    switch (field) {
      case "name":
        return validateName(data.name);
      case "phone":
        return validatePhone(data.phone);
      case "email":
        return validateEmail(data.email);
      case "password":
        return validatePassword(data.password);
      case "confirm":
        return validateConfirm(data.password, data.confirm);
      default:
        return "";
    }
  }

  function handleChange(field, value) {
    let normalizedValue = value;
    if (field === 'phone') {
      normalizedValue = normalizePhone(value);
    }
    const updated = { ...form, [field]: value };
    setForm(updated);

    setErrors((prev) => {
      const next = { ...prev };
      const err = getFieldError(field, updated);
      if (err) {
        next[field] = err;
      } else {
        delete next[field];
      }
      if (field === "password" && "confirm" in next) {
        const confirmErr = getFieldError("confirm", updated);
        if (confirmErr) {
          next.confirm = confirmErr;
        } else {
          delete next.confirm;
        }
      }
      return next;
    });

    // If phone changes after verification, invalidate verification
    if (field === 'phone' && phoneVerified) {
      setPhoneVerified(false);
      setOtpSent(false);
      setForm(prev => ({ ...prev, otp: '' }));
      setErrors(prev => {
        const next = { ...prev };
        delete next.otp;
        return next;
      });
    }

    if (error) clearError();
    setServerError(null);
  }

  const isPhoneValid = () => !getFieldError("phone", form);
  const isOtpValid = () => form.otp && form.otp.length === 6;
  const isNameValid = () => !getFieldError("name", form);
  const isEmailValid = () => !getFieldError("email", form);
  const isPasswordValid = () => !getFieldError("password", form);
  const isConfirmValid = () => !getFieldError("confirm", form);

  const canSendOtp = isPhoneValid();
  const canVerifyOtp = isOtpValid();
  const canRegister = phoneVerified && isNameValid() && isPasswordValid() && isConfirmValid();

  const handleSendOtp = useCallback(async () => {
    if (!canSendOtp || sendingOtp || loading) return;
    setSendingOtp(true);
    setErrors({});
    setServerError(null);
    try {
      await sendPhoneOtp(form.phone, "recaptcha-container");
      setOtpSent(true);
      setResendCooldown(60);
      Swal.fire({
        icon: "success",
        title: "OTP sent via SMS!",
        text: "Enter the 6-digit code received on your phone.",
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      console.error("Firebase sendPhoneOtp error:", err);
      let msg = err?.message || "Failed to send OTP";
      if (err?.code === "auth/invalid-phone-number") msg = "Invalid phone number format";
      if (err?.code === "auth/too-many-requests") msg = "Too many requests. Please wait a moment before trying again.";
      if (err?.code === "auth/quota-exceeded") msg = "SMS quota exceeded. Please contact support.";
      setErrors({ phone: msg });
    } finally {
      setSendingOtp(false);
    }
  }, [form.phone, canSendOtp, sendingOtp, loading]);

  const handleVerifyOtp = useCallback(async () => {
    if (!canVerifyOtp || verifyingOtp || loading) return;
    setVerifyingOtp(true);
    setErrors({});
    setServerError(null);
    try {
      const { idToken } = await confirmPhoneOtp(form.otp);
      setFirebaseIdToken(idToken);
      setPhoneVerified(true);
      Swal.fire({
        icon: "success",
        title: "Phone verified!",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      console.error("Firebase confirmPhoneOtp error:", err);
      let msg = err?.message || "Invalid OTP";
      if (err?.code === "auth/invalid-verification-code") msg = "Incorrect OTP code. Please try again.";
      if (err?.code === "auth/code-expired") msg = "OTP has expired. Please request a new code.";
      setErrors({ otp: msg });
    } finally {
      setVerifyingOtp(false);
    }
  }, [form.otp, canVerifyOtp, verifyingOtp, loading]);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    if (!canRegister || loading) return;

    try {
      await register({
        name: form.name,
        email: form.email,
        phone: normalizePhoneForApi(form.phone),
        password: form.password,
        confirmPassword: form.confirm,
        firebaseIdToken,
      }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      navigate("/");
    } catch (err) {
      if (err?.response?.data?.message) {
        setServerError(err.response.data.message);
      }
      const srvErrors = err?.response?.data?.errors;
      if (srvErrors && Array.isArray(srvErrors)) {
        const mapped = {};
        const fieldMap = { fullName: "name", mobile: "phone", confirmPassword: "confirm" };
        for (const { field, message } of srvErrors) {
          const formField = fieldMap[field] || field;
          if (formField in form) mapped[formField] = message;
        }
        if (Object.keys(mapped).length) setErrors(mapped);
      } else if (srvErrors && typeof srvErrors === "object") {
        const mapped = {};
        const fieldMap = { fullName: "name", mobile: "phone", confirmPassword: "confirm" };
        for (const [fld, msg] of Object.entries(srvErrors)) {
          const formField = fieldMap[fld] || fld;
          if (formField in form)
            mapped[formField] = Array.isArray(msg) ? msg[0] : msg;
        }
        if (Object.keys(mapped).length) setErrors(mapped);
      }
    }
  }, [form, canRegister, loading, register, navigate]);

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0 || loading) return;
    await handleSendOtp();
  }, [resendCooldown, loading, handleSendOtp]);

  function inputClass(field) {
    return `w-full rounded-2xl border bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all duration-200 ${
      errors[field]
        ? "border-brand-orange/50 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 focus:bg-white"
        : "border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300"
    }`;
  }

  const getPasswordStrength = () => {
    if (!form.password) return 0;
    let strength = 0;
    RULES.forEach((rule) => {
      if (rule.test(form.password)) strength += 20;
    });
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthColor =
    strength <= 40
      ? "bg-brand-orange"
      : strength <= 80
        ? "bg-brand-gold"
        : "bg-brand-blue";

  const arePasswordFieldsDisabled = !phoneVerified;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AuthBrandPanel
        heading={<>Create your <span className="text-brand-gold">account</span></>}
        subheading="Join thousands of users managing their properties, vehicles, and businesses on our platform."
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-mesh-gradient opacity-50 lg:hidden pointer-events-none" />

        <div className="w-full max-w-md relative z-10 bg-white lg:bg-transparent p-8 lg:p-0 rounded-3xl shadow-float lg:shadow-none border border-slate-100 lg:border-none my-auto">
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="OneVishwam Logo" className="h-10 w-auto object-contain" />
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Enter your details to get started
            </p>
          </div>

          {(serverError || error) && (
            <div className="mb-6 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 p-4 text-sm text-brand-orange flex items-start gap-3 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
              <span>{serverError || error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                maxLength={50}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter your full name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "reg-name-error" : undefined}
                className={inputClass("name")}
              />
              {errors.name && (
                <p id="reg-name-error" className="mt-1.5 text-xs font-medium text-brand-orange" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email (Optional) */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Email ID <span className="text-slate-400 text-xs font-normal">(Optional)</span>
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter your email (optional)"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "reg-email-error" : undefined}
                className={inputClass("email")}
              />
              {errors.email && (
                <p id="reg-email-error" className="mt-1.5 text-xs font-medium text-brand-orange" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="reg-phone"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <Input
                  id="reg-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={13}
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "reg-phone-error" : undefined}
                  className={inputClass("phone")}
                />
                {phoneVerified && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-green">
                    <i className="fa-solid fa-circle-check text-lg" aria-hidden="true" />
                  </div>
                )}
              </div>
              {errors.phone && (
                <p id="reg-phone-error" className="mt-1.5 text-xs font-medium text-brand-orange" role="alert">
                  {errors.phone}
                </p>
              )}
              {phoneVerified && (
                <p className="mt-1.5 text-xs font-medium text-brand-green flex items-center justify-center gap-1 animate-fade-in">
                  <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  Phone number verified successfully
                </p>
              )}
            </div>

            {/* Firebase reCAPTCHA Widget */}
            {!phoneVerified && (
              <div id="recaptcha-container" className="my-3 flex justify-center"></div>
            )}

            {/* Send OTP Button */}
            {!phoneVerified && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || loading || !isPhoneValid() || resendCooldown > 0}
                  className="w-full rounded-2xl mt-4 bg-gradient-to-r from-brand-blue to-brand-blue/80 py-3.5 text-sm font-bold text-white shadow-glow-blue hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {sendingOtp ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                      Sending OTP...
                    </span>
                  ) : otpSent ? (
                    resendCooldown > 0 ? (
                      <span>Resend OTP in {resendCooldown}s</span>
                    ) : (
                      <span>Resend OTP</span>
                    )
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            )}

            {/* OTP Section */}
            {(otpSent || phoneVerified) && (
              <div className="animate-fade-in">
                <OTPInput
                  value={form.otp}
                  onChange={(value) => handleChange("otp", value)}
                  onComplete={handleVerifyOtp}
                  disabled={phoneVerified || verifyingOtp || loading}
                  error={errors.otp}
                  label={phoneVerified ? "OTP (Verified)" : "OTP"}
                  id="reg-otp"
                  autoFocus={otpSent && !phoneVerified}
                />
                {!phoneVerified && (
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={sendingOtp || verifyingOtp || loading || resendCooldown > 0}
                      className="flex-1 rounded-2xl border border-slate-300 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={verifyingOtp || loading || !canVerifyOtp}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-blue/80 py-3.5 text-sm font-bold text-white shadow-glow-blue hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {verifyingOtp ? (
                        <span className="flex items-center justify-center gap-2">
                          <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                          Verifying...
                        </span>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </div>
                )}
                {phoneVerified && (
                  <p className="mt-2 text-xs font-medium text-brand-green flex items-center justify-center gap-1 animate-fade-in">
                    <i className="fa-solid fa-circle-check" aria-hidden="true" />
                    Phone number verified successfully
                  </p>
                )}
              </div>
            )}

            {/* Resend OTP */}
            {otpSent && !phoneVerified && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || resendCooldown > 0}
                  className="text-sm font-medium text-brand-blue hover:text-brand-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resendCooldown > 0
                    ? `Resend OTP in {resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>
            )}

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  maxLength={128}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Create password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "reg-password-error" : undefined
                  }
                  className={inputClass("password")}
                  style={{ paddingRight: '3rem' }}
                  disabled={arePasswordFieldsDisabled}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-blue transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                  disabled={arePasswordFieldsDisabled}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {errors.password && (
                <p id="reg-password-error" className="mt-1.5 text-xs font-medium text-brand-orange" role="alert">
                  {errors.password}
                </p>
              )}

              {form.password && (
                <div className="mt-3 space-y-5 animate-fade-in">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${strengthColor}`}
                      style={{ width: `${Math.max(10, strength)}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-xl bg-slate-50 border border-slate-100 p-3">
                    {RULES.map((rule) => {
                      const passed = rule.test(form.password);
                      return (
                        <div key={rule.key} className="flex items-center gap-2 text-[11px] font-medium">
                          <div className={`flex items-center justify-center w-3.5 h-3.5 rounded-full ${passed ? "bg-brand-gold/20 text-brand-gold" : "bg-slate-200 text-slate-400"}`}>
                            <i className={`fa-solid ${passed ? "fa-check" : "fa-minus"} text-[8px]`} aria-hidden="true" />
                          </div>
                          <span className={passed ? "text-slate-700" : "text-slate-400"}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="reg-confirm"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  maxLength={128}
                  value={form.confirm}
                  onChange={(e) => handleChange("confirm", e.target.value)}
                  placeholder="Confirm password"
                  aria-invalid={!!errors.confirm}
                  aria-describedby={
                    errors.confirm ? "reg-confirm-error" : undefined
                  }
                  className={inputClass("confirm")}
                  style={{ paddingRight: '3rem' }}
                  disabled={arePasswordFieldsDisabled}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-blue transition-colors focus:outline-none"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  tabIndex={-1}
                  disabled={arePasswordFieldsDisabled}
                >
                  <i className={`fa-solid ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
              {errors.confirm && (
                <p id="reg-confirm-error" className="mt-1.5 text-xs font-medium text-brand-orange" role="alert">
                  {errors.confirm}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={!canRegister || loading}
              className="w-full rounded-2xl mt-4 bg-gradient-to-r from-brand-blue to-brand-blue/80 py-3.5 text-sm font-bold text-white shadow-glow-blue hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center text-sm text-slate-500 font-medium pt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-blue hover:text-brand-blue/80 font-bold transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;