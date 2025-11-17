import { GetFromDatabase, PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { NextRequest, NextResponse } from "next/server";
import { Tables } from "@/database.types";

export async function POST(request: NextRequest) {
    try {
        const currentUserId = await getUserUuid();

        if (!currentUserId) {
            return NextResponse.json({
                canUpdate: false,
                message: "❌ User not authenticated - cannot run test",
                error: "Please log in to run security tests",
                allTestsPassed: false,
            }, { status: 401 });
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
                message: "❌ No forums available for testing",
                requiresSetup: true,
                allTestsPassed: false,
            }, { status: 400 });
        }

        // Generate random values for testing
        const randomTargetProgress = Math.floor(Math.random() * 900) + 100; // 100-999
        const randomCurrentProgress = Math.floor(Math.random() * 50); // 0-49
        const randomLikes = Math.floor(Math.random() * 100); // 0-99
        const randomSuperlikes = Math.floor(Math.random() * 50); // 0-49

        // Create a NEW test petition
        const { data: createdPetition, error: createError } = await PostToDatabase({
            tableName: "Petition",
            contentJson: [
                {
                    creator_id: currentUserId,
                    title: "Security Test - New Petition Update Restrictions",
                    text: "Testing update restrictions within 5-minute grace period",
                    state: "Posted",
                    forum_id: forumId,
                    current_progress: randomCurrentProgress,
                    likes: randomLikes,
                    superlikes: randomSuperlikes,
                    target_progress: randomTargetProgress,
                    comment_locked_state: "Unlocked",
                },
            ],
        });

        if (createError || !createdPetition || createdPetition.length === 0) {
            return NextResponse.json({
                canUpdate: false,
                message: "❌ Failed to create test petition",
                error: createError?.message,
                allTestsPassed: false,
            }, { status: 500 });
        }

        const newPetitionId = (createdPetition as any)[0].id;

        const testResults: {
            test: string;
            passed: boolean;
            message: string;
            isNewPetition?: boolean;
        }[] = [];

        // ========== TESTS FOR NEW PETITION (Within 5 minutes) ==========

        // Test 1: Update allowed field within 5 minutes - title (should succeed)
        const { error: updateTitleError } = await PutToDatabase({
            tableName: "Petition",
            contentJson: { title: "Updated Title Within Grace Period" },
            filters: [{ method: "eq", column: "id", value: newPetitionId }],
        });

        testResults.push({
            test: "NEW - Update title within 5 minutes",
            passed: !updateTitleError,
            message: !updateTitleError
                ? "✅ Title updated successfully within grace period"
                : "❌ FAILED: Title should be updatable within 5 minutes",
            isNewPetition: true,
        });

        // Test 2: Update allowed field within 5 minutes - text (should succeed)
        const { error: updateTextError } = await PutToDatabase({
            tableName: "Petition",
            contentJson: { text: "Updated text within grace period" },
            filters: [{ method: "eq", column: "id", value: newPetitionId }],
        });

        testResults.push({
            test: "NEW - Update text within 5 minutes",
            passed: !updateTextError,
            message: !updateTextError
                ? "✅ Text updated successfully within grace period"
                : "❌ FAILED: Text should be updatable within 5 minutes",
            isNewPetition: true,
        });

        // Test 3: Update allowed field within 5 minutes - target_progress (should succeed)
        const newTargetProgress = randomTargetProgress + 100;
        const { error: updateTargetProgressError } = await PutToDatabase({
            tableName: "Petition",
            contentJson: { target_progress: newTargetProgress },
            filters: [{ method: "eq", column: "id", value: newPetitionId }],
        });

        testResults.push({
            test: "NEW - Update target_progress within 5 minutes",
            passed: !updateTargetProgressError,
            message: !updateTargetProgressError
                ? "✅ Target progress updated successfully within grace period"
                : "❌ FAILED: Target progress should be updatable within 5 minutes",
            isNewPetition: true,
        });

        // Test 4: Try to update ALWAYS immutable field - current_progress (should fail even within 5 minutes)
        const { error: updateCurrentProgressError } = await PutToDatabase({
            tableName: "Petition",
            contentJson: { current_progress: randomCurrentProgress + 50 },
            filters: [{ method: "eq", column: "id", value: newPetitionId }],
        });

        testResults.push({
            test: "NEW - Update current_progress within 5 minutes (should fail)",
            passed: !!updateCurrentProgressError,
            message: updateCurrentProgressError
                ? "✅ Correctly blocked current_progress modification (always immutable)"
                : "❌ SECURITY ISSUE: Current progress changed within grace period",
            isNewPetition: true,
        });

        // Test 5: Try to update ALWAYS immutable field - creator_id (should fail even within 5 minutes)
        const { error: updateCreatorError } = await PutToDatabase({
            tableName: "Petition",
            contentJson: { creator_id: "00000000-0000-0000-0000-000000000000" },
            filters: [{ method: "eq", column: "id", value: newPetitionId }],
        });

        testResults.push({
            test: "NEW - Update creator_id within 5 minutes (should fail)",
            passed: !!updateCreatorError,
            message: updateCreatorError
                ? "✅ Correctly blocked creator_id modification (always immutable)"
                : "❌ SECURITY ISSUE: Creator ownership changed within grace period",
            isNewPetition: true,
        });

        // Test 6: Try to update ALWAYS immutable field - forum_id (should fail even within 5 minutes)
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
                tableName: "Petition",
                contentJson: { forum_id: anotherForum[0].id },
                filters: [{ method: "eq", column: "id", value: newPetitionId }],
            });

            testResults.push({
                test: "NEW - Update forum_id within 5 minutes (should fail)",
                passed: !!updateForumError,
                message: updateForumError
                    ? "✅ Correctly blocked forum_id modification (always immutable)"
                    : "❌ SECURITY ISSUE: Forum changed within grace period",
                isNewPetition: true,
            });
        }

        // Test 7: Update comment_locked_state within 5 minutes (should succeed)
        const { error: updateCommentLockedError } = await PutToDatabase({
            tableName: "Petition",
            contentJson: { comment_locked_state: "Locked" },
            filters: [{ method: "eq", column: "id", value: newPetitionId }],
        });

        testResults.push({
            test: "NEW - Update comment_locked_state within 5 minutes",
            passed: !updateCommentLockedError,
            message: !updateCommentLockedError
                ? "✅ Comment locked state updated successfully"
                : "❌ FAILED: Comment locked state should be updatable",
            isNewPetition: true,
        });

        // ========== TESTS FOR EXISTING PETITION (After 5 minutes) ==========

        // Try to get an existing petition (older than 5 minutes) created by current user
        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 6);

        const { data: existingPetitions } = await GetFromDatabase<Tables<"Petition">>({
            tableName: "Petition",
            select: "*",
            filters: [
                { method: "eq", column: "creator_id", value: currentUserId },
                { method: "lt", column: "created_at", value: fiveMinutesAgo.toISOString() },
                { method: "limit", value: 1 },
            ],
        });

        let oldPetitionTests: typeof testResults = [];

        if (existingPetitions && existingPetitions.length > 0) {
            const oldPetitionId = existingPetitions[0].id;
            const oldPetitionTitle = existingPetitions[0].title;
            const oldPetitionText = existingPetitions[0].text;
            const oldTargetProgress = existingPetitions[0].target_progress;

            // Test 8: Try to update title after 5 minutes (should fail)
            const { error: updateOldTitleError } = await PutToDatabase({
                tableName: "Petition",
                contentJson: { title: "Attempting to change old title" },
                filters: [{ method: "eq", column: "id", value: oldPetitionId }],
            });

            oldPetitionTests.push({
                test: "OLD - Update title after 5 minutes (should fail)",
                passed: !!updateOldTitleError,
                message: updateOldTitleError
                    ? "✅ Correctly blocked title modification after grace period"
                    : "❌ SECURITY ISSUE: Title was changed after 5 minutes",
                isNewPetition: false,
            });

            // Test 9: Try to update text after 5 minutes (should fail)
            const { error: updateOldTextError } = await PutToDatabase({
                tableName: "Petition",
                contentJson: { text: "Attempting to change old text" },
                filters: [{ method: "eq", column: "id", value: oldPetitionId }],
            });

            oldPetitionTests.push({
                test: "OLD - Update text after 5 minutes (should fail)",
                passed: !!updateOldTextError,
                message: updateOldTextError
                    ? "✅ Correctly blocked text modification after grace period"
                    : "❌ SECURITY ISSUE: Text was changed after 5 minutes",
                isNewPetition: false,
            });

            // Test 10: Try to update target_progress after 5 minutes (should fail)
            const { error: updateOldTargetProgressError } = await PutToDatabase({
                tableName: "Petition",
                contentJson: { target_progress: (oldTargetProgress ?? 0) + 500 },
                filters: [{ method: "eq", column: "id", value: oldPetitionId }],
            });

            oldPetitionTests.push({
                test: "OLD - Update target_progress after 5 minutes (should fail)",
                passed: !!updateOldTargetProgressError,
                message: updateOldTargetProgressError
                    ? "✅ Correctly blocked target_progress modification after grace period"
                    : "❌ SECURITY ISSUE: Target progress was changed after 5 minutes",
                isNewPetition: false,
            });

            // Test 11: Update state to Cancelled after 5 minutes (should succeed)
            const { error: updateOldStateError } = await PutToDatabase({
                tableName: "Petition",
                contentJson: { state: "Cancelled" },
                filters: [{ method: "eq", column: "id", value: oldPetitionId }],
            });

            oldPetitionTests.push({
                test: "OLD - Update state to Cancelled after 5 minutes",
                passed: !updateOldStateError,
                message: !updateOldStateError
                    ? "✅ State changed to Cancelled successfully"
                    : "❌ FAILED: State should be changeable to Cancelled",
                isNewPetition: false,
            });

            // Test 12: Update comment_locked_state after 5 minutes (should succeed)
            const { error: updateOldCommentLockedError } = await PutToDatabase({
                tableName: "Petition",
                contentJson: { comment_locked_state: "Locked" },
                filters: [{ method: "eq", column: "id", value: oldPetitionId }],
            });

            oldPetitionTests.push({
                test: "OLD - Update comment_locked_state after 5 minutes",
                passed: !updateOldCommentLockedError,
                message: !updateOldCommentLockedError
                    ? "✅ Comment locked state updated successfully"
                    : "❌ FAILED: Comment locked state should always be updatable",
                isNewPetition: false,
            });

            // Test 13: Try to revert state from Cancelled back to Posted (should fail)
            const { error: revertStateError } = await PutToDatabase({
                tableName: "Petition",
                contentJson: { state: "Posted" },
                filters: [{ method: "eq", column: "id", value: oldPetitionId }],
            });

            oldPetitionTests.push({
                test: "OLD - Revert state from Cancelled to Posted (should fail)",
                passed: !!revertStateError,
                message: revertStateError
                    ? "✅ Correctly blocked state reversion"
                    : "❌ SECURITY ISSUE: State changed from Cancelled back to Posted",
                isNewPetition: false,
            });
        }

        // Combine all tests
        const allTests = [...testResults, ...oldPetitionTests];
        const allTestsPassed = allTests.every((test) => test.passed);
        const newPetitionTestsPassed = testResults.every((test) => test.passed);
        const oldPetitionTestsPassed = oldPetitionTests.length > 0 ? oldPetitionTests.every((test) => test.passed) : true;

        // Clean up - delete the test petition
        await PutToDatabase({
            tableName: "Petition",
            contentJson: { state: "Cancelled" },
            filters: [{ method: "eq", column: "id", value: newPetitionId }],
        });

        return NextResponse.json({
            allTestsPassed,
            newPetitionTestsPassed,
            oldPetitionTestsPassed,
            hasOldPetitionTests: oldPetitionTests.length > 0,
            message: allTestsPassed
                ? "✅ All petition update restriction tests passed"
                : oldPetitionTests.length === 0
                ? "⚠️ Some tests failed (no old petition available for full testing)"
                : "❌ Some petition update restriction tests failed",
            summary: {
                total: allTests.length,
                passed: allTests.filter((t) => t.passed).length,
                failed: allTests.filter((t) => !t.passed).length,
                newPetitionTests: testResults.length,
                oldPetitionTests: oldPetitionTests.length,
            },
            testResults: allTests,
            testPetitionId: newPetitionId,
            oldPetitionAvailable: oldPetitionTests.length > 0,
        });
    } catch (error) {
        return NextResponse.json(
            {
                allTestsPassed: false,
                message: "❌ Test execution error",
                error: String(error),
            },
            { status: 500 }
        );
    }
}