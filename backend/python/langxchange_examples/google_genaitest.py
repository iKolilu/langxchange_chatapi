"""
Comprehensive usage examples for the enhanced EnhancedGoogleGenAIHelper class.
"""

import logging
import os
import tempfile
import wave
import shutil
from dotenv import load_dotenv
from langxchange.google_genai_helper import EnhancedGoogleGenAIHelper, GoogleGenAIError


def setup_logging():
    """Set up logging for examples."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )


def example_basic_initialization():
    """Demonstrate basic initialization with enhanced features."""
    print("\n=== Enhanced Initialization Examples ===")
    
    try:
        # Initialize with all enhanced features enabled
        helper = EnhancedGoogleGenAIHelper(
            enable_usage_tracking=True,
            enable_context_caching=True,
            logger=logging.getLogger("enhanced_genai")
        )
        
        print(f"Enhanced Helper: {helper}")
        print(f"Client Info: {helper.get_client_info()}")
        
        return helper
        
    except GoogleGenAIError as e:
        print(f"Error initializing enhanced helper: {e}")
        return None


def example_chat_with_vision(helper: EnhancedGoogleGenAIHelper):
    """Demonstrate multi-modal chat with vision capabilities."""
    print("\n=== Chat with Vision Examples ===")
    
    if not helper:
        print("Helper not available, skipping vision examples")
        return
    
    # Example 1: Analyze an image (would work with real API key and image)
    try:
        # Create a fake image file for demonstration
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
            # Write some fake image data
            tmp_file.write(b'\xff\xd8\xff\xe0\x00\x10JFIF')  # Fake JPEG header
            tmp_file_path = tmp_file.name
            print(f"Temporary file saved at: {tmp_file_path}")
        
        try:
            print("Analyzing image with vision chat...")
            # This would work with a real image and API key
            # response = helper.chat_with_vision(
            #     "What objects can you see in this image?",
            #     [tmp_file_path],
            #     temperature=0.3
            # )
            # print(f"Vision analysis: {response}")
            print("Demo: Would analyze image and describe objects")
            
        finally:
            os.unlink(tmp_file_path)
        
    except GoogleGenAIError as e:
        print(f"Vision chat error: {e}")
    
    # Example 2: Multiple images comparison
    try:
        print("Comparing multiple images...")
        # This would work with real images
        # response = helper.chat_with_vision(
        #     "Compare these two images and describe the differences",
        #     ["image1.jpg", "image2.jpg"],
        #     temperature=0.5,
        #     max_tokens=500
        # )
        print("Demo: Would compare multiple images and describe differences")
        
    except GoogleGenAIError as e:
        print(f"Multi-image comparison error: {e}")


def example_text_to_speech(helper: EnhancedGoogleGenAIHelper):
    """Demonstrate text-to-speech functionality."""
    print("\n=== Text-to-Speech Examples ===")
    
    if not helper:
        print("Helper not available, skipping TTS examples")
        return
    
    # Example 1: Basic TTS
    try:
        text = "Hello! This is a demonstration of text-to-speech functionality."
        print(f"Converting to speech: '{text}'")
        
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
            tmp_file_path = tmp_file.name
        
        try:
            # This would work with a real API key
            # audio_file = helper.text_to_speech(
            #     text,
            #     voice_name="Kore",
            #     output_file=tmp_file_path
            # )
            # print(f"Audio saved to: {audio_file}")
            print(f"Demo: Would generate speech and save to {tmp_file_path}")
            
        finally:
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
        
    except GoogleGenAIError as e:
        print(f"TTS error: {e}")
    
    # Example 2: TTS with style control
    try:
        text = "The weather today is absolutely magnificent!"
        style_prompt = "Say cheerfully and enthusiastically:"
        
        print(f"Generating expressive speech...")
        # audio_data = helper.text_to_speech(
        #     text,
        #     voice_name="Fenrir",  # Excitable voice
        #     style_prompt=style_prompt
        # )
        print("Demo: Would generate expressive speech with style control")
        
    except GoogleGenAIError as e:
        print(f"Styled TTS error: {e}")
    
    # Example 3: Available voices
    print(f"Available TTS voices: {helper.TTS_VOICES[:10]}...")  # Show first 10


def example_speech_to_text(helper: EnhancedGoogleGenAIHelper):
    """Demonstrate speech-to-text functionality."""
    print("\n=== Speech-to-Text Examples ===")
    
    if not helper:
        print("Helper not available, skipping STT examples")
        return
    
    # Example 1: Basic transcription
    try:
        # Create a fake audio file for demonstration
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
            # Create a minimal WAV file
            with wave.open(tmp_file.name, 'wb') as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(16000)
                wf.writeframes(b'\x00\x01' * 1000)  # Fake audio data
            tmp_file_path = tmp_file.name
        
        try:
            print("Transcribing audio file...")
            # transcript = helper.speech_to_text(
            #     tmp_file_path,
            #     prompt="Generate a transcript of the speech."
            # )
            # print(f"Transcript: {transcript}")
            print("Demo: Would transcribe audio and return text")
            
        finally:
            os.unlink(tmp_file_path)
        
    except GoogleGenAIError as e:
        print(f"STT error: {e}")
    
    # Example 2: Transcription with timestamps
    try:
        print("Transcribing with timestamps...")
        # transcript = helper.speech_to_text(
        #     "meeting_recording.wav",
        #     prompt="Generate a transcript with speaker timestamps",
        #     timestamp_format=True
        # )
        print("Demo: Would generate transcript with timestamps")
        
    except GoogleGenAIError as e:
        print(f"Timestamped STT error: {e}")


def example_context_management(helper: EnhancedGoogleGenAIHelper):
    """Demonstrate context length management."""
    print("\n=== Context Management Examples ===")
    
    if not helper:
        print("Helper not available, skipping context management examples")
        return
    
    # Example 1: Truncation strategy
    try:
        # Create long content that exceeds limits
        long_content = " ".join([f"This is sentence number {i}." for i in range(1000)])
        print(f"Original content length: {len(long_content)} characters")
        
        managed_content, info = helper.manage_context_length(
            long_content,
            max_context_tokens=500,
            strategy="truncate",
            preserve_recent=True
        )
        
        print(f"Managed content length: {len(managed_content)} characters")
        print(f"Management info: {info}")
        
    except GoogleGenAIError as e:
        print(f"Context management error: {e}")
    
    # Example 2: Summarization strategy
    try:
        long_document = """
        This is a very long document that contains important information.
        The document discusses various topics including technology, science,
        and business strategies. It contains detailed analysis and recommendations
        for future development. The content is comprehensive and covers
        multiple aspects of the subject matter.
        """ * 50  # Make it long
        
        print("Using summarization strategy...")
        # managed_content, info = helper.manage_context_length(
        #     long_document,
        #     max_context_tokens=200,
        #     strategy="summarize"
        # )
        # print(f"Summarized content: {managed_content[:200]}...")
        print("Demo: Would summarize long content to fit context limits")
        
    except GoogleGenAIError as e:
        print(f"Summarization error: {e}")
    
    # Example 3: Cache strategy
    try:
        print("Using cache strategy...")
        content = "This content will be cached for future use."
        
        managed_content, info = helper.manage_context_length(
            content,
            max_context_tokens=1000,
            strategy="cache"
        )
        
        print(f"Cache info: {info}")
        
    except GoogleGenAIError as e:
        print(f"Cache strategy error: {e}")


def example_usage_tracking(helper: EnhancedGoogleGenAIHelper):
    """Demonstrate usage statistics tracking."""
    print("\n=== Usage Statistics Examples ===")
    
    if not helper:
        print("Helper not available, skipping usage tracking examples")
        return
    
    if not helper.usage_stats:
        print("Usage tracking is disabled")
        return
    
    # Simulate some API calls (would be real calls with API key)
    print("Simulating API usage...")
    
    # Simulate chat requests
    helper.usage_stats.add_request("chat", input_tokens=100, output_tokens=50, success=True)
    helper.usage_stats.add_request("chat", input_tokens=150, output_tokens=75, success=True)
    
    # Simulate vision requests
    helper.usage_stats.add_request("vision", input_tokens=300, output_tokens=100, images=2, success=True)
    
    # Simulate TTS requests
    helper.usage_stats.add_request("tts", input_tokens=80, audio_seconds=45.0, success=True)
    
    # Simulate STT requests
    helper.usage_stats.add_request("stt", input_tokens=0, output_tokens=120, audio_seconds=60.0, success=True)
    
    # Simulate an error
    helper.usage_stats.add_request("embedding", input_tokens=50, success=False)
    
    # Get comprehensive statistics
    try:
        stats = helper.get_usage_stats()
        
        print("\n--- Usage Summary ---")
        print(f"Total requests: {stats['summary']['total_requests']}")
        print(f"Success rate: {stats['summary']['success_rate']}%")
        print(f"Total input tokens: {stats['summary']['total_input_tokens']}")
        print(f"Total output tokens: {stats['summary']['total_output_tokens']}")
        print(f"Total audio seconds: {stats['summary']['total_audio_seconds']}")
        print(f"Images processed: {stats['summary']['total_images_processed']}")
        print(f"Estimated cost: ${stats['summary']['estimated_cost_usd']}")
        
        print("\n--- By Feature ---")
        for feature, count in stats['by_feature'].items():
            print(f"{feature}: {count}")
        
        print("\n--- Performance ---")
        print(f"Error count: {stats['performance']['error_count']}")
        print(f"Cache efficiency: {stats['performance']['cache_efficiency']}")
        
        print(f"\n--- Recent Requests ---")
        for request in stats['recent_requests'][-3:]:  # Show last 3
            print(f"  {request['timestamp']}: {request['type']} "
                  f"({'success' if request['success'] else 'failed'})")
        
    except GoogleGenAIError as e:
        print(f"Usage stats error: {e}")
    
    # Reset statistics
    print("\nResetting usage statistics...")
    helper.reset_usage_stats()
    
    new_stats = helper.get_usage_stats()
    print(f"After reset - Total requests: {new_stats['summary']['total_requests']}")


def example_enhanced_embedding(helper: EnhancedGoogleGenAIHelper):
    """Demonstrate enhanced embedding functionality."""
    print("\n=== Enhanced Embedding Examples ===")
    
    if not helper:
        print("Helper not available, skipping embedding examples")
        return
    
    # Example 1: Basic embedding with tracking
    try:
        text = "Machine learning is transforming various industries."
        print(f"Generating embedding for: '{text}'")
        
        # embedding = helper.get_embedding(text, task_type="retrieval_document")
        # print(f"Embedding dimension: {len(embedding)}")
        print("Demo: Would generate embedding and track usage")
        
    except GoogleGenAIError as e:
        print(f"Embedding error: {e}")
    
    # Example 2: Batch embeddings with different task types
    texts = [
        "Document about artificial intelligence",
        "Query about machine learning",
        "Research paper on neural networks"
    ]
    
    task_types = ["retrieval_document", "retrieval_query", "semantic_similarity"]
    
    for text, task_type in zip(texts, task_types):
        try:
            print(f"Generating {task_type} embedding...")
            # embedding = helper.get_embedding(text, task_type=task_type)
            print(f"Demo: Would generate {task_type} embedding for text")
            
        except GoogleGenAIError as e:
            print(f"Batch embedding error: {e}")


def example_comprehensive_workflow(helper: EnhancedGoogleGenAIHelper):
    """Demonstrate a comprehensive workflow using multiple features."""
    print("\n=== Comprehensive Workflow Example ===")
    
    if not helper:
        print("Helper not available, skipping comprehensive workflow")
        return
    
    try:
        print("1. Starting comprehensive AI workflow...")
        
        # Step 1: Analyze an image with vision
        print("2. Analyzing uploaded image...")
        # image_analysis = helper.chat_with_vision(
        #     "Describe what you see in this image and identify key objects",
        #     ["product_image.jpg"]
        # )
        image_analysis = "Demo: Product image shows a smartphone with modern design"
        print(f"   Analysis: {image_analysis}")
        
        # Step 2: Generate a marketing description
        print("3. Generating marketing content...")
        marketing_messages = [
            {"role": "system", "content": "You are a marketing copywriter."},
            {"role": "user", "content": f"Based on this analysis: {image_analysis}, write a compelling product description."}
        ]
        # marketing_copy = helper.chat(marketing_messages, temperature=0.8)
        marketing_copy = "Demo: Compelling marketing copy for the smartphone"
        print(f"   Marketing copy: {marketing_copy}")
        
        # Step 3: Convert to speech for audio ad
        print("4. Creating audio advertisement...")
        # audio_ad = helper.text_to_speech(
        #     marketing_copy,
        #     voice_name="Aoede",
        #     style_prompt="Say in an engaging, professional tone:",
        #     output_file="marketing_ad.wav"
        # )
        print("   Demo: Audio ad created and saved")
        
        # Step 4: Manage context for long conversation
        print("5. Managing conversation context...")
        long_conversation = marketing_copy + " " + image_analysis + " Additional context..." * 100
        managed_context, context_info = helper.manage_context_length(
            long_conversation,
            max_context_tokens=1000,
            strategy="truncate"
        )
        print(f"   Context managed: {context_info['tokens_saved']} tokens saved")
        
        # Step 5: Generate embeddings for search
        print("6. Creating embeddings for semantic search...")
        # embedding = helper.get_embedding(
        #     marketing_copy,
        #     task_type="retrieval_document",
        #     title="Product Marketing Copy"
        # )
        print("   Demo: Embeddings created for semantic search")
        
        # Step 6: Get final usage statistics
        print("7. Checking usage statistics...")
        if helper.usage_stats:
            stats = helper.get_usage_stats()
            print(f"   Workflow used {stats['summary']['total_requests']} API calls")
            print(f"   Total cost estimate: ${stats['summary']['estimated_cost_usd']}")
        
        print("8. Comprehensive workflow completed successfully!")
        
    except GoogleGenAIError as e:
        print(f"Workflow error: {e}")


def example_error_handling_enhanced():
    """Demonstrate enhanced error handling scenarios."""
    print("\n=== Enhanced Error Handling Examples ===")
    
    # Example 1: Invalid voice name
    try:
        helper = EnhancedGoogleGenAIHelper(api_key="dummy_key")
        helper.text_to_speech("Hello", voice_name="NonExistentVoice")
    except GoogleGenAIError as e:
        print(f"Expected TTS error: {e}")
    
    # Example 2: Empty images list
    try:
        helper = EnhancedGoogleGenAIHelper(api_key="dummy_key")
        helper.chat_with_vision("Describe this", [])
    except GoogleGenAIError as e:
        print(f"Expected vision error: {e}")
    
    # Example 3: Context limit exceeded
    try:
        helper = EnhancedGoogleGenAIHelper(api_key="dummy_key")
        helper._check_context_limits(1000000, 2000000)  # Exceeds limit
    except GoogleGenAIError as e:
        print(f"Expected context error: {e}")
    
    # Example 4: Usage stats when disabled
    try:
        helper = EnhancedGoogleGenAIHelper(api_key="dummy_key", enable_usage_tracking=False)
        helper.get_usage_stats()
    except GoogleGenAIError as e:
        print(f"Expected tracking error: {e}")


def main():
    """Run all enhanced examples."""
    print("Google GenAI Helper - Enhanced Usage Examples")
    print("=" * 50)
    
    os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY", "") 
    load_dotenv()

    # Set up logging
    setup_logging()
    
    # Initialize enhanced helper
    helper = example_basic_initialization()
    
    # Run enhanced examples
    example_chat_with_vision(helper)
    # example_text_to_speech(helper)
    # example_speech_to_text(helper)
    # example_context_management(helper)
    # example_usage_tracking(helper)
    # example_enhanced_embedding(helper)
    # example_comprehensive_workflow(helper)
    
    # Error handling examples (work without API key)
    # example_error_handling_enhanced()
    
    # print("\n=== Enhanced Examples Complete ===")
    # print("Note: Many examples require a valid GOOGLE_API_KEY environment variable")
    # print("and appropriate media files for full functionality.")


if __name__ == "__main__":
    main()
