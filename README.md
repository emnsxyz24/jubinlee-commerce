# Jubi & Lee — Modern Fashion E-Commerce

A full-stack monorepo fashion e-commerce platform with a **Nuxt 3 Storefront**, a **Vue 3 Material Design 3 Admin Dashboard**, and a decoupled **NestJS REST API** with WhatsApp-based checkout.

---

## 📁 Project Structure

```
├── apps/
│   ├── storefront/    # Nuxt 3 customer-facing storefront
│   ├── admin/         # Vue 3 + Vite admin dashboard (Material 3 Expressive)
│   └── api/           # NestJS REST API (Prisma ORM + PostgreSQL)
└── packages/
    └── shared-types/  # Shared TypeScript interfaces & types
```

---

## 🛠️ Tech Stack

- **Storefront**: Nuxt 3, Vue 3.5, Pinia, Tailwind CSS
- **Admin Dashboard**: Vue 3.5, Vite, Vuetify 4 (Material Design 3), Pinia, Tailwind CSS
- **Backend API**: NestJS 11, Prisma ORM, PostgreSQL (Supabase)
- **Monorepo Tooling**: pnpm workspaces + Turborepo

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Setup
Create `.env` in `apps/api/`, `apps/admin/`, and `apps/storefront/` based on their respective `.env.example` files.

### 3. Database Sync & Seed
```bash
# Push schema to database
pnpm --filter @fashion-store/api db:push

# Populate initial catalog and demo data
pnpm --filter @fashion-store/api db:seed
```

### 4. Run Development Stack
```bash
pnpm dev
```

- **Storefront**: `http://localhost:3001`
- **Admin Dashboard**: `http://localhost:3002`
- **Backend API**: `http://localhost:3000` (Swagger Docs: `http://localhost:3000/api/docs`)

---

## 📦 Build for Production

```bash
pnpm build
```
