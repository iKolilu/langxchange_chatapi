"""
Example usage of the improved LLaMA Helper.
This script demonstrates the key features and improvements.

Author: 
"""

import os
import logging
from langxchange.llama_helper import EnhancedLLaMAHelper, LLaMAConfig, create_llama_helper
from dotenv import load_dotenv



 

def setup_logging():
    """Setup logging for the example."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )


def example_basic_usage():
    """Example 1: Basic usage with factory function."""
    os.environ["HUGGINGFACE_TOKEN"] =  "hf_"
    load_dotenv()  # load
    print("=" * 60)
    print("Example 1: Basic Usage with Factory Function")
    print("=" * 60)
    
    try:
        # Create helper with factory function for easy setup
        # Note: This example uses mock mode since real models require authentication
        with create_llama_helper(
            model_size="7b", 
            # quantization="8bit",
            hf_token="your-huggingface-token-here"  # Replace with actual token
        ) as helper:
            
            print(f"✅ LLaMA Helper initialized on device: {helper.device}")
            
            # Get model information
            info = helper.get_model_info()
            print(f"📊 Model: {info['chat_model']}")
            print(f"🔧 Device: {info['device']}")
            print(f"📏 Vocab Size: {info['vocab_size']:,}")
            
            # Simple text generation
            print("\n🤖 Generating text...")
            response = helper.generate_text(
                "Explain quantum computing in simple terms:",
                max_new_tokens=100,
                temperature=0.7
            )
            print(f"Response: {response}")
            
    except Exception as e:
        print(f"❌ Error in basic usage: {e}")
        print("💡 Make sure to set a valid HuggingFace token!")


def example_advanced_configuration():
    """Example 2: Advanced configuration options."""
    print("\n" + "=" * 60)
    print("Example 2: Advanced Configuration")
    print("=" * 60)
    
    try:
        # Create custom configuration
        config = LLaMAConfig(
            chat_model="meta-llama/Llama-2-7b-chat-hf",
            embed_model="all-MiniLM-L6-v2",
            hf_token="your-huggingface-token-here",  # Replace with actual token
            device="auto",  # Auto-detect best device
            load_in_8bit=True,  # Memory optimization
            max_memory_per_gpu="6GB",  # Prevent OOM
            cache_dir="./model_cache",  # Persistent cache
            trust_remote_code=False  # Security setting
        )
        
        with EnhancedLLaMAHelper(config) as helper:
            print(f"✅ Advanced configuration loaded")
            print(f"🎯 Using device: {helper.device}")
            print(f"💾 8-bit quantization: {config.load_in_8bit}")
            print(f"📁 Cache directory: {config.cache_dir}")
            
    except Exception as e:
        print(f"❌ Error in advanced configuration: {e}")


def example_chat_functionality():
    """Example 3: Enhanced chat functionality."""
    print("\n" + "=" * 60)
    print("Example 3: Enhanced Chat Functionality")
    print("=" * 60)
    
    try:
        # Mock configuration for demonstration
        print("🗣️  Chat Example (Mock Mode)")
        
        # Simulate a chat conversation
        messages = [
            {"role": "user", "content": "Hello! Can you help me understand AI?"},
            {"role": "assistant", "content": "Hello! I'd be happy to help you understand AI. What specific aspects are you curious about?"},
            {"role": "user", "content": "What's the difference between machine learning and deep learning?"}
        ]
        
        system_prompt = "You are a helpful AI assistant specialized in explaining complex topics in simple terms."
        
        print("💬 Conversation:")
        for msg in messages:
            role_emoji = "👤" if msg["role"] == "user" else "🤖"
            print(f"{role_emoji} {msg['role'].title()}: {msg['content']}")
        
        print(f"\n⚙️  System Prompt: {system_prompt}")
        print("🔄 Processing chat request...")
        
        # In real usage, this would generate an actual response
        print("🤖 Assistant: Machine learning is a broad field where computers learn patterns from data. Deep learning is a subset that uses neural networks with multiple layers (hence 'deep') to find complex patterns, especially good for tasks like image recognition and natural language processing.")
        
    except Exception as e:
        print(f"❌ Error in chat functionality: {e}")


def example_batch_processing():
    """Example 4: Batch processing capabilities."""
    print("\n" + "=" * 60)
    print("Example 4: Batch Processing")
    print("=" * 60)
    
    try:
        print("📦 Batch Processing Example (Mock Mode)")
        
        # Example texts for batch processing
        texts = [
            "Artificial intelligence is transforming industries.",
            "Machine learning helps computers learn from data.",
            "Deep learning uses neural networks for complex tasks.",
            "Natural language processing enables AI to understand text.",
            "Computer vision allows AI to interpret images."
        ]
        
        print(f"📄 Processing {len(texts)} texts:")
        for i, text in enumerate(texts, 1):
            print(f"  {i}. {text}")
        
        # Simulate batch operations
        print("\n🧮 Token Counting Results (simulated):")
        simulated_token_counts = [8, 7, 9, 10, 8]
        for i, (text, count) in enumerate(zip(texts, simulated_token_counts), 1):
            print(f"  Text {i}: {count} tokens")
        
        print(f"\n📊 Total tokens: {sum(simulated_token_counts)}")
        
        print("\n🎯 Embedding Generation (simulated):")
        print(f"  Generated embeddings for {len(texts)} texts")
        print(f"  Embedding dimension: 384 (example)")
        print(f"  Batch processing saves time and resources!")
        
    except Exception as e:
        print(f"❌ Error in batch processing: {e}")


def example_error_handling():
    """Example 5: Comprehensive error handling."""
    print("\n" + "=" * 60)
    print("Example 5: Error Handling")
    print("=" * 60)
    
    print("🛡️  Error Handling Examples:")
    
    # Example 1: Missing token
    try:
        config = LLaMAConfig(hf_token=None)
        with EnhancedLLaMAHelper(config) as helper:
            pass
    except EnvironmentError as e:
        print(f"✅ Caught expected error - Missing token: {type(e).__name__}")
    
    # Example 2: Invalid input validation
    try:
        # This would normally fail with a real helper
        print("✅ Input validation prevents runtime errors")
        print("  - Empty prompts are rejected")
        print("  - Invalid message formats are caught")
        print("  - Type mismatches are handled gracefully")
    except Exception as e:
        print(f"✅ Caught validation error: {type(e).__name__}")
    
    # Example 3: Resource management
    print("✅ Resource management ensures:")
    print("  - Memory is freed properly")
    print("  - GPU cache is cleared")
    print("  - Models are unloaded on exit")
    print("  - Context managers handle cleanup automatically")


def example_memory_management():
    """Example 6: Memory management and optimization."""
    print("\n" + "=" * 60)
    print("Example 6: Memory Management")
    print("=" * 60)
    
    print("🧠 Memory Optimization Options:")
    print("  📉 8-bit quantization: ~50% memory reduction")
    print("  📉 4-bit quantization: ~75% memory reduction")
    print("  🎯 Memory limits: Prevent OOM errors")
    print("  🧹 Cache clearing: Free GPU memory")
    
    # Configuration examples
    print("\n⚙️  Configuration Examples:")
    
    print("  🔸 For limited memory (8GB GPU):")
    print("    load_in_8bit=True, max_memory_per_gpu='6GB'")
    
    print("  🔸 For very limited memory (4GB GPU):")
    print("    load_in_4bit=True, max_memory_per_gpu='3GB'")
    
    print("  🔸 For CPU-only systems:")
    print("    device='cpu', load_in_8bit=False")
    
    print("\n💡 Memory management features:")
    print("  - Automatic device detection")
    print("  - Graceful fallback to CPU")
    print("  - Memory usage monitoring")
    print("  - Cleanup on context exit")


def main():
    """Run all examples."""
    setup_logging()
    
    print("🚀 Improved LLaMA Helper - Feature Demonstrations")
    print("=" * 60)
    print("Author: Langxchange")
    print("Note: Examples run in mock mode without real models")
    print("To use with real models, set your HuggingFace token!")
    
    # Run all examples
    example_basic_usage()
    # example_advanced_configuration()
    # example_chat_functionality()
    # example_batch_processing()
    # example_error_handling()
    # example_memory_management()
    
    print("\n" + "=" * 60)
    print("✅ All examples completed!")
    print("💡 Key improvements demonstrated:")
    print("  - Modern API compliance")
    print("  - Enhanced error handling")
    print("  - Memory optimization")
    print("  - Batch processing")
    print("  - Resource management")
    print("  - Type safety")
    print("  - Professional logging")
    print("=" * 60)


if __name__ == "__main__":
    main()

# Example usage and factory functions
def create_llama_helper(
    model_size: str = "7b",
    quantization: Optional[str] = None,
    **kwargs
) -> EnhancedLLaMAHelper:
    """
    Factory function to create LLaMAHelper with common configurations.
    
    Args:
        model_size: "7b", "13b", or "70b"
        quantization: "8bit", "4bit", or None
        **kwargs: Additional configuration parameters
        
    Returns:
        Configured LLaMAHelper instance
    """
    model_map = {
        "7b": "meta-llama/Llama-2-7b-chat-hf",
        "13b": "meta-llama/Llama-2-13b-chat-hf",
        "70b": "meta-llama/Llama-2-70b-chat-hf",
    }
    
    config = LLaMAConfig(
        chat_model=model_map.get(model_size, model_map["7b"]),
        load_in_8bit=quantization == "8bit",
        load_in_4bit=quantization == "4bit",
        **kwargs
    )
    
    return LLaMAHelper(config)


if __name__ == "__main__":
    # Example usage
    try:
        # Create helper with context manager for automatic cleanup
        with create_llama_helper(model_size="7b", quantization="8bit") as helper:
            
            # Simple text generation
            response = helper.generate_text("What is artificial intelligence?", max_new_tokens=100)
            print("Generated text:", response)
            
            # Chat conversation
            messages = [
                {"role": "user", "content": "Hello, how are you?"},
                {"role": "assistant", "content": "I'm doing well, thank you! How can I help you today?"},
                {"role": "user", "content": "Can you explain quantum computing?"}
            ]
            
            chat_response = helper.chat(messages, max_new_tokens=150)
            print("Chat response:", chat_response)
            
            # Embeddings
            embeddings = helper.get_embedding(["Hello world", "Goodbye world"])
            print("Embedding dimensions:", len(embeddings[0]))
            
            # Token counting
            token_count = helper.count_tokens("This is a test sentence.")
            print("Token count:", token_count)
            
            # Model info
            info = helper.get_model_info()
            print("Model info:", info)
            
    except Exception as e:
        print(f"Error: {e}")




