import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { Briefcase, Building2 } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'employer' | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    navigate('/phone-entry', { state: { role: selectedRole } });
  };

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
      {/* Header */}
      <div 
        className="px-5 py-8 flex items-center gap-3"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <img
          src={logo}
          alt="Akazi Connect"
          style={{ width: 32, height: 32, objectFit: 'contain' }}
        />
        <div>
          <h1 
            className="text-2xl text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
          >
            Akazi Connect
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-8">
        <div className="max-w-md mx-auto">
          <h2 
            className="text-2xl mb-2"
            style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 700,
              color: AppColors.textDark 
            }}
          >
            Wasuye neza! Welcome!
          </h2>
          <p 
            className="mb-8"
            style={{ 
              fontFamily: 'DM Sans, sans-serif',
              color: AppColors.textMuted 
            }}
          >
            Tell us how you'd like to use Akazi Connect
          </p>

          {/* Role Cards */}
          <div className="space-y-4">
            {/* Job Seeker Card */}
            <button
              onClick={() => setSelectedRole('seeker')}
              className="w-full p-6 rounded-3xl transition-all"
              style={{
                backgroundColor: AppColors.surfaceWhite,
                border: `3px solid ${selectedRole === 'seeker' ? AppColors.forestGreen : 'transparent'}`,
                boxShadow: selectedRole === 'seeker' 
                  ? '0 8px 24px rgba(26, 122, 74, 0.15)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: AppColors.greenBackground }}
                >
                  <Briefcase 
                    className="w-8 h-8" 
                    style={{ color: AppColors.forestGreen }}
                  />
                </div>
                <div className="text-left flex-1">
                  <h3 
                    className="text-xl mb-1"
                    style={{ 
                      fontFamily: 'Space Grotesk, sans-serif', 
                      fontWeight: 700,
                      color: AppColors.textDark 
                    }}
                  >
                    I'm Looking for Work
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ 
                      fontFamily: 'DM Sans, sans-serif',
                      color: AppColors.textMuted 
                    }}
                  >
                    Find jobs near you and apply with one swipe
                  </p>
                </div>
              </div>
            </button>

            {/* Employer Card */}
            <button
              onClick={() => setSelectedRole('employer')}
              className="w-full p-6 rounded-3xl transition-all"
              style={{
                backgroundColor: AppColors.surfaceWhite,
                border: `3px solid ${selectedRole === 'employer' ? AppColors.forestGreen : 'transparent'}`,
                boxShadow: selectedRole === 'employer' 
                  ? '0 8px 24px rgba(26, 122, 74, 0.15)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: AppColors.greenBackground }}
                >
                  <Building2 
                    className="w-8 h-8" 
                    style={{ color: AppColors.forestGreen }}
                  />
                </div>
                <div className="text-left flex-1">
                  <h3 
                    className="text-xl mb-1"
                    style={{ 
                      fontFamily: 'Space Grotesk, sans-serif', 
                      fontWeight: 700,
                      color: AppColors.textDark 
                    }}
                  >
                    I'm Hiring Workers
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ 
                      fontFamily: 'DM Sans, sans-serif',
                      color: AppColors.textMuted 
                    }}
                  >
                    Post jobs and receive qualified applicants
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Continue Button */}
          {selectedRole && (
            <button
              onClick={handleContinue}
              className="w-full mt-8 py-4 rounded-2xl transition-all"
              style={{
                backgroundColor: AppColors.greenLight,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                color: AppColors.surfaceWhite,
                fontSize: '16px'
              }}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
