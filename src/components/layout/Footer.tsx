import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer>
      <section className="py-8 sm:py-10 bg-muted/50">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-muted-foreground text-sm sm:text-base">
            <BookOpen className="h-6 w-6 text-[#52877a] flex-shrink-0 mb-1 sm:mb-0" />
            <span className="break-words max-w-xs sm:max-w-none">Thank you for visiting <span className="font-semibold text-[#52877a]">BiblioPhile</span>. Happy reading! © {new Date().getFullYear()}</span>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
