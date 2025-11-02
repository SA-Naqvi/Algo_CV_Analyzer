import React from 'react';

function ResultCard({ result, rank, compact = false }) {
  const getScoreColor = (score) => {
    if (score >= 5) return '#10b981'; // green
    if (score >= 2) return '#f59e0b'; // orange
    return '#6366f1'; // blue
  };

  if (compact) {
    return (
      <div className="result-card-compact">
        <div className="compact-info">
          <span className="compact-filename">{result.filename}</span>
          <span 
            className="compact-score"
            style={{ color: getScoreColor(result.score) }}
          >
            {result.score}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="result-card">
      <div className="card-header">
        <div className="rank-badge">#{rank}</div>
        <div className="filename-container">
          <h4 className="filename">{result.filename}</h4>
        </div>
      </div>
      
      <div className="card-body">
        <div className="score-display">
          <div className="score-circle" style={{ borderColor: getScoreColor(result.score) }}>
            <span className="score-value" style={{ color: getScoreColor(result.score) }}>
              {result.score}%
            </span>
          </div>
          <div className="score-label">Match Score</div>
        </div>
        
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Matches Found</span>
            <span className="stat-value">{result.matches}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;