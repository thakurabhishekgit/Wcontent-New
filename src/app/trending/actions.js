
'use server';
import axios from 'axios';
import { generateTrendArticle } from '@/ai/flows/generate-trend-article-flow';

// --- Static Fallback Data ---
// Expanded and more diverse fallback data to be used if the live API fails.
const staticFallbackTrends = [
    { id: 'fs-ai-docs', title: 'AI-Narrated Documentaries on Complex Topics', category: 'Tech', hotness: 4, excerpt: 'Explore how creators are using realistic AI voice generation to produce compelling, high-quality documentary-style videos on complex topics with a fraction of the budget.' },
    { id: 'fs-fashion-vlog', title: 'Cinematic "Day in My Life" Fashion Vlogs', category: 'Fashion', hotness: 5, excerpt: 'A move away from simple hauls to highly-edited, story-driven vlogs showing how fashion integrates into a full day, often with a vintage or film-like aesthetic.' },
    { id: 'fs-gaming-challenge', title: 'One-Life "Permadeath" Gaming Challenges', category: 'Gaming', hotness: 5, excerpt: 'Streamers and YouTubers take on popular games with a single life, creating high-stakes content where one mistake ends the entire series, driving viewer engagement.' },
    { id: 'fs-silent-vlog', title: 'The "Silent Vlog" Aesthetic for Cozy Content', category: 'Lifestyle', hotness: 3, excerpt: 'A calming trend focusing on ASMR-like sounds and visual storytelling without any speaking. It emphasizes cozy, everyday activities like cooking, cleaning, and studying.' },
    { id: 'fs-deep-dive', title: 'Long-Form Video Essays & Deep Dives', category: 'Education', hotness: 4, excerpt: 'Creators are finding success with 45min+ videos that perform a deep analysis of a niche topic, from historical events to the design philosophy of a video game.' },
    { id: 'fs-recipe-quick', title: 'Fast-Paced, ASMR Recipe Videos', category: 'Food', hotness: 4, excerpt: 'Under-60-second recipe videos with satisfying sounds and quick cuts, optimized for short-form platforms like Reels and TikTok.' },
    { id: 'fs-travel-local', title: 'Hyper-Local Travel Guides', category: 'Travel', hotness: 3, excerpt: 'Instead of international destinations, creators are focusing on hidden gems and unique experiences within their own city or region, appealing to local and budget-conscious audiences.' },
    { id: 'fs-fitness-challenge', title: '30-Day Fitness Challenge Documentation', category: 'Fitness', hotness: 4, excerpt: 'Creators document their progress, struggles, and results over a 30-day fitness challenge, creating a relatable and inspiring series.' },
    { id: 'fs-comedy-pov', title: 'POV: Relatable Situation Comedy Skits', category: 'Comedy', hotness: 5, excerpt: 'Short, point-of-view style skits that place the viewer in a funny and relatable situation, often using trending audio.' },
    { id: 'fs-beauty-dupes', title: 'High-End vs. Drugstore "Dupes" Battle', category: 'Beauty', hotness: 4, excerpt: 'Beauty creators test and compare expensive, high-end products against their affordable "dupe" counterparts, providing valuable insights for viewers.' }
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
    if (lowerTitle.includes('gaming') || lowerTitle.includes('game') || lowerTitle.includes('valorant')) return 'Gaming';
    if (lowerTitle.includes('tech') || lowerTitle.includes('review') || lowerTitle.includes('unboxing') || lowerTitle.includes('iphone') || lowerTitle.includes('samsung')) return 'Tech';
    if (lowerTitle.includes('vlog') || lowerTitle.includes('daily')) return 'Lifestyle';
    if (lowerTitle.includes('fashion') || lowerTitle.includes('haul') || lowerTitle.includes('outfit') || lowerTitle.includes('dupe')) return 'Fashion';
    if (lowerTitle.includes('recipe') || lowerTitle.includes('cooking') || lowerTitle.includes('food')) return 'Food';
    if (lowerTitle.includes('comedy') || lowerTitle.includes('skit') || lowerTitle.includes('funny')) return 'Comedy';
    if (lowerTitle.includes('tutorial') || lowerTitle.includes('how to') || lowerTitle.includes('learn')) return 'Education';
    if (lowerTitle.includes('travel') || lowerTitle.includes('trip')) return 'Travel';
    if (lowerTitle.includes('fitness') || lowerTitle.includes('workout')) return 'Fitness';
    if (lowerTitle.includes('beauty') || lowerTitle.includes('makeup')) return 'Beauty';
    return 'General';
}


export async function fetchTrendingVideos(category = 'All') {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    console.warn('SerpApi API key not found. Returning static fallback data.');
    return staticFallbackTrends;
  }

  // **FIXED**: Refined search query and parameters for better regional and category targeting.
  const searchQuery = category === 'All'
    ? 'youtube trending videos for content creators'
    : `new ${category.toLowerCase()} video trends`;

  const params = {
    engine: 'youtube',
    search_query: searchQuery,
    gl: 'in', // Explicitly set geographical location to India
    location: 'India', // Use the location parameter for more specificity
    api_key: apiKey,
  };

  try {
    const response = await axios.get('https://serpapi.com/search.json', { params });
    const videoResults = response.data?.video_results || [];

    const trends = videoResults.slice(0, 20).map(video => ({
      id: video.video_id,
      title: video.title,
      category: guessCategory(video.title),
      hotness: calculateHotness(video.views),
      excerpt: video.snippet || 'No description available.',
    }));
    
    // If the API call is successful but returns no results, fall back to static data.
    if (trends.length === 0) {
        console.warn(`No results from SerpApi for category "${category}". Returning static fallback.`);
        return staticFallbackTrends;
    }
    
    return trends;
  } catch (error) {
    console.error(`Error fetching trends for category "${category}" from SerpApi. Error:`, error.response?.data?.error || error.message);
    // On any error, return the static data so the page doesn't break.
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
        // Fallback to static if key is missing, to prevent detail page error
        const staticTrend = staticFallbackTrends[0]; // a default fallback
         const generatedContent = await generateTrendArticle({
                title: staticTrend.title,
                snippet: staticTrend.excerpt,
            });
        return { ...staticTrend, ...generatedContent, id: videoId };
    }

    // Step 1: Fetch video details from SerpApi
    const params = {
        engine: 'youtube',
        search_query: videoId, // Searching by videoId usually returns it as the top result
        gl: 'in', // Maintain region consistency
        location: 'India',
        api_key: apiKey,
    };
    
    let videoDetails;
    try {
        const response = await axios.get('https://serpapi.com/search.json', { params });
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
                { title: 'AI Assistant Offline', content: 'The AI assistant could not be reached to generate creation steps.' },
                { title: 'Script & Outline', content: 'Focus on creating a clear script. Start with a hook, provide value in the middle, and end with a call to action.'},
                { title: 'Visuals & Production', content: 'Ensure good lighting and clear audio. Use b-roll and graphics to keep viewers engaged.'}
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
        ...generatedContent // This adds fullArticle and aiSteps
    };
    
    return trendDetails;
}
