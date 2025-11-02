import React, { useState } from 'react';

function ResultCard({ result, rank, compact = false, keywords = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    return 'text-purple-600';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (score >= 50) return 'bg-gradient-to-r from-blue-400 to-blue-500';
    return 'bg-gradient-to-r from-purple-400 to-purple-500';
  };

  const candidateName = result.filename.replace(/\.(pdf|docx)$/i, '').replace(/[_-]/g, ' ');

  if (compact) {
    return (
      <div className="glass rounded-xl p-4 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800 truncate">{candidateName}</span>
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getScoreColor(result.score)} bg-white/80`}>
            {result.score}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 group">
      {/* Rank Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
          #{rank}
        </div>
        <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
          {result.score}%
        </div>
      </div>

      {/* Candidate Name */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{candidateName}</h3>
      <p className="text-sm text-gray-500 mb-4">{result.filename}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Match Score</span>
          <span className="text-sm font-semibold text-gray-700">{result.matches} matches</span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor(result.score)} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(result.score, 100)}%` }}
          />
        </div>
      </div>

      {/* Matched Keywords */}
      {result.matched_keywords && result.matched_keywords.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Matched Keywords:</p>
          <div className="flex flex-wrap gap-2">
            {result.matched_keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100"
              >
                {keyword}
              </span>
            ))}
            {result.total_keywords && result.total_keywords > result.matched_keywords.length && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                +{result.total_keywords - result.matched_keywords.length} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* View Details Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      >
        {isExpanded ? 'Hide CV Details' : 'View CV Details'}
      </button>

      {/* Expandable Details */}
      {isExpanded && result.text && (
        <div className="mt-4 p-4 bg-white/60 rounded-xl border border-gray-200 max-h-60 overflow-y-auto">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.text}</p>
        </div>
      )}
    </div>
  );
}

export default ResultCard;
