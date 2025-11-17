import { DeleteFromDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { petitionId, action } = body;

        const currentUserId = await getUserUuid();

        if (action === "delete") {
            // Try to delete a petition we don't own
            const { data, error } = await DeleteFromDatabase({
                tableName: "Petition",
                matchColumn: "id",
                matchValue: petitionId,
            });

            return NextResponse.json({
                canDelete: data && data.length > 0 && !error,
                message:
                    data && data.length > 0 ? "⚠️ Successfully deleted petition" : "✅ Delete blocked by RLS",
                currentUserId,
                error: error?.message,
            });
        }

        return NextResponse.json({
            canDelete: false,
            message: "Invalid action",
        });
    } catch (error) {
        return NextResponse.json({
            canDelete: false,
            message: "Action properly blocked",
            error: String(error),
        });
    }
}