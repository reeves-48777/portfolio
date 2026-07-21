import CrtEffect from './components/CrtEffect';
import Header from './components/Header';
import WorkTimeline from './components/WorkTimeline';
import RndLab from './components/RndLab';
import Footer from './components/Footer';

const App = () => {
  return (
    // On retire le bg-dark d'ici pour laisser voir le canvas,
    // mais on garde une légère opacité sur le contenu pour la lisibilité
    <div className="relative min-h-screen bg-base text-content overflow-x-hidden selection:bg-accent selection:text-base font-mono">

      {/* <WgslFluidBackground /> */}
      {/* Effet CRT par-dessus le fond (z-40/50) */}
      <CrtEffect />

      {/* Contenu principal (z-10) */}
      {/* On ajoute un fond semi-transparent (bg-dark/80) sur le conteneur pour que le texte soit lisible */}
      <div className="relative z-10 max-w-6xl lg:max-w-7xl mx-auto px-6 py-20 min-h-screen">
        <Header />
        <WorkTimeline />
        <RndLab />
        <Footer />
      </div>

    </div>
  );
};

export default App;
