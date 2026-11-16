import React from 'react';
import { Modal } from './ui/Modal';

export function AuthLegalModal({ type, onClose }) {
  if (!type) return null;

  const contentMap = {
    terms: {
      title: 'OneVishwam Lister Terms & Conditions',
      badge: 'Merchant & Lister Agreement',
      sections: [
        {
          heading: '1. Listing Authenticity & Verification',
          text: 'All listings posted to OneVishwam must represent genuine, verifiable properties, automobiles, electronics, or retail goods. You agree to provide accurate specifications, legitimate ownership or authorization documents, and real photos.'
        },
        {
          heading: '2. Prohibited Content & Listings',
          text: 'Submitting misleading information, duplicate posts, unauthorized third-party properties, stolen vehicles, counterfeit electronics, or prohibited commodities will result in immediate suspension and blacklisting from the OneVishwam ecosystem.'
        },
        {
          heading: '3. Pricing & Marketplace Integrity',
          text: 'Listed prices must reflect transparent on-road, ex-showroom, or property agreement figures without hidden deceptive surcharges. OneVishwam reserves the right to reject or unpublish listings violating pricing guidelines.'
        },
        {
          heading: '4. Lead Management & Fair Dealing',
          text: 'Listers agree to respond promptly to verified customer inquiries and honor negotiated booking terms conducted through the OneVishwam Partner Network.'
        }
      ]
    },
    privacy: {
      title: 'OneVishwam Lister Privacy Policy',
      badge: 'Data Protection & Security',
      sections: [
        {
          heading: '1. Information We Collect',
          text: 'We collect personal identification, contact details, dealership/agency credentials, GSTIN/RERA certificates, and listing media to verify partner identity and protect marketplace transactions.'
        },
        {
          heading: '2. How Your Information Is Used',
          text: 'Your credentials are used strictly for account authentication, legal compliance under Indian e-commerce regulations, lead notifications, and fraud prevention.'
        },
        {
          heading: '3. Encryption & Data Safety',
          text: 'Sensitive authentication credentials and uploaded documents are encrypted both in transit (TLS 1.3) and at rest on secure cloud infrastructure. We do not sell your personal data to unauthorized third parties.'
        },
        {
          heading: '4. Access & Deletion Rights',
          text: 'You maintain full rights to review, update, or request deletion of your account and listing records in compliance with Indian IT Data Protection regulations.'
        }
      ]
    },
    help: {
      title: 'OneVishwam Lister Helpdesk & Support',
      badge: '24×7 Partner Support',
      sections: [
        {
          heading: 'Lister Onboarding & Verification',
          text: 'New listings undergo an automated compliance review followed by manual moderation within 2 to 4 business hours. You will receive real-time push and email notifications once approved.'
        },
        {
          heading: 'Direct Support Channels',
          text: 'Need assistance with bulk upload, RERA verification, or photography services? Our merchant concierge desk is available to assist you.'
        },
        {
          heading: 'Contact Details',
          text: 'Email: support@onevishwam.com\nHelpline: +91 80 4567 8900 (Mon–Sat, 9:00 AM – 7:00 PM IST)\nAddress: OneVishwam Corporate Tower, Outer Ring Road, Bengaluru, Karnataka 560103'
        }
      ]
    }
  };

  const active = contentMap[type] || contentMap.terms;

  return (
    <Modal
      isOpen={Boolean(type)}
      onClose={onClose}
      title={active.title}
      size="lg"
      showCancel={false}
      confirmText="Close"
      onConfirm={onClose}
    >
      <div className="space-y-5 text-left py-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-xs font-bold">
          <i className="fa-solid fa-shield-halved text-xs" />
          <span>{active.badge}</span>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 divide-y divide-slate-100">
          {active.sections.map((sec, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{sec.heading}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {sec.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default AuthLegalModal;
