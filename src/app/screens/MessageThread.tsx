import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'seeker' | 'employer';
  timestamp: string;
}

interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  employerName: string;
  seekerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) return time;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return `Yesterday ${time}`;

  return `${date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })} ${time}`;
}

export default function MessageThread() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const conversation = location.state?.conversation as Conversation | undefined;

  const [messages, setMessages] = useState<Message[]>(
    conversation?.messages || []
  );
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark conversation as read on mount
  useEffect(() => {
    if (!conversation) return;
    try {
      const stored = localStorage.getItem('conversations');
      if (!stored) return;
      const convos: Conversation[] = JSON.parse(stored);
      const idx = convos.findIndex((c) => c.id === conversation.id);
      if (idx !== -1 && convos[idx].unread) {
        convos[idx].unread = false;
        localStorage.setItem('conversations', JSON.stringify(convos));
      }
    } catch {
      /* ignore */
    }
  }, [conversation]);

  if (!conversation) {
    return (
      <div
        className="min-h-full flex items-center justify-center"
        style={{ backgroundColor: AppColors.surfaceLight }}
      >
        <div className="text-center px-5">
          <div className="text-5xl mb-4">💬</div>
          <h2
            className="text-xl mb-2"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              color: AppColors.textDark,
            }}
          >
            Conversation Not Found
          </h2>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: AppColors.textMuted,
            }}
          >
            This conversation may no longer be available.
          </p>
          <button
            onClick={() => navigate('/messages')}
            className="mt-6 px-6 py-3 rounded-2xl"
            style={{
              backgroundColor: AppColors.greenLight,
              color: AppColors.surfaceWhite,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
            }}
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      sender: 'seeker',
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');

    // Update conversation in localStorage
    try {
      const stored = localStorage.getItem('conversations');
      const convos: Conversation[] = stored ? JSON.parse(stored) : [];
      const idx = convos.findIndex((c) => c.id === conversation.id);
      if (idx !== -1) {
        convos[idx].messages = updatedMessages;
        convos[idx].lastMessage = text;
        convos[idx].lastMessageTime = newMessage.timestamp;
        localStorage.setItem('conversations', JSON.stringify(convos));
      }
    } catch {
      /* ignore */
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const initial = conversation.employerName.charAt(0).toUpperCase();

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: AppColors.surfaceLight }}
    >
      {/* Header */}
      <div
        className="px-4 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <button
          onClick={() => navigate('/messages')}
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        {/* Employer avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: AppColors.greenLight }}
        >
          <span
            className="text-white"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
            }}
          >
            {initial}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h1
            className="text-white truncate"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
            }}
          >
            {conversation.employerName}
          </h1>
          <p
            className="text-white/70 truncate"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
            }}
          >
            {conversation.jobTitle}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="max-w-md mx-auto px-4 py-4 pb-4 space-y-3">
          {messages.map((msg) => {
            const isSeeker = msg.sender === 'seeker';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isSeeker ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className="px-4 py-3 max-w-[80%]"
                  style={{
                    backgroundColor: isSeeker
                      ? AppColors.greenLight
                      : AppColors.surfaceWhite,
                    color: isSeeker
                      ? AppColors.surfaceWhite
                      : AppColors.textDark,
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    borderRadius: isSeeker
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    boxShadow: isSeeker
                      ? 'none'
                      : '0 1px 4px rgba(0, 0, 0, 0.06)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word' as const,
                  }}
                >
                  {msg.text}
                </div>
                <span
                  className="mt-1 px-1"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    color: AppColors.textMuted,
                  }}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div
        className="px-4 py-3 flex items-end gap-3 flex-shrink-0"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          borderTop: `1px solid ${AppColors.border}`,
        }}
      >
        <div className="flex-1">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('messageThread.type_message')}
            rows={1}
            className="w-full px-4 py-3 rounded-2xl resize-none focus:outline-none"
            style={{
              backgroundColor: AppColors.surfaceLight,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              color: AppColors.textDark,
              border: `1px solid ${AppColors.border}`,
              maxHeight: '100px',
              overflowY: 'auto',
            }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity"
          style={{
            backgroundColor: inputText.trim()
              ? AppColors.greenLight
              : AppColors.textMuted,
            opacity: inputText.trim() ? 1 : 0.5,
            cursor: inputText.trim() ? 'pointer' : 'default',
          }}
        >
          <Send
            className="w-5 h-5 text-white"
            style={{ marginLeft: '2px' }}
          />
        </button>
      </div>
    </div>
  );
}
