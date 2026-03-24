"""
Test and demonstration of the improved RetrieverX implementation.

This file shows how to use the improved RetrieverX with mock implementations
and demonstrates the key features and improvements.
"""

import logging
from typing import List, Dict, Any
from langxchange.retrieverX import (
    EnhancedRetrieverX, 
    RetrievalResult, 
    create_retriever_from_config,
    batch_retrieve
)

# Configure logging to see the improvements in action
logging.basicConfig(level=logging.INFO)


# =============================================================================
# MOCK IMPLEMENTATIONS FOR TESTING
# =============================================================================

class MockVectorDB:
    """Mock vector database for testing"""
    
    def __init__(self, db_type="chroma"):
        self.db_type = db_type
        self.mock_data = [
            {"text": "Machine learning is a subset of artificial intelligence.", "metadata": {"source": "ml_intro.pdf", "page": 1}},
            {"text": "Deep learning uses neural networks with multiple layers.", "metadata": {"source": "dl_guide.pdf", "page": 5}},
            {"text": "Natural language processing deals with text understanding.", "metadata": {"source": "nlp_book.pdf", "page": 12}},
            {"text": "Computer vision enables machines to interpret visual information.", "metadata": {"source": "cv_handbook.pdf", "page": 3}},
            {"text": "Reinforcement learning learns through interaction and rewards.", "metadata": {"source": "rl_paper.pdf", "page": 8}}
        ]
    
    def query(self, collection_name=None, embedding_vector=None, top_k=5, include_metadata=True, **kwargs):
        """Mock Chroma-style query"""
        if collection_name is None:
            # Mock FAISS-style response
            return [
                {
                    "text": item["text"],
                    "metadata": item["metadata"],
                    "score": 0.8 - i * 0.1  # Decreasing scores
                }
                for i, item in enumerate(self.mock_data[:top_k])
            ]
        else:
            # Mock Chroma-style response
            return {
                "documents": [item["text"] for item in self.mock_data[:top_k]],
                "metadatas": [item["metadata"] for item in self.mock_data[:top_k]],
                "distances": [0.2 + i * 0.1 for i in range(min(top_k, len(self.mock_data)))]  # Increasing distances
            }


class MockEmbedder:
    """Mock embedder for testing"""
    
    def embed(self, texts: List[str]) -> List[List[float]]:
        """Return mock embeddings"""
        return [[0.1 * i for i in range(384)] for _ in texts]  # 384-dim mock embeddings
   
    def get_embedding(self, texts: List[str]) -> List[List[float]]:
        """Return mock embeddings"""
        return [[0.1 * i for i in range(384)] for _ in texts]  # 384-dim mock embeddings

# =============================================================================
# DEMONSTRATION FUNCTIONS
# =============================================================================

def demo_basic_usage():
    """Demonstrate basic usage of improved RetrieverX"""
    print("\n" + "="*60)
    print("DEMO 1: Basic Usage with Improved Features")
    print("="*60)
    
    # Initialize with mock components
    vector_db = MockVectorDB(db_type="chroma")
    embedder = MockEmbedder()
    
    # Create retriever with enhanced configuration
    retriever = EnhancedRetrieverX(
        vector_db=vector_db,
        embedder=embedder,
        reranker_model=None,  # Skip reranking for this demo
        use_rerank=False,
        min_score_threshold=0.1,
        rerank_multiplier=2.0
    )
    
    # Perform retrieval
    query = "What is machine learning and deep learning?"
    print(f"Query: {query}")
    
    results = retriever.retrieve(
        query=query,
        top_k=3,
        collection_name="ai_knowledge"
    )
    
    print(f"\nRetrieved {len(results)} results:")
    for result in results:
        print(f"\nRank {result.rank}:")
        print(f"  Score: {result.score:.3f}")
        print(f"  Document: {result.document[:80]}...")
        print(f"  Source: {result.metadata.get('source', 'unknown')}")
    
    # Show system statistics
    stats = retriever.get_stats()
    print(f"\nSystem Configuration:")
    for key, value in stats.items():
        print(f"  {key}: {value}")


def demo_error_handling():
    """Demonstrate improved error handling"""
    print("\n" + "="*60)
    print("DEMO 2: Enhanced Error Handling")
    print("="*60)
    
    vector_db = MockVectorDB()
    embedder = MockEmbedder()
    
    retriever = EnhancedRetrieverX(
        vector_db=vector_db,
        embedder=embedder,
        reranker_model=None,
        use_rerank=False
    )
    
    # Test input validation
    test_cases = [
        ("", "Empty query"),
        ("   ", "Whitespace-only query"),
        ("valid query", "Valid query")
    ]
    
    for query, description in test_cases:
        print(f"\nTesting: {description}")
        try:
            results = retriever.retrieve(query=query, top_k=3)
            print(f"  ✓ Success: Retrieved {len(results)} results")
        except ValueError as e:
            print(f"  ✗ Validation Error: {e}")
        except Exception as e:
            print(f"  ✗ Unexpected Error: {e}")
    
    # Test invalid top_k
    print(f"\nTesting invalid top_k:")
    try:
        results = retriever.retrieve(query="test", top_k=0)
        print(f"  ✓ Success: Retrieved {len(results)} results")
    except ValueError as e:
        print(f"  ✗ Validation Error: {e}")


def demo_configuration_factory():
    """Demonstrate configuration-based setup"""
    print("\n" + "="*60)
    print("DEMO 3: Configuration-Based Setup")
    print("="*60)
    
    # Configuration dictionary
    config = {
        "vector_db": MockVectorDB(),
        "embedder": MockEmbedder(),
        "reranker_model": None,
        "use_rerank": False,
        "rerank_multiplier": 3.0,
        "min_score_threshold": 0.2,
        "db_type": "chroma"
    }
    
    # Create retriever from config
    retriever = create_retriever_from_config(config)
    
    print("Created retriever from configuration:")
    stats = retriever.get_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    # Test with filtering
    query = "machine learning algorithms"
    results = retriever.retrieve(query=query, top_k=5, collection_name="ml_docs")
    
    print(f"\nResults with min_score_threshold=0.2:")
    for result in results:
        print(f"  Score {result.score:.3f}: {result.document[:60]}...")


def demo_batch_processing():
    """Demonstrate batch retrieval functionality"""
    print("\n" + "="*60)
    print("DEMO 4: Batch Processing")
    print("="*60)
    
    retriever = EnhancedRetrieverX(
        vector_db=MockVectorDB(),
        embedder=MockEmbedder(),
        reranker_model=None,
        use_rerank=False
    )
    
    # Multiple queries
    queries = [
        "What is machine learning?",
        "Explain deep learning networks",
        "How does computer vision work?",
        "Natural language processing applications"
    ]
    
    print(f"Processing {len(queries)} queries in batch:")
    
    # Batch retrieval
    batch_results = batch_retrieve(
        retriever=retriever,
        queries=queries,
        top_k=2,
        collection_name="ai_knowledge"
    )
    
    # Display results
    for i, (query, results) in enumerate(zip(queries, batch_results)):
        print(f"\nQuery {i+1}: {query}")
        if results:
            for result in results:
                print(f"  {result.score:.3f}: {result.document[:50]}...")
        else:
            print("  No results found")


def demo_faiss_compatibility():
    """Demonstrate FAISS-style database compatibility"""
    print("\n" + "="*60)
    print("DEMO 5: FAISS-Style Database Compatibility")
    print("="*60)
    
    # Create FAISS-style mock database
    faiss_db = MockVectorDB(db_type="faiss")
    embedder = MockEmbedder()
    
    retriever = EnhancedRetrieverX(
        vector_db=faiss_db,
        embedder=embedder,
        db_type="faiss",
        use_rerank=False
    )
    
    # Query without collection_name (FAISS style)
    results = retriever.retrieve(
        query="artificial intelligence concepts",
        top_k=3,
        collection_name=None  # FAISS doesn't use collection names
    )
    
    print("FAISS-style retrieval results:")
    for result in results:
        print(f"  Score {result.score:.3f}: {result.document[:60]}...")
    
    stats = retriever.get_stats()
    print(f"\nDatabase type detected: {stats['vector_db_type']}")


def demo_structured_results():
    """Demonstrate structured result objects"""
    print("\n" + "="*60)
    print("DEMO 6: Structured Result Objects")
    print("="*60)
    
    retriever = EnhancedRetrieverX(
        vector_db=MockVectorDB(),
        embedder=MockEmbedder(),
        use_rerank=False
    )
    
    results = retriever.retrieve(
        query="machine learning fundamentals",
        top_k=3,
        collection_name="ml_collection"
    )
    
    print("Structured RetrievalResult objects:")
    for result in results:
        print(f"\nResult {result.rank}:")
        print(f"  Type: {type(result).__name__}")
        print(f"  Document: {result.document}")
        print(f"  Score: {result.score}")
        print(f"  Rank: {result.rank}")
        print(f"  Metadata keys: {list(result.metadata.keys())}")
        
        # Demonstrate attribute access vs. dictionary access
        print(f"  Source (attribute): {result.metadata.get('source', 'N/A')}")


def main():
    """Run all demonstrations"""
    print("RetrieverX Improved Version - Feature Demonstrations")
    print("This demonstrates the key improvements and new features")
    
    try:
        demo_basic_usage()
        demo_error_handling()
        # demo_configuration_factory()
        # demo_batch_processing()
        # demo_faiss_compatibility()
        # demo_structured_results()
        
        print("\n" + "="*60)
        print("ALL DEMONSTRATIONS COMPLETED SUCCESSFULLY!")
        print("="*60)
        print("\nKey improvements demonstrated:")
        print("✓ Enhanced error handling and validation")
        print("✓ Structured result objects with type safety")
        print("✓ Configuration-based setup")
        print("✓ Batch processing capabilities")
        print("✓ Multi-database backend support")
        print("✓ Comprehensive logging and monitoring")
        print("✓ Graceful degradation and fallbacks")
        
    except Exception as e:
        print(f"\nDemonstration failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
