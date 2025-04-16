import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input'; // Corrected path
import { ScrollArea } from '../ui/scroll-area'; // Corrected path
import { PointsCircle } from './PointsCircle';
import { platformColors } from './QuestCard';
import { cn } from '../utils';
const TeamChat = ({ teamName, messages = [], currentUserId, onSendMessage, className, }) => {
    const [newMessage, setNewMessage] = useState('');
    const chatBoxColor = '#27272a'; // Zinc dark
    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };
    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };
    return (<Card className={cn('flex flex-col h-[500px]', className)} style={{ backgroundColor: chatBoxColor }}>
      <CardHeader className="border-b border-zinc-700 p-4">
        <CardTitle className="text-lg text-zinc-100">{teamName} Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg) => (<div key={msg.id} className={cn('flex flex-col', msg.userId === currentUserId ? 'items-end' : 'items-start')}>
                <div className={cn('p-3 rounded-lg max-w-[75%]', msg.userId === currentUserId
                ? 'bg-blue-600 text-white' // Current user's messages
                : 'bg-zinc-700 text-zinc-200' // Other users' messages
            )}>
                  <p className="text-xs font-semibold mb-1">
                    {msg.userName}
                    <span className="text-xs text-zinc-400 ml-2">
                       {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </p>
                  <p className="text-sm">{msg.text}</p>
                   {/* Display points if awarded for this message */}
                   {msg.pointsAwarded && msg.platform && (<div className="flex items-center justify-end mt-1">
                       <PointsCircle points={`+${msg.pointsAwarded}`} platformColor={platformColors[msg.platform] || platformColors.default} size={20}/>
                     </div>)}
                </div>
              </div>))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-zinc-700">
        <div className="flex w-full items-center space-x-2">
          <Input type="text" placeholder="Type your message..." value={newMessage} onChange={handleInputChange} onKeyPress={handleKeyPress} className="flex-1 bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400 focus:ring-blue-500"/>
          <Button type="button" onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white">
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>);
};
export { TeamChat };
//# sourceMappingURL=TeamChat.js.map