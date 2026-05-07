import { motion } from 'framer-motion';
import { X, Heart, Shield, Users, Link, Lock, Zap, Award } from 'lucide-react';
import { Companion } from '../types';
import {
  RELATIONSHIP_LEVEL_NAMES,
  RELATIONSHIP_DIMENSION_NAMES,
  AFFECTION_LEVEL_NAMES,
} from '../utils/characterAnalyzer';

interface RelationshipPanelProps {
  companion: Companion;
  onClose: () => void;
}

const dimensionIcons: Record<string, typeof Heart> = {
  trust: Shield,
  security: Lock,
  closeness: Users,
  neediness: Link,
  possessiveness: Heart,
};

const emotionEmoji: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😲',
  fearful: '😨',
  neutral: '😐',
  loving: '🥰',
  excited: '🤩',
  anxious: '😰',
  grateful: '🙏',
};

export function RelationshipPanel({ companion, onClose }: RelationshipPanelProps) {
  const { relationshipSystem, emotionalDepth, affection, achievements } = companion;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 h-full bg-white/95 backdrop-blur-xl border-l border-white/20 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">关系档案</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Affection */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-pink-500" />
          <span className="font-medium text-gray-700">好感度</span>
          <span className="ml-auto text-sm text-gray-500">
            {AFFECTION_LEVEL_NAMES[affection.level]}
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${affection.points / 10}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <div className="text-right text-xs text-gray-400 mt-1">
          {affection.points} / 1000
        </div>
      </div>

      {/* Relationship Dimensions */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-700">关系维度</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
            {RELATIONSHIP_LEVEL_NAMES[relationshipSystem.overallLevel]}
          </span>
        </div>

        <div className="space-y-3">
          {Object.entries(relationshipSystem.dimensions).map(([key, value]) => {
            const Icon = dimensionIcons[key] || Heart;
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {RELATIONSHIP_DIMENSION_NAMES[key as keyof typeof RELATIONSHIP_DIMENSION_NAMES]}
                  </span>
                  <span className="ml-auto text-xs font-medium text-gray-600">{value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emotional State */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span className="font-medium text-gray-700">情绪状态</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">
            {emotionEmoji[emotionalDepth.state.currentEmotion] || '😐'}
          </span>
          <div>
            <div className="text-sm font-medium text-gray-700">
              {emotionalDepth.state.currentEmotion === 'happy' ? '开心' :
               emotionalDepth.state.currentEmotion === 'sad' ? '难过' :
               emotionalDepth.state.currentEmotion === 'angry' ? '生气' :
               emotionalDepth.state.currentEmotion === 'loving' ? '爱你' :
               emotionalDepth.state.currentEmotion === 'excited' ? '兴奋' :
               emotionalDepth.state.currentEmotion === 'anxious' ? '焦虑' :
               emotionalDepth.state.currentEmotion === 'grateful' ? '感恩' :
               emotionalDepth.state.currentEmotion === 'surprised' ? '惊讶' :
               emotionalDepth.state.currentEmotion === 'fearful' ? '害怕' : '平静'}
            </div>
            <div className="text-xs text-gray-400">
              强度 {emotionalDepth.state.currentIntensity}/5
            </div>
          </div>
        </div>

        {/* Stress bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">压力</span>
            <span className="text-xs text-gray-400">{emotionalDepth.state.stressLevel}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                emotionalDepth.state.stressLevel > 70
                  ? 'bg-red-400'
                  : emotionalDepth.state.stressLevel > 40
                  ? 'bg-yellow-400'
                  : 'bg-green-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${emotionalDepth.state.stressLevel}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-500" />
          <span className="font-medium text-gray-700">成就</span>
          <span className="ml-auto text-xs text-gray-400">
            {achievements.achievements.filter((a) => a.unlocked).length} / {achievements.achievements.length}
          </span>
        </div>

        <div className="space-y-2">
          {achievements.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                achievement.unlocked
                  ? 'bg-amber-50 border border-amber-100'
                  : 'bg-gray-50 opacity-60'
              }`}
            >
              <span className="text-xl">{achievement.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 truncate">
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {achievement.description}
                </div>
              </div>
              {achievement.unlocked && (
                <span className="text-xs text-amber-600 font-medium">+{achievement.reward}</span>
              )}
            </div>
          ))}
        </div>

        {/* Character Card Achievements */}
        <div className="mt-4">
          <div className="text-xs font-medium text-gray-500 mb-2">角色卡收集</div>
          <div className="grid grid-cols-2 gap-2">
            {achievements.characterCardAchievements.map((card) => (
              <div
                key={card.id}
                className={`text-center p-2 rounded-lg text-xs ${
                  card.unlocked
                    ? 'bg-purple-50 text-purple-600 border border-purple-100'
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                <div className="font-medium">{card.name}</div>
                <div className="text-[10px] mt-0.5">{card.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
