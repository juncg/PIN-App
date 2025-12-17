# AGENTS.md - PIN-App Development Guidelines

## Code Style Guidelines

### Architecture

-   **Framework**: Next.js 16+ App Router, TypeScript, Supabase, Tailwind CSS
-   **Components**: Server components by default, `"use client"` only for interactivity, always use components from "@/components/ui-custom" for base components (text, buttons...)
-   **Database**: Use `lib/services/general.ts` methods, never direct Supabase queries
-   **Types**: Import from `lib/services/types.ts`, use `Tables<>` for raw DB types

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

-   **Components**: PascalCase (`UserProfile`, `CreateOfferForm`)
-   **Functions/Variables**: camelCase (`handleSubmit`, `userData`)
-   **Types**: PascalCase with I prefix (`IUser`, `IOffer`)
-   **Files**: kebab-case (`create-offer-form.tsx`, `page-services.ts`)

### Patterns & Best Practices

-   **Forms**: Zod schemas, react-hook-form, controlled components, `isSubmitting` state
-   **Error Handling**: Try/catch blocks, `toast.error()` for user feedback
-   **Styling**: `cn()` utility for conditional classes, no hardcoded colors
-   **Images**: `<Image>` component with `unoptimized` prop
-   **Server Actions**: `"use server"` directive, form validation on server
