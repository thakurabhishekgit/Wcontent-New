
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, TrendingUp, Search, ArrowRight, Rss } from 'lucide-react';
import { fetchTrendingVideos } from './actions'; // Import server action

const TrendArticleItem = ({ trend, onClick }) => (
  <Card 
    className="w-full hover:shadow-md transition-shadow duration-300 cursor-pointer group" 
    onClick={() => onClick(trend)}
  >
    <CardContent className="p-4 flex items-start gap-4">
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant="secondary">{trend.category}</Badge>
          <div className="flex items-center gap-1" title={`${trend.hotness}/5 Hotness`}>
              {[...Array(trend.hotness)].map((_, i) => <Flame key={i} className="h-4 w-4 text-orange-500 fill-orange-400" />)}
              {[...Array(5 - trend.hotness)].map((_, i) => <Flame key={i} className="h-4 w-4 text-muted-foreground/20" />)}
          </div>
        </div>
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{trend.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{trend.excerpt}</p>
      </div>
       <div className="self-center ml-auto pl-4 hidden sm:block">
         <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
       </div>
    </CardContent>
  </Card>
);

export default function TrendingPage() {
  const [allTrends, setAllTrends] = useState([]);
  const [filteredTrends, setFilteredTrends] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const loadTrends = async (category) => {
      setIsLoading(true);
      setError(null);
      try {
        const trends = await fetchTrendingVideos(category);
        setAllTrends(trends);
        // Dynamically create category list from the new data if it's the initial 'All' fetch
        if (category === 'All') {
            const uniqueCategories = ['All', ...new Set(trends.map(t => t.category))];
            setCategories(uniqueCategories);
        }
      } catch (err) {
        setError(err.message);
        setAllTrends([]);
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    loadTrends(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    let results = [...allTrends];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(t => 
          t.title.toLowerCase().includes(lowerSearch) || 
          t.excerpt.toLowerCase().includes(lowerSearch)
      );
    }
    
    setFilteredTrends(results);
  }, [searchTerm, allTrends]);
  
  const handleTrendClick = (trend) => {
      router.push(`/trending/${trend.id}`);
  };

  return (
    <div className="space-y-12 md:space-y-16 animate-fade-in">
        <section className="text-center py-12 md:py-16 bg-gradient-to-b from-background via-primary/5 to-background">
            <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Content Trends Feed</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover the latest formats, topics, and styles taking over the internet. Powered by live data from India.
            </p>
        </section>

        <section className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col gap-4 mb-8">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search for trends, topics, or formats..." 
                        className="pl-12 pr-4 py-6 text-lg rounded-full shadow-inner bg-muted/50 focus:bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap justify-center gap-2 pb-2">
                    {categories.map(category => (
                        <Button 
                            key={category}
                            variant={activeCategory === category ? 'default' : 'outline'}
                            onClick={() => setActiveCategory(category)}
                            className="rounded-full px-4"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <Card key={i} className="w-full">
                      <CardContent className="p-4 flex items-center gap-4">
                          <div className="flex-grow space-y-2">
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-1/2" />
                          </div>
                      </CardContent>
                    </Card>
                  ))
              ) : error ? (
                <Card className="text-center py-12 border-dashed border-destructive bg-destructive/10 col-span-full">
                    <CardContent className="flex flex-col items-center gap-3">
                        <Rss className="h-12 w-12 text-destructive" />
                        <p className="text-lg text-destructive font-semibold">Failed to load trends</p>
                        <p className="text-sm text-destructive/80">{error}</p>
                    </CardContent>
                </Card>
              ) : filteredTrends.length > 0 ? (
                  filteredTrends.map(trend => <TrendArticleItem key={trend.id} trend={trend} onClick={handleTrendClick} />)
              ) : (
                <Card className="text-center py-12 border-dashed bg-card/50 col-span-full">
                    <CardContent className="flex flex-col items-center gap-3">
                        <Rss className="h-12 w-12 text-muted-foreground" />
                        <p className="text-lg text-muted-foreground">No trends match your criteria.</p>
                        <p className="text-sm text-muted-foreground">Try a different category or search term.</p>
                    </CardContent>
                </Card>
              )}
            </div>
        </section>
    </div>
  );
}
