import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface OpenMeteoResponse {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

function isValidLatLon(lat: number, lon: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!isValidLatLon(lat, lon)) {
    return NextResponse.json({ ok: false, error: "Invalid or missing coordinates." }, { status: 400 });
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toFixed(4));
  url.searchParams.set("longitude", lon.toFixed(4));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "4");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Weather service returned an error." }, { status: 502 });
    }

    const data = (await res.json()) as OpenMeteoResponse;

    if (!data.current || !data.daily) {
      return NextResponse.json({ ok: false, error: "Weather data was incomplete." }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      current: {
        temperatureC: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windKph: data.current.wind_speed_10m,
        code: data.current.weather_code,
      },
      forecast: data.daily.time.map((date, i) => ({
        date,
        code: data.daily!.weather_code[i],
        maxC: data.daily!.temperature_2m_max[i],
        minC: data.daily!.temperature_2m_min[i],
      })),
    });
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/weather] fetch failed:", message);
    return NextResponse.json(
      { ok: false, error: "Couldn't reach the weather service right now." },
      { status: 503 }
    );
  }
}
