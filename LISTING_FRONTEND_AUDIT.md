# Listing-Admin Portal (Vishwam-Listings) Audit & Analysis

**Project Path:** `/Users/tejas/Projects/Learn/React JS/Listing-Admin/Vishwam-Listings`  
**Audit Date:** September 30, 2026  
**Status:** ✅ Operational & Production-Ready  

---

## 1. Overview & Architecture

The **Vishwam Listings Admin** portal is a React 18 + Vite SPA designed for managing marketplace listings across multiple categories (Real Estate, Vehicles, Groceries, Garments, Jewellery, Finance, Bedding, Electronics).

* **Framework:** React 18 with Vite build tool
* **State Management:** Redux Toolkit (`@reduxjs/toolkit`) + React Redux
* **Routing:** React Router DOM v6
* **UI Components:** Lucide Icons, Custom Tailwind/Vanilla CSS Utilities, Glassmorphism design
* **API Communication:** Axios instance (`src/services/api.js`) targeting local backend (`http://localhost:5001/api`)

---

## 2. Authentication & Authorization Workflow

### Restricted Access Control
* **Predefined Accounts Enforced:** Access is strictly limited to authorized listers and administrators:
  - `ceo@onevishwam.com` (Super Admin)
  - `sinchana@onevishwam.com` (Listing Admin)
  - `test123@gmail.com` (Test Lister)
  - Password: `Vish@123`
* **UI Customization:** Test credential cards have been removed from the public Login UI to keep credentials secure.

### Firebase Auth & Token Passing
* Firebase Authentication handles user identity validation.
* **Axios Interceptor:** Every HTTP request to `http://localhost:5001/api` automatically fetches a fresh Firebase ID Token (`getIdToken()`) and attaches it in the `Authorization` header (`Bearer <token>`).
* **Refresh Interceptor:** Handles token refresh automatically on `401 Unauthorized` responses without dropping user sessions.

---

## 3. Category & Form Support

The portal provides end-to-end support for 8 categories:
1. **Real Estate** (`properties`)
2. **Vehicles** (`vehicles`)
3. **Groceries** (`groceries`)
4. **Garments** (`garments`)
5. **Jewellery** (`jewellery`)
6. **Finance** (`finance`)
7. **Bedding & Comfort** (`bedding` → mapped to `garments` backend module)
8. **Electronics** (`electronics` → mapped to `garments` backend module)

### Form Pipeline (`src/pages/AddListing/`)
- `constants.js`: Category definitions and field options.
- `formConfig.js`: Step-by-step form layout rules.
- `payloadBuilder.js`: Constructs clean payloads for backend creation.
- `useAddListingForm.js`: Form submission and error validation state.

---

## 4. API & Data Layer (`src/services/listings.js`)

* **Direct Live Sync:** Interacts exclusively with the live API server on `http://localhost:5001/api`.
* **Database Target:** Communicates directly with the backend linked to the live **`onevishwam`** MongoDB Atlas cluster (`AWS / Mumbai`).
* **Zero Local Storage Interference:** Local storage fallback overrides have been purged to prevent test data persistence (`local_*` items removed).
* **Caching & Deduplication:** Loader requests are deduplicated in-flight to prevent redundant network traffic.

---

## 5. Verification & Build Integrity

* **Vite Production Build:** Successfully compiled without errors (`dist/` generated in 3.38s).
* **Network & Cross-Origin:** CORS and preflight options verified for `http://localhost:5173` and network origin (`http://192.168.29.192:5173`).

---

## 6. How to Run & Test

```bash
# Navigate to Frontend Directory
cd "/Users/tejas/Projects/Learn/React JS/Listing-Admin/Vishwam-Listings"

# Start Development Server
npm run dev

# Run Production Build Audit
npm run build
```
