import { AlertTriangle, Trash2, X } from "lucide-react";
import type React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useDeleteBookMutation } from "../../redux/api/baseApi";
import { Button } from "../ui/Button";

interface DeleteBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  onConfirm?: (bookId: string, bookTitle: string) => Promise<void>;
}

// Zod validation schema for delete book request
const deleteBookSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  bookTitle: z.string().min(1, "Book title is required"),
});

type DeleteBookFormData = z.infer<typeof deleteBookSchema>;

const DeleteBookModal: React.FC<DeleteBookModalProps> = ({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  onConfirm,
}) => {
  const [deleteBook, { isLoading }] = useDeleteBookMutation();

  const validateData = (data: DeleteBookFormData) => {
    try {
      deleteBookSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  };

  const handleConfirm = async () => {
    try {
      // Validate data before deletion
      const dataToValidate = { bookId, bookTitle };
      if (!validateData(dataToValidate)) {
        toast.error("Validation failed", {
          description: "Please check the book information and try again.",
          duration: 5000,
        });
        return;
      }

      // Use optimistic handler if provided, otherwise use direct API call
      if (onConfirm) {
        await onConfirm(bookId, bookTitle);
      } else {
        await deleteBook(bookId).unwrap();

        // Success toast
        toast.success("Book deleted successfully!", {
          description: `"${bookTitle}" has been permanently removed from the library.`,
          duration: 4000,
        });
      }

      onClose();
    } catch (error) {
      console.error("Failed to delete book:", error);
      toast.error("Failed to delete book", {
        description:
          "An error occurred while deleting the book. Please try again.",
        duration: 5000,
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto my-8 bg-white rounded-3xl shadow-2xl border-2 border-red-500/10 overflow-hidden flex flex-col md:flex-row">
        {/* Left: Illustration/Info */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-red-600/90 to-pink-400/80 p-8 w-1/2">
          <Trash2 className="h-16 w-16 text-white mb-4 drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Delete Book</h2>
          <p className="text-white/90 text-center text-sm mb-4">This action cannot be undone. The book will be permanently removed from the collection.</p>
          <ul className="text-white/80 text-xs space-y-1">
            <li>• This cannot be undone</li>
            <li>• All book data will be lost</li>
            <li>• Please confirm carefully</li>
          </ul>
        </div>
        {/* Right: Content/Form */}
        <div className="flex-1 p-6 sm:p-8 relative">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-red-600 rounded-full p-2 bg-white hover:bg-red-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 border border-gray-200 shadow"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {/* Book Info/Warning */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 space-y-3 border border-red-100 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700 mb-2">
                  Are you sure you want to delete this book?
                </p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  "{bookTitle}"
                </p>
                <p className="text-xs text-red-600 mt-1">
                  This action cannot be undone and will permanently remove the book from the library.
                </p>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100 mt-2">
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full sm:flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none border-0 text-sm shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </div>
              ) : (
                <>
               
                  <span className="text-sm">Delete Book</span>
                </>
              )}
            </Button>
            <Button
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:flex-1 bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none border-0 text-sm shadow-md"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookModal;
