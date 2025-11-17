import { GetFromDatabase } from "@/lib/services/general";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, petitionId } = body;

        // Try SQL injection attacks
        const { data, error } = await GetFromDatabase({
            tableName: "User_Petition",
            select: "*",
            filters: [
                { method: "eq", column: "user_id", value: userId },
                { method: "eq", column: "petition_id", value: petitionId },
            ],
        });

        // If malicious input causes errors, it's good
        // If it returns data or doesn't error, might be vulnerable
        return NextResponse.json({
            vulnerable: !error && data !== null,
            message: error ? "Query properly rejected" : "Query executed (check if sanitized)",
            error: error?.message,
        });
    } catch (error) {
        // Catching errors is good - means malicious input was rejected
        return NextResponse.json({
            vulnerable: false,
            message: "Input properly sanitized or rejected",
            error: String(error),
        });
    }
}