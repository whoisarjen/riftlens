export const REGIONS = [
  // Americas
  { id: "na1", name: "North America", route: "americas", group: "Americas" },
  { id: "br1", name: "Brazil", route: "americas", group: "Americas" },
  { id: "la1", name: "Latin America North", route: "americas", group: "Americas" },
  { id: "la2", name: "Latin America South", route: "americas", group: "Americas" },
  // Europe
  { id: "euw1", name: "Europe West", route: "europe", group: "Europe" },
  { id: "eun1", name: "Europe Nordic & East", route: "europe", group: "Europe" },
  { id: "tr1", name: "Turkey", route: "europe", group: "Europe" },
  { id: "ru", name: "Russia", route: "europe", group: "Europe" },
  { id: "me1", name: "Middle East", route: "europe", group: "Europe" },
  // Asia
  { id: "kr", name: "Korea", route: "asia", group: "Asia" },
  { id: "jp1", name: "Japan", route: "asia", group: "Asia" },
  // SEA
  { id: "oc1", name: "Oceania", route: "sea", group: "SEA" },
  { id: "ph2", name: "Philippines", route: "sea", group: "SEA" },
  { id: "sg2", name: "Singapore", route: "sea", group: "SEA" },
  { id: "th2", name: "Thailand", route: "sea", group: "SEA" },
  { id: "tw2", name: "Taiwan", route: "sea", group: "SEA" },
  { id: "vn2", name: "Vietnam", route: "sea", group: "SEA" },
] as const;

export type RegionId = (typeof REGIONS)[number]["id"];

export const PLATFORM_TO_REGION: Record<string, string> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r.route])
);

export const QUEUE_TYPES: Record<number, string> = {
  420: "Ranked Solo/Duo",
  440: "Ranked Flex",
  400: "Normal Draft",
  430: "Normal Blind",
  450: "ARAM",
  700: "Clash",
  900: "URF",
  1020: "One for All",
  1300: "Nexus Blitz",
  1400: "Ultimate Spellbook",
  1700: "Arena",
  1900: "Pick URF",
};

export const TIER_ORDER = [
  "CHALLENGER",
  "GRANDMASTER",
  "MASTER",
  "DIAMOND",
  "EMERALD",
  "PLATINUM",
  "GOLD",
  "SILVER",
  "BRONZE",
  "IRON",
] as const;

export type Tier = (typeof TIER_ORDER)[number];

export const ROLES = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"] as const;
export type Role = (typeof ROLES)[number];

export const TIER_COLORS: Record<string, string> = {
  IRON: "#6B6B6B",
  BRONZE: "#8B6914",
  SILVER: "#8B9BB4",
  GOLD: "#D4A843",
  PLATINUM: "#22A699",
  EMERALD: "#22C55E",
  DIAMOND: "#576BCE",
  MASTER: "#9D48E0",
  GRANDMASTER: "#EF4444",
  CHALLENGER: "#F0C75E",
};
