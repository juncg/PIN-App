# GitHub Copilot Instructions for PIN-App Project

You are an AI assistant helping developers work on **PIN-App**, a Next.js-based platform that connects users and businesses through petitions (requests) and offers. This is a full-stack TypeScript application using Supabase for backend services.

## Project Architecture

### Core Technologies

-   **Framework**: Next.js 14+ with App Router
-   **Language**: TypeScript
-   **Database**: Supabase (PostgreSQL)
-   **Styling**: Tailwind CSS with shadcn/ui components
-   **Internationalization**: next-intl
-   **State Management**: React hooks and server components
-   **Authentication**: Supabase Auth

### Key Directory Structure

```
app/              # Next.js App Router pages and layouts
components/       # Reusable React components
  ui/             # shadcn/ui base components (shouldn't be used for anything but for creating ui-custom components)
  ui-custom/	  # Actual modified components
  cards/         # Card components for entities
  forms/         # Form components with validation
  buttons/       # Action buttons
  dialogs/       # Modal dialogs
lib/             # Utility functions and service layer
  services/      # Database service functions
  constants.ts   # App-wide constants
hooks/           # Custom React hooks
translations/    # i18n translation files (en.json, es.json)
```

## Code Style Guidelines

### Component Patterns

#### Server Components (Default)

Use server components by default for better performance. Only add `"use client"` when you need:

-   Browser APIs (window, localStorage)
-   React hooks (useState, useEffect, useContext)
-   Event handlers (onClick, onChange)
-   Third-party libraries that require client-side

```typescript
// app/example/page.tsx
import { GetFromDatabase } from "@/lib/services/general";
import { IExample } from "@/lib/services/types";

export default async function ExamplePage() {
	const { data } = await GetFromDatabase<IExample>({
		tableName: "Example",
		select: "*",
		filters: [{ method: "eq", column: "active", value: true }],
	});

	return <div>{/* render data */}</div>;
}
```

#### Client Components

```typescript
// components/example-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui-custom/button";

export function ExampleForm() {
	const [value, setValue] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			// Submit logic
		} finally {
			setIsSubmitting(false);
		}
	};

	return <form onSubmit={handleSubmit}>{/* form content */}</form>;
}
```

### Database Operations

**ALWAYS** use the service layer functions from `lib/services/general.ts`:

#### Reading Data

```typescript
import { GetFromDatabase } from "@/lib/services/general";

const { data, error } = await GetFromDatabase<IType>({
	tableName: "TableName",
	select: "*, RelatedTable(column1, column2)",
	filters: [
		{ method: "eq", column: "id", value: 123 },
		{ method: "range", from: 0, to: 9 },
	],
});
```

#### Creating Data

```typescript
import { PostToDatabase } from "@/lib/services/general";

const { data, error } = await PostToDatabase({
	tableName: "TableName",
	contentJson: [{ field1: "value1", field2: "value2" }],
});
```

#### Updating Data

```typescript
import { PutToDatabase } from "@/lib/services/general";

const { data, error } = await PutToDatabase({
	tableName: "TableName",
	contentJson: { field1: "newValue" },
	matchColumn: "id",
	matchValue: 123,
});
```

#### RPC Functions

```typescript
import { ExecuteRpcFunction } from "@/lib/services/general";

const { data, error } = await ExecuteRpcFunction({
	functionName: "function_name",
	params: { param1: "value1" },
});
```

### Database Schema Important Notes

#### Forum-Post Relationships

-   **Offers** have `forum_id` (direct foreign key to Forum)
-   **Petitions** have `forum_id` (direct foreign key to Forum)
-   **Forums** have `business_id` (belong to a Business)
-   **DO NOT** look for `Business_Offer` or `Business_Petition` tables (they don't exist)
-   Get business info through: `Offer/Petition → forum_id → Forum → business_id → Business`

#### Key Tables

-   `User` - User accounts
-   `Business` - Company profiles
-   `Forum` - Discussion forums (belong to businesses)
-   `Offer` - Business offers with fees
-   `Petition` - User petitions/requests
-   `Product` - Products for sale
-   `Review` - Product reviews
-   `Comment` - Comments on posts

### Type System

All database types are defined in `database.types.ts` (auto-generated from Supabase).

Extended types in `lib/services/types.ts`:

```typescript
import { Tables } from "@/database.types";

export type IOffer = Tables<"Offer"> & {
	type: "Offer";
	businesses?: { business: Tables<"Business"> }[];
	tags?: Tables<"Tag">[];
	User_Offer?: Tables<"User_Offer">[];
};

export type IPetition = Tables<"Petition"> & {
	type: "Petition";
	businesses?: { business: Tables<"Business"> }[];
	tags?: Tables<"Tag">[];
	User_Petition?: Tables<"User_Petition">[];
};

export type IForum = Tables<"Forum"> & {
	Business?: Tables<"Business">;
	Forum_Tag?: { Tag: Tables<"Tag"> }[];
	Forum_User?: { forum_id: number; user_id: string }[];
};
```

Use `TPost` for union types: `type TPost = IOffer | IPetition;`

### Server Actions

Server actions must be marked with `"use server"` and should be in separate files or exported functions:

```typescript
// app/example/actions.ts
"use server";

export async function createExample(formData: FormData) {
	const data = {
		field: formData.get("field") as string,
	};

	const result = await PostToDatabase({
		tableName: "Example",
		contentJson: [data],
	});

	return result;
}
```

For infinite scroll patterns:

```typescript
// app/forums/[id]/page-services.ts
export async function loadMoreForumPosts(forumId: number, page: number, pageSize: number) {
	"use server";
	// fetch and return posts
}

// In component: use .bind() to pass fixed parameters
<InfinitePostList loadMoreAction={loadMoreForumPosts.bind(null, forumId)} />;
```

### UI Components (shadcn/ui)

Always use existing components from `components/ui-custom/`:

-   `Button`, `Input`, `Label`, `Textarea` - Form elements
-   `Card`, `CardHeader`, `CardContent` - Containers
-   `Dialog`, `Sheet`, `Popover` - Overlays
-   `Badge`, `Separator`, `Avatar` - UI elements
-   `H1`, `H2`, `H3`, `H4`, `B1` - Typography from `typography.tsx`

```typescript
import { Button } from "@/components/ui-custom/button";
import { Card } from "@/components/ui-custom/card";
import { H1, B1 } from "@/components/ui-custom/typography";

<Card className="p-6">
	<H1>Title</H1>
	<B1 className="text-lightgrey">Description</B1>
	<Button>Action</Button>
</Card>;
```

### Forms

1. **Client component** with `"use client"`
2. **Controlled inputs** with `useState`
3. **Loading state** with `isSubmitting`
4. **Validation** with Zod schemas in `components/forms/schemas/`
5. **Labels** for accessibility

```typescript
"use client";

import { useState } from "react";
import { Label } from "@/components/ui-custom/label";
import { Input } from "@/components/ui-custom/input";
import { Button } from "@/components/ui-custom/button";
import { toast } from "sonner";

export function ExampleForm() {
	const [title, setTitle] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const result = await PostToDatabase({
				tableName: "Example",
				contentJson: [{ title }],
			});

			if (result.error) throw new Error(result.error.message);

			toast.success("Created successfully!");
			setTitle("");
		} catch (error) {
			toast.error("Error creating");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={isSubmitting}
					required
				/>
			</div>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Creating..." : "Create"}
			</Button>
		</form>
	);
}
```

### Authentication

```typescript
import { getUserUuid } from "@/lib/services/user";

// In server component
const userUuid = await getUserUuid();

if (!userUuid) {
	// Redirect or show login prompt
}
```

Use `NotLoggedInDialog` for client-side auth prompts:

```typescript
import { NotLoggedInDialog } from "@/components/dialogs/not-logged-in-dialog";
```

### Internationalization

```typescript
// Server component
import { getTranslations } from "next-intl/server";

const t = await getTranslations({
	locale: params.locale || "es",
	namespace: "home",
});

<H1>{t("title")}</H1>;
```

Translation files: `translations/en.json` and `translations/es.json`

### Infinite Scrolling

```typescript
import { InfinitePostList } from "@/components/posts/infinite-post-list";

<InfinitePostList
	initialPosts={posts}
	loadMoreAction={loadMorePosts.bind(null, forumId)}
	pageSize={10}
	maxPosts={50}
/>;
```

Constants for page sizes in `lib/constants.ts`:

```typescript
export const FORUMS_PAGE_SIZE = 10;
export const FORUMS_MAX_POSTS = 50;
```

### Styling

Use `cn()` utility for conditional classes:

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
    "base-class",
    isActive && "active-class",
    className
)}>
```

Tailwind responsive design (mobile-first):

```typescript
<div className="flex flex-col md:flex-row lg:grid-cols-3">
```

### Images

Always use Next.js `Image` component:

```typescript
import Image from "next/image";

<Image
	src={imageUrl || "/placeholder.png"}
	alt="Description"
	fill
	className="object-cover"
	unoptimized // Use when external URLs
/>;
```

Default images:

-   Profile: `/jancarlo.jpg`
-   Placeholder: `/placeholder.png`

## Common Patterns

### Page Structure

```typescript
// app/example/page.tsx
import { ComponentA } from "@/components/...";

interface ExamplePageProps {
	params: Promise<{ id: number }>;
	searchParams: Promise<ISearchParams>;
}

export default async function ExamplePage({ params, searchParams }: ExamplePageProps) {
	const { id } = await params;
	const data = await fetchData(id);

	return (
		<div className="container mx-auto px-4 py-8">
			<ComponentA data={data} />
		</div>
	);
}
```

### Service Layer (page-services.ts)

```typescript
// app/example/page-services.ts
import { GetFromDatabase } from "@/lib/services/general";
import { IExample } from "@/lib/services/types";

export async function ExampleService(id: number) {
	const { data, error } = await GetFromDatabase<IExample>({
		tableName: "Example",
		select: "*, RelatedTable(*)",
		filters: [{ method: "eq", column: "id", value: id }],
	});

	return { example: data, error };
}
```

### Error Handling

```typescript
try {
    const result = await GetFromDatabase({...});

    if (result.error) {
        throw new Error(result.error.message);
    }

    // Use result.data
} catch (error) {
    console.error("Error:", error);
    toast.error("Something went wrong");
}
```

### Loading States

```typescript
import { Skeleton } from "@/components/ui-custom/skeleton";

{
	isLoading ? <Skeleton className="h-32 w-full" /> : <Content />;
}
```

### Empty States

```typescript
import { Card } from "@/components/ui-custom/card";
import { H3, B1 } from "@/components/ui-custom/typography";

{
	items.length === 0 ? (
		<Card className="p-12 text-center">
			<H3 className="mb-2">No items found</H3>
			<B1 className="text-lightgrey">Try creating a new item</B1>
		</Card>
	) : (
		<ItemsList items={items} />
	);
}
```

## Important Rules

### DO:

✅ Use server components by default
✅ Use service layer for all database operations
✅ Type all data with interfaces from `lib/services/types.ts`
✅ Include loading and error states in interactive components
✅ Use existing UI components from `components/ui-custom/`
✅ Mark server actions with `"use server"`
✅ Use `cn()` for conditional classNames
✅ Use Next.js `Image` component for images
✅ Include accessibility attributes (labels, alt text)
✅ Handle async operations with try/catch
✅ Use `.bind(null, fixedParam)` for server actions with closures

### DON'T:

❌ Query Supabase directly in components
❌ Hardcode text (use translations)
❌ Use `"use client"` unnecessarily
❌ Create inline server actions in client components
❌ Forget loading/disabled states on forms
❌ Look for `Business_Offer` or `Business_Petition` tables (don't exist)
❌ Use `<img>` tag (use Next.js `Image`)
❌ Forget to await `params` and `searchParams` in pages

## File Naming Conventions

-   Components: `kebab-case.tsx` (e.g., `create-petition-form.tsx`)
-   Pages: `page.tsx` in route folders
-   Services: `page-services.ts` alongside pages
-   Layouts: `layout.tsx`
-   Loading: `loading.tsx`
-   Error: `error.tsx`

## Import Aliases

Use `@/` for absolute imports from project root:

```typescript
import { Button } from "@/components/ui-custom/button";
import { GetFromDatabase } from "@/lib/services/general";
import { IForum } from "@/lib/services/types";
```

## Constants

Define reusable values in `lib/constants.ts`:

```typescript
export const FORUMS_PAGE_SIZE = 10;
export const FORUMS_MAX_POSTS = 50;
export const BASE_DOMAIN = "https://example.com";
export const DEFAULT_LOCALE = "es";
```

## When Suggesting Code

1. **Check existing patterns** in similar files first
2. **Use existing types** from `lib/services/types.ts`
3. **Follow the service layer** - never query Supabase directly
4. **Prefer server components** unless client-side features are needed
5. **Include proper TypeScript types** for all props and return values
6. **Add loading states** for async operations
7. **Use existing UI components** instead of creating new ones
8. **Remember the database schema**: `Offer/Petition → forum_id → Forum → business_id → Business`
9. **Mark server actions** with `"use server"`
10. **Use translations** instead of hardcoded text

## Example: Complete Feature Implementation

```typescript
// 1. Type definition (lib/services/types.ts)
export type IExample = Tables<"Example"> & {
	related?: Tables<"Related">[];
};

// 2. Service layer (app/example/page-services.ts)
import { GetFromDatabase } from "@/lib/services/general";
import { IExample } from "@/lib/services/types";

export async function ExampleService(id: number) {
	"use server";

	const { data, error } = await GetFromDatabase<IExample>({
		tableName: "Example",
		select: "*, Related(*)",
		filters: [{ method: "eq", column: "id", value: id }],
	});

	return { example: data?.[0] || null, error };
}

export async function loadMoreExamples(page: number, pageSize: number) {
	"use server";

	const { data } = await GetFromDatabase<IExample>({
		tableName: "Example",
		select: "*",
		filters: [{ method: "range", from: page * pageSize, to: (page + 1) * pageSize - 1 }],
	});

	return data || [];
}

// 3. Page component (app/example/[id]/page.tsx)
import { ExampleService } from "./page-services";
import { H1, B1 } from "@/components/ui-custom/typography";
import { Card } from "@/components/ui-custom/card";

interface ExamplePageProps {
	params: Promise<{ id: number }>;
}

export default async function ExamplePage({ params }: ExamplePageProps) {
	const { id } = await params;
	const { example, error } = await ExampleService(id);

	if (!example) {
		return (
			<Card className="p-12 text-center">
				<H1>Not found</H1>
				<B1 className="text-lightgrey">Example does not exist</B1>
			</Card>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<H1>{example.title}</H1>
			<B1>{example.description}</B1>
		</div>
	);
}

// 4. Interactive component (components/example/example-form.tsx)
("use client");

import { useState } from "react";
import { Button } from "@/components/ui-custom/button";
import { Input } from "@/components/ui-custom/input";
import { Label } from "@/components/ui-custom/label";
import { toast } from "sonner";
import { PostToDatabase } from "@/lib/services/general";

export function ExampleForm() {
	const [title, setTitle] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const result = await PostToDatabase({
				tableName: "Example",
				contentJson: [{ title }],
			});

			if (result.error) throw new Error(result.error.message);

			toast.success("Created successfully!");
			setTitle("");
		} catch (error) {
			toast.error("Error creating example");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={isSubmitting}
					required
				/>
			</div>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Creating..." : "Create"}
			</Button>
		</form>
	);
}
```

---

**Remember**: This is a production application. Always prioritize type safety, error handling, accessibility, and following established patterns.
