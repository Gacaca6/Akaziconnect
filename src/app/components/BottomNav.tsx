import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { Briefcase, FileText, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'jobs' | 'applied' | 'messages' | 'profile';
}

const tabs = [
  { id: 'jobs', icon: Briefcase, label: 'Jobs', path: '/swipe-feed' },
  { id: 'applied', icon: FileText, label: 'Applied', path: '/applied' },
  { id: 'messages', icon: MessageCircle, label: 'Messages', path: '/messages' },
  { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
] as const;

export default function BottomNav({ activeTab }: BottomNavProps) {
  const navigate = useNavigate();

  return (
    <div
      className="border-t px-2 py-2"
      style={{
        backgroundColor: AppColors.surfaceWhite,
        borderColor: AppColors.border
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
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all"
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
                  color: isActive ? AppColors.forestGreen : AppColors.textMuted
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
