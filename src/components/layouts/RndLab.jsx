import WatermarkCard from '../ui/WatermarkCard';
import Shape3DCard from '../ui/Shape3DCard'; // <-- Importé ici
import AsciiFluidCanvas from '../../canvas/AsciiFluidCanvas';

const RndLab = () => {
  const projects = [
    {
      num: "01",
      title: "Rover Network",
      className: "hover:bg-techy hover:border-techy",
      desc: `Implémentation décentralisée du web (work in progress)
      Le but du projet est de comprendre comment fonctionne le web.
      Pour cela j'ai décidé de recréer l'écosystème en entier (http, navigateur, js engine, html)
      Features MVP :
        - Format de fichier pour les pages statiques (HTML -> Shard)
        - Navigateur (Ravn)
        - Protocole de communication entre les noeuds du réseau basé sur QUIC (HTTP -> Rover)
        - Développement d'un moteur lua (au lieu de javascript) pour dynamiser les pages et intéragir avec le client (V8/SpiderMonkey -> Nest)`,
      techs: ["#RUST", "#TOKIO", "#ICED", "#RATATUI", "#QUIC"]
    },
    {
      num: "02",
      title: "KeyLabs",
      desc: `Simulation sonore de clavier mécanique (work in progress)
      Configuration des différentes parties d'un clavier mécanique :
       - boîtier
       - plate
       - mount
       - pcb
       - foam
       - switches

      Le profil sonore du clavier est ensuite généré et les appuis des touches sont interceptés par un daemon pour jouer le son correspondant`,
      techs: ["#RUST", "#WASM", "#REACT", "#R3F", "#WGSL/WebGPU"]
    },
    {
      num: "03",
      title: "Low Carbon Server",
      desc: `Développement d'outils serveurs et clouds très légers (work in progress)
      Remplacement d'une suite d'outils cloud:
      - drive/serveur de fichier
      - photo
      - gestionnaire de mots de passe
      - et bien d'autres

      Le but premier est de comprendre comment ces technos fonctionnent réellement mais aussi de faire un geste pour la planète en recyclant un petit et modeste appareil que j'avais sous la main en tirant parti au maximum de la puissance de calcul qu'il peut offrir
      `,
      techs: ["#RUST", "#TOKIO", "#RATATUI", "#DOCKER", "#AARCH64", "#x86"]
    }
  ];

  return (
    <section className="mb-32">
      <div className="flex items-end justify-between mb-12">
        <h2 className="text-5xl md:text-7xl font-extrabold text-content uppercase font-display">
          <span className="text-techy">0x02</span> R&D_LAB
        </h2>
      </div>

      {/* Grille de 3 colonnes : Projet 1, Forme 3D, Projet 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <WatermarkCard key={index} {...project} />
        ))}

        {/* On insère la carte 3D au milieu */}
        <Shape3DCard type="ico" color="#ccff00" label="イコスfイヤー" variant='lidar' className="no-print" />
        <div className='no-print'></div>
        <AsciiFluidCanvas className='border border-border-base no-print' />
      </div>
    </section>
  );
};

export default RndLab;
