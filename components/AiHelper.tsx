
import React, { useState, useRef, useEffect } from 'react';
import { useGemini } from '../hooks/useGemini';
import { ChatSession } from '@google/generative-ai';
import Spinner from './Spinner';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AiHelper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<ChatSession | null>(null);
  const { createChat, isAvailable } = useGemini();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && !chat && isAvailable) {
      console.log('[DEBUG] AiHelper: Opening and creating new chat session.');
      const systemInstruction = `You are 'Scentify AI', a friendly and knowledgeable perfume expert for the Scentify online boutique. Your goal is to help users discover their perfect fragrance. Be conversational, elegant, and helpful. Use Markdown for formatting, such as bolding for perfume names or lists for recommendations. For example: "Based on your love for vanilla, I recommend:\n\n* **Yves Saint Laurent** - Black Opium\n* **Tom Ford** - Oud Wood"`;
      const newChat = createChat(systemInstruction);
      setChat(newChat);
      if (messages.length === 0) {
        setMessages([{ sender: 'ai', text: "Hello! I'm Scentify AI. How can I help you find your perfect scent today?" }]);
      }
    }
  }, [isOpen, chat, createChat, messages.length, isAvailable]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isStreaming) return;

    setError(null);
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const textToSend = input;
    setInput('');
    setIsStreaming(true);
    console.log('[DEBUG] AiHelper: handleSendMessage called. Chat object:', chat);

    try {
      console.log('[DEBUG] AiHelper: Awaiting stream result for message:', textToSend);
      const result = await chat.sendMessageStream(textToSend);
      console.log('[DEBUG] AiHelper: Stream result received. Type:', typeof result, result);

      let aiResponse = '';
      setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

      for await (const chunk of result.stream) {
        console.log('[DEBUG] AiHelper: Received stream chunk:', chunk);
        aiResponse += chunk.text();
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponse };
          return newMessages;
        });
      }
    } catch (err: any) {
      console.error("[DEBUG] Full AI chat error object:", err);
      let errorMessage = `Sorry, I couldn't respond. The API returned an error: ${err.message || 'Unknown error'}`;
      if (err.message && err.message.includes('429')) {
        errorMessage = "The AI service is currently busy. Please try again in a few moments.";
      }
      setError(errorMessage);
      setMessages(prev => prev.filter(m => m.sender !== 'ai' || m.text !== ''));
    } finally {
      setIsStreaming(false);
      console.log('[DEBUG] AiHelper: Finished processing stream.');
    }
  };

  const renderMarkdown = (text: string) => {
    const rawMarkup = marked.parse(text) as string;
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup);
    return { __html: sanitizedMarkup };
  };

  return (
    <>
      <button
        onClick={() => isAvailable && setIsOpen(true)}
        disabled={!isAvailable}
        title={!isAvailable ? "AI Helper is unavailable: API Key not configured." : "Open AI Helper"}
        className={`fixed bottom-6 right-6 bg-brand-accent text-brand-primary h-16 w-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-50 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 ${isPulsing ? 'animate-pulse' : ''}`}
        aria-label="Open AI Helper"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-2.3 19.51l.1.09a1 1 0 0 0 1.6-1.21A8 8 0 1 1 12 4a8.11 8.11 0 0 1 1.3.11A1 1 0 0 0 14.5 3 10 10 0 0 0 12 2Zm7.5 12.5a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1Zm-4 2a1 1 0 0 0-1-1h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Zm-4-4a1 1 0 0 0-1-1h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Zm1-5a1 1 0 0 0 1 1h1a1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1Z" /></svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center sm:justify-end" onClick={() => setIsOpen(false)}>
          <div className="bg-brand-secondary w-full max-w-md h-[80vh] sm:h-auto sm:max-h-[600px] m-0 sm:m-4 rounded-t-xl sm:rounded-xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <header className="p-4 border-b border-brand-primary/10 flex justify-between items-center">
              <h3 className="font-serif text-xl font-semibold">Scentify AI Helper</h3>
              <button onClick={() => setIsOpen(false)} className="text-2xl leading-none p-1 hover:text-black">&times;</button>
            </header>
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}>
                    {msg.sender === 'ai' ? (
                      <div className="prose prose-sm" dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              {isStreaming && <div className="flex justify-start"><div className="max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl bg-gray-200 text-black rounded-bl-none"><Spinner /></div></div>}
              {error && <div className="text-red-500 text-sm p-2 bg-red-100 rounded-lg">{error}</div>}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-brand-primary/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for a recommendation..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-brand-accent outline-none"
                  disabled={isStreaming}
                />
                <button type="submit" className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-brand-primary hover:text-brand-accent disabled:text-gray-400" disabled={isStreaming || !input.trim()}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiHelper;
