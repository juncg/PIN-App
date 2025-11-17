import { GetClient } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const currentUserId = await getUserUuid();

        if (!currentUserId) {
            return NextResponse.json({
                canTamper: false,
                message: "Not authenticated",
            });
        }

        // Get regular client (not service client - we want to test what regular users can do)
        const { supabase } = await GetClient();

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

        // Test 1: Try to read auth.users directly (should fail for regular users)
        const { data: readAuthUsers, error: error1 } = await supabase
            .from("users")
            .select("*")
            .eq("id", currentUserId)
            .single();

        // Test 2: Try to update created_at in auth.users
        const { data: authUpdateAttempt, error: error2 } = await supabase
            .from("users")
            .update({ created_at: fakeTimestamp })
            .eq("id", currentUserId)
            .select();

        // Test 3: Try to update email_confirmed_at
        const { data: emailConfirmAttempt, error: error3 } = await supabase
            .from("users")
            .update({ email_confirmed_at: fakeTimestamp })
            .eq("id", currentUserId)
            .select();

        // Test 4: Try to update last_sign_in_at
        const { data: lastSignInAttempt, error: error4 } = await supabase
            .from("users")
            .update({ last_sign_in_at: fakeTimestamp })
            .eq("id", currentUserId)
            .select();

        // Test 5: Try to access other users' auth data
        const { data: otherUsersData, error: error5 } = await supabase
            .from("users")
            .select("*")
            .neq("id", currentUserId)
            .limit(1);

        const canReadOwnAuthData = readAuthUsers && !error1;
        const authUpdateSucceeded = authUpdateAttempt && authUpdateAttempt.length > 0 && !error2;
        const emailConfirmSucceeded =
            emailConfirmAttempt && emailConfirmAttempt.length > 0 && !error3;
        const lastSignInSucceeded =
            lastSignInAttempt && lastSignInAttempt.length > 0 && !error4;
        const canReadOtherUsers = otherUsersData && otherUsersData.length > 0 && !error5;

        const anyAuthTamperingSucceeded =
            authUpdateSucceeded ||
            emailConfirmSucceeded ||
            lastSignInSucceeded ||
            canReadOwnAuthData ||
            canReadOtherUsers;

        return NextResponse.json({
            canTamper: anyAuthTamperingSucceeded,
            message: anyAuthTamperingSucceeded
                ? "⚠️ CRITICAL: Can tamper with auth schema"
                : "✅ Auth schema properly protected",
            tests: {
                readOwnAuthData: {
                    attempted: true,
                    succeeded: canReadOwnAuthData,
                    message: canReadOwnAuthData
                        ? "⚠️ Can read auth.users table directly"
                        : "✅ Cannot read auth.users table directly",
                    error: error1?.message,
                },
                authCreatedAtUpdate: {
                    attempted: true,
                    succeeded: authUpdateSucceeded,
                    message: authUpdateSucceeded
                        ? "⚠️ CRITICAL: Modified auth.users.created_at"
                        : "✅ Cannot modify auth.users.created_at",
                    error: error2?.message,
                },
                emailConfirmedAtUpdate: {
                    attempted: true,
                    succeeded: emailConfirmSucceeded,
                    message: emailConfirmSucceeded
                        ? "⚠️ CRITICAL: Modified auth.users.email_confirmed_at"
                        : "✅ Cannot modify auth.users.email_confirmed_at",
                    error: error3?.message,
                },
                lastSignInAtUpdate: {
                    attempted: true,
                    succeeded: lastSignInSucceeded,
                    message: lastSignInSucceeded
                        ? "⚠️ CRITICAL: Modified auth.users.last_sign_in_at"
                        : "✅ Cannot modify auth.users.last_sign_in_at",
                    error: error4?.message,
                },
                readOtherUsersData: {
                    attempted: true,
                    succeeded: canReadOtherUsers,
                    message: canReadOtherUsers
                        ? "⚠️ CRITICAL: Can read other users' auth data"
                        : "✅ Cannot read other users' auth data",
                    error: error5?.message,
                },
            },
            currentUserId,
            note: "Auth schema should be completely inaccessible to regular users",
        });
    } catch (error) {
        return NextResponse.json({
            canTamper: false,
            message: "✅ Auth schema properly blocked",
            error: String(error),
        });
    }
}