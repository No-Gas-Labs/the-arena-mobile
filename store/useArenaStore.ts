import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// AWARENESS TRACE TYPES
// ============================================================================

export interface TraceEntry {
  id: string;
  timestamp: string;
  agent: string;
  model: string;
  outputPreview: string;
  tension: number;
}

export interface AgentMutation {
  agentId: string;
  originalRole: string;
  mutatedRole: string;
  reason: string;
  traceCount: number;
  timestamp: string;
}

export interface AwarenessState {
  traceCount: number;
  uniqueAgents: number;
  avgTension: number;
  mutations: AgentMutation[];
  recentActivity: TraceEntry[];
  fieldState: {
    currentTension: number;
    isAdapting: boolean;
  };
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

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
  awareness?: AwarenessState;
}

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface ArenaStore {
  // Connection State
  apiUrl: string;
  sessionId: string | null;
  offlineMode: boolean;
  
  // Data State
  insights: Insight[];
  currentInsight: Insight | null;
  
  // Awareness State
  awareness: AwarenessState | null;
  mutations: AgentMutation[];
  
  // UI State
  isLoading: boolean;
  error: string | null;

  // Connection Actions
  setApiUrl: (url: string) => void;
  setSessionId: (id: string | null) => void;
  setOfflineMode: (mode: boolean) => void;

  // Insight Actions
  addInsight: (insight: Insight) => void;
  setCurrentInsight: (insight: Insight | null) => void;
  updateInsight: (id: string, updates: Partial<Insight>) => void;
  deleteInsight: (id: string) => void;

  // Awareness Actions
  setAwareness: (awareness: AwarenessState | null) => void;
  setMutations: (mutations: AgentMutation[]) => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // API Actions
  fetchInsights: () => Promise<void>;
  fetchAwareness: () => Promise<void>;
  createSession: (prompt: string, models?: string[]) => Promise<Insight | null>;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useArenaStore = create<ArenaStore>()(
  persist(
    (set, get) => ({
      // Initial state
      apiUrl: 'https://the-arena-api.fly.dev',
      sessionId: null,
      offlineMode: false,
      insights: [],
      currentInsight: null,
      awareness: null,
      mutations: [],
      isLoading: false,
      error: null,

      // Connection Actions
      setApiUrl: (url) => set({ apiUrl: url }),
      setSessionId: (id) => set({ sessionId: id }),
      setOfflineMode: (mode) => set({ offlineMode: mode }),

      // Insight Actions
      addInsight: (insight) =>
        set((state) => ({
          insights: [insight, ...state.insights],
          currentInsight: insight,
          sessionId: insight.id,
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

      // Awareness Actions
      setAwareness: (awareness) => set({ awareness }),
      setMutations: (mutations) => set({ mutations }),

      // UI Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // API: Fetch insights for current session
      fetchInsights: async () => {
        const { apiUrl, sessionId } = get();
        if (!sessionId) return;

        try {
          set({ isLoading: true, error: null });
          const response = await fetch(`${apiUrl}/api/insights/${sessionId}`);
          
          if (!response.ok) throw new Error('Failed to fetch insights');
          
          const data = await response.json();
          set({ awareness: data, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
            offlineMode: true
          });
        }
      },

      // API: Fetch awareness trace
      fetchAwareness: async () => {
        const { apiUrl, sessionId } = get();
        if (!sessionId) return;

        try {
          const response = await fetch(`${apiUrl}/api/awareness/${sessionId}?limit=20`);
          
          if (!response.ok) throw new Error('Failed to fetch awareness');
          
          const data = await response.json();
          set({ 
            awareness: {
              traceCount: data.session?.traceCount || 0,
              uniqueAgents: data.session?.activeAgents?.length || 0,
              avgTension: parseFloat(data.fieldState?.currentTension || '0'),
              mutations: data.mutations || [],
              recentActivity: data.traces || [],
              fieldState: data.fieldState || { currentTension: 0, isAdapting: false }
            },
            mutations: data.mutations || []
          });
        } catch (error) {
          console.error('Failed to fetch awareness:', error);
        }
      },

      // API: Create new session with multi-model response
      createSession: async (prompt: string, models?: string[]) => {
        const { apiUrl, addInsight, fetchAwareness } = get();

        try {
          set({ isLoading: true, error: null });

          const response = await fetch(`${apiUrl}/api/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, models }),
          });

          if (!response.ok) throw new Error('Failed to create session');

          const data = await response.json();

          const insight: Insight = {
            id: data.sessionId,
            prompt: data.prompt,
            responses: data.responses,
            timestamp: Date.now(),
            awareness: data.awareness,
          };

          addInsight(insight);
          
          // Fetch full awareness after a short delay
          setTimeout(() => fetchAwareness(), 500);

          set({ isLoading: false });
          return insight;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
          return null;
        }
      },
    }),
    {
      name: 'arena-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        apiUrl: state.apiUrl,
        sessionId: state.sessionId,
        insights: state.insights,
        mutations: state.mutations,
      }),
    }
  )
);

// ============================================================================
// HOOKS FOR COMPONENTS
// ============================================================================

export const useArenaSession = () => {
  const { sessionId, createSession, fetchAwareness } = useArenaStore();
  
  return {
    isActive: !!sessionId,
    sessionId,
    startSession: createSession,
    refreshAwareness: fetchAwareness,
  };
};

export const useAwarenessVisualization = () => {
  const { awareness, mutations, fetchAwareness } = useArenaStore();
  
  return {
    traceCount: awareness?.traceCount || 0,
    uniqueAgents: awareness?.uniqueAgents || 0,
    avgTension: awareness?.avgTension || 0,
    isAdapting: awareness?.fieldState?.isAdapting || false,
    mutations,
    recentActivity: awareness?.recentActivity || [],
    refresh: fetchAwareness,
  };
};