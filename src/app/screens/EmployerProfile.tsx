import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { ArrowLeft, LogOut, Settings, ChevronRight } from 'lucide-react';
import EmployerBottomNav from '../components/EmployerBottomNav';

interface EmployerProfileData {
  orgName: string;
  employerType: string;
  location: string;
  contactMethods: string[];
  whatsapp: string;
  jobTypes: string[];
  typicalWorkers: string;
}

function loadProfile(): EmployerProfileData | null {
  try {
    const stored = localStorage.getItem('employerProfile');
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return null;
}

export default function EmployerProfile() {
  const navigate = useNavigate();
  const profile = loadProfile();

  const orgName = profile?.orgName || '—';
  const employerType = profile?.employerType || '—';
  const location = profile?.location || '—';
  const initials = profile
    ? orgName
        .split(' ')
        .map((w) => w.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const handleSignOut = () => {
    navigate('/sign-out');
  };

  /* Notifications toggle */
  const [notificationsOn, setNotificationsOn] = useState(() => {
    try { return localStorage.getItem('employerNotificationsEnabled') === 'true'; } catch { return true; }
  });
  const toggleNotifications = () => {
    const next = !notificationsOn;
    setNotificationsOn(next);
    localStorage.setItem('employerNotificationsEnabled', String(next));
  };

  const menuItems = [
    { emoji: '🏢', label: 'Organisation Details', action: () => navigate('/employer-profile-setup') },
    { emoji: '🔒', label: 'Privacy & Security', action: () => navigate('/privacy') },
    { emoji: '❓', label: 'Help & Support', action: () => navigate('/help') },
  ];

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: AppColors.surfaceLight }}
    >
      {/* Header */}
      <div
        className="px-5 pt-5 pb-6 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        {/* Top row */}
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
            Employer Profile
          </h1>
          <button
            onClick={() => navigate('/privacy')}
            className="p-2 rounded-xl"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Avatar + Org Info */}
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
            {orgName}
          </h2>
          <p
            className="text-white/70 mb-1"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
          >
            {employerType}
          </p>
          <p
            className="text-white/70"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}
          >
            📍 {location}
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="max-w-md mx-auto px-5 py-6 pb-24 space-y-4">
          {/* Menu Items */}
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
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center justify-between px-5 py-4"
                style={{
                  borderBottom:
                    index < menuItems.length - 1
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
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl"
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
      <EmployerBottomNav activeTab="profile" />
    </div>
  );
}
