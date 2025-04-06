import React, { useState, useEffect } from 'react';
import { useComments, Comment as CommentType } from '../../hooks/useComments';
import { useUser } from '@supabase/auth-helpers-react';

type CommentSectionProps = {
  contentId: string;
  className?: string;
};

export function CommentSection({ contentId, className = '' }: CommentSectionProps) {
  const {
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
  } = useComments();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const user = useUser();

  useEffect(() => {
    if (contentId) {
      fetchComments({ contentId });
    }
  }, [contentId, fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment({
      shared_content_id: contentId,
      comment_text: newComment.trim()
    });
    
    setNewComment('');
  };

  const handleSubmitReply = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await addComment({
      shared_content_id: contentId,
      comment_text: replyText.trim(),
      parent_id: parentId
    });
    
    setReplyText('');
    setReplyingTo(null);
  };

  const handleEditSubmit = async (commentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) return;

    const success = await editComment(commentId, editText.trim());
    if (success) {
      setEditingComment(null);
      setEditText('');
    }
  };

  const handleStartEditing = (comment: CommentType) => {
    setEditingComment(comment.id);
    setEditText(comment.comment_text);
  };

  const handleToggleReply = (commentId: string | null) => {
    setReplyingTo(commentId);
    setReplyText('');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId);
    }
  };

  const handleReaction = async (commentId: string, reactionType: string) => {
    await toggleReaction(commentId, reactionType);
  };

  const handleLoadReplies = async (commentId: string) => {
    await fetchReplies(commentId);
  };

  const handleReportComment = async (commentId: string) => {
    const reason = prompt('Please provide a reason for reporting this comment:');
    if (reason) {
      const success = await reportComment(commentId, reason);
      if (success) {
        alert('Comment has been reported to moderators. Thank you for helping keep our community safe.');
      }
    }
  };

  if (error) {
    return <div className="text-red-500">Error loading comments: {error.message}</div>;
  }

  return (
    <div className={`mt-8 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Comments ({totalCount})</h3>
      
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            className="w-full p-3 border rounded-lg resize-none focus:ring focus:ring-blue-200 focus:border-blue-500"
            rows={3}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={!newComment.trim() || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p>Please sign in to leave a comment.</p>
        </div>
      )}

      {loading && !comments.length ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse">Loading comments...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isEditing={editingComment === comment.id}
              isReplying={replyingTo === comment.id}
              editText={editText}
              replyText={replyText}
              replies={replyComments[comment.id] || []}
              onStartEditing={handleStartEditing}
              onEditSubmit={(e) => handleEditSubmit(comment.id, e)}
              onEditTextChange={setEditText}
              onReplyToggle={() => handleToggleReply(comment.id)}
              onReplySubmit={(e) => handleSubmitReply(comment.id, e)}
              onReplyTextChange={setReplyText}
              onDelete={() => handleDeleteComment(comment.id)}
              onReaction={(type) => handleReaction(comment.id, type)}
              onLoadReplies={() => handleLoadReplies(comment.id)}
              onReport={() => handleReportComment(comment.id)}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}

      {!loading && comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
}

type CommentItemProps = {
  comment: CommentType;
  isEditing: boolean;
  isReplying: boolean;
  editText: string;
  replyText: string;
  replies: CommentType[];
  onStartEditing: (comment: CommentType) => void;
  onEditSubmit: (e: React.FormEvent) => void;
  onEditTextChange: (value: string) => void;
  onReplyToggle: () => void;
  onReplySubmit: (e: React.FormEvent) => void;
  onReplyTextChange: (value: string) => void;
  onDelete: () => void;
  onReaction: (type: string) => void;
  onLoadReplies: () => void;
  onReport: () => void;
  currentUserId?: string;
};

function CommentItem({
  comment,
  isEditing,
  isReplying,
  editText,
  replyText,
  replies,
  onStartEditing,
  onEditSubmit,
  onEditTextChange,
  onReplyToggle,
  onReplySubmit,
  onReplyTextChange,
  onDelete,
  onReaction,
  onLoadReplies,
  onReport,
  currentUserId
}: CommentItemProps) {
  const [repliesVisible, setRepliesVisible] = useState(false);
  const isAuthor = currentUserId === comment.user_id;
  const formattedDate = new Date(comment.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const hasLiked = comment.user_reactions?.includes('like');
  const likeCount = (comment.reaction_counts?.like || 0);

  const toggleReplies = () => {
    if (!repliesVisible) {
      onLoadReplies();
    }
    setRepliesVisible(!repliesVisible);
  };

  return (
    <div className="border-l-2 pl-4 py-2">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
          {comment.user?.avatar_url ? (
            <img 
              src={comment.user.avatar_url} 
              alt={comment.user?.full_name || 'User'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              {(comment.user?.full_name || 'U').charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h4 className="font-medium">{comment.user?.full_name || 'Anonymous'}</h4>
            <span className="text-sm text-gray-500">{formattedDate}</span>
            {comment.is_edited && <span className="text-xs text-gray-500">(edited)</span>}
          </div>
          
          {isEditing ? (
            <form onSubmit={onEditSubmit} className="mt-2">
              <textarea
                className="w-full p-2 border rounded-lg resize-none focus:ring focus:ring-blue-200"
                rows={3}
                value={editText}
                onChange={(e) => onEditTextChange(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-2 gap-2">
                <button 
                  type="button" 
                  onClick={() => onEditTextChange('')}
                  className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!editText.trim()}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-1">{comment.comment_text}</p>
          )}
          
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => onReaction('like')}
              className={`text-sm flex items-center gap-1 ${hasLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            >
              {hasLiked ? '❤️' : '🤍'} {likeCount > 0 && likeCount}
            </button>
            
            <button 
              onClick={onReplyToggle}
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Reply
            </button>
            
            {replies.length > 0 && (
              <button 
                onClick={toggleReplies}
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                {repliesVisible ? 'Hide replies' : `View replies (${replies.length})`}
              </button>
            )}
            
            {isAuthor && (
              <>
                <button 
                  onClick={() => onStartEditing(comment)}
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Edit
                </button>
                
                <button 
                  onClick={onDelete}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Delete
                </button>
              </>
            )}
            
            {!isAuthor && currentUserId && (
              <button 
                onClick={onReport}
                className="text-sm text-gray-500 hover:text-orange-600"
              >
                Report
              </button>
            )}
          </div>
          
          {isReplying && (
            <form onSubmit={onReplySubmit} className="mt-3">
              <textarea
                className="w-full p-2 border rounded-lg resize-none focus:ring focus:ring-blue-200"
                rows={2}
                placeholder={`Reply to ${comment.user?.full_name || 'this comment'}...`}
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-2 gap-2">
                <button 
                  type="button" 
                  onClick={onReplyToggle}
                  className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!replyText.trim()}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Reply
                </button>
              </div>
            </form>
          )}
          
          {repliesVisible && replies.length > 0 && (
            <div className="mt-3 space-y-4 ml-2">
              {replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isEditing={isEditing && editText === reply.id}
                  isReplying={false} // No nested replies for simplicity
                  editText={editText}
                  replyText=""
                  replies={[]}
                  onStartEditing={onStartEditing}
                  onEditSubmit={(e) => onEditSubmit(e)}
                  onEditTextChange={onEditTextChange}
                  onReplyToggle={() => {}} // No nested replies
                  onReplySubmit={() => {}} // No nested replies
                  onReplyTextChange={() => {}} // No nested replies
                  onDelete={() => onDelete()}
                  onReaction={(type) => onReaction(type)}
                  onLoadReplies={() => {}} // No nested replies
                  onReport={onReport}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 