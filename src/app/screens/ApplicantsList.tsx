import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AppColors } from '../constants/colors';
import { ArrowLeft } from 'lucide-react';

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

const timeAgo = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
};

const hoursAgo = (dateStr: string): number => {
  const now = new Date();
  const date = new Date(dateStr);
  return Math.floor((now.getTime() - date.getTime()) / 3600000);
};

export default function ApplicantsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const job = (location.state as any)?.job;

  const [applicants, setApplicants] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!job) return;
    try {
      const stored = localStorage.getItem('conversations');
      if (stored) {
        const convs: Conversation[] = JSON.parse(stored);
        const matched = convs.filter(
          (c) => c.jobTitle.toLowerCase() === job.title.toLowerCase()
        );
        setApplicants(matched);
      }
    } catch { /* ignore */ }
  }, [job]);

  // Compute latest application time
  const latestHours = applicants.length > 0
    ? Math.min(...applicants.map((a) => hoursAgo(a.lastMessageTime)))
    : 0;

  if (!job) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
        <div
          className="px-5 py-6 flex-shrink-0"
          style={{ backgroundColor: AppColors.forestDark }}
        >
          <button onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-white" />
            <span
              className="text-white"
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}
            >
              Back
            </span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-5">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2
              className="text-xl mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
            >
              Job Not Found
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}>
              Please go back and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <div className="flex items-center gap-4 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 text-center pr-9">
            <h1
              className="text-lg text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
            >
              Applicants
            </h1>
            <p
              className="text-sm text-white/70 mt-0.5"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {job.title}
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="px-5 py-3 flex items-center gap-4 flex-shrink-0"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          borderBottom: `1px solid ${AppColors.border}`,
        }}
      >
        <span
          className="text-sm"
          style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, color: AppColors.textDark }}
        >
          👥 {applicants.length} total applicant{applicants.length !== 1 ? 's' : ''}
        </span>
        {applicants.length > 0 && (
          <span
            className="text-sm"
            style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}
          >
            🕐 Latest {latestHours < 1 ? 'just now' : `${latestHours}h ago`}
          </span>
        )}
      </div>

      {/* Content */}
      {applicants.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-5">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">👥</div>
            <h2
              className="text-xl mb-2"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              No applicants yet
            </h2>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: AppColors.textMuted,
                lineHeight: 1.6,
              }}
            >
              Share your job to attract workers
            </p>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
          <div className="px-5 py-4 space-y-3">
            {applicants.map((conv) => {
              const initial = conv.seekerName?.charAt(0)?.toUpperCase() || '?';
              // Get first seeker message as application preview
              const seekerMsg = conv.messages?.find((m) => m.sender === 'seeker');
              const preview = seekerMsg
                ? seekerMsg.text.length > 80
                  ? seekerMsg.text.substring(0, 80) + '...'
                  : seekerMsg.text
                : conv.lastMessage;

              return (
                <div
                  key={conv.id}
                  className="rounded-3xl p-4"
                  style={{
                    backgroundColor: AppColors.surfaceWhite,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Top row: avatar + name + time + unread */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${AppColors.forestGreen}, ${AppColors.forestDark})`,
                      }}
                    >
                      <span
                        className="text-white"
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 700,
                          fontSize: 16,
                        }}
                      >
                        {initial}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-base truncate"
                          style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: 700,
                            color: AppColors.textDark,
                          }}
                        >
                          {conv.seekerName}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          {conv.unread && (
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: AppColors.aiAmber }}
                            />
                          )}
                          <span
                            className="text-xs"
                            style={{
                              fontFamily: 'DM Sans, sans-serif',
                              color: AppColors.textMuted,
                            }}
                          >
                            {timeAgo(conv.lastMessageTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application preview */}
                  <p
                    className="text-sm mb-4"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: AppColors.textMuted,
                      lineHeight: 1.5,
                    }}
                  >
                    {preview}
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/applicant-profile', { state: { conversation: conv } })}
                      className="flex-1 py-2.5 rounded-2xl transition-transform active:scale-[0.97]"
                      style={{
                        backgroundColor: 'transparent',
                        border: `1.5px solid ${AppColors.forestGreen}`,
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: 600,
                        fontSize: 13,
                        color: AppColors.forestGreen,
                        cursor: 'pointer',
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate('/employer-message-thread', { state: { conversation: conv } })}
                      className="flex-1 py-2.5 rounded-2xl transition-transform active:scale-[0.97]"
                      style={{
                        backgroundColor: AppColors.greenLight,
                        border: 'none',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: 600,
                        fontSize: 13,
                        color: AppColors.surfaceWhite,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(26,122,74,0.2)',
                      }}
                    >
                      Message
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
