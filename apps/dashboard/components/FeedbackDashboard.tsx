'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from 'database-types';

type Feedback = Database['public']['Tables']['feedback']['Row'];

export default function FeedbackDashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeedback(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('feedback_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFeedback(prev => [payload.new as Feedback, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setFeedback(prev => 
              prev.map(item => 
                item.id === payload.new.id ? payload.new as Feedback : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setFeedback(prev => 
              prev.filter(item => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Feedback Dashboard</h1>
      <div className="grid gap-6">
        <AnimatePresence>
          {feedback.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-6 rounded-lg shadow-lg ${
                item.sentiment === 'positive'
                  ? 'bg-green-50'
                  : item.sentiment === 'negative'
                  ? 'bg-red-50'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-lg mb-2">{item.content}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>App: {item.app_name}</span>
                    <span>Platform: {item.platform}</span>
                    <span>
                      Date: {format(new Date(item.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    item.status === 'new'
                      ? 'bg-blue-100 text-blue-800'
                      : item.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : item.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  <span className={`mt-2 text-sm ${
                    item.sentiment === 'positive'
                      ? 'text-green-600'
                      : item.sentiment === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {item.sentiment}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 