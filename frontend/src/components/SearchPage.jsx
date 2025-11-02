import React, { useState } from 'react';
import { searchDocuments } from '../utils/api';
import ResultCard from './ResultCard';

function SearchPage() {
  const [keywords, setKeywords] = useState('');
  const [algorithm, setAlgorithm] = useState('bruteForce');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!keywords.trim()) {
      setError('Please enter keywords to search');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchDocuments(keywords, algorithm);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to search documents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h2 className="page-title">🔍 Search Documents</h2>
        <p className="page-subtitle">
          Enter keywords to search through documents using string matching algorithms
        </p>

        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label htmlFor="keywords">Keywords</label>
            <input
              type="text"
              id="keywords"
              className="input-field"
              placeholder="e.g., machine learning, artificial intelligence"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="algorithm">Algorithm</label>
            <select
              id="algorithm"
              className="select-field"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="bruteForce">Brute Force</option>
              <option value="rabinKarp">Rabin-Karp</option>
              <option value="kmp">KMP (Knuth-Morris-Pratt)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {results && (
          <div className="results-section">
            <div className="results-header">
              <h3>Search Results</h3>
              <div className="results-stats">
                <span className="stat">
                  <strong>Query:</strong> {results.query}
                </span>
                {results.cleaned_query !== results.query && (
                  <span className="stat">
                    <strong>Cleaned:</strong> {results.cleaned_query}
                  </span>
                )}
                <span className="stat">
                  <strong>Matched:</strong> {results.matched_documents} / {results.total_documents} documents
                </span>
              </div>
            </div>

            <div className="results-grid">
              {results.results.length > 0 ? (
                results.results.map((result, index) => (
                  <ResultCard key={index} result={result} rank={index + 1} />
                ))
              ) : (
                <div className="no-results">
                  <p>No documents found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;