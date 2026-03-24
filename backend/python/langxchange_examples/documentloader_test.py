"""
Demo script showing the enhanced DocumentLoaderHelper capabilities
optimized for LLM processing.
"""

import os
import sys
from langxchange.documentloader import DocumentLoaderHelper, ChunkingStrategy, ImageProcessingStrategy

def create_sample_documents():
    """Create sample documents for testing."""
    os.makedirs("sample_docs", exist_ok=True)
    
    # Create a sample text file
    with open("sample_docs/sample.txt", "w", encoding="utf-8") as f:
        f.write("""
# Introduction to Machine Learning

Machine learning is a subset of artificial intelligence that focuses on developing algorithms and statistical models. These systems can automatically improve their performance on a specific task through experience.

## Supervised Learning

Supervised learning is a type of machine learning where the algorithm learns from labeled training data. The goal is to make accurate predictions on new, unseen data. Common examples include:

- Classification: Predicting categories (e.g., spam detection)
- Regression: Predicting continuous values (e.g., house prices)

### Key Algorithms

1. Linear Regression: Used for predicting continuous outcomes
2. Decision Trees: Easy to interpret and visualize
3. Random Forest: Ensemble method that improves accuracy
4. Support Vector Machines: Effective for high-dimensional data

## Unsupervised Learning

Unsupervised learning deals with finding hidden patterns in data without labeled examples. The algorithm must discover structure on its own.

Common techniques include:
- Clustering (K-means, hierarchical clustering)
- Dimensionality reduction (PCA, t-SNE)
- Association rules (market basket analysis)

## Deep Learning

Deep learning uses neural networks with multiple layers to model and understand complex patterns. It has revolutionized fields like computer vision and natural language processing.

### Applications

Deep learning has been successfully applied to:
- Image recognition and computer vision
- Natural language processing and translation
- Speech recognition and synthesis
- Autonomous vehicles
- Medical diagnosis and drug discovery

## Conclusion

Machine learning continues to evolve rapidly, with new techniques and applications emerging regularly. Understanding the fundamentals of supervised, unsupervised, and deep learning provides a solid foundation for exploring this exciting field.
        """)
    
    # Create a sample CSV file
    with open("sample_docs/sample.csv", "w", encoding="utf-8") as f:
        f.write("""Name,Age,Department,Salary,Years_Experience
John Smith,28,Engineering,75000,3
Sarah Johnson,32,Marketing,68000,5
Mike Brown,25,Engineering,72000,2
Lisa Davis,29,Sales,65000,4
Tom Wilson,35,Engineering,85000,8
Anna Garcia,26,Marketing,63000,3
David Lee,31,Sales,70000,6
Emma Taylor,27,Engineering,78000,4
""")

def demo_chunking_strategies():
    """Demonstrate different chunking strategies."""
    print("=" * 60)
    print("DOCUMENTLOADER HELPER - ENHANCED CHUNKING DEMO")
    print("=" * 60)
    
    # Test different strategies
    strategies = [
        (ChunkingStrategy.CHARACTER, "Character-based chunking"),
        (ChunkingStrategy.SENTENCE, "Sentence-aware chunking"),
        (ChunkingStrategy.PARAGRAPH, "Paragraph-aware chunking"),
        (ChunkingStrategy.SEMANTIC, "Semantic chunking (recommended)"),
    ]
    
    # Add token-based if available
    try:
        import tiktoken
        strategies.append((ChunkingStrategy.TOKEN, "Token-based chunking"))
    except ImportError:
        print("Note: tiktoken not available, skipping token-based chunking")
    
    file_path = "data/student_scores.csv"
    
    for strategy, description in strategies:
        print(f"\n{'-' * 40}")
        print(f"STRATEGY: {description}")
        print(f"{'-' * 40}")
        
        # Initialize loader with strategy
        loader = DocumentLoaderHelper(
            chunk_size=800,  # Smaller chunks for demo
            overlap_size=100,
            chunking_strategy=strategy,
            preserve_formatting=True
        )
        
        try:
            chunks = list(loader.load(file_path))
            
            print(f"Total chunks created: {len(chunks)}")
            print(f"Processing time: {loader.stats['times']['total']:.3f}s")
            
            # Show first few chunks
            for i, chunk in enumerate(chunks[:4]):
                print(f"\nChunk {i+1}:")
                print(f"  Length: {len(chunk.content)} chars")
                if chunk.metadata.token_count:
                    print(f"  Tokens: {chunk.metadata.token_count}")
                print(f"  Content preview: {chunk.content}...")
                
            if len(chunks) > 3:
                print(f"\n... and {len(chunks) - 3} more chunks")
                
        except Exception as e:
            print(f"Error with {strategy}: {e}")

def demo_file_types():
    """Demonstrate processing different file types."""
    print("\n" + "=" * 60)
    print("MULTI-FORMAT DOCUMENT PROCESSING")
    print("=" * 60)
    
    loader = DocumentLoaderHelper(
        chunk_size=800,
        chunking_strategy=ChunkingStrategy.SEMANTIC,
        preserve_formatting=True
    )
    
    files_to_process = [
        "sample_docs/sample.txt",
        "sample_docs/sample.csv"
    ]
    
    for file_path in files_to_process:
        if os.path.exists(file_path):
            print(f"\n{'-' * 30}")
            print(f"Processing: {file_path}")
            print(f"{'-' * 30}")
            
            try:
                chunks = list(loader.load(file_path))
                
                print(f"File type: {chunks[0].metadata.file_type}")
                print(f"Total chunks: {len(chunks)}")
                
                # Show metadata for first chunk
                first_chunk = chunks[0]
                print(f"First chunk metadata:")
                print(f"  Source: {first_chunk.metadata.source_file}")
                print(f"  Section: {first_chunk.metadata.section_title}")
                print(f"  Content length: {len(first_chunk.content)} chars")
                
                # Show content preview
                print(f"Content preview:")
                preview = first_chunk.content[:200].replace('\n', ' ')
                print(f"  {preview}...")
                
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

def demo_advanced_features():
    """Demonstrate advanced features."""
    print("\n" + "=" * 60)
    print("ADVANCED FEATURES DEMO")
    print("=" * 60)
    
    # Test with different configurations
    configs = [
        {
            "name": "Minimal overlap",
            "params": {"chunk_size": 400, "overlap_size": 20, "min_chunk_size": 30}
        },
        {
            "name": "High overlap",
            "params": {"chunk_size": 400, "overlap_size": 100, "min_chunk_size": 50}
        },
        {
            "name": "Preserve formatting",
            "params": {"chunk_size": 400, "preserve_formatting": True}
        },
        {
            "name": "Normalize text",
            "params": {"chunk_size": 400, "preserve_formatting": False}
        }
    ]
    
    file_path = "sample_docs/sample.txt"
    
    for config in configs:
        print(f"\n{'-' * 25}")
        print(f"CONFIG: {config['name']}")
        print(f"{'-' * 25}")
        
        loader = DocumentLoaderHelper(
            chunking_strategy=ChunkingStrategy.SEMANTIC,
            **config['params']
        )
        
        try:
            chunks = list(loader.load(file_path))
            stats = loader.get_statistics()
            
            print(f"Chunks created: {len(chunks)}")
            print(f"Avg chunk size: {sum(len(c.content) for c in chunks) / len(chunks):.0f} chars")
            print(f"Processing time: {stats['processing_stats']['times']['total']:.3f}s")
            
            # Check overlap
            if len(chunks) > 1:
                overlap_sample = ""
                chunk1_end = chunks[0].content[-50:]
                chunk2_start = chunks[1].content[:50]
                # Simple overlap detection
                for i in range(10, 40):
                    if chunk1_end[-i:] in chunk2_start:
                        overlap_sample = chunk1_end[-i:]
                        break
                
                if overlap_sample:
                    print(f"Detected overlap: '{overlap_sample[:30]}...'")
                else:
                    print("No overlap detected")
                    
        except Exception as e:
            print(f"Error: {e}")

def demo_image_support():
    """Demonstrate image processing support."""
    print("\n" + "=" * 60)
    print("IMAGE PROCESSING SUPPORT")
    print("=" * 60)
    
    # Check image processing availability
    try:
        from PIL import Image
        pil_available = True
        print("✅ PIL (Pillow) support: Available")
    except ImportError:
        pil_available = False
        print("❌ PIL (Pillow) support: Not available")
    
    try:
        import pytesseract
        tesseract_available = True
        print("✅ OCR (pytesseract) support: Available")
    except ImportError:
        tesseract_available = False
        print("❌ OCR (pytesseract) support: Not available")
    
    # Show image processing strategies
    print(f"\n📸 Available image processing strategies:")
    strategies = [
        (ImageProcessingStrategy.OCR_TEXT, "Extract text using OCR"),
        (ImageProcessingStrategy.DESCRIPTION, "Generate image descriptions"),
        (ImageProcessingStrategy.METADATA, "Extract technical metadata"),
        (ImageProcessingStrategy.COMBINED, "All-in-one processing"),
        (ImageProcessingStrategy.VISUAL_ANALYSIS, "Advanced visual analysis")
    ]
    
    for strategy, description in strategies:
        print(f"  • {strategy.value}: {description}")
    
    # Show supported formats
    loader = DocumentLoaderHelper()
    supported_formats = loader._get_supported_image_formats()
    print(f"\n🖼️  Supported image formats ({len(supported_formats)}):")
    print(f"  {', '.join(supported_formats)}")
    
    # Demonstrate configuration
    print(f"\n⚙️  Image processing configuration example:")
    image_loader = DocumentLoaderHelper(
        chunk_size=1000,
        image_processing_strategy=ImageProcessingStrategy.COMBINED,
        ocr_language="eng",
        max_image_size=(2048, 2048),
        image_quality_threshold=0.6
    )
    
    print(f"  • Processing strategy: {image_loader.image_processing_strategy.value}")
    print(f"  • OCR language: {image_loader.ocr_language}")
    print(f"  • Max image size: {image_loader.max_image_size}")
    print(f"  • Quality threshold: {image_loader.image_quality_threshold}")
    
    if not (pil_available and tesseract_available):
        print(f"\n📋 To enable full image processing:")
        print(f"  pip install Pillow pytesseract")
        print(f"  # System dependencies:")
        print(f"  sudo apt-get install tesseract-ocr  # Ubuntu/Debian")
        print(f"  brew install tesseract  # macOS")

def main():
    """Run the complete demo."""
    # Create sample documents
    create_sample_documents()
    
    # Run demos
    demo_chunking_strategies()
    demo_file_types()
    demo_advanced_features()
    demo_image_support()
    
    print("\n" + "=" * 60)
    print("DEMO COMPLETED")
    print("=" * 60)
    print("\nKey improvements in this enhanced version:")
    print("• Multiple chunking strategies optimized for LLMs")
    print("• Intelligent overlap to preserve context")
    print("• Metadata tracking for better document understanding")
    print("• Token counting support (with tiktoken)")
    print("• Semantic chunking that respects document structure")
    print("• Better handling of different file formats")
    print("• Configurable text cleaning and formatting")
    print("• Parallel processing for better performance")
    print("• Comprehensive error handling and statistics")
    print("• 🆕 Comprehensive image processing (15+ formats)")
    print("• 🆕 OCR text extraction with confidence scoring")
    print("• 🆕 Automatic image description generation")
    print("• 🆕 Technical metadata extraction (EXIF, etc.)")
    print("• 🆕 Multi-language OCR support")
    print("• 🆕 Configurable image quality thresholds")

if __name__ == "__main__":
    main()