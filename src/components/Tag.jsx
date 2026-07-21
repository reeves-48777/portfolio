import { cn } from "../utils/cn";

const Tag = ({ text, colorClass, className, ...props }) => {
  return (
    <div className={cn(
      "absolute text-xs font-bold px-3 py-1 z-20 border-2",
      colorClass || "bg-volt text-base",
      className
    )}
      {...props}
    >
      {text}
    </div>
  );
};

export default Tag;
