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

export default async function Page() {
  let units: WialonUnit[] = [];

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://new-mar-marine-backend.onrender.com";

    // Server-side fetch
    const res = await fetch(`${backendUrl}/api/wialon/units`, {
      cache: "default",
    });

    if (res.ok) {
      const json: ApiResponse = await res.json();
      units = json.data;
    } else {
      console.error(`Fetch failed with status: ${res.status}`);
    }
  } catch (error) {
    console.error("Server fetch error:", error);
  }

  return <UnitsWrapper initialData={units} />;
}
