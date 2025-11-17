import { PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { targetPetitionId } = body;

        const currentUserId = await getUserUuid();

        // Try to update another user's petition subscription
        // Attempt to subscribe to a petition we don't own the subscription for
        const fakeUserId = "08e03277-f6d9-4792-ae23-5a8580ec3d48";

        const { data, error } = await PutToDatabase({
            tableName: "User_Petition",
            contentJson: { subscribed: true },
            filters: [
                { method: "eq", column: "petition_id", value: targetPetitionId },
                { method: "eq", column: "user_id", value: fakeUserId },
            ],
        });

        // Should fail if RLS is working - can't update other users' subscriptions
        const canUpdateOthersData = data && data.length > 0 && !error;

        return NextResponse.json({
            canUpdate: canUpdateOthersData,
            message: canUpdateOthersData
                ? "⚠️ Successfully updated another user's petition subscription"
                : "✅ Update blocked by RLS",
            currentUserId,
            attemptedUserId: fakeUserId,
            targetPetitionId,
            error: error?.message,
        });
    } catch (error) {
        return NextResponse.json({
            canUpdate: false,
            message: "Update properly blocked",
            error: String(error),
        });
    }
}