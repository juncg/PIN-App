import { NextRequest, NextResponse } from "next/server";
import { PostToDatabase, GetFromDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { Tables } from "@/database.types";

export async function POST(request: NextRequest) {
    try {
        const currentUserId = await getUserUuid();

        if (!currentUserId) {
            return NextResponse.json({
                canCreate: false,
                message: "User not authenticated",
            });
        }

        // Check if user is connected to any business
        const { data: userBusinesses } = await GetFromDatabase<Tables<"User_Business">>({
            tableName: "User_Business",
            select: "business_id",
            filters: [
                { method: "eq", column: "user_id", value: currentUserId },
            ],
        });

        const isBusinessUser = userBusinesses && userBusinesses.length > 0;

        // Get a valid forum_id for testing
        const { data: forums } = await GetFromDatabase<Tables<"Forum">>({
            tableName: "Forum",
            select: "id",
            filters: [
                { method: "limit", value: 1 },
            ],
        });

        const forumId = forums?.[0]?.id;

        if (!forumId) {
            return NextResponse.json({
                canCreate: false,
                message: "No forums available for testing",
                requiresSetup: true,
            });
        }

        // Attempt to create an offer
        const testOffer = {
            creator_id: currentUserId,
            title: "Security Test - Business User Check",
            text: "Testing business user offer creation",
            target_completition_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            state: "Posted" as const,
            fee: 10,
            forum_id: forumId,
            current_progress: 0,
            likes: 0,
            superlikes: 0,
            target_progress: 100,
            comment_locked_state: "Unlocked" as const,
        };

        const { data: createdOffer, error } = await PostToDatabase({
            tableName: "Offer",
            contentJson: [testOffer],
        });

        // Clean up if offer was created
        if (createdOffer && createdOffer.length > 0) {
            const offerId = (createdOffer[0] as any).id;
            if (offerId) {
                // Soft delete by updating deleted_at or state
                await PostToDatabase({
                    tableName: "Offer",
                    contentJson: { state: "Draft" },
                    filters: [
                        { method: "eq", column: "id", value: offerId }
                    ],
                });
            }
        }

        const offerWasCreated = !error && createdOffer && createdOffer.length > 0;

        // If user is a business user, creation should succeed
        // If user is NOT a business user, creation should fail
        const validationPassed = isBusinessUser ? offerWasCreated : !offerWasCreated;

        return NextResponse.json({
            canCreate: offerWasCreated,
            isBusinessUser,
            validationPassed,
            message: validationPassed
                ? isBusinessUser
                    ? "✅ Business user can create offers"
                    : "✅ Non-business user blocked from creating offers"
                : isBusinessUser
                    ? "⚠️ Business user blocked from creating offers"
                    : "⚠️ Non-business user can create offers (security issue)",
            currentUserId,
            error: error?.message,
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