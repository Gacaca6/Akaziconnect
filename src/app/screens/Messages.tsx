import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { Search } from 'lucide-react';
import BottomNav from '../components/BottomNav';

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

function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem('conversations');
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return [];
}

function timeAgo(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}

export default function Messages() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const conversations = loadConversations();

  const filtered = conversations.filter(
    (c) =>
      c.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: AppColors.surfaceLight }}
    >
      {/* Header */}
      <div
        className="px-5 py-6 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <h1
          className="text-2xl text-white mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
        >
          {t('messages.title')}
        </h1>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: AppColors.textMuted }}
          />
          <input
            type="text"
            placeholder={t('messages.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl"
            style={{
              backgroundColor: AppColors.surfaceWhite,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              border: 'none',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-8 py-20">
            <div className="text-6xl mb-4">💬</div>
            <h2
              className="text-xl mb-2 text-center"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              {searchQuery ? 'No results found' : t('messages.empty_title')}
            </h2>
            <p
              className="text-center mb-6"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: AppColors.textMuted,
              }}
            >
              {searchQuery
                ? 'Try searching with different keywords'
                : t('messages.empty_subtitle')}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/swipe-feed')}
                className="px-6 py-3 rounded-2xl"
                style={{
                  backgroundColor: AppColors.greenLight,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: AppColors.surfaceWhite,
                }}
              >
                {t('messages.browse_jobs')}
              </button>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {filtered.map((conv) => {
              const initial = conv.employerName.charAt(0).toUpperCase();

              return (
                <button
                  key={conv.id}
                  onClick={() =>
                    navigate('/message-thread', { state: { conversation: conv } })
                  }
                  className="w-full px-5 py-4 border-b text-left transition-colors"
                  style={{
                    backgroundColor: conv.unread
                      ? AppColors.greenBackground
                      : AppColors.surfaceWhite,
                    borderColor: AppColors.border,
                  }}
                >
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: AppColors.greenLight }}
                    >
                      <span
                        className="text-white"
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 700,
                          fontSize: '18px',
                        }}
                      >
                        {initial}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3
                          className="text-sm truncate pr-2"
                          style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: 700,
                            color: AppColors.textDark,
                          }}
                        >
                          {conv.employerName}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {conv.unread && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: AppColors.aiAmber }}
                            />
                          )}
                          <span
                            className="text-[13px]"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              color: AppColors.textMuted,
                            }}
                          >
                            {timeAgo(conv.lastMessageTime)}
                          </span>
                        </div>
                      </div>

                      <p
                        className="text-[13px] truncate mb-1"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          color: AppColors.textMuted,
                        }}
                      >
                        {conv.jobTitle}
                      </p>

                      <p
                        className="text-sm truncate"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontWeight: conv.unread ? 600 : 400,
                          color: conv.unread
                            ? AppColors.textDark
                            : AppColors.textMuted,
                        }}
                      >
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="messages" />
    </div>
  );
}
