import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { Search } from 'lucide-react';
import EmployerBottomNav from '../components/EmployerBottomNav';

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

function loadEmployerConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem('conversations');
    if (!stored) return [];
    const all: Conversation[] = JSON.parse(stored);

    // Filter to conversations matching the logged-in employer's org name
    const profileStored = localStorage.getItem('employerProfile');
    if (!profileStored) return all; // Show all if no profile (fallback)
    const profile = JSON.parse(profileStored);
    const orgName = profile?.orgName;
    if (!orgName) return all;

    return all.filter(
      (c) => c.employerName.toLowerCase() === orgName.toLowerCase()
    );
  } catch {
    return [];
  }
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

export default function EmployerMessages() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const conversations = loadEmployerConversations();

  const filtered = conversations.filter(
    (c) =>
      c.seekerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                onClick={() => navigate('/post-job')}
                className="px-6 py-3 rounded-2xl"
                style={{
                  backgroundColor: AppColors.greenLight,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: AppColors.surfaceWhite,
                }}
              >
                {t('myListings.post_job')}
              </button>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {filtered.map((conv) => {
              const initial = conv.seekerName.charAt(0).toUpperCase();

              return (
                <button
                  key={conv.id}
                  onClick={() =>
                    navigate('/employer-message-thread', {
                      state: { conversation: conv },
                    })
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
                      style={{ backgroundColor: AppColors.forestGreen }}
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
                          {conv.seekerName}
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
      <EmployerBottomNav activeTab="messages" />
    </div>
  );
}
