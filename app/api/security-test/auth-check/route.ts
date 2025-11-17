import { getUserUuid } from "@/lib/services/user";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const userId = await getUserUuid();
        
        return NextResponse.json({
            authenticated: !!userId,
            userId: userId || null,
        });
    } catch (error) {
        return NextResponse.json({
            authenticated: false,
            userId: null,
            error: String(error),
        });
    }
}