import { YoutubeTranscript } from 'youtube-transcript';

export interface TranscriptItem {
  text: string;
  start: number;
  duration: number;
}

// 1. Improved Video ID Extraction (Handles more edge cases)
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// 2. Advanced Transcript Fetch with Auto-Cleanup
export async function fetchYouTubeTranscript(videoUrl: string): Promise<string> {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error('Invalid YouTube URL');

  try {
    // Note: If this fails on Vercel, consider using an API like 'Transcript API' by RapidAPI 
    // or a custom proxy because YouTube blocks many cloud IPs.
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: 'en' // Default to English, can be dynamic
    });
    
    if (!transcript || transcript.length === 0) throw new Error('No transcript available');

    return transcript
      .map(item => item.text)
      .join(' ')
      .replace(/\[Music\]|\[Applause\]|\[Laughter\]/gi, '') // Advanced Regex
      .replace(/\s+/g, ' ')
      .trim();

  } catch (error) {
    console.error('Transcript fetch failed:', error);
    throw new Error('Could not extract video transcript');
  }
}

// 3. Intelligent Context Generation (Token Optimization)
export async function generateVideoContext(videoUrl: string, videoTitle: string): Promise<string> {
  try {
    const transcript = await fetchYouTubeTranscript(videoUrl);
    
    /**
     * ADVANCED: Smart Chunking
     * Gemini-flash can handle up to 1M tokens, but sending 2000 chars is too little.
     * We should send up to 15,000 characters for a deep quiz (approx 45 mins video).
     */
    const MAX_LENGTH = 15000; 
    let processedTranscript = transcript;

    if (transcript.length > MAX_LENGTH) {
        // If too long, take the first 8000 and last 7000 characters 
        // to capture Introduction and Conclusion/Summary.
        processedTranscript = transcript.substring(0, 8000) + 
                              "\n... [part of transcript skipped for brevity] ...\n" + 
                              transcript.substring(transcript.length - 7000);
    }
    
    return `### VIDEO DATA
TITLE: ${videoTitle}
SOURCE: ${videoUrl}

### CORE CONTENT (TRANSCRIPT)
${processedTranscript}

### INSTRUCTIONS FOR AI
- Analyze the technical terminology used in this video.
- Focus on the practical examples mentioned.
- Ignore any sponsorship or generic "like/subscribe" segments.
- Identify the sequence of steps for any tutorial shown.`;

  } catch (error) {
    // Robust Fallback using metadata only
    return `### VIDEO DATA (Metadata Only)
TITLE: ${videoTitle}
URL: ${videoUrl}
NOTE: Transcript unavailable. Base questions on the Title and general knowledge of the subject.`;
  }
}