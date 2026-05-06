import { useState, useCallback } from 'react';

interface StickerResult {
  thumbSrc: string;
}

// 情绪关键词映射
const emotionKeywords: Record<string, string[]> = {
  // 正面情绪
  happy: ['开心', '高兴', '快乐', '哈哈', '笑死'],
  love: ['爱你', '喜欢', '心动', '害羞', '脸红'],
  excited: ['加油', '冲鸭', '厉害', '棒', '太强了'],
  grateful: ['谢谢', '感谢', '感恩', '么么哒'],

  // 负面情绪
  sad: ['难过', '伤心', '委屈', '抱抱', '哭哭'],
  angry: ['生气', '哼', '讨厌', '气死', '怒'],
  anxious: ['紧张', '焦虑', '担心', '害怕'],

  // 中性
  thinking: ['思考', '嗯', '让我想想', 'emmm'],
  greeting: ['你好', '早安', '晚安', '嗨'],
  surprised: ['震惊', '天啊', '不会吧', '惊呆了'],
};

export function useSticker() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSticker, setCurrentSticker] = useState<string | null>(null);

  // 从文本中提取情绪关键词
  const extractEmotionKeyword = useCallback((text: string): string | null => {
    const lowerText = text.toLowerCase();

    // 遍历情绪关键词映射
    for (const [, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          // 返回该情绪类别下的随机一个关键词
          return keywords[Math.floor(Math.random() * keywords.length)];
        }
      }
    }

    // 如果没有匹配到，尝试从文本中提取可能的关键词
    const commonWords = ['开心', '难过', '生气', '喜欢', '讨厌', '谢谢', '加油', '抱抱'];
    for (const word of commonWords) {
      if (lowerText.includes(word)) {
        return word;
      }
    }

    return null;
  }, []);

  // 搜索表情包
  const searchSticker = useCallback(async (keyword: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.tangdouz.com/a/biaoq.php?return=json&nr=${encodeURIComponent(keyword)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch sticker');
      }

      const data: StickerResult[] = await response.json();

      if (data && data.length > 0) {
        // 随机选取一张
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex].thumbSrc;
      }

      return null;
    } catch (error) {
      console.error('Error fetching sticker:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 根据文本自动搜索表情包
  const getStickerForText = useCallback(async (text: string): Promise<string | null> => {
    const keyword = extractEmotionKeyword(text);

    if (!keyword) {
      return null;
    }

    let stickerUrl = await searchSticker(keyword);

    // 如果第一次搜索失败，尝试用近义词重试
    if (!stickerUrl) {
      const synonyms: Record<string, string[]> = {
        '开心': ['高兴', '快乐'],
        '难过': ['伤心', '委屈'],
        '生气': ['愤怒', '气死'],
        '喜欢': ['爱', '心动'],
      };

      const retryKeywords = synonyms[keyword] || [];
      for (const retryKeyword of retryKeywords) {
        stickerUrl = await searchSticker(retryKeyword);
        if (stickerUrl) break;
      }
    }

    setCurrentSticker(stickerUrl);
    return stickerUrl;
  }, [extractEmotionKeyword, searchSticker]);

  // 清除当前表情包
  const clearSticker = useCallback(() => {
    setCurrentSticker(null);
  }, []);

  return {
    isLoading,
    currentSticker,
    getStickerForText,
    clearSticker,
    searchSticker,
    extractEmotionKeyword,
  };
}
