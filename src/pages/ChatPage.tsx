import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Send, Loader2, MessageSquare, Clock } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: number;
}

interface ChatHistory {
  id: string;
  firstMessage: string;
  timestamp: number;
  messages: Message[];
}

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      type: 'user',
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    // If this is a new chat, create a chat history entry
    if (messages.length === 0) {
      const newChatId = Date.now().toString();
      const newChat: ChatHistory = {
        id: newChatId,
        firstMessage: userMessage.content,
        timestamp: Date.now(),
        messages: newMessages,
      };
      setChatHistory(prev => [newChat, ...prev]);
      setSelectedChatId(newChatId);
    } else {
      // Update existing chat history
      setChatHistory(prev => prev.map(chat => 
        chat.id === selectedChatId
          ? { ...chat, messages: newMessages }
          : chat
      ));
    }

    // TODO: Replace with actual API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm analyzing your question and will provide a detailed response. For now, this is a placeholder response that demonstrates the chat interface. In the real implementation, this would be replaced with an actual AI-generated response based on your project's requirements and context.",
        type: 'assistant',
        timestamp: Date.now(),
      };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      
      // Update chat history with assistant's response
      setChatHistory(prev => prev.map(chat => 
        chat.id === selectedChatId
          ? { ...chat, messages: updatedMessages }
          : chat
      ));
      
      setIsLoading(false);
    }, 1000);
  };

  const startNewChat = () => {
    setMessages([]);
    setSelectedChatId(null);
    setInputValue('');
  };

  const loadChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setSelectedChatId(chatId);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/projects/${projectId}/requirements`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              aria-label="Go back to requirements"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Ask Brewer</h1>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar - only show if there's chat history */}
        {chatHistory.length > 0 && (
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b">
              <button
                onClick={startNewChat}
                className="w-full flex items-center gap-2 px-4 py-2 bg-[#feb249] text-white rounded-lg hover:bg-[#fea849]"
              >
                <MessageSquare className="w-4 h-4" />
                New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {chatHistory.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg mb-2 hover:bg-gray-50 transition-colors ${
                    selectedChatId === chat.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.firstMessage}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(chat.timestamp)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <main className={`flex-1 px-4 py-8 flex flex-col ${chatHistory.length > 0 ? 'max-w-3xl' : 'max-w-3xl mx-auto'}`}>
          {messages.length === 0 ? (
            <>
              {/* Initial Search Screen */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything about your requirements..."
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                    />
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#fff5e6] rounded-full mb-4">
                    <Search className="w-6 h-6 text-[#feb249]" />
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Ask Brewer Anything</h2>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Get answers about your requirements, project structure, or recommendations for improvements.
                  </p>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Try asking about:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setInputValue("What are the best practices for writing requirements?")}
                    className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <p className="text-gray-900 font-medium mb-1">Best Practices</p>
                    <p className="text-sm text-gray-500">Learn about requirement writing best practices</p>
                  </button>
                  <button
                    onClick={() => setInputValue("How can I improve my requirement's clarity?")}
                    className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <p className="text-gray-900 font-medium mb-1">Clarity Improvements</p>
                    <p className="text-sm text-gray-500">Get tips for writing clearer requirements</p>
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Chat Interface
            <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'user'
                            ? 'bg-[#feb249] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-[#fff5e6]' : 'text-gray-500'}`}>
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about your requirements..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#feb249] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      inputValue.trim() && !isLoading
                        ? 'bg-[#feb249] text-white hover:bg-[#fea849]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}; 