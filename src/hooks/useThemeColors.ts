import { useTheme } from '../context/ThemeContext';

export function useThemeColors() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    isDark,
    text: isDark ? '#fff' : '#2c2416',
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,36,22,0.75)',
    textTertiary: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(44,36,22,0.55)',
    textMuted: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(44,36,22,0.4)',
    textFaint: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(44,36,22,0.25)',
    textLabel: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(44,36,22,0.5)',
    bgCard: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(120,90,50,0.04)',
    bgSubtle: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(120,90,50,0.06)',
    bgHover: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(120,90,50,0.08)',
    bgInput: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(120,90,50,0.06)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(120,90,50,0.12)',
    borderLight: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(120,90,50,0.08)',
    borderInput: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(120,90,50,0.15)',
    avatarBorder: isDark ? '#1a1a2e' : '#f5f0e8',
    modalBg: isDark
      ? 'linear-gradient(145deg, #1a1a2e, #16213e)'
      : 'linear-gradient(145deg, #faf6f0, #f0ebe2)',
    modalShadow: isDark
      ? '0 25px 60px rgba(0,0,0,0.5)'
      : '0 25px 60px rgba(80,60,30,0.12)',
  };
}
