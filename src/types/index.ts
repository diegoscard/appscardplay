export interface Channel {
  id: string;
  name: string;
  streamUrl: string;
  logoUrl?: string;
  category: string;
  tvgId?: string;
  tvgName?: string;
  isFavorite?: boolean;
  orderIndex: number;
  initials: string;
}

export interface EPGProgram {
  channelId: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
}

export interface PlaylistInfo {
  id: string;
  name: string;
  url: string;
  lastUpdated: number;
  channelCount: number;
}

export interface VodMovie {
  id: string;
  name: string;
  streamUrl: string;
  posterUrl?: string;
  category: string;
  year?: string;
  rating?: number;
  plot?: string;
  cast?: string;
  director?: string;
  duration?: string;
}

export interface VodSeries {
  id: string;
  name: string;
  posterUrl?: string;
  streamUrl?: string;
  category: string;
  plot?: string;
  cast?: string;
  genre?: string;
  rating?: number;
  year?: string;
}

export interface SeriesEpisode {
  id: string;
  title: string;
  seasonNumber: number;
  episodeNumber: number;
  streamUrl: string;
  plot?: string;
}

export type AppScreen =
  | 'splash'
  | 'setup'
  | 'home'
  | 'livetv'
  | 'movies'
  | 'series'
  | 'player'
  | 'settings'
  | 'future_login'
  | 'about'
  | 'android_project';

export type UserStatus = 'ATIVO' | 'EXPIRADO' | 'BLOQUEADO' | 'DISPOSITIVO_NAO_AUTORIZADO';

export interface UserSession {
  username: string;
  status: UserStatus;
  expirationDate?: string;
  maxDevices: number;
}
