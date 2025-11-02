import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import ComparePage from './components/ComparePage';
import AboutPage from './components/AboutPage';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('search');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="flex-grow">
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'compare' && <ComparePage />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
