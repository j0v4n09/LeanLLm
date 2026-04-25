# Semantic Cache API

This FastAPI service adds a semantic caching layer in front of an LLM call.

## Environment variables

```bash
export OPENAI_API_KEY=...
export PINECONE_API_KEY=...
```

## Behavior

- Embeds each incoming prompt with `text-embedding-3-small`
- Queries Pinecone index `lean-llm-cache` in namespace `prod-cache`
- If the top match score is greater than `0.96`, returns the cached `metadata.response`
- Otherwise calls `gpt-4o`, then stores the vector and response back in Pinecone
- If Pinecone is down, the service bypasses the cache and still returns the LLM result

This means if a new question is semantically very close to a previous question, the service can reuse the previous answer instead of calling the model again.

## Run locally

```bash
cd backend
pip install -r requirements.txt
uvicorn semantic_cache_api:app --reload
```
