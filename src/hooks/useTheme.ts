import { useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';

export function useTheme() {
  const theme = useAppStore((state) => state.user?.preferences.theme || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return theme;
}
