import { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Globe,
  Shield,
  Trash2,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUserPreferences, currentCompanion, updateCompanion } = useAppStore();
  const [companionName, setCompanionName] = useState(currentCompanion?.name || '');
  const [companionPersonality, setCompanionPersonality] = useState(
    currentCompanion?.personality || ''
  );

  if (!user) return null;

  const handleSaveCompanion = () => {
    if (currentCompanion) {
      updateCompanion(currentCompanion.id, {
        name: companionName,
        personality: companionPersonality,
      });
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold gradient-text mb-8">设置</h1>

        {/* User Settings */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold text-gray-800">个人信息</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                昵称
              </label>
              <input
                type="text"
                value={user.nickname}
                onChange={(e) =>
                  updateUserPreferences({} as any) // This needs a separate user update
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                placeholder="输入你的昵称"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold text-gray-800">偏好设置</h2>
          </div>

          <div className="space-y-4">
            {/* Theme */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                {user.preferences.theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-purple-500" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium text-gray-800">主题</p>
                  <p className="text-sm text-gray-500">
                    {user.preferences.theme === 'dark' ? '深色模式' : '浅色模式'}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  updateUserPreferences({
                    theme: user.preferences.theme === 'dark' ? 'light' : 'dark',
                  })
                }
                className={`px-4 py-2 rounded-lg transition-colors ${
                  user.preferences.theme === 'dark'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                切换
              </button>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-800">语言</p>
                  <p className="text-sm text-gray-500">
                    {user.preferences.language === 'zh' ? '中文' : 'English'}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  updateUserPreferences({
                    language: user.preferences.language === 'zh' ? 'en' : 'zh',
                  })
                }
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 transition-colors"
              >
                切换
              </button>
            </div>

            {/* TTS */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                {user.preferences.ttsEnabled ? (
                  <Volume2 className="w-5 h-5 text-green-500" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <p className="font-medium text-gray-800">语音播放</p>
                  <p className="text-sm text-gray-500">
                    {user.preferences.ttsEnabled ? '已开启' : '已关闭'}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  updateUserPreferences({
                    ttsEnabled: !user.preferences.ttsEnabled,
                  })
                }
                className={`px-4 py-2 rounded-lg transition-colors ${
                  user.preferences.ttsEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {user.preferences.ttsEnabled ? '开启' : '关闭'}
              </button>
            </div>

            {/* Auto Play Voice */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-800">自动播放语音</p>
                  <p className="text-sm text-gray-500">
                    {user.preferences.autoPlayVoice ? '已开启' : '已关闭'}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  updateUserPreferences({
                    autoPlayVoice: !user.preferences.autoPlayVoice,
                  })
                }
                className={`px-4 py-2 rounded-lg transition-colors ${
                  user.preferences.autoPlayVoice
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {user.preferences.autoPlayVoice ? '开启' : '关闭'}
              </button>
            </div>
          </div>
        </div>

        {/* Companion Settings */}
        {currentCompanion && (
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{currentCompanion.avatar}</span>
              <h2 className="text-xl font-semibold text-gray-800">
                {currentCompanion.name} 设置
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  名称
                </label>
                <input
                  type="text"
                  value={companionName}
                  onChange={(e) => setCompanionName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性格特点
                </label>
                <textarea
                  value={companionPersonality}
                  onChange={(e) => setCompanionPersonality(e.target.value)}
                  className="w-full h-24 px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none resize-none transition-colors"
                />
              </div>

              <button
                onClick={handleSaveCompanion}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                保存设置
              </button>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="glass rounded-2xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold text-red-600">危险区域</h2>
          </div>

          <p className="text-gray-600 mb-4">
            此操作将清除所有数据，包括聊天记录、伙伴设置等。此操作不可撤销。
          </p>

          <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
            清除所有数据
          </button>
        </div>
      </motion.div>
    </div>
  );
}
