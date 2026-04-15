import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';
import { formatTime } from '../utils/sportConfig';

// ─── Chat List ────────────────────────────────────────────────────────────────

export function ChatListScreen() {
  const { conversations, setSelectedConversation, setActiveScreen } = useApp();

  const openDM = (convoId: string) => {
    setSelectedConversation(convoId);
    setActiveScreen('chat-dm');
  };

  return (
    <div className="screen">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-xl font-black" style={{ color: '#F0F0F5' }}>Messages</h1>
        <p className="text-xs mt-0.5" style={{ color: '#5A5A70' }}>
          {conversations.length} conversations
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
            style={{ background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            💬
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#F0F0F5' }}>No messages yet</h3>
          <p className="text-sm" style={{ color: '#5A5A70' }}>
            Match with someone and start a conversation.
          </p>
        </div>
      ) : (
        <div className="flex flex-col px-4 gap-1">
          {conversations.map((convo, i) => {
            const lastMsg = convo.messages[convo.messages.length - 1];
            return (
              <motion.button
                key={convo.id}
                onClick={() => openDM(convo.id)}
                className="flex items-center gap-3.5 px-3 py-3.5 rounded-2xl text-left w-full transition-all duration-200"
                style={{
                  background: convo.unread > 0 ? 'rgba(26,26,38,0.9)' : 'transparent',
                  border: convo.unread > 0 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Avatar with unread dot */}
                <div className="relative flex-shrink-0">
                  <Avatar src={convo.user.avatar} name={convo.user.name} size="lg" />
                  {convo.unread > 0 && (
                    <div
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
                      style={{ background: '#C6F135', color: '#0A0A0F' }}
                    >
                      {convo.unread}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className="font-bold text-sm"
                      style={{ color: convo.unread > 0 ? '#F0F0F5' : '#A0A0B0' }}
                    >
                      {convo.user.name}
                    </span>
                    {lastMsg && (
                      <span className="text-[10px]" style={{ color: '#5A5A70' }}>
                        {formatTime(new Date(lastMsg.timestamp))}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs truncate"
                    style={{ color: convo.unread > 0 ? '#A0A0B0' : '#5A5A70' }}
                  >
                    {lastMsg
                      ? `${lastMsg.senderId === 'me' ? 'You: ' : ''}${lastMsg.text}`
                      : 'Matched — say hi!'}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── DM Screen ────────────────────────────────────────────────────────────────

export function DMScreen() {
  const { conversations, selectedConversationId, sendMessage, setActiveScreen, setActiveTab } = useApp();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const convo = conversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convo?.messages.length]);

  if (!convo) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(convo.id, input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openSessionPlan = () => {
    setActiveScreen('session-plan');
  };

  return (
    <div className="screen-no-nav flex flex-col" style={{ height: '100vh' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 pt-12 pb-3 flex-shrink-0"
        style={{
          background: 'rgba(10,10,15,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <button
          onClick={() => { setActiveScreen('chat'); setActiveTab('chat'); }}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(26,26,38,0.8)' }}
        >
          <ChevronLeft size={20} style={{ color: '#A0A0B0' }} />
        </button>

        <Avatar src={convo.user.avatar} name={convo.user.name} size="md" />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: '#F0F0F5' }}>{convo.user.name}</p>
          <p className="text-[11px]" style={{ color: '#5A5A70' }}>
            {convo.user.sports.join(' · ')} · {convo.user.location}
          </p>
        </div>

        <button
          onClick={openSessionPlan}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{
            background: 'rgba(198,241,53,0.1)',
            border: '1px solid rgba(198,241,53,0.25)',
            color: '#C6F135',
          }}
        >
          <Calendar size={12} />
          Plan
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {convo.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Avatar src={convo.user.avatar} name={convo.user.name} size="xl" className="mb-4" />
            <p className="font-bold text-sm mb-1" style={{ color: '#F0F0F5' }}>
              You matched with {convo.user.name}!
            </p>
            <p className="text-xs" style={{ color: '#5A5A70' }}>
              Say hi and plan your first session.
            </p>
          </div>
        )}

        {convo.messages.map((msg, i) => {
          const isMe = msg.senderId === 'me';
          const showAvatar = !isMe && (i === 0 || convo.messages[i - 1]?.senderId !== msg.senderId);

          return (
            <motion.div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {!isMe && (
                <div className="w-7 flex-shrink-0">
                  {showAvatar && (
                    <Avatar src={convo.user.avatar} name={convo.user.name} size="sm" />
                  )}
                </div>
              )}
              <div
                className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={{
                  background: isMe
                    ? 'linear-gradient(135deg, #C6F135, #A8D020)'
                    : 'rgba(26,26,38,0.9)',
                  border: isMe ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  color: isMe ? '#0A0A0F' : '#F0F0F5',
                  borderBottomRightRadius: isMe ? 6 : 20,
                  borderBottomLeftRadius: isMe ? 20 : 6,
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex-shrink-0 px-4 pb-8 pt-3"
        style={{
          background: 'rgba(10,10,15,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <input
            className="flex-1 px-4 py-3 rounded-2xl text-sm"
            style={{
              background: 'rgba(26,26,38,0.9)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0F0F5',
              outline: 'none',
            }}
            placeholder="Send a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              background: input.trim()
                ? 'linear-gradient(135deg, #C6F135, #A8D020)'
                : 'rgba(26,26,38,0.8)',
            }}
          >
            <Send
              size={17}
              strokeWidth={2.5}
              style={{ color: input.trim() ? '#0A0A0F' : '#5A5A70' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
