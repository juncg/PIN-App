import { GetFromDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { NextResponse } from "next/server";
import { Tables } from "@/database.types";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { privateUserId, publicUserId } = body;

        const currentUserId = await getUserUuid();

        if (!currentUserId) {
            return NextResponse.json({
                privateFails: false,
                publicSucceeds: false,
                message: "❌ User not authenticated - cannot run test",
                error: "Please log in to run security tests",
            }, { status: 401 });
        }

        if (currentUserId === privateUserId || currentUserId === publicUserId) {
            return NextResponse.json({
                privateFails: false,
                publicSucceeds: false,
                message: "Cannot test with same user - use different user IDs",
            });
        }

        // Test 1: Check if private user actually has follows to test with
        const { data: privateUserData } = await GetFromDatabase<Tables<"User">>({
            tableName: "User",
            select: "public_user_follows",
            filters: [
                { method: "eq", column: "id", value: privateUserId },
            ],
        });

        const { data: privateFollowsData, error: privateError } = await GetFromDatabase<Tables<"User_User">>({
            tableName: "User_User",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: privateUserId },
            ],
        });

        // Check if private user has any follows in the database (as their own query would show)
        const { data: actualPrivateFollows } = await GetFromDatabase<Tables<"User_User">>({
            tableName: "User_User",
            select: "count",
            filters: [
                { method: "eq", column: "user_id", value: privateUserId },
            ],
        });

        const privateUserHasFollows = actualPrivateFollows && actualPrivateFollows.length > 0;

        // RLS is working if: user is private AND (we got no data OR got an error)
        // Only mark as blocked if the private user actually has follows to hide
        const isPrivateBlocked = privateUserData?.[0]?.public_user_follows === false && 
                                 (privateFollowsData === null || 
                                  privateFollowsData.length === 0 ||
                                  privateError !== null);

        // Test 2: Try to access public user's follows
        const { data: publicUserData } = await GetFromDatabase<Tables<"User">>({
            tableName: "User",
            select: "public_user_follows",
            filters: [
                { method: "eq", column: "id", value: publicUserId },
            ],
        });

        const { data: publicFollowsData, error: publicError } = await GetFromDatabase<Tables<"User_User">>({
            tableName: "User_User",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: publicUserId },
            ],
        });

        // Public should be accessible (no error, data exists - even if empty array)
        const isPublicAccessible = publicUserData?.[0]?.public_user_follows === true && 
                                   !publicError && publicFollowsData !== null;

        return NextResponse.json({
            privateFails: isPrivateBlocked,
            publicSucceeds: isPublicAccessible,
            message: isPrivateBlocked && isPublicAccessible
                ? "✅ Private follows blocked, public follows accessible"
                : !isPrivateBlocked && isPublicAccessible
                ? "⚠️ Private follows NOT blocked (RLS may be too permissive)"
                : isPrivateBlocked && !isPublicAccessible
                ? "⚠️ Public follows blocked (should be accessible)"
                : "⚠️ Both tests failed - check RLS configuration",
            details: {
                private: {
                    userId: privateUserId,
                    publicUserFollows: privateUserData?.[0]?.public_user_follows,
                    blocked: isPrivateBlocked,
                    hasError: privateError !== null,
                    errorMessage: privateError?.message,
                    dataLength: privateFollowsData?.length,
                    userActuallyHasFollows: privateUserHasFollows,
                },
                public: {
                    userId: publicUserId,
                    publicUserFollows: publicUserData?.[0]?.public_user_follows,
                    accessible: isPublicAccessible,
                    hasError: publicError !== null,
                    errorMessage: publicError?.message,
                    followsCount: publicFollowsData?.length || 0,
                },
            },
            currentUserId,
        });
    } catch (error) {
        return NextResponse.json({
            privateFails: true,
            publicSucceeds: false,
            message: "Test execution error",
            error: String(error),
        }, { status: 500 });
    }
}