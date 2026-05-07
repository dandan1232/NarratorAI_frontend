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

  // Phase 1: CyberPersona 设计理念
  characterCard: CharacterCard;
  affection: AffectionSystem;
  memory: MemorySystem;
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

// ==================== Phase 1: CyberPersona 设计理念 ====================

// 人格维度（简化版大五人格）
export interface PersonalityProfile {
  openness: number;        // 开放性 0-100: 好奇 vs 保守
  extraversion: number;    // 外向性 0-100: 主动 vs 内向
  agreeableness: number;   // 宜人性 0-100: 温柔 vs 直率
  neuroticism: number;     // 神经质 0-100: 敏感 vs 稳定
  conscientiousness: number; // 尽责性 0-100: 认真 vs 随性
}

// 量子态角色卡（对话中逐步坍缩）
export interface CharacterCard {
  // 不可变部分（创建时设定）
  basePersonality: PersonalityProfile;
  archetype: string;  // 人格原型名，如"温柔治愈型"、"古灵精怪型"

  // 量子态部分（对话中逐步填充）
  identity: {
    age?: string;
    hometown?: string;
    profession?: string;
    [key: string]: string | undefined;
  };
  preferences: {
    likes: string[];
    dislikes: string[];
  };
  innerWorld: string[];  // 心事、想法
  habits: string[];      // 习惯、口头禅

  // 收集进度
  collectionProgress: {
    identity: number;    // 已收集的身份数量
    preferences: number; // 已收集的喜好数量
    innerWorld: number;  // 已收集的心事数量
    habits: number;      // 已收集的习惯数量
  };
}

// 好感度等级
export type AffectionLevel =
  | 'stranger'      // 陌生 0-150
  | 'acquaintance'  // 认识 151-300
  | 'friendly'      // 友好 301-500
  | 'close'         // 亲密 501-700
  | 'crush'         // 心动 701-900
  | 'lover';        // 恋人 901-1000

// 好感度系统
export interface AffectionSystem {
  points: number;           // 0-1000
  level: AffectionLevel;
  lastInteraction: number;  // 上次互动时间
  dailyTasks: DailyTask[];  // 每日任务
}

// 每日任务
export interface DailyTask {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  reward: number;  // 好感度奖励
}

// 记忆系统
export interface MemorySystem {
  // 短期记忆（当前会话上下文）
  shortTerm: Message[];

  // 长期记忆（跨会话）
  sessionSummaries: SessionSummary[];  // 最近 5 次会话摘要
  emotionalMemories: EmotionalMemory[]; // 情绪记忆
  revealedFacts: RevealedFact[];        // 已揭示的事实
}

// 会话摘要
export interface SessionSummary {
  id: string;
  sessionId: string;
  summary: string;
  keyEvents: string[];
  emotionTrend: string;
  timestamp: number;
}

// 情绪记忆
export interface EmotionalMemory {
  id: string;
  content: string;
  emotion: EmotionType;
  intensity: number;  // 1-5
  timestamp: number;
}

// 已揭示的事实
export interface RevealedFact {
  id: string;
  category: 'identity' | 'preference' | 'innerWorld' | 'habit';
  content: string;
  timestamp: number;
}
