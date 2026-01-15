import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 1. Log the environment variable to verify it exists
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("Backend URL detected:", backendUrl ? backendUrl : "UNDEFINED");

  if (!backendUrl) {
    return NextResponse.json(
      {
        message:
          "Server Error: Backend URL is not defined in Vercel Environment Variables.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    console.log(`Proxying login to: ${backendUrl}/api/auth/login`);

    const res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Upstream Backend Response Status:", res.status);

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    // 2. Log the actual error object so you can see it in Vercel Logs
    console.error("PROXY ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
