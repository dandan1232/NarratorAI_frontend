import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, Companion, ChatSession, Message, Memory, Voice } from '../types';

interface AppStore extends AppState {
  // User actions
  setUser: (user: User) => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;

  // Companion actions
  setCompanions: (companions: Companion[]) => void;
  addCompanion: (companion: Companion) => void;
  updateCompanion: (id: string, updates: Partial<Companion>) => void;
  deleteCompanion: (id: string) => void;
  setCurrentCompanion: (companion: Companion | null) => void;

  // Chat actions
  setSessions: (sessions: ChatSession[]) => void;
  addSession: (session: ChatSession) => void;
  updateSession: (id: string, updates: Partial<ChatSession>) => void;
  deleteSession: (id: string) => void;
  setCurrentSession: (session: ChatSession | null) => void;
  addMessage: (sessionId: string, message: Message) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void;

  // Memory actions
  setMemories: (memories: Memory[]) => void;
  addMemory: (memory: Memory) => void;
  deleteMemory: (id: string) => void;

  // Voice actions
  setVoices: (voices: Voice[]) => void;
  addVoice: (voice: Voice) => void;
  deleteVoice: (id: string) => void;

  // App actions
  setCurrentView: (view: AppState['currentView']) => void;
  setInitialized: (initialized: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: AppState = {
  user: null,
  isInitialized: false,
  currentView: 'welcome',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // User actions
      setUser: (user) => set({ user }),
      updateUserPreferences: (preferences) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, preferences: { ...state.user.preferences, ...preferences } }
            : null,
        })),

      // Companion actions
      setCompanions: (companions) => set({ companions }),
      addCompanion: (companion) =>
        set((state) => ({ companions: [...state.companions, companion] })),
      updateCompanion: (id, updates) =>
        set((state) => ({
          companions: state.companions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          currentCompanion:
            state.currentCompanion?.id === id
              ? { ...state.currentCompanion, ...updates }
              : state.currentCompanion,
        })),
      deleteCompanion: (id) =>
        set((state) => ({
          companions: state.companions.filter((c) => c.id !== id),
          currentCompanion: state.currentCompanion?.id === id ? null : state.currentCompanion,
        })),
      setCurrentCompanion: (companion) => set({ currentCompanion: companion }),

      // Chat actions
      setSessions: (sessions) => set({ sessions }),
      addSession: (session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),
      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
          currentSession:
            state.currentSession?.id === id
              ? { ...state.currentSession, ...updates }
              : state.currentSession,
        })),
      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSession: state.currentSession?.id === id ? null : state.currentSession,
        })),
      setCurrentSession: (session) => set({ currentSession: session }),
      addMessage: (sessionId, message) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, message], updatedAt: Date.now() }
              : s
          ),
          currentSession:
            state.currentSession?.id === sessionId
              ? {
                  ...state.currentSession,
                  messages: [...state.currentSession.messages, message],
                  updatedAt: Date.now(),
                }
              : state.currentSession,
        })),
      updateMessage: (sessionId, messageId, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === messageId ? { ...m, ...updates } : m
                  ),
                }
              : s
          ),
          currentSession:
            state.currentSession?.id === sessionId
              ? {
                  ...state.currentSession,
                  messages: state.currentSession.messages.map((m) =>
                    m.id === messageId ? { ...m, ...updates } : m
                  ),
                }
              : state.currentSession,
        })),

      // Memory actions
      setMemories: (memories) => set({ memories }),
      addMemory: (memory) =>
        set((state) => ({ memories: [...state.memories, memory] })),
      deleteMemory: (id) =>
        set((state) => ({ memories: state.memories.filter((m) => m.id !== id) })),

      // Voice actions
      setVoices: (voices) => set({ voices }),
      addVoice: (voice) => set((state) => ({ voices: [...state.voices, voice] })),
      deleteVoice: (id) =>
        set((state) => ({ voices: state.voices.filter((v) => v.id !== id) })),

      // App actions
      setCurrentView: (view) => set({ currentView: view }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'narrator-ai-storage',
      partialize: (state) => ({
        user: state.user,
        companions: state.companions,
        sessions: state.sessions,
        memories: state.memories,
        voices: state.voices,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
