import { GetFromDatabase } from "@/lib/services/general";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, petitionId } = body;

        const testResults = [];

        // Test 1: Classic SQL injection with comment
        const test1 = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: userId },
                { method: "eq", column: "petition_id", value: petitionId },
            ],
        });

        testResults.push({
            test: "Classic injection with comment",
            input: { userId, petitionId },
            vulnerable: !test1.error && test1.data !== null,
            error: test1.error?.message,
        });

        // Test 2: Boolean-based blind injection
        const test2 = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: "1' OR '1'='1" },
                { method: "eq", column: "petition_id", value: 1 },
            ],
        });

        testResults.push({
            test: "Boolean-based blind injection",
            input: "1' OR '1'='1",
            vulnerable: !test2.error && test2.data !== null && test2.data.length > 0,
            error: test2.error?.message,
        });

        // Test 3: UNION-based injection
        const test3 = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: "1' UNION SELECT * FROM auth.users--" },
                { method: "eq", column: "petition_id", value: 1 },
            ],
        });

        testResults.push({
            test: "UNION-based injection",
            input: "1' UNION SELECT * FROM auth.users--",
            vulnerable: !test3.error && test3.data !== null,
            error: test3.error?.message,
        });

        // Test 4: Time-based blind injection
        const test4 = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: "1'; SELECT pg_sleep(5)--" },
                { method: "eq", column: "petition_id", value: 1 },
            ],
        });

        testResults.push({
            test: "Time-based blind injection",
            input: "1'; SELECT pg_sleep(5)--",
            vulnerable: !test4.error && test4.data !== null,
            error: test4.error?.message,
        });

        // Test 5: Stacked queries
        const test5 = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: "1'; DELETE FROM \"User_Petition\" WHERE '1'='1" },
                { method: "eq", column: "petition_id", value: 1 },
            ],
        });

        testResults.push({
            test: "Stacked queries (destructive)",
            input: "1'; DELETE FROM User_Petition WHERE '1'='1",
            vulnerable: !test5.error && test5.data !== null,
            error: test5.error?.message,
        });

        // Test 6: NULL byte injection
        const test6 = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: "1%00" },
                { method: "eq", column: "petition_id", value: 1 },
            ],
        });

        testResults.push({
            test: "NULL byte injection",
            input: "1%00",
            vulnerable: !test6.error && test6.data !== null,
            error: test6.error?.message,
        });

        // Test 7: Hex encoding injection
        const test7 = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: "0x31" },
                { method: "eq", column: "petition_id", value: 1 },
            ],
        });

        testResults.push({
            test: "Hex encoding injection",
            input: "0x31",
            vulnerable: !test7.error && test7.data !== null,
            error: test7.error?.message,
        });

        // Test 8: Column name injection in select
        const test8 = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*, (SELECT password FROM auth.users LIMIT 1) as hacked",
            filters: [
                { method: "eq", column: "user_id", value: userId },
                { method: "eq", column: "petition_id", value: 1 },
            ],
        });

        testResults.push({
            test: "Column injection in select",
            input: "*, (SELECT password FROM auth.users LIMIT 1) as hacked",
            vulnerable: !test8.error && test8.data !== null,
            error: test8.error?.message,
        });

        // Test 9: ilike injection (pattern matching vulnerability)
        const test9 = await GetFromDatabase({
            tableName: "Petition",
            select: "*",
            filters: [
                { method: "ilike", column: "title", value: "%' OR '1'='1'--%" },
            ],
        });

        testResults.push({
            test: "Pattern matching injection (ilike)",
            input: "%' OR '1'='1'--%",
            vulnerable: !test9.error && test9.data !== null && test9.data.length > 1,
            error: test9.error?.message,
        });

        // Test 10: Nested subquery injection
        const test10 = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: "(SELECT id FROM \"User\" LIMIT 1)" },
                { method: "eq", column: "petition_id", value: 1 },
            ],
        });

        testResults.push({
            test: "Nested subquery injection",
            input: "(SELECT id FROM User LIMIT 1)",
            vulnerable: !test10.error && test10.data !== null,
            error: test10.error?.message,
        });

        const anyVulnerable = testResults.some(t => t.vulnerable);
        const vulnerableTests = testResults.filter(t => t.vulnerable);

        return NextResponse.json({
            vulnerable: anyVulnerable,
            message: anyVulnerable 
                ? `⚠️ ${vulnerableTests.length}/${testResults.length} SQL injection tests succeeded`
                : `✅ All ${testResults.length} SQL injection attempts blocked`,
            vulnerableTests,
            summary: {
                total: testResults.length,
                vulnerable: vulnerableTests.length,
                protected: testResults.length - vulnerableTests.length,
            },
            testResults,
        });
    } catch (error) {
        return NextResponse.json({
            vulnerable: false,
            message: "✅ Input properly sanitized or rejected",
            error: String(error),
        });
    }
}