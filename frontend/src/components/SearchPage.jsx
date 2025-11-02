import React, { useState, useEffect } from 'react';
import { searchDocuments } from '../utils/api';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';
import GradientBackground from './GradientBackground';

function SearchPage() {
  const [keywords, setKeywords] = useState('');
  const [algorithm, setAlgorithm] = useState('bruteForce');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobDescriptions, setJobDescriptions] = useState({});
  const [selectedJob, setSelectedJob] = useState('');

  // Fetch job descriptions on mount
  useEffect(() => {
    fetch('http://localhost:5000/job_descriptions')
      .then(res => res.json())
      .then(data => {
        setJobDescriptions(data.job_descriptions || {});
      })
      .catch(err => console.error('Error loading job descriptions:', err));
  }, []);

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

  const algorithmNames = {
    bruteForce: 'Brute Force',
    rabinKarp: 'Rabin-Karp',
    kmp: 'KMP (Knuth-Morris-Pratt)'
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 px-4 overflow-hidden bg-white">
        {/* Animated Gradient Background */}
        <GradientBackground />
        {/* Light overlay for better text readability */}
        <div className="absolute inset-0 bg-white/40 z-10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center z-20">
          <h1 className="text-6xl md:text-7xl font-light tracking-tight leading-tight mb-6 text-gray-900 animate-fade-in">
            Analyze CVs intelligently
            <br />
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              with pattern matching.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light mb-12 max-w-2xl mx-auto animate-slide-up">
            Compare hundreds of resumes with advanced algorithms.
          </p>

          {/* Search Form - Glass Card */}
          <form onSubmit={handleSearch} className="glass rounded-3xl p-8 md:p-10 max-w-2xl mx-auto shadow-2xl animate-slide-up">
            <div className="space-y-6">
              {/* Job Description Selector */}
              {Object.keys(jobDescriptions).length > 0 && (
                <div>
                  <label htmlFor="jobDescription" className="block text-sm font-semibold text-gray-700 mb-3 text-left">
                    Predefined Job Description (Optional)
                  </label>
                  <select
                    id="jobDescription"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg shadow-sm mb-2"
                    value={selectedJob}
                    onChange={(e) => {
                      setSelectedJob(e.target.value);
                      if (e.target.value) {
                        const jobKeywords = jobDescriptions[e.target.value].join(' ');
                        setKeywords(jobKeywords);
                      }
                    }}
                  >
                    <option value="">-- Select a job description --</option>
                    {Object.keys(jobDescriptions).map((jobName) => (
                      <option key={jobName} value={jobName}>
                        {jobName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-3 text-left">
                  Job Keywords
                </label>
                <input
                  type="text"
                  id="keywords"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg shadow-sm"
                  placeholder="e.g., Python, Machine Learning, React, Node.js"
                  value={keywords}
                  onChange={(e) => {
                    setKeywords(e.target.value);
                    if (selectedJob) setSelectedJob(''); // Clear selection if manually editing
                  }}
                />
              </div>

              <div>
                <label htmlFor="algorithm" className="block text-sm font-semibold text-gray-700 mb-3 text-left">
                  Algorithm
                </label>
                <select
                  id="algorithm"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg shadow-sm"
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                >
                  <option value="bruteForce">Brute Force</option>
                  <option value="rabinKarp">Rabin-Karp</option>
                  <option value="kmp">KMP (Knuth-Morris-Pratt)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 mb-8 animate-slide-up">
          <div className="glass rounded-2xl p-6 border-red-200 bg-red-50/50">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="max-w-6xl mx-auto px-4">
          <LoadingSpinner text="Analyzing CVs..." />
        </div>
      )}

      {results && !loading && (
        <div className="max-w-7xl mx-auto px-4 pb-20 animate-fade-in">
          {/* Results Header */}
          <div className="glass rounded-3xl p-8 mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">Search Results</h2>
                <p className="text-lg text-gray-600">
                  Found <span className="font-semibold text-blue-600">{results.matched_documents}</span> out of{' '}
                  <span className="font-semibold">{results.total_documents}</span> CVs
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="bg-blue-50 rounded-xl px-5 py-3 border border-blue-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Query</p>
                  <p className="font-semibold text-gray-900">{results.query}</p>
                </div>
                {results.cleaned_query !== results.query && (
                  <div className="bg-purple-50 rounded-xl px-5 py-3 border border-purple-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cleaned</p>
                    <p className="font-semibold text-gray-900">{results.cleaned_query}</p>
                  </div>
                )}
                <div className="bg-green-50 rounded-xl px-5 py-3 border border-green-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Algorithm</p>
                  <p className="font-semibold text-gray-900">{algorithmNames[algorithm]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {results.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.results.map((result, index) => (
                <ResultCard
                  key={index}
                  result={result}
                  rank={index + 1}
                  keywords={results.cleaned_query}
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-3xl p-16 text-center shadow-xl">
              <svg className="mx-auto h-20 w-20 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No matches found</h3>
              <p className="text-gray-600">Try adjusting your keywords or using a different algorithm</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
