import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { LogOut } from 'lucide-react';

export default function SignOut() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignOut = () => {
    const keysToKeep = ['onboardingComplete'];
    const preserved: Record<string, string> = {};
    keysToKeep.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val) preserved[key] = val;
    });
    localStorage.clear();
    Object.entries(preserved).forEach(([k, v]) => localStorage.setItem(k, v));
    navigate('/role-selection');
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: AppColors.forestDark }}>
      {/* Top section — icon centered */}
      <div style={{ flex: '0 0 40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: AppColors.surfaceWhite,
          }}
        >
          <LogOut className="w-9 h-9" style={{ color: AppColors.forestGreen }} />
        </div>
      </div>

      {/* Bottom card */}
      <div
        style={{
          flex: '0 0 60%',
          backgroundColor: AppColors.surfaceWhite,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
        }}
      >
        <h1
          className="text-center mb-3"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 24,
            color: AppColors.textDark,
          }}
        >
          {t('signOut.title')}
        </h1>

        <p
          className="text-center mb-8"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 15,
            color: AppColors.textMuted,
            lineHeight: 1.6,
            maxWidth: 320,
          }}
        >
          {t('signOut.subtitle')}
        </p>

        {/* Buttons */}
        <div className="w-full space-y-3" style={{ maxWidth: 320 }}>
          <button
            onClick={handleSignOut}
            className="w-full py-4 rounded-2xl"
            style={{
              backgroundColor: AppColors.skipRed,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: 16,
              color: AppColors.surfaceWhite,
              border: 'none',
            }}
          >
            {t('signOut.yes')}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 rounded-2xl"
            style={{
              backgroundColor: 'transparent',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: 16,
              color: AppColors.forestGreen,
              border: `2px solid ${AppColors.forestGreen}`,
            }}
          >
            {t('signOut.no')}
          </button>
        </div>

        <p
          className="text-center mt-6"
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13,
            color: AppColors.textMuted,
          }}
        >
          {t('signOut.reassurance')}
        </p>
      </div>
    </div>
  );
}
