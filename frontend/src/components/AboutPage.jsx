import React from 'react';
import GradientBackground from './GradientBackground';

function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 px-4 overflow-hidden bg-white">
        {/* Animated Gradient Background */}
        <GradientBackground height="70vh" />
        {/* Light overlay for better text readability */}
        <div className="absolute inset-0 bg-white/40 z-10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center z-20">
          <h1 className="text-6xl md:text-7xl font-light tracking-tight leading-tight mb-6 text-gray-900 animate-fade-in">
            About CV Analyzer
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light mb-12 max-w-2xl mx-auto animate-slide-up">
            Intelligent, Data-Driven Candidate Assessment Platform
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-12">
        {/* Overview */}
        <div className="glass rounded-3xl p-8 md:p-10 shadow-xl">
          <div className="border-l-4 border-blue-500 pl-6">
            <p className="text-xl leading-relaxed font-light text-gray-700">
              CV Analyzer is a powerful full-stack web application designed to help recruiters and HR professionals 
              efficiently analyze and rank candidate resumes based on specific job requirements. Utilizing 
              advanced string matching algorithms, the platform delivers objective match scores, significantly 
              streamlining the candidate screening process.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="glass rounded-3xl p-8 md:p-10 shadow-xl">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-4">
            Core Capabilities
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold text-xl mt-1">•</span>
              <span className="text-gray-700">Search and analyze CVs using customizable job keywords</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold text-xl mt-1">•</span>
              <span className="text-gray-700">Rank candidates by match percentage and relevance</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold text-xl mt-1">•</span>
              <span className="text-gray-700">Compare performance of different string matching algorithms</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-blue-600 font-bold text-xl mt-1">•</span>
              <span className="text-gray-700">Visual performance metrics and execution time comparisons</span>
            </li>
          </ul>
        </div>

        {/* Algorithms */}
        <div className="glass rounded-3xl p-8 md:p-10 shadow-xl">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-4">
            String Matching Algorithms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 border border-white/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Brute Force</h3>
              <p className="text-gray-600 mb-4">
                Simple pattern matching that checks every possible position. High reliability but checks every position.
              </p>
              <p className="text-xs font-mono text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
                O(n×m)
              </p>
            </div>
            
            <div className="glass rounded-2xl p-6 border border-white/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Rabin-Karp</h3>
              <p className="text-gray-600 mb-4">
                Uses rolling hash to quickly eliminate non-matching positions. Fast pre-filtering of non-matching text.
              </p>
              <p className="text-xs font-mono text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg inline-block">O(n+m) avg
              </p>
            </div>
            
            <div className="glass rounded-2xl p-6 border border-white/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">KMP</h3>
              <p className="text-gray-600 mb-4">
                Uses failure function to avoid re-checking previously matched characters. Optimizes shifts and avoids re-checks.
              </p>
              <p className="text-xs font-mono text-green-600 bg-green-50 px-3 py-1.5 rounded-lg inline-block">
                O(n+m)
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass rounded-3xl p-8 md:p-10 shadow-xl">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-4">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">•</span> React 18 & Modern Tooling
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">•</span> Tailwind CSS for Styling
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">•</span> Recharts for Visualization
                </li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Backend</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-purple-600 mr-2">•</span> Flask (Python) Web Framework
                </li>
                <li className="flex items-center">
                  <span className="text-purple-600 mr-2">•</span> PyMuPDF for PDF Extraction
                </li>
                <li className="flex items-center">
                  <span className="text-purple-600 mr-2">•</span> Custom Algorithm Implementation
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="glass rounded-3xl p-8 md:p-10 shadow-xl text-center">
          <p className="text-gray-700 mb-2">
            Engineered by <span className="font-semibold text-gray-900">Syed Ali Haider Naqvi</span>
          </p>
          <p className="text-sm text-gray-500">
            This project was created for educational purposes as part of an algorithm assignment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
