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
    """Brute force string matching algorithm"""
    n = len(string)
    m = len(pattern)
    if m > n:
        return []
    string = string.lower()
    pattern = pattern.lower()
    idx = []
    for i in range(n - m + 1):
        if string[i] == pattern[0]:
            found = True
            for j in range(m):
                if pattern[j] != string[i + j]:
                    found = False
                    break
            if found:
                idx.append(i)
    return idx

def rabinKarp(string, pattern):
    """Rabin-Karp string matching algorithm"""
    n = len(string)
    m = len(pattern)
    base = 128
    mod = 509
    if m > n:
        return []
    string = string.lower()
    pattern = pattern.lower()
    h = pow(base, m-1, mod)
    hashString = 0
    hashPattern = 0
    for i in range(m):
        hashPattern = (base * hashPattern + ord(pattern[i])) % mod
        hashString = (base * hashString + ord(string[i])) % mod
    idx = []
    for i in range(n - m + 1):
        if hashPattern == hashString and string[i:i+m] == pattern:
            idx.append(i)
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
    Pi = prefix(P)
    q = 0
    matches = []
    for i in range(n):
        while q > 0 and P[q] != S[i]:
            q = Pi[q - 1]
        if P[q] == S[i]:
            q += 1
        if q == m:
            matches.append(i - m + 1)
            q = Pi[q - 1]
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