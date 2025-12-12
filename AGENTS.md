# AGENTS.md - PIN-App Development Guidelines

## Build & Test Commands
- **Build**: `npm run build` (Next.js production build)
- **Lint**: `npm run lint` (ESLint with Next.js rules)
- **Unit Tests**: `npm test` (Jest) | Single test: `npm test -- __tests__/file.test.ts`
- **E2E Tests**: `npx playwright test` | Single test: `npx playwright test tests-playwright/file.spec.ts`
- **Dev Server**: `npm run dev` (Next.js with Turbopack)

## Code Style Guidelines

### Architecture
- **Framework**: Next.js 16+ App Router, TypeScript, Supabase, Tailwind CSS
- **Components**: Server components by default, `"use client"` only for interactivity
- **Database**: Use `lib/services/general.ts` methods, never direct Supabase queries
- **Types**: Import from `lib/services/types.ts`, use `Tables<>` for raw DB types

### Imports & Organization
```typescript
// 1. React/React hooks
import { useState } from "react";

// 2. External libraries (alphabetical)
import { zodResolver } from "@hookform/resolvers/zod";

// 3. Internal imports (components, lib, hooks)
import { Button } from "@/components/ui-custom/button";
import { GetFromDatabase } from "@/lib/services/general";
```

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `CreateOfferForm`)
- **Functions/Variables**: camelCase (`handleSubmit`, `userData`)
- **Types**: PascalCase with I prefix (`IUser`, `IOffer`)
- **Files**: kebab-case (`create-offer-form.tsx`, `page-services.ts`)

### Patterns & Best Practices
- **Forms**: Zod schemas, react-hook-form, controlled components, `isSubmitting` state
- **Error Handling**: Try/catch blocks, `toast.error()` for user feedback
- **Styling**: `cn()` utility for conditional classes, no hardcoded colors
- **i18n**: No hardcoded text, use `getTranslations()` in server components
- **Images**: `<Image>` component with `unoptimized` prop
- **Server Actions**: `"use server"` directive, form validation on server

### Database Operations
```typescript
// Read with joins
const { data } = await GetFromDatabase<IOffer>({
  tableName: "Offer",
  select: "*, User!Offer_creator_id_fkey(username)",
  filters: [{ method: "eq", column: "id", value: id }]
});

// Create/Update
await PostToDatabase({ tableName: "Offer", contentJson: [{ title: "New" }] });
```

## Copilot Instructions
See `.github/copilot-instructions.md` for comprehensive development rules and patterns.</content>
<parameter name="filePath">C:\Users\ruben\ProyectosCodigo\PIN-App\AGENTS.md