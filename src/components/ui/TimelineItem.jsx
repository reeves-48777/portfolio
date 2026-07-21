import Tag from './Tag';
import TechTag from './TechTag';

const TimelineItem = ({ job, index, isLast }) => {
  return (
    <div className="flex group mb-12 last:mb-0">
      <div className="grow text-right pr-8 relative">
        <Tag
          text={job.tag}
          colorClass={job.tagColorClass}
          className="-top-3 left-0"
        />
        <div className="mt-6">
          <div className="text-sm text-muted-text uppercase tracking-wider mb-2">
            {job.date} <span className="text-border-base">//</span> <span className={job.accentClass}>{job.company}</span>
          </div>
          <h3 className="text-3xl text-content font-bold mb-4 group-hover:text-accent transition-colors uppercase font-display">
            {job.role}
          </h3>

          <p className="text-muted-text mb-6 max-w-md ml-auto">&gt; {job.desc}</p>
          <div className="flex gap-2 flex-wrap text-xs justify-end">
            {job.techs.map(tech => <TechTag key={tech} tech={tech} />)}
          </div>
        </div>
      </div>

      <div className="w-1 flex flex-col items-center relative">
        <div className={`w-0.5 grow ${isLast ? 'h-8' : 'h-full'} bg-border-base`}></div>
        <div className="w-4 h-4 bg-base border-2 border-content rotate-45 absolute top-2 transition-transform duration-300 group-hover:scale-150"></div>
      </div>
    </div>
  );
};

export default TimelineItem;
