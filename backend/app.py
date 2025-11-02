from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import time
import re
from utils import bruteForce, rabinKarp, kmp_matcher

app = Flask(__name__)
CORS(app)

# Load dataset at startup
try:
    with open('dataset.pkl', 'rb') as f:
        dataset = pickle.load(f)
    print(f"✓ Dataset loaded: {len(dataset)} documents")
except FileNotFoundError:
    print("⚠ Warning: dataset.pkl not found. Using empty dataset.")
    dataset = {}

# Common stop words to filter out
STOP_WORDS = {
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
}

def remove_stop_words(text):
    """Remove stop words and punctuation from search query"""
    # Remove punctuation and convert to lowercase
    text_clean = re.sub(r'[^\w\s]', ' ', text.lower())
    # Split and filter stop words
    words = [w.strip() for w in text_clean.split() if w.strip() and w not in STOP_WORDS]
    return ' '.join(words)

def calculate_match_score(text, keywords, algorithm='bruteForce'):
    """Calculate match score using specified algorithm - searches each keyword separately"""
    if not keywords or not text:
        return 0, [], []
    
    text_lower = text.lower()
    
    # Split keywords into individual words
    keyword_list = [kw.strip() for kw in keywords.split() if kw.strip()]
    if not keyword_list:
        return 0, [], []
    
    all_matches = []
    matched_keywords = []
    total_matches_count = 0
    
    # Search for each keyword separately
    for keyword in keyword_list:
        keyword_lower = keyword.lower()
        
        # Choose algorithm
        if algorithm == 'bruteForce':
            matches = bruteForce(text_lower, keyword_lower)
        elif algorithm == 'rabinKarp':
            matches = rabinKarp(text_lower, keyword_lower)
        elif algorithm == 'kmp':
            matches = kmp_matcher(text_lower, keyword_lower)
        else:
            matches = []
        
        if matches:  # If keyword found
            matched_keywords.append(keyword)
            total_matches_count += len(matches)
            all_matches.extend([(keyword, pos) for pos in matches])
    
    # Calculate relevance score: (matched keywords / total keywords) * 100
    # If all keywords are found at least once, score is 100%
    score = (len(matched_keywords) / len(keyword_list)) * 100 if keyword_list else 0
    score = round(score, 2)
    
    return score, all_matches, matched_keywords

@app.route('/search', methods=['POST'])
def search():
    """Search documents using keywords"""
    try:
        data = request.get_json()
        keywords = data.get('keywords', '')
        algorithm = data.get('algorithm', 'bruteForce')
        
        if not keywords:
            return jsonify({'error': 'Keywords required'}), 400
        
        # Remove stop words
        cleaned_keywords = remove_stop_words(keywords)
        if not cleaned_keywords:
            return jsonify({'error': 'No valid keywords after filtering stop words'}), 400
        
        # Search all documents
        results = []
        for filename, content in dataset.items():
            score, all_matches, matched_keywords = calculate_match_score(content, cleaned_keywords, algorithm)
            if score > 0:  # Only include documents with matches
                results.append({
                    'filename': filename,
                    'score': score,
                    'matches': len(all_matches),
                    'matched_keywords': matched_keywords,
                    'total_keywords': len(cleaned_keywords.split())
                })
        
        # Sort by score (descending)
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'results': results,
            'query': keywords,
            'cleaned_query': cleaned_keywords,
            'total_documents': len(dataset),
            'matched_documents': len(results)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/compare', methods=['POST'])
def compare():
    """Compare execution times of all three algorithms"""
    try:
        data = request.get_json()
        keywords = data.get('keywords', '')
        
        if not keywords:
            return jsonify({'error': 'Keywords required'}), 400
        
        # Remove stop words
        cleaned_keywords = remove_stop_words(keywords)
        if not cleaned_keywords:
            return jsonify({'error': 'No valid keywords after filtering stop words'}), 400
        
        algorithms = {
            'Brute Force': 'bruteForce',
            'Rabin-Karp': 'rabinKarp',
            'KMP': 'kmp'
        }
        
        comparison_results = []
        
        # Test each algorithm
        for algo_name, algo_key in algorithms.items():
            start_time = time.perf_counter()
            
            # Run algorithm on all documents
            results = []
            for filename, content in dataset.items():
                score, all_matches, matched_keywords = calculate_match_score(content, cleaned_keywords, algo_key)
                if score > 0:
                    results.append({
                        'filename': filename,
                        'score': score,
                        'matches': len(all_matches),
                        'matched_keywords': matched_keywords
                    })
            
            end_time = time.perf_counter()
            execution_time = round((end_time - start_time) * 1000, 3)  # Convert to ms
            
            # Sort results
            results.sort(key=lambda x: x['score'], reverse=True)
            
            comparison_results.append({
                'algorithm': algo_name,
                'execution_time': execution_time,
                'matched_documents': len(results),
                'top_results': results[:5]  # Return top 5 matches
            })
        
        return jsonify({
            'query': keywords,
            'cleaned_query': cleaned_keywords,
            'comparisons': comparison_results,
            'total_documents': len(dataset)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'documents_loaded': len(dataset)
    })

if __name__ == '__main__':
    print("🚀 Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000)