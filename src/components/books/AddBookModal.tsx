import {
  BookOpen,
  CheckCircle,
  X
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateBookMutation } from "../../redux/api/baseApi";
import { Genre } from "../../types";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Zod validation schema based on API documentation
const createBookSchema = z.object({
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
    .min(1, "At least 1 copy is required")
    .max(100, "Maximum 100 copies allowed"),
  available: z.boolean().default(true),
});

type CreateBookFormData = z.infer<typeof createBookSchema>;

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose }) => {
  const [createBook, { isLoading }] = useCreateBookMutation();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateBookFormData>({
    title: "",
    author: "",
    genre: Genre.FICTION,
    isbn: "",
    description: "",
    copies: 1,
    available: true,
  });

  const validateField = (
    field: keyof CreateBookFormData,
    value: string | number | boolean
  ) => {
    try {
      const fieldSchema = createBookSchema.shape[field];
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
    field: keyof CreateBookFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      // Validate entire form
      const validatedData = createBookSchema.parse(formData);

      try {
        console.log("Sending book data:", validatedData);
        const result = await createBook(validatedData).unwrap();
        console.log("Book created successfully:", result);

        // Success toast
        toast.success("Book added successfully!", {
          description: `${validatedData.title} by ${validatedData.author} has been added to the collection.`,
          duration: 4000,
        });

        // Reset form
        setFormData({
          title: "",
          author: "",
          genre: Genre.FICTION,
          isbn: "",
          description: "",
          copies: 1,
          available: true,
        });
        onClose();
      } catch (error) {
        console.error("Failed to create book:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        toast.error("Failed to add book", {
          description:
            "An error occurred while adding the book. Please try again.",
          duration: 5000,
        });
      }
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
      // Reset form data
      setFormData({
        title: "",
        author: "",
        genre: Genre.FICTION,
        isbn: "",
        description: "",
        copies: 1,
        available: true,
      });
      setFieldErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto my-8 bg-white rounded-3xl shadow-2xl border-2 border-[#de3241]/10 overflow-hidden flex flex-col md:flex-row">
        {/* Left: Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-[#de3241]/90 to-[#de3241]/60 p-8 w-1/2">
          <BookOpen className="h-16 w-16 text-white mb-4 drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Add a New Book</h2>
          <p className="text-white/90 text-center text-sm mb-4">Fill in the details to add a new book to your collection. All fields marked with * are required.</p>
          <ul className="text-white/80 text-xs space-y-1">
            <li>• Ensure ISBN is valid</li>
            <li>• Genre helps categorize</li>
            <li>• Copies must be at least 1</li>
          </ul>
        </div>
        {/* Right: Form */}
        <div className="flex-1 p-6 sm:p-8 relative">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-[#de3241]   rounded-full p-2   "
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#de3241] focus:border-[#de3241] transition-colors ${fieldErrors.title ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"}`}
                  placeholder="Book title"
                  disabled={isLoading}
                  autoComplete="off"
                />
                {fieldErrors.title && <p className="text-xs text-red-600 mt-1">{fieldErrors.title}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Author *</label>
                <input
                  type="text"
                  name="author"
                  required
                  value={formData.author}
                  onChange={(e) => handleFieldChange("author", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#de3241] focus:border-[#de3241] transition-colors ${fieldErrors.author ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"}`}
                  placeholder="Author name"
                  disabled={isLoading}
                  autoComplete="off"
                />
                {fieldErrors.author && <p className="text-xs text-red-600 mt-1">{fieldErrors.author}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Genre *</label>
                <select
                  name="genre"
                  required
                  value={formData.genre}
                  onChange={(e) => handleFieldChange("genre", e.target.value as Genre)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#de3241] focus:border-[#de3241] transition-colors cursor-pointer ${fieldErrors.genre ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"}`}
                  disabled={isLoading}
                >
                  <option value={Genre.FICTION}>Fiction</option>
                  <option value={Genre.NON_FICTION}>Non-Fiction</option>
                  <option value={Genre.SCIENCE}>Science</option>
                  <option value={Genre.HISTORY}>History</option>
                  <option value={Genre.BIOGRAPHY}>Biography</option>
                  <option value={Genre.FANTASY}>Fantasy</option>
                </select>
                {fieldErrors.genre && <p className="text-xs text-red-600 mt-1">{fieldErrors.genre}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">ISBN *</label>
                <input
                  type="text"
                  name="isbn"
                  required
                  value={formData.isbn}
                  onChange={(e) => handleFieldChange("isbn", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#de3241] focus:border-[#de3241] transition-colors ${fieldErrors.isbn ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"}`}
                  placeholder="e.g. 9780743273565"
                  disabled={isLoading}
                  autoComplete="off"
                />
                {fieldErrors.isbn && <p className="text-xs text-red-600 mt-1">{fieldErrors.isbn}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#de3241] focus:border-[#de3241] transition-colors resize-none ${fieldErrors.description ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"}`}
                placeholder="Book description (optional)"
                disabled={isLoading}
                autoComplete="off"
              />
              {fieldErrors.description && <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Number of Copies *</label>
                <input
                  type="number"
                  name="copies"
                  min="1"
                  max="100"
                  required
                  value={formData.copies}
                  onChange={(e) => handleFieldChange("copies", parseInt(e.target.value) || 1)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#de3241] focus:border-[#de3241] transition-colors ${fieldErrors.copies ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"}`}
                  placeholder="e.g. 5"
                  disabled={isLoading}
                  autoComplete="off"
                />
                {fieldErrors.copies && <p className="text-xs text-red-600 mt-1">{fieldErrors.copies}</p>}
              </div>
              <div className="w-full flex gap-1 items-start">
                <input
                  type="checkbox"
                  name="available"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => handleFieldChange("available", e.target.checked)}
                  className="h-4 w-4 accent-[#22c55e] border-gray-300 rounded focus:ring-[#22c55e] flex-shrink-0 mr-2 mb-1 bg-white"
                  disabled={isLoading}
                />
                <label htmlFor="available" className="text-xs font-medium text-gray-700 flex items-center w-full">
                  <CheckCircle className="h-4 w-4 mr-1 text-[#22c55e] flex-shrink-0" />
                  Available for borrowing
                </label>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100 mt-2">
              <button
                type="submit"
                disabled={isLoading || Object.keys(fieldErrors).some((key) => fieldErrors[key] !== "")}
                className="w-full sm:flex-1 bg-gradient-to-r from-[#de3241] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#de3241] text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none border-0 text-sm shadow-md"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="text-xs">Adding...</span>
                  </div>
                ) : (
                  <>
                   
                    <span className="text-sm">Add Book</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full sm:flex-1 bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none border-0 text-sm shadow-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
