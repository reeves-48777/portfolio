import QrMosaic from '../ui/QrMosaic';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  return (
    <header className="mb-32 relative pt-8 font-mono">
      <div className="dark:text-techy text-sm mb-4 uppercase tracking-widest border-b border-border-base pb-2 inline-block no-print max-sm:flex max-sm:justify-between">
        0x00 // SYSTEM_INIT
        <ThemeToggle className="ml-18 lg:ml-32 max-sm:min-w-48" />
      </div>


      {/* Conteneur principal en Flexbox */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">

        {/* Colonne de gauche : Identité */}
        <div className="grow">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold uppercase leading-none text-content font-display">
            Thomas<br />Thury-Bouvet<span className="dark:text-volt animate-pulse">_</span>
          </h1>

          <div className="flex flex-col justify-between items-start mt-8 border-t border-b border-border-base py-4 w-full">
            <p className="text-lg text-muted mb-4 md:mb-0">
              <span className="dark:text-volt">&gt;</span> SOFTWARE_ENGINEER <span className="dark:text-techy">//</span> CREATIVE_DEVELOPER <span className="dark:text-volt">//</span> LOW_LEVEL
            </p>
            <p className="text-sm text-muted uppercase tracking-wider">
              LOCATION: valence & périphérie // FULL_REMOTE
            </p>
          </div>
        </div>



        {/* Colonne de droite : Mosaïque QR Code */}
        <div className="w-full md:w-auto flex justify-center md:justify-end mt-8 md:mt-0">
          <QrMosaic className="no-print" />
        </div>

      </div>
    </header>
  );
};

export default Header;
