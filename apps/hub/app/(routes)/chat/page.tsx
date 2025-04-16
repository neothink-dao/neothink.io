'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription, Button, Textarea, Input, ScrollArea } from '@neothink/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@neothink/ui';
import { Badge } from '@neothink/ui';
import { Skeleton } from '@neothink/ui';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@neothink/ui';
import { CalendarIcon, SendIcon, MessageSquareIcon, VideoIcon, UserPlusIcon, MoreHorizontalIcon, InfoIcon, LockIcon } from 'lucide-react';

// Define room theme types for each token
const ROOM_THEMES = {
  LUCK: {
    name: 'LUCK Room',
    description: 'Sunday, 8pm EST - Share your lucky insights and synchronicities.',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: '🍀',
    meetingDay: 'Sunday',
    meetingTime: '8:00 PM EST',
    token: 'LUCK'
  },
  LIVE: {
    name: 'LIVE Room',
    description: 'Wednesday, 7pm EST - Discuss health practices and vitality.',
    color: 'from-emerald-500 to-green-600', 
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: '🌱',
    meetingDay: 'Wednesday',
    meetingTime: '7:00 PM EST',
    token: 'LIVE'
  },
  LOVE: {
    name: 'LOVE Room',
    description: 'Friday, 8pm EST - Connect and share relationship insights.',
    color: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    icon: '❤️',
    meetingDay: 'Friday',
    meetingTime: '8:00 PM EST',
    token: 'LOVE'
  },
  LIFE: {
    name: 'LIFE Room',
    description: 'Monday, 7pm EST - Discuss profound wisdom and integration.',
    color: 'from-amber-500 to-yellow-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: '✨',
    meetingDay: 'Monday',
    meetingTime: '7:00 PM EST',
    token: 'LIFE'
  },
  GENERAL: {
    name: 'General Chat',
    description: 'Open discussion for all members.',
    color: 'from-gray-500 to-gray-600',
    bgLight: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    icon: '💬',
    meetingDay: null,
    meetingTime: null,
    token: null
  },
  PREMIUM: {
    name: 'Premium Members',
    description: 'Exclusive chat for premium subscribers.',
    color: 'from-purple-500 to-violet-600',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: '⭐',
    meetingDay: null,
    meetingTime: null,
    token: null,
    requiresPremium: true
  },
  SUPERACHIEVER: {
    name: 'Superachievers',
    description: 'Elite discussion for superachiever members.',
    color: 'from-indigo-500 to-blue-600',
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    icon: '🔷',
    meetingDay: null,
    meetingTime: null,
    token: null,
    requiresSuperachiever: true
  }
};

// Types for messages and rooms
type Message = {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  token_tag: string | null;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

type Room = {
  id: string;
  name: string;
  description: string | null;
  room_type: string;
  created_at: string;
  created_by: string | null;
  is_accessible: boolean;
};

type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: string | null;
  subscription_status: string | null;
};

export default function ChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [roomTheme, setRoomTheme] = useState(ROOM_THEMES.GENERAL);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Effects
  useEffect(() => {
    fetchUserProfile();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (currentRoom) {
      fetchMessages(currentRoom.id);
      subscribeToRoom(currentRoom.id);
      updateRoomTheme(currentRoom);
    }

    return () => {
      supabase.removeChannel('room-messages');
    };
  }, [currentRoom]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up realtime subscription for messages
  const subscribeToRoom = (roomId: string) => {
    const channel = supabase
      .channel('room-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        // Fetch sender info for new message
        fetchMessageWithSender(payload.new.id).then(newMessage => {
          if (newMessage) {
            setMessages(prevMessages => [...prevMessages, newMessage]);
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, subscription_tier, subscription_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch available chat rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .rpc('get_available_rooms', { user_uuid: user.id });

      if (error) throw error;
      
      setRooms(data || []);
      
      // Set default room to General if available
      if (data && data.length > 0) {
        const generalRoom = data.find(room => room.name === ROOM_THEMES.GENERAL.name);
        const firstAccessibleRoom = data.find(room => room.is_accessible);
        setCurrentRoom(generalRoom || firstAccessibleRoom || data[0]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a room
  const fetchMessages = async (roomId: string) => {
    try {
      setMessagesLoading(true);
      const { data, error } = await supabase
        .rpc('get_room_messages', { 
          room_uuid: roomId,
          page_size: 50
        });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Fetch a single message with sender info
  const fetchMessageWithSender = async (messageId: string): Promise<Message | null> => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(
            full_name,
            avatar_url
          )
        `)
        .eq('id', messageId)
        .single();

      if (error) throw error;
      return data as Message;
    } catch (error) {
      console.error('Error fetching message with sender:', error);
      return null;
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentRoom) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Determine if this room has a token type
      const tokenTag = roomTheme.token;
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          room_id: currentRoom.id,
          sender_id: user.id,
          content: inputMessage,
          token_tag: tokenTag
        })
        .select();

      if (error) throw error;
      
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Set the theme based on the current room
  const updateRoomTheme = (room: Room) => {
    const themeKey = Object.keys(ROOM_THEMES).find(
      key => ROOM_THEMES[key as keyof typeof ROOM_THEMES].name === room.name
    ) as keyof typeof ROOM_THEMES;
    
    if (themeKey) {
      setRoomTheme(ROOM_THEMES[themeKey]);
    } else {
      // Default to general theme if no match
      setRoomTheme(ROOM_THEMES.GENERAL);
    }
  };

  // Format date for messages
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  // Get user initials for avatar
  const getInitials = (name: string | null) => {
    if (!name) return 'NN';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if a message is from the current user
  const isOwnMessage = (senderId: string) => {
    return profile?.id === senderId;
  };

  // Scroll chat to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check if a room is active
  const isActiveRoom = (roomId: string) => {
    return currentRoom?.id === roomId;
  };

  // Get next meeting time for themed rooms
  const getNextMeetingTime = (theme: typeof ROOM_THEMES.LUCK) => {
    if (!theme.meetingDay || !theme.meetingTime) return null;
    
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDay = daysOfWeek.indexOf(theme.meetingDay);
    
    let daysToAdd = targetDay - today.getDay();
    if (daysToAdd <= 0) {
      // If today is the meeting day or we've passed it this week, get next week
      daysToAdd += 7;
    }
    
    const nextMeeting = new Date(today);
    nextMeeting.setDate(today.getDate() + daysToAdd);
    
    const dateStr = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(nextMeeting);
    
    return `${dateStr} at ${theme.meetingTime}`;
  };

  // Loading UI
  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="grid grid-cols-12 gap-6 h-[700px]">
          <div className="col-span-3">
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-8 w-40 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-9">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <Skeleton className="h-8 w-60" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-full w-full" />
              </CardContent>
              <CardFooter className="border-t p-4">
                <Skeleton className="h-12 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Room List */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Chat Rooms</CardTitle>
              <CardDescription>Select a room to join the conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rooms.map(room => {
                  // Find matching theme if available
                  const themeKey = Object.keys(ROOM_THEMES).find(
                    key => ROOM_THEMES[key as keyof typeof ROOM_THEMES].name === room.name
                  ) as keyof typeof ROOM_THEMES;
                  
                  const theme = themeKey ? ROOM_THEMES[themeKey] : ROOM_THEMES.GENERAL;
                  
                  return (
                    <div 
                      key={room.id} 
                      className={`px-4 py-3 rounded-lg cursor-pointer transition-all
                        ${isActiveRoom(room.id) 
                          ? `border-l-4 ${theme.borderColor} ${theme.bgLight}` 
                          : 'border-l-4 border-transparent hover:border-gray-200 hover:bg-gray-50'
                        }
                        ${!room.is_accessible ? 'opacity-60' : ''}
                      `}
                      onClick={() => room.is_accessible && setCurrentRoom(room)}
                    >
                      <div className="flex items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${theme.bgLight} ${theme.textColor} mr-3`}>
                          <span>{theme.icon}</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <h4 className="font-medium text-sm">{room.name}</h4>
                            {!room.is_accessible && (
                              <LockIcon className="h-3.5 w-3.5 ml-2 text-gray-400" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {room.description || 'Join the conversation'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Chat Area */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9">
          {currentRoom ? (
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <div className={`bg-gradient-to-r ${roomTheme.color} text-white px-6 py-4 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-full h-10 w-10 flex items-center justify-center text-xl mr-3">
                      {roomTheme.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{currentRoom.name}</h3>
                      <p className="text-xs text-white/80">{currentRoom.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {roomTheme.meetingDay && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-none">
                        <CalendarIcon className="h-3 w-3 mr-1" /> 
                        {roomTheme.meetingDay}s {roomTheme.meetingTime}
                      </Badge>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <MoreHorizontalIcon className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <VideoIcon className="h-4 w-4 mr-2" /> Join Video Call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlusIcon className="h-4 w-4 mr-2" /> Invite Others
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <InfoIcon className="h-4 w-4 mr-2" /> Room Info
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Next meeting notice for token rooms */}
                {roomTheme.meetingDay && (
                  <div className="mt-3 text-xs bg-white/10 p-2 rounded flex items-center">
                    <CalendarIcon className="h-3.5 w-3.5 mr-2" />
                    <span>
                      Next meeting: {getNextMeetingTime(roomTheme)} – 
                      Earn {roomTheme.token} tokens by participating!
                    </span>
                  </div>
                )}
              </div>
              
              {/* Messages Area */}
              <CardContent className="flex-grow p-0 overflow-hidden">
                <ScrollArea className="h-[500px] p-6">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-start gap-2">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-16 w-64" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <MessageSquareIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                      <p className="text-muted-foreground max-w-md">
                        Be the first to send a message in this room!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isOwn = isOwnMessage(message.sender_id);
                        
                        return (
                          <div 
                            key={message.id} 
                            className={`flex items-start gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                          >
                            <div className={`max-w-[70%] ${isOwn ? 'text-right' : ''}`}>
                              <div className="flex items-center gap-2 mb-1 text-sm">
                                <span className={`font-medium ${isOwn ? 'ml-auto' : ''}`}>
                                  {message.sender?.full_name || 'Neothink Member'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(message.created_at)}
                                </span>
                                {message.token_tag && (
                                  <Badge variant="outline" className={`${ROOM_THEMES[message.token_tag as keyof typeof ROOM_THEMES].textColor} text-xs`}>
                                    {message.token_tag}
                                  </Badge>
                                )}
                              </div>
                              
                              <div 
                                className={`p-3 rounded-lg ${
                                  isOwn 
                                    ? `${roomTheme.bgLight} ${roomTheme.textColor} ml-auto` 
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words text-sm">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              
              {/* Message Input */}
              <CardFooter className="p-4 border-t">
                <form 
                  className="flex w-full gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                >
                  <Textarea
                    placeholder={`Type your message in ${currentRoom.name}...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-grow min-h-[50px] max-h-[150px] resize-none"
                  />
                  <Button 
                    type="submit"
                    className={`bg-gradient-to-r ${roomTheme.color} text-white px-6`}
                    disabled={!inputMessage.trim()}
                  >
                    <SendIcon className="h-5 w-5" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-12">
              <div className="text-center">
                <MessageSquareIcon className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
                <h3 className="text-xl font-medium mb-2">Select a Chat Room</h3>
                <p className="text-muted-foreground max-w-md mb-8">
                  Choose a room from the list to start chatting with fellow members.
                </p>
                <Button onClick={() => fetchRooms()}>Refresh Rooms</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 