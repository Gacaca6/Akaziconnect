import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { ArrowLeft, Settings, ChevronRight, LogOut } from 'lucide-react';
import BottomNav from '../components/BottomNav';

/* ── Skill → Emoji map (matches SeekerProfileSetup) ──────────── */
const SKILL_EMOJIS: Record<string, string> = {
  Farming: '🌾',
  Construction: '🏗️',
  Driving: '🚗',
  Delivery: '📦',
  Gardening: '🌿',
  Cooking: '🍳',
  Cleaning: '🧹',
  Sales: '📱',
  Repairs: '🔧',
  Livestock: '🐄',
  Forestry: '🌲',
  Masonry: '🧱',
  Irrigation: '💧',
  Teaching: '🎓',
  'Health Worker': '🏥',
};

/* ── Types ────────────────────────────────────────────────────── */
interface SeekerProfile {
  firstName: string;
  lastName: string;
  location: string;
  skills: string[];
  availability: string;
  daysPerWeek: string;
  language: string;
}

function loadProfile(): SeekerProfile | null {
  try {
    const saved = localStorage.getItem('seekerProfile');
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return null;
}

/* ── Component ────────────────────────────────────────────────── */
export default function Profile() {
  const navigate = useNavigate();
  const profile = loadProfile();

  /* Derived values — safe fallbacks */
  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : '—';
  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : '?';
  const location = profile?.location || '—';
  const skills = profile?.skills || [];
  const availability = profile?.availability || '—';
  const daysPerWeek = profile?.daysPerWeek || '—';
  const language = profile?.language || '—';

  /* Stats from localStorage */
  const applicationCount = (() => {
    try {
      return parseInt(localStorage.getItem('applicationCount') || '0', 10);
    } catch {
      return 0;
    }
  })();

  const savedCount = (() => {
    try {
      const stored = localStorage.getItem('savedJobs');
      if (stored) return JSON.parse(stored).length;
    } catch { /* ignore */ }
    return 0;
  })();

  /* Language display string */
  const languageDisplay = (() => {
    if (language === 'english') return '🇬🇧 English';
    if (language === 'kinyarwanda') return '🇷🇼 Kinyarwanda';
    if (language === 'bilingual') return '🇬🇧 English & 🇷🇼 Kinyarwanda';
    return '—';
  })();

  /* Notifications toggle */
  const [notificationsOn, setNotificationsOn] = useState(() => {
    try { return localStorage.getItem('notificationsEnabled') === 'true'; } catch { return true; }
  });
  const toggleNotifications = () => {
    const next = !notificationsOn;
    setNotificationsOn(next);
    localStorage.setItem('notificationsEnabled', String(next));
  };

  /* Account menu rows */
  const accountItems = [
    { emoji: '🌍', label: 'Language Settings', action: () => navigate('/seeker-profile-setup', { state: { initialStep: 3 } }) },
    { emoji: '🔒', label: 'Privacy & Security', action: () => navigate('/privacy') },
    { emoji: '❓', label: 'Help & Support', action: () => navigate('/help') },
    { emoji: '📞', label: 'Contact Us', action: () => navigate('/contact') },
  ];

  const handleSignOut = () => {
    navigate('/sign-out');
  };

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: AppColors.surfaceLight }}
    >
      {/* ── Header (dark green, not scrollable) ─────────────────── */}
      <div
        className="px-5 pt-5 pb-6 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        {/* Top row: Back / Title / Settings */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <h1
            className="text-white"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
            }}
          >
            My Profile
          </h1>

          <button
            onClick={() => navigate('/privacy')}
            className="p-2 rounded-xl"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Avatar + Name + Location + Edit button */}
        <div className="flex flex-col items-center">
          <div
            className="rounded-full flex items-center justify-center mb-3"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: AppColors.greenLight,
            }}
          >
            <span
              className="text-white"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '28px',
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
              fontSize: '22px',
            }}
          >
            {fullName}
          </h2>

          <p
            className="text-white/70 mb-4"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
          >
            📍 {location}
          </p>

          <button
            onClick={() => navigate('/seeker-profile-setup')}
            className="px-5 py-2 rounded-full"
            style={{
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              backgroundColor: 'transparent',
            }}
          >
            <span
              className="text-white"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              Edit Profile
            </span>
          </button>
        </div>
      </div>

      {/* ── Scrollable content — takes remaining height ─────────── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: AppColors.surfaceLight }}>
        <div className="max-w-md mx-auto px-5 py-6 pb-24 space-y-4">
        {/* Skills Section */}
        <div
          className="rounded-3xl p-5"
          style={{
            backgroundColor: AppColors.surfaceWhite,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: AppColors.textDark,
              }}
            >
              My Skills
            </h3>
            <button onClick={() => navigate('/seeker-profile-setup', { state: { initialStep: 1 } })}>
              <span
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: AppColors.forestGreen,
                }}
              >
                Edit Skills
              </span>
            </button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full"
                  style={{
                    backgroundColor: AppColors.greenBackground,
                    border: `1px solid ${AppColors.forestGreen}20`,
                  }}
                >
                  <span className="text-sm">{SKILL_EMOJIS[skill] || '💼'}</span>
                  <span
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: AppColors.forestGreen,
                    }}
                  >
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: AppColors.textMuted,
              }}
            >
              No skills added yet
            </p>
          )}
        </div>

        {/* Availability Section */}
        <div
          className="rounded-3xl p-5"
          style={{
            backgroundColor: AppColors.surfaceWhite,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <h3
            className="mb-3"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: AppColors.textDark,
            }}
          >
            Availability
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">📅</span>
              <div>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px',
                    color: AppColors.textMuted,
                  }}
                >
                  Available
                </p>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: AppColors.textDark,
                    textTransform: 'capitalize',
                  }}
                >
                  {availability.replace(/-/g, ' ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">⏱️</span>
              <div>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px',
                    color: AppColors.textMuted,
                  }}
                >
                  Days per week
                </p>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: AppColors.textDark,
                  }}
                >
                  {daysPerWeek}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div
          className="rounded-3xl p-5"
          style={{
            backgroundColor: AppColors.surfaceWhite,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <h3
            className="mb-3"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: AppColors.textDark,
            }}
          >
            Application Language
          </h3>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              color: AppColors.textDark,
            }}
          >
            {languageDisplay}
          </p>
        </div>

        {/* Stats Section */}
        <div
          className="rounded-3xl p-5"
          style={{
            backgroundColor: AppColors.surfaceWhite,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <h3
            className="mb-3"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: AppColors.textDark,
            }}
          >
            My Activity
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '📋', value: applicationCount.toString(), label: 'Applied', action: () => navigate('/applied') },
              { emoji: '💼', value: savedCount.toString(), label: 'Saved', action: () => navigate('/saved-jobs') },
              { emoji: '⭐', value: '—', label: 'Rating', action: undefined },
            ].map((stat) => (
              <button
                key={stat.label}
                onClick={stat.action}
                className="rounded-2xl p-3 text-center"
                style={{ backgroundColor: AppColors.greenBackground, border: 'none', cursor: stat.action ? 'pointer' : 'default' }}
              >
                <div className="text-xl mb-1">{stat.emoji}</div>
                <p
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: AppColors.textDark,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '11px',
                    color: AppColors.textMuted,
                  }}
                >
                  {stat.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Account Section */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            backgroundColor: AppColors.surfaceWhite,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          {/* Notifications toggle row */}
          <div
            className="w-full flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${AppColors.border}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: AppColors.greenBackground }}
              >
                <span className="text-base">🔔</span>
              </div>
              <span
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: AppColors.textDark,
                }}
              >
                Notifications
              </span>
            </div>
            <button
              onClick={toggleNotifications}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{
                backgroundColor: notificationsOn ? AppColors.greenLight : AppColors.textMuted,
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ left: notificationsOn ? '22px' : '2px' }}
              />
            </button>
          </div>

          {/* Navigable menu rows */}
          {accountItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center justify-between px-5 py-4"
              style={{
                borderBottom:
                  index < accountItems.length - 1
                    ? `1px solid ${AppColors.border}`
                    : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: AppColors.greenBackground }}
                >
                  <span className="text-base">{item.emoji}</span>
                </div>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: AppColors.textDark,
                  }}
                >
                  {item.label}
                </span>
              </div>
              <ChevronRight
                className="w-5 h-5"
                style={{ color: AppColors.textMuted }}
              />
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl mb-4"
          style={{
            backgroundColor: AppColors.surfaceWhite,
            border: `2px solid ${AppColors.skipRed}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <LogOut className="w-5 h-5" style={{ color: AppColors.skipRed }} />
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: AppColors.skipRed,
            }}
          >
            Sign Out
          </span>
        </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="profile" />
    </div>
  );
}
