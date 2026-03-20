import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AppColors } from '../constants/colors';
import { ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function PhoneEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state as { role?: string })?.role || 'seeker';
  const [phoneNumber, setPhoneNumber] = useState('');

  const isValid = phoneNumber.replace(/\D/g, '').length === 9;

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    setPhoneNumber(digits);
  };

  const handleContinue = () => {
    if (!isValid) return;
    navigate('/otp-verification', { state: { phone: '+250' + phoneNumber, role } });
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
          className="p-2 rounded-xl"
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
            Enter your number
          </h2>
          <p
            className="mb-8"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: AppColors.textMuted,
            }}
          >
            We'll send you a verification code
          </p>

          {/* Phone Input Row */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex items-center gap-1.5 px-4 py-3.5 rounded-xl flex-shrink-0"
              style={{
                backgroundColor: AppColors.surfaceLight,
                border: `1px solid ${AppColors.border}`,
              }}
            >
              <span className="text-lg">🇷🇼</span>
              <span
                className="text-base"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500,
                  color: AppColors.textDark,
                }}
              >
                +250
              </span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              value={phoneNumber}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="7X XXX XXXX"
              className="flex-1 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '16px',
                color: AppColors.textDark,
                backgroundColor: AppColors.surfaceWhite,
                border: `1px solid ${AppColors.border}`,
                focusRingColor: AppColors.forestGreen,
              }}
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!isValid}
            className="w-full py-4 rounded-2xl transition-all"
            style={{
              backgroundColor: isValid ? AppColors.greenLight : AppColors.textMuted,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              color: AppColors.surfaceWhite,
              fontSize: '16px',
              cursor: isValid ? 'pointer' : 'not-allowed',
            }}
          >
            Continue
          </button>

          {/* Reassurance Text */}
          <p
            className="text-center mt-4"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: AppColors.textMuted,
            }}
          >
            Your number is only used for login
          </p>
        </div>
      </div>
    </div>
  );
}
