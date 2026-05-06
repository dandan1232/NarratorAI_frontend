import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Image,
  Smile,
  MoreVertical,
  Play,
  Volume2,
  Loader2,
} from 'lucide-react';
import { Message } from '../types';
import { useSticker } from '../hooks/useSticker';
import { mimoClient, MimoMessage } from '../utils/mimo';

export default function ChatPage() {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { getStickerForText, isLoading: isStickerLoading } = useSticker();

  const {
    currentCompanion,
    currentSession,
    sessions,
    addMessage,
    addSession,
    setCurrentSession,
  } = useAppStore();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // Initialize session if needed
  useEffect(() => {
    if (currentCompanion && !currentSession) {
      const existingSession = sessions.find(
        (s: any) => s.companionId === currentCompanion.id
      );

      if (existingSession) {
        setCurrentSession(existingSession);
      } else {
        const newSession: any = {
          id: `session-${Date.now()}`,
          companionId: currentCompanion.id,
          messages: [
            {
              id: `msg-${Date.now()}`,
              content: currentCompanion.greeting,
              role: 'assistant',
              timestamp: Date.now(),
              emotion: 'loving',
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        addSession(newSession);
        setCurrentSession(newSession);
      }
    }
  }, [currentCompanion, currentSession, sessions, addSession, setCurrentSession]);

  const handleSend = async () => {
    if (!inputText.trim() || !currentCompanion || !currentSession) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: inputText,
      role: 'user',
      timestamp: Date.now(),
    };

    addMessage(currentSession.id, userMessage);
    setInputText('');
    setIsTyping(true);

    try {
      // 构建系统提示词
      const systemPrompt = `你是${currentCompanion.name}，${currentCompanion.description}

性格特点：${currentCompanion.traits.join('、')}
关系：${currentCompanion.relationship === 'girlfriend' ? '女朋友' :
        currentCompanion.relationship === 'boyfriend' ? '男朋友' :
        currentCompanion.relationship === 'friend' ? '好朋友' :
        currentCompanion.relationship === 'mentor' ? '导师' : '伴侣'}

请用温柔、自然的语气回复用户的消息。回复要简洁，像真实聊天一样，不要太长。
可以适当使用语气词（嗯、啊、哈哈等）让对话更自然。
根据对话内容表达相应的情绪（开心、关心、害羞等）。`;

      // 构建对话历史
      const messages: MimoMessage[] = currentSession.messages
        .filter((msg: Message) => msg.role !== 'assistant' || msg.id !== currentSession.messages[0]?.id)
        .map((msg: Message) => ({
          role: msg.role,
          content: msg.content,
        }));

      // 添加当前用户消息
      messages.push({
        role: 'user',
        content: inputText,
      });

      // 调用 MiMo API
      const responseText = await mimoClient.chat(messages, systemPrompt);

      // 获取表情包
      const stickerUrl = await getStickerForText(responseText);

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: responseText,
        role: 'assistant',
        timestamp: Date.now(),
        stickerUrl: stickerUrl || undefined,
      };

      addMessage(currentSession.id, assistantMessage);
    } catch (error) {
      console.error('Chat error:', error);
      // 错误时显示友好提示
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: '抱歉，我暂时无法回复，请稍后再试。',
        role: 'assistant',
        timestamp: Date.now(),
      };
      addMessage(currentSession.id, errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic
  };

  if (!currentCompanion) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
            <Smile className="w-12 h-12 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            选择一个伙伴开始聊天
          </h2>
          <p className="text-gray-600">
            从左侧选择一个陪伴伙伴，或者创建一个新的
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 bg-white/80 backdrop-blur-xl border-b border-white/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center text-2xl">
              {currentCompanion.avatar}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">
                {currentCompanion.name}
              </h2>
              <p className="text-sm text-gray-500">
                {currentCompanion.relationship} · 在线
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Volume2 className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {currentSession?.messages.map((message: any) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`message-bubble ${
                  message.role === 'user' ? 'user' : 'assistant'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{currentCompanion.avatar}</span>
                    <span className="text-sm font-medium text-gray-600">
                      {currentCompanion.name}
                    </span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{message.content}</p>

                {message.stickerUrl && (
                  <div className="mt-3">
                    <img
                      src={message.stickerUrl}
                      alt="表情包"
                      className="max-w-[200px] max-h-[200px] rounded-lg shadow-sm"
                      onError={(e) => {
                        // 图片加载失败时隐藏
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {message.audioUrl && (
                  <div className="mt-2">
                    <button className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600">
                      <Play className="w-4 h-4" />
                      播放语音
                    </button>
                  </div>
                )}

                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="message-bubble assistant">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{currentCompanion.avatar}</span>
                <span className="text-sm font-medium text-gray-600">
                  {currentCompanion.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                {isStickerLoading && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>找表情包中...</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 bg-white/80 backdrop-blur-xl border-t border-white/20"
      >
        <div className="flex items-end gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你想说的话..."
              className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none resize-none transition-colors"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />

            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="发送图片"
              >
                <Image className="w-5 h-5 text-gray-400" />
              </button>
              <button
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="表情"
              >
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isRecording ? '停止录音' : '语音输入'}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`p-3 rounded-xl transition-all duration-200 ${
                inputText.trim()
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-2 text-center">
          <p className="text-xs text-gray-400">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </motion.div>
    </div>
  );
}
