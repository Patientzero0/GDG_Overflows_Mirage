from youtube_transcript_api import YouTubeTranscriptApi
import re

def get_youtube_transcripts(video_ids: list[str]) -> list[str]:
    """
    Fetches and cleans transcripts for a list of YouTube video IDs.
    """
    transcripts = []
    for video_id in video_ids:
        try:
            transcript_list = YouTubeTranscriptApi().get_transcript(video_id)
            full_transcript = " ".join([d['text'] for d in transcript_list])
            cleaned_transcript = re.sub(r'\[.*?\]', '', full_transcript) # Remove timestamps and other bracketed text
            cleaned_transcript = re.sub(r'\s+', ' ', cleaned_transcript).strip() # Normalize whitespace
            transcripts.append(cleaned_transcript)
        except Exception as e:
            print(f"Could not retrieve transcript for video {video_id}: {e}")
    return transcripts

def chunk_text(text: str, min_tokens: int = 200, max_tokens: int = 500) -> list[str]:
    """
    Splits a text into chunks of a specified token range.
    A simple approximation is used here (word count).
    """
    words = text.split()
    chunks = []
    current_chunk = []
    
    for word in words:
        current_chunk.append(word)
        # Check if the current chunk is within the desired length
        if len(current_chunk) >= min_tokens:
            # If it exceeds max_tokens, it's already too long, but we'll take it
            # A more sophisticated method would handle this better
            if len(current_chunk) > max_tokens:
                 chunks.append(" ".join(current_chunk))
                 current_chunk = []
            # If it's just right, check if the sentence ends
            elif word.endswith(('.', '?', '!')):
                chunks.append(" ".join(current_chunk))
                current_chunk = []

    # Add the last remaining chunk if it's not empty
    if current_chunk:
        chunks.append(" ".join(current_chunk))
        
    # Filter out any very short chunks that might have been created
    return [chunk for chunk in chunks if len(chunk.split()) > 5]

