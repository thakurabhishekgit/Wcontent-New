'use server';
import axios from 'axios';
import { generateTrendArticle } from '@/ai/flows/generate-trend-article-flow';

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
    throw new Error('SerpApi API key is not configured in environment variables.');
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
    }));
    
    return trends;
  } catch (error) {
    console.error('Error fetching trends from SerpApi:', error.response?.data?.error || error.message);
    throw new Error('Failed to fetch trending videos. Please check your SerpApi key and try again.');
  }
}

export async function fetchTrendDetails(videoId) {
    if (!videoId) {
        throw new Error('Video ID is required to fetch trend details.');
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
        ...generatedContent // This adds fullArticle and aiSteps
    };
    
    return trendDetails;
}
