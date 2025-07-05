import {
  CheckCircle,
  Edit3,
  X,
} from "lucide-react";
import type React from "react";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateBookMutation } from "../../redux/api/baseApi";
import type { Book } from "../../types";
import { Genre } from "../../types";
import { Button } from "../ui/Button";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

// Zod validation schema for update book request
const updateBookSchema = z.object({
  id: z.string().min(1, "Book ID is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .min(2, "Author must be at least 2 characters")
    .max(100, "Author must be less than 100 characters"),
  genre: z.nativeEnum(Genre, {
    errorMap: () => ({ message: "Please select a valid genre" }),
  }),
  isbn: z
    .string()
    .min(1, "ISBN is required")
    .regex(
      /^[0-9-]{10,17}$/,
      "ISBN must be 10-17 digits with optional hyphens"
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  copies: z
    .number()
    .int("Copies must be a whole number")
    .min(0, "Copies cannot be negative")
    .max(100, "Maximum 100 copies allowed"),
  available: z.boolean().default(true),
});

type UpdateBookFormData = z.infer<typeof updateBookSchema>;

const EditBookModal: React.FC<EditBookModalProps> = ({
  isOpen,
  onClose,
  book,
}) => {
  const [updateBook, { isLoading }] = useUpdateBookMutation();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<UpdateBookFormData>({
    id: "",
    title: "",
    author: "",
    genre: Genre.FICTION,
    isbn: "",
    description: "",
    copies: 1,
    available: true,
  });

  // Optimistic state for the book
  const [optimisticBook, addOptimisticBook] = useOptimistic(
    book,
    (currentBook, optimisticUpdate: UpdateBookFormData) => {
      if (!currentBook) return currentBook;

      return {
        ...currentBook,
        title: optimisticUpdate.title,
        author: optimisticUpdate.author,
        genre: optimisticUpdate.genre,
        isbn: optimisticUpdate.isbn,
        description: optimisticUpdate.description,
        copies: optimisticUpdate.copies,
        available: optimisticUpdate.available,
        updatedAt: new Date().toISOString(),
      };
    }
  );

  // Update form data when book changes
  useEffect(() => {
    if (book) {
      setFormData({
        id: book._id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        description: book.description,
        copies: book.copies,
        available: book.available,
      });
      setFieldErrors({});
    }
  }, [book]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFieldErrors({});
    }
  }, [isOpen]);

  const validateField = (
    field: keyof UpdateBookFormData,
    value: string | number | boolean
  ) => {
    try {
      const fieldSchema = updateBookSchema.shape[field];
      fieldSchema.parse(value);
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path.includes(field));
        if (fieldError) {
          setFieldErrors((prev) => ({ ...prev, [field]: fieldError.message }));
        }
      }
      return false;
    }
  };

  const handleFieldChange = (
    field: keyof UpdateBookFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!book) return;

    setFieldErrors({});

    try {
      // Validate entire form
      const validatedData = updateBookSchema.parse(formData);

      // Add optimistic update
      addOptimisticBook(validatedData);

      // Start transition for the actual API call
      startTransition(async () => {
        try {
          await updateBook(validatedData).unwrap();

          // Success toast
          toast.success("Book updated successfully!", {
            description: `${validatedData.title} by ${validatedData.author} has been updated.`,
            duration: 4000,
          });

          onClose();
        } catch (error) {
          // Revert optimistic update on error
          console.error("Failed to update book:", error);
          toast.error("Failed to update book", {
            description:
              "An error occurred while updating the book. Please try again.",
            duration: 5000,
          });
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
        setFieldErrors(errors);

        toast.error("Validation failed", {
          description: "Please check the form fields and try again.",
          duration: 5000,
        });
      }
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFieldErrors({});
      onClose();
    }
  };

  if (!isOpen || !book) return null;

  // Use optimistic book for display
  const displayBook = optimisticBook || book;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-2 sm:p-4">
      <div
        className="w-full max-w-xl md:max-w-2xl mx-auto my-8 bg-white rounded-3xl shadow-2xl border-2 border-blue-500/10 overflow-hidden flex flex-col md:flex-row"
        style={{
          maxHeight: '70vh',
          minHeight: '400px',
        }}
      >
        {/* Left: Illustration/Info */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/90 to-blue-400/80 p-8 w-1/2">
          <Edit3 className="h-16 w-16 text-white mb-4 drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Edit Book</h2>
          <p className="text-white/90 text-center text-sm mb-4">Update the book details below. All changes will be saved immediately.</p>
          <ul className="text-white/80 text-xs space-y-1">
            <li>• All fields are required</li>
            <li>• ISBN must be valid</li>
            <li>• Copies: 0-100</li>
          </ul>
        </div>
        {/* Right: Form */}
        <div
          className="flex-1 p-6 sm:p-8 relative overflow-y-auto"
          style={{ maxHeight: '90vh' }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-blue-600 rounded-full p-2 bg-white hover:bg-blue-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-gray-200 shadow"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {/* Optimistic Preview */}
          {optimisticBook !== book && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium text-blue-700">
                  Updating book...
                </span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center space-x-2">
                  
                  <span className="font-medium text-gray-900">
                    {displayBook.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  
                  <span className="text-sm text-gray-600">
                    by {displayBook.author}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  
                  <span className="text-sm text-gray-600 font-mono">
                    {displayBook.isbn}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-600">
                    Copies: {" "}
                    <span className="font-semibold text-blue-700">
                      {displayBook.copies}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 pb-6"
          >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                fieldErrors.title
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter book title"
              disabled={isLoading}
            />
            {fieldErrors.title && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              
              Author *
            </label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => handleFieldChange("author", e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                fieldErrors.author
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter author name"
              disabled={isLoading}
            />
            {fieldErrors.author && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.author}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              
              Genre *
            </label>
            <select
              required
              value={formData.genre}
              onChange={(e) =>
                handleFieldChange("genre", e.target.value as Genre)
              }
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer ${
                fieldErrors.genre
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value={Genre.FICTION}>Fiction</option>
              <option value={Genre.NON_FICTION}>Non-Fiction</option>
              <option value={Genre.SCIENCE}>Science</option>
              <option value={Genre.HISTORY}>History</option>
              <option value={Genre.BIOGRAPHY}>Biography</option>
              <option value={Genre.FANTASY}>Fantasy</option>
            </select>
            {fieldErrors.genre && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.genre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              
              ISBN *
            </label>
            <input
              type="text"
              required
              value={formData.isbn}
              onChange={(e) => handleFieldChange("isbn", e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono ${
                fieldErrors.isbn
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter ISBN number (e.g., 9780743273565)"
              disabled={isLoading}
            />
            {fieldErrors.isbn && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.isbn}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
             
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                fieldErrors.description
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter book description"
              disabled={isLoading}
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-600 mt-1">
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              
              Number of Copies *
            </label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={formData.copies}
              onChange={(e) =>
                handleFieldChange("copies", parseInt(e.target.value) || 0)
              }
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                fieldErrors.copies
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter number of copies"
              disabled={isLoading}
            />
            {fieldErrors.copies && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.copies}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-100">
            <input
              type="checkbox"
              id="available"
              checked={formData.available}
              onChange={(e) => handleFieldChange("available", e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
              disabled={isLoading}
            />
            <label
              htmlFor="available"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                Available for borrowing
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={
                isLoading ||
                Object.keys(fieldErrors).some((key) => fieldErrors[key] !== "")
              }
              className="w-full sm:flex-1 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none border-0 text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="text-xs sm:text-sm">Updating...</span>
                </div>
              ) : (
                <>
                  
                  <span className="text-sm">Update Book</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:flex-1 bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none border-0 text-sm sm:text-base"
            >
              Cancel
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

export default EditBookModal;
