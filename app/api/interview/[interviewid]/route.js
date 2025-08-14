import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(req, { params }) {
    const { interviewid } = params;

    try {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, interviewid));

        if (result.length === 0) {
            return NextResponse.json({ error: "Interview not found" }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching interview data" }, { status: 500 });
    }
}
