
'use server';
import axios from 'axios';
import { generateTrendArticle } from '@/ai/flows/generate-trend-article-flow';

// --- Static Fallback Data ---
// This data is used if the live SerpApi fetch fails, ensuring the page is always functional.
const staticFallbackTrends = [
    { id: 'fs-ai-docs', title: 'The Rise of AI-Narrated Documentaries', category: 'Tech', hotness: 4, excerpt: 'Explore how creators are using realistic AI voice generation to produce compelling, high-quality documentary-style videos on complex topics with a fraction of the budget.', exampleVideoUrl: 'https://www.youtube.com/embed/1d0Zf9sXl4k', thumbnail: 'https://placehold.co/600x400.png' },
    { id: 'fs-fashion-vlog', title: 'Cinematic "Day in My Life" Fashion Vlogs', category: 'Fashion', hotness: 5, excerpt: 'A move away from simple hauls to highly-edited, story-driven vlogs showing how fashion integrates into a full day, often with a vintage or film-like aesthetic.', exampleVideoUrl: 'https://www.youtube.com/embed/nL21fA4Z9wI', thumbnail: 'https://placehold.co/600x400.png' },
    { id: 'fs-gaming-challenge', title: 'One-Life "Permadeath" Gaming Challenges', category: 'Gaming', hotness: 5, excerpt: 'Streamers and YouTubers take on popular games with a single life, creating high-stakes content where one mistake ends the entire series, driving viewer engagement.', exampleVideoUrl: 'https://www.youtube.com/embed/zihoyzB423U', thumbnail: 'https://placehold.co/600x400.png' },
    { id: 'fs-silent-vlog', title: 'The "Silent Vlog" Aesthetic', category: 'Lifestyle', hotness: 3, excerpt: 'A calming trend focusing on ASMR-like sounds and visual storytelling without any speaking. It emphasizes cozy, everyday activities like cooking, cleaning, and studying.', exampleVideoUrl: 'https://www.youtube.com/embed/1-4_kLPTv8w', thumbnail: 'https://placehold.co/600x400.png' },
    { id: 'fs-deep-dive', title: 'Long-Form Video Essays & Deep Dives', category: 'Education', hotness: 4, excerpt: 'Creators are finding success with 45min+ videos that perform a deep analysis of a niche topic, from historical events to the design philosophy of a video game.', exampleVideoUrl: 'https://www.youtube.com/embed/g3j934pS-3s', thumbnail: 'https://placehold.co/600x400.png' }
];

// Simple function to parse view count for "hotness"
function calculateHotness(viewsText) {
  if (!viewsText) return 1;
  const text = viewsText.toLowerCase();
  let views = 0;
  if (text.includes('k')) {
    views = parseFloat(text) * 1000;
  } else if (text.includes('m')) {
    views = parseFloat(text) * 1000000;
  } else {
    views = parseInt(text, 10) || 0;
  }

  if (views > 1000000) return 5;
  if (views > 500000) return 4;
  if (views > 100000) return 3;
  if (views > 25000) return 2;
  return 1;
}

// Simple function to guess category
function guessCategory(title) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('gaming') || lowerTitle.includes('game')) return 'Gaming';
    if (lowerTitle.includes('tech') || lowerTitle.includes('review') || lowerTitle.includes('unboxing') || lowerTitle.includes('iphone')) return 'Tech';
    if (lowerTitle.includes('vlog') || lowerTitle.includes('daily')) return 'Lifestyle';
    if (lowerTitle.includes('fashion') || lowerTitle.includes('haul') || lowerTitle.includes('dupe')) return 'Fashion';
    if (lowerTitle.includes('recipe') || lowerTitle.includes('cooking')) return 'Food';
    if (lowerTitle.includes('comedy') || lowerTitle.includes('skit')) return 'Comedy';
    if (lowerTitle.includes('tutorial') || lowerTitle.includes('how to')) return 'Education';
    if (lowerTitle.includes('travel')) return 'Travel';
    return 'General';
}


export async function fetchTrendingVideos() {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    console.warn('SerpApi API key not found. Returning static fallback data.');
    return staticFallbackTrends;
  }

  const params = {
    engine: 'youtube',
    search_query: 'new content trends for creators',
    sort_by: 'upload_date', // To get the latest content
    api_key: apiKey,
  };

  try {
    const response = await axios.get('https://serpapi.com/search.json', { params });
    const videoResults = response.data?.video_results || [];

    // Map the results to the format our frontend expects
    const trends = videoResults.slice(0, 15).map(video => ({ // Limit to 15 results
      id: video.video_id,
      title: video.title,
      category: guessCategory(video.title),
      hotness: calculateHotness(video.views),
      excerpt: video.snippet || 'No description available.',
      thumbnail: video.thumbnail,
    }));
    
    return trends;
  } catch (error) {
    console.error('Error fetching trends from SerpApi, returning static fallback data. Error:', error.response?.data?.error || error.message);
    // Instead of throwing an error, return the static data so the page doesn't break.
    return staticFallbackTrends;
  }
}

export async function fetchTrendDetails(videoId) {
    if (!videoId) {
        throw new Error('Video ID is required to fetch trend details.');
    }
    
    // If the ID matches a static fallback, use that data
    if (videoId.startsWith('fs-')) {
        const staticTrend = staticFallbackTrends.find(t => t.id === videoId);
        if (staticTrend) {
            console.log(`Serving static details for ${videoId}`);
             const generatedContent = await generateTrendArticle({
                title: staticTrend.title,
                snippet: staticTrend.excerpt,
            });
            return {
                ...staticTrend,
                ...generatedContent
            };
        }
    }

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
        throw new Error('SerpApi API key is not configured in environment variables.');
    }

    // Step 1: Fetch video details from SerpApi
    const params = {
        engine: 'youtube',
        search_query: videoId,
        api_key: apiKey,
    };
    
    let videoDetails;
    try {
        const response = await axios.get('https://serpapi.com/search.json', { params });
        // The first result should be our video
        if (!response.data?.video_results?.[0]) {
             throw new Error('Video details not found on SerpApi.');
        }
        videoDetails = response.data.video_results[0];
    } catch(error) {
        console.error('Error fetching video details from SerpApi:', error.response?.data?.error || error.message);
        throw new Error('Failed to fetch video details.');
    }

    // Step 2: Generate the article and AI steps using Genkit
    let generatedContent;
    try {
        generatedContent = await generateTrendArticle({
            title: videoDetails.title,
            snippet: videoDetails.snippet,
        });
    } catch(error) {
        console.error('Error generating trend article with Genkit:', error);
        // Provide fallback content if AI fails
        generatedContent = {
            fullArticle: videoDetails.snippet || "Could not generate a full article for this trend. The main idea revolves around the video title.",
            aiSteps: [
                { title: 'AI Assistant Offline', content: 'The AI assistant could not be reached to generate creation steps.' }
            ]
        };
    }

    // Step 3: Combine all data into a single trend object
    const trendDetails = {
        id: videoId,
        title: videoDetails.title,
        category: guessCategory(videoDetails.title),
        hotness: calculateHotness(videoDetails.views),
        excerpt: videoDetails.snippet,
        exampleVideoUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnail: videoDetails.thumbnail,
        ...generatedContent // This adds fullArticle and aiSteps
    };
    
    return trendDetails;
}
