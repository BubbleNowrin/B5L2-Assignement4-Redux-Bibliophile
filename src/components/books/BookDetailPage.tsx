import {
  AlertCircle,
  ArrowLeft,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  FileText,
  Hash,

  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BorrowBookModal from "./BorrowBookModal";

import { Button } from "../ui/Button";
import { useGetBookByIdQuery } from "../../redux/api/baseApi";


// Modern, visually rich skeleton for loading state
const BookDetailSkeleton = () => (
  <div className="max-w-5xl mx-auto py-10 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full" />
        <div className="h-8 w-56 bg-gradient-to-r from-blue-100 to-purple-100 rounded" />
      </div>
      <div className="h-8 w-32 bg-gradient-to-r from-emerald-100 to-teal-100 rounded" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Main Book Card Skeleton */}
      <div className="md:col-span-2 space-y-8">
        <div className="rounded-3xl shadow-lg border-2 border-blue-100 bg-white/80 p-8">
          <div className="h-8 w-2/3 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-4" />
          <div className="h-5 w-1/3 bg-gradient-to-r from-blue-100 to-pink-100 rounded mb-6" />
          <div className="h-4 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gradient-to-r from-gray-100 to-gray-200 rounded mb-2" />
          <div className="h-4 w-1/2 bg-gradient-to-r from-gray-100 to-gray-200 rounded" />
        </div>
        <div className="rounded-3xl shadow border border-gray-100 bg-white/70 p-6 space-y-4">
          <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded mb-2" />
          <div className="grid grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-4 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full" />
                <div className="h-4 w-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded" />
                <div className="h-4 w-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sidebar Skeleton */}
      <div className="space-y-6">
        <div className="rounded-2xl shadow border border-gray-100 bg-white/70 p-6">
          <div className="h-6 w-24 bg-gradient-to-r from-green-200 to-emerald-100 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded" />
                <div className="h-4 w-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl shadow border border-gray-100 bg-white/70 p-6">
          <div className="h-6 w-20 bg-gradient-to-r from-pink-200 to-rose-100 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetBookByIdQuery(id || "");
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  if (isLoading) {
    return <BookDetailSkeleton />;
  }

  if (error || !data?.data) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load book details. Please try again.</span>
          </div>
        </div>
      </div>
    );
  }

  const book = data.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Button>
          <div className="hidden xs:block h-6 w-px bg-border" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow">Book <span className="text-[#de3241]">Details</span></h1>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Main Book Card */}
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-3xl shadow-lg border-2 border-blue-100 bg-white/80 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between mb-4">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#de3241] mb-2 break-words">{book.title}</h2>
                <div className="flex items-center gap-2 text-base sm:text-lg text-muted-foreground mb-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium break-words">{book.author}</span>
                </div>
              </div>
              <div className="flex flex-row gap-2 md:flex-col md:gap-2 items-end md:items-end flex-shrink-0">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-xs sm:text-sm shadow">
                  <CheckCircle className="h-4 w-4" />
                  {book.available ? "Available" : "Unavailable"}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-xs sm:text-sm shadow">
                  <Copy className="h-4 w-4" />
                  {book.copies} copies
                </span>
              </div>
            </div>
            <div className="prose prose-sm max-w-none mb-4">
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg break-words">{book.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 mt-6">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-700" />
                <span className="text-sm sm:text-base font-medium text-[#de3241]">ISBN:</span>
                <span className="font-mono text-xs sm:text-base bg-blue-50 px-2 py-1 rounded shadow-inner break-all">{book.isbn}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-700" />
                <span className="text-sm sm:text-base font-medium text-[#de3241]">Created:</span>
                <span className="text-xs sm:text-base">{formatDate(book.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-700" />
                <span className="text-sm sm:text-base font-medium text-[#de3241]">Updated:</span>
                <span className="text-xs sm:text-base">{formatDate(book.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-700" />
                <span className="text-sm sm:text-base font-medium text-[#de3241]">Genre:</span>
                <span className="font-semibold text-xs sm:text-base capitalize">{book.genre.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability Card */}
          <div className="rounded-2xl shadow border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookMarked className="h-5 w-5 text-green-500" />
              <span className="text-base sm:text-lg font-bold text-green-700">Availability</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Status:</span>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-xs shadow ${book.available ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'}`}>
                {book.available ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {book.available ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Copies:</span>
              <span className="font-mono font-semibold text-green-700 text-xs sm:text-base">{book.copies}</span>
            </div>
          </div>
          {/* Actions Card */}
          <div className="rounded-2xl shadow border border-[#de3241]/30 bg-[#de3241]/10 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-[#de3241]" />
              <span className="text-base sm:text-lg font-bold text-[#de3241]">Actions</span>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 shadow-lg text-sm sm:text-base font-semibold py-2 sm:py-3"
              disabled={!book.available}
              onClick={() => setIsBorrowModalOpen(true)}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Borrow Book
            </Button>
          </div>
        </div>
      </div>
      {/* Borrow Modal */}
      <BorrowBookModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        book={book}
      />
    </div>
  );
};

export default BookDetailPage;
