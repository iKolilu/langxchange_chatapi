#!/usr/bin/env python3
"""
RAG Test using LangXchange Toolkit
This script demonstrates a complete RAG pipeline using the langxchange helpers:
- documentloader: Chunk CSV files with best methods
- chroma_helper: Store embeddings in ChromaDB
- retrieverX: Retrieve relevant content
- prompt_helper: Generate intelligent responses
"""

import os
import sys
import pandas as pd
import json
from pathlib import Path

# Add langxchange to Python path
sys.path.append('langxchange')

# ─── 1) Configuration ────────────────────────────────────────────────────────
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")
os.environ["CHROMA_PERSIST_PATH"] = "__db/chromadb"
CHROMA_DIR = "__db/chromadb"
COLLECTION_NAME = "new_studentInfo_collection"

# Import langxchange helpers
# from documentloader import DocumentLoaderHelper
# from chroma_helper import EnhancedChromaHelper, ChromaConfig
# from retrieverX import EnhancedRetrieverX
# from prompt_helper import PromptBuilder
# from openai_helper import EnhancedOpenAIHelper

from langxchange.documentloader import DocumentLoaderHelper
from langxchange.embeddings import EmbeddingHelper
from langxchange.mysql_helper import MySQLHelper
from langxchange.openai_helper import EnhancedOpenAIHelper, OpenAIConfig
from langxchange.chroma_helper import EnhancedChromaHelper, ChromaConfig
from langxchange.retrieverX import  EnhancedRetrieverX
from langxchange.prompt_helper import EnhancedPromptHelper, PromptMode,PromptBuilder

class RAGTestPipeline:
    def __init__(self):
        """Initialize the RAG pipeline components"""
        print("🚀 Initializing RAG Pipeline...")
        
        # Initialize LLM helper first (required for Chroma)
        self.llm_helper = EnhancedOpenAIHelper()
        
        # Initialize components
        self.document_loader = DocumentLoaderHelper()
        
        # Create ChromaDB config with persistent storage
        chroma_config = ChromaConfig(persist_directory=CHROMA_DIR)
        self.chroma_helper = EnhancedChromaHelper(
            llm_helper=self.llm_helper,
            config=chroma_config
        )
        
        # Initialize retriever with re-ranking disabled for faster startup
        self.retriever = EnhancedRetrieverX(
            vector_db=self.chroma_helper,
            embedder=self.llm_helper,
            reranker_model="cross-encoder/ms-marco-MiniLM-L-6-v2",
            use_rerank=False
        )
        
        self.prompt_builder = PromptBuilder()
        
        print("✅ RAG Pipeline initialized successfully!")
    
    def load_and_chunk_csv(self, csv_file_path):
        """Load CSV and create chunks using documentloader"""
        print(f"📄 Loading CSV file: {csv_file_path}")
        
        # Load CSV data
        df = pd.read_csv(csv_file_path)
        print(f"📊 Loaded {len(df)} rows of student data")
        
        # Convert to documents using documentloader's best practices
        documents = self._csv_to_documents(df)
        
        # Use documentloader to chunk the documents using semantic chunking
        print("🔄 Chunking documents using documentloader...")
        chunked_docs = []
        chunked_docs = list(self.document_loader.load(csv_file_path))
        
        print(f"✅ Created {len(chunked_docs)} chunks using documentloader")
        return chunked_docs
    
    def _csv_to_documents(self, df):
        """Convert DataFrame rows to individual documents"""
        documents = []
        
        for idx, row in df.iterrows():
            # Create a meaningful document from the row data
            doc_content = f"""
            Student ID: {row.get('szstudentid', 'N/A')}
            Subject: {row.get('subjectname', 'N/A')}
            Class: {row.get('szclassid', 'N/A')}
            Term: {row.get('szterm', 'N/A')}
            Academic Year: {row.get('szacayear', 'N/A')}
            Total Score: {row.get('sztotalscore', 'N/A')}
            Exam Type: {row.get('sz_examtype', 'N/A')}
            """
            
            documents.append(doc_content.strip())
        
        return documents
    
    def store_in_chromadb(self, chunked_docs, collection_name):
        """Store chunks in ChromaDB using chroma_helper"""
        print(f"💾 Storing {len(chunked_docs)} chunks in ChromaDB...")
        
        # Extract content and metadata
        documents = [doc['content'] for doc in chunked_docs]
        metadatas = [doc['metadata'] for doc in chunked_docs]
        
        # Generate unique IDs for documents
        ids = [f"doc_{i}" for i in range(len(documents))]
        
        # Store in ChromaDB
        try:
            result = self.chroma_helper.insert_documents(
                collection_name=collection_name,
                documents=documents,
                metadatas=metadatas,
                ids=ids,
                generate_embeddings=False  # We already have the LLM helper
            )
            print(f"✅ Successfully stored documents in ChromaDB")
            return result
        except Exception as e:
            print(f"❌ Error storing documents in ChromaDB: {e}")
            raise
    
    def retrieve_content(self, query, collection_name, top_k=5):
        """Retrieve relevant content using retrieverX"""
        print(f"🔍 Retrieving content for query: '{query}'")
        
        try:
            results = self.retriever.retrieve(
                query=query,
                collection_name=collection_name,
                top_k=top_k
            )
            
            print(f"✅ Retrieved {len(results)} relevant documents")
            
            # Print retrieved content for verification
            for i, result in enumerate(results):
                print(f"\n--- Result {i+1} ---")
                print(f"Document: {result.get('document', 'N/A')}")
                print(f"Metadata: {result.get('metadata', 'N/A')}")
                print(f"Score: {result.get('score', 'N/A')}")
            
            return results
            
        except Exception as e:
            print(f"❌ Error retrieving content: {e}")
            raise
    
    def generate_response(self, query, retrieved_docs, prompt_type="basic"):
        """Generate response using prompt_helper"""
        print(f"🤖 Generating response using prompt_type: {prompt_type}")
        
        try:
            # Prepare context from retrieved documents
            context = "\n\n".join([
                f"Document {i+1}: {doc.get('document', '')}" 
                for i, doc in enumerate(retrieved_docs)
            ])
            
            # Create the full prompt
            full_prompt = f"""
            Based on the following student information from the database, please answer the user's question:
            
            Question: {query}
            
            Relevant student records:
            {context}
            
            Please provide a comprehensive answer based on the retrieved student data.
            """
            
            # Use prompt_builder to generate response
            response = self.prompt_builder.build_prompt(
                prompt_type=prompt_type,
                query=query,
                context=context,
                system_message="You are a helpful assistant analyzing student academic records."
            )
            
            # Get response from LLM
            llm_response = self.llm_helper.chat(prompt=response)
            
            print(f"✅ Generated response successfully")
            return llm_response
            
        except Exception as e:
            print(f"❌ Error generating response: {e}")
            raise
    
    def run_pipeline(self, csv_file_path, test_query):
        """Run the complete RAG pipeline"""
        print("\n" + "="*60)
        print("🔄 STARTING COMPLETE RAG PIPELINE")
        print("="*60)
        
        try:
            # Step 1: Load and chunk CSV
            chunked_docs = self.load_and_chunk_csv(csv_file_path)
            
            # Step 2: Store in ChromaDB
            result = self.store_in_chromadb(chunked_docs, COLLECTION_NAME)
            
            # Step 3: Retrieve content
            retrieved_docs = self.retrieve_content(test_query, COLLECTION_NAME)
            
            # Step 4: Generate response
            response = self.generate_response(test_query, retrieved_docs)
            
            # Print final results
            print("\n" + "="*60)
            print("📋 FINAL RESULTS")
            print("="*60)
            print(f"Query: {test_query}")
            print(f"Generated Response:\n{response}")
            
            return {
                'status': 'success',
                'query': test_query,
                'response': response,
                'retrieved_docs': retrieved_docs,
                'chunks_processed': len(chunked_docs)
            }
            
        except Exception as e:
            print(f"❌ Pipeline failed: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

def main():
    """Main function to demonstrate the RAG pipeline"""
    print("🎯 RAG Pipeline Test with LangXchange Toolkit")
    print("=" * 60)
    
    # File paths
    csv_file_path = Path("data/student_scores.csv")
    
    # Test query
    test_queries = [
        "What are the English scores for students in Class A?",
        "Show me biology performance across different terms",
        "Which students scored highest in their exams?"
    ]
    
    print(f"📁 Input CSV: {csv_file_path}")
    print(f"🔍 Test queries prepared: {len(test_queries)}")
    
    # Initialize the RAG pipeline
    rag_pipeline = RAGTestPipeline()
    
    # Test each query
    for i, query in enumerate(test_queries):
        print(f"\n🧪 TEST {i+1}: Testing query: '{query}'")
        print("-" * 50)
        
        result = rag_pipeline.run_pipeline(csv_file_path, query)
        
        if result['status'] == 'success':
            print(f"✅ Test {i+1} completed successfully!")
        else:
            print(f"❌ Test {i+1} failed: {result['error']}")
        
        print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    main()