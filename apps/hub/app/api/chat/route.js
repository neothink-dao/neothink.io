// @ts-expect-error: monorepo import may be valid in deployment context
import { NeothinkChatbot } from '@neothink/ai';
import { z } from 'zod';
// @ts-expect-error: monorepo import may be valid in deployment context
import { startNewConversation, sendMessage } from '@neothink/hub/lib/supabase/chat-subscription';
import { SupabaseAI } from '@neothink/ai';
import { getSupabaseServerClient } from '@neothink/database/src/serverClient';
const chatRequestSchema = z.object({
    message: z.string().min(1, 'Message is required'),
    appName: z.enum(['hub', 'ascenders', 'immortals', 'neothinkers']).default('hub'),
    conversationId: z.string().uuid().optional(),
    metadata: z.record(z.any()).optional()
});
export async function POST(req) {
    try {
        // Parse JSON body
        const body = await req.json();
        // Validate request body
        const validationResult = chatRequestSchema.safeParse(body);
        if (!validationResult.success) {
            return new Response(JSON.stringify({
                error: 'Bad Request',
                details: validationResult.error.issues.map(issue => issue.message)
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        const { message, appName, conversationId, metadata = {} } = validationResult.data;
        // Create authenticated Supabase client using the new helper
        const supabase = await getSupabaseServerClient();
        // Get session (adapt as needed for your auth flow)
        const { data: { session }, } = await supabase.auth.getSession();
        if (!session) {
            return new Response(JSON.stringify({
                error: 'Unauthorized',
                details: 'Please log in to use the chat feature'
            }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        const userId = session.user.id;
        // Initialize AI utility for embeddings and enhanced features
        const ai = new SupabaseAI(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.OPENAI_API_KEY);
        // Track this chat request in analytics
        await ai.trackAnalytics('chat_request', appName, {
            message_length: message.length,
            has_conversation: !!conversationId
        }, {
            user_agent: req.headers.get('user-agent') || ''
        });
        // Get or create conversation
        let activeConversationId = conversationId;
        if (!activeConversationId) {
            // Create a new conversation
            const conversation = await startNewConversation(supabase, userId, appName, message);
            activeConversationId = conversation.id;
        }
        else {
            // If conversation exists, add the user message
            await sendMessage(supabase, activeConversationId, userId, message, 'user', metadata);
        }
        // Initialize chatbot
        const chatbot = new NeothinkChatbot(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.OPENAI_API_KEY);
        // Process the message with enhanced context gathering
        const recentMessages = await supabase
            .from('chat_messages')
            .select('*')
            .eq('conversation_id', activeConversationId)
            .order('created_at', { ascending: true })
            .limit(10);
        if (recentMessages.error)
            throw recentMessages.error;
        const formattedMessages = recentMessages.data.map((msg) => ({
            role: msg.role,
            content: msg.content
        }));
        const preferences = await ai.getUserPreferences(userId, appName);
        let similarMessageResults = [];
        try {
            similarMessageResults = await ai.searchSimilarContent(message, 'chat_message', 0.7, 3);
        }
        catch (error) {
            console.warn('Vector search failed, continuing without similar messages:', error);
        }
        let context = '';
        if (similarMessageResults.length > 0) {
            context = 'Previous relevant conversations:\n' +
                similarMessageResults
                    .map((msg) => `Q: ${msg.content}\nA: ${msg.response || '[No response recorded]'}`)
                    .join('\n\n');
        }
        const aiResponse = await chatbot.generateResponse(formattedMessages, context, preferences);
        const assistantMessage = await sendMessage(supabase, activeConversationId, userId, aiResponse, 'assistant', { model: 'gpt-4', generated_at: new Date().toISOString() });
        ai.generateAndStoreEmbedding(message, assistantMessage.id, 'chat_message', {
            conversation_id: activeConversationId,
            app_name: appName
        }).catch((err) => {
            console.error('Failed to generate embeddings:', err);
        });
        return new Response(JSON.stringify({
            conversationId: activeConversationId,
            response: aiResponse,
            messageId: assistantMessage.id
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        console.error('Chat API error:', error);
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify({
                error: 'Validation Error',
                details: error.issues.map((issue) => issue.message)
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        if (error instanceof Error && error.message.includes('rate limit')) {
            return new Response(JSON.stringify({
                error: 'Too Many Requests',
                details: error.message
            }), { status: 429, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
//# sourceMappingURL=route.js.map