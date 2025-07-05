import { Award, Globe, Search, Shield } from "lucide-react";

const Features = () => {
  

  const features = [
    {
      icon: Search,
      title: "Intelligent Book Search",
      description:
        "Quickly locate any title with our powerful, intuitive search and filter tools.",
    },
    {
      icon: Shield,
      title: "Safe & Simple Borrowing",
      description:
        "Borrow books with confidence—track due dates and manage your library with ease.",
    },
    {
      icon: Globe,
      title: "Anytime, Anywhere Access",
      description:
        "Your library is always open—explore and read from any device, wherever you are.",
    },
    {
      icon: Award,
      title: "Expertly Curated Collections",
      description:
        "Discover handpicked books and themed collections for every interest and genre.",
    },
  ];

  return (
    <section className="py-10 xs:py-14 sm:py-20 bg-background">
      <div className="container mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 sm:space-y-4 mb-8 sm:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-bold tracking-tight break-words">
            Discover the <span className="text-[#de3241]">BiblioPhile</span> Advantage
          </h2>
          <p className="text-base xs:text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Enjoy seamless access, curated collections, and innovative features designed for passionate readers and lifelong learners.
          </p>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-4 xs:p-5 sm:p-6 bg-card rounded-xl border hover:border-[#de3241]/50 transition-all duration-200 hover:shadow-lg flex flex-col items-center text-center h-full"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 bg-[#de3241]/10 text-[#de3241] rounded-lg mb-3 sm:mb-4 transition-colors">
                  <Icon className="h-5 w-5 xs:h-6 xs:w-6" />
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
