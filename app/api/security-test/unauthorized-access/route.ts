import { GetFromDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const currentUserId = await getUserUuid();

        // Try to access another user's petition subscriptions
        // Use a fake UUID that's definitely not ours
        const fakeUserId = "08e03277-f6d9-4792-ae23-5a8580ec3d48";

        const { data, error } = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: fakeUserId },
                { method: "limit", value: 1 },	// If even 1 record returns, RLS is broken
            ],
        });

        // If we can read another user's data, RLS is not configured properly
        const canAccessOthersData = data && data.length > 0;

        return NextResponse.json({
            canAccess: canAccessOthersData,
            message: canAccessOthersData
                ? "⚠️ Can access other users' data"
                : "✅ Cannot access other users' data",
            recordCount: data?.length || 0,
            currentUserId,
            attemptedUserId: fakeUserId,
        });
    } catch (error) {
        return NextResponse.json({
            canAccess: false,
            message: "Access blocked by error handling",
            error: String(error),
        });
    }
}