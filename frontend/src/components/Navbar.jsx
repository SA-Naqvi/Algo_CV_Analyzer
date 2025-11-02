import React from 'react';

function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left Side - Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CV Analyzer
            </span>
          </div>

          {/* Right Side - Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage('search')}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentPage === 'search'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              Analyzer
            </button>
            <button
              onClick={() => setCurrentPage('compare')}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentPage === 'compare'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentPage === 'about'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-white/20 bg-white/80 backdrop-blur-md">
        <div className="px-4 py-3 space-y-2">
          <button
            onClick={() => setCurrentPage('search')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'search'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-blue-50/50'
            }`}
          >
            Analyzer
          </button>
          <button
            onClick={() => setCurrentPage('compare')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'compare'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-blue-50/50'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setCurrentPage('about')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all ${
              currentPage === 'about'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-blue-50/50'
            }`}
          >
            About
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
