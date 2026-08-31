# Material Design 3 Expressive Migration Tracker — Jubi & Lee Admin

**Tech Stack**: Vue 3.5 + Vite + Vuetify 4 + `@material/material-color-utilities` + `vue-chrts`  
**Brand Seeds**: Cream `#F4ECE5` + Near-Black `#1A170F` (Jubi & Lee M3 Tonal Palette)  
**Visual Direction**: Material Design 3 Expressive (Fino shape language — squircles ~20-28px radius, blob-decorated hero banner, collapsible navigation rail, soft-tinted icon circle stat badges, strict M3 button hierarchy).  
**Standing UI Invariant**: **ZERO visible card borders site-wide**. All cards, dialogs, and containers must be differentiated purely through M3 tonal surface shifts and diffuse soft shadows (`.m3-card-shadow`, `.m3-hero-shadow`), never 1px border strokes.

---

## Phase Status Summary

| Phase | Description | Status | Verification |
|---|---|---|---|
| **Phase 0** | App Shell: Vuetify 4 setup, M3 dynamic theme from seeds, collapsible nav rail, zero auth/router regressions, API_BASE_URL fix | **COMPLETED** | Build passed (14.05s) |
| **Phase 1** | Dashboard Pilot: Squircle stat cards with sparklines, vue-chrts (trend + donut), M3 buttons, 8dp grid | **COMPLETED** | Build passed (26.86s) |
| **Phase 2** | Products, Categories, Inventory views redesign | **COMPLETED** | Build passed (26.45s) |
| **Phase 3** | Orders Pipeline & Customers views redesign | **COMPLETED** | Build passed (27.77s) |
| **Phase 4** | Marketing Banners, Discounts Engine, Contact Messages (Inbox) views redesign | **COMPLETED** | Build passed (20.35s) |
| **Phase 5** | Store Settings, Users & RBAC Roles, Activity Logs views redesign | **COMPLETED** | Build passed (27.87s) |
| **Phase 6** | Sales Analytics, Login View polish, package cleanup & ApexCharts removal | **COMPLETED** | Build passed (22.91s) |

---

## Detailed Phase Breakdown

### Phase 0: App Shell & Foundation
- [x] Install & configure Vuetify 4, `vite-plugin-vuetify`, `@mdi/font`, `@material/material-color-utilities`.
- [x] Implement M3 dynamic palette generation utility from brand seeds (`#F4ECE5` and `#1A170F`) generating light/dark M3 token sets (`primary`, `on-primary`, `primary-container`, `surface`, `surface-container-low`, `surface-container-highest`, `outline`, etc.).
- [x] Replace `AdminLayout.vue` with a collapsible M3 Navigation Rail (`v-navigation-drawer` with rail mode toggle, branded header, active pill items with role-based visibility, user profile footer, and top `v-app-bar`).
- [x] Preserve all 14 routes, meta permission checks, JWT auth store, and login guards with zero regressions.
- [x] Update all view fetch calls to use `API_BASE_URL` from `@/config` instead of hardcoded `http://localhost:3000`.
- [x] One-shot build check: `pnpm --filter @fashion-store/admin build`.
- [x] Visual verification pass with temporary dev server.

### Phase 1: Dashboard Pilot
- [x] Install `vue-chrts` (Unovis-based Vue chart package).
- [x] Rebuild `DashboardView.vue` with M3 Expressive layout:
  - Organic/blob-decorated hero banner with greeting, date badge, and export/action buttons.
  - Squircle KPI stat cards (~24px corner radius) with icon-in-colored-circle badges and sparkline trends.
  - Sales & order volume trend chart using `vue-chrts` area chart with M3 container styling.
  - Category / order composition chart using `vue-chrts` donut chart.
  - M3 Button spec implementation (Filled for primary actions, Tonal for filters, Outlined for secondary, Text for subtle triggers).
- [x] Verify build and visual confirmation.

### Phase 2: Catalog Management (Products, Categories, Inventory)
- [x] Redesign `ProductsView.vue` with M3 data tables, filter chips, search bar, and create/edit modal.
- [x] Redesign `CategoriesView.vue` with M3 card/table layout and modal editor.
- [x] Redesign `InventoryView.vue` with grouped product cards, low-stock threshold badges, and stock adjustment dialog with audit trail reason.
- [x] Verify build and visual confirmation.

### Phase 3: Orders Pipeline & Customer Directory
- [x] Redesign `OrdersView.vue` with M3 segmented filter chips for all 8 documented pipeline states (`pending_whatsapp` → `contacted` → `confirmed` → `processing` → `shipped` → `delivered` / `cancelled`), order card/table rows with WhatsApp badges, and rich order inspection dialog (snapshots + copyable WhatsApp formatted message preview + direct `wa.me` chat link).
- [x] Redesign `CustomersView.vue` with customer summary hero, squircle contact avatars, guest vs. registered badges, and purchase statistics.
- [x] Verify build and visual confirmation.

### Phase 4: Marketing & Communications (Banners, Discounts, Inbox)
- [x] Redesign `BannersView.vue` with visual banner preview cards, placement chips, and scheduler dialog.
- [x] Redesign `DiscountsView.vue` with promo code cards/table, percentage/fixed badges, and creation modal.
- [x] Redesign `MessagesView.vue` with contact message cards, status chips, and direct `wa.me` action buttons.
- [x] Verify build and visual confirmation.

### Phase 5: Operations & Administration (Settings, RBAC, Activity Logs)
- [x] Redesign `SettingsView.vue` with structured M3 form sections, WhatsApp desk configuration, and store meta.
- [x] Redesign `UsersView.vue` with staff cards/table, role badges, and invitation modal with permission preview.
- [x] Redesign `ActivityLogsView.vue` with immutable timeline/table view of admin actions.
- [x] Verify build and visual confirmation.

### Phase 6: Analytics & Final Hardening
- [x] Redesign `AnalyticsView.vue` with `vue-chrts` performance charts, top sellers, and revenue breakdown.
- [x] Polish `LoginView.vue` with M3 Expressive branded card and smooth surface elevation.
- [x] Remove `apexcharts` and `vue3-apexcharts` dependencies from `apps/admin/package.json`.
- [x] Run full build verification and final QA.
