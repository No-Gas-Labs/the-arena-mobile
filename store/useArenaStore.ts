import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Response {
  model: string;
  output: string;
  tokens: number;
  latency_ms: number;
}

export interface Insight {
  id: string;
  prompt: string;
  responses: Response[];
  selectedResponse?: Response;
  publishedTo?: string[];
  blockchainHash?: string;
  timestamp: number;
}

interface ArenaStore {
  // State
  apiUrl: string;
  insights: Insight[];
  currentInsight: Insight | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setApiUrl: (url: string) => void;
  addInsight: (insight: Insight) => void;
  setCurrentInsight: (insight: Insight | null) => void;
  updateInsight: (id: string, updates: Partial<Insight>) => void;
  deleteInsight: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useArenaStore = create<ArenaStore>()(
  persist(
    (set) => ({
      // Initial state
      apiUrl: 'https://the-arena-api.fly.dev',
      insights: [],
      currentInsight: null,
      isLoading: false,
      error: null,

      // Actions
      setApiUrl: (url) => set({ apiUrl: url }),
      
      addInsight: (insight) =>
        set((state) => ({
          insights: [insight, ...state.insights],
          currentInsight: insight,
        })),

      setCurrentInsight: (insight) =>
        set({ currentInsight: insight }),

      updateInsight: (id, updates) =>
        set((state) => ({
          insights: state.insights.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
          currentInsight:
            state.currentInsight?.id === id
              ? { ...state.currentInsight, ...updates }
              : state.currentInsight,
        })),

      deleteInsight: (id) =>
        set((state) => ({
          insights: state.insights.filter((i) => i.id !== id),
          currentInsight:
            state.currentInsight?.id === id ? null : state.currentInsight,
        })),

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'arena-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
