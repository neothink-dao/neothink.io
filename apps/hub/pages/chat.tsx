import { ChatInterface } from '@neothink/ui';
import { withAuth } from '@neothink/auth';

function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <ChatInterface appName="hub" />
    </div>
  );
}

export default withAuth(ChatPage); 