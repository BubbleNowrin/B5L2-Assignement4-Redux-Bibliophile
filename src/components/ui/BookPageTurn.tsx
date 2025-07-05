import { BookOpen, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

interface BookPage {
  id: number;
  title: string;
  content: string;
  image?: string;
  pageNumber: number;
}

interface BookPageTurnProps {
  pages: BookPage[];
  title?: string;
  author?: string;
  className?: string;
}

const BookPageTurn = ({
  pages,
  title = "Book Title",
  author = "Author Name",
  className,
}: BookPageTurnProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTurning, setIsTurning] = useState(false);

  const openBook = () => {
    setIsOpen(true);
  };

  const closeBook = () => {
    setIsOpen(false);
    setCurrentPage(0);
  };

  const nextPage = () => {
    if (isTurning || currentPage >= pages.length - 1) return;
    setIsTurning(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsTurning(false);
    }, 300);
  };

  const prevPage = () => {
    if (isTurning || currentPage <= 0) return;
    setIsTurning(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev - 1);
      setIsTurning(false);
    }, 300);
  };

  const currentPageData = pages[currentPage];

  return (
    <div className={cn("relative", className)}>
      {/* Closed Book State */}
      {!isOpen && (
        <div className="relative group cursor-pointer" onClick={openBook}>
          <div className="relative w-80 h-96 mx-auto">
            {/* Book Spine */}
            <div className="absolute left-1/2 top-0 w-8 h-full bg-gradient-to-b from-amber-800 via-amber-700 to-amber-800 transform -translate-x-1/2 rounded-sm shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-600/50 to-transparent rounded-sm" />
            </div>

            {/* Front Cover */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-lg shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 to-transparent rounded-lg" />

              {/* Cover Design */}
              <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/80 text-lg">{author}</p>

                {/* Click to Open */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-white/70 text-sm">
                  <Eye className="h-4 w-4" />
                  <span>Click to Open</span>
                </div>
              </div>
            </div>

            {/* Book Pages Edge */}
            <div className="absolute left-1/2 top-0 w-6 h-full bg-white transform -translate-x-1/2 rounded-sm shadow-inner" />
          </div>
        </div>
      )}

      {/* Open Book State */}
      {isOpen && (
        <div className="relative">
          {/* Book Container */}
          <div className="relative w-full max-w-6xl mx-auto bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-2xl overflow-hidden">
            {/* Book Cover (Left Side) */}
            <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 transform -skew-y-1 origin-left">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center transform skew-y-1">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-8">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
                <p className="text-white/80 text-xl mb-8">{author}</p>
                <button
                  onClick={closeBook}
                  className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Close Book
                </button>
              </div>
            </div>

            {/* Book Pages (Right Side) */}
            <div className="ml-[50%] h-full">
              <div className="relative h-full bg-white">
                {/* Page Content */}
                <div className="absolute inset-0 p-12">
                  <div className="h-full flex flex-col">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {currentPageData.title}
                        </h3>
                        <p className="text-gray-600">
                          Page {currentPageData.pageNumber}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {currentPage + 1} of {pages.length}
                      </div>
                    </div>

                    {/* Page Content */}
                    <div className="flex-1 flex items-center justify-center">
                      {currentPageData.image ? (
                        <div className="text-center space-y-6">
                          <div className="relative">
                            <img
                              src={currentPageData.image}
                              alt={currentPageData.title}
                              className="w-64 h-80 object-cover rounded-lg shadow-lg mx-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                          </div>
                          <p className="text-lg text-gray-700 max-w-md mx-auto leading-relaxed">
                            {currentPageData.content}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center space-y-6">
                          <div className="w-64 h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg mx-auto flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-blue-400" />
                          </div>
                          <p className="text-lg text-gray-700 max-w-md mx-auto leading-relaxed">
                            {currentPageData.content}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Page Navigation */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 0 || isTurning}
                        className={cn(
                          "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                          currentPage === 0 || isTurning
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100 hover:scale-105"
                        )}
                      >
                        <ChevronLeft className="h-5 w-5" />
                        <span>Previous</span>
                      </button>

                      <div className="flex space-x-2">
                        {pages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={cn(
                              "w-3 h-3 rounded-full transition-all duration-200",
                              index === currentPage
                                ? "bg-blue-500 scale-125"
                                : "bg-gray-300 hover:bg-gray-400"
                            )}
                          />
                        ))}
                      </div>

                      <button
                        onClick={nextPage}
                        disabled={currentPage === pages.length - 1 || isTurning}
                        className={cn(
                          "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                          currentPage === pages.length - 1 || isTurning
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100 hover:scale-105"
                        )}
                      >
                        <span>Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Page Turn Effect */}
                {isTurning && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPageTurn;
