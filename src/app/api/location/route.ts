import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  
  if (!q || q.length < 3) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`, {
      headers: {
        "User-Agent": "ConvokeApp/1.0",
      },
    });
    
    if (!res.ok) {
      return NextResponse.json([]);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Location proxy error:", error);
    return NextResponse.json([]);
  }
}
