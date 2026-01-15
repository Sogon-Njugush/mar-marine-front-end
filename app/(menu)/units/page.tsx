import UnitsWrapper from "@/components/units-wrapper";

type WialonUnit = {
  id: number;
  name: string;
};

type ApiResponse = {
  statusCode: number;
  message: string;
  data: WialonUnit[];
};

// This is a Server Component (no 'use client')
export default async function Page() {
  let units: WialonUnit[] = [];

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Server-side fetch (runs on the server node process)
    const res = await fetch(`${backendUrl}/api/wialon/units`, {
      cache: "no-store", // Ensure fresh data on initial load
    });

    if (res.ok) {
      const json: ApiResponse = await res.json();
      units = json.data;
    }
  } catch (error) {
    console.error("Server fetch error:", error);
    // We fail gracefully and pass empty array; the client polling will try again later
  }

  // Pass the fetched data to the client component
  return <UnitsWrapper initialData={units} />;
}
