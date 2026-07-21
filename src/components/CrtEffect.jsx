import { useThemeStore } from "../store/useThemeStore";
import { cn } from "../utils/cn";

const CrtEffect = ({ className, ...props }) => {
  const isDark = useThemeStore((state) => state.isDark());
  // Ajustement de l'opacité et des couleurs selon le thème
  const scanlineOpacity = isDark ? 0.3 : 0.08;
  const vignetteColor = isDark
    ? 'rgba(0, 0, 0, 0.4)'
    : 'rgba(50, 50, 50, 0.3)'; // Gris doux pour le thème clair

  return (
    <>
      {/* Lignes de scan */}
      <style>
        {`
                @keyframes flicker {
                  0% { opacity: 0.95; }
                  5% { opacity: 0.90; }
                  10% { opacity: 0.98; }
                  15% { opacity: 0.92; }
                  20% { opacity: 0.97; }
                  50% { opacity: 0.95; }
                  80% { opacity: 0.90; }
                  100% { opacity: 0.96; }
                }
              `}
      </style>
      <div
        className={cn("pointer-events-none fixed inset-0 z-50", className)}
        style={{
          // On utilise rgba pour que ça s'adapte bien sur fond clair comme foncé
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0, 0, 0, ${scanlineOpacity}), rgba(0, 0, 0, ${scanlineOpacity}) 1px, transparent 1px, transparent 3px)`,
        }}
        {...props}
      ></div >

      {/* Vignettage (les bords sombres du vieux tube cathodique) */}
      < div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          // Le radial-gradient fait un vignettage beaucoup plus naturel que le box-shadow
          background: `radial-gradient(ellipse at center, transparent 55%, ${vignetteColor} 100%)`
        }
        }
      ></div >
    </>
  );
};

export default CrtEffect;
