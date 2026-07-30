import { cn } from "../../utils/cn";

const CVDownload = ({ className, ...props }) => {
  const cvUrl = `${import.meta.env.BASE_URL}cv.pdf`;

  return (
    <a
      href={cvUrl}
      download="CV_Thomas.pdf"
      className="w-full md:w-auto text-center border-2 border-border-base bg-transparent px-10 py-5 text-lg font-bold uppercase tracking-wider hover:bg-accent hover:text-base hover:border-accent transition-all duration-100"
    >
      &gt; DOWNLOAD_CV
    </a>
  )
};

export default CVDownload;
