import { BookOpen, Calendar, Copy, Hash, User, X } from "lucide-react";
import type React from "react";
import { startTransition, useEffect, useOptimistic, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateBorrowMutation } from "../../redux/api/baseApi";
import type { Book } from "../../types";

//

// Zod validation schema for borrow request
const borrowSchema = z.object({
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "At least 1 copy must be borrowed")
    .max(10, "Maximum 10 copies can be borrowed at once"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((date) => {
      const selectedDate = new Date(date);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return selectedDate >= tomorrow;
    }, "Due date must be at least tomorrow"),
});


type BorrowFormData = z.infer<typeof borrowSchema>;

interface BorrowBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

const BorrowBookModal: React.FC<BorrowBookModalProps> = ({ isOpen, onClose, book }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [createBorrow, { isLoading }] = useCreateBorrowMutation();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<BorrowFormData>({
    quantity: 1,
    dueDate: "",
  });

  // Optimistic state for the book
  const [optimisticBook, addOptimisticBook] = useOptimistic(
    book,
    (currentBook, optimisticUpdate: { type: "borrow"; quantity: number }) => {
      if (!currentBook) return currentBook;

      if (optimisticUpdate.type === "borrow") {
        return {
          ...currentBook,
          copies: Math.max(0, currentBook.copies - optimisticUpdate.quantity),
          available:
            Math.max(0, currentBook.copies - optimisticUpdate.quantity) > 0,
        };
      }

      return currentBook;
    }
  );

  // Set default due date when modal opens (minimum 1 day from today)
  useEffect(() => {
    if (isOpen) {
      // Set default due date to 14 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 14);
      setFormData((prev) => ({
        ...prev,
        dueDate: defaultDate.toISOString().split("T")[0],
      }));
    }
  }, [isOpen]);

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const validateField = (
    field: keyof BorrowFormData,
    value: string | number
  ) => {
    try {
      const fieldSchema = borrowSchema.shape[field];
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
    field: keyof BorrowFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!book) return;

    setFieldErrors({});

    try {
      // Validate form data
      const validatedData = borrowSchema.parse(formData);

      // Add optimistic update
      addOptimisticBook({ type: "borrow", quantity: validatedData.quantity });

      // Start transition for the actual API call
      startTransition(async () => {
        try {
          await createBorrow({
            book: book._id,
            quantity: validatedData.quantity,
            dueDate: new Date(validatedData.dueDate).toISOString(),
          }).unwrap();

          // Success toast
          toast.success("Book borrowed successfully!", {
            description: `${validatedData.quantity} copy${
              validatedData.quantity > 1 ? "ies" : "y"
            } of "${book.title}" borrowed until ${new Date(
              validatedData.dueDate
            ).toLocaleDateString()}.`,
            duration: 4000,
          });

          // Reset form
          setFormData({
            quantity: 1,
            dueDate: "",
          });
          onClose();
        } catch (error) {
          // Revert optimistic update on error
          console.error("Failed to borrow book:", error);
          toast.error("Failed to borrow book", {
            description:
              "An error occurred while borrowing the book. Please try again.",
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
      setFormData({
        quantity: 1,
        dueDate: "",
      });
      setFieldErrors({});
      onClose();
    }
  };


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    handleFieldChange("dueDate", selectedDate);
  };

  if (!isOpen) return null;

  // Use optimistic book for display
  const displayBook = optimisticBook || book;
  if (!displayBook) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto my-8 bg-white rounded-3xl shadow-2xl border-2 border-emerald-500/10 overflow-hidden flex flex-col md:flex-row">
        {/* Left: Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600/90 to-emerald-400/80 p-8 w-1/2">
          <BookOpen className="h-16 w-16 text-white mb-4 drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Borrow Book</h2>
          <p className="text-white/90 text-center text-sm mb-4">Select the quantity and due date to borrow this book. You can borrow up to 10 copies at once.</p>
          <ul className="text-white/80 text-xs space-y-1">
            <li>• Due date must be at least tomorrow</li>
            <li>• Maximum 10 copies per borrow</li>
            <li>• Check available copies</li>
          </ul>
        </div>
        {/* Right: Form */}
        <div className="flex-1 p-6 sm:p-8 relative">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-emerald-600 rounded-full p-2 bg-white hover:bg-emerald-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 border border-gray-200 shadow"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {/* Book Info */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 space-y-3 border border-emerald-100">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-gray-900">
                  {displayBook.title}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-teal-600" />
                <span className="text-sm text-gray-600">
                  by {displayBook.author}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-mono">
                  {displayBook.isbn}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Copy className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  Available copies: {" "}
                  <span
                    className={`font-semibold ${
                      displayBook.copies > 0 ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {displayBook.copies}
                  </span>
                  {optimisticBook !== book && (
                    <span className="text-xs text-emerald-600 ml-2">
                      (Processing...)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                max={Math.min(displayBook.copies, 10)}
                required
                value={formData.quantity}
                onChange={(e) =>
                  handleFieldChange("quantity", parseInt(e.target.value) || 1)
                }
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                  fieldErrors.quantity
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-200"}
                `}
                placeholder="Enter quantity"
                disabled={isLoading}
              />
              {fieldErrors.quantity && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrors.quantity}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Maximum {Math.min(displayBook.copies, 10)} copies available
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date *</label>
              <div className="relative">
                <input
                  type="date"
                  min={getMinDate()}
                  required
                  value={formData.dueDate}
                  onChange={handleDateChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    fieldErrors.dueDate
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-200"}
                  `}
                  disabled={isLoading}
                  ref={dateInputRef}
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => {
                    if (dateInputRef.current?.showPicker) {
                      dateInputRef.current.showPicker();
                    } else if (dateInputRef.current) {
                      dateInputRef.current.focus();
                    }
                  }}
                  tabIndex={-1}
                  aria-label="Open calendar"
                >
                  <Calendar className="h-4 w-4 text-emerald-500" />
                </span>
              </div>
              {fieldErrors.dueDate && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.dueDate}</p>
              )}
              {formData.dueDate && (
                <p className="text-xs text-emerald-600 mt-1 font-medium">
                  Selected: {" "}
                  {new Date(formData.dueDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100 mt-2">
              <button
                type="submit"
                disabled={
                  isLoading ||
                  Object.keys(fieldErrors).some((key) => fieldErrors[key] !== "") ||
                  displayBook.copies === 0
                }
                className="w-full sm:flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none border-0 text-sm shadow-md"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    
                    <span className="text-sm">Borrow Book</span>
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
}
export default BorrowBookModal;
