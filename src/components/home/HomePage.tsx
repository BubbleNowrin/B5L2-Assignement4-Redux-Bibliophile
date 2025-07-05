import Categories from "./Categories";
import CTA from "./CTA";
import Features from "./Features";
import Hero from "./Hero";
import LatestBooks from "./LatestBooks";
import Stats from "./Stats";


const HomePage = () => {

  return (
    <div className="min-h-screen">
    <Hero />
    <Categories />
    <LatestBooks />
    <Stats />
    <Features/>
    <CTA/>
    </div>
  );
};

export default HomePage;
