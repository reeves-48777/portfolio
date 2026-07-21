import { useThemeStore } from '../store/useThemeStore';
import { cn } from '../utils/cn';

const ThemeToggle = ({ className, ...props }) => {
  const isDark = useThemeStore((state) => state.isDark());
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "border-2 border-ink dark:border-accent px-4 py-2 text-xs dark:text-accent font-bold uppercase tracking-widest hover:bg-accent hover:text-base transition-colors",
        className
      )}
      {...props}
    >
      {isDark ? '[ LIGHT_MODE ]' : '[ DARK_MODE ]'}
    </button >
  );
};

export default ThemeToggle;
