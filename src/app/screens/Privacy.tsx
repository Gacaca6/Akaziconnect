import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: 'Data We Collect',
    content:
      'We collect your name, phone number, location, skills, and availability when you create your profile. We also collect job application data and messaging activity to improve your experience.',
  },
  {
    title: 'How We Use It',
    content:
      'Your data is used to match you with relevant jobs, generate AI-powered applications, and enable communication between job seekers and employers. We never sell your personal information to third parties.',
  },
  {
    title: 'Your Rights',
    content:
      'You have the right to access, update, or delete your personal data at any time. You can edit your profile from the settings, or delete your account entirely using the button below.',
  },
  {
    title: 'Data Security',
    content:
      'We use industry-standard encryption to protect your data. Your phone number is verified via SMS OTP through Africa\'s Talking, and all communication is secured.',
  },
];

export default function Privacy() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDeleteAccount = () => {
    navigate('/sign-out');
  };

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: AppColors.surfaceLight }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl"
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
          {t('privacy.title')}
        </h1>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="max-w-md mx-auto px-5 py-6 pb-12 space-y-5">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl p-5"
              style={{
                backgroundColor: AppColors.surfaceWhite,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
                {section.title}
              </h3>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: AppColors.textMuted,
                }}
              >
                {section.content}
              </p>
            </div>
          ))}

          {/* Delete Account */}
          <button
            onClick={handleDeleteAccount}
            className="w-full py-4 rounded-2xl"
            style={{
              backgroundColor: AppColors.surfaceWhite,
              border: `2px solid ${AppColors.skipRed}`,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: AppColors.skipRed,
            }}
          >
            {t('privacy.delete_account')}
          </button>
        </div>
      </div>
    </div>
  );
}
