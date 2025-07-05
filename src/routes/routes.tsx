import BookDetailPage from "@/components/books/BookDetailPage";
import BooksPage from "@/components/books/BooksPage";
import BorrowSummaryPage from "@/components/borrowSummary/BorrowSummaryPage";
import HomePage from "@/components/home/HomePage";
import Wrapper from "@/components/layout/Wrapper";

import { createBrowserRouter } from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Wrapper>
        <HomePage />
      </Wrapper>
    ),
  },
  {
    path: "/books",
    element: (
      <Wrapper>
        <BooksPage />
      </Wrapper>
    ),
  },
  {
    path: "/books/:id",
    element: (
      <Wrapper>
        <BookDetailPage />
      </Wrapper>
    ),
  },
  {
    path: "/borrow-summary",
    element: (
      <Wrapper>
        <BorrowSummaryPage />
      </Wrapper>
    ),
  },
  {},
]);

export default router;
