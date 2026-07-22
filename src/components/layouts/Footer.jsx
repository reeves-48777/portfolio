const Footer = () => {
  return (
    <footer className="border-t-2 border-techy pt-10 relative">
      <div className="absolute top-0 right-0 bg-techy text-base px-4 py-1 text-xs font-bold transform -translate-y-1/2">
        DATA_EXTRACT
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-muted uppercase tracking-widest mb-6 md:mb-0">
          0x03 // END_OF_TRANSMISSION
        </div>
        <a
          href="/CV-Thomas-Durand.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto text-center border-2 border-border-base bg-transparent px-10 py-5 text-lg font-bold uppercase tracking-wider hover:bg-volt hover:text-base hover:border-volt transition-all duration-100"
        >
          &gt; DOWNLOAD_CV
        </a>
      </div>
      <div className="mt-12 text-center text-xs text-muted transform rotate-0">
        // SYSTEM_VERSION_1.0.0 // SECURE_CONNECTION_ESTABLISHED //
      </div>
    </footer>
  );
};

export default Footer;
