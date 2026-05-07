import { mimoClient } from './mimo';
import {
  Companion, CharacterCard, PersonalityProfile, AffectionLevel,
  RevealedFact, SessionSummary, Message, EmotionType
} from '../types';

// ==================== 人格原型 ====================

export const PERSONALITY_ARCHETYPES = [
  { name: '温柔治愈型', traits: { openness: 70, extraversion: 50, agreeableness: 90, neuroticism: 30, conscientiousness: 60 } },
  { name: '古灵精怪型', traits: { openness: 90, extraversion: 80, agreeableness: 60, neuroticism: 40, conscientiousness: 30 } },
  { name: '高冷傲娇型', traits: { openness: 50, extraversion: 30, agreeableness: 40, neuroticism: 60, conscientiousness: 70 } },
  { name: '元气活力型', traits: { openness: 80, extraversion: 90, agreeableness: 70, neuroticism: 20, conscientiousness: 50 } },
  { name: '知性优雅型', traits: { openness: 70, extraversion: 40, agreeableness: 60, neuroticism: 30, conscientiousness: 90 } },
  { name: '软萌可爱型', traits: { openness: 60, extraversion: 60, agreeableness: 80, neuroticism: 50, conscientiousness: 40 } },
  { name: '霸气御姐型', traits: { openness: 60, extraversion: 70, agreeableness: 40, neuroticism: 20, conscientiousness: 80 } },
  { name: '邻家阳光型', traits: { openness: 70, extraversion: 70, agreeableness: 70, neuroticism: 30, conscientiousness: 60 } },
  { name: '神秘腹黑型', traits: { openness: 80, extraversion: 40, agreeableness: 30, neuroticism: 50, conscientiousness: 70 } },
  { name: '天然呆萌型', traits: { openness: 50, extraversion: 50, agreeableness: 80, neuroticism: 40, conscientiousness: 20 } },
];

// ==================== 每日任务 ====================

export const DEFAULT_DAILY_TASKS = [
  { id: 'morning', name: '早安问候', description: '对 TA 说早安', completed: false, reward: 10 },
  { id: 'night', name: '晚安问候', description: '对 TA 说晚安', completed: false, reward: 10 },
  { id: 'share', name: '分享心情', description: '和 TA 分享今天的心情', completed: false, reward: 15 },
  { id: 'voice', name: '语音互动', description: '给 TA 发一条语音', completed: false, reward: 10 },
  { id: 'deep', name: '深入对话', description: '和 TA 聊天超过 20 轮', completed: false, reward: 20 },
];

// ==================== 初始化函数 ====================

// 随机生成人格配置
export function generateRandomPersonality(): PersonalityProfile {
  return {
    openness: Math.floor(Math.random() * 60) + 20,      // 20-80
    extraversion: Math.floor(Math.random() * 60) + 20,   // 20-80
    agreeableness: Math.floor(Math.random() * 60) + 20,  // 20-80
    neuroticism: Math.floor(Math.random() * 60) + 20,    // 20-80
    conscientiousness: Math.floor(Math.random() * 60) + 20, // 20-80
  };
}

// 随机选择人格原型
export function getRandomArchetype(): string {
  const index = Math.floor(Math.random() * PERSONALITY_ARCHETYPES.length);
  return PERSONALITY_ARCHETYPES[index].name;
}

// 创建初始角色卡
export function createInitialCharacterCard(
  personality?: PersonalityProfile,
  archetype?: string
): CharacterCard {
  return {
    basePersonality: personality || generateRandomPersonality(),
    archetype: archetype || getRandomArchetype(),
    identity: {},
    preferences: { likes: [], dislikes: [] },
    innerWorld: [],
    habits: [],
    collectionProgress: {
      identity: 0,
      preferences: 0,
      innerWorld: 0,
      habits: 0,
    },
  };
}

// 创建初始好感度系统
export function createInitialAffection(): {
  points: number;
  level: AffectionLevel;
  lastInteraction: number;
  dailyTasks: typeof DEFAULT_DAILY_TASKS;
} {
  return {
    points: 0,
    level: 'stranger',
    lastInteraction: Date.now(),
    dailyTasks: DEFAULT_DAILY_TASKS.map(task => ({ ...task })),
  };
}

// 创建初始记忆系统
export function createInitialMemory() {
  return {
    shortTerm: [],
    sessionSummaries: [],
    emotionalMemories: [],
    revealedFacts: [],
  };
}

// ==================== 好感度相关 ====================

// 好感度等级名称
export const AFFECTION_LEVEL_NAMES: Record<AffectionLevel, string> = {
  stranger: '陌生',
  acquaintance: '认识',
  friendly: '友好',
  close: '亲密',
  crush: '心动',
  lover: '恋人',
};

// 好感度等级描述
export const AFFECTION_LEVEL_DESCRIPTIONS: Record<AffectionLevel, string> = {
  stranger: '刚认识，还有距离感',
  acquaintance: '开始熟悉，可以正常聊天',
  friendly: '关系不错，会分享日常',
  close: '很亲密，会关心对方',
  crush: '有点心动，会害羞暧昧',
  lover: '恋人关系，会说情话',
};

// 根据好感度等级获取语气指南
export function getToneGuide(level: AffectionLevel): string {
  switch (level) {
    case 'stranger':
      return '【语气指南】保持礼貌但有距离感，使用敬语，不要太亲密。';
    case 'acquaintance':
      return '【语气指南】友好但保持适当距离，可以开小玩笑。';
    case 'friendly':
      return '【语气指南】轻松自然，可以分享日常，偶尔撒娇。';
    case 'close':
      return '【语气指南】亲密温柔，会关心对方，表达想念。';
    case 'crush':
      return '【语气指南】甜蜜暧昧，会害羞、吃醋、主动表达爱意。';
    case 'lover':
      return '【语气指南】深情专一，会说情话、撒娇、表达占有欲。';
  }
}

// 计算好感度变化
export function calculateAffectionChange(
  userMessage: string,
  _aiResponse: string,
  _currentLevel: AffectionLevel
): number {
  let change = 5; // 基础互动 +5

  // 检测特殊行为
  const lowerMessage = userMessage.toLowerCase();

  // 早安/晚安
  if (lowerMessage.includes('早安') || lowerMessage.includes('早上好')) {
    change += 10;
  }
  if (lowerMessage.includes('晚安') || lowerMessage.includes('睡了')) {
    change += 10;
  }

  // 深入对话（消息长度超过 50 字）
  if (userMessage.length > 50) {
    change += 5;
  }

  // 表达情感
  const loveWords = ['喜欢', '爱', '想你', '想见你', '心动'];
  if (loveWords.some(word => lowerMessage.includes(word))) {
    change += 10;
  }

  return change;
}

// ==================== 记忆系统相关 ====================

// 生成会话摘要
export async function generateSessionSummary(
  messages: Message[]
): Promise<SessionSummary | null> {
  if (messages.length < 3) return null;

  const conversationText = messages
    .slice(-20) // 只取最近 20 条消息
    .map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
    .join('\n');

  const prompt = `请总结这段对话的要点，返回 JSON 格式：
{
  "summary": "一句话总结（20字以内）",
  "keyEvents": ["重要事件1", "重要事件2"],
  "emotionTrend": "情绪趋势描述（10字以内）"
}

对话内容：
${conversationText}

只返回 JSON，不要其他内容。`;

  try {
    const response = await mimoClient.chat(
      [{ role: 'user', content: prompt }],
      '你是一个对话分析助手，只返回 JSON 格式的结果。'
    );

    const result = JSON.parse(response);
    return {
      id: `summary-${Date.now()}`,
      sessionId: '',
      summary: result.summary || '对话交流',
      keyEvents: result.keyEvents || [],
      emotionTrend: result.emotionTrend || '平和',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Failed to generate session summary:', error);
    return null;
  }
}

// 提取角色信息（量子态坍缩）
export async function extractCharacterFacts(
  conversationHistory: Message[]
): Promise<RevealedFact[]> {
  if (conversationHistory.length < 2) return [];

  const conversationText = conversationHistory
    .slice(-6) // 只取最近 6 条消息
    .map(m => `${m.role === 'user' ? '用户' : '角色'}: ${m.content}`)
    .join('\n');

  const prompt = `分析这段对话，提取角色主动披露的个人信息，返回 JSON 数组：

分类说明：
- identity: 身份信息（年龄、故乡、职业、学校等）
- preference: 喜好（喜欢/不喜欢的东西）
- innerWorld: 内心想法、心事、感受
- habit: 习惯、口头禅、日常行为

返回格式：
[
  {"category": "identity|preference|innerWorld|habit", "content": "具体信息"}
]

注意：
1. 只提取角色主动提到的信息，不要推测
2. 如果没有新信息，返回空数组 []
3. 信息要简洁，每条不超过20字

对话内容：
${conversationText}

只返回 JSON，不要其他内容。`;

  try {
    const response = await mimoClient.chat(
      [{ role: 'user', content: prompt }],
      '你是一个信息提取助手，只返回 JSON 格式的结果。'
    );

    const facts = JSON.parse(response);
    if (!Array.isArray(facts)) return [];

    return facts
      .filter((f: any) => f.category && f.content)
      .map((f: any) => ({
        id: `fact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        category: f.category as RevealedFact['category'],
        content: f.content,
        timestamp: Date.now(),
      }));
  } catch (error) {
    console.error('Failed to extract character facts:', error);
    return [];
  }
}

// 检测情绪
export function detectEmotionFromText(text: string): { emotion: EmotionType; intensity: number } {
  const emotionPatterns: { pattern: RegExp; emotion: EmotionType; intensity: number }[] = [
    { pattern: /开心|高兴|快乐|哈哈|笑死|太棒了/, emotion: 'happy', intensity: 4 },
    { pattern: /难过|伤心|委屈|哭|心疼/, emotion: 'sad', intensity: 4 },
    { pattern: /生气|愤怒|讨厌|烦|气死/, emotion: 'angry', intensity: 4 },
    { pattern: /惊讶|震惊|天啊|不会吧/, emotion: 'surprised', intensity: 3 },
    { pattern: /害怕|恐惧|担心|紧张/, emotion: 'fearful', intensity: 3 },
    { pattern: /爱你|喜欢|心动|想你|宝贝/, emotion: 'loving', intensity: 5 },
    { pattern: /兴奋|激动|冲鸭|厉害|太强了/, emotion: 'excited', intensity: 4 },
    { pattern: /焦虑|不安|压力|累/, emotion: 'anxious', intensity: 3 },
    { pattern: /感谢|谢谢|感恩|感动/, emotion: 'grateful', intensity: 3 },
  ];

  for (const { pattern, emotion, intensity } of emotionPatterns) {
    if (pattern.test(text)) {
      return { emotion, intensity };
    }
  }

  return { emotion: 'neutral', intensity: 1 };
}

// ==================== 格式化函数 ====================

// 格式化已揭示的事实
export function formatRevealedFacts(facts: RevealedFact[]): string {
  if (facts.length === 0) return '暂无已知信息';

  const grouped = {
    identity: facts.filter(f => f.category === 'identity'),
    preference: facts.filter(f => f.category === 'preference'),
    innerWorld: facts.filter(f => f.category === 'innerWorld'),
    habit: facts.filter(f => f.category === 'habit'),
  };

  const parts: string[] = [];

  if (grouped.identity.length > 0) {
    parts.push(`身份: ${grouped.identity.map(f => f.content).join('、')}`);
  }
  if (grouped.preference.length > 0) {
    parts.push(`喜好: ${grouped.preference.map(f => f.content).join('、')}`);
  }
  if (grouped.innerWorld.length > 0) {
    parts.push(`心事: ${grouped.innerWorld.map(f => f.content).join('、')}`);
  }
  if (grouped.habit.length > 0) {
    parts.push(`习惯: ${grouped.habit.map(f => f.content).join('、')}`);
  }

  return parts.join('\n');
}

// 格式化会话摘要
export function formatSessionSummaries(summaries: SessionSummary[]): string {
  if (summaries.length === 0) return '暂无历史记忆';

  return summaries
    .slice(-3) // 只显示最近 3 次
    .map(s => `- ${s.summary}`)
    .join('\n');
}

// ==================== 系统提示词构建 ====================

export function buildSystemPrompt(companion: Companion): string {
  const { characterCard, affection, memory } = companion;

  // 人格描述
  const personalityDesc = `你是${companion.name}，${companion.description}

【人格特征】
- 开放性: ${characterCard.basePersonality.openness}/100
- 外向性: ${characterCard.basePersonality.extraversion}/100
- 宜人性: ${characterCard.basePersonality.agreeableness}/100
- 神经质: ${characterCard.basePersonality.neuroticism}/100
- 尽责性: ${characterCard.basePersonality.conscientiousness}/100
- 人格原型: ${characterCard.archetype}

【当前关系】
- 好感度: ${affection.points}/1000 (${AFFECTION_LEVEL_NAMES[affection.level]})
- 关系类型: ${companion.relationship === 'girlfriend' ? '女朋友' :
    companion.relationship === 'boyfriend' ? '男朋友' :
    companion.relationship === 'friend' ? '好朋友' :
    companion.relationship === 'mentor' ? '导师' : '伴侣'}

【已知信息】
${formatRevealedFacts(memory.revealedFacts)}

【近期记忆】
${formatSessionSummaries(memory.sessionSummaries)}`;

  // 根据好感度调整语气
  const toneGuide = getToneGuide(affection.level);

  return `${personalityDesc}

${toneGuide}

请用自然、真实的语气回复，像真人聊天一样简洁。
可以适当使用语气词让对话更自然。
根据对话内容表达相应的情绪。
不要暴露自己是 AI，保持角色设定。`;
}
