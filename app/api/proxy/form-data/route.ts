import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { message: "Backend URL not defined" },
      { status: 500 }
    );
  }

  try {
    // Server-side fetch to the external backend
    const res = await fetch(`${backendUrl}/api/wialon/form-data`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: `Backend error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy Error (GET form-data):", error);
    return NextResponse.json(
      { message: "Failed to fetch form data" },
      { status: 500 }
    );
  }
}
