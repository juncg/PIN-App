import { PostToDatabase, GetFromDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { NextResponse } from "next/server";
import { Tables } from "@/database.types";

export async function POST() {
    try {
        const currentUserId = await getUserUuid();

        if (!currentUserId) {
            return NextResponse.json({
                canTamper: false,
                message: "Not authenticated",
            });
        }

        // Get an existing petition to try to duplicate
        const { data: existingPetitions } = await GetFromDatabase<Tables<"User_Petition">>({
            tableName: "User_Petition",
            select: "user_id, petition_id, created_at",
            filters: [
                { method: "eq", column: "user_id", value: currentUserId },
                { method: "limit", value: 1 },
            ],
        });

        if (!existingPetitions || existingPetitions.length === 0) {
            return NextResponse.json({
                canTamper: false,
                message: "No existing petitions to test with - create one first",
                requiresSetup: true,
            });
        }

        const existingRecord = existingPetitions[0];
        const fakeTimestamp = "2020-01-01T00:00:00.000Z"; // Try to set past date

        // Test 1: Try to create with tampered created_at
        const { data: tamperedCreatedAt, error: error1 } = await PostToDatabase<
            Tables<"User_Petition">
        >({
            tableName: "User_Petition",
            contentJson: [
                {
                    user_id: currentUserId,
                    petition_id: 999999, // Non-existent petition
                    subscribed: true,
                    created_at: fakeTimestamp, // Try to tamper with timestamp
                },
            ],
        });

        // Test 2: Try to create duplicate (same user_id + petition_id)
        const { data: duplicateAttempt, error: error2 } = await PostToDatabase<
            Tables<"User_Petition">
        >({
            tableName: "User_Petition",
            contentJson: [
                {
                    user_id: existingRecord.user_id,
                    petition_id: existingRecord.petition_id,
                    subscribed: true,
                },
            ],
        });

        // Test 3: Try to create for another user
        const fakeUserId = "00000000-0000-0000-0000-000000000001";
        const { data: otherUserAttempt, error: error3 } = await PostToDatabase<
            Tables<"User_Petition">
        >({
            tableName: "User_Petition",
            contentJson: [
                {
                    user_id: fakeUserId,
                    petition_id: 1,
                    subscribed: true,
                },
            ],
        });

        // Check if any tampering succeeded
        const createdAtTampered =
            tamperedCreatedAt &&
            tamperedCreatedAt.length > 0 &&
            new Date(tamperedCreatedAt[0].created_at).getTime() ===
                new Date(fakeTimestamp).getTime();

        const duplicateCreated = duplicateAttempt && duplicateAttempt.length > 0 && !error2;

        const createdForOtherUser = otherUserAttempt && otherUserAttempt.length > 0 && !error3;

        const anyTamperingSucceeded =
            createdAtTampered || duplicateCreated || createdForOtherUser;

        // Cleanup: Delete test records if created
        if (tamperedCreatedAt && tamperedCreatedAt.length > 0) {
            await PostToDatabase({
                tableName: "User_Petition",
                contentJson: [
                    {
                        user_id: currentUserId,
                        petition_id: 999999,
                        subscribed: false,
                    },
                ],
            }).then(() => {
                // Soft delete by setting subscribed = false
            });
        }

        return NextResponse.json({
            canTamper: anyTamperingSucceeded,
            message: anyTamperingSucceeded
                ? "⚠️ Creation tampering possible"
                : "✅ Creation properly validated",
            tests: {
                createdAtTampering: {
                    attempted: true,
                    succeeded: createdAtTampered,
                    message: createdAtTampered
                        ? "Tampered created_at was accepted"
                        : "created_at ignored or overridden by database",
                    error: error1?.message,
                },
                duplicateCreation: {
                    attempted: true,
                    succeeded: duplicateCreated,
                    message: duplicateCreated
                        ? "Duplicate record created (no unique constraint)"
                        : "Duplicate blocked by constraints",
                    error: error2?.message,
                },
                otherUserCreation: {
                    attempted: true,
                    succeeded: createdForOtherUser,
                    message: createdForOtherUser
                        ? "Created record for another user"
                        : "Cannot create records for other users",
                    error: error3?.message,
                },
            },
            currentUserId,
        });
    } catch (error) {
        return NextResponse.json({
            canTamper: false,
            message: "Creation properly blocked",
            error: String(error),
        });
    }
}