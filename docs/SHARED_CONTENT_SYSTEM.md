# Shared Content System

## Overview

The Shared Content System allows content to be created once and distributed across multiple platforms in the Neothink ecosystem. This system is a core feature that provides significant business value by:

1. **Reducing content duplication** - Create content once, share everywhere
2. **Supporting platform customization** - Each platform can customize shared content
3. **Centralizing content governance** - Manage content from a single place
4. **Providing content analytics** - Track performance across platforms

## Architecture

The system follows a "write once, customize everywhere" architecture:

```
┌─────────────────┐
│ Shared Content  │◄───── Created by content authors
└────────┬────────┘
         │
         │ shared_content_id
         ▼
┌─────────────────┐
│ Tenant Content  │◄───── Platform-specific customizations
└────────┬────────┘
         │
         │ tenant_slug
         ▼
┌─────────────────┐
│    Platform     │◄───── Displayed to end users
└─────────────────┘
```

### Database Schema

The system is built on these primary tables:

1. **shared_content**: Base content that can be shared
2. **tenant_content**: Platform-specific customizations
3. **content_categories**: Organization system for content
4. **content_reactions**: User engagement tracking (likes, bookmarks, shares)
5. **content_views**: Performance analytics

### Security Model

The system implements a multi-layered security approach:

- Row-Level Security (RLS) policies ensure proper data isolation
- Platform-specific access controls determine who can view, create, and edit content
- Guardian role allows cross-platform content management

## Usage

### For Content Creators

Content creators can publish once and distribute content across multiple platforms:

```tsx
import { createSharedContent, shareContentWithTenant } from '@lib/shared';

// Create shared content
const contentId = await createSharedContent({
  title: "New Research Findings",
  slug: "new-research-findings",
  summary: "A summary of our latest research",
  content: { body: "Detailed content here..." },
  contentType: "article",
  authorId: currentUser.id
});

// Share with multiple platforms
await shareContentWithTenant({
  sharedContentId: contentId,
  tenantSlug: "ascenders",
  isFeatured: true
});

await shareContentWithTenant({
  sharedContentId: contentId,
  tenantSlug: "neothinkers",
  customTitle: "Innovative Research Breakthroughs",
  isFeatured: false
});
```

### For Frontend Developers

Frontend developers can use the `useSharedContent` hook to display content:

```tsx
import { useSharedContent } from '@lib/shared';

function ContentFeed() {
  const {
    content,
    featuredContent,
    categories,
    loading,
    loadContent
  } = useSharedContent();
  
  useEffect(() => {
    loadContent({
      contentType: 'article',
      limit: 10
    });
  }, [loadContent]);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {content.map(item => (
        <ContentCard key={item.id} content={item} />
      ))}
    </div>
  );
}
```

### For Platform Administrators

Platform administrators can customize how shared content appears on their platform:

```tsx
import { shareContentWithTenant, getSharedContentById } from '@lib/shared';

async function customizeContent(contentId, tenantSlug) {
  // Get original content
  const content = await getSharedContentById(contentId);
  
  // Customize for this platform
  await shareContentWithTenant({
    sharedContentId: contentId,
    tenantSlug: tenantSlug,
    customTitle: "Platform-specific title",
    customSummary: "Platform-specific summary",
    customPrimaryImageUrl: "/platform-specific-image.jpg",
    categoryIds: ["category-1", "category-2"],
    isFeatured: true
  });
}
```

## Content Categories

Content can be organized into categories that are specific to each platform:

```tsx
import { createContentCategory, getContentCategoriesForTenant } from '@lib/shared';

// Create a category
await createContentCategory({
  name: "Research",
  slug: "research",
  description: "Scientific research and findings",
  tenantSlug: "immortals",
  displayOrder: 1
});

// Get categories for a platform
const categories = await getContentCategoriesForTenant("immortals");
```

## Analytics & User Engagement

The system tracks user engagement and provides analytics:

```tsx
import { useSharedContent } from '@lib/shared';

function ContentDetail({ contentId }) {
  const {
    getContentById,
    recordContentView,
    handleContentReaction,
    hasUserReacted,
    getReactionCounts,
    updateReadProgress
  } = useSharedContent();
  
  // Record reading progress
  useEffect(() => {
    const timer = setInterval(() => {
      const scrollPercentage = calculateScrollPercentage();
      updateReadProgress(contentId, scrollPercentage, readDuration);
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(timer);
  }, [contentId, updateReadProgress]);
  
  // User can like/bookmark content
  function handleLike() {
    handleContentReaction(contentId, 'like');
  }
  
  // Check if user has already liked
  const hasLiked = hasUserReacted(contentId, 'like');
  
  // ...rest of component
}
```

## Best Practices

### Content Creation

1. **Use descriptive slugs** - They should be unique and SEO-friendly
2. **Optimize images** - Use properly sized images to improve loading times
3. **Structure content** - Use consistent JSON structure for different content types
4. **Target audience** - Consider which platforms the content is appropriate for

### Content Distribution

1. **Selective sharing** - Not all content needs to be on all platforms
2. **Customization** - Take time to customize content for each platform's audience
3. **Featured content** - Rotate featured content regularly to keep platforms fresh
4. **Categories** - Use a consistent category system within each platform

### Technical Guidelines

1. **Pagination** - Always paginate content listings to maintain performance
2. **Error handling** - Implement proper error handling for content fetching
3. **Optimistic UI** - Use optimistic updates for reactions to improve UX
4. **Caching** - Implement appropriate caching strategies

## Implementation Examples

### Content Feed Page

```tsx
import { useSharedContent } from '@lib/shared';

function ContentFeed() {
  const { content, loading, loadContent } = useSharedContent();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  
  useEffect(() => {
    loadContent({
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE
    });
  }, [page, loadContent]);
  
  return (
    <div>
      {content.map(item => (
        <ContentCard 
          key={item.id} 
          content={item} 
        />
      ))}
      
      <Pagination 
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Content Detail Page

```tsx
import { useSharedContent } from '@lib/shared';
import { useRouter } from 'next/router';

function ContentDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [content, setContent] = useState(null);
  const { getContentBySlug, handleContentReaction } = useSharedContent();
  
  useEffect(() => {
    async function loadContent() {
      if (slug) {
        const contentData = await getContentBySlug(slug as string);
        setContent(contentData);
      }
    }
    
    loadContent();
  }, [slug, getContentBySlug]);
  
  if (!content) return <Loading />;
  
  return (
    <article>
      <h1>{content.title}</h1>
      <div className="content-body">
        {renderContent(content.content)}
      </div>
      
      <div className="engagement">
        <button onClick={() => handleContentReaction(content.id, 'like')}>
          Like
        </button>
        <button onClick={() => handleContentReaction(content.id, 'bookmark')}>
          Bookmark
        </button>
        <button onClick={() => handleContentReaction(content.id, 'share')}>
          Share
        </button>
      </div>
    </article>
  );
}
```

## Migration Path

For platforms transitioning to this shared content system:

1. **Audit existing content** - Identify content that should be migrated
2. **Create migration script** - Convert existing content to the new format
3. **Test across platforms** - Verify content appears correctly on all platforms
4. **Analytics transition** - Preserve historical analytics if possible

## Troubleshooting

Common issues and their solutions:

1. **Content not appearing** - Check tenant_content link and is_enabled flag
2. **Reactions not saving** - Verify user authentication and RLS policies
3. **Categories missing** - Ensure categories exist for the specific tenant
4. **Performance issues** - Review database indexing and query optimization

## Future Enhancements

Planned enhancements to the content system:

1. **Content versioning** - Track changes and allow reverting to previous versions
2. **Scheduled publishing** - Set future publish dates for content
3. **Personalization** - Customize content based on user preferences and behavior
4. **Advanced analytics** - Provide more detailed content performance metrics 