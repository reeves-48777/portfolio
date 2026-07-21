import { cn } from "../utils/cn";
const TechTag = ({ tech, accentColor = "volt" }) => {
  const hoverClasses = accentColor === 'techy'
    ? 'hover:bg-techy hover:text-base hover:border-techy'
    : 'hover:bg-volt hover:text-base hover:border-volt';

  return (
    <span className={cn("border-2 border-border-base px-3 py-1 text-xs text-content transition-colors", hoverClasses)}>
      {tech}
    </span>
  );
};

export default TechTag;
