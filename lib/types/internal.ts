import type { RegionId, Tier, Role } from "@/lib/constants";

export interface SummonerProfile {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: RegionId;
  summonerId: string;
  profileIconId: number;
  summonerLevel: number;
  soloRank: RankedInfo | null;
  flexRank: RankedInfo | null;
}

export interface RankedInfo {
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
}

export interface MatchSummary {
  matchId: string;
  queueId: number;
  gameMode: string;
  gameDuration: number;
  gameStartTimestamp: number;
  // Current player's stats
  championId: number;
  championName: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  visionScore: number;
  goldEarned: number;
  items: number[];
  summoner1Id: number;
  summoner2Id: number;
  primaryRuneStyle: number;
  primaryRune: number;
  role: string;
  // All participants for preview
  participants: MatchParticipantSummary[];
}

export interface MatchParticipantSummary {
  puuid: string;
  championId: number;
  championName: string;
  teamId: number;
  riotIdGameName: string;
  riotIdTagline: string;
}

export interface MatchDetail {
  matchId: string;
  queueId: number;
  gameMode: string;
  gameDuration: number;
  gameVersion: string;
  gameStartTimestamp: number;
  teams: TeamDetail[];
  participants: ParticipantDetail[];
  timeline: TimelineData | null;
}

export interface TeamDetail {
  teamId: number;
  win: boolean;
  totalKills: number;
  totalGold: number;
  dragons: number;
  barons: number;
  towers: number;
  inhibitors: number;
  bans: { championId: number; pickTurn: number }[];
}

export interface ParticipantDetail {
  puuid: string;
  participantId: number;
  riotIdGameName: string;
  riotIdTagline: string;
  teamId: number;
  championId: number;
  championName: string;
  champLevel: number;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  goldEarned: number;
  totalDamage: number;
  physicalDamage: number;
  magicDamage: number;
  trueDamage: number;
  damageTaken: number;
  items: number[];
  summoner1Id: number;
  summoner2Id: number;
  primaryRuneStyle: number;
  primaryRune: number;
  secondaryRuneStyle: number;
  role: string;
}

export interface TimelineData {
  frames: TimelineFrameData[];
}

export interface TimelineFrameData {
  timestamp: number;
  blueTeamGold: number;
  redTeamGold: number;
  blueTeamXp: number;
  redTeamXp: number;
  participants: Record<
    number,
    { gold: number; xp: number; cs: number; level: number }
  >;
  events: TimelineEventData[];
}

export interface TimelineEventData {
  type: string;
  timestamp: number;
  killerId?: number;
  victimId?: number;
  position?: { x: number; y: number };
  wardType?: string;
  monsterType?: string;
  buildingType?: string;
  teamId?: number;
}

export interface ChampionTierEntry {
  championId: number;
  championName: string;
  championKey: string;
  role: Role;
  tier: "S" | "A" | "B" | "C" | "D";
  winRate: number;
  pickRate: number;
  banRate: number;
  gamesPlayed: number;
  avgKDA: number;
  winRateDelta: number;
  pickRateDelta: number;
}

export interface ChampionPageData {
  championId: number;
  championName: string;
  championKey: string;
  championTitle: string;
  tags: string[];
  role: Role;
  winRate: number;
  pickRate: number;
  banRate: number;
  gamesPlayed: number;
  builds: ChampionBuild[];
  runes: ChampionRunePage[];
  skillOrder: number[][];
  matchups: ChampionMatchup[];
}

export interface ChampionBuild {
  items: number[];
  winRate: number;
  pickRate: number;
  games: number;
}

export interface ChampionRunePage {
  primaryStyle: number;
  primaryRunes: number[];
  secondaryStyle: number;
  secondaryRunes: number[];
  winRate: number;
  pickRate: number;
  games: number;
}

export interface ChampionMatchup {
  opponentChampionId: number;
  opponentChampionName: string;
  winRate: number;
  games: number;
}
