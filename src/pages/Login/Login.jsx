import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/authSlice";
import Swal from "sweetalert2";
import logo from "@/assets/logo.png";
import Input from "@/components/ui/Input";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";
import { normalizePhone } from "@/utils/phone";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, phoneLogin, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState('phone');

  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (loginMode === 'email') {
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";
      if (!form.password) e.password = "Password is required";
      else if (form.password.length < 8) e.password = "At least 8 characters";
    } else {
      const phoneDigits = form.phone.replace(/\D/g, '');
      if (!phoneDigits) e.phone = "Phone is required";
      else if (phoneDigits.length === 10) {
        if (!/^[6-9]\d{9}$/.test(phoneDigits)) e.phone = "Invalid phone number";
      } else if (phoneDigits.length === 12 && phoneDigits.startsWith('91')) {
        const tenDigit = phoneDigits.slice(2);
        if (!/^[6-9]\d{9}$/.test(tenDigit)) e.phone = "Invalid phone number";
      } else {
        e.phone = "Invalid phone number";
      }
      if (!form.password) e.password = "Password is required";
      else if (form.password.length < 8) e.password = "At least 8 characters";
    }
    return e;
  }

  function updateField(field, value) {
    let next = value;
    if (field === 'phone') {
      next = value.replace(/\D/g, '').slice(0, 12);
    }
    setForm({ ...form, [field]: next });
    clearError();
    if (errors[field]) {
      const nextErrors = { ...errors };
      delete nextErrors[field];
      setErrors(nextErrors);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      if (loginMode === 'email') {
        await login({ email: form.email, password: form.password }).unwrap();
      } else {
        await phoneLogin({ phone: normalizePhone(form.phone), password: form.password }).unwrap();
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
      console.warn(
        "Login failed:",
        err?.response?.data?.message || err?.message,
      );
    }
  };

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

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign in
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Please enter your details to continue
            </p>
          </div>

          <div className="mb-6">
            <div className="flex rounded-xl bg-slate-100 p-1" role="tablist">
              <button
                role="tab"
                aria-selected={loginMode === 'email'}
                onClick={() => { setLoginMode('email'); setErrors({}); clearError(); }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${loginMode === 'email' ? 'bg-white shadow-sm text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Email
              </button>
              <button
                role="tab"
                aria-selected={loginMode === 'phone'}
                onClick={() => { setLoginMode('phone'); setErrors({}); clearError(); }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${loginMode === 'phone' ? 'bg-white shadow-sm text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Mobile
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 p-4 text-sm text-brand-orange flex items-start gap-3 animate-fade-in">
              <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginMode === 'email' ? (
              <>
                <Input
                  id="login-email"
                  label="Email address"
                  type="email"
                  icon="fa-envelope"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  error={errors.email}
                  required
                />

                <Input
                  id="login-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon="fa-lock"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  error={errors.password}
                  required
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </Input>
              </>
            ) : (
              <>
                <Input
                  id="login-phone"
                  label="Mobile Number"
                  type="tel"
                  icon="fa-phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  error={errors.phone}
                  required
                />

                <Input
                  id="login-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon="fa-lock"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  error={errors.password}
                  required
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </Input>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-brand-blue to-brand-blue/80 py-3.5 text-sm font-bold text-white shadow-glow-blue hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center text-sm text-slate-500 font-medium pt-4">
              <div className="mb-2">
                {loginMode === 'email' ? (
                  <>Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-brand-blue hover:text-brand-blue/80 font-bold transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                ) : (
                  <>Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-brand-blue hover:text-brand-blue/80 font-bold transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
              {loginMode === 'phone' && (
                <Link
                  to="/forgot-password"
                  className="text-brand-blue hover:text-brand-blue/80 font-bold transition-colors"
                >
                  Forgot Password?
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;