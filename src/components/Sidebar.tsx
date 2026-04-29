import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Settings,
  Mic,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { companions, currentCompanion, setCurrentCompanion, currentView, setCurrentView } = useAppStore();

  const menuItems = [
    { icon: MessageCircle, label: '聊天', path: '/chat', view: 'chat' as const },
    { icon: Users, label: '伙伴', path: '/chat', view: 'chat' as const },
    { icon: Mic, label: '声音', path: '/voice', view: 'voice' as const },
    { icon: Settings, label: '设置', path: '/settings', view: 'settings' as const },
  ];

  const handleNavigate = (path: string, view: typeof currentView) => {
    setCurrentView(view);
    navigate(path);
  };

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-lg flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text">声悦</h1>
                  <p className="text-xs text-gray-500">NarratorAI</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path &&
                          (item.view === 'chat' ? currentView === 'chat' || currentView === 'settings' || currentView === 'voice' : currentView === item.view);

          return (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path, item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 shadow-sm'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : ''}`} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Companion List */}
      <div className="p-4 border-t border-gray-100">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500">我的伙伴</h3>
                <button
                  onClick={() => handleNavigate('/setup', 'setup')}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {companions.map((companion) => (
                  <button
                    key={companion.id}
                    onClick={() => {
                      setCurrentCompanion(companion);
                      handleNavigate('/chat', 'chat');
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      currentCompanion?.id === companion.id
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center text-lg">
                      {companion.avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{companion.name}</p>
                      <p className="text-xs text-gray-500">{companion.relationship}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed companion icons */}
        {isCollapsed && (
          <div className="space-y-2">
            {companions.slice(0, 3).map((companion) => (
              <button
                key={companion.id}
                onClick={() => {
                  setCurrentCompanion(companion);
                  handleNavigate('/chat', 'chat');
                }}
                className={`w-full flex justify-center p-2 rounded-lg transition-colors ${
                  currentCompanion?.id === companion.id
                    ? 'bg-orange-100'
                    : 'hover:bg-gray-100'
                }`}
                title={companion.name}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center text-sm">
                  {companion.avatar}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
