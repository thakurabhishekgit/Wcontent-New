
'use server';
import axios from 'axios';
import { generateTrendArticle } from '@/ai/flows/generate-trend-article-flow';
import { ai } from '@/ai/ai-instance'; // Import the AI instance

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
async function fetchChannelIdByHandle(handle) {
  const YOUTUBE_API_KEY = "AIzaSyCoPHVrt3lWUR_cbbRINh91GHzBFgcKl78";
  const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
  // Note: forHandle is deprecated. A more modern approach uses the Search API.
  // Using forUsername as a more common, albeit also older, alternative.
  const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${cleanHandle}&key=${YOUTUBE_API_KEY}`;
  const response = await axios.get(url);
  if (response.data.items && response.data.items.length > 0) {
    return response.data.items[0].id;
  }
   // Fallback search by ID if handle search fails
   const searchByIdUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${cleanHandle}&type=channel&key=${YOUTUBE_API_KEY}`;
   const searchResponse = await axios.get(searchByIdUrl);
   if (searchResponse.data.items && searchResponse.data.items.length > 0) {
     return searchResponse.data.items[0].snippet.channelId;
   }

  throw new Error("Channel handle not found or invalid.");
}

async function fetchChannelStatistics(channelId) {
  const YOUTUBE_API_KEY = "AIzaSyCoPHVrt3lWUR_cbbRINh91GHzBFgcKl78";
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,topicDetails,brandingSettings,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
  const response = await axios.get(url);
  if (response.data.items && response.data.items.length > 0) {
    return response.data.items[0];
  }
  throw new Error("Channel statistics not found.");
}


export async function analyzeChannelTrendFit(channelHandleOrId, trend) {
  const YOUTUBE_API_KEY = "AIzaSyCoPHVrt3lWUR_cbbRINh91GHzBFgcKl78";
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API Key is not configured correctly on the server.");
  }
  if (!channelHandleOrId || !trend) {
      throw new Error("Channel information and trend data are required for analysis.");
  }

  try {
      let channelId = channelHandleOrId.startsWith('UC') ? channelHandleOrId : await fetchChannelIdByHandle(channelHandleOrId);
      const stats = await fetchChannelStatistics(channelId);

      const channelInfo = {
          title: stats.brandingSettings?.channel?.title || 'The channel',
          description: stats.snippet?.description || 'No description provided.',
          subscriberCount: stats.statistics?.subscriberCount || 'N/A',
          videoCount: stats.statistics?.videoCount || 'N/A',
          topics: stats.topicDetails?.topicCategories?.map(tc => tc.split('/').pop().replace(/_/g, ' ')) || []
      };

      const prompt = `
        You are a YouTube content strategy expert. Analyze the fit between a creator's channel and a specific content trend.

        **Creator's Channel Profile:**
        - **Channel Name:** ${channelInfo.title}
        - **Subscribers:** ${channelInfo.subscriberCount}
        - **Total Videos:** ${channelInfo.videoCount}
        - **Channel Description:** "${channelInfo.description}"
        - **Identified Topics:** ${channelInfo.topics.join(', ') || 'General'}

        **Content Trend to Analyze:**
        - **Trend Title:** "${trend.title}"
        - **Trend Category:** ${trend.category}
        - **Trend Description:** "${trend.excerpt}"

        **Your Task:**
        Provide a detailed analysis in the following format. Use Markdown for formatting.

        **Fit Score:** [Give a score out of 10, where 1 is a terrible fit and 10 is a perfect match.]

        **Reasoning:** [Write a 2-3 sentence paragraph explaining your score. Consider the alignment of the trend's category with the channel's identified topics and description. Mention if it's a natural fit or a pivot.]

        **Actionable Suggestions:** [Provide a bulleted list of 2-3 specific, actionable tips for this creator to successfully adapt this trend for their channel. Be creative and strategic.]
        - **Tip 1:** ...
        - **Tip 2:** ...
        - **Tip 3:** ...
      `;
      
      const llmResponse = await ai.generate({ prompt });

      if (!llmResponse.text) {
          throw new Error("The AI failed to generate an analysis.");
      }

      return {
          success: true,
          analysis: llmResponse.text,
      };

  } catch (error) {
    console.error("Error during channel-trend fit analysis:", error.message);
    // Return a more user-friendly error message
    throw new Error(`Analysis failed: ${error.message}. Please check if the channel handle/ID is correct and public.`);
  }
}
