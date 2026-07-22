import { useThemeStore } from '../../store/useThemeStore';
import { cn } from '../../utils/cn';
import { Button } from './button';

const ThemeToggle = ({ className }) => {
  const isDark = useThemeStore((state) => state.isDark());
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <Button className={cn(className)} variant="outline" onClick={toggleTheme}>{isDark ? '[ LIGHT_MODE ]' : '[ DARK_MODE ]'}</Button>
  );
};

export default ThemeToggle;
