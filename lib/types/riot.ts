// Riot Account V1
export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

// Summoner V4
export interface SummonerDTO {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

// League V4
export interface LeagueEntryDTO {
  leagueId: string;
  summonerId: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

// Champion Mastery V4
export interface ChampionMasteryDTO {
  puuid: string;
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
}

// Match V5
export interface MatchDTO {
  metadata: MatchMetadata;
  info: MatchInfo;
}

export interface MatchMetadata {
  dataVersion: string;
  matchId: string;
  participants: string[];
}

export interface MatchInfo {
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: MatchParticipantDTO[];
  platformId: string;
  queueId: number;
  teams: TeamDTO[];
}

export interface MatchParticipantDTO {
  puuid: string;
  participantId: number;
  summonerId: string;
  summonerName: string;
  riotIdGameName: string;
  riotIdTagline: string;
  teamId: number;
  championId: number;
  championName: string;
  champLevel: number;
  win: boolean;

  // KDA
  kills: number;
  deaths: number;
  assists: number;

  // CS
  totalMinionsKilled: number;
  neutralMinionsKilled: number;

  // Vision
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  visionWardsBoughtInGame: number;
  detectorWardsPlaced: number;

  // Gold
  goldEarned: number;
  goldSpent: number;

  // Damage
  totalDamageDealtToChampions: number;
  physicalDamageDealtToChampions: number;
  magicDamageDealtToChampions: number;
  trueDamageDealtToChampions: number;
  totalDamageTaken: number;
  damageSelfMitigated: number;

  // Items
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;

  // Runes
  perks: PerksDTO;

  // Summoner spells
  summoner1Id: number;
  summoner2Id: number;

  // Position
  teamPosition: string;
  individualPosition: string;
  role: string;
  lane: string;

  // Multi-kills
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;

  // Misc
  firstBloodKill: boolean;
  firstTowerKill: boolean;
  longestTimeSpentLiving: number;
  totalHealsOnTeammates: number;
  totalDamageShieldedOnTeammates: number;
  timeCCingOthers: number;
}

export interface PerksDTO {
  statPerks: { defense: number; flex: number; offense: number };
  styles: PerkStyleDTO[];
}

export interface PerkStyleDTO {
  description: string;
  selections: { perk: number; var1: number; var2: number; var3: number }[];
  style: number;
}

export interface TeamDTO {
  teamId: number;
  win: boolean;
  bans: { championId: number; pickTurn: number }[];
  objectives: Record<string, { first: boolean; kills: number }>;
}

// Match Timeline V5
export interface MatchTimelineDTO {
  metadata: MatchMetadata;
  info: {
    frameInterval: number;
    frames: TimelineFrame[];
    participants: { participantId: number; puuid: string }[];
  };
}

export interface TimelineFrame {
  timestamp: number;
  participantFrames: Record<
    string,
    {
      participantId: number;
      position: { x: number; y: number };
      currentGold: number;
      totalGold: number;
      xp: number;
      level: number;
      minionsKilled: number;
      jungleMinionsKilled: number;
      damageStats: {
        totalDamageDoneToChampions: number;
        magicDamageDoneToChampions: number;
        physicalDamageDoneToChampions: number;
        trueDamageDoneToChampions: number;
      };
    }
  >;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  type: string;
  timestamp: number;
  participantId?: number;
  killerId?: number;
  victimId?: number;
  assistingParticipantIds?: number[];
  position?: { x: number; y: number };
  itemId?: number;
  wardType?: string;
  creatorId?: number;
  monsterType?: string;
  monsterSubType?: string;
  buildingType?: string;
  towerType?: string;
  laneType?: string;
  teamId?: number;
  skillSlot?: number;
  levelUpType?: string;
}

// Data Dragon
export interface DDragonChampion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: { full: string; sprite: string; group: string };
  tags: string[];
}

export interface DDragonItem {
  name: string;
  description: string;
  image: { full: string };
  gold: { total: number; base: number; sell: number; purchasable: boolean };
  tags: string[];
}

export interface DDragonRuneTree {
  id: number;
  key: string;
  name: string;
  icon: string;
  slots: { runes: DDragonRune[] }[];
}

export interface DDragonRune {
  id: number;
  key: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  icon: string;
}
