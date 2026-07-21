import { cn } from "../utils/cn";

const WatermarkCard = ({ num, title, desc, techs, className, ...props }) => {
  return (
    <div className={cn(
      "relative bg-panel border border-border-base p-8 hover:bg-accent hover:text-black hover:border-accent transition-all duration-100 group cursor-pointer overflow-hidden",
      className
    )}
      {...props}>
      {/* Watermark géant */}
      <div
        className="absolute -bottom-4 -right-4 text-8xl font-extrabold text-muted/5 group-hover:text-base/70 transition-all duration-300 pointer-events-none font-display group-hover:-translate-x-4 group-hover:-translate-y-2"
      >
        {num}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <h3
          className="text-3xl font-extrabold mb-4 uppercase font-display"
        >
          {title}
        </h3>
        {desc.split("\n").map((line, index) =>
          <p key={index} className={cn("text-sm mb-2 opacity-80 grow", index === 0 ? 'font-extrabold underline' : '')}>{line}</p>
        )}

        <div className="flex justify-between items-end">
          <div className="flex gap-3 text-xs uppercase tracking-wider opacity-70">
            {techs.map(tech => <span key={tech}>{tech}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatermarkCard;
