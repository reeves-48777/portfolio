import { cn } from "../../utils/cn";

const SectionTitle = ({ id, title, direction = "horizontal", reverse = false, className, ...props }) => {
  // Gestion de la direction du texte
  const isVertical = direction === "vertical";

  return (
    <div className={cn(
      "flex flex-row items-center gap-4 mb-4",
      isVertical && "md:[writing-mode:vertical-rl] md:items-start gap-2",
      reverse && "rotate-180",
      className
    )}
      {...props}
    >
      <span className={cn(
        "text-5xl lg:text-6xl font-extrabold font-display leading-none uppercase text-accent",
      )}>
        {id}
      </span>
      <span className="text-5xl lg:text-6xl font-extrabold text-content uppercase font-display tracking-wide mt-2">
        {title}
      </span>
    </div>
  );
};

export default SectionTitle;
