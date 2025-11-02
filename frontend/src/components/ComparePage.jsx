import React, { useState } from 'react';
import { compareAlgorithms } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ResultCard from './ResultCard';

function ComparePage() {
  const [keywords, setKeywords] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    
    if (!keywords.trim()) {
      setError('Please enter keywords to compare');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await compareAlgorithms(keywords);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to compare algorithms');
    } finally {
      setLoading(false);
    }
  };

  const chartData = results ? results.comparisons.map(comp => ({
    name: comp.algorithm,
    time: comp.execution_time,
    matches: comp.matched_documents
  })) : [];

  return (
    <div className="compare-page">
      <div className="compare-container">
        <h2 className="page-title">⚡ Algorithm Performance Comparison</h2>
        <p className="page-subtitle">
          Compare execution times of Brute Force, Rabin-Karp, and KMP algorithms
        </p>

        <form onSubmit={handleCompare} className="search-form">
          <div className="form-group">
            <label htmlFor="keywords">Keywords</label>
            <input
              type="text"
              id="keywords"
              className="input-field"
              placeholder="e.g., data structure, algorithm"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Comparing...' : 'Compare Algorithms'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {results && (
          <div className="comparison-results">
            <div className="results-header">
              <h3>Comparison Results</h3>
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
                  <strong>Total Documents:</strong> {results.total_documents}
                </span>
              </div>
            </div>

            <div className="chart-section">
              <h4>⏱️ Execution Time Comparison (milliseconds)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'time') return [`${value} ms`, 'Execution Time'];
                      if (name === 'matches') return [value, 'Matched Docs'];
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="time" fill="#3b82f6" name="Execution Time (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="algorithm-details">
              {results.comparisons.map((comp, index) => (
                <div key={index} className="algorithm-card">
                  <div className="algorithm-header">
                    <h4>{comp.algorithm}</h4>
                    <div className="algorithm-stats">
                      <span className="time-badge">{comp.execution_time} ms</span>
                      <span className="match-badge">{comp.matched_documents} matches</span>
                    </div>
                  </div>

                  {comp.top_results.length > 0 ? (
                    <div className="top-results">
                      <h5>Top 5 Results:</h5>
                      {comp.top_results.map((result, idx) => (
                        <ResultCard key={idx} result={result} rank={idx + 1} compact />
                      ))}
                    </div>
                  ) : (
                    <p className="no-matches">No matches found</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;