/**
 * Predefined Allowed Credentials & Listing Portal Access Control
 * Restricts Login & Register to designated authorized emails with default credentials.
 */

export const ALLOWED_ACCOUNTS = [
  {
    email: "ceo@onevishwam.com",
    name: "CEO - One Vishwam",
    role: "in_house",
    partnerName: "One Vishwam (CEO)",
    badge: "CEO & Management",
    password: "Vish@123",
  },
  {
    email: "sinchana@onevishwam.com",
    name: "Sinchana - One Vishwam",
    role: "in_house",
    partnerName: "One Vishwam (Lead)",
    badge: "Partner Lead",
    password: "Vish@123",
  },
  {
    email: "test123@gmail.com",
    name: "Test Lister",
    role: "lister",
    partnerName: "Test Lister Entity",
    badge: "Verified Lister",
    password: "Vish@123",
  },
];

export const COMMON_DEFAULT_PASSWORD = "Vish@123";

export const ALLOWED_EMAILS = ALLOWED_ACCOUNTS.map((account) =>
  account.email.toLowerCase()
);

export function isAllowedEmail(email) {
  if (!email || typeof email !== "string") return false;
  return ALLOWED_EMAILS.includes(email.trim().toLowerCase());
}

export function getAllowedAccountDetails(email) {
  if (!email || typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  return ALLOWED_ACCOUNTS.find((a) => a.email.toLowerCase() === normalized) || null;
}
