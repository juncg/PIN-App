import { GetFromDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { NextResponse } from "next/server";
import { Tables } from "@/database.types";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { targetPetitionId, targetOfferId } = body;

        const currentUserId = await getUserUuid();

        if (!currentUserId) {
            return NextResponse.json({
                canUpdate: false,
                message: "User not authenticated",
            });
        }

        const results = {
            petition: null as any,
            offer: null as any,
        };

        // Test Petition liked update
        if (targetPetitionId) {
            const { data: petitionData } = await GetFromDatabase<Tables<"User_Petition">>({
                tableName: "User_Petition",
                select: "liked",
                filters: [
                    { method: "eq", column: "petition_id", value: targetPetitionId },
                    { method: "eq", column: "user_id", value: currentUserId },
                ],
            });

            if (petitionData && petitionData.length > 0) {
                const currentLikedState = petitionData[0].liked;
                const newLikedState = !currentLikedState;

                const { data, error } = await PutToDatabase({
                    tableName: "User_Petition",
                    contentJson: { liked: newLikedState },
                    filters: [
                        { method: "eq", column: "petition_id", value: targetPetitionId },
                        { method: "eq", column: "user_id", value: currentUserId },
                    ],
                });

                const canUpdate = data && data.length > 0 && !error;
                results.petition = {
                    canUpdate,
                    currentLikedState,
                    attemptedUpdate: newLikedState,
                    error: error?.message,
                };
            } else {
                results.petition = {
                    canUpdate: false,
                    error: "User_Petition record not found",
                };
            }
        }

        // Test Offer liked update
        if (targetOfferId) {
            const { data: offerData } = await GetFromDatabase<Tables<"User_Offer">>({
                tableName: "User_Offer",
                select: "liked",
                filters: [
                    { method: "eq", column: "offer_id", value: targetOfferId },
                    { method: "eq", column: "user_id", value: currentUserId },
                ],
            });

            if (offerData && offerData.length > 0) {
                const currentLikedState = offerData[0].liked;
                const newLikedState = !currentLikedState;

                const { data, error } = await PutToDatabase({
                    tableName: "User_Offer",
                    contentJson: { liked: newLikedState },
                    filters: [
                        { method: "eq", column: "offer_id", value: targetOfferId },
                        { method: "eq", column: "user_id", value: currentUserId },
                    ],
                });

                const canUpdate = data && data.length > 0 && !error;
                results.offer = {
                    canUpdate,
                    currentLikedState,
                    attemptedUpdate: newLikedState,
                    error: error?.message,
                };
            } else {
                results.offer = {
                    canUpdate: false,
                    error: "User_Offer record not found",
                };
            }
        }

        const anyCanUpdate = results.petition?.canUpdate || results.offer?.canUpdate;
        const bothBlocked = !results.petition?.canUpdate && !results.offer?.canUpdate;

        return NextResponse.json({
            canUpdate: anyCanUpdate,
            message: bothBlocked
                ? "✅ Manual liked state updates blocked by RLS - must use toggle_liked RPC"
                : "⚠️ Successfully updated liked state manually (RLS may be too permissive)",
            currentUserId,
            results,
        });
    } catch (error) {
        return NextResponse.json({
            canUpdate: false,
            message: "Manual update properly blocked",
            error: String(error),
        });
    }
}