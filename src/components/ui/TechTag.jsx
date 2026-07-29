const TechTag = ({ tech }) => {
  return (
    <span className="border-2 border-border-base px-3 py-1 text-xs text-content transition-colors hover:border-accent hover:bg-accent hover:font-bold dark:hover:text-base">
      {tech}
    </span >
  );
};

export default TechTag;
