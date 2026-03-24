"""
Example usage of the improved PromptHelper class.
Demonstrates different prompt building modes and tool integration.
"""
import os
from langxchange.prompt_helper import EnhancedPromptHelper, PromptMode
from typing import Dict, List, Any
from langxchange.openai_helper import EnhancedOpenAIHelper, OpenAIConfig
from langxchange.localllm import LocalLLM
from dotenv import load_dotenv


class MockLLM:
    """Mock LLM for demonstration purposes."""
    
    def chat(self, messages: List[Dict[str, str]], **kwargs) -> str:
        """Simulate LLM response."""
        # In a real implementation, this would call an actual LLM
        prompt_content = "\n".join([f"{msg['role']}: {msg['content']}" for msg in messages])
        return f"[Mock Response to: {len(messages)} messages with temp={kwargs.get('temperature', 0.7)}]"


class SampleTool:
    """Sample tool for demonstration."""
    
    def run(self, query: str) -> str:
        return f"Tool processed: {query}"


def sample_search_tool(query: str, limit: int = 3) -> List[str]:
    """Sample search function."""
    return [f"Result {i+1} for '{query}'" for i in range(limit)]


def main():
    """Demonstrate various features of PromptHelper."""
     # ─── 1) Configuration ────────────────────────────────────────────────────────
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")  # set your key
    load_dotenv()  # load .env if present

    # Initialize mock LLM
    # llm = MockLLM()
     # Initialize Local LLM for embeddings
  
    #llm = LocalLLM('all-MiniLM-L6-v2', device='cpu')

    open_ai_config = OpenAIConfig(
        chat_model="gpt-3.5-turbo",
        enable_caching=True,
        enable_cost_tracking=True,
        max_retries=3,
        log_level="INFO"
    )
    llm =  EnhancedOpenAIHelper(open_ai_config)
    
    # Initialize PromptHelper with different configurations
    print("=== Basic PromptHelper Initialization ===")
    helper = EnhancedPromptHelper(
        llm=llm,
        system_prompt="You are a helpful assistant.",
        default_mode=PromptMode.AUGMENTED,
        max_context_length=1500,
        max_snippets=3
    )
    
    # Register some tools
    helper.register_tool("sample_tool", SampleTool())
    helper.register_tool("search", sample_search_tool)
    
    print(f"Available tools: {helper.list_tools()}")
    print(f"Current config: {helper.get_config()}")
    
    # Sample retrieval results
    sample_retrieval_results = [
        {
            "text": "Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data.",
            "metadata": {"source": "ML_Basics.pdf", "score": 0.95}
        },
        {
            "text": "Deep learning uses neural networks with multiple layers to model and understand complex patterns.",
            "metadata": {"source": "Deep_Learning_Guide.pdf", "score": 0.87}
        },
        {
            "text": "Natural language processing enables computers to understand and generate human language.",
            "metadata": {"source": "NLP_Overview.pdf", "score": 0.82}
        }
    ]
    
    user_query = "What is machine learning and how does it relate to AI?"
    
    print("\n=== Different Prompt Building Modes ===")
    
    # Test different modes
    modes_to_test = [PromptMode.BASIC, PromptMode.AUGMENTED, PromptMode.CONTEXTUAL, PromptMode.SUMMARIZED]
    
    for mode in modes_to_test:
        print(f"\n--- {mode.value.upper()} MODE ---")
        
        # Build prompt only
        messages = helper.build_prompt(
            user_query=user_query,
            retrieval_results=sample_retrieval_results,
            mode=mode
        )
        
        print(f"Generated {len(messages)} messages:")
        for i, msg in enumerate(messages):
            content_preview = msg['content'][:100] + "..." if len(msg['content']) > 100 else msg['content']
            print(f"  {i+1}. {msg['role']}: {content_preview}")
        
        # Run with LLM
        response = helper.run(
            user_query=user_query,
            retrieval_results=sample_retrieval_results,
            mode=mode,
            temperature=0.5
        )
        print(f"LLM Response: {response}")
    
    print("\n=== Tool Integration Example ===")
    
    # Test tool calling
    try:
        tool_result = helper.call_tool("sample_tool", "test query")
        print(f"Sample tool result: {tool_result}")
        
        search_result = helper.call_tool("search", "artificial intelligence", limit=2)
        print(f"Search tool result: {search_result}")
    except Exception as e:
        print(f"Tool error: {e}")
    
    # Test run_with_tools
    tool_calls = [
        {"name": "search", "kwargs": {"query": "machine learning", "limit": 2}},
        {"name": "sample_tool", "args": ["analysis query"]}
    ]
    
    result = helper.run_with_tools(
        user_query=user_query,
        tool_calls=tool_calls,
        retrieval_results=sample_retrieval_results,
        mode=PromptMode.SUMMARIZED
    )
    
    print(f"\nRun with tools result:")
    print(f"  LLM Response: {result['llm_response']}")
    print(f"  Tool Results: {result['tool_results']}")
    
    print("\n=== Configuration Updates ===")
    
    # Update configuration
    helper.update_config(
        default_mode=PromptMode.CONTEXTUAL,
        max_context_length=2500,
        max_snippets=5
    )
    
    print(f"Updated config: {helper.get_config()}")
    
    # Test with custom system prompt
    custom_response = helper.run(
        user_query="Explain this briefly",
        retrieval_results=sample_retrieval_results[:1],  # Use only first result
        custom_system_prompt="You are a concise technical expert. Provide brief, accurate answers."
    )
    
    print(f"Custom system prompt response: {custom_response}")
    
    print("\n=== Edge Cases and Error Handling ===")
    
    # Test with no retrieval results
    no_retrieval_response = helper.run(
        user_query="What is 2+2?",
        retrieval_results=None,
        mode=PromptMode.AUGMENTED
    )
    print(f"No retrieval results: {no_retrieval_response}")
    
    # Test with empty retrieval results
    empty_retrieval_response = helper.run(
        user_query="What is 2+2?",
        retrieval_results=[],
        mode=PromptMode.SUMMARIZED
    )
    print(f"Empty retrieval results: {empty_retrieval_response}")
    
    # Test invalid tool call
    try:
        helper.call_tool("nonexistent_tool", "test")
    except ValueError as e:
        print(f"Expected error for invalid tool: {e}")


if __name__ == "__main__":
    main()
