import { NextRequest, NextResponse } from "next/server";
import { PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { Tables } from "@/database.types";

export async function POST(request: NextRequest) {
    try {
        const { target_date } = await request.json();
        const userUuid = await getUserUuid();

        if (!userUuid) {
            return NextResponse.json({
                canCreate: false,
                message: "User not authenticated",
            });
        }

        // Attempt to create an offer with a past target date
        const result = await PostToDatabase({
            tableName: "Offer",
            contentJson: [
                {
                    creator_id: userUuid,
                    title: "Security Test - Past Date",
                    text: "This should be blocked by database constraints",
                    target_completition_date: target_date,
                    state: "Posted",
                    fee: 0,
                    forum_id: 1,
                    current_progress: 0,
                    likes: 0,
                    superlikes: 0,
                    target_progress: 100,
                    comment_locked_state: "Unlocked",
                },
            ],
        });

        // If no error, the validation failed (bad)
        if (!result.error && result.data) {
            const createdOffers = result.data as unknown as Tables<"Offer">[];
            const createdOffer = createdOffers[0];

            // Clean up the test data using PutToDatabase
            if (createdOffer?.id) {
                await PutToDatabase({
                    tableName: "Offer",
                    contentJson: { deleted_at: new Date().toISOString() },
                    filters: [
                        { method: "eq", column: "id", value: createdOffer.id }
                    ],
                });
            }

            return NextResponse.json({
                canCreate: true,
                message: "Validation failed - offer was created with past date",
            });
        }

        // If there's an error about the date, validation passed (good)
        if (result.error) {
            const errorMessage = result.error.message.toLowerCase();
            if (
                errorMessage.includes("target_completition_date") ||
                errorMessage.includes("target_date") ||
                errorMessage.includes("future") ||
                errorMessage.includes("past") ||
                errorMessage.includes("check constraint")
            ) {
                return NextResponse.json({
                    canCreate: false,
                    message: "Validation passed - database rejected past date",
                });
            }

            // Some other error occurred
            return NextResponse.json({
                canCreate: false,
                message: `Unexpected error: ${result.error.message}`,
            });
        }

        return NextResponse.json({
            canCreate: false,
            message: "Unexpected response from database",
        });
    } catch (error) {
        return NextResponse.json(
            {
                canCreate: false,
                message: "Test execution failed",
                error: String(error),
            },
            { status: 500 }
        );
    }
}