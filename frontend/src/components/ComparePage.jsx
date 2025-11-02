import React, { useState } from 'react';
import { compareAlgorithms } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import LoadingSpinner from './LoadingSpinner';
import { motion } from 'framer-motion';
import GradientBackground from './GradientBackground';

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

  // Soft pastel colors for charts
  const colors = {
    'Brute Force': '#8b5cf6', // Purple
    'Rabin-Karp': '#06b6d4',  // Cyan
    'KMP': '#10b981'        // Green
  };

  const chartData = results ? results.comparisons.map(comp => ({
    name: comp.algorithm,
    time: Number(comp.execution_time.toFixed(3)),
    comparisons: comp.total_comparisons || 0,
    matches: comp.matched_documents
  })) : [];

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
            Compare algorithm
            <br />
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              performance.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light mb-12 max-w-2xl mx-auto animate-slide-up">
            Benchmark Brute Force, Rabin-Karp, and KMP algorithms side by side.
          </p>

          {/* Search Form */}
          <form onSubmit={handleCompare} className="glass rounded-3xl p-8 md:p-10 max-w-2xl mx-auto shadow-2xl animate-slide-up">
            <div className="space-y-6">
              <div>
                <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-3 text-left">
                  Query Keywords
                </label>
                <input
                  type="text"
                  id="keywords"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-lg shadow-sm"
                  placeholder="e.g., Python, Machine Learning, React"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Comparing...
                  </span>
                ) : (
                  'Compare Algorithms'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Message */}
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

      {/* Loading State */}
      {loading && (
        <div className="max-w-6xl mx-auto px-4">
          <LoadingSpinner text="Executing benchmarks..." />
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="max-w-7xl mx-auto px-4 pb-20 space-y-8">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-2">Benchmark Summary</h2>
                <p className="text-lg text-gray-600">
                  Tested on <span className="font-semibold text-purple-600">{results.total_documents}</span> documents
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl px-5 py-3 border border-blue-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Query</p>
                <p className="font-semibold text-gray-900">{results.query}</p>
              </div>
            </div>
          </motion.div>

          {/* Execution Time Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-3xl p-8 md:p-10 shadow-xl"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-3 text-3xl"></span>
              Execution Time Comparison
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12 }}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                    formatter={(value, name) => {
                      if (name === 'time') return [`${value.toFixed(3)} ms`, 'Execution Time'];
                      if (name === 'matches') return [value, 'Matched Documents'];
                      return value;
                    }}
                  />
                  <Bar dataKey="time" name="Execution Time (ms)" radius={[12, 12, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Character Comparisons Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass rounded-3xl p-8 md:p-10 shadow-xl"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-3 text-3xl"></span>
              Character Comparisons Comparison
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    label={{ value: 'Comparisons', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12 }}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={{ stroke: '#d1d5db' }}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                      return value.toString();
                    }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                    formatter={(value, name) => {
                      if (name === 'comparisons') return [value.toLocaleString(), 'Character Comparisons'];
                      return value;
                    }}
                  />
                  <Bar dataKey="comparisons" name="Character Comparisons" radius={[12, 12, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-comparisons-${index}`} fill={colors[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-3xl p-8 shadow-xl overflow-x-auto"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 text-left font-semibold text-gray-700">Algorithm</th>
                  <th className="py-4 px-4 text-right font-semibold text-gray-700">Time (ms)</th>
                  <th className="py-4 px-4 text-right font-semibold text-gray-700">Comparisons</th>
                  <th className="py-4 px-4 text-right font-semibold text-gray-700">Collisions</th>
                  <th className="py-4 px-4 text-right font-semibold text-gray-700">Matches</th>
                  <th className="py-4 px-4 text-right font-semibold text-gray-700">Small CVs</th>
                  <th className="py-4 px-4 text-right font-semibold text-gray-700">Medium CVs</th>
                  <th className="py-4 px-4 text-right font-semibold text-gray-700">Large CVs</th>
                </tr>
              </thead>
              <tbody>
                {results.comparisons.map((comp, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: colors[comp.algorithm] }}
                        />
                        <span className="font-medium text-gray-900">{comp.algorithm}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-semibold text-lg" style={{ color: colors[comp.algorithm] }}>
                      {Number(comp.execution_time).toFixed(3)}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700 font-medium">
                      {comp.total_comparisons ? comp.total_comparisons.toLocaleString() : 'N/A'}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700 font-medium">
                      {comp.algorithm === 'Rabin-Karp' 
                        ? (comp.total_collisions || 0).toLocaleString() 
                        : '-'}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-700 font-medium">{comp.matched_documents}</td>
                    <td className="text-right py-4 px-4 text-gray-600">
                      {comp.small_cv_count || 0}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-600">
                      {comp.medium_cv_count || 0}
                    </td>
                    <td className="text-right py-4 px-4 text-gray-600">
                      {comp.large_cv_count || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ComparePage;
