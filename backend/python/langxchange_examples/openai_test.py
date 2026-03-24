#!/usr/bin/env python3
"""
Enhanced OpenAI Helper Example
Demonstrates all the advanced features of the enhanced OpenAI helper class.
"""

import os
import asyncio
import json
from pathlib import Path
from langxchange.openai_helper import EnhancedOpenAIHelper, OpenAIConfig

async def main():
    """Demonstrate enhanced OpenAI Helper functionality."""
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")
    # Check if API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Error: OPENAI_API_KEY environment variable not set.")
        print("Please set it with: export OPENAI_API_KEY='your-api-key-here'")
        return
    
    # Create custom configuration
    config = OpenAIConfig(
        chat_model="gpt-3.5-turbo",
        enable_caching=True,
        enable_cost_tracking=True,
        max_retries=3,
        log_level="INFO"
    )
    
    # Use context manager for automatic cleanup
    with EnhancedOpenAIHelper(config) as helper:
        print("🚀 Enhanced OpenAI Helper Demo")
        print("=" * 50)
        
        # Example 1: Enhanced Chat with Function Calling
        print("\n📝 Example 1: Enhanced Chat with Function Calling")
        print("-" * 50)
        
        # Define a function
        functions = [{
            "name": "get_weather",
            "description": "Get weather information for a city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "The city name"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["city"]
            }
        }]
        
        messages = [
            {"role": "system", "content": "You are a helpful assistant that can check weather."},
            {"role": "user", "content": "What's the weather like in Tokyo?"}
        ]
        
        try:
            response = helper.chat(
                messages=messages,
                functions=functions,
                function_call="auto",
                temperature=0.7
            )
            
            if isinstance(response, dict) and response.get("function_call"):
                print(f"🔧 Function call detected: {response['function_call']['name']}")
                print(f"📋 Arguments: {response['function_call']['arguments']}")
            else:
                print(f"🤖 Response: {response}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Example 2: Async Chat
        print("\n⚡ Example 2: Async Chat")
        print("-" * 50)
        
        try:
            async_response = await helper.achat(
                messages=[
                    {"role": "user", "content": "Explain quantum computing in one sentence."}
                ],
                temperature=0.5,
                max_tokens=100
            )
            print(f"🤖 Async response: {async_response}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Example 3: Cached Embeddings
        print("\n🔍 Example 3: Cached Embeddings")
        print("-" * 50)
        
        try:
            texts = [
                "Artificial intelligence and machine learning",
                "Natural language processing techniques",
                "Computer vision applications"
            ]
            
            # First call - will make API request
            embeddings1 = helper.get_embeddings(texts)
            print(f"📊 Generated {len(embeddings1)} embeddings (API call)")
            
            # Second call - should use cache
            embeddings2 = helper.get_embeddings(texts)
            print(f"📊 Retrieved {len(embeddings2)} embeddings (cached)")
            
            # Verify they're the same
            print(f"✅ Embeddings match: {embeddings1 == embeddings2}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Example 4: Context Length Management
        print("\n📏 Example 4: Context Length Management")
        print("-" * 50)
        
        try:
            # Create a long conversation
            long_messages = [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Tell me about " + "artificial intelligence " * 100},
                {"role": "assistant", "content": "AI is " + "fascinating " * 200},
                {"role": "user", "content": "What about " + "machine learning " * 150}
            ]
            
            # Count tokens before management
            total_tokens = sum(helper.count_tokens(msg["content"]) for msg in long_messages)
            print(f"📊 Original conversation: {len(long_messages)} messages, {total_tokens} tokens")
            
            # Manage context length
            managed_messages = helper.manage_context_length(long_messages, max_tokens=1000)
            managed_tokens = sum(helper.count_tokens(msg["content"]) for msg in managed_messages)
            print(f"📊 Managed conversation: {len(managed_messages)} messages, {managed_tokens} tokens")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Example 5: Image Generation
        print("\n🎨 Example 5: Image Generation")
        print("-" * 50)
        
        try:
            image_urls = helper.generate_image(
                prompt="A futuristic city with flying cars and neon lights",
                size="1024x1024",
                quality="standard",
                n=1
            )
            print(f"🖼️ Generated image URL: {image_urls[0][:50]}...")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Example 6: Text-to-Speech
        print("\n🔊 Example 6: Text-to-Speech")
        print("-" * 50)
        
        try:
            audio_content = helper.text_to_speech(
                text="Hello! This is a demonstration of text-to-speech functionality.",
                voice="alloy",
                response_format="mp3"
            )
            
            # Save to file
            audio_path = Path("demo_audio.mp3")
            with open(audio_path, "wb") as f:
                f.write(audio_content)
            print(f"🔊 Audio saved to: {audio_path} ({len(audio_content)} bytes)")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Example 7: Batch Processing with Progress
        print("\n⚙️ Example 7: Batch Processing")
        print("-" * 50)
        
        try:
            # Define a simple processing function
            def process_text(text):
                return helper.count_tokens(text)
            
            # Progress callback
            def progress_callback(current, total):
                print(f"📈 Progress: {current}/{total} batches completed")
            
            texts_to_process = [f"Sample text number {i}" for i in range(25)]
            
            token_counts = helper.batch_process(
                items=texts_to_process,
                processor=process_text,
                batch_size=5,
                progress_callback=progress_callback
            )
            
            print(f"📊 Processed {len(token_counts)} texts")
            print(f"📊 Total tokens: {sum(filter(None, token_counts))}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Example 8: Advanced Content Moderation
        print("\n🛡️ Example 8: Content Moderation")
        print("-" * 50)
        
        try:
            test_texts = [
                "This is a completely safe and friendly message.",
                "I love programming and technology!",
                "What a beautiful day it is today."
            ]
            
            for text in test_texts:
                moderation = helper.moderate(text)
                print(f"📝 Text: '{text[:30]}...'")
                print(f"🛡️ Flagged: {moderation['flagged']}")
                
                if moderation['flagged']:
                    flagged_categories = [cat for cat, flagged in moderation['categories'].items() if flagged]
                    print(f"⚠️ Issues: {', '.join(flagged_categories)}")
                print()
                
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Example 9: Usage Statistics and Cost Tracking
        print("\n📊 Example 9: Usage Statistics")
        print("-" * 50)
        
        stats = helper.get_usage_stats()
        print(f"📈 Total requests: {stats['requests']}")
        print(f"📈 Total tokens: {stats['total_tokens']}")
        print(f"📈 Prompt tokens: {stats['prompt_tokens']}")
        print(f"📈 Completion tokens: {stats['completion_tokens']}")
        print(f"💰 Estimated cost: ${stats['estimated_cost']:.4f}")
        print(f"🗃️ Cache size: {stats['cache_size']} items")
        
        # Example 10: Model Information
        print("\n📋 Example 10: Available Models")
        print("-" * 50)
        
        try:
            models = helper.list_models()
            gpt_models = [m for m in models if 'gpt' in m.lower()]
            embedding_models = [m for m in models if 'embedding' in m.lower()]
            
            print(f"🤖 GPT models: {len(gpt_models)}")
            for model in sorted(gpt_models)[:5]:  # Show first 5
                print(f"  • {model}")
            
            print(f"🔍 Embedding models: {len(embedding_models)}")
            for model in sorted(embedding_models):
                print(f"  • {model}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Final statistics
        print("\n" + "="*50)
        print("🏁 Demo Complete - Final Statistics")
        print("="*50)
        final_stats = helper.get_usage_stats()
        print(f"📊 Session summary:")
        print(f"  • Total API requests: {final_stats['requests']}")
        print(f"  • Total tokens used: {final_stats['total_tokens']}")
        print(f"  • Estimated cost: ${final_stats['estimated_cost']:.4f}")
        print(f"  • Cache hits achieved: {final_stats['cache_size']} items cached")

if __name__ == "__main__":
    asyncio.run(main())
