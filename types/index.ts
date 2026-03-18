// Re-export types from store
export type { Response, Insight } from '@/store/useArenaStore';

// App-specific types
export interface Model {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Channel {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface Blockchain {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface NavigationParams {
  response?: string;
  insightId?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface AppState {
  isOnline: boolean;
  isReady: boolean;
  currentRoute: string;
}

export type RootStackParamList = {
  index: undefined;
  lab: undefined;
  history: undefined;
  settings: undefined;
  publish: { response: string };
};