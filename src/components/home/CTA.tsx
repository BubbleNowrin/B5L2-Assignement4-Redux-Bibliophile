
import { ArrowRight, Library } from "lucide-react";

import { Link } from "react-router-dom";

const CTA = () => {

  return (
    <section className="py-12 xs:py-16 sm:py-20 bg-gradient-to-r from-[#de3241] to-[#de3241]/80 text-[#de3241]-foreground">
      <div className="container mx-auto px-2 xs:px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-2xl xs:text-3xl sm:text-5xl text-white font-bold tracking-tight break-words">
              Unlock a World of Books Today
            </h2>
            <p className="text-base xs:text-lg sm:text-xl opacity-90 text-white max-w-xl mx-auto">
              Become part of our vibrant community and discover your next great read. Start exploring our curated library now!
            </p>
          </div>
          <div className="flex flex-col gap-3 xs:flex-row xs:gap-4 justify-center items-center w-full">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-5 xs:px-6 sm:px-8 py-3 xs:py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-base xs:text-lg hover:bg-white hover:text-[#de3241] transition-all duration-200 w-full xs:w-auto justify-center"
            >
              <Library className="h-5 w-5 text-white" />
              <span className="text-white">Browse Collection</span>
            </Link>
            <Link
              to="/borrow-summary"
              className="inline-flex items-center gap-2 px-5 xs:px-6 sm:px-8 py-3 xs:py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-base xs:text-lg hover:bg-white hover:text-[#de3241] transition-all duration-200 w-full xs:w-auto justify-center"
            >
              <span className="text-white">View Summary</span>
              <ArrowRight className="h-5 w-5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
