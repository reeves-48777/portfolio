import Shape3DCard from '../ui/Shape3DCard';
import SectionTitle from '../ui/SectionTitle';
import AsciiFluidCanvas from '../../canvas/AsciiFluidCanvas';

import { useThemeStore } from '../../store/useThemeStore';
import { cn } from '../../utils/cn';
import TimelineItem from '../ui/TimelineItem';

const WorkTimeline = () => {
  const isDark = useThemeStore((state) => state.isDark());
  const jobs = [
    {
      tag: "CDI",
      tagColorClass: "bg-techy text-black border-techy", // <-- Vraies classes Tailwind
      date: "2022 — 2024",
      company: "PWA",
      role: "Développeur fullstack Java & Vue 3",
      desc: `Migration du frontend AngularJS vers Vue 3,
      Migration du backend Java 11 vers Java 17,
      Maintenance de la codebase Legacy (Java11) responsable du parsing des flux V3`,
      techs: ["Java 11/17", "PostgreSQL", "OracleDB", "Docker", "Vue 3"]
    },
    {
      tag: "CDI",
      tagColorClass: "bg-techy text-black border-techy", // <-- Vraies classes Tailwind
      date: "03/2024 — 06/2024",
      company: "PLEYCE",
      role: "Développeur fullstack PHP",
      desc: "Maintenance de l'application de gestion interne",
      techs: ["PHP", "EBP"]
    },
    {
      tag: "FREELANCE",
      tagColorClass: cn("text-black", isDark ? 'bg-accent border-accent' : 'bg-base border-border-base'), // <-- Vraies classes Tailwind
      date: "06/2024 — 10/2024",
      company: "PLEYCE",
      role: "Développeur fullstack Vue 3",
      desc: "Refonte visuelle et réécriture Extranet Client avec Vue3",
      techs: ["PHP", "Vue 3", "Typescript", "Javascript"]
    },

  ];

  return (
    <section className="mb-32 relative flex flex-col md:flex-row gap-8 md:gap-12">

      {/* RAIL VERTICAL */}
      <div className="hidden md:block w-20 shrink-0">
        <div className="sticky top-10 pl-4">
          <SectionTitle id="0x01" title="WORK_LOGS" direction="vertical" reverse={false} className={cn(isDark ? 'text-accent' : 'text-muted')} />
        </div>
      </div>

      <div className="grow grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        {/* COLONNE 3D */}
        <div className="hidden md:block">
          <div className="sticky top-10">
            <Shape3DCard type="cube" color="#ccff00" label="WORK_NODE キュブ" variant="ghost" />
            <div className="mt-4 border-2 border-gray-800 p-4 font-mono text-xs text-muted">
              <div className="flex justify-between mb-2"><span>STATUS</span><span className="text-accent">ACTIVE</span></div>
              <div className="flex justify-between mb-2"><span>AVAIL.</span><span className='font-bold text-techy'>ASAP</span></div>
              <div className="flex justify-between"><span>SECTOR</span><span className="text-muted">RHÔNE-ALPES</span></div>
            </div>
          </div>
          <p className='italic font-bold text-md font-mono text-muted mt-4'>
            Ingénieur logiciel et touche-à-tout, mon obsession principale est l'optimisation et la maximisation des performances.<br />
            J'aime explorer toute la chaîne,
            de l'architecture de protocoles réseau décentralisés (Rust/QUIC) à l'expérimentation front-end poussée (WebGPU).<br />
            Ces dernières années, j'ai concilié l'éducation de mon jeune fils avec le développement intensif de projets de R&D personnels.
          </p>
        </div>

        {/* COLONNE TIMELINE */}
        <div className="md:col-span-2 border-2 border-muted p-8 relative overflow-hidden">

          <div className={cn("absolute inset-0 z-0 pointer-events-none opacity-20")}>
            <AsciiFluidCanvas
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10">
            {jobs.map((job, index) => (
              <TimelineItem key={index} job={job} index={index} isLast={index === jobs.length - 1} />
            ))}
          </div>
        </div>

      </div>
    </section >
  );
};

export default WorkTimeline;
