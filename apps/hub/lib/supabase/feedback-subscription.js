import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
/**
 * Hook for subscribing to real-time feedback updates
 * Optimized for admin dashboards to track feedback status changes
 */
export function useFeedbackSubscription(options) {
    const [feedbackItems, setFeedbackItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    useEffect(() => {
        let channel = null;
        async function initSubscription() {
            try {
                setIsLoading(true);
                // Initial data load
                let query = supabase
                    .from('feedback')
                    .select('*')
                    .order('created_at', { ascending: false });
                // Apply filters
                if (options.appName) {
                    query = query.eq('app_name', options.appName);
                }
                if (options.status) {
                    query = query.eq('status', options.status);
                }
                if (options.userId) {
                    query = query.eq('user_id', options.userId);
                }
                const { data, error: fetchError } = await query;
                if (fetchError) {
                    throw fetchError;
                }
                setFeedbackItems(data);
                // Set up realtime subscription
                let filterString = '';
                if (options.appName) {
                    filterString += `app_name=eq.${options.appName}`;
                }
                if (options.status) {
                    filterString += filterString ? ` AND status=eq.${options.status}` : `status=eq.${options.status}`;
                }
                if (options.userId) {
                    filterString += filterString ? ` AND user_id=eq.${options.userId}` : `user_id=eq.${options.userId}`;
                }
                // Subscribe to INSERT events
                channel = supabase
                    .channel('feedback-updates')
                    .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'feedback',
                    filter: filterString || undefined,
                }, (payload) => {
                    var _a;
                    const newFeedback = payload.new;
                    setFeedbackItems((prev) => [newFeedback, ...prev]);
                    (_a = options.onNewFeedback) === null || _a === void 0 ? void 0 : _a.call(options, newFeedback);
                })
                    .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'feedback',
                    filter: filterString || undefined,
                }, (payload) => {
                    var _a;
                    const updatedFeedback = payload.new;
                    const oldFeedback = payload.old;
                    // Check if status has changed
                    if (oldFeedback.status && updatedFeedback.status !== oldFeedback.status) {
                        (_a = options.onStatusChange) === null || _a === void 0 ? void 0 : _a.call(options, updatedFeedback);
                    }
                    setFeedbackItems((prev) => prev.map((item) => item.id === updatedFeedback.id ? updatedFeedback : item));
                })
                    .subscribe();
            }
            catch (err) {
                console.error('Error setting up feedback subscription:', err);
                setError(err instanceof Error ? err : new Error(String(err)));
            }
            finally {
                setIsLoading(false);
            }
        }
        initSubscription();
        // Cleanup on unmount
        return () => {
            channel === null || channel === void 0 ? void 0 : channel.unsubscribe();
        };
    }, [options.appName, options.status, options.userId, supabase]);
    /**
     * Update feedback status
     */
    const updateFeedbackStatus = async (id, status) => {
        try {
            const { error } = await supabase
                .from('feedback')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error)
                throw error;
            return true;
        }
        catch (err) {
            console.error('Error updating feedback status:', err);
            return false;
        }
    };
    return {
        feedbackItems,
        isLoading,
        error,
        updateFeedbackStatus
    };
}
/**
 * Example usage in an admin dashboard:
 *
 * ```tsx
 * function FeedbackDashboard() {
 *   const { feedbackItems, isLoading, error, updateFeedbackStatus } = useFeedbackSubscription({
 *     appName: 'hub',
 *     onStatusChange: (feedback) => {
 *       toast.success(`Feedback #${feedback.id.slice(0, 8)} status updated to ${feedback.status}`)
 *     },
 *     onNewFeedback: (feedback) => {
 *       toast.info('New feedback received!')
 *     }
 *   })
 *
 *   if (isLoading) return <div>Loading feedback...</div>
 *   if (error) return <div>Error loading feedback: {error.message}</div>
 *
 *   const processFeedback = async (id: string) => {
 *     const success = await updateFeedbackStatus(id, 'processing')
 *     if (success) {
 *       // Show processing indicator
 *     }
 *   }
 *
 *   return (
 *     <div className="feedback-dashboard">
 *       <h2>Feedback Dashboard</h2>
 *       <table>
 *         <thead>
 *           <tr>
 *             <th>ID</th>
 *             <th>Content</th>
 *             <th>Sentiment</th>
 *             <th>Status</th>
 *             <th>Actions</th>
 *           </tr>
 *         </thead>
 *         <tbody>
 *           {feedbackItems.map((item) => (
 *             <tr key={item.id}>
 *               <td>{item.id.slice(0, 8)}...</td>
 *               <td>{item.content}</td>
 *               <td>{item.sentiment || 'Unknown'}</td>
 *               <td>{item.status}</td>
 *               <td>
 *                 <button onClick={() => processFeedback(item.id)}>Process</button>
 *                 <button onClick={() => updateFeedbackStatus(item.id, 'archived')}>Archive</button>
 *               </td>
 *             </tr>
 *           ))}
 *         </tbody>
 *       </table>
 *     </div>
 *   )
 * }
 * ```
 */ 
//# sourceMappingURL=feedback-subscription.js.map