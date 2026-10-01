import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authSlice";
import Swal from "sweetalert2";
import logo from "@/assets/logo.png";
import Input from "@/components/ui/Input";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";
import { normalizePhone } from "@/utils/phone";
import { isAllowedEmail } from "@/config/allowedCredentials";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { firebaseEmailLogin, phoneLogin, loading, error, clearError } = useAuth();
  
  const [activeTab, setActiveTab] = useState("email"); // 'email' | 'phone'
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const from = location.state?.from?.pathname || "/";

  function validate() {
    const e = {};
    if (activeTab === "email") {
      const emailTrim = form.email.trim();
      if (!emailTrim) {
        e.email = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
        e.email = "Enter a valid email address (e.g. ceo@onevishwam.com)";
      }

      if (!form.password) {
        e.password = "Password is required";
      } else if (form.password.length < 6) {
        e.password = "Password must be at least 6 characters";
      }
    } else {
      const phoneDigits = form.phone.replace(/\D/g, "");
      if (!phoneDigits) {
        e.phone = "Mobile number is required";
      } else if (phoneDigits.length === 10) {
        if (!/^[6-9]\d{9}$/.test(phoneDigits)) e.phone = "Enter a valid 10-digit mobile number";
      } else if (phoneDigits.length === 12 && phoneDigits.startsWith("91")) {
        const tenDigit = phoneDigits.slice(2);
        if (!/^[6-9]\d{9}$/.test(tenDigit)) e.phone = "Enter a valid 10-digit mobile number";
      } else {
        e.phone = "Enter a valid 10-digit mobile number";
      }

      if (!form.password) {
        e.password = "Password is required";
      } else if (form.password.length < 8) {
        e.password = "Password must be at least 8 characters";
      }
    }
    return e;
  }

  function updateField(field, value) {
    let next = value;
    if (field === "phone") {
      next = value.replace(/\D/g, "").slice(0, 12);
    }
    setForm((prev) => ({ ...prev, [field]: next }));
    clearError();
    setServerError(null);
    if (errors[field]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    clearError();

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      if (activeTab === "email") {
        await firebaseEmailLogin({
          email: form.email.trim(),
          password: form.password,
        }).unwrap();
      } else {
        await phoneLogin({
          phone: normalizePhone(form.phone),
          password: form.password,
        }).unwrap();
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        (typeof err === "string" ? err : null) ||
        err?.response?.data?.message ||
        err?.message ||
        "Invalid login credentials. Please try again.";
      setServerError(msg);
      console.warn("Login failed:", msg);
    }
  };

  const isFormValid =
    activeTab === "email"
      ? Boolean(form.email.trim() && form.password.trim())
      : Boolean(form.phone.trim() && form.password.trim());

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AuthBrandPanel
        heading={<>Welcome back to your <span className="text-brand-gold">dashboard</span></>}
        subheading="Manage all your listings from one place. Post properties, vehicles, and more with ease."
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-mesh-gradient opacity-50 lg:hidden" />

        <div className="w-full max-w-md relative z-10 bg-white lg:bg-transparent p-8 lg:p-0 rounded-3xl shadow-float lg:shadow-none border border-slate-100 lg:border-none">
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="OneVishwam Logo" className="h-10 w-auto object-contain" />
          </div>

          <div className="text-center lg:text-left mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign in
            </h2>
            <p className="text-slate-500 mt-1.5 font-medium text-sm">
              Please enter your credentials to access your partner portal
            </p>
          </div>

          {/* Tab Switching: Email (Active) vs Mobile (Temporarily Disabled) */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setActiveTab("email");
                clearError();
                setServerError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "email"
                  ? "bg-white text-brand-blue shadow-xs border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <i className="fa-solid fa-envelope text-[11px]" />
              <span>Email Address</span>
            </button>

            <button
              type="button"
              disabled
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg opacity-50 cursor-not-allowed text-slate-400"
              title="Mobile OTP authentication is temporarily disabled"
            >
              <i className="fa-solid fa-phone text-[10px]" />
              <span>Mobile Number</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wide">
                Coming Soon
              </span>
            </button>
          </div>

          {(serverError || error) && (
            <div className="mb-6 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 p-4 text-sm text-brand-orange flex items-start gap-3 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
              <span>{serverError || error}</span>
            </div>
          )}

          <div className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {activeTab === "email" ? (
                <Input
                  id="login-email"
                  label="Email Address"
                  type="email"
                  icon="fa-envelope"
                  placeholder="e.g. co@vishwam.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  error={errors.email}
                  required
                />
              ) : (
                <Input
                  id="login-phone"
                  label="Mobile Number"
                  type="tel"
                  icon="fa-phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  error={errors.phone}
                  required
                />
              )}

              <Input
                id="login-password"
                label="Password"
                type={showPassword ? "text" : "password"}
                icon="fa-lock"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                error={errors.password}
                required
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </Input>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full rounded-xl mt-2 bg-gradient-to-r from-brand-blue to-blue-600 py-3.5 text-xs font-bold text-white shadow-glow-blue hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-sm" aria-hidden="true" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center text-sm text-slate-500 font-medium pt-3">
            <div className="mb-2">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-brand-blue hover:text-brand-blue/80 font-bold transition-colors"
              >
                Create Account
              </Link>
            </div>
            <Link
              to="/forgot-password"
              className="text-brand-blue hover:text-brand-blue/80 font-bold transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
