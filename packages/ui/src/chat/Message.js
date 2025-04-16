import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
export function Message({ userId, roomId, supabaseUrl, supabaseKey, onSend }) {
    const [content, setContent] = useState('');
    const [tokenTag, setTokenTag] = useState('LOVE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient(supabaseUrl, supabaseKey);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim())
            return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                content: content.trim(),
                sender_id: userId,
                room_id: roomId,
                token_tag: tokenTag
            });
            if (error)
                throw error;
            setContent('');
            onSend === null || onSend === void 0 ? void 0 : onSend();
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <select value={tokenTag} onChange={(e) => setTokenTag(e.target.value)} className="rounded-lg border p-2" disabled={isSubmitting}>
        <option value="LOVE">LOVE</option>
        <option value="LUCK">LUCK</option>
        <option value="LIVE">LIVE</option>
        <option value="LIFE">LIFE</option>
      </select>
      <input type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type your message..." className="flex-1 rounded-lg border p-2" disabled={isSubmitting}/>
      <button type="submit" disabled={isSubmitting || !content.trim()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>);
}
//# sourceMappingURL=Message.js.map