import { PutToDatabase, GetFromDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { NextResponse } from "next/server";
import { Tables } from "@/database.types";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { petitionId } = body;

        const currentUserId = await getUserUuid();

        if (!currentUserId) {
            return NextResponse.json({
                canModifyTimestamp: false,
                message: "Not authenticated",
            });
        }

        // First, get the current record to see original created_at
        const { data: originalData } = await GetFromDatabase<Tables<"User_Petition">>({
            tableName: "User_Petition",
            select: "user_id, petition_id, created_at, subscribed",
            filters: [
                { method: "eq", column: "user_id", value: currentUserId },
                { method: "eq", column: "petition_id", value: petitionId },
                { method: "limit", value: 1 },
            ],
        });

        if (!originalData || originalData.length === 0) {
            return NextResponse.json({
                canModifyTimestamp: false,
                message: "User_Petition record not found for current user",
            });
        }

        const originalCreatedAt = originalData[0].created_at;
        const originalSubscribed = originalData[0].subscribed;
        
        // Generate random timestamp between 2020-01-01 and 2023-12-31
        const randomYear = 2020 + Math.floor(Math.random() * 4); // 2020-2023
        const randomMonth = Math.floor(Math.random() * 12); // 0-11
        const randomDay = 1 + Math.floor(Math.random() * 28); // 1-28 (safe for all months)
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        const randomSecond = Math.floor(Math.random() * 60);
        
        const fakeTimestamp = new Date(
            randomYear,
            randomMonth,
            randomDay,
            randomHour,
            randomMinute,
            randomSecond
        ).toISOString();

        // Try to update the created_at to a different date
        const { data, error } = await PutToDatabase<Tables<"User_Petition">>({
            tableName: "User_Petition",
            contentJson: {
                created_at: fakeTimestamp,
                subscribed: !originalSubscribed,
            },
            filters: [
                { method: "eq", column: "user_id", value: currentUserId },
                { method: "eq", column: "petition_id", value: petitionId },
            ],
        });

        // Check if created_at was actually modified
        const { data: updatedData } = await GetFromDatabase<Tables<"User_Petition">>({
            tableName: "User_Petition",
            select: "created_at, subscribed",
            filters: [
                { method: "eq", column: "user_id", value: currentUserId },
                { method: "eq", column: "petition_id", value: petitionId },
                { method: "limit", value: 1 },
            ],
        });

        if (!updatedData || updatedData.length === 0) {
            return NextResponse.json({
                canModifyTimestamp: false,
                message: "Record disappeared after update attempt",
            });
        }

        const timestampWasModified =
            new Date(updatedData[0].created_at).getTime() !==
            new Date(originalCreatedAt).getTime();

        const otherFieldUpdated = updatedData[0].subscribed !== originalSubscribed;

        return NextResponse.json({
            canModifyTimestamp: timestampWasModified,
            message: timestampWasModified
                ? "⚠️ created_at was modified - immutability not enforced"
                : "✅ created_at remains unchanged - properly protected",
            originalCreatedAt,
            attemptedTimestamp: fakeTimestamp,
            finalTimestamp: updatedData[0].created_at,
            otherFieldUpdated,
            currentUserId,
            petitionId,
            error: error?.message,
        });
    } catch (error) {
        return NextResponse.json({
            canModifyTimestamp: false,
            message: "Update blocked or failed",
            error: String(error),
        });
    }
}