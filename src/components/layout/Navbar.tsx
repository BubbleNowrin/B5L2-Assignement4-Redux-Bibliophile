import {
  BookOpen,
  ChartNoAxesCombined,
  LayoutGrid as HomeIcon,
  LibraryBig
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  return (
    <nav className="relative bg-white shadow">
      <div className="container px-6 py-4 mx-auto">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center select-none">
              <BookOpen className="h-10 w-10 mr-2 text-[#de3241]" />
              <span className="text-3xl font-extrabold tracking-tight text-gray-700 leading-none" style={{letterSpacing: '0.04em'}}>BiblioPhile</span>
            </Link>
            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-gray-500  hover:text-gray-600  focus:outline-none focus:text-gray-600 "
                aria-label="toggle menu"
                onClick={() => setIsOpen(!isOpen)}
              >
                {!isOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* Mobile Menu open: "block", Menu closed: "hidden" */}
          <div
            className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white  lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center ${
              isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full pointer-events-none lg:pointer-events-auto'
            }`}
          >
            {/* Navigation Links Array Mapping with Icons for main routes */}
            {(() => {
              const navLinks = [
                { path: '/', label: 'Home', icon: HomeIcon },
                { path: '/books', label: 'All Books', icon: LibraryBig },
                { path: '/borrow-summary', label: 'Borrow Summary', icon: ChartNoAxesCombined },
              ];
              return (
                <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
                  {navLinks.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        style={{ color: isActive ? '#de3241' : '#374254' }}
                        className={`flex items-center gap-2 px-3 py-2 mx-3 mt-2 transition-colors duration-300 transform rounded-md lg:mt-0 font-medium underline-offset-4
                          ${isActive ? 'font-bold underline' : ''}
                        nav-link-custom`}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
