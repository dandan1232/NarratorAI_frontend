import { useState, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Upload,
  Wand2,
  Play,
  Pause,
  Volume2,
  Trash2,
  Plus,
  Settings,
  Check,
} from 'lucide-react';

export default function VoicePage() {
  const [activeTab, setActiveTab] = useState<'clone' | 'design' | 'library'>('clone');
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [voiceDescription, setVoiceDescription] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'neutral'>('female');
  const [age, setAge] = useState<'young' | 'middle' | 'old'>('young');
  const [style, setStyle] = useState('温柔');
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { voices, addVoice, deleteVoice, currentCompanion, updateCompanion } = useAppStore();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleCloneVoice = async () => {
    if (!audioFile || !voiceName) return;

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const newVoice = {
        id: `voice-${Date.now()}`,
        name: voiceName,
        type: 'cloned' as const,
        previewUrl: URL.createObjectURL(audioFile),
      };

      addVoice(newVoice);
      setVoiceName('');
      setAudioFile(null);
      setIsProcessing(false);
    }, 2000);
  };

  const handleDesignVoice = async () => {
    if (!voiceName || !voiceDescription) return;

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const newVoice = {
        id: `voice-${Date.now()}`,
        name: voiceName,
        type: 'designed' as const,
        settings: {
          voiceId: `designed-${Date.now()}`,
          speed: 1,
          pitch: 1,
          volume: 1,
        },
      };

      addVoice(newVoice);
      setVoiceName('');
      setVoiceDescription('');
      setIsProcessing(false);
    }, 2000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement actual recording logic
  };

  const handleSetCompanionVoice = (voiceId: string) => {
    if (currentCompanion) {
      updateCompanion(currentCompanion.id, {
        voiceId,
        voiceSettings: {
          voiceId,
          speed: 1,
          pitch: 1,
          volume: 1,
        },
      });
    }
  };

  const tabs = [
    { id: 'clone' as const, label: '声音克隆', icon: Mic },
    { id: 'design' as const, label: '声音设计', icon: Wand2 },
    { id: 'library' as const, label: '声音库', icon: Volume2 },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">声音中心</h1>
        <p className="text-gray-600 mb-8">定制专属于你的声音，让陪伴更加真实</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'glass hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'clone' && (
            <motion.div
              key="clone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">声音克隆</h2>
              <p className="text-gray-600 mb-8">
                上传一段音频，AI 将学习并克隆这个声音
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div>
                  <div
                    className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {audioFile ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="font-medium text-gray-800">{audioFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-pink-400" />
                        <p className="font-medium text-gray-800">点击或拖拽上传音频</p>
                        <p className="text-sm text-gray-500">
                          支持 MP3、WAV、M4A 格式，建议 10-30 秒
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Record Option */}
                  <div className="mt-4">
                    <button
                      onClick={toggleRecording}
                      className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                        isRecording
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                          录制中... 点击停止
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          或者直接录制
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Settings Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      声音名称
                    </label>
                    <input
                      type="text"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      placeholder="给这个声音起个名字"
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleCloneVoice}
                    disabled={!audioFile || !voiceName || isProcessing}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                      !audioFile || !voiceName || isProcessing
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        开始克隆
                      </>
                    )}
                  </button>

                  <div className="p-4 rounded-xl bg-blue-50">
                    <h4 className="font-medium text-blue-800 mb-2">使用提示</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 音频越清晰，克隆效果越好</li>
                      <li>• 建议在安静环境下录制</li>
                      <li>• 10-30 秒的语音片段最佳</li>
                      <li>• 克隆后可以调整语速和音调</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'design' && (
            <motion.div
              key="design"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">声音设计</h2>
              <p className="text-gray-600 mb-8">
                通过文字描述，AI 将为你生成独特的声音
              </p>

              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    声音名称
                  </label>
                  <input
                    type="text"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    placeholder="给这个声音起个名字"
                    className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    声音描述
                  </label>
                  <textarea
                    value={voiceDescription}
                    onChange={(e) => setVoiceDescription(e.target.value)}
                    placeholder="描述你想要的声音，例如：温柔的女声，带有治愈感..."
                    className="w-full h-24 px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none resize-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      性别
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                    >
                      <option value="female">女声</option>
                      <option value="male">男声</option>
                      <option value="neutral">中性</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      年龄
                    </label>
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                    >
                      <option value="young">年轻</option>
                      <option value="middle">中年</option>
                      <option value="old">成熟</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      风格
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                    >
                      <option value="温柔">温柔</option>
                      <option value="活泼">活泼</option>
                      <option value="成熟">成熟</option>
                      <option value="甜美">甜美</option>
                      <option value="磁性">磁性</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleDesignVoice}
                  disabled={!voiceName || !voiceDescription || isProcessing}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${
                    !voiceName || !voiceDescription || isProcessing
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      生成声音
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">声音库</h2>
                  <p className="text-gray-600">管理你的声音资源</p>
                </div>
                <button
                  onClick={() => setActiveTab('clone')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  添加声音
                </button>
              </div>

              {voices.length === 0 ? (
                <div className="text-center py-12">
                  <Volume2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    还没有声音
                  </h3>
                  <p className="text-gray-500">
                    克隆或设计你的第一个声音
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {voices.map((voice) => (
                    <motion.div
                      key={voice.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800">{voice.name}</h4>
                          <p className="text-sm text-gray-500">
                            {voice.type === 'cloned' ? '克隆声音' : '设计声音'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPlayingId(playingId === voice.id ? null : voice.id)}
                            className="p-2 rounded-lg hover:bg-white transition-colors"
                          >
                            {playingId === voice.id ? (
                              <Pause className="w-5 h-5 text-pink-500" />
                            ) : (
                              <Play className="w-5 h-5 text-pink-500" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSetCompanionVoice(voice.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              currentCompanion?.voiceId === voice.id
                                ? 'bg-green-100 text-green-600'
                                : 'hover:bg-white text-gray-500'
                            }`}
                            title="设为伙伴声音"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteVoice(voice.id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Voice visualization placeholder */}
                      <div className="h-12 bg-white rounded-lg flex items-center justify-center">
                        <div className="flex items-end gap-1 h-8">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-pink-400 rounded-full animate-pulse"
                              style={{
                                height: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
