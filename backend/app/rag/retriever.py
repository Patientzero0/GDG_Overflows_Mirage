import faiss
import numpy as np
import json
import os
from app.config.settings import settings

class Retriever:
    def __init__(self):
        self.index = None
        self.chunks = None

    def build_and_save_index(self, embeddings: np.ndarray, chunks: list[str]):
        """
        Builds a FAISS index from embeddings and saves it along with the text chunks.
        """
        if not os.path.exists(os.path.dirname(settings.VECTOR_STORE_PATH)):
            os.makedirs(os.path.dirname(settings.VECTOR_STORE_PATH))
            
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embeddings)
        
        faiss.write_index(self.index, settings.VECTOR_STORE_PATH)
        
        with open(settings.CHUNKS_PATH, 'w', encoding='utf-8') as f:
            json.dump(chunks, f)

    def load_index(self):
        """
        Loads the FAISS index and text chunks from storage.
        """
        if os.path.exists(settings.VECTOR_STORE_PATH):
            self.index = faiss.read_index(settings.VECTOR_STORE_PATH)
            with open(settings.CHUNKS_PATH, 'r', encoding='utf-8') as f:
                self.chunks = json.load(f)
        else:
            raise FileNotFoundError("FAISS index or chunks file not found. Please run the ingestion script first.")

    def retrieve(self, query_embedding: np.ndarray, top_k: int = settings.NUM_RETRIEVED_DOCS) -> list[str]:
        """
        Retrieves the top_k most relevant chunks for a given query embedding.
        """
        if self.index is None or self.chunks is None:
            self.load_index()
            
        distances, indices = self.index.search(query_embedding, top_k)
        
        retrieved_chunks = [self.chunks[i] for i in indices[0]]
        return retrieved_chunks

retriever = Retriever()
