import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./config";

let confirmationResult = null;
let recaptchaVerifier = null;

/**
 * Initialize or retrieve the invisible reCAPTCHA verifier.
 * @param {string} containerId Element ID where reCAPTCHA attaches (default: 'recaptcha-container')
 */
export function getRecaptchaVerifier(containerId = "recaptcha-container") {
  if (typeof window === "undefined") return null;

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved
      },
      "expired-callback": () => {
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
          } catch {
            // ignore
          }
          window.recaptchaVerifier = null;
        }
      },
    });
  }

  return window.recaptchaVerifier;
}

/**
 * Format any input phone string into standard E.164 format (+91...)
 */
export function formatE164Phone(rawPhone) {
  if (!rawPhone) return "";
  const digits = String(rawPhone).replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  if (rawPhone.startsWith("+")) {
    return rawPhone.replace(/\s+/g, "");
  }
  return `+91${digits.slice(-10)}`;
}

/**
 * Send an OTP to the given phone number via Firebase SMS.
 * @param {string} phone 10-digit Indian phone or formatted phone
 * @param {string} containerId DOM ID for reCAPTCHA widget
 * @returns {Promise<{ verificationId: string }>}
 */
export async function sendPhoneOtp(phone, containerId = "recaptcha-container") {
  const formattedPhone = formatE164Phone(phone);
  if (!formattedPhone || formattedPhone.length < 12) {
    throw new Error("Please enter a valid 10-digit mobile number");
  }

  const verifier = getRecaptchaVerifier(containerId);
  try {
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    return { verificationId: confirmationResult.verificationId, phone: formattedPhone };
  } catch (err) {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch {
        // ignore
      }
      window.recaptchaVerifier = null;
    }
    throw err;
  }
}

/**
 * Confirm the OTP code entered by the user.
 * @param {string} otpCode 6-digit OTP string
 * @returns {Promise<{ user: any, idToken: string, phone: string }>}
 */
export async function confirmPhoneOtp(otpCode) {
  if (!confirmationResult) {
    throw new Error("No active OTP request found. Please request an OTP first.");
  }
  if (!otpCode || String(otpCode).trim().length !== 6) {
    throw new Error("Please enter a valid 6-digit OTP code");
  }

  const userCredential = await confirmationResult.confirm(String(otpCode).trim());
  const user = userCredential.user;
  const idToken = await user.getIdToken();

  return {
    user,
    idToken,
    phone: user.phoneNumber,
  };
}

