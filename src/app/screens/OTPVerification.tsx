import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';

const CODE_LENGTH = 6;
const COOLDOWN_SECONDS = 30;

export default function OTPVerification() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const phone = (location.state as { phone?: string; role?: string })?.phone || '+250 ---';
  const role = (location.state as { role?: string })?.role || 'seeker';

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isComplete = digits.every((d) => d !== '');

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const updateDigit = useCallback(
    (index: number, value: string) => {
      const next = [...digits];
      next[index] = value;
      setDigits(next);
    },
    [digits]
  );

  const handleChange = (index: number, value: string) => {
    // Only accept single digit
    const digit = value.replace(/\D/g, '').slice(-1);
    updateDigit(index, digit);
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index] === '' && index > 0) {
        // Empty box — move back and clear previous
        updateDigit(index - 1, '');
        inputRefs.current[index - 1]?.focus();
      } else {
        updateDigit(index, '');
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (pasted.length === 0) return;
    const next = [...digits];
    for (let i = 0; i < CODE_LENGTH; i++) {
      next[i] = pasted[i] || '';
    }
    setDigits(next);
    // Focus the last filled box or the next empty one
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(COOLDOWN_SECONDS);
    // TODO: trigger actual OTP resend via Africa's Talking
  };

  const handleVerify = () => {
    if (!isComplete) return;
    // Simulated — any 6-digit code is accepted
    if (role === 'employer') {
      navigate('/employer-profile-setup', { state: { phone } });
    } else {
      navigate('/seeker-profile-setup', { state: { phone } });
    }
  };

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <img src={logo} alt="Akazi Connect" style={{ width: 32, height: 32, objectFit: 'contain' }} />
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-8">
        <div className="max-w-md mx-auto">
          <h2
            className="text-2xl mb-2"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              color: AppColors.textDark,
            }}
          >
            {t('otp.title')}
          </h2>
          <p
            className="mb-8"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: AppColors.textMuted,
            }}
          >
            {t('otp.subtitle', { phone })}
          </p>

          {/* OTP Input Boxes */}
          <div className="flex justify-between gap-2 mb-6">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="flex-1 min-w-0 h-14 text-center rounded-xl focus:outline-none focus:ring-2"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  color: AppColors.textDark,
                  backgroundColor: AppColors.surfaceWhite,
                  border: `1.5px solid ${digit ? AppColors.forestGreen : AppColors.border}`,
                }}
              />
            ))}
          </div>

          {/* Resend Link */}
          <p
            className="text-center mb-8"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              color: AppColors.textMuted,
            }}
          >
            {t('otp.didnt_receive')}{' '}
            {cooldown > 0 ? (
              <span style={{ color: AppColors.textMuted }}>{t('otp.resend_wait')} {cooldown}s</span>
            ) : (
              <button
                onClick={handleResend}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: AppColors.forestGreen,
                }}
              >
                {t('otp.resend')}
              </button>
            )}
          </p>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={!isComplete}
            className="w-full py-4 rounded-2xl transition-all"
            style={{
              backgroundColor: isComplete ? AppColors.greenLight : AppColors.textMuted,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              color: AppColors.surfaceWhite,
              fontSize: '16px',
              cursor: isComplete ? 'pointer' : 'not-allowed',
            }}
          >
            {t('otp.verify')}
          </button>
        </div>
      </div>
    </div>
  );
}
