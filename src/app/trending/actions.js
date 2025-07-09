
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

  // Construct a more specific search query for better results.
  const searchQuery = category === 'All'
    ? 'youtube trending videos for content creators in india'
    : `new trending ${category.toLowerCase()} videos india`;

  const params = {
    engine: 'youtube',
    search_query: searchQuery,
    gl: 'in', 
    location: 'India', 
    api_key: apiKey,
    num: 40, // Explicitly request more results
  };

  try {
    const response = await axios.get('https://serpapi.com/search.json', { params });
    const videoResults = response.data?.video_results || [];
    
    // CRITICAL FIX: If API returns no results, return an empty array.
    // This allows the frontend to correctly display the "No results" message.
    if (videoResults.length === 0) {
        console.warn(`No live results from SerpApi for category "${category}".`);
        // Fallback to static data if live search yields no results for a specific category
        if (category !== 'All') {
            const filteredFallback = staticFallbackTrends.filter(trend => trend.category.toLowerCase() === category.toLowerCase());
            return filteredFallback.length > 0 ? filteredFallback : [];
        }
        return [];
    }
    
    // If we have results, process them.
    const trends = videoResults.slice(0, 40).map(video => ({
      id: video.video_id,
      title: video.title,
      category: guessCategory(video.title),
      hotness: calculateHotness(video.views),
      excerpt: video.snippet || 'No description available.',
    }));
    
    return trends;

  } catch (error) {
    // CRITICAL FIX: This block handles API failures (e.g., bad key, network error).
    // It falls back to the static data, but FILTERS it by the requested category.
    console.error(`Error fetching trends for category "${category}" from SerpApi. Falling back to static data. Error:`, error.response?.data?.error || error.message);
    
    if (category === 'All') {
        return staticFallbackTrends;
    } else {
        const filteredFallback = staticFallbackTrends.filter(trend => trend.category.toLowerCase() === category.toLowerCase());
        // If the static data has nothing for that category, return empty array
        return filteredFallback.length > 0 ? filteredFallback : [];
    }
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

// --- New logic for Trend-Channel Fit Analysis ---

// IMPORTANT: Storing API keys in code is insecure for production.
// This should be an environment variable. Using it here for project consistency.
const YOUTUBE_API_KEY = "AIzaSyAFXOKE8qMD6tECr9A9JT9OMPKFcrQIvp4";

async function fetchChannelIdByHandle(handle) {
  const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${YOUTUBE_API_KEY}`;
  const response = await axios.get(url);
  if (response.data.items && response.data.items.length > 0) {
    return response.data.items[0].id;
  }
  throw new Error("Channel handle not found or invalid.");
}

async function fetchChannelStatistics(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,topicDetails,brandingSettings&id=${channelId}&key=${YOUTUBE_API_KEY}`;
  const response = await axios.get(url);
  if (response.data.items && response.data.items.length > 0) {
    return response.data.items[0];
  }
  throw new Error("Channel statistics not found.");
}


export async function analyzeChannelTrendFit(channelHandleOrId, trend) {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.includes("YOUR_API_KEY")) {
    throw new Error("YouTube API Key is not configured correctly.");
  }
  if (!channelHandleOrId || !trend) {
      throw new Error("Channel information and trend data are required for analysis.");
  }

  try {
      let channelId = channelHandleOrId.startsWith('UC') ? channelHandleOrId : await fetchChannelIdByHandle(channelHandleOrId);
      const stats = await fetchChannelStatistics(channelId);

      const channelTopics = stats.topicDetails?.topicCategories
          ?.map(tc => tc.split('/').pop().replace(/_/g, ' ')) || [];
      const channelTitle = stats.brandingSettings?.channel?.title || "The channel";
      
      let summary = `**Channel Analysis for "${channelTitle}":** \n`;
      if (channelTopics.length > 0) {
        summary += `The channel's main topics appear to be **${channelTopics.join(', ')}**. `;
      } else {
        summary += `The channel does not have specific topics listed, so we'll analyze based on the trend itself. `;
      }
      
      summary += `\n\n**Trend Fit for "${trend.title}":**\nThis trend is in the **${trend.category}** category. `;

      const isDirectFit = channelTopics.some(topic => topic.toLowerCase().includes(trend.category.toLowerCase()));

      if (isDirectFit) {
          summary += `This is a **Strong Fit**. It aligns perfectly with your existing content themes.`;
          summary += `\n\n**Recommendation:** Adopting this trend could lead to **high engagement** from your core subscribers and reinforce your channel's authority. Focus on integrating your unique voice and style to stand out.`;
      } else {
          summary += `This is a **Potential Growth Opportunity**. It differs from your primary topics.`;
          summary += `\n\n**Recommendation:** Adopting this trend could attract a **new audience segment**. We recommend introducing it as a special episode or a short series to gauge interest from both your current and potential new viewers before committing fully. Monitor your analytics closely for audience retention on this content.`;
      }

      return {
          success: true,
          analysis: summary,
      };

  } catch (error) {
    console.error("Error during channel-trend fit analysis:", error.message);
    // Return a more user-friendly error message
    throw new Error(`Analysis failed: ${error.message}. Please check if the channel handle/ID is correct and public.`);
  }
}
