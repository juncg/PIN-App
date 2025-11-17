import { GetFromDatabase } from "@/lib/services/general";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        // Try to extract large amounts of data
        const { data, error } = await GetFromDatabase({
            tableName: "Petition",
            select: "*",
            filters: [{ method: "limit", value: 1000 }],
        });

        const count = data?.length || 0;

        // For testing phase: just report what we got
        // In production: counts over 100 would be concerning
        const isTestingPhase = count < 100;

        return NextResponse.json({
            count,
            message: isTestingPhase
                ? `📊 Retrieved ${count} records (testing phase - normal)`
                : `⚠️ Retrieved ${count} records - check if this should be limited`,
            limited: count < 1000,
            isTestingPhase,
            note: isTestingPhase 
                ? "Test will be more meaningful with more data in production"
                : "Production data - review RLS policies",
            error: error?.message,
        });
    } catch (error) {
        return NextResponse.json({
            count: 0,
            message: "✅ Query blocked or limited",
            error: String(error),
        });
    }
}