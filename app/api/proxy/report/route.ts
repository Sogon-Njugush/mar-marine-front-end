import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const body = await request.json();

    // FIXED: Added "/api" before "/wialon/reports/execute"
    const res = await fetch(`${backendUrl}/api/wialon/reports/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // Return the status code from the backend so the frontend handles 404s/500s correctly
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error (POST report):", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
