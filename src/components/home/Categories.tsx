


import { Link } from "react-router-dom";

import bio from "../../../public/biography.png";
import fiction from "../../../public/fiction.png";
import history from "../../../public/history.png";
import nonFiction from "../../../public/non-fiction.png";
import science from "../../../public/science.png";
import tech from "../../../public/tech.png";


const Categories = () => {
 
  const categories = [
    { name: "Fiction", count: "15,000+", color: "bg-blue-500" ,img: fiction },
    { name: "Non-Fiction", count: "12,000+", color: "bg-green-500" ,img: nonFiction },
    { name: "Science", count: "8,000+", color: "bg-purple-500" ,img: science },
    { name: "History", count: "6,000+", color: "bg-orange-500" ,img: history },
    { name: "Technology", count: "5,000+", color: "bg-red-500" ,img: tech },
    { name: "Biography", count: "4,000+", color: "bg-indigo-500" ,img: bio },
  ];


  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-2 sm:space-y-4 mb-10 sm:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-bold tracking-tight break-words">
            Browse by <span className="text-[#de3241]">Category</span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive into our diverse selection—find books for every interest, passion, and curiosity.
          </p>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to="/books"
              className="group p-3 xs:p-4 sm:p-6 bg-card rounded-xl border hover:border-[#de3241]/50 transition-all duration-200 hover:shadow-lg text-center flex flex-col items-center"
            >
              <div
                className={`w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-foreground/10 rounded-lg mb-3 sm:mb-4 flex items-center justify-center`}
              >
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 object-cover"
                />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-[#de3241] text-base xs:text-lg sm:text-xl">{category.name}</h3>
              <p className="text-xs xs:text-sm sm:text-base text-muted-foreground">
                {category.count}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
