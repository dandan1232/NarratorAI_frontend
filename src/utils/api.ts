const API_BASE_URL = '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Chat endpoints
  async sendMessage(
    companionId: string,
    message: string,
    sessionId?: string
  ): Promise<ApiResponse<{ response: string; emotion?: string; audioUrl?: string }>> {
    return this.request('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ companionId, message, sessionId }),
    });
  }

  async getChatHistory(sessionId: string): Promise<ApiResponse<{ messages: any[] }>> {
    return this.request(`/chat/history/${sessionId}`);
  }

  // TTS endpoints
  async synthesizeSpeech(
    text: string,
    voiceId: string,
    speed?: number,
    pitch?: number
  ): Promise<ApiResponse<{ audioUrl: string }>> {
    return this.request('/tts/synthesize', {
      method: 'POST',
      body: JSON.stringify({ text, voiceId, speed, pitch }),
    });
  }

  async getVoices(): Promise<ApiResponse<{ voices: any[] }>> {
    return this.request('/tts/voices');
  }

  // Voice Clone endpoints
  async cloneVoice(
    name: string,
    audioFile: File,
    description?: string
  ): Promise<ApiResponse<{ voiceId: string; previewUrl: string }>> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('audio', audioFile);
    if (description) formData.append('description', description);

    return this.request('/voice/clone', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  // Voice Design endpoints
  async designVoice(
    name: string,
    description: string,
    gender: string,
    age: string,
    style: string
  ): Promise<ApiResponse<{ voiceId: string; previewUrl: string }>> {
    return this.request('/voice/design', {
      method: 'POST',
      body: JSON.stringify({ name, description, gender, age, style }),
    });
  }

  // Companion endpoints
  async getCompanionSuggestions(): Promise<ApiResponse<{ companions: any[] }>> {
    return this.request('/companions/suggestions');
  }

  async generateCompanionResponse(
    companionId: string,
    personality: string,
    context: string
  ): Promise<ApiResponse<{ greeting: string; traits: string[] }>> {
    return this.request('/companions/generate', {
      method: 'POST',
      body: JSON.stringify({ companionId, personality, context }),
    });
  }

  // Memory endpoints
  async getMemories(companionId: string): Promise<ApiResponse<{ memories: any[] }>> {
    return this.request(`/memories/${companionId}`);
  }

  async addMemory(
    companionId: string,
    content: string,
    importance: number,
    tags: string[]
  ): Promise<ApiResponse<{ memory: any }>> {
    return this.request('/memories', {
      method: 'POST',
      body: JSON.stringify({ companionId, content, importance, tags }),
    });
  }

  // Emotion detection
  async detectEmotion(text: string): Promise<ApiResponse<{ emotion: string; confidence: number }>> {
    return this.request('/emotion/detect', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
