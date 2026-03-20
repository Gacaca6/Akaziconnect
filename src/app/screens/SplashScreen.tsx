import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { Loader2 } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const done = localStorage.getItem('onboardingComplete');
      navigate(done === 'true' ? '/role-selection' : '/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div 
      className="min-h-full flex flex-col items-center justify-center"
      style={{ backgroundColor: AppColors.forestDark }}
    >
      <div className="flex flex-col items-center gap-6">
        <img
          src={logo}
          alt="Akazi Connect Logo"
          style={{ width: 128, height: 128, objectFit: 'contain' }}
        />
        
        <div className="text-center">
          <h1 
            className="text-4xl mb-2 text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
          >
            Akazi Connect
          </h1>
          <p 
            className="text-lg text-white/80 italic"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Umurimo Wawe
          </p>
        </div>

        <div className="mt-8">
          <Loader2 
            className="w-8 h-8 animate-spin" 
            style={{ color: AppColors.aiAmber }}
          />
        </div>
      </div>
    </div>
  );
}
