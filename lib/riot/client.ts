import { PLATFORM_TO_REGION } from "@/lib/constants";

const RIOT_API_KEY = process.env.RIOT_API_KEY!;

type RoutingType = "platform" | "regional";

export class RiotApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "RiotApiError";
  }
}

export async function riotFetch<T>(
  platform: string,
  path: string,
  routing: RoutingType = "platform"
): Promise<T> {
  const host =
    routing === "regional"
      ? `${PLATFORM_TO_REGION[platform]}.api.riotgames.com`
      : `${platform}.api.riotgames.com`;

  const res = await fetch(`https://${host}${path}`, {
    headers: { "X-Riot-Token": RIOT_API_KEY },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new RiotApiError(
      res.status,
      `Riot API ${res.status}: ${res.statusText} - ${path}`
    );
  }

  return res.json();
}
