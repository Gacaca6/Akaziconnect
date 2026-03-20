import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { Clock, CheckCircle, ChevronRight } from 'lucide-react';
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

function loadApplications(): Conversation[] {
  try {
    const stored = localStorage.getItem('conversations');
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

function hasEmployerReply(conv: Conversation): boolean {
  return conv.messages.some((m) => m.sender === 'employer');
}

export default function AppliedJobs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const applications = loadApplications();

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
          className="text-2xl text-white"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
          }}
        >
          {t('appliedJobs.title')}
        </h1>
        <p
          className="text-sm text-white/70 mt-1"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      {/* Applications List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="max-w-md mx-auto px-5 py-6 pb-24 space-y-3">
          {applications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📋</div>
              <h2
                className="text-2xl mb-2"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  color: AppColors.textDark,
                }}
              >
                {t('appliedJobs.empty_title')}
              </h2>
              <p
                className="mb-6"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: AppColors.textMuted,
                }}
              >
                {t('appliedJobs.empty_subtitle')}
              </p>
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
                {t('appliedJobs.browse_jobs')}
              </button>
            </div>
          ) : (
            applications.map((conv) => {
              const accepted = hasEmployerReply(conv);
              const statusColor = accepted
                ? AppColors.greenLight
                : AppColors.aiAmber;
              const statusLabel = accepted ? t('appliedJobs.accepted') : t('appliedJobs.pending');
              const StatusIcon = accepted ? CheckCircle : Clock;
              const initial = conv.employerName.charAt(0).toUpperCase();

              return (
                <button
                  key={conv.id}
                  onClick={() =>
                    navigate('/message-thread', {
                      state: { conversation: conv },
                    })
                  }
                  className="w-full rounded-2xl p-4 text-left"
                  style={{
                    backgroundColor: AppColors.surfaceWhite,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div className="flex gap-3">
                    {/* Employer Avatar */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${AppColors.forestGreen}, ${AppColors.forestDark})`,
                      }}
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

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className="text-base truncate pr-2"
                          style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: 700,
                            color: AppColors.textDark,
                          }}
                        >
                          {conv.jobTitle}
                        </h3>
                        <ChevronRight
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: AppColors.textMuted }}
                        />
                      </div>

                      <p
                        className="text-sm mb-2 truncate"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          color: AppColors.textMuted,
                        }}
                      >
                        {conv.employerName}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Status Badge */}
                        <div
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: `${statusColor}20`,
                          }}
                        >
                          <StatusIcon
                            className="w-3.5 h-3.5"
                            style={{ color: statusColor }}
                          />
                          <span
                            className="text-[13px]"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              fontWeight: 600,
                              color: statusColor,
                            }}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        {/* Date */}
                        <span
                          className="text-[13px]"
                          style={{
                            fontFamily: 'DM Sans, sans-serif',
                            color: AppColors.textMuted,
                          }}
                        >
                          {formatDate(conv.lastMessageTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="applied" />
    </div>
  );
}
