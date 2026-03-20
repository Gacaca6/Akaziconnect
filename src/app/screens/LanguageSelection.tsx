import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { Check } from 'lucide-react';
import i18n from '../../i18n/index';
import logo from '../../assets/logo.png';

const LANGUAGES = [
  { id: 'en', flag: '🇬🇧', label: 'English', desc: 'Continue in English' },
  { id: 'rw', flag: '🇷🇼', label: 'Kinyarwanda', desc: 'Komeza mu Kinyarwanda' },
];

export default function LanguageSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    i18n.changeLanguage(selected);
    localStorage.setItem('appLanguage', selected);
    localStorage.setItem('languageSelected', 'true');
    navigate('/role-selection');
  };

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: AppColors.forestDark }}>
      {/* Top Section — 60% */}
      <div className="flex flex-col items-center justify-center px-5" style={{ minHeight: '55%' }}>
        <img src={logo} alt="Akazi Connect" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 16 }} />
        <h1
          className="text-white mb-6"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '28px' }}
        >
          Akazi Connect
        </h1>
        <p
          className="text-white mb-1"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '18px' }}
        >
          Choose Your Language
        </p>
        <p
          className="text-white/60 italic"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px' }}
        >
          Hitamo Ururimi Rwawe
        </p>
      </div>

      {/* Bottom White Section */}
      <div
        className="flex-1"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
        }}
      >
        <div className="max-w-md mx-auto px-5 pt-8 pb-8 flex flex-col h-full">
          {/* Language Cards */}
          <div className="space-y-3 mb-8">
            {LANGUAGES.map(({ id, flag, label, desc }) => {
              const isSelected = selected === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all relative"
                  style={{
                    backgroundColor: isSelected ? AppColors.greenBackground : AppColors.surfaceWhite,
                    border: `2px solid ${isSelected ? AppColors.forestGreen : AppColors.border}`,
                  }}
                >
                  <span className="text-3xl">{flag}</span>
                  <div className="flex-1">
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 700,
                      fontSize: '20px',
                      color: AppColors.textDark,
                    }}>
                      {label}
                    </p>
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px',
                      color: AppColors.textMuted,
                    }}>
                      {desc}
                    </p>
                  </div>
                  {isSelected && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: AppColors.forestGreen }}
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="mt-auto">
            <button
              onClick={handleContinue}
              disabled={!selected}
              className="w-full py-4 rounded-2xl transition-all active:scale-95"
              style={{
                backgroundColor: selected ? AppColors.greenLight : AppColors.textMuted,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                color: AppColors.surfaceWhite,
                cursor: selected ? 'pointer' : 'not-allowed',
                boxShadow: selected ? '0 4px 12px rgba(26, 122, 74, 0.3)' : 'none',
              }}
            >
              {selected === 'rw' ? 'Komeza' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
