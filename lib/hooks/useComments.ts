import { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useTenant } from '../context/TenantContext';
import { useAnalytics } from './useAnalytics';
import { PostgrestError } from '@supabase/supabase-js';

export type Comment = {
  id: string;
  shared_content_id: string;
  user_id: string;
  tenant_slug: string;
  parent_id: string | null;
  comment_text: string;
  is_edited: boolean;
  is_deleted: boolean;
  is_hidden: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined fields
  user?: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
  };
  replies?: Comment[];
  reaction_counts?: Record<string, number>;
  user_reactions?: string[];
};

export type CommentReaction = {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
};

type CommentInput = {
  shared_content_id: string;
  comment_text: string;
  parent_id?: string | null;
  metadata?: Record<string, any>;
};

type CommentFilter = {
  contentId: string;
  parentId?: string | null;
  limit?: number;
  offset?: number;
};

/**
 * Hook for managing comments on shared content
 */
export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyComments, setReplyComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const supabase = useSupabaseClient();
  const user = useUser();
  const { currentTenant } = useTenant();
  const { trackContentInteraction } = useAnalytics();
  
  /**
   * Fetch comments for a specific content
   */
  const fetchComments = useCallback(async ({
    contentId,
    parentId = null,
    limit = 25,
    offset = 0
  }: CommentFilter) => {
    if (!currentTenant?.slug || !contentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('content_comments')
        .select(`
          *,
          user:user_id (
            id,
            email,
            full_name,
            avatar_url
          ),
          _count:count() OVER()
        `, { count: 'exact' })
        .eq('shared_content_id', contentId)
        .eq('tenant_slug', currentTenant.slug)
        .eq('is_deleted', false);
      
      // Filter by parent_id for threads
      if (parentId === null) {
        query = query.is('parent_id', null);
      } else {
        query = query.eq('parent_id', parentId);
      }
      
      // Order by newest first
      query = query.order('created_at', { ascending: false });
      
      // Pagination
      query = query.range(offset, offset + limit - 1);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error fetching comments:', error);
        setError(error);
        return;
      }
      
      if (!data) {
        setComments([]);
        setTotalCount(0);
        return;
      }
      
      // Set total count
      setTotalCount(count || 0);
      
      // Fetch reaction counts for all comments
      const commentsWithReactions = await Promise.all(
        data.map(async (comment) => {
          const { data: reactionCounts } = await supabase
            .rpc('get_comment_reaction_counts', { comment_id: comment.id });
          
          // Get user's reactions to this comment
          const { data: userReactions } = await supabase
            .from('comment_reactions')
            .select('reaction_type')
            .eq('comment_id', comment.id)
            .eq('user_id', user?.id || '');
          
          return {
            ...comment,
            reaction_counts: reactionCounts || {},
            user_reactions: userReactions?.map(r => r.reaction_type) || []
          };
        })
      );
      
      if (parentId === null) {
        setComments(commentsWithReactions);
      } else {
        setReplyComments(prev => ({
          ...prev,
          [parentId]: commentsWithReactions
        }));
      }
    } catch (err) {
      console.error('Error in fetchComments:', err);
      setError(err as PostgrestError);
    } finally {
      setLoading(false);
    }
  }, [supabase, currentTenant, user]);
  
  /**
   * Fetch replies for a specific comment
   */
  const fetchReplies = useCallback(async (commentId: string) => {
    await fetchComments({
      contentId: comments.find(c => c.id === commentId)?.shared_content_id || '',
      parentId: commentId
    });
  }, [fetchComments, comments]);
  
  /**
   * Add a new comment
   */
  const addComment = useCallback(async ({
    shared_content_id,
    comment_text,
    parent_id = null,
    metadata = {}
  }: CommentInput) => {
    if (!currentTenant?.slug || !user) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      // Insert the comment
      const { data, error } = await supabase
        .from('content_comments')
        .insert({
          shared_content_id,
          user_id: user.id,
          tenant_slug: currentTenant.slug,
          parent_id,
          comment_text,
          metadata
        })
        .select(`
          *,
          user:user_id (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .single();
      
      if (error) {
        console.error('Error adding comment:', error);
        setError(error);
        return null;
      }
      
      // Track the comment event
      trackContentInteraction({
        event: 'comment_created',
        content_id: shared_content_id,
        properties: {
          comment_id: data.id,
          is_reply: !!parent_id
        }
      });
      
      // Add the new comment to state
      const newComment = {
        ...data,
        reaction_counts: {},
        user_reactions: []
      };
      
      if (parent_id) {
        // Add to replies
        setReplyComments(prev => ({
          ...prev,
          [parent_id]: [newComment, ...(prev[parent_id] || [])]
        }));
      } else {
        // Add to main comments
        setComments(prev => [newComment, ...prev]);
        setTotalCount(prev => prev + 1);
      }
      
      return newComment;
    } catch (err) {
      console.error('Error in addComment:', err);
      setError(err as PostgrestError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase, currentTenant, user, trackContentInteraction]);
  
  /**
   * Edit an existing comment
   */
  const editComment = useCallback(async (
    commentId: string,
    commentText: string
  ) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      // First get the comment to check if it belongs to the user
      const { data: comment, error: fetchError } = await supabase
        .from('content_comments')
        .select('id, parent_id, user_id')
        .eq('id', commentId)
        .single();
      
      if (fetchError || !comment) {
        console.error('Error fetching comment for edit:', fetchError);
        setError(fetchError);
        return false;
      }
      
      // Check if the user owns the comment
      if (comment.user_id !== user.id) {
        setError({
          message: 'You can only edit your own comments',
          details: '',
          hint: '',
          code: 'PERMISSION_DENIED'
        });
        return false;
      }
      
      // Update the comment
      const { error: updateError } = await supabase
        .from('content_comments')
        .update({
          comment_text: commentText,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId);
      
      if (updateError) {
        console.error('Error updating comment:', updateError);
        setError(updateError);
        return false;
      }
      
      // Update the comment in state
      if (comment.parent_id) {
        // Update in replies
        setReplyComments(prev => {
          const parentReplies = prev[comment.parent_id] || [];
          return {
            ...prev,
            [comment.parent_id]: parentReplies.map(reply => 
              reply.id === commentId 
                ? { ...reply, comment_text: commentText, is_edited: true, updated_at: new Date().toISOString() }
                : reply
            )
          };
        });
      } else {
        // Update in main comments
        setComments(prev => 
          prev.map(c => 
            c.id === commentId 
              ? { ...c, comment_text: commentText, is_edited: true, updated_at: new Date().toISOString() }
              : c
          )
        );
      }
      
      return true;
    } catch (err) {
      console.error('Error in editComment:', err);
      setError(err as PostgrestError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);
  
  /**
   * Delete a comment (soft delete)
   */
  const deleteComment = useCallback(async (commentId: string) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      // First get the comment to check if it belongs to the user
      const { data: comment, error: fetchError } = await supabase
        .from('content_comments')
        .select('id, parent_id, user_id, shared_content_id')
        .eq('id', commentId)
        .single();
      
      if (fetchError || !comment) {
        console.error('Error fetching comment for deletion:', fetchError);
        setError(fetchError);
        return false;
      }
      
      // Check if the user owns the comment
      if (comment.user_id !== user.id) {
        setError({
          message: 'You can only delete your own comments',
          details: '',
          hint: '',
          code: 'PERMISSION_DENIED'
        });
        return false;
      }
      
      // Soft delete the comment
      const { error: updateError } = await supabase
        .from('content_comments')
        .update({
          is_deleted: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId);
      
      if (updateError) {
        console.error('Error deleting comment:', updateError);
        setError(updateError);
        return false;
      }
      
      // Track the delete event
      trackContentInteraction({
        event: 'comment_deleted',
        content_id: comment.shared_content_id,
        properties: {
          comment_id: commentId
        }
      });
      
      // Remove the comment from state
      if (comment.parent_id) {
        // Remove from replies
        setReplyComments(prev => {
          const parentReplies = prev[comment.parent_id] || [];
          return {
            ...prev,
            [comment.parent_id]: parentReplies.filter(reply => reply.id !== commentId)
          };
        });
      } else {
        // Remove from main comments
        setComments(prev => prev.filter(c => c.id !== commentId));
        setTotalCount(prev => prev - 1);
      }
      
      return true;
    } catch (err) {
      console.error('Error in deleteComment:', err);
      setError(err as PostgrestError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase, user, trackContentInteraction]);
  
  /**
   * Toggle a reaction on a comment
   */
  const toggleReaction = useCallback(async (
    commentId: string,
    reactionType: string
  ) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if the user already has this reaction
      const { data: existingReaction, error: fetchError } = await supabase
        .from('comment_reactions')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error checking existing reaction:', fetchError);
        setError(fetchError);
        return false;
      }
      
      // If the reaction exists, delete it (toggle off)
      if (existingReaction) {
        const { error: deleteError } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('id', existingReaction.id);
        
        if (deleteError) {
          console.error('Error removing reaction:', deleteError);
          setError(deleteError);
          return false;
        }
        
        // Update state to remove the reaction
        updateReactionInState(commentId, reactionType, false);
        return true;
      }
      
      // Otherwise, add the reaction (toggle on)
      const { error: insertError } = await supabase
        .from('comment_reactions')
        .insert({
          comment_id: commentId,
          user_id: user.id,
          reaction_type: reactionType
        });
      
      if (insertError) {
        console.error('Error adding reaction:', insertError);
        setError(insertError);
        return false;
      }
      
      // Update state to add the reaction
      updateReactionInState(commentId, reactionType, true);
      return true;
    } catch (err) {
      console.error('Error in toggleReaction:', err);
      setError(err as PostgrestError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);
  
  /**
   * Helper function to update reaction in state
   */
  const updateReactionInState = useCallback((
    commentId: string,
    reactionType: string,
    isAdding: boolean
  ) => {
    // Find which array contains the comment
    const mainComment = comments.find(c => c.id === commentId);
    
    if (mainComment) {
      // Update in main comments
      setComments(prev => 
        prev.map(c => {
          if (c.id !== commentId) return c;
          
          // Update reaction counts
          const newReactionCounts = { ...(c.reaction_counts || {}) };
          const currentCount = newReactionCounts[reactionType] || 0;
          
          if (isAdding) {
            newReactionCounts[reactionType] = currentCount + 1;
          } else if (currentCount > 0) {
            newReactionCounts[reactionType] = currentCount - 1;
          }
          
          // Update user reactions
          let newUserReactions = [...(c.user_reactions || [])];
          
          if (isAdding) {
            if (!newUserReactions.includes(reactionType)) {
              newUserReactions.push(reactionType);
            }
          } else {
            newUserReactions = newUserReactions.filter(r => r !== reactionType);
          }
          
          return {
            ...c,
            reaction_counts: newReactionCounts,
            user_reactions: newUserReactions
          };
        })
      );
      return;
    }
    
    // Check in replies
    for (const [parentId, replies] of Object.entries(replyComments)) {
      const replyComment = replies.find(r => r.id === commentId);
      
      if (replyComment) {
        // Update in replies
        setReplyComments(prev => {
          const updatedReplies = prev[parentId].map(r => {
            if (r.id !== commentId) return r;
            
            // Update reaction counts
            const newReactionCounts = { ...(r.reaction_counts || {}) };
            const currentCount = newReactionCounts[reactionType] || 0;
            
            if (isAdding) {
              newReactionCounts[reactionType] = currentCount + 1;
            } else if (currentCount > 0) {
              newReactionCounts[reactionType] = currentCount - 1;
            }
            
            // Update user reactions
            let newUserReactions = [...(r.user_reactions || [])];
            
            if (isAdding) {
              if (!newUserReactions.includes(reactionType)) {
                newUserReactions.push(reactionType);
              }
            } else {
              newUserReactions = newUserReactions.filter(r => r !== reactionType);
            }
            
            return {
              ...r,
              reaction_counts: newReactionCounts,
              user_reactions: newUserReactions
            };
          });
          
          return {
            ...prev,
            [parentId]: updatedReplies
          };
        });
        return;
      }
    }
  }, [comments, replyComments]);
  
  /**
   * Report a comment for moderation
   */
  const reportComment = useCallback(async (
    commentId: string,
    reason: string
  ) => {
    if (!user || !currentTenant) return false;
    
    try {
      // Create a notification for moderators
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id, // This will be updated by a trigger to appropriate moderators
          tenant_slug: currentTenant.slug,
          platform_id: currentTenant.slug,
          title: 'Comment Reported',
          message: `A comment has been reported. Reason: ${reason}`,
          type: 'warning',
          metadata: {
            comment_id: commentId,
            reporter_id: user.id,
            reason: reason,
            type: 'comment_report'
          }
        });
      
      if (error) {
        console.error('Error reporting comment:', error);
        setError(error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in reportComment:', err);
      setError(err as PostgrestError);
      return false;
    }
  }, [supabase, user, currentTenant]);
  
  return {
    comments,
    replyComments,
    loading,
    error,
    totalCount,
    fetchComments,
    fetchReplies,
    addComment,
    editComment,
    deleteComment,
    toggleReaction,
    reportComment
  };
} 