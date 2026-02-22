import type {
  DDragonChampion,
  DDragonItem,
  DDragonRuneTree,
} from "@/lib/types/riot";

const DDRAGON_BASE = "https://ddragon.leagueoflegends.com";

export async function getLatestVersion(): Promise<string> {
  const res = await fetch(`${DDRAGON_BASE}/api/versions.json`, {
    next: { revalidate: 3600 },
  });
  const versions: string[] = await res.json();
  return versions[0];
}

export async function getChampionData(
  version: string
): Promise<Record<string, DDragonChampion>> {
  const res = await fetch(
    `${DDRAGON_BASE}/cdn/${version}/data/en_US/champion.json`,
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  return data.data;
}

export async function getItemData(
  version: string
): Promise<Record<string, DDragonItem>> {
  const res = await fetch(
    `${DDRAGON_BASE}/cdn/${version}/data/en_US/item.json`,
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  return data.data;
}

export async function getRuneData(
  version: string
): Promise<DDragonRuneTree[]> {
  const res = await fetch(
    `${DDRAGON_BASE}/cdn/${version}/data/en_US/runesReforged.json`,
    { next: { revalidate: 86400 } }
  );
  return res.json();
}

export function championImageUrl(
  version: string,
  championKey: string
): string {
  return `${DDRAGON_BASE}/cdn/${version}/img/champion/${championKey}.png`;
}

export function championSplashUrl(championKey: string, skin: number = 0): string {
  return `${DDRAGON_BASE}/cdn/img/champion/splash/${championKey}_${skin}.jpg`;
}

export function itemImageUrl(version: string, itemId: number): string {
  return `${DDRAGON_BASE}/cdn/${version}/img/item/${itemId}.png`;
}

export function profileIconUrl(version: string, iconId: number): string {
  return `${DDRAGON_BASE}/cdn/${version}/img/profileicon/${iconId}.png`;
}

export function runeIconUrl(iconPath: string): string {
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${iconPath.toLowerCase()}`;
}
