from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

import os
import time
import traceback
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
from langchain.document_loaders import PyPDFLoader, TextLoader, CSVLoader, UnstructuredExcelLoader
from langchain.schema import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from docx import Document as DocxDocument

# --------------------------- Flask App Setup ---------------------------
app = Flask(__name__)
CORS(app)
limiter = Limiter(get_remote_address, app=app, default_limits=["100 per hour", "10 per minute"])

# Load environment variables
load_dotenv()

groq_api_key = os.getenv('GROQ_API_KEY')
google_api_key = os.getenv("GOOGLE_API_KEY")
if not groq_api_key or not google_api_key:
    raise ValueError("Missing required API keys in .env file")

app.config["GOOGLE_API_KEY"] = google_api_key

# Initialize LLM
llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")

# Global storage for processed files and embeddings
processed_files = {}
vectors = None
executor = ThreadPoolExecutor(max_workers=2)

# Upload settings
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "docx", "txt", "csv", "xlsx"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10MB limit

# # --------------------------- Prompts ---------------------------
# LEGAL_EXTRACTION_PROMPT = """You are an expert legal document analyzer... (same as before) """
# extraction_prompt = ChatPromptTemplate.from_template(f"{LEGAL_EXTRACTION_PROMPT}\n\n📜 **Document Context**:\n<context>\n{{context}}\n</context>\n")

# qa_prompt = ChatPromptTemplate.from_template(
#         f"""
# You are a legal document assistant. Provide precise and contextual answers.

#  **Document Context**:
# <context>
# {{context}}
# </context>

# 🔍 **User Question**: {{input}}

# Provide a clear, concise answer based strictly on the document context.
# """
# )

# summary_prompt = ChatPromptTemplate.from_template(
# """
# Please provide a comprehensive summary of the following document context.
# Focus on the key points and main ideas.
# <context>
# {context}
# </context>
# """
# )
# --------------------------- ENHANCED SYSTEM PROMPT ---------------------------
LEGAL_EXTRACTION_PROMPT = """You are an expert legal document analyst. Your task is to extract and categorize key details from the given legal document, ensuring accuracy and completeness. 
Even if the exact term is not mentioned, identify similar phrases or concepts that convey the same meaning. If no relevant information is found, explicitly state "N/A".

### 🔍 Extraction Guidelines:

#### 1️⃣ Entities & Contact Details
   - Identify all parties involved (individuals, companies, organizations).
   - Extract full legal names.
   - Capture addresses, emails, and phone numbers.

#### 2️⃣ Contract Start Date & End Date
   - Locate the contract’s effective date (start date).
   - Identify the expiration or termination date.
   - Note any key milestone dates (e.g., renewal deadlines, review periods).

#### 3️⃣ Scope of Agreement
   - Clearly define the document’s purpose.
   - Highlight key obligations, deliverables, and services mentioned.
   - Extract any relevant exclusions or limitations.

#### 4️⃣ Service Level Agreement (SLA)
   - Extract performance metrics, response times, and service standards.
   - Identify any penalties for SLA breaches.

#### 5️⃣ Penalty Clauses
   - Identify conditions that trigger penalties.
   - Extract monetary/legal consequences for non-compliance.
   - Define what constitutes a breach or violation.

#### 6️⃣ Confidentiality Clause
   - Identify confidentiality obligations and restrictions.
   - Extract the duration and scope of confidentiality terms.

#### 7️⃣ Renewal & Termination Clause
   - Extract conditions for renewal (auto-renewal, renegotiation terms).
   - Identify termination clauses (grounds for termination).
   - Note any required notice periods.

#### 8️⃣ Commercials / Payment Terms
   - Extract payment terms, pricing structures, and invoicing details.
   - Identify due dates, penalties for late payments, and refund policies.

#### 9️⃣ Risks & Assumptions
   - Identify potential risks associated with the agreement.
   - Extract any stated mitigation strategies or underlying assumptions.

If any section is missing, explicitly return "N/A".

---

### 📜 Document Context:
<context>
{context}
</context>

### 🔍 Extraction Task:
Extract and categorize all legal information following the above structure. If specific terms are not found, look for synonyms or related phrases. If no relevant information exists, return "N/A".
"""

# Prompts for different extraction tasks
extraction_prompt = ChatPromptTemplate.from_template(
    f"""
{LEGAL_EXTRACTION_PROMPT}

📜 *Document Context*:
<context>
{{context}}
</context>

🔍 *Extraction Task*: Extract and categorize all available legal information from the document.
"""
)

qa_prompt = ChatPromptTemplate.from_template(
    f"""
You are a legal document assistant. Provide precise and contextual answers.

📜 *Document Context*:
<context>
{{context}}
</context>

🔍 *User Question*: {{input}}

Provide a clear, concise answer based strictly on the document context.
"""
)

# --------------------------- File Processing ---------------------------
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_uploaded_file(file):
    try:
        file_name = file.filename
        file_extension = file_name.rsplit('.', 1)[-1].lower()
        tmp_path = os.path.join(UPLOAD_FOLDER, file_name)
        file.save(tmp_path)

        loader_map = {
            'pdf': PyPDFLoader,
            'txt': TextLoader,
            'csv': CSVLoader,
            'xlsx': UnstructuredExcelLoader
        }
        
        if file_extension in loader_map:
            documents = loader_map[file_extension](tmp_path).load()
        elif file_extension == 'docx':
            doc = DocxDocument(tmp_path)
            documents = [Document(page_content=para.text) for para in doc.paragraphs if para.text.strip()]
        else:
            return []

        return documents
    except Exception as e:
        print(f"❌ Error processing {file_name}: {e}\n{traceback.format_exc()}")
        return []

def vector_embedding(documents):
    global vectors
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    final_documents = text_splitter.split_documents(documents)
    vectors = FAISS.from_documents(final_documents, embeddings)

# --------------------------- Flask Routes ---------------------------
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    global processed_files
    files = request.files.getlist('files')
    all_documents = []
    extracted_text = ""

    for file in files:
        file.seek(0)
        file_hash = hash(file.read())
        file.seek(0)  # Reset file pointer
        
        if file_hash not in processed_files:
            docs = process_uploaded_file(file)
            all_documents.extend(docs)
            processed_files[file.filename] = docs

    if all_documents:
        executor.submit(vector_embedding, all_documents)
        extracted_text = "\n\n".join([doc.page_content[:1000] for doc in all_documents])

    return jsonify({
        "message": "Files processed successfully ✅",
        "processed_files": list(processed_files.keys()),
        "extracted_text": extracted_text
    })

@app.route('/extract', methods=['POST'])
def extract_details():
    if not vectors:
        return jsonify({"error": "No documents uploaded"}), 400

    document_chain = create_stuff_documents_chain(llm, extraction_prompt)
    retriever = vectors.as_retriever()
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    start = time.process_time()
    response = retrieval_chain.invoke({'input': 'Extract all key legal information from the document'})
    elapsed = time.process_time() - start

    return jsonify({"answer": response['answer'], "time_taken": f"{elapsed:.2f} seconds"})

@app.route('/ask', methods=['POST'])
def ask_question():
    if not vectors:
        return jsonify({"error": "No documents uploaded"}), 400

    data = request.json
    user_question = data.get("query")

    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    document_chain = create_stuff_documents_chain(llm, qa_prompt)
    retriever = vectors.as_retriever()
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    start = time.process_time()
    
    # ✅ Pass the correct key as 'input' (retriever expects 'input')
    response = retrieval_chain.invoke({"input": user_question})

    elapsed = time.process_time() - start

    return jsonify({"answer": response['answer'], "time_taken": f"{elapsed:.2f} seconds"})


@app.route('/summary', methods=['POST'])
def ask_summary():
    if not vectors:
        return jsonify({"error": "No documents uploaded"}), 400

    data = request.json
    user_question = "Give summary for the provided document "

    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    document_chain = create_stuff_documents_chain(llm, qa_prompt)
    retriever = vectors.as_retriever()
    retrieval_chain = create_retrieval_chain(retriever, document_chain)

    start = time.process_time()
    
    # ✅ Pass the correct key as 'input' (retriever expects 'input')
    response = retrieval_chain.invoke({"input": user_question})

    elapsed = time.process_time() - start
    
    return jsonify({"answer": response['answer'], "time_taken": f"{elapsed:.2f} seconds"})

if __name__ == '__main__':
    app.run(debug=False)