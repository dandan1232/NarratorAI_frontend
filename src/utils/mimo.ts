// 使用代理路径，避免 CORS 问题
const MIMO_PROXY_PATH = '/mimo';

export interface MimoMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface MimoResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export interface MimoTTSRequest {
  text: string;
  voice_id?: string;
  speed?: number;
  pitch?: number;
}

class MimoClient {
  private proxyPath: string;

  constructor() {
    this.proxyPath = MIMO_PROXY_PATH;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.proxyPath}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MiMo API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // 对话补全 - 使用 MiMo-V2.5-Pro
  async chat(
    messages: MimoMessage[],
    systemPrompt?: string,
    model: string = 'mimo-v2.5-pro'
  ): Promise<string> {
    // 构建消息数组，确保格式正确
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: [
        {
          type: 'text',
          text: msg.content,
        },
      ],
    }));

    const body: any = {
      model,
      max_tokens: 2048,
      stream: false,
      messages: formattedMessages,
    };

    if (systemPrompt) {
      body.system = systemPrompt;
    }

    const response = await this.request<any>('/v1/messages', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    // 提取文本内容（跳过 thinking 部分）
    const textBlock = response.content?.find((block: any) => block.type === 'text');
    return textBlock?.text || '';
  }

  // 语音合成 - 使用 MiMo-V2.5-TTS
  async tts(
    text: string,
    voiceId?: string,
    model: string = 'MiMo-V2.5-TTS'
  ): Promise<ArrayBuffer> {
    const response = await fetch(`${this.proxyPath}/audio/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: text,
        voice: voiceId || 'alloy',
      }),
    });

    if (!response.ok) {
      throw new Error(`TTS error: ${response.status}`);
    }

    return response.arrayBuffer();
  }

  // 声音克隆 - 使用 MiMo-V2.5-TTS-VoiceClone
  async cloneVoice(
    name: string,
    audioFile: File,
    description?: string
  ): Promise<{ voice_id: string }> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('audio', audioFile);
    if (description) {
      formData.append('description', description);
    }

    const response = await fetch(`${this.proxyPath}/audio/voices/clone`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Voice clone error: ${response.status}`);
    }

    return response.json();
  }

  // 声音设计 - 使用 MiMo-V2.5-TTS-VoiceDesign
  async designVoice(
    name: string,
    description: string,
    gender: 'male' | 'female' | 'neutral',
    age: 'young' | 'middle' | 'old',
    style: string
  ): Promise<{ voice_id: string }> {
    const response = await fetch(`${this.proxyPath}/audio/voices/design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        gender,
        age,
        style,
      }),
    });

    if (!response.ok) {
      throw new Error(`Voice design error: ${response.status}`);
    }

    return response.json();
  }

  // 情绪检测
  async detectEmotion(text: string): Promise<{ emotion: string; confidence: number }> {
    const response = await this.chat(
      [{ role: 'user', content: text }],
      `你是一个情绪分析助手。请分析用户文本的情绪，返回 JSON 格式：
      {
        "emotion": "happy|sad|angry|surprised|fearful|neutral|loving|excited|anxious|grateful",
        "confidence": 0.0-1.0
      }
      只返回 JSON，不要其他内容。`
    );

    try {
      return JSON.parse(response);
    } catch {
      return { emotion: 'neutral', confidence: 0.5 };
    }
  }
}

export const mimoClient = new MimoClient();
