'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo, useSyncExternalStore } from 'react';
import { CgClose } from 'react-icons/cg';
import { FaArrowUp } from 'react-icons/fa';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { MdHistory } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { FaArrowLeft } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

const chatStore = {
  _state: {
    isOpen: false,
    messages: [] as {role: 'user'|'ai', content: string}[],
    inputValue: '',
    isTyping: false,
  },
  _listeners: new Set<() => void>(),

  getSnapshot() {
    return chatStore._state;
  },

  _emit() {
    chatStore._listeners.forEach(l => l());
  },

  subscribe(listener: () => void) {
    chatStore._listeners.add(listener);
    return () => { chatStore._listeners.delete(listener); };
  },

  setIsOpen(val: boolean) {
    if (chatStore._state.isOpen === val) return;          
    chatStore._state = { ...chatStore._state, isOpen: val };
    chatStore._emit();
  },

  setMessages(fn: (prev: {role:'user'|'ai', content:string}[]) => {role:'user'|'ai', content:string}[]) {
    chatStore._state = { ...chatStore._state, messages: fn(chatStore._state.messages) };
    chatStore._emit();
  },

  setInputValue(val: string) {
    if (chatStore._state.inputValue === val) return;      
    chatStore._state = { ...chatStore._state, inputValue: val };
    chatStore._emit();
  },

  setIsTyping(val: boolean) {
    if (chatStore._state.isTyping === val) return;        
    chatStore._state = { ...chatStore._state, isTyping: val };
    chatStore._emit();
  },
};

function useChatSelector<T>(selector: (s: typeof chatStore._state) => T): T {
  const selectorStable = useCallback(selector, []);
  const snap = useSyncExternalStore(
    chatStore.subscribe,
    () => selectorStable(chatStore.getSnapshot()),
    () => selectorStable(chatStore.getSnapshot())
  );
  return snap;
}

const chatPanelVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const chatPanelTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 28,
  mass: 0.8,
};

const AVATAR_URL = 'https://nekowawolf.github.io/cdn-images/images/2026/1784456222_nwwonee_ai.webp';
const HI_IMAGE_URL = 'https://nekowawolf.github.io/cdn-images/images/2026/1784456024_nwwonee_hi.webp';

const ChatHeader = memo(function ChatHeader({
  activeView,
  setActiveView,
}: {
  activeView: 'chat' | 'user' | 'history';
  setActiveView: (v: 'chat' | 'user' | 'history') => void;
}) {
  return (
    <div className="bg-blue-600/20 border-divider-b relative flex rounded-t-2xl rounded-b-3xl min-h-[140px] overflow-hidden">
      <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
        <button 
          onClick={() => setActiveView(activeView === 'user' ? 'chat' : 'user')}
          className={`cursor-pointer transition-all text-fill-color p-1 rounded-md ${activeView === 'user' ? 'bg-blue-600/30 opacity-100' : 'opacity-70 hover:opacity-100 hover:bg-blue-600/10'}`}
        >
          <HiOutlineUserCircle className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setActiveView(activeView === 'history' ? 'chat' : 'history')}
          className={`cursor-pointer transition-all text-fill-color p-1 rounded-md ${activeView === 'history' ? 'bg-blue-600/30 opacity-100' : 'opacity-70 hover:opacity-100 hover:bg-blue-600/10'}`}
        >
          <MdHistory className="w-5 h-5" />
        </button>
        <button
          onClick={() => chatStore.setIsOpen(false)}
          className="cursor-pointer opacity-70 hover:opacity-100 hover:bg-red-500/20 transition-all text-fill-color p-1 rounded-md"
        >
          <CgClose className="w-5 h-5" />
        </button>
      </div>
      
      <img
        src={HI_IMAGE_URL}
        alt="NwwOnee AI Hi"
        className="absolute -bottom-16 -left-1 w-[160px] h-auto z-10 pointer-events-none drop-shadow-md"
        loading="eager"
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
  );
});

const MessageBubble = memo(function MessageBubble({ msg }: { msg: {role:'user'|'ai', content:string} }) {
  return (
    <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {msg.role === 'ai' && (
        <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-blue-600/20 shrink-0">
          <div className="absolute -inset-[1px] rounded-full border border-blue-600/30 z-10 pointer-events-none"></div>
          <img src={AVATAR_URL} alt="NwwOnee AI" className="w-full h-full rounded-full object-cover relative z-20" loading="eager" />
        </div>
      )}
      <div className={`${msg.role === 'user' ? 'p-3 bg-blue-600 text-white rounded-2xl rounded-br-sm' : 'py-1.5 text-fill-color/90'} max-w-[85%] text-sm leading-relaxed`}>
        {msg.content}
      </div>
    </div>
  );
});

const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start items-center">
      <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-blue-600/20 shrink-0">
        <div className="absolute -inset-[2px] rounded-full border-2 border-transparent border-t-blue-600 animate-[spin_0.8s_linear_infinite] z-10 pointer-events-none"></div>
        <img src={AVATAR_URL} alt="NwwOnee AI" className="w-full h-full rounded-full object-cover relative z-20" loading="eager" />
      </div>
    </div>
  );
});

const StarterButtons = memo(function StarterButtons({ onSend }: { onSend: (t:string) => void }) {
  return (
    <div className="p-5">
      <p className="text-[15px] font-semibold text-fill-color mb-1">Want help getting started?</p>
      <p className="text-xs text-fill-color/70 mb-4">Select an option below based on how NwwOnee AI can help you.</p>
      
      <div className="flex flex-col gap-2.5">
        <button onClick={() => onSend("Find the best repositories")} className="relative text-left px-4 py-3 rounded-xl border border-blue-600 bg-gradient-to-r from-blue-600/10 to-blue-500/10 hover:from-blue-600/20 hover:to-blue-500/20 transition-all text-sm text-fill-color/90 hover:text-fill-color shadow-sm cursor-pointer group">
            <span className="relative z-10">Find the best repositories</span>
          </button>
          <button onClick={() => onSend("Explain repository details")} className="relative text-left px-4 py-3 rounded-xl border border-blue-600 bg-gradient-to-r from-blue-600/10 to-blue-500/10 hover:from-blue-600/20 hover:to-blue-500/20 transition-all text-sm text-fill-color/90 hover:text-fill-color shadow-sm cursor-pointer group">
            <span className="relative z-10">Explain repository details</span>
          </button>
          <button onClick={() => onSend("Help me summarize data")} className="relative text-left px-4 py-3 rounded-xl border border-blue-600 bg-gradient-to-r from-blue-600/10 to-blue-500/10 hover:from-blue-600/20 hover:to-blue-500/20 transition-all text-sm text-fill-color/90 hover:text-fill-color shadow-sm cursor-pointer group">
            <span className="relative z-10">Help me summarize data</span>
          </button>
      </div>
    </div>
  );
});

export default function NwwOneeAIChat() {
  const isOpen = useChatSelector(s => s.isOpen);
  const messages = useChatSelector(s => s.messages);
  const inputValue = useChatSelector(s => s.inputValue);
  const isTyping = useChatSelector(s => s.isTyping);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'chat' | 'user' | 'history'>('chat');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback((text: string) => {
    if (!text.trim() || chatStore._state.isTyping) return;
    
    chatStore.setMessages(prev => [...prev, { role: 'user', content: text }]);
    chatStore.setInputValue('');
    chatStore.setIsTyping(true);

    setTimeout(() => {
      chatStore.setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, this feature is still under development.' }]);
      chatStore.setIsTyping(false);
    }, 1200);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(chatStore._state.inputValue);
    }
  }, [handleSend]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    chatStore.setInputValue(e.target.value);
  }, []);

  const messageList = useMemo(() => (
    messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)
  ), [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Card */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chat-panel"
            variants={chatPanelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={chatPanelTransition}
            style={{ willChange: 'transform, opacity' }}
            className="w-[380px] max-w-[calc(100vw-32px)] bg-[var(--card-color2)] border-color rounded-2xl overflow-hidden flex flex-col origin-bottom-right"
          >
          {/* Header */}
          <ChatHeader activeView={activeView} setActiveView={setActiveView} />

          {/* Body */}
          <div className="flex-1 flex flex-col bg-transparent overflow-hidden">
            {activeView === 'chat' && (
              <>
                {messages.length === 0 ? (
                  <StarterButtons onSend={handleSend} />
            ) : (
              <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5 max-h-[350px] scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
                {messageList}
                
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
              </>
            )}

            {activeView === 'user' && (
              <div className="flex-1 flex flex-col items-center justify-center p-5 pb-2 text-center min-h-[300px] relative">
                <button
                  onClick={() => setActiveView('chat')}
                  className="absolute top-5 left-5 flex items-center gap-2 text-fill-color/70 hover:text-fill-color transition-colors cursor-pointer"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to chat</span>
                </button>
                <button disabled className="flex items-center gap-3 px-5 py-2.5 border border-color rounded-xl cursor-not-allowed bg-[var(--card-color)] text-fill-color shadow-sm">
                  <FcGoogle className="w-5 h-5" />
                  <span className="text-sm font-medium">Login with Google</span>
                </button>
                <p className="mt-4 text-xs text-fill-color/70 font-medium">Currently in development</p>
              </div>
            )}

            {activeView === 'history' && (
              <div className="flex-1 flex flex-col items-center justify-center p-5 pb-2 text-center min-h-[300px] relative">
                <button
                  onClick={() => setActiveView('chat')}
                  className="absolute top-5 left-5 flex items-center gap-2 text-fill-color/70 hover:text-fill-color transition-colors cursor-pointer"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to chat</span>
                </button>
                <MdHistory className="w-16 h-16 text-fill-color/30 mb-1" />
                <h4 className="text-sm font-semibold text-fill-color mb-2">No history</h4>
                <p className="text-xs text-fill-color/70 font-medium">Currently in development</p>
              </div>
            )}
          </div>

          {/* Footer (Input) */}
          {activeView === 'chat' && (
            <div className="p-4 bg-transparent pb-5">
            <div className="relative flex items-center justify-between border-color glass-card rounded-full px-2 py-2 shadow-sm">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
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
          )}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'none' }} aria-hidden="true">
        <img src={HI_IMAGE_URL} alt="preload" />
      </div>

      {/* Chat Button */}
      <button
        onClick={() => chatStore.setIsOpen(!chatStore._state.isOpen)}
        className="w-14 h-14 rounded-full overflow-hidden bg-blue-600/20 hover:bg-blue-600/30 transition-all flex items-center justify-center border border-blue-600/30 shadow-lg shadow-blue-600/20 cursor-pointer hover:scale-105 active:scale-95"
      >
        <img
          src={AVATAR_URL}
          alt="NwwOnee AI"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </button>
    </div>
  );
}
