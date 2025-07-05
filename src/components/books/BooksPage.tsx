import {
  BookOpen,
  CheckCircle,
  Edit,
  Plus,
  Trash2,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AddBookModal from "./AddBookModal";
import BookSkeleton from "./BookSkeleton";
import BorrowBookModal from "./BorrowBookModal";
import DeleteBookModal from "./DeleteBookModal";
import EditBookModal from "./EditBookModal";

import {
  useDeleteBookMutation,
  useGetBooksQuery,
} from "../../redux/api/baseApi";
import type { Book } from "../../types";
import { Button } from "../ui/Button";

const BooksPage = () => {
  const {
    data: booksData,
    isLoading,
    error,
  } = useGetBooksQuery({ limit: 1000 });

  const [deleteBook] = useDeleteBookMutation();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const books = booksData?.data || [];

  // No search filter, show all books
  const filteredBooks = books;

  // Pagination logic
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);


  // Open edit modal
  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (book: Book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  // Handle book deletion
  const handleDelete = async (bookId: string, bookTitle: string) => {
    try {
      await deleteBook(bookId).unwrap();

      // Success toast
      toast.success("Book deleted successfully!", {
        description: `"${bookTitle}" has been permanently removed from the library.`,
        duration: 4000,
      });
    } catch (error) {
      console.error("Failed to delete book:", error);
      toast.error("Failed to delete book", {
        description:
          "An error occurred while deleting the book. Please try again.",
        duration: 5000,
      });
    }
  };

  // Open borrow modal
  const openBorrowModal = (book: Book) => {
    setSelectedBook(book);
    setIsBorrowModalOpen(true);
  };

  if (isLoading) {
    return <BookSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Books
          </h2>
          <p className="text-gray-600">
            An error occurred while loading the books. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-700 mb-2">
            Books <span className="text-[#de3241]">Management</span>
          </h1>
          <p className="text-gray-600">
            Manage and explore your book collection
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0  text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform  shadow-lg hover:shadow-[#de3241]/25"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Book
        </Button>
      </div>

      {/* List/Table View Only */}
      <div className=" rounded-xl shadow-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#de3241]/10 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ISBN
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Copies
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentBooks.map((book) => (
                <tr
                  key={book._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-[#de3241]">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        by {book.author}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#de3241]/10 text-[#de3241]">
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {book.isbn}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {book.copies}
                  </td>
                  <td className="px-6 py-4">
                    {book.available && book.copies > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Unavailable
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openBorrowModal(book)}
                        disabled={!book.available || book.copies === 0}
                        className={`flex-1 py-2 px-3 rounded-lg transition-all duration-300 ${
                          !book.available || book.copies === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25 hover:scale-105"
                        }`}
                        title={
                          !book.available || book.copies === 0
                            ? "Book not available"
                            : "Borrow Book"
                        }
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Borrow</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(book)}
                        className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                        title="Edit Book"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Edit</span>
                      </Button>
                      <button
                        onClick={() => openDeleteModal(book)}
                        className="flex items-center justify-center p-0 m-0 bg-transparent border-none outline-none hover:scale-110 transition-transform"
                        title="Delete Book"
                        style={{ background: 'none' }}
                      >
                        <Trash2 className="h-4 w-4" color="#de3241" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No books found</p>
            <p className="text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-200 shadow-sm bg-[#de3241] text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous Page"
            >
              Previous
            </button>
            <span className="mx-2 text-sm text-gray-600">
              Page <span className="font-semibold text-[#52877a]">{currentPage}</span> of <span className="font-semibold text-[#52877a]">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-200 shadow-sm bg-[#de3241] text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">Books per page:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#52877a]"
            >
              {[6, 12, 24, 48].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Modals for Add, Edit, Delete, Borrow */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        book={selectedBook}
      />

      <DeleteBookModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        bookId={bookToDelete?._id || ""}
        bookTitle={bookToDelete?.title || ""}
        onConfirm={handleDelete}
      />

      <BorrowBookModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        book={selectedBook}
      />
    </div>
  );
};

export default BooksPage;
