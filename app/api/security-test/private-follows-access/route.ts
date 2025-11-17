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

        // Validate user privacy settings FIRST
        const { data: privateUserData } = await GetFromDatabase<Tables<"User">>({
            tableName: "User",
            select: "public_user_follows",
            filters: [
                { method: "eq", column: "id", value: privateUserId },
            ],
        });

        const { data: publicUserData } = await GetFromDatabase<Tables<"User">>({
            tableName: "User",
            select: "public_user_follows",
            filters: [
                { method: "eq", column: "id", value: publicUserId },
            ],
        });

        // Check if users exist
        if (!privateUserData?.[0]) {
            return NextResponse.json({
                privateFails: false,
                publicSucceeds: false,
                message: "❌ Private user ID not found - please use a valid user ID",
                error: `User ${privateUserId} does not exist`,
            }, { status: 400 });
        }

        if (!publicUserData?.[0]) {
            return NextResponse.json({
                privateFails: false,
                publicSucceeds: false,
                message: "❌ Public user ID not found - please use a valid user ID",
                error: `User ${publicUserId} does not exist`,
            }, { status: 400 });
        }

        // Check if privacy settings match expectations
        const privateUserIsActuallyPrivate = privateUserData[0].public_user_follows === false;
        const publicUserIsActuallyPublic = publicUserData[0].public_user_follows === true;

        if (!privateUserIsActuallyPrivate) {
            return NextResponse.json({
                privateFails: false,
                publicSucceeds: false,
                message: "❌ The 'private' user has public_user_follows = true",
                error: "Please select a user with public_user_follows set to false, or update this user's privacy settings",
                details: {
                    privateUserId,
                    currentSetting: privateUserData[0].public_user_follows,
                    expectedSetting: false,
                },
            }, { status: 400 });
        }

        if (!publicUserIsActuallyPublic) {
            return NextResponse.json({
                privateFails: false,
                publicSucceeds: false,
                message: "❌ The 'public' user has public_user_follows = false",
                error: "Please select a user with public_user_follows set to true, or update this user's privacy settings",
                details: {
                    publicUserId,
                    currentSetting: publicUserData[0].public_user_follows,
                    expectedSetting: true,
                },
            }, { status: 400 });
        }

        // Now run the actual tests
        const { data: privateFollowsData, error: privateError } = await GetFromDatabase<Tables<"User_User">>({
            tableName: "User_User",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: privateUserId },
            ],
        });

        // Check if private user has any follows in the database
        const { data: actualPrivateFollows } = await GetFromDatabase<Tables<"User_User">>({
            tableName: "User_User",
            select: "count",
            filters: [
                { method: "eq", column: "user_id", value: privateUserId },
            ],
        });

        const privateUserHasFollows = actualPrivateFollows && actualPrivateFollows.length > 0;

        // RLS is working if: we got no data OR got an error
        const isPrivateBlocked = privateFollowsData === null || 
                                 privateFollowsData.length === 0 ||
                                 privateError !== null;

        // Test public user's follows
        const { data: publicFollowsData, error: publicError } = await GetFromDatabase<Tables<"User_User">>({
            tableName: "User_User",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: publicUserId },
            ],
        });

        // Public should be accessible (no error, data exists - even if empty array)
        const isPublicAccessible = !publicError && publicFollowsData !== null;

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
                    publicUserFollows: privateUserData[0].public_user_follows,
                    blocked: isPrivateBlocked,
                    hasError: privateError !== null,
                    errorMessage: privateError?.message,
                    dataLength: privateFollowsData?.length,
                    userActuallyHasFollows: privateUserHasFollows,
                },
                public: {
                    userId: publicUserId,
                    publicUserFollows: publicUserData[0].public_user_follows,
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