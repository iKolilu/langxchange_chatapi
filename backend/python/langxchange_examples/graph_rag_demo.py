import os
import asyncio
import logging
from typing import List

# Langxchange imports
from langxchange.documentloader import DocumentLoaderHelper, ChunkingStrategy
from langxchange.openai_helper import EnhancedOpenAIHelper, OpenAIConfig
from langxchange.kg_builder import KnowledgeGraphBuilder
from langxchange.neo4j_helper import Neo4jHelper, Neo4jConfig

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

async def run_graph_rag_demo():
    # 1. Configuration (Use environment variables for production)
    # DO NOT use actual API keys here
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your_openai_key")
    
    NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
    NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")
    NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "neo4j")

    DOC_PATH = "path/to/your/document.docx"

    if OPENAI_API_KEY == "your_openai_key":
        logger.warning("Please set OPENAI_API_KEY environment variable.")
        return

    try:
        # 2. Load and Chunk Document
        logger.info(f"Loading document: {DOC_PATH}")
        loader = DocumentLoaderHelper(chunk_size=1000, overlap_size=100, chunking_strategy=ChunkingStrategy.SEMANTIC)
        chunks = list(loader.load(DOC_PATH))
        text_chunks = [c.content for c in chunks]

        # 3. Initialize LLM Helper
        llm_config = OpenAIConfig(api_key=OPENAI_API_KEY, chat_model="gpt-4")
        llm_helper = EnhancedOpenAIHelper(config=llm_config)

        # 4. Extract Triples (Knowledge Graph Construction)
        logger.info("Extracting knowledge triples...")
        kg_builder = KnowledgeGraphBuilder(llm_helper=llm_helper, max_concurrency=5)
        triples = await kg_builder.process_chunks(text_chunks, use_batching=False)
        logger.info(f"Extracted {len(triples)} triples.")

        # 5. Store in Neo4j
        neo4j_config = Neo4jConfig(
            uri=NEO4J_URI,
            username=NEO4J_USERNAME,
            password=NEO4J_PASSWORD,
            database=NEO4J_DATABASE
        )
        neo4j_helper = Neo4jHelper(config=neo4j_config)
        neo4j_helper.connect()

        for t in triples:
            # Merge Subject
            neo4j_helper.merge_node(label=t.subject_type or "Entity", properties={"name": t.subject}, merge_on="name")
            # Merge Object
            neo4j_helper.merge_node(label=t.object_type or "Entity", properties={"name": t.object}, merge_on="name")
            # Merge Relationship
            neo4j_helper.merge_relationship(
                source_label=t.subject_type or "Entity",
                source_match={"name": t.subject},
                target_label=t.object_type or "Entity",
                target_match={"name": t.object},
                rel_type=t.predicate.replace(" ", "_").upper(),
                rel_properties={"confidence": t.confidence}
            )

        # 6. GraphRAG Retrieval
        query = "Summarize the key findings from the document based on the knowledge graph."
        logger.info(f"Querying GraphRAG: {query}")

        # Extract entities from query for search
        entity_prompt = f"Extract 3-5 key search keywords from this query: {query}. Return as comma-separated list."
        keywords_str = await llm_helper.achat([{"role": "user", "content": entity_prompt}])
        keywords = [k.strip() for k in keywords_str.split(",") if k.strip()]

        context_parts = []
        for kw in keywords:
            cypher = "MATCH (n)-[r]-(m) WHERE n.name CONTAINS $name RETURN n.name as s, type(r) as p, m.name as o LIMIT 5"
            results = neo4j_helper.execute_read(cypher, {"name": kw})
            for res in results:
                context_parts.append(f"{res['s']} --{res['p']}--> {res['o']}")

        graph_context = "\n".join(list(set(context_parts)))
        
        # Final Generation
        rag_prompt = f"Context:\n{graph_context}\n\nQuery: {query}"
        response = await llm_helper.achat([{"role": "user", "content": rag_prompt}])
        
        print("\n=== GraphRAG Result ===\n")
        print(response)

    except Exception as e:
        logger.error(f"Demo failed: {e}")
    finally:
        if 'neo4j_helper' in locals():
            neo4j_helper.close()

if __name__ == "__main__":
    asyncio.run(run_graph_rag_demo())
