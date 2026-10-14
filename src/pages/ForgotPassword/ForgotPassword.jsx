import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/authSlice";
import Swal from "sweetalert2";
import logo from "@/assets/logo.png";
import Input from "@/components/ui/Input";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { forgotPassword, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState(location.state?.email || "");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState(null);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const validate = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email address is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    clearError();

    if (!validate()) return;

    try {
      await forgotPassword(email.trim()).unwrap();
      setSentSuccess(true);
      setCooldown(60);

      Swal.fire({
        icon: "success",
        title: "Reset Link Sent!",
        text: `A password reset link has been sent to ${email.trim()}`,
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      const msg =
        (typeof err === "string" ? err : null) ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send password reset email. Please try again.";
      setServerError(msg);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    setServerError(null);
    clearError();

    try {
      await forgotPassword(email.trim()).unwrap();
      setCooldown(60);
      Swal.fire({
        icon: "success",
        title: "Email Resent!",
        text: `A new reset link was sent to ${email.trim()}`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (err) {
      setServerError(typeof err === "string" ? err : err?.message || "Failed to resend");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AuthBrandPanel
        heading={<>Reset your <span className="text-brand-gold">password</span></>}
        subheading="Enter your registered email address and we will send you a secure link to reset your account password."
      />

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-mesh-gradient opacity-50 lg:hidden" />

        <div className="w-full max-w-md relative z-10 bg-white lg:bg-transparent p-8 lg:p-0 rounded-3xl shadow-float lg:shadow-none border border-slate-100 lg:border-none">
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="OneVishwam Logo" className="h-10 w-auto object-contain" />
          </div>

          {!sentSuccess ? (
            <>
              <div className="text-center lg:text-left mb-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue mb-4">
                  <i className="fa-solid fa-key text-lg" aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Forgot Password?
                </h2>
                <p className="text-slate-500 mt-1.5 font-medium text-sm">
                  No worries! Enter your registered email address and we&apos;ll send you a password reset link.
                </p>
              </div>

              {(serverError || error) && (
                <div className="mb-6 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 p-4 text-sm text-brand-orange flex items-start gap-3 animate-fade-in" role="alert">
                  <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{serverError || error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  id="forgot-email"
                  label="Email Address"
                  type="email"
                  icon="fa-envelope"
                  placeholder="e.g. partner@onevishwam.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                    if (serverError) setServerError(null);
                    clearError();
                  }}
                  error={emailError}
                  required
                />

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full rounded-xl mt-2 bg-gradient-to-r from-brand-blue to-blue-600 py-3.5 text-xs font-bold text-white shadow-glow-blue hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin text-sm" aria-hidden="true" />
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <i className="fa-solid fa-paper-plane text-[11px]" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-6 mt-6 border-t border-slate-100">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-blue/80 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 mb-6 shadow-sm ring-8 ring-emerald-50">
                <i className="fa-solid fa-envelope-circle-check text-2xl" aria-hidden="true" />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                Check Your Inbox
              </h2>
              <p className="text-sm font-medium text-slate-600 mb-4">
                We have sent a password reset link to:
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm font-bold text-slate-800 mb-6 max-w-full truncate">
                {email}
              </div>

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Please click the link in the email to set a new password. If you don&apos;t see the email within a couple minutes, check your spam or promotions folder.
              </p>

              {(serverError || error) && (
                <div className="mb-4 rounded-xl bg-brand-orange/10 border border-brand-orange/20 p-3 text-xs text-brand-orange flex items-center justify-center gap-2">
                  <i className="fa-solid fa-circle-exclamation shrink-0" />
                  <span>{serverError || error}</span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="w-full rounded-xl py-3 text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <i className="fa-solid fa-circle-notch fa-spin text-xs" />
                  ) : (
                    <i className="fa-solid fa-rotate-right text-xs" />
                  )}
                  <span>
                    {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend email"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSentSuccess(false);
                    setEmail("");
                  }}
                  className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 py-2 transition-colors cursor-pointer"
                >
                  Try another email address
                </button>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-blue/80 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
