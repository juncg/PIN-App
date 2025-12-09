# PIN-App - GitHub Copilot Instructions

Next.js 16+ platform connecting users/businesses through petitions and offers. TypeScript + Supabase + Tailwind CSS.

## Architecture

**Stack**: Next.js App Router, TypeScript, Supabase (PostgreSQL), Tailwind CSS, shadcn/ui, next-intl  
**Structure**: `app/` (pages), `components/ui-custom/` (UI), `lib/services/` (DB layer), `translations/` (i18n)

## Core Rules

✅ **DO**: Server components by default • Use service layer (`lib/services/general.ts`) • Types from `lib/services/types.ts` • UI from `components/ui-custom/` • `"use server"` for actions • `cn()` for classes • Next.js `Image` • Translations • If a component from /ui-custom is modified, ALWAYS update the corresponding test story
❌ **DON'T**: Direct Supabase queries • `"use client"` unnecessarily • Hardcoded text • `<img>` tags • Query `Business_Offer`/`Business_Petition` (don't exist)

## Database Pattern

```typescript
import { GetFromDatabase, PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { IOffer, IPetition } from "@/lib/services/types";

// Read
const { data, error } = await GetFromDatabase<IOffer>({
	tableName: "Offer",
	select: "*, Forum(Business(*))",
	filters: [{ method: "eq", column: "id", value: 123 }],
});

// Create
await PostToDatabase({ tableName: "Offer", contentJson: [{ title: "New" }] });

// Update
await PutToDatabase({ tableName: "Offer", contentJson: { title: "Updated" }, matchColumn: "id", matchValue: 123 });
```

**Schema**: `Offer/Petition` → `forum_id` → `Forum` → `business_id` → `Business`

## Component Patterns

**Server (default)**:

```typescript
export default async function Page({ params }: { params: Promise<{ id: number }> }) {
	const { id } = await params;
	const { data } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: "*",
		filters: [{ method: "eq", column: "id", value: id }],
	});
	return <div>{data?.[0]?.title}</div>;
}
```

**Client (interactive)**:

```typescript
"use client";
import { useState } from "react";
import { Button } from "@/components/ui-custom/button";

export function Form() {
	const [value, setValue] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await PostToDatabase({ tableName: "Example", contentJson: [{ value }] });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Button disabled={isSubmitting}>Submit</Button>
		</form>
	);
}
```

**Server Actions**:

```typescript
// app/example/actions.ts
"use server";
export async function createItem(formData: FormData) {
	return await PostToDatabase({ tableName: "Item", contentJson: [{ name: formData.get("name") }] });
}

// For infinite scroll with .bind()
export async function loadMore(fixedId: number, page: number) {
	"use server";
	const { data } = await GetFromDatabase({
		tableName: "Post",
		filters: [
			{ method: "eq", column: "forum_id", value: fixedId },
			{ method: "range", from: page * 10, to: (page + 1) * 10 - 1 },
		],
	});
	return data || [];
}
// Usage: <InfiniteList loadMoreAction={loadMore.bind(null, forumId)} />
```

## UI Components

From `components/ui-custom/`: `Button`, `Input`, `Label`, `Textarea`, `Card`, `Dialog`, `Sheet`, `Badge`, `Avatar`, `Skeleton`, `Separator`  
Typography: `H1`, `H2`, `H3`, `H4`, `B1` from `typography.tsx`

## Quick Reference

**Types**: `IOffer`, `IPetition`, `IForum`, `IBusiness`, `IUser`, `IProduct`, `IComment`  
**Auth**: `getUserUuid()` from `@/lib/services/user`  
**i18n**: `getTranslations({ locale, namespace })` in server components  
**Images**: `<Image src="/placeholder.png" alt="..." fill unoptimized />`  
**Styling**: `<div className={cn("base", condition && "active")}>`  
**Constants**: `OFFERS_PAGE_SIZE = 5`, `DEFAULT_LOCALE = "en"` in `lib/constants.ts`  
**Files**: `page.tsx`, `page-services.ts`, `loading.tsx`, `error.tsx`, `layout.tsx`

## Forms Checklist

1. `"use client"` directive
2. Controlled inputs with `useState`
3. `isSubmitting` state
4. `disabled={isSubmitting}` on inputs/buttons
5. Try/catch with `toast.error()`
6. `<Label>` for accessibility
