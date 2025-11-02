import os
import fitz  # PyMuPDF
import pickle
import zipfile
from xml.etree.ElementTree import XML
from tqdm import tqdm

WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
PARA = WORD_NAMESPACE + 'p'
TEXT = WORD_NAMESPACE + 't'

def get_docx_text(path):
    """Extract text from DOCX file"""
    try:
        document = zipfile.ZipFile(path)
        xml_content = document.read('word/document.xml')
        document.close()
        tree = XML(xml_content)
        paragraphs = []
        for paragraph in tree.iter(PARA):
            texts = [node.text for node in paragraph.iter(TEXT) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n\n'.join(paragraphs)
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return ""

def extract_pdf_text(path):
    """Extract text from PDF file"""
    text = []
    try:
        doc = fitz.open(path)
        for page in doc:
            text.append(page.get_text("text"))
        doc.close()
    except Exception as e:
        print(f"Error reading {path}: {e}")
    return "\n".join(text)

def bruteForce(string, pattern):
    """Brute force string matching algorithm - O(n*m) worst case"""
    n = len(string)
    m = len(pattern)
    if m > n:
        return []
    if m == 0:
        return []
    string = string.lower()
    pattern = pattern.lower()
    idx = []
    # Standard brute force: check every position
    for i in range(n - m + 1):
        j = 0
        while j < m and string[i + j] == pattern[j]:
            j += 1
        if j == m:
            idx.append(i)
    return idx

def rabinKarp(string, pattern):
    """Rabin-Karp string matching algorithm - O(n+m) average, O(n*m) worst"""
    n = len(string)
    m = len(pattern)
    if m > n:
        return []
    if m == 0:
        return []
    
    base = 256
    mod = 1009  # Medium prime - balance between speed and collision reduction
    
    string = string.lower()
    pattern = pattern.lower()
    
    # Precompute h = base^(m-1) mod mod efficiently
    h = pow(base, m - 1, mod)
    
    # Calculate hash of pattern and first window of text
    hashPattern = 0
    hashString = 0
    for i in range(m):
        hashPattern = (hashPattern * base + ord(pattern[i])) % mod
        hashString = (hashString * base + ord(string[i])) % mod
    
    idx = []
    
    # Slide the pattern over text
    for i in range(n - m + 1):
        # Check hash values match, then verify (avoid hash collisions)
        if hashPattern == hashString:
            # Check characters one by one to avoid false positives
            if string[i:i+m] == pattern:
                idx.append(i)
        
        # Calculate hash for next window
        if i < n - m:
            hashString = (base * (hashString - ord(string[i]) * h) + ord(string[i + m])) % mod
            if hashString < 0:
                hashString += mod
    
    return idx

def prefix(p):
    """Compute prefix function for KMP algorithm"""
    m = len(p)
    Pi = [0] * m
    k = 0
    for q in range(1, m):
        while k > 0 and p[k] != p[q]:
            k = Pi[k - 1]
        if p[k] == p[q]:
            k += 1
        Pi[q] = k
    return Pi

def kmp_matcher(S, P):
    """KMP string matching algorithm"""
    n = len(S)
    m = len(P)
    if m == 0:
        return []
    if m > n:
        return []
    
    Pi = prefix(P)
    q = 0
    matches = []
    S = S.lower()
    P = P.lower()
    
    for i in range(n):
        while q > 0 and P[q] != S[i]:
            q = Pi[q - 1]
        if P[q] == S[i]:
            q += 1
        if q == m:
            matches.append(i - m + 1)
            q = Pi[q - 1]  # Continue searching for next match
    return matches

def build_dataset(folder_path, output_file='dataset.pkl'):
    """
    Build a dataset from documents in a folder
    Supports PDF and DOCX files
    """
    dataset = {}
    
    if not os.path.exists(folder_path):
        print(f"Error: Folder {folder_path} not found")
        return
    
    files = [f for f in os.listdir(folder_path) 
             if f.endswith(('.pdf', '.docx'))]
    
    print(f"Processing {len(files)} files...")
    
    for filename in tqdm(files):
        filepath = os.path.join(folder_path, filename)
        
        if filename.endswith('.pdf'):
            text = extract_pdf_text(filepath)
        elif filename.endswith('.docx'):
            text = get_docx_text(filepath)
        else:
            continue
        
        if text.strip():
            dataset[filename] = text
    
    # Save dataset
    with open(output_file, 'wb') as f:
        pickle.dump(dataset, f)
    
    print(f"✓ Dataset created: {len(dataset)} documents saved to {output_file}")
    return dataset

if __name__ == "__main__":
    # Example usage: python utils.py
    # This will create a dataset.pkl from documents in 'documents' folder
    import sys
    
    if len(sys.argv) > 1:
        folder = sys.argv[1]
    else:
        folder = 'documents'
    
    build_dataset(folder)