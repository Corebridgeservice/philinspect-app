# PHILinspect — Smart Inspection Finder

A production-ready, mobile-first property inspection assessment system for PHILinspect Philippines.

Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Deployable on **Render**. GitHub-ready.

---

## Overview

PHILinspect Smart Inspection Finder is a Typeform-style guided assessment that:

- Asks customers a few simple questions about their property and situation
- Privately calculates the appropriate inspection package and internal quote
- Sends all data (including internal pricing) to **Google Sheets**, **Zoho CRM**, and **Zoho Books**
- Shows the customer only a clean confirmation screen — **no pricing is ever shown to the customer**

---

## Customer Experience

The customer sees:
- A clean, one-question-per-screen assessment flow
- Recommended service type and category
- A thank-you confirmation screen
- A "Book Consultation Call" button

The customer does **not** see:
- Base price, additional SQM fee, mobilization fee, discount, or estimated total
- Distance calculations
- Internal package pricing
- Any Zoho or Google Sheets details

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Runtime | Node.js 20 |
| Deployment | Render Web Service |
| Integrations | Google Sheets, Google Maps, Zoho CRM, Zoho Books |

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-org/philinspect.git
cd philinspect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your API keys and credentials.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## GitHub Export

```bash
git init
git add .
git commit -m "Initial commit: PHILinspect Smart Inspection Finder"
git remote add origin https://github.com/your-org/philinspect.git
git push -u origin main
```

---

## Render Deployment

### 1. Connect your GitHub repository to Render

Go to [render.com](https://render.com) and create a New Web Service connected to your GitHub repo.

### 2. Configure the service

| Setting | Value |
|---|---|
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Node Version | `20` |
| Region | Singapore (closest to Philippines) |

### 3. Set environment variables

In your Render dashboard, add all variables from `.env.example`. The `render.yaml` file pre-defines all required keys.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your public site URL |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps key for Places Autocomplete (frontend) |
| `GOOGLE_MAPS_API_KEY` | Google Maps key for Distance Matrix (backend) |
| `PHILINSPECT_OFFICE_ADDRESS` | PHILinspect office address for distance calculation |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Google Service Account email |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Google Service Account private key |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Target Google Spreadsheet ID |
| `ZOHO_CLIENT_ID` | Zoho API client ID |
| `ZOHO_CLIENT_SECRET` | Zoho API client secret |
| `ZOHO_REFRESH_TOKEN` | Zoho OAuth refresh token |
| `ZOHO_ACCOUNTS_URL` | Zoho accounts URL (default: `https://accounts.zoho.com`) |
| `ZOHO_API_BASE_URL` | Zoho API base URL (default: `https://www.zohoapis.com`) |
| `ZOHO_BOOKS_ORG_ID` | Zoho Books organization ID |
| `ENABLE_ZOHO_BOOKS` | Set to `true` to enable Zoho Books |
| `NEXT_PUBLIC_BOOKING_URL` | URL for the "Book Consultation Call" button |
| `INTERNAL_SETTINGS_PASSWORD` | Password for the `/internal-settings` page |

---

## Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable: **Maps JavaScript API**, **Places API**, **Distance Matrix API**
3. Create an API key under Credentials
4. Restrict the frontend key to your domain
5. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `GOOGLE_MAPS_API_KEY`

---

## Google Sheets Setup

1. Create a **Service Account** in Google Cloud Console
2. Download the JSON key and copy `client_email` and `private_key` to your env
3. Create a Google Spreadsheet and share it with the service account email (Editor)
4. Set `GOOGLE_SHEETS_SPREADSHEET_ID`

**Column headers for Row 1:**

```
Timestamp | Full Name | Mobile | Email | Viber | WhatsApp | User Type | Property Type | Selected Service | Selected Package | Add-ons | Property Address | Floor Area | Number of Floors | Furnished | Occupied | Preferred Inspection Date | Distance KM | Mobilization Fee | Base Fee | Additional SQM Fee | Add-ons Total | Discount | Estimated Internal Quote | Custom Review Required | Preferred Call Date | Preferred Call Time | Status
```

---

## Zoho CRM Setup

1. Go to [Zoho API Console](https://api-console.zoho.com/) and create a Self Client
2. Generate a refresh token with scopes: `ZohoCRM.modules.ALL`, `ZohoCRM.settings.ALL`
3. Set `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`

**Custom fields to create in Zoho CRM Leads module:**

| Field Name | Type |
|---|---|
| Viber | Single Line |
| WhatsApp | Single Line |
| User_Type | Single Line |
| Property_Type | Single Line |
| Service_Type | Single Line |
| Package_Choice | Single Line |
| Add_Ons | Multi Line |
| Property_Address | Multi Line |
| Floor_Area_sqm | Number |
| Number_of_Floors | Number |
| Distance_KM | Single Line |
| Mobilization_Fee | Currency |
| Estimated_Internal_Quote | Currency |
| Preferred_Inspection_Date | Date |
| Preferred_Call_Date | Date |
| Preferred_Call_Time | Single Line |
| Custom_Review_Required | Single Line |

---

## Zoho Books Setup

1. Set `ENABLE_ZOHO_BOOKS=true` and `ZOHO_BOOKS_ORG_ID`
2. Add scopes to your refresh token: `ZohoBooks.contacts.CREATE`, `ZohoBooks.estimates.CREATE`

---

## How to Update Pricing

Edit `src/config/pricing.ts`:

```typescript
export const PRICING_RULES = {
  condo: { baseFee: 13_999, includedSqm: 50, additionalSqmRate: 75 },
  house_and_lot: { baseFee: 17_999, includedSqm: 100, additionalSqmRate: 100 },
  // ...
};

export const ADD_ON_PRICES = {
  proestimate: 12_500,
  scopecheck: 12_500,
  expert_statement: 12_500,
};
```

---

## How to Update Mobilization Fees

Edit `src/config/mobilization.ts`:

```typescript
export const MOBILIZATION_TIERS = [
  { maxKm: 15, fee: 6_000, label: 'Metro Manila / 0–15 km' },
  { maxKm: 30, fee: 6_500, label: '16–30 km' },
  // Add or modify tiers here
];
```

---

## How to Update Service Routing

Edit `src/config/routing.ts`:

```typescript
export const ROUTING_RULES = [
  { userType: 'property_buyer', service: 'pre_purchase', zohoStage: 'Inspection Services' },
  // ...
];
```

---

## How to Update Packages

Edit `src/config/packages.ts` to add or modify add-on packages and their availability per service type.

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/submit-assessment` | POST | Main submission endpoint |
| `/api/health` | GET | Health check |
| `/api/internal/status` | GET | Integration status (password protected) |
| `/api/google-sheets` | POST | Manual Sheets append (password protected) |
| `/api/zoho-crm` | POST | Manual CRM lead (password protected) |
| `/api/zoho-books` | POST | Manual Books estimate (password protected) |
| `/api/webhooks/zoho-form` | POST | Zoho Forms webhook receiver |

---

## Internal Settings Page

Access at: `https://your-site.com/internal-settings`

This page is **not linked anywhere** on the public site. It requires `INTERNAL_SETTINGS_PASSWORD`.

Shows connection status only — never API keys or secrets.

---

## Project Structure

```
philinspect/
├── app/
│   ├── api/                             # All API routes
│   ├── internal-settings/page.tsx       # Hidden internal dashboard
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── src/
│   ├── config/
│   │   ├── pricing.ts                   # All pricing constants
│   │   ├── services.ts                  # Service type definitions
│   │   ├── packages.ts                  # Add-on package definitions
│   │   ├── routing.ts                   # Service routing rules
│   │   └── mobilization.ts             # Mobilization fee tiers
│   ├── lib/
│   │   ├── pricing-engine.ts            # Internal pricing calculator
│   │   ├── routing-engine.ts            # Service routing logic
│   │   ├── google-maps.ts               # Distance Matrix integration
│   │   ├── google-sheets.ts             # Sheets append integration
│   │   ├── zoho-crm.ts                  # Zoho CRM Lead/Deal creation
│   │   └── zoho-books.ts                # Zoho Books estimate creation
│   ├── components/
│   │   ├── assessment/                  # Assessment flow components
│   │   ├── ui/                          # Shared UI components
│   │   └── layout/                      # Landing page sections
│   └── types/
│       └── assessment.ts                # Shared TypeScript types
├── .env.example
├── render.yaml
└── README.md
```

---

## License

Proprietary — PHILinspect Philippines. All rights reserved.
