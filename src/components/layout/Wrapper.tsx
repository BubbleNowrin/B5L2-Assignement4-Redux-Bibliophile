import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto py-8 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Wrapper;
