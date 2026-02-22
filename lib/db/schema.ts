import {
  pgTable,
  text,
  integer,
  bigint,
  real,
  boolean,
  timestamp,
  jsonb,
  serial,
  uniqueIndex,
  index,
  varchar,
} from "drizzle-orm/pg-core";

// ── summoners ──────────────────────────────────────────────
export const summoners = pgTable(
  "summoners",
  {
    id: serial("id").primaryKey(),
    puuid: varchar("puuid", { length: 78 }).notNull().unique(),
    gameName: varchar("game_name", { length: 100 }).notNull(),
    tagLine: varchar("tag_line", { length: 10 }).notNull(),
    region: varchar("region", { length: 10 }).notNull(),
    summonerId: varchar("summoner_id", { length: 63 }),
    profileIconId: integer("profile_icon_id").notNull(),
    summonerLevel: integer("summoner_level").notNull(),
    // Ranked info (nullable — unranked players)
    soloTier: varchar("solo_tier", { length: 20 }),
    soloRank: varchar("solo_rank", { length: 5 }),
    soloLp: integer("solo_lp"),
    soloWins: integer("solo_wins"),
    soloLosses: integer("solo_losses"),
    flexTier: varchar("flex_tier", { length: 20 }),
    flexRank: varchar("flex_rank", { length: 5 }),
    flexLp: integer("flex_lp"),
    flexWins: integer("flex_wins"),
    flexLosses: integer("flex_losses"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("summoners_puuid_idx").on(table.puuid),
    index("summoners_riot_id_idx").on(
      table.gameName,
      table.tagLine,
      table.region
    ),
  ]
);

// ── matches ────────────────────────────────────────────────
export const matches = pgTable(
  "matches",
  {
    id: serial("id").primaryKey(),
    matchId: varchar("match_id", { length: 50 }).notNull().unique(),
    region: varchar("region", { length: 10 }).notNull(),
    queueId: integer("queue_id").notNull(),
    gameMode: varchar("game_mode", { length: 30 }).notNull(),
    gameDuration: integer("game_duration").notNull(),
    gameVersion: varchar("game_version", { length: 30 }).notNull(),
    gameStartTs: bigint("game_start_ts", { mode: "number" }).notNull(),
    timelineData: jsonb("timeline_data"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("matches_match_id_idx").on(table.matchId),
    index("matches_game_start_idx").on(table.gameStartTs),
  ]
);

// ── match_participants ─────────────────────────────────────
export const matchParticipants = pgTable(
  "match_participants",
  {
    id: serial("id").primaryKey(),
    matchId: varchar("match_id", { length: 50 }).notNull(),
    puuid: varchar("puuid", { length: 78 }).notNull(),
    participantId: integer("participant_id").notNull(),
    teamId: integer("team_id").notNull(),
    championId: integer("champion_id").notNull(),
    championName: varchar("champion_name", { length: 50 }).notNull(),
    riotIdGameName: varchar("riot_id_game_name", { length: 100 }),
    riotIdTagline: varchar("riot_id_tagline", { length: 10 }),
    role: varchar("role", { length: 20 }),
    lane: varchar("lane", { length: 20 }),
    win: boolean("win").notNull(),
    kills: integer("kills").notNull(),
    deaths: integer("deaths").notNull(),
    assists: integer("assists").notNull(),
    champLevel: integer("champ_level").notNull().default(1),
    totalMinionsKilled: integer("total_minions_killed").notNull(),
    visionScore: integer("vision_score").notNull(),
    goldEarned: integer("gold_earned").notNull(),
    totalDamageDealt: integer("total_damage_dealt").notNull(),
    physicalDamage: integer("physical_damage").notNull(),
    magicDamage: integer("magic_damage").notNull(),
    trueDamage: integer("true_damage").notNull(),
    damageTaken: integer("damage_taken").notNull().default(0),
    wardsPlaced: integer("wards_placed").notNull(),
    wardsKilled: integer("wards_killed").notNull(),
    item0: integer("item0"),
    item1: integer("item1"),
    item2: integer("item2"),
    item3: integer("item3"),
    item4: integer("item4"),
    item5: integer("item5"),
    item6: integer("item6"),
    summoner1Id: integer("summoner1_id"),
    summoner2Id: integer("summoner2_id"),
    primaryRuneStyle: integer("primary_rune_style"),
    primaryRune0: integer("primary_rune_0"),
    secondaryRuneStyle: integer("secondary_rune_style"),
  },
  (table) => [
    index("mp_match_id_idx").on(table.matchId),
    index("mp_puuid_idx").on(table.puuid),
    index("mp_champion_idx").on(table.championId),
  ]
);

// ── champions ──────────────────────────────────────────────
export const champions = pgTable("champions", {
  id: integer("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 200 }),
  tags: jsonb("tags"),
  patchVersion: varchar("patch_version", { length: 20 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── champion_stats ─────────────────────────────────────────
export const championStats = pgTable(
  "champion_stats",
  {
    id: serial("id").primaryKey(),
    championId: integer("champion_id").notNull(),
    patchVersion: varchar("patch_version", { length: 20 }).notNull(),
    tier: varchar("tier", { length: 20 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(),
    gamesPlayed: integer("games_played").notNull(),
    wins: integer("wins").notNull(),
    picks: integer("picks").notNull(),
    bans: integer("bans").notNull(),
    totalGames: integer("total_games").notNull(),
    avgKills: real("avg_kills"),
    avgDeaths: real("avg_deaths"),
    avgAssists: real("avg_assists"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("cs_champ_patch_idx").on(table.championId, table.patchVersion),
    uniqueIndex("cs_unique_idx").on(
      table.championId,
      table.patchVersion,
      table.tier,
      table.role
    ),
  ]
);

// ── items ──────────────────────────────────────────────────
export const items = pgTable("items", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 200 }),
  gold: integer("gold"),
  tags: jsonb("tags"),
  patchVersion: varchar("patch_version", { length: 20 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── runes ──────────────────────────────────────────────────
export const runes = pgTable("runes", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 200 }),
  treeId: integer("tree_id"),
  treeName: varchar("tree_name", { length: 50 }),
  slot: integer("slot"),
  patchVersion: varchar("patch_version", { length: 20 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
