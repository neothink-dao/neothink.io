export type Feedback = {
    id: string;
    app_name: string;
    content: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    sentiment: string | null;
    status: 'pending' | 'processing' | 'processed' | 'archived';
    metadata: Record<string, any>;
};
type SubscriptionOptions = {
    appName?: string;
    status?: Feedback['status'];
    userId?: string;
    onStatusChange?: (feedback: Feedback) => void;
    onNewFeedback?: (feedback: Feedback) => void;
};
/**
 * Hook for subscribing to real-time feedback updates
 * Optimized for admin dashboards to track feedback status changes
 */
export declare function useFeedbackSubscription(options: SubscriptionOptions): {
    feedbackItems: Feedback[];
    isLoading: boolean;
    error: Error | null;
    updateFeedbackStatus: (id: string, status: Feedback["status"]) => Promise<boolean>;
};
export {};
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
//# sourceMappingURL=feedback-subscription.d.ts.map