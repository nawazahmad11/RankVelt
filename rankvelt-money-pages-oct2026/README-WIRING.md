# Phase 1 — App.tsx Wiring (paste into Cursor)

## Step 1: Copy component files
Copy these 5 files into `src/pages/services/` (same folder as LocalSEOService.tsx):
- AiSeoAgencyService.tsx
- HireSeoExpertService.tsx
- EcommerceSeoServices.tsx
- ShopifySeoServicesService.tsx
- SeoAuditServicesService.tsx

For the local SEO upgrade: open `src/pages/services/LocalSEOService.tsx` and
replace its FULL contents with LocalSEOService.UPGRADED.tsx (then delete the
.UPGRADED file, the live file must stay named LocalSEOService.tsx).

## Step 2: Add lazy imports in App.tsx
Paste after the BusinessSEOService lazy import block:

```tsx
const AiSeoAgencyService = lazy(
  () => import("./pages/services/AiSeoAgencyService"),
);

const HireSeoExpertService = lazy(
  () => import("./pages/services/HireSeoExpertService"),
);

const EcommerceSeoServices = lazy(
  () => import("./pages/services/EcommerceSeoServices"),
);

const ShopifySeoServicesService = lazy(
  () => import("./pages/services/ShopifySeoServicesService"),
);

const SeoAuditServicesService = lazy(
  () => import("./pages/services/SeoAuditServicesService"),
);
```

## Step 3: Add routes in App.tsx
Paste after the `/business-seo` Route block:

```tsx
<Route
  path="/ai-seo-agency"
  element={<AiSeoAgencyService />}
/>

<Route
  path="/hire-seo-expert"
  element={<HireSeoExpertService />}
/>

<Route
  path="/ecommerce-seo-services"
  element={<EcommerceSeoServices />}
/>

<Route
  path="/shopify-seo-services"
  element={<ShopifySeoServicesService />}
/>

<Route
  path="/seo-audit-services"
  element={<SeoAuditServicesService />}
/>
```

## Step 4: Build, deploy, verify
1. `npm run build` — must pass with no TypeScript errors
2. Deploy via Vercel
3. Open each URL and confirm it renders:
   - /ai-seo-agency
   - /hire-seo-expert
   - /ecommerce-seo-services
   - /shopify-seo-services
   - /seo-audit-services
   - /local-seo (upgraded, check AI-search angle present)
4. Request GSC indexing for the 5 new URLs

## Safety verdict
SAFE. All 5 new pages are additive config-only files using the existing
SeoServiceTemplate pattern. No existing routes, components or logic are
touched. The /local-seo upgrade keeps every original section and FAQ and only
adds the AI-search angle. No em/en dashes, no invented statistics, pricing
from $525/month with minimum 3 months then month-to-month stated in FAQs.
