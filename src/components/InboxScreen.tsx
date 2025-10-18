import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Lock, Heart, MoreVertical, Phone, Video, MessageCircle, Smile, Image as ImageIcon, Mic, Check, CheckCheck, Sparkles, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { api } from '../utils/api';
import { getCurrentUserId } from '../utils/mockAuth';
import { toast } from 'sonner';

interface Conversation {
  id: string;
  name: string;
  photo: string;
  lastMessage: string;
  timestamp: string;
  isLocked: boolean;
  unread: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    lastMessage: 'Love your taste in indie music! 🎵',
    timestamp: '2m',
    isLocked: false,
    unread: true,
  },
  {
    id: '2',
    name: 'Arjun',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    lastMessage: 'Have you heard the new album?',
    timestamp: '1h',
    isLocked: false,
    unread: false,
  },
  {
    id: '3',
    name: 'Priya',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    lastMessage: 'It\'s a match! Say hi 👋',
    timestamp: '3h',
    isLocked: true,
    unread: true,
  },
  {
    id: '4',
    name: 'Vikram',
    photo: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400',
    lastMessage: 'Those songs are fire! 🔥',
    timestamp: '5h',
    isLocked: false,
    unread: false,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! I saw we both love The Weeknd 🎵',
    sender: 'them',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    text: 'Yes! Blinding Lights is my all-time favorite',
    sender: 'me',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    text: 'Love your taste in indie music! 🎵',
    sender: 'them',
    timestamp: '10:35 AM',
  },
];

export function InboxScreen() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const loadConversations = async () => {
    try {
      const userId = getCurrentUserId();
      const response = await api.messages.getConversations();
      
      if (response.conversations && response.conversations.length > 0) {
        setConversations(response.conversations);
      } else {
        setConversations(mockConversations);
      }
    } catch (error) {
      // Demo mode - use mock data
      console.log('Using demo conversations');
      setConversations(mockConversations);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await api.messages.get(conversationId);
      
      if (response.messages && response.messages.length > 0) {
        setMessages(response.messages);
      } else {
        setMessages(mockMessages);
      }
    } catch (error) {
      // Demo mode - use mock data
      console.log('Using demo messages');
      setMessages(mockMessages);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    setSending(true);
    try {
      const response = await api.messages.send(selectedChat.id, newMessage);
      
      if (response.success) {
        const message: Message = {
          id: response.message.id,
          text: newMessage,
          sender: 'me',
          timestamp: formatTimestamp(response.message.timestamp),
        };

        setMessages([...messages, message]);
        setNewMessage('');
        
        if (selectedChat.isLocked) {
          setSelectedChat({ ...selectedChat, isLocked: false });
        }
      }
    } catch (error) {
      // Demo mode - add message anyway
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };

      setMessages([...messages, message]);
      setNewMessage('');
      
      if (selectedChat.isLocked) {
        setSelectedChat({ ...selectedChat, isLocked: false });
      }
    } finally {
      setSending(false);
    }
  };

  // Chat View - Modern Design
  if (selectedChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex flex-col pb-24 overflow-hidden">
        {/* Chat Header - Glassmorphic */}
        <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <motion.button
                onClick={() => setSelectedChat(null)}
                className="w-11 h-11 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-lg"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                  <ImageWithFallback
                    src={selectedChat.photo}
                    alt={selectedChat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Active status */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white truncate">{selectedChat.name}</h3>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Active now
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <Video className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 max-w-md mx-auto w-full">
          {selectedChat.isLocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/15 backdrop-blur-2xl rounded-2xl p-6 mb-6 text-center border border-white/30"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg text-white mb-2">Send a message to unlock</h3>
              <p className="text-sm text-white/70">
                Start the conversation by sending your first message!
              </p>
            </motion.div>
          )}

          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === 'me'
                      ? 'bg-white text-[#FF1744] rounded-br-md'
                      : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-[#FF1744]/60' : 'text-white/50'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Input Area - Glassmorphic */}
        <div className="sticky bottom-0 bg-white/10 backdrop-blur-2xl border-t border-white/20 pb-safe">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <motion.button
                className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <Smile className="w-5 h-5 text-white" />
              </motion.button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <motion.button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl disabled:opacity-50"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: !newMessage.trim() ? 1 : 1.05 }}
              >
                {sending ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-[#FF1744] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Send className="w-5 h-5 text-[#FF1744] ml-0.5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Conversations List View - Modern
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pb-32 overflow-hidden">
      {/* Static Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute top-60 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl text-white tracking-tight flex items-center gap-3">
                <span>💬</span>
                Messages
              </h1>
              <p className="text-lg text-white/70 mt-1">{conversations.length} active chats</p>
            </div>
            
            {/* Message Badge */}
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-2xl flex items-center justify-center shadow-2xl"
              whileHover={{ rotate: 15, scale: 1.05 }}
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Conversations List */}
        {loading ? (
          <div className="text-center py-16">
            <motion.div 
              className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : conversations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30">
              <MessageCircle className="w-14 h-14 text-white/60" />
            </div>
            <h3 className="text-2xl text-white mb-3">No messages yet</h3>
            <p className="text-white/70 max-w-xs mx-auto">
              Start swiping to match with people who share your music taste!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation, index) => (
              <motion.button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="w-full bg-white/15 backdrop-blur-2xl rounded-2xl p-4 flex items-center gap-4 border border-white/30 shadow-lg text-left group"
              >
                <div className="relative flex-shrink-0">
                  {/* Photo with gradient ring for unread */}
                  {conversation.unread && !conversation.isLocked ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-[#FBBF24] rounded-full blur-md opacity-60" />
                      <div className="relative w-16 h-16 p-[3px] bg-gradient-to-br from-white to-[#FBBF24] rounded-full">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/30">
                          <ImageWithFallback
                            src={conversation.photo}
                            alt={conversation.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                      <ImageWithFallback
                        src={conversation.photo}
                        alt={conversation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Locked badge */}
                  {conversation.isLocked && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <Lock className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {!conversation.isLocked && !conversation.unread && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white truncate">{conversation.name}</h3>
                    <span className="text-xs text-white/60">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-white/70 truncate">{conversation.lastMessage}</p>
                </div>

                {conversation.unread && (
                  <div className="w-2 h-2 bg-[#FBBF24] rounded-full flex-shrink-0" />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
