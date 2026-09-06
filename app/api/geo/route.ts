import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface IpWhoResponse {
  success: boolean;
  message?: string;
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

function isPrivateOrLoopback(ip: string): boolean {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  );
}

function extractClientIp(request: NextRequest): string | null {
  // x-forwarded-for can be a comma-separated list; the first entry is the
  // original client when the app sits behind a trusted proxy (e.g. Vercel).
  const forwarded = request.headers.get("x-forwarded-for");
  const candidate = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  if (!candidate || isPrivateOrLoopback(candidate)) return null;
  return candidate;
}

async function lookup(ip: string | null, signal: AbortSignal): Promise<IpWhoResponse> {
  const url = ip ? `https://ipwho.is/${ip}` : "https://ipwho.is/";
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Lookup failed with status ${res.status}`);
  return (await res.json()) as IpWhoResponse;
}

export async function GET(request: NextRequest) {
  const clientIp = extractClientIp(request);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const data = await lookup(clientIp, controller.signal);
    clearTimeout(timeout);

    if (!data.success || data.latitude === undefined || data.longitude === undefined) {
      return NextResponse.json(
        { ok: false, error: data.message ?? "Location lookup did not return coordinates." },
        { status: 502 }
      );
    }

    // `source` tells the client how much to trust this: a real client IP
    // gives a genuine (if approximate) estimate, whereas the no-IP fallback
    // only reflects the server's own network, not the visitor.
    return NextResponse.json({
      ok: true,
      source: clientIp ? "client-ip" : "server-fallback",
      ip: clientIp ?? undefined,
      city: data.city,
      region: data.region,
      country: data.country,
      lat: data.latitude,
      lon: data.longitude,
    });
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : "Unknown error";
    // Deliberately not logging the IP itself — only a generic failure note.
    console.error("[api/geo] lookup failed:", message);
    return NextResponse.json(
      { ok: false, error: "Couldn't determine an approximate location right now." },
      { status: 503 }
    );
  }
}
