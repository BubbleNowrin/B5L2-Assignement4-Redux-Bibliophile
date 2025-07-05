import { ArrowRight } from "lucide-react";

import image1 from "../../../public/image2.jpg";
import image from "../../../public/image3.jpg";


const Hero = () => {
  return (
    <div className="mt-2">

      <div className="bg-white pb-6 sm:pb-8 lg:pb-12 p-8">
        <section className="max-w-screen-2xl px-4 md:px-8 mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-8 md:mb-16">
            <div className="w-full lg:w-1/3 flex flex-col justify-center lg:pt-48 lg:pb-24 mb-6 sm:mb-12 lg:mb-0">
              <h1 className="text-gray-700 text-4xl sm:text-5xl md:text-6xl font-serif mb-4 md:mb-8 font-bold"><span className="text-[#de3241]">Find </span>Your<br />Next <span className="text-[#de3241]"> Book ..</span></h1>
              <p className="max-w-md text-gray-500 xl:text-lg leading-relaxed font-serif mb-8">Explore a world of stories, knowledge, and inspiration—your next favorite read is just a click away in our ever-growing library.</p>
              <a
                href="/books"
                className="group inline-flex items-center gap-2 px-5 xs:px-7 sm:px-8 py-3 xs:py-4 rounded-lg font-semibold text-base xs:text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 bg-[#de3241] hover:bg-[#de3240e8] w-full xs:w-auto justify-center"
              >
                <span className="text-white">Explore Library</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform text-white" />
              </a>
            </div>
            <div className="w-full lg:w-2/3 flex mb-12 md:mb-16 max-h-[500px] gap-6">
              <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden relative z-10 top-12 md:top-16 left-12 md:left-16 -ml-12 lg:ml-0 flex-1 min-w-0 flex items-center justify-center">
                <img src={image1} loading="lazy" alt="Library books" className="object-cover object-center w-full h-full" />
              </div>
              <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden flex-1 min-w-0 flex items-center justify-center">
                <img src={image} loading="lazy" alt="Library books" className="object-cover object-center w-full h-full" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    
  );
};

export default Hero;
