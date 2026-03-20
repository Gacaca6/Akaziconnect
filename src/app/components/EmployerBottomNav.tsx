import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { Home, ClipboardList, MessageCircle, User } from 'lucide-react';

interface EmployerBottomNavProps {
  activeTab: 'home' | 'jobs' | 'messages' | 'profile';
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home', path: '/employer-dashboard' },
  { id: 'jobs', icon: ClipboardList, label: 'My Jobs', path: '/my-listings' },
  { id: 'messages', icon: MessageCircle, label: 'Messages', path: '/employer-messages' },
  { id: 'profile', icon: User, label: 'Profile', path: '/employer-profile' },
] as const;

export default function EmployerBottomNav({ activeTab }: EmployerBottomNavProps) {
  const navigate = useNavigate();

  return (
    <div
      className="border-t px-2 py-2 flex-shrink-0"
      style={{
        backgroundColor: AppColors.surfaceWhite,
        borderColor: AppColors.border,
      }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all"
              style={{
                backgroundColor: isActive ? AppColors.greenBackground : 'transparent',
              }}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: isActive ? AppColors.forestGreen : AppColors.textMuted }}
              />
              <span
                className="text-xs"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? AppColors.forestGreen : AppColors.textMuted,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
