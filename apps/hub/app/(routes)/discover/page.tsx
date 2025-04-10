'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartIcon, MessageCircleIcon, ShareIcon, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TOKEN_COLORS = {
  LUCK: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  LIVE: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
  LOVE: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
  LIFE: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
};

const TOKEN_GRADIENTS = {
  LUCK: 'bg-gradient-to-r from-blue-500 to-indigo-500',
  LIVE: 'bg-gradient-to-r from-emerald-500 to-green-500',
  LOVE: 'bg-gradient-to-r from-rose-500 to-pink-500',
  LIFE: 'bg-gradient-to-r from-amber-500 to-yellow-500',
};

type Post = {
  id: string;
  content: string;
  author_id: string;
  platform: string;
  section: string | null;
  token_tag: string | null;
  is_pinned: boolean | null;
  engagement_count: number | null;
  created_at: string;
  updated_at: string;
  reward_processed: boolean | null;
  author?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export default function DiscoverPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenFilter, setTokenFilter] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTokenTag, setNewPostTokenTag] = useState<string>('LUCK');
  const [submitting, setSubmitting] = useState(false);
  const [postPrompt, setPostPrompt] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  // AI-driven post prompts
  const tokenPrompts = {
    LUCK: "What's a lucky insight you've had recently?",
    LIVE: "How are you embodying vitality today?",
    LOVE: "Share a loving connection you've experienced this week.",
    LIFE: "What profound life observation has struck you lately?",
  };

  useEffect(() => {
    setPostPrompt(tokenPrompts[newPostTokenTag as keyof typeof tokenPrompts]);
  }, [newPostTokenTag]);

  useEffect(() => {
    fetchPosts();
    
    // Set up real-time subscription for new posts
    const channel = supabase
      .channel('posts_realtime')
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'posts',
        filter: 'platform=eq.hub',
      }, (payload) => {
        console.log('Real-time update received:', payload);
        if (payload.eventType === 'INSERT') {
          fetchPostWithAuthor(payload.new.id).then(newPost => {
            if (newPost) {
              setPosts(prevPosts => [newPost, ...prevPosts]);
            }
          });
        } else if (payload.eventType === 'UPDATE') {
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === payload.new.id ? { ...post, ...payload.new } : post
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setPosts(prevPosts => prevPosts.filter(post => post.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, tokenFilter]);

  async function fetchPostWithAuthor(postId: string): Promise<Post | null> {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:author_id(
            full_name,
            avatar_url
          )
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;
      return post as Post;
    } catch (error) {
      console.error('Error fetching post with author:', error);
      return null;
    }
  }

  async function fetchPosts() {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:author_id(
            full_name,
            avatar_url
          )
        `)
        .eq('platform', 'hub')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20);

      if (tokenFilter) {
        query = query.eq('token_tag', tokenFilter);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPosts(data as Post[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePost() {
    if (!newPostContent.trim()) return;

    try {
      setSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPostContent,
          author_id: user.id,
          platform: 'hub',
          token_tag: newPostTokenTag,
          engagement_count: 0,
        })
        .select();

      if (error) throw error;

      setNewPostContent('');
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLike(postId: string) {
    try {
      const { data: post } = await supabase
        .from('posts')
        .select('engagement_count')
        .eq('id', postId)
        .single();

      if (!post) return;

      const newCount = (post.engagement_count || 0) + 1;

      await supabase
        .from('posts')
        .update({ engagement_count: newCount })
        .eq('id', postId);

      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId 
            ? { ...p, engagement_count: newCount } 
            : p
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  function getInitials(name: string | null) {
    if (!name) return 'NN';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Insights</h1>
        <p className="text-muted-foreground">
          Share your thoughts, connect with like-minded thinkers, and earn tokens
        </p>
      </div>

      {/* New Post Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Share an Insight</CardTitle>
          <CardDescription>{postPrompt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-between items-center">
              <Select 
                value={newPostTokenTag} 
                onValueChange={setNewPostTokenTag}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LUCK">LUCK Token</SelectItem>
                  <SelectItem value="LIVE">LIVE Token</SelectItem>
                  <SelectItem value="LOVE">LOVE Token</SelectItem>
                  <SelectItem value="LIFE">LIFE Token</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleCreatePost} 
                disabled={!newPostContent.trim() || submitting}
                className={`${TOKEN_GRADIENTS[newPostTokenTag as keyof typeof TOKEN_GRADIENTS]} text-white`}
              >
                {submitting ? 'Posting...' : 'Post Insight'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all" onClick={() => setTokenFilter(null)}>
            All
          </TabsTrigger>
          <TabsTrigger 
            value="LUCK" 
            onClick={() => setTokenFilter('LUCK')}
            className="text-blue-600"
          >
            LUCK
          </TabsTrigger>
          <TabsTrigger 
            value="LIVE" 
            onClick={() => setTokenFilter('LIVE')}
            className="text-emerald-600"
          >
            LIVE
          </TabsTrigger>
          <TabsTrigger 
            value="LOVE" 
            onClick={() => setTokenFilter('LOVE')}
            className="text-rose-600"
          >
            LOVE
          </TabsTrigger>
          <TabsTrigger 
            value="LIFE" 
            onClick={() => setTokenFilter('LIFE')}
            className="text-amber-600"
          >
            LIFE
          </TabsTrigger>
        </TabsList>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {tokenFilter ? `${tokenFilter} Insights` : 'Latest Insights'}
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPosts}
            aria-label="Refresh posts"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground text-center mb-4">
                    No insights found. Be the first to share!
                  </p>
                  <Button 
                    onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  >
                    Create Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    {post.is_pinned && (
                      <div className="bg-muted px-4 py-1 text-xs font-medium">
                        📌 Pinned Insight
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={post.author?.avatar_url || ''} alt={post.author?.full_name || 'User'} />
                          <AvatarFallback>{getInitials(post.author?.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{post.author?.full_name || 'Neothink Member'}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                        </div>
                        {post.token_tag && (
                          <Badge className={`ml-auto ${TOKEN_COLORS[post.token_tag as keyof typeof TOKEN_COLORS]}`}>
                            {post.token_tag}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{post.content}</p>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 px-6 py-3">
                      <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)} aria-label="Like post" className="gap-1">
                          <HeartIcon className="h-4 w-4 text-rose-500" />
                          <span>{post.engagement_count || 0}</span>
                        </Button>
                        <Button variant="ghost" size="sm" aria-label="Comment on post" className="gap-1">
                          <MessageCircleIcon className="h-4 w-4" />
                          <span>Comment</span>
                        </Button>
                        <Button variant="ghost" size="sm" aria-label="Share post" className="gap-1">
                          <ShareIcon className="h-4 w-4" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}
      </Tabs>
    </div>
  );
} 