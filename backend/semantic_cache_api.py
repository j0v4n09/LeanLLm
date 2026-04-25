from __future__ import annotations

from dotenv import load_dotenv
load_dotenv()

import logging
import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pinecone import Pinecone
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("leanllm.semantic_cache")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "lean-llm-cache"
PINECONE_NAMESPACE = "prod-cache"
EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o-mini"
CACHE_HIT_THRESHOLD = 0.96

if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY environment variable.")

openai_client = OpenAI(api_key=OPENAI_API_KEY)


def get_pinecone_index():
    if not PINECONE_API_KEY:
        logger.warning("PINECONE_API_KEY missing; semantic cache will be bypassed.")
        return None

    try:
        pinecone = Pinecone(api_key=PINECONE_API_KEY)
        return pinecone.Index(PINECONE_INDEX_NAME)
    except Exception as exc:
        logger.exception("Failed to initialize Pinecone index: %s", exc)
        return None


pinecone_index = get_pinecone_index()

app = FastAPI(title="LeanLLM Semantic Cache", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="Incoming user question or prompt.")
    system_prompt: str | None = Field(
        default="You are a helpful assistant.",
        description="Optional system prompt for the LLM call.",
    )


class ChatResponse(BaseModel):
    response: str
    cached: bool
    similarity_score: float | None = None
    cache_status: str


def get_embedding(text: str) -> list[float]:
    embedding_response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text,
    )
    return embedding_response.data[0].embedding


def query_semantic_cache(prompt: str, embedding: list[float]) -> tuple[str | None, float | None, str]:
    if pinecone_index is None:
        return None, None, "bypassed"

    try:
        result = pinecone_index.query(
            namespace=PINECONE_NAMESPACE,
            vector=embedding,
            top_k=1,
            include_metadata=True,
        )

        matches: list[dict[str, Any]] = result.get("matches", [])
        if not matches:
            return None, None, "miss"

        best_match = matches[0]
        score = best_match.get("score")
        metadata = best_match.get("metadata") or {}
        cached_response = metadata.get("response")

        if score is not None and score > CACHE_HIT_THRESHOLD and cached_response:
            logger.info("Cache hit for prompt with similarity %.4f", score)
            return cached_response, float(score), "hit"

        return None, float(score) if score is not None else None, "miss"
    except Exception as exc:
        logger.exception("Pinecone query failed, bypassing cache: %s", exc)
        return None, None, "bypassed"


def generate_llm_response(prompt: str, system_prompt: str | None) -> str:
    completion = openai_client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": system_prompt or "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
    )

    content = completion.choices[0].message.content
    if not content:
        raise HTTPException(status_code=502, detail="LLM returned an empty response.")
    return content


def upsert_cache_entry(prompt: str, embedding: list[float], response_text: str) -> None:
    if pinecone_index is None:
        return

    try:
        pinecone_index.upsert(
            namespace=PINECONE_NAMESPACE,
            vectors=[
                {
                    "id": prompt,
                    "values": embedding,
                    "metadata": {
                        "prompt": prompt,
                        "response": response_text,
                    },
                }
            ],
        )
    except Exception as exc:
        logger.exception("Pinecone upsert failed; continuing without cache persistence: %s", exc)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {
        "status": "ok",
        "pinecone": "connected" if pinecone_index is not None else "bypassed",
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    prompt = request.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    embedding = get_embedding(prompt)

    cached_response, similarity_score, cache_status = query_semantic_cache(prompt, embedding)
    if cached_response:
        return ChatResponse(
            response=cached_response,
            cached=True,
            similarity_score=similarity_score,
            cache_status=cache_status,
        )

    llm_response = generate_llm_response(prompt, request.system_prompt)
    upsert_cache_entry(prompt, embedding, llm_response)

    return ChatResponse(
        response=llm_response,
        cached=False,
        similarity_score=similarity_score,
        cache_status=cache_status,
    )