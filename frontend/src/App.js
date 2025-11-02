import React, { useState } from 'react';
import SearchPage from './components/SearchPage';
import ComparePage from './components/ComparePage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('search');

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">📚 Document Search & Algorithm Benchmark</h1>
          <div className="nav-buttons">
            <button
              className={`nav-btn ${currentPage === 'search' ? 'active' : ''}`}
              onClick={() => setCurrentPage('search')}
            >
              🔍 Search
            </button>
            <button
              className={`nav-btn ${currentPage === 'compare' ? 'active' : ''}`}
              onClick={() => setCurrentPage('compare')}
            >
              ⚡ Compare Algorithms
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'search' ? <SearchPage /> : <ComparePage />}
      </main>

      <footer className="footer">
        <p>Built with Flask + React | String Matching Algorithms: Brute Force, Rabin-Karp, KMP</p>
      </footer>
    </div>
  );
}

export default App;