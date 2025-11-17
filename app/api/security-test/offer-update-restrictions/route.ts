import { NextRequest, NextResponse } from "next/server";
import { GetFromDatabase, PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { Tables } from "@/database.types";

export async function POST(request: NextRequest) {
    try {
        const currentUserId = await getUserUuid();

        if (!currentUserId) {
            return NextResponse.json({
                canUpdate: false,
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

        if (!isBusinessUser) {
            return NextResponse.json({
                canUpdate: false,
                message: "❌ User is not connected to a business - cannot create test offer",
                requiresBusinessUser: true,
                allTestsPassed: false,
            });
        }

        // Get a valid forum for testing
        const { data: forums } = await GetFromDatabase<Tables<"Forum">>({
            tableName: "Forum",
            select: "id",
            filters: [{ method: "limit", value: 1 }],
        });

        const forumId = forums?.[0]?.id;

        if (!forumId) {
            return NextResponse.json({
                canUpdate: false,
                message: "No forums available for testing",
                requiresSetup: true,
                allTestsPassed: false,
            });
        }

        // Create a test offer
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);

        // Generate random values for testing
        const randomFee = Math.floor(Math.random() * 900) + 100; // 100-999
        const randomTargetProgress = Math.floor(Math.random() * 900) + 100; // 100-999
        const randomCurrentProgress = Math.floor(Math.random() * 50); // 0-49
        const randomLikes = Math.floor(Math.random() * 100); // 0-99
        const randomSuperlikes = Math.floor(Math.random() * 50); // 0-49

        const { data: createdOffer, error: createError } = await PostToDatabase({
            tableName: "Offer",
            contentJson: [
                {
                    creator_id: currentUserId,
                    title: "Security Test - Update Restrictions",
                    text: "Testing update restrictions",
                    target_completition_date: futureDate.toISOString(),
                    state: "Posted",
                    fee: randomFee,
                    forum_id: forumId,
                    current_progress: randomCurrentProgress,
                    likes: randomLikes,
                    superlikes: randomSuperlikes,
                    target_progress: randomTargetProgress,
                    comment_locked_state: "Unlocked",
                },
            ],
        });

        if (createError || !createdOffer || createdOffer.length === 0) {
            return NextResponse.json({
                canUpdate: false,
                message: "Failed to create test offer",
                error: createError?.message,
                allTestsPassed: false,
            });
        }

        const testResults: {
            test: string;
            passed: boolean;
            message: string;
        }[] = [];

        const offerId = (createdOffer as any)[0].id;

        // Test 1: Try to update allowed field - state to Cancelled (should succeed)
        const { error: updateStateError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { state: "Cancelled" },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Update state to Cancelled",
            passed: !updateStateError,
            message: updateStateError
                ? `Failed (should succeed): ${updateStateError.message}`
                : "✅ Successfully updated state to Cancelled",
        });

        // Reset state back to Posted for next tests
        if (!updateStateError) {
            await PutToDatabase({
                tableName: "Offer",
                contentJson: { state: "Posted" },
                filters: [{ method: "eq", column: "id", value: offerId }],
            });
        }

        // Test 2: Try to update allowed field - comment_locked_state (should succeed)
        const { error: updateCommentError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { comment_locked_state: "Locked" },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Update comment_locked_state",
            passed: !updateCommentError,
            message: updateCommentError
                ? `Failed (should succeed): ${updateCommentError.message}`
                : "✅ Successfully updated comment_locked_state",
        });

        // Test 3: Try to update immutable field - title (should fail)
        const { error: updateTitleError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { title: "Hacked Title" },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Update immutable field (title)",
            passed: !!updateTitleError,
            message: updateTitleError
                ? "✅ Correctly blocked immutable field update"
                : "❌ SECURITY ISSUE: Title was changed",
        });

        // Test 4: Try to update immutable field - fee (should fail)
        const randomHackedFee = Math.floor(Math.random() * 900000) + 100000; // 100000-999999
        const { error: updateFeeError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { fee: randomHackedFee },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Update immutable field (fee)",
            passed: !!updateFeeError,
            message: updateFeeError
                ? "✅ Correctly blocked fee modification"
                : "❌ SECURITY ISSUE: Fee was changed",
        });

        // Test 5: Try to update immutable field - text (should fail)
        const { error: updateTextError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { text: "Hacked text content" },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Update immutable field (text)",
            passed: !!updateTextError,
            message: updateTextError
                ? "✅ Correctly blocked text modification"
                : "❌ SECURITY ISSUE: Text was changed",
        });

        // Test 6: Try to update immutable field - current_progress (should fail)
        const { error: updateCurrentProgressError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { current_progress: randomCurrentProgress + 50 },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Update immutable field (current_progress)",
            passed: !!updateCurrentProgressError,
            message: updateCurrentProgressError
                ? "✅ Correctly blocked current_progress modification"
                : "❌ SECURITY ISSUE: Current progress was changed",
        });

        // Test 7: Try to update immutable field - target_progress (should fail)
        const { error: updateTargetProgressError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { target_progress: randomTargetProgress + 500 },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Update immutable field (target_progress)",
            passed: !!updateTargetProgressError,
            message: updateTargetProgressError
                ? "✅ Correctly blocked target_progress modification"
                : "❌ SECURITY ISSUE: Target progress was changed",
        });

        // Test 8: Try to update immutable field - forum_id (should fail)
        const { data: anotherForum } = await GetFromDatabase<Tables<"Forum">>({
            tableName: "Forum",
            select: "id",
            filters: [
                { method: "neq", column: "id", value: forumId },
                { method: "limit", value: 1 },
            ],
        });

        if (anotherForum && anotherForum.length > 0) {
            const { error: updateForumError } = await PutToDatabase({
                tableName: "Offer",
                contentJson: { forum_id: anotherForum[0].id },
                filters: [{ method: "eq", column: "id", value: offerId }],
            });

            testResults.push({
                test: "Update immutable field (forum_id)",
                passed: !!updateForumError,
                message: updateForumError
                    ? "✅ Correctly blocked forum_id modification"
                    : "❌ SECURITY ISSUE: Forum was changed",
            });
        }

        // Test 9: Try to update state to non-Cancelled value after setting to Cancelled (should fail)
        await PutToDatabase({
            tableName: "Offer",
            contentJson: { state: "Cancelled" },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        const { error: updateInvalidStateError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { state: "Posted" },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Revert state from Cancelled back to Posted",
            passed: !!updateInvalidStateError,
            message: updateInvalidStateError
                ? "✅ Correctly blocked state reversion"
                : "❌ SECURITY ISSUE: State changed from Cancelled back to Posted",
        });

        // Test 10: Try to update creator_id (should fail)
        const { error: updateCreatorError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { creator_id: "00000000-0000-0000-0000-000000000000" },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Update creator_id (ownership hijack)",
            passed: !!updateCreatorError,
            message: updateCreatorError
                ? "✅ Correctly blocked creator_id change"
                : "❌ SECURITY ISSUE: Creator ownership was changed",
        });

        // Test 11: Try to update target_completition_date (should fail)
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 14);

        const { error: updateDateError } = await PutToDatabase({
            tableName: "Offer",
            contentJson: { target_completition_date: newDate.toISOString() },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        testResults.push({
            test: "Update target_completition_date",
            passed: !!updateDateError,
            message: updateDateError
                ? "✅ Correctly blocked date modification"
                : "❌ SECURITY ISSUE: Target date was changed",
        });

        // Clean up test offer
        await PutToDatabase({
            tableName: "Offer",
            contentJson: { deleted_at: new Date().toISOString() },
            filters: [{ method: "eq", column: "id", value: offerId }],
        });

        const allPassed = testResults.every((result) => result.passed);

        return NextResponse.json({
            canUpdate: true,
            allTestsPassed: allPassed,
            testResults,
            message: allPassed
                ? "✅ All update restrictions working correctly"
                : "⚠️ Some update restrictions failed",
        });
    } catch (error) {
        return NextResponse.json(
            {
                canUpdate: false,
                allTestsPassed: false,
                message: "Test execution failed",
                error: String(error),
            },
            { status: 500 }
        );
    }
}