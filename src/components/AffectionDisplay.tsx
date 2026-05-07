import { Heart } from 'lucide-react';
import { AffectionSystem, AffectionLevel } from '../types';
import { AFFECTION_LEVEL_NAMES, AFFECTION_LEVEL_DESCRIPTIONS } from '../utils/characterAnalyzer';

interface AffectionDisplayProps {
  affection: AffectionSystem;
  showDetails?: boolean;
}

export function AffectionDisplay({ affection, showDetails = false }: AffectionDisplayProps) {
  const levelColors: Record<AffectionLevel, string> = {
    stranger: 'text-gray-500',
    acquaintance: 'text-blue-500',
    friendly: 'text-green-500',
    close: 'text-purple-500',
    crush: 'text-pink-500',
    lover: 'text-red-500',
  };

  const progressColors: Record<AffectionLevel, string> = {
    stranger: 'bg-gray-400',
    acquaintance: 'bg-blue-400',
    friendly: 'bg-green-400',
    close: 'bg-purple-400',
    crush: 'bg-pink-400',
    lover: 'bg-red-400',
  };

  return (
    <div className="flex items-center gap-2">
      <Heart className={`w-4 h-4 ${levelColors[affection.level]}`} />
      <span className={`text-sm font-medium ${levelColors[affection.level]}`}>
        {AFFECTION_LEVEL_NAMES[affection.level]}
      </span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColors[affection.level]} rounded-full transition-all duration-500`}
          style={{ width: `${affection.points / 10}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 min-w-[40px] text-right">
        {affection.points}
      </span>
      {showDetails && (
        <span className="text-xs text-gray-500">
          {AFFECTION_LEVEL_DESCRIPTIONS[affection.level]}
        </span>
      )}
    </div>
  );
}
