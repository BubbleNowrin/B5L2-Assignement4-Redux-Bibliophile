import { useGetBooksQuery } from "@/redux/api/baseApi";
import { BookOpen, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

function LatestBooks() {
  const { data: books } = useGetBooksQuery({ limit: 10 });
  const latestBooks = books?.data?.slice(0, 4) || [];

  // Latest Books Section
  return (
    <section className="py-14 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-12">
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight break-words">
              Latest <span className="text-[#de3241]">Additions</span>
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-muted-foreground max-w-md sm:max-w-none">
              Discover the newest arrivals—handpicked books to spark your curiosity and inspire your next read.
            </p>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 mt-2 sm:mt-0 self-start sm:self-auto px-3 py-2 rounded bg-[#de3241]/10 hover:bg-[#de3241]/20 transition-colors"
          >
            <span className="text-[#de3241] font-semibold text-base sm:text-lg">View All</span>
            <ChevronRight className="h-4 w-4 text-[#de3241]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {latestBooks.map((book, index) => (
            <div
              key={index}
              className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              <div className="bg-muted relative overflow-hidden flex items-center justify-center" style={{height: '140px'}}>
                <BookOpen className="h-14 w-14 xs:h-16 xs:w-16 sm:h-20 sm:w-20 text-[#de3241]/30" />
                <div className="absolute top-2 right-2 bg-[#de3241] text-white px-2 py-1 rounded text-xs font-medium">
                  NEW
                </div>
                {/* Availability Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold shadow-lg ${book.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {book.available ? 'Available' : 'Borrowed'}
                </div>
              </div>
              <div className="p-4 sm:p-5 space-y-3 flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 xs:h-4 xs:w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-xs xs:text-sm text-muted-foreground">
                    5.0
                  </span>
                </div>
                <h3 className="font-semibold text-base xs:text-lg line-clamp-2 break-words">
                  {book.title}
                </h3>
                <p className="text-xs xs:text-sm">Author: <span className="text-[#de3241]">{book.author}</span></p>
                {/* ISBN and Copies */}
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between text-xs xs:text-sm gap-1 xs:gap-0">
                  <span>ISBN: <span className="font-medium break-all">{book.isbn}</span></span>
                  <span className="text-[#de3241]">{book.copies} copies available</span>
                </div>
                {/* Created Date */}
                <div className="text-xs xs:text-sm">
                  Added on: {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                {/* Description */}
                <p className="text-xs xs:text-sm text-muted-foreground line-clamp-2">
                  {book.description ? book.description : 'No description available.'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs xs:text-sm bg-[#de3241]/10 text-[#de3241] px-2 py-1 rounded">
                    {book.genre}
                  </span>
                </div>
                <Link
                  to={`/books/${book._id}`}
                  className="block w-full mt-2 bg-gray-700 hover:bg-gray-500 text-center py-2 rounded font-semibold transition-colors duration-200 text-xs xs:text-sm"
                >
                  <span className="text-white">Read More</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestBooks;
