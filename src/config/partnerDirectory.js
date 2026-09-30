/**
 * Centralized Partner & In-House Identity Directory
 * ============================================================================
 * Maps verified emails to their designated system roles and official partner
 * entity names. Used for auto-populating and locking identity attributes
 * during listing intake to prevent tampering.
 * ============================================================================
 */

export const PARTNER_REGISTRY = {
  'ceo@onevishwam.com': {
    role: 'in_house',
    partnerName: 'One Vishwam (CEO)',
    isVerified: true,
    origin: 'in_house_project',
  },
  'sinchana@onevishwam.com': {
    role: 'in_house',
    partnerName: 'One Vishwam (Lead)',
    isVerified: true,
    origin: 'in_house_project',
  },
  'test123@gmail.com': {
    role: 'lister',
    partnerName: 'Test Lister Entity',
    isVerified: true,
    origin: 'channel_partner_project',
  },
};

/**
 * Resolves user identity from email.
 * Returns the matching partner metadata if found, or a fallback object for standard listers.
 *
 * @param {string} email
 * @returns {{ role: string, partnerName: string, isVerified: boolean, isLocked: boolean, origin?: string }}
 */
export function resolvePartnerIdentity(email) {
  if (!email || typeof email !== 'string') {
    return {
      role: 'lister',
      partnerName: '',
      isVerified: false,
      isLocked: false,
    };
  }

  const normalized = email.trim().toLowerCase();
  const entry = PARTNER_REGISTRY[normalized];

  if (entry) {
    return {
      ...entry,
      isLocked: true,
    };
  }

  return {
    role: 'lister',
    partnerName: '',
    isVerified: false,
    isLocked: false,
  };
}

