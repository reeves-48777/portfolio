import WatermarkCard from './WatermarkCard';
import Shape3DCard from './Shape3DCard'; // <-- Importé ici
import AsciiFluidCanvas from './AsciiFluidCanvas';

const RndLab = () => {
  const projects = [
    {
      num: "01",
      title: "Rover Network",
      className: "hover:bg-techy hover:border-techy",
      desc: `Réécriture de l'écosystème web de manière simplifiée et décentralisée
        - Format de fichier pour les pages statiques (les Shardz)
        - Navigateur (Ravn)
        - Protocole de communication entre les noeuds du réseau basé sur QUIC (Rover)
        - Développement d'un framework permettant d'intéragir avec les pages de manière dynamique utilisant un moteur lua (Nest)`,
      techs: ["#RUST", "#TOKIO", "#ICED", "#RATATUI", "#QUIC"]
    },
    {
      num: "02",
      title: "KeyLabs",
      desc: `Simulation de sons de touches de clavier mécaniques
      Possibilité de changer les matériaux des différentes parties du clavier (boîtier, plaque, key caps, switchs, mods)`,
      techs: ["#RUST", "#WASM", "#REACT", "#R3F", "#WGSL/WebGPU"]
    },
    {
      num: "03",
      title: "Low Carbon Server",
      desc: `Développement d'outils serveurs et clouds très légers
      Remplacement d'une suite d'outils cloud:
      - drive/serveur de fichier
      - photo
      - gestionnaire de mots de passe
      - et bien d'autres

      Le but premier est de comprendre comment ces technos fonctionnent réellement mais aussi de faire un geste pour la planète en recyclant un petit et modeste appareil que j'avais sous la main en tirant parti au maximum de la puissance de calcul qu'il peut offrir
      `,
      techs: ["#RUST", "#WASM", "#REACT", "#R3F", "#WGSL/WebGPU"]
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
        <Shape3DCard type="ico" color="#ccff00" label="イコスfイヤー" variant='lidar' />
        <div></div>
        <AsciiFluidCanvas className='border border-border-base' />
      </div>
    </section>
  );
};

export default RndLab;
