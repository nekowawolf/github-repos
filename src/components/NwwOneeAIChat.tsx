'use client';

import { useState, useRef, useEffect } from 'react';
import { CgClose } from 'react-icons/cg';
import { FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const chatStore = {
  isOpen: false,
  messages: [] as {role: 'user'|'ai', content: string}[],
  inputValue: '',
  isTyping: false,
  listeners: new Set<() => void>(),
  
  setIsOpen(val: boolean) {
    this.isOpen = val;
    this.notify();
  },
  setMessages(fn: (prev: {role: 'user'|'ai', content: string}[]) => {role: 'user'|'ai', content: string}[]) {
    this.messages = fn(this.messages);
    this.notify();
  },
  setInputValue(val: string) {
    this.inputValue = val;
    this.notify();
  },
  setIsTyping(val: boolean) {
    this.isTyping = val;
    this.notify();
  },
  notify() {
    this.listeners.forEach(listener => listener());
  },
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
};

export default function NwwOneeAIChat() {
  const [isOpen, setIsOpenLocal] = useState(chatStore.isOpen);
  const [messages, setMessagesLocal] = useState(chatStore.messages);
  const [inputValue, setInputValueLocal] = useState(chatStore.inputValue);
  const [isTyping, setIsTypingLocal] = useState(chatStore.isTyping);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return chatStore.subscribe(() => {
      setIsOpenLocal(chatStore.isOpen);
      setMessagesLocal(chatStore.messages);
      setInputValueLocal(chatStore.inputValue);
      setIsTypingLocal(chatStore.isTyping);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim() || chatStore.isTyping) return;
    
    chatStore.setMessages(prev => [...prev, { role: 'user', content: text }]);
    chatStore.setInputValue('');
    chatStore.setIsTyping(true);

    setTimeout(() => {
      chatStore.setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, this feature is still under development.' }]);
      chatStore.setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: 40 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-[380px] max-w-[calc(100vw-32px)] glass-card rounded-2xl overflow-hidden shadow-2xl flex flex-col origin-bottom-right"
          >
          {/* Header */}
          <div className="bg-blue-600/20 border-divider-b relative flex rounded-t-2xl rounded-b-3xl min-h-[140px] overflow-hidden">
            <button
              onClick={() => chatStore.setIsOpen(false)}
              className="absolute top-3 right-3 cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-fill-color p-1 z-20"
            >
              <CgClose className="w-5 h-5" />
            </button>
            
            <img
              src="https://nekowawolf.github.io/cdn-images/images/2026/1784056987_nwwonee_hi.png"
              alt="NwwOnee AI Hi"
              className="absolute -bottom-16 -left-1 w-[160px] h-auto z-10 pointer-events-none drop-shadow-md"
            />
            
            <div className="pl-[135px] py-5 pr-5 flex flex-col justify-center">
              <h3 className="font-bold text-base text-fill-color mb-1 relative z-20">
                NwwOnee AI
              </h3>

              <p className="text-[11px] text-fill-color/70 leading-5 relative z-20">
                Your Nww Ecosystem AI assistant. Helping you find the best repositories, explain repository details, and summarize data.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col bg-transparent overflow-hidden">
            {messages.length === 0 ? (
              <div className="p-5">
                <p className="text-[15px] font-semibold text-fill-color mb-1">Want help getting started?</p>
                <p className="text-xs text-fill-color/70 mb-4">Select an option below based on how NwwOnee AI can help you.</p>
                
                <div className="flex flex-col gap-2.5">
                  <button onClick={() => handleSend("Find the best repositories")} className="relative text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-blue-500/10 hover:from-blue-600/20 hover:to-blue-500/20 transition-all text-sm text-fill-color/90 hover:text-fill-color shadow-sm cursor-pointer group">
                    <div 
                      className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-blue-500 pointer-events-none" 
                      style={{ 
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', 
                        WebkitMaskComposite: 'xor', 
                        mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', 
                        maskComposite: 'exclude' 
                      }}
                    ></div>
                    <span className="relative z-10">Find the best repositories</span>
                  </button>
                  <button onClick={() => handleSend("Explain repository details")} className="relative text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-blue-500/10 hover:from-blue-600/20 hover:to-blue-500/20 transition-all text-sm text-fill-color/90 hover:text-fill-color shadow-sm cursor-pointer group">
                    <div 
                      className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-blue-500 pointer-events-none" 
                      style={{ 
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', 
                        WebkitMaskComposite: 'xor', 
                        mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', 
                        maskComposite: 'exclude' 
                      }}
                    ></div>
                    <span className="relative z-10">Explain repository details</span>
                  </button>
                  <button onClick={() => handleSend("Help me summarize data")} className="relative text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-blue-500/10 hover:from-blue-600/20 hover:to-blue-500/20 transition-all text-sm text-fill-color/90 hover:text-fill-color shadow-sm cursor-pointer group">
                    <div 
                      className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-blue-500 pointer-events-none" 
                      style={{ 
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', 
                        WebkitMaskComposite: 'xor', 
                        mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', 
                        maskComposite: 'exclude' 
                      }}
                    ></div>
                    <span className="relative z-10">Help me summarize data</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5 max-h-[350px] scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-blue-600/20 shrink-0">
                        <div className="absolute -inset-[1px] rounded-full border border-blue-600/30 z-10 pointer-events-none"></div>
                        <img src="https://nekowawolf.github.io/cdn-images/images/2026/1784056869_nwwonee_ai.png" alt="NwwOnee AI" className="w-full h-full rounded-full object-cover relative z-20" />
                      </div>
                    )}
                    <div className={`${msg.role === 'user' ? 'p-3 bg-blue-600 text-white rounded-2xl rounded-br-sm' : 'py-1.5 text-fill-color/90'} max-w-[85%] text-sm leading-relaxed`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start items-center">
                    <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-blue-600/20 shrink-0">
                      <div className="absolute -inset-[2px] rounded-full border-2 border-transparent border-t-blue-600 animate-[spin_0.8s_linear_infinite] z-10 pointer-events-none"></div>
                      <img src="https://nekowawolf.github.io/cdn-images/images/2026/1784056869_nwwonee_ai.png" alt="NwwOnee AI" className="w-full h-full rounded-full object-cover relative z-20" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer (Input) */}
          <div className="p-4 bg-transparent pb-5">
            <div className="relative flex items-center justify-between border-color glass-card rounded-full px-2 py-2 shadow-sm">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => chatStore.setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="How can I help today?"
                className="w-full bg-transparent px-3 text-sm text-fill-color outline-none placeholder:text-fill-color/60"
              />
              <button 
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all cursor-pointer shrink-0 shadow-md shadow-blue-500/20"
              >
                <FaArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <button
        onClick={() => chatStore.setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full overflow-hidden bg-blue-600/20 hover:bg-blue-600/30 transition-all flex items-center justify-center border border-blue-600/30 shadow-lg shadow-blue-600/20 cursor-pointer hover:scale-105 active:scale-95"
      >
        <img
          src="https://nekowawolf.github.io/cdn-images/images/2026/1784056869_nwwonee_ai.png"
          alt="NwwOnee AI"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
}
