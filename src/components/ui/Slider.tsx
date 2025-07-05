import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  overlay?: boolean;
  kenBurns?: boolean;
  parallax?: boolean;
}

interface SliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  showPlayPause?: boolean;
  className?: string;
}

const Slider = ({
  slides,
  autoPlay = true,
  interval = 5000,
  showNavigation = true,
  showPagination = true,
  showPlayPause = true,
  className,
}: SliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [slides.length, isTransitioning]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setProgress(0);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [currentSlide, isTransitioning]
  );

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / (interval / 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, interval, nextSlide]);

  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Slides Container */}
      <div className="relative h-[600px] md:h-[700px] lg:h-[800px]">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={{
                opacity: 0,
                scale: 1.1,
                x: index > currentSlide ? "100%" : "-100%",
              }}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.1,
                x:
                  index === currentSlide
                    ? 0
                    : index > currentSlide
                    ? "100%"
                    : "-100%",
              }}
              exit={{
                opacity: 0,
                scale: 1.1,
                x: index > currentSlide ? "100%" : "-100%",
              }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              {/* Background Image with Ken Burns Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  animate={
                    slide.kenBurns && index === currentSlide
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 1, 0],
                        }
                      : {}
                  }
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {slide.overlay && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                )}
              </div>

              {/* Content with Layer Animations */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center text-white max-w-5xl mx-auto px-6 space-y-8">
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                      opacity: index === currentSlide ? 1 : 0,
                      y: index === currentSlide ? 0 : 50,
                    }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {slide.subtitle && (
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{
                          opacity: index === currentSlide ? 1 : 0,
                          y: index === currentSlide ? 0 : 30,
                          scale: index === currentSlide ? 1 : 0.9,
                        }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <motion.span
                          className="inline-block bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl text-lg font-bold border border-white/30 shadow-xl"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          {slide.subtitle}
                        </motion.span>
                      </motion.div>
                    )}

                    <motion.h2
                      className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{
                        opacity: index === currentSlide ? 1 : 0,
                        y: index === currentSlide ? 0 : 50,
                        scale: index === currentSlide ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    >
                      {slide.title}
                    </motion.h2>

                    {slide.description && (
                      <motion.p
                        className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{
                          opacity: index === currentSlide ? 1 : 0,
                          y: index === currentSlide ? 0 : 30,
                        }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                      >
                        {slide.description}
                      </motion.p>
                    )}
                  </motion.div>

                  {slide.ctaText && slide.ctaLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{
                        opacity: index === currentSlide ? 1 : 0,
                        y: index === currentSlide ? 0 : 30,
                        scale: index === currentSlide ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      <motion.a
                        href={slide.ctaLink}
                        className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 border border-white/20 backdrop-blur-md"
                        whileHover={{
                          scale: 1.05,
                          boxShadow:
                            "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-white">{slide.ctaText}</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </motion.div>
                      </motion.a>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Play/Pause Button */}
      {showPlayPause && (
        <motion.button
          onClick={togglePlayPause}
          className="absolute top-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl flex items-center justify-center transition-all duration-300 z-30 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform backdrop-blur-md border border-white/20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Pause className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
              >
                <Play className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          <motion.button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-transparent hover:bg-white/10 text-white rounded-2xl flex items-center justify-center transition-all duration-300 z-30 shadow-lg hover:shadow-xl hover:shadow-white/25 transform backdrop-blur-lg border border-white/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronLeft className="h-8 w-8" />
            </motion.div>
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-transparent hover:bg-white/10 text-white rounded-2xl flex items-center justify-center transition-all duration-300 z-30 shadow-lg hover:shadow-xl hover:shadow-white/25 transform backdrop-blur-lg border border-white/30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronRight className="h-8 w-8" />
            </motion.div>
          </motion.button>
        </>
      )}

      {/* Pagination Dots */}
      {showPagination && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2.5 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "size-2 rounded-full transition-all duration-300 border border-white/30",
                index === currentSlide
                  ? "bg-gradient-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-500/50 border-white"
                  : "bg-white/30 hover:bg-white/50 hover:shadow-lg"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 2.0 + index * 0.1 }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </motion.div>
      )}

      {/* Progress Bar */}
      {autoPlay && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 z-30 backdrop-blur-md"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Slide Counter */}
      <motion.div
        className="absolute top-6 left-6 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-bold z-30 border border-white/20 shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 2.4 }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          key={currentSlide}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentSlide + 1} / {slides.length}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default Slider;
