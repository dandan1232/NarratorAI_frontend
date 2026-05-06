export interface User {
  id: string;
  nickname: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  ttsEnabled: boolean;
  autoPlayVoice: boolean;
}

export interface Companion {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  voiceId?: string;
  voiceSettings?: VoiceSettings;
  relationship: RelationshipType;
  description: string;
  traits: string[];
  greeting: string;
}

export type RelationshipType =
  | 'friend'
  | 'boyfriend'
  | 'girlfriend'
  | 'mentor'
  | 'counselor'
  | 'custom';

export interface VoiceSettings {
  voiceId: string;
  speed: number;
  pitch: number;
  volume: number;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  emotion?: EmotionType;
  audioUrl?: string;
  isPlaying?: boolean;
  stickerUrl?: string;
}

export type EmotionType =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'fearful'
  | 'neutral'
  | 'loving'
  | 'excited'
  | 'anxious'
  | 'grateful';

export interface ChatSession {
  id: string;
  companionId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  summary?: string;
}

export interface VoiceCloneRequest {
  name: string;
  audioFile: File;
  description?: string;
}

export interface VoiceDesignRequest {
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'middle' | 'old';
  style: string;
}

export interface TTSRequest {
  text: string;
  voiceId: string;
  speed?: number;
  pitch?: number;
}

export interface Memory {
  id: string;
  companionId: string;
  content: string;
  importance: number;
  timestamp: number;
  tags: string[];
}

export interface CompanionState {
  companions: Companion[];
  currentCompanion: Companion | null;
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  memories: Memory[];
  voices: Voice[];
  isLoading: boolean;
  error: string | null;
}

export interface Voice {
  id: string;
  name: string;
  type: 'system' | 'cloned' | 'designed';
  previewUrl?: string;
  settings?: VoiceSettings;
}

export interface AppState {
  user: User | null;
  isInitialized: boolean;
  currentView: 'welcome' | 'setup' | 'chat' | 'settings' | 'voice';
}
