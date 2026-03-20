import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { Briefcase, FileText, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'jobs' | 'applied' | 'messages' | 'profile';
}

const tabDefs = [
  { id: 'jobs', icon: Briefcase, labelKey: 'nav.jobs', path: '/swipe-feed' },
  { id: 'applied', icon: FileText, labelKey: 'nav.applied', path: '/applied' },
  { id: 'messages', icon: MessageCircle, labelKey: 'nav.messages', path: '/messages' },
  { id: 'profile', icon: User, labelKey: 'nav.profile', path: '/profile' },
] as const;

export default function BottomNav({ activeTab }: BottomNavProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className="border-t px-2 py-2"
      style={{
        backgroundColor: AppColors.surfaceWhite,
        borderColor: AppColors.border
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
                className="text-[13px]"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? AppColors.forestGreen : AppColors.textMuted
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
