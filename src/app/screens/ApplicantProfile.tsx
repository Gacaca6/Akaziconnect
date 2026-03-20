import { useState } from 'react';
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
  status?: string;
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

export default function ApplicantProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const conversation = (location.state as any)?.conversation as Conversation | undefined;

  const [accepted, setAccepted] = useState(() => {
    if (!conversation) return false;
    // Check current status from localStorage
    try {
      const stored = localStorage.getItem('conversations');
      if (stored) {
        const convs: Conversation[] = JSON.parse(stored);
        const match = convs.find((c) => c.id === conversation.id);
        if (match?.status === 'accepted') return true;
      }
    } catch { /* ignore */ }
    return conversation.status === 'accepted';
  });

  const [showToast, setShowToast] = useState(false);

  if (!conversation) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
        <div
          className="px-5 py-6 flex-shrink-0"
          style={{ backgroundColor: AppColors.forestDark }}
        >
          <button onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-white" />
            <span className="text-white" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>Back</span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-5">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}>
              Profile Not Found
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}>
              Please go back and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const seekerName = conversation.seekerName || 'Unknown';
  const initials = seekerName
    .split(' ')
    .map((w: string) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const applicationMessage = conversation.messages?.[0]?.text || conversation.lastMessage || 'No application message';
  const applicationTime = conversation.messages?.[0]?.timestamp || conversation.lastMessageTime;

  const handleAccept = () => {
    try {
      const stored = localStorage.getItem('conversations');
      if (stored) {
        const convs: Conversation[] = JSON.parse(stored);
        const updated = convs.map((c) =>
          c.id === conversation.id ? { ...c, status: 'accepted' } : c
        );
        localStorage.setItem('conversations', JSON.stringify(updated));
      }
    } catch { /* ignore */ }
    setAccepted(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
      {/* Toast */}
      {showToast && (
        <div
          className="fixed top-4 left-1/2 z-50 px-5 py-3 rounded-2xl"
          style={{
            transform: 'translateX(-50%)',
            backgroundColor: AppColors.forestGreen,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <span
            className="text-white"
            style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14 }}
          >
            ✅ Applicant marked as accepted
          </span>
        </div>
      )}

      {/* Header + Profile Card */}
      <div
        className="px-5 pt-5 pb-8 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        {/* Top row */}
        <div className="flex items-center gap-4 mb-6">
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
              Applicant Profile
            </h1>
          </div>
        </div>

        {/* Avatar + Name */}
        <div className="flex flex-col items-center">
          <div
            className="rounded-full flex items-center justify-center mb-3"
            style={{
              width: 80,
              height: 80,
              background: `linear-gradient(135deg, ${AppColors.forestGreen}, ${AppColors.greenLight})`,
            }}
          >
            <span
              className="text-white"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 28,
              }}
            >
              {initials}
            </span>
          </div>

          <h2
            className="text-white mb-1"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            {seekerName}
          </h2>

          <p
            className="text-white/70 mb-1"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}
          >
            Applied for: {conversation.jobTitle}
          </p>

          <p
            className="text-white/50"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}
          >
            {timeAgo(applicationTime)}
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        <div className="max-w-md mx-auto px-5 py-5 space-y-5 pb-8">
          {/* Application message */}
          <div>
            <h3
              className="text-base mb-3"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              📝 Their Application
            </h3>
            <div
              className="p-4 rounded-2xl"
              style={{ backgroundColor: AppColors.greenBackground }}
            >
              <p
                className="text-sm leading-relaxed"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: AppColors.textDark,
                  lineHeight: 1.7,
                }}
              >
                {applicationMessage}
              </p>
            </div>
          </div>

          {/* Skills / Match section */}
          <div>
            <h3
              className="text-base mb-3"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              💪 Skills
            </h3>
            <div
              className="p-4 rounded-2xl"
              style={{ backgroundColor: AppColors.greenBackground }}
            >
              <p
                className="text-sm"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: AppColors.textDark,
                }}
              >
                Profile details shared via application message
              </p>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3
              className="text-base mb-3"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              📞 Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/employer-message-thread', { state: { conversation } })}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.97]"
                style={{
                  backgroundColor: AppColors.greenLight,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(26,122,74,0.2)',
                }}
              >
                <span
                  className="text-white"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  💬 Send Message
                </span>
              </button>

              <button
                onClick={accepted ? undefined : handleAccept}
                disabled={accepted}
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.97]"
                style={{
                  backgroundColor: accepted ? AppColors.greenBackground : 'transparent',
                  border: `2px solid ${AppColors.forestGreen}`,
                  cursor: accepted ? 'default' : 'pointer',
                  opacity: accepted ? 0.8 : 1,
                }}
              >
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: 16,
                    color: AppColors.forestGreen,
                  }}
                >
                  {accepted ? '✅ Accepted' : '✅ Mark as Accepted'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
