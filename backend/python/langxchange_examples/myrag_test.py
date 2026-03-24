
#Full RAG - OpenAI,mySQL,Chroma
import os
import time
from pathlib import Path
import pandas as pd
from dotenv import load_dotenv

from langxchange.documentloader import DocumentLoaderHelper, ChunkingStrategy, ImageProcessingStrategy
from langxchange.embeddings import EmbeddingHelper
from langxchange.mysql_helper import MySQLHelper
from langxchange.openai_helper import EnhancedOpenAIHelper, OpenAIConfig
from langxchange.chroma_helper import EnhancedChromaHelper, ChromaConfig
from langxchange.localllm import LocalLLM
from langxchange.retrieverX import  EnhancedRetrieverX, RetrievalResult, create_retriever_from_config, batch_retrieve
from langxchange.prompt_helper import EnhancedPromptHelper, PromptMode
from langxchange.localizellm import LocalizeLLM, LocalLLMConfig, create_local_llm



def main():
    load_dotenv()  # load .env if present
    
    # ─── 1) Configuration ────────────────────────────────────────────────────────
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")  # set your key

    os.environ["CHROMA_PERSIST_PATH"] = "__db/chromadb"
    CHROMA_DIR = "__db/chromadb"
    COLLECTION_NAME = "new_studentInfo_collection"


    
    # ─── 2) Initialize components ──────────────────────────────────────────
    load_dotenv()  # load .env if present

    # Create custom configuration
    open_ai_config = OpenAIConfig(
        chat_model="gpt-3.5-turbo", #provide the chat_model
        enable_caching=True,
        enable_cost_tracking=True,
        max_retries=3,
        log_level="INFO"
    )
    
    # Enhanced Chroma configuration for better performance
    chroma_config = ChromaConfig(
        persist_directory=CHROMA_DIR,
        batch_size=100,  # Increased batch size for better performance
        max_workers=8,   # Increased workers for parallel processing
        progress_bar=True,
        # enable_retry=True,
        # retry_attempts=3
    )

  
    
    # Document loader with optimized settings for CSV data
    loader = DocumentLoaderHelper(
        chunk_size=800,  # Larger chunks for structured data
        chunking_strategy=ChunkingStrategy.SEMANTIC,
        preserve_formatting=True,
        # overlap_ratio=0.1  # Small overlap for better context
    )
    
  
   
    llm = EnhancedOpenAIHelper(open_ai_config)
    chroma = EnhancedChromaHelper(llm,chroma_config)
    

    # Configuration dictionary
    retreiver_config = {
        "vector_db": chroma,
        "embedder": llm,
        "reranker_model": None,
        "use_rerank": False,
        "rerank_multiplier": 3.0,
        "db_type": "chroma"
    }

    prompt_response = EnhancedPromptHelper(
        llm=llm,
        system_prompt="You are a helpful assistant.",
        default_mode=PromptMode.AUGMENTED,
        max_context_length=1500,
        max_snippets=3
    )

    # Create data directory if it doesn't exist
    Path("data").mkdir(exist_ok=True)
    output_path = "data/student_scores.csv"
   
    # # Export to CSV
    n_rows_to_read = 100

    df = pd.read_csv(output_path, nrows=n_rows_to_read)
    print(f"💾 Data exported to {output_path} ({len(df)} records)")
    
    # Define the number of rows you want to use fot test
    # n_rows_to_read = 100

    # df = pd.read_csv(output_path, nrows=n_rows_to_read)
    # df.to_csv(work_dataset, index=False)
    print(f"💾 Working with {output_path} ({len(df)} records)")
    # ─── 4) Enhanced CSV processing and Chroma ingestion ──────────────────────────
    
    print("🔄 Processing CSV data for Chroma ingestion...")
    
    # Load and process the CSV file
    chunks = list(loader.load(output_path))
    print(f"📝 Generated {len(chunks)} chunks from CSV data")
    print(f"Processing time: {loader.stats['times']['total']:.3f}s")
    
    # Prepare enhanced metadata for better searchability
    enhanced_metadata = []
    documents = []
    for i, chunk in enumerate(chunks):
        metadata = {
            "source": Path(output_path).name,
            "chunk_id": i,
            "data_type": "student_scores",
            "school_id": "VISSCHOOL",
            "extraction_date": time.strftime("%Y-%m-%d %H:%M:%S"),
           
        }
        #  "total_records": len(df),
        #     "chunk_size": len(chunk.content)
        enhanced_metadata.append(metadata)
        documents.append(str(chunk.content))
    
    # # ─── 5) Batch processing and ingestion to Chroma ──────────────────────────────
    
    print("⚡ Starting enhanced batch ingestion to ChromaDB...")
    ingest_start = time.perf_counter()
    
    try:
  
    #     # Batch process for efficiency
        batch_size = chroma_config.batch_size
        total_chunks = len(documents)
        
        for i in range(0, total_chunks, batch_size):
            batch_end = min(i + batch_size, total_chunks)
            batch_chunks = documents[i:batch_end]
            batch_metadata = enhanced_metadata[i:batch_end]
            
            print(f"📤 Processing batch {i//batch_size + 1}/{(total_chunks + batch_size - 1)//batch_size}")
            
            # Generate embeddings for the batch
            # batch_embeddings = embedder.embed(batch_chunks)
            
            # Create unique IDs for each chunk
            batch_ids = [f"chunk_{j}" for j in range(i, batch_end)]
            
            print(f"{batch_chunks[:3]}\n\n")
            # Insert batch to Chroma
            chroma.insert_documents(
                collection_name=COLLECTION_NAME,
                documents=batch_chunks,
                metadatas=batch_metadata,
                generate_embeddings=True,
                # ids=batch_ids
            )
            
            print(f"✅ Batch {i//batch_size + 1} inserted successfully")
        
        # Get final collection stats
        collection_count = chroma.get_collection_count(COLLECTION_NAME)
        
        ingest_time = time.perf_counter() - ingest_start
        print(f"🎉 Ingestion completed successfully!")
        print(f"📊 Collection '{COLLECTION_NAME}' now contains {collection_count} documents")
        print(f"⏱️  Total ingestion time: {ingest_time:.2f} seconds")
        print(f"📈 Processing rate: {collection_count/ingest_time:.2f} documents/second")
        
    except Exception as e:
        print(f"❌ Error during ingestion: {str(e)}")
        raise
    
    # # ─── 6) Optional: Test the collection ──────────────────────────────────────
    
    print("\n🔍 Testing collection with sample query...")
    try:
        # Perform a test query
        test_query = "Select best student with highest scores"
        query_embedding = llm.get_embedding(test_query,None,1536)
        print(f" First Query Embedding {query_embedding}\n\n\n\n")
        results = chroma.query_collection(
            collection_name=COLLECTION_NAME,
            # query_embedding=query_embedding,
            query_text=test_query,
            top_k=5
        )
        
        print(f"✅ Test query successful! Found {len(results['documents'][0])} relevant results")
        print("📄 Sample result:")
        if results['documents'][0]:
            # print(f"   - {results['documents'][0][0][:200]}...") #generate the 1st  results with 200 characters
            # print(f"   - {results['documents'][0][0]}...") # generate first result
            print(f"   - {results['documents']}... \n\n\n\n") # generate first result
            
    except Exception as e:
        print(f"⚠️  Test query failed: {str(e)}") 


    # Create retriever from config
    retriever = create_retriever_from_config(retreiver_config)

#  # Create retriever with enhanced configuration
    
    results = retriever.retrieve(
        query=test_query,
        top_k=2,
        collection_name=COLLECTION_NAME
    )
    
    print(f"\nRetrieved {len(results)} results:")
    for result in results:
        print(f"\nRank {result.rank}:")
        print(f"  Score: {result.score:.3f}")
        print(f"  Document: {result.document}...")



 
    # # # Run with LLM
    response = prompt_response.run(
            user_query=query,
            retrieval_results=results,
            mode=PromptMode.AUGMENTED,
            temperature=0.5
        )
    print(f"LLM Response: {response}")

   


if __name__ == "__main__":
    main()
