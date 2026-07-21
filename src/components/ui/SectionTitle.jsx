import { cn } from "../../utils/cn";

const SectionTitle = ({ id, title, direction, reverse = false, className, ...props }) => {
  // Gestion de la direction du texte
  const writingMode = direction || 'vertical' ? 'vertical-rl' : 'horizontal-tb';
  const transform = direction || 'vertical' && reverse ? 'rotate(180deg)' : 'none';

  return (
    <div className={cn(
      "flex gap-4 mb-12",
      direction || "vertical" ? "items-start gap-2" : "items-center gap-4"
    )} style={{ writingMode, transform }}
      {...props}
    >
      <span className={cn(
        "text-5xl md:text-6xl font-extrabold font-display leading-none",
        className || 'text-accent',
      )}>
        {id}
      </span>
      <span className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-content uppercase font-display tracking-wide mt-2">
        {title}
      </span>
    </div>
  );
};

export default SectionTitle;
