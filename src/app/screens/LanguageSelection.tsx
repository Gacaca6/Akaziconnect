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
    <div style={{
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: AppColors.forestDark,
    }}>
      {/* Top section — logo and title, shrinks if needed */}
      <div style={{
        flex: '0 0 auto',
        padding: '40px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <img src={logo} alt="Akazi Connect" style={{ width: 72, height: 72, objectFit: 'contain' }} />
        <h1 style={{
          color: 'white',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700,
          fontSize: 26,
          marginTop: 12,
          marginBottom: 0,
        }}>
          Akazi Connect
        </h1>
        <p style={{
          color: 'white',
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 600,
          fontSize: 17,
          marginTop: 4,
          marginBottom: 0,
        }}>
          Choose Your Language
        </p>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 14,
          fontStyle: 'italic',
          marginTop: 4,
          marginBottom: 0,
        }}>
          Hitamo Ururimi Rwawe
        </p>
      </div>

      {/* Bottom white card — takes remaining space, scrollable if needed */}
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '32px 24px 40px',
      }}>
        {/* Language cards */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
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
                    margin: 0,
                  }}>
                    {label}
                  </p>
                  <p style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: AppColors.textMuted,
                    margin: 0,
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

        {/* Continue button — ALWAYS at bottom, never hidden */}
        <button
          disabled={!selected}
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl transition-all active:scale-95"
          style={{
            backgroundColor: selected ? AppColors.greenLight : AppColors.textMuted,
            color: 'white',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: selected ? 'pointer' : 'not-allowed',
            flexShrink: 0,
            marginTop: 'auto',
            boxShadow: selected ? '0 4px 12px rgba(26, 122, 74, 0.3)' : 'none',
          }}
        >
          {selected === 'rw' ? 'Komeza' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
