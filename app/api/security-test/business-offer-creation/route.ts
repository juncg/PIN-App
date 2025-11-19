import { NextRequest, NextResponse } from "next/server";
import { PostToDatabase, GetFromDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { Tables } from "@/database.types";

export async function POST(request: NextRequest) {
    try {
        const currentUserId = await getUserUuid();

        if (!currentUserId) {
            return NextResponse.json({
                canCreate: false,
                message: "❌ User not authenticated - cannot run test",
                error: "Please log in to run security tests",
            }, { status: 401 });
        }

        // Check if user is associated with a business (either as employee or owner)
        const { data: businessEmployees } = await GetFromDatabase({
            tableName: "Business_Employee",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: currentUserId },
            ],
        });

        const { data: ownedBusinesses } = await GetFromDatabase({
            tableName: "Business",
            select: "*",
            filters: [
                { method: "eq", column: "owner_id", value: currentUserId },
            ],
        });

        const isBusinessUser = (businessEmployees && businessEmployees.length > 0) || 
                              (ownedBusinesses && ownedBusinesses.length > 0);

        if (!isBusinessUser) {
            return NextResponse.json({
                canCreate: false,
                message: "⚠️ Test requires business association",
                requiresSetup: true,
                details: "User must be either a business employee or business owner to create offers. Please associate this user with a business first.",
            }, { status: 400 });
        }

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
                message: "❌ No forums available for testing",
                requiresSetup: true,
                validationPassed: false,
            }, { status: 400 });
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

        const offerWasCreated = !error && createdOffer && createdOffer.length > 0;

        // Clean up if offer was created
        let cleanupFailed = false;
        if (offerWasCreated) {
            const offerId = (createdOffer[0] as any).id;
            if (offerId) {
                // Try to soft delete by setting state to Cancelled
                // This might fail if RLS blocks it, but that's okay for test cleanup
                const cleanupResult = await PutToDatabase({
                    tableName: "Offer",
                    contentJson: { state: "Cancelled" },
                    filters: [
                        { method: "eq", column: "id", value: offerId }
                    ],
                }).catch((err) => {
                    cleanupFailed = true;
                    return { error: err };
                });
            }
        }

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
                    ? "❌ Business user blocked from creating offers (RLS issue)"
                    : "❌ SECURITY ISSUE: Non-business user can create offers",
            currentUserId,
            error: error?.message,
            details: {
                businessEmployee: businessEmployees?.length || 0,
                ownedBusinesses: ownedBusinesses?.length || 0,
                offerCreated: offerWasCreated,
                creationError: error?.message,
                cleanupStatus: cleanupFailed 
                    ? "⚠️ Test offer cleanup failed (may need manual deletion)" 
                    : offerWasCreated 
                    ? "✅ Test offer cleaned up successfully" 
                    : "N/A - No offer was created",
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                canCreate: false,
                message: "❌ Test execution failed",
                error: String(error),
            },
            { status: 500 }
        );
    }
}