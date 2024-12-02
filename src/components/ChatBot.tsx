import React, { useState, useRef, useEffect } from 'react';
import { Send, CircuitBoard, Maximize2, Minimize2 } from 'lucide-react';
import BotIcon from './BotIcon';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "GREETINGS, HUMAN. STATE YOUR PURPOSE.", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage = { id: Date.now().toString(), text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
  
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'angrybot',
          prompt: input,
          stream: false
        })
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || data, // Adjust based on API's actual response structure
        isBot: true
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'An error occurred while fetching the response.',
          isBot: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  

  const toggleSize = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`w-full mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-red-500/30 transition-all duration-300 ${
      isExpanded ? 'max-w-4xl' : 'max-w-md'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-4 border-b border-red-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <BotIcon className="scale-[2]" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-400">ANGRY-BOT 3000</h2>
              <p className="text-xs text-red-300/60">COMBAT READY</p>
            </div>
          </div>
          <button
            onClick={toggleSize}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors duration-200 text-red-400"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={`overflow-y-auto p-4 bg-gray-900/95 space-y-4 custom-scrollbar transition-all duration-300 ${
        isExpanded ? 'h-[70vh]' : 'h-96'
      }`}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`flex items-start ${
                message.isBot ? 'space-x-3' : 'space-x-reverse space-x-3'
              } max-w-[80%] ${
                message.isBot ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {message.isBot ? (
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/30">
                  <BotIcon className="w-7 h-7" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/30">
                  <CircuitBoard className="w-7 h-7 text-orange-400" />
                </div>
              )}
              <div
                className={`rounded-lg p-3 ${
                  message.isBot
                    ? 'bg-red-500/10 border border-red-500/30 text-red-100'
                    : 'bg-orange-500/10 border border-orange-500/30 text-orange-100'
                }`}
              >
                <p className="text-sm font-mono">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/30">
              <BotIcon className="w-7 h-7" />
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce shadow-[0_0_5px_#ef4444]" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce shadow-[0_0_5px_#ef4444]" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce shadow-[0_0_5px_#ef4444]" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-gray-900 border-t border-red-500/30">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ENTER COMMAND..."
            className="flex-1 bg-gray-800 text-red-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-red-500/30 placeholder-red-300/30 font-mono"
          />
          <button
            type="submit"
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-colors duration-200 border border-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}