// YouTube transcript extraction utility
import { YoutubeTranscript } from 'youtube-transcript';

export interface TranscriptItem {
  text: string;
  start: number;
  duration: number;
}

// YouTube video ID extract করার function
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/,
    /youtube\.com\/v\/([^&?\s]+)/,
    /youtube\.com\/watch\?.*v=([^&?\s]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// YouTube transcript fetch করার function
export async function fetchYouTubeTranscript(videoUrl: string): Promise<string> {
  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Use youtube-transcript library
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      throw new Error('No transcript available');
    }

    // Combine all transcript text
    const fullTranscript = transcript
      .map(item => item.text)
      .join(' ')
      .replace(/\[.*?\]/g, '') // Remove [Music], [Applause] etc.
      .replace(/\s+/g, ' ') // Clean up multiple spaces
      .trim();

    return fullTranscript;

  } catch (error) {
    console.error('Transcript extraction failed:', error);
    throw new Error('Could not extract video transcript');
  }
}

// Video title fetch করার helper function
async function getVideoTitle(videoId: string): Promise<string> {
  try {
    // YouTube oEmbed API ব্যবহার করে title পাওয়া যায়
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const data = await response.json();
    return data.title || 'Unknown Video';
  } catch {
    return 'Unknown Video';
  }
}

// Video category guess করার helper function
function getVideoCategory(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('python')) return 'Python programming';
  if (lowerTitle.includes('javascript') || lowerTitle.includes('js')) return 'JavaScript programming';
  if (lowerTitle.includes('react')) return 'React development';
  if (lowerTitle.includes('wordpress')) return 'WordPress development';
  if (lowerTitle.includes('html') || lowerTitle.includes('css')) return 'Web development';
  if (lowerTitle.includes('tutorial')) return 'educational';
  
  return 'educational';
}

// Enhanced video context তৈরি করার function
export async function generateVideoContext(videoUrl: string, videoTitle: string): Promise<string> {
  try {
    const transcript = await fetchYouTubeTranscript(videoUrl);
    
    // Limit transcript length for AI processing
    const limitedTranscript = transcript.length > 2000 
      ? transcript.substring(0, 2000) + '...'
      : transcript;
    
    return `🎥 Video Context:
Title: ${videoTitle}
URL: ${videoUrl}

Video Transcript:
${limitedTranscript}

Based on this video content, you can answer questions about:
- Main topics and concepts covered
- Key points and explanations
- Step-by-step processes shown
- Examples and demonstrations mentioned
- Practice questions based on the actual content
- Related concepts and applications

Please provide specific answers based on the actual video content above.`;

  } catch (error) {
    // Fallback context without transcript
    const videoId = extractVideoId(videoUrl);
    const category = getVideoCategory(videoTitle);
    
    return `🎥 Video Context:
Title: ${videoTitle}
URL: ${videoUrl}
Category: ${category}

This is an educational video lesson. While transcript is not available, I can help you with:
- General questions about ${category} based on the title
- Creating practice questions for the subject
- Explaining related concepts and fundamentals
- Providing examples and applications in ${category}

For more specific content-based questions, please describe what was covered in the video or provide key topics.`;
  }
}