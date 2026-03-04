import { NextRequest, NextResponse } from "next/server";
import { jobs } from "@/lib/jobStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId || !jobs[jobId]) {
    return NextResponse.json({ error: "Invalid job" }, { status: 400 });
  }

  return NextResponse.json(jobs[jobId]);
}