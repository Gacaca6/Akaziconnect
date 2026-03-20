import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { Home, ClipboardList, MessageCircle, User } from 'lucide-react';

interface EmployerBottomNavProps {
  activeTab: 'home' | 'jobs' | 'messages' | 'profile';
}

const tabDefs = [
  { id: 'home', icon: Home, labelKey: 'nav.home', path: '/employer-dashboard' },
  { id: 'jobs', icon: ClipboardList, labelKey: 'nav.my_jobs', path: '/my-listings' },
  { id: 'messages', icon: MessageCircle, labelKey: 'nav.messages', path: '/employer-messages' },
  { id: 'profile', icon: User, labelKey: 'nav.profile', path: '/employer-profile' },
] as const;

export default function EmployerBottomNav({ activeTab }: EmployerBottomNavProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className="border-t px-2 py-2 flex-shrink-0"
      style={{
        backgroundColor: AppColors.surfaceWhite,
        borderColor: AppColors.border,
      }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabDefs.map((tab) => {
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
                className="text-[13px]"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? AppColors.forestGreen : AppColors.textMuted,
                }}
              >
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
