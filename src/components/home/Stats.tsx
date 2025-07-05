import { BookOpen, Clock, TrendingUp, Users } from "lucide-react";

  const stats = [
    { icon: BookOpen, value: "50,000+", label: "Books Available" },
    { icon: Users, value: "10,000+", label: "Active Readers" },
    { icon: TrendingUp, value: "95%", label: "Satisfaction Rate" },
    { icon: Clock, value: "24/7", label: "Digital Access" },
  ];

const Stats = () => {
  return (
    // Stats Section
    <section className="py-10 xs:py-14 sm:py-16 bg-card">
      <div className="container mx-auto px-2 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 sm:space-y-4 mb-8 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-bold tracking-tight break-words">
            Our <span className="text-[#de3241]">Library in Numbers</span>
          </h2>
          <p className="text-base xs:text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            See why readers love BiblioPhile—explore our growing collection, active community, and commitment to your reading journey.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center space-y-2 sm:space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#de3241]/10 text-primary rounded-full mx-auto">
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#de3241]" />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
