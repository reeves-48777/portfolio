import { cn } from "../../utils/cn";

// Icônes SVG brutales (carrées, sans arrondis)
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 md:size-6">
    <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.397 1.02.005 2.04.135 3 .397 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.561C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 md:size-6">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const QrMosaic = ({ className, ...props }) => {
  const githubUrl = "https://github.com/reeves-48777";
  const linkedinUrl = "https://www.linkedin.com/in/thomas-durand26";

  // L'API avec ecc=H (Haute correction d'erreur) pour pouvoir masquer le centre
  const ghQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=050505&bgcolor=ccff00&ecc=H&data=${githubUrl}`;
  const liQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=050505&bgcolor=ff5e00&ecc=H&data=${linkedinUrl}`;

  return (
    <div className={cn("grid grid-cols-2 gap-2 md:gap-4 w-full max-w-45 md:max-w-55", className)}>

      {/* Cellule 1 : GitHub QR (Haut Gauche) */}
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-square bg-volt p-2 border-2 border-volt group hover:scale-110 transition-transform duration-120">
        <img
          src={ghQr}
          alt="QR Code GitHub"
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }} // Garde les pixels nets !
        />
        {/* Overlay de l'icône au centre */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="dark:bg-base bg-content text-volt p-1 md:p-2 border border-dark">
            <GithubIcon />
          </div>
        </div>
      </a>

      {/* Cellule 2 : Data placeholder (Haut Droite) */}
      <div className="w-full aspect-square border-2 border-gray-800 flex flex-col items-center justify-center p-2 group hover:border-volt transition-colors">
        <div className="text-volt font-display text-xl md:text-2xl">0x01</div>
        <div className="text-[8px] md:text-[10px] text-gray-500 mt-1 text-center uppercase">// Github<br />_access</div>
        <div className="mt-2 flex flex-wrap gap-0.5 justify-center">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-gray-800 group-hover:bg-volt transition-colors"></div>
          ))}
        </div>
      </div>

      {/* Cellule 3 : Data placeholder (Bas Gauche) */}
      <div className="w-full aspect-square border-2 border-gray-800 flex flex-col items-center justify-center p-2 group hover:border-techy transition-colors">
        <div className="text-techy font-display text-xl md:text-2xl">0x02</div>
        <div className="text-[8px] md:text-[10px] text-gray-500 mt-1 text-center uppercase">// LinkedIn<br />_access</div>
        <div className="mt-2 flex flex-wrap gap-0.5 justify-center">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-gray-800 group-hover:bg-techy transition-colors"></div>
          ))}
        </div>
      </div>

      {/* Cellule 4 : LinkedIn QR (Bas Droite) */}
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-square bg-techy p-2 border-2 border-techy group hover:scale-110 transition-transform duration-120">
        <img
          src={liQr}
          alt="QR Code LinkedIn"
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
        {/* Overlay de l'icône au centre */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="dark:bg-base bg-content text-techy p-1 md:p-2 border border-dark">
            <LinkedinIcon />
          </div>
        </div>
      </a>

    </div >
  );
};

export default QrMosaic;
