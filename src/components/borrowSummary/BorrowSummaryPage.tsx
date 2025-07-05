import { AlertCircle, ChartNoAxesCombined } from "lucide-react";
import { useGetBorrowSummaryQuery } from "../../redux/api/baseApi";

// Skeleton component for loading state
const BorrowSummarySkeleton = () => (
  <div className="space-y-6 container mx-auto">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded animate-pulse" />
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />
    </div>

    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Table Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b">
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse justify-self-end" />
        </div>
      </div>

      {/* Table Body Skeleton */}
      <div className="divide-y">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 p-4">
            <div className="h-5 w-48 bg-muted rounded animate-pulse" />
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-6 w-16 bg-muted rounded-full animate-pulse justify-self-end" />
          </div>
        ))}
      </div>
    </div>

    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-8 w-16 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const BorrowSummaryPage = () => {
  const { data, isLoading, error } = useGetBorrowSummaryQuery();

  if (isLoading) {
    return <BorrowSummarySkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <ChartNoAxesCombined className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Borrow Summary</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to load borrow summary. Please try again.</span>
          </div>
        </div>
      </div>
    );
  }

  const summary = data?.data || [];

  return (
    <div className="space-y-6 container mx-auto">
      <div className="flex items-center gap-3">
        <ChartNoAxesCombined className="h-8 w-8 text-primary" />
        <h2 className="text-5xl font-bold tracking-tight">Borrow <span className="text-[#de3241]">Summary</span></h2>
      </div>

      {summary.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          <ChartNoAxesCombined className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No Borrowed Books</h3>
          <p>There are currently no books that have been borrowed.</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          {/* Table Header */}
          <div className="border-b bg-[#de3241]/10">
            <div className="grid grid-cols-3 gap-4 p-4 font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              <div>Book Title</div>
              <div>ISBN</div>
              <div className="text-right">Total Quantity Borrowed</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y">
            {summary.map((item, index) => (
              <div
                key={`${item.book.isbn}-${index}`}
                className="grid grid-cols-3 gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="font-medium text-foreground">
                  {item.book.title}
                </div>
                <div className="text-muted-foreground font-mono text-sm">
                  {item.book.isbn}
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white">
                    {item.totalQuantity}{" "}
                    {item.totalQuantity === 1 ? "copy" : "copies"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default BorrowSummaryPage;
