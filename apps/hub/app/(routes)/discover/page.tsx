import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Post } from '@neothink/ui';

export const dynamic = 'force-dynamic';

export default async function DiscoverPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: posts } = await supabase
    .rpc('get_recent_posts', {
      p_visibility: 'public',
      p_limit: 20,
      p_offset: 0
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Discover</h1>
      
      {session && (
        <div className="mb-8">
          <Post
            userId={session.user.id}
            supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
            supabaseKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
          />
        </div>
      )}

      <div className="space-y-6">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-lg border bg-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {post.author_avatar && (
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-medium">{post.author_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {post.token_tag && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {post.token_tag}
                </span>
              )}
            </div>
            <p className="text-lg">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 