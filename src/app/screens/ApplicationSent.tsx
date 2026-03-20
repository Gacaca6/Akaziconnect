import { useNavigate, useLocation } from 'react-router';
import { AppColors } from '../constants/colors';
import { BadgeCheck } from 'lucide-react';
import { motion } from 'motion/react';
import type { Job } from '../constants/mockJobs';

export default function ApplicationSent() {
  const navigate = useNavigate();
  const location = useLocation();
  const job = (location.state as { job?: Job })?.job;

  const steps = [
    { emoji: '📬', text: 'The employer reviews your application' },
    { emoji: '💬', text: 'They message you if interested' },
    { emoji: '✅', text: 'You confirm and start work' },
  ];

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: AppColors.forestDark }}>
      {/* Top Green Section — 45% */}
      <div
        className="flex flex-col items-center justify-center px-5"
        style={{ minHeight: '45%' }}
      >
        {/* Animated Checkmark Circle */}
        <div className="relative mb-6" style={{ width: '96px', height: '96px' }}>
          {/* Circle outline draws in */}
          <motion.svg
            viewBox="0 0 96 96"
            className="absolute inset-0"
            style={{ width: '96px', height: '96px' }}
          >
            <motion.circle
              cx="48"
              cy="48"
              r="44"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </motion.svg>

          {/* Checkmark draws in after circle */}
          <motion.svg
            viewBox="0 0 96 96"
            className="absolute inset-0"
            style={{ width: '96px', height: '96px' }}
          >
            <motion.path
              d="M30 50 L43 63 L66 36"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
            />
          </motion.svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="text-white text-center mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '28px' }}
        >
          Application Sent!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="text-white/70 text-center"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '15px', maxWidth: '280px' }}
        >
          Your application is on its way to the employer
        </motion.p>
      </div>

      {/* Bottom White Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5, ease: 'easeOut' }}
        className="flex-1 overflow-y-auto"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          marginTop: '-16px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="max-w-md mx-auto px-5 pt-8 pb-12 space-y-6">
          {/* Job Summary Card */}
          {job && (
            <div
              className="p-5 rounded-2xl"
              style={{ backgroundColor: AppColors.surfaceLight }}
            >
              <h3
                className="text-lg mb-1"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
              >
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-sm"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}
                >
                  {job.employer}
                </span>
                {job.verified && (
                  <BadgeCheck className="w-4 h-4" style={{ color: AppColors.forestGreen }} />
                )}
              </div>
              <p
                className="text-lg"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.forestGreen }}
              >
                {job.payRate}
              </p>
            </div>
          )}

          {/* What Happens Next */}
          <div>
            <h3
              className="text-base mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
            >
              What happens next
            </h3>
            <div className="space-y-4">
              {steps.map(({ emoji, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + i * 0.15, duration: 0.35 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: AppColors.greenBackground }}
                  >
                    <span className="text-lg">{emoji}</span>
                  </div>
                  <p
                    className="text-sm"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textDark, lineHeight: '1.5' }}
                  >
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate('/swipe-feed')}
              className="w-full py-4 rounded-2xl transition-transform active:scale-98"
              style={{
                backgroundColor: AppColors.greenLight,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                color: AppColors.surfaceWhite,
                boxShadow: '0 4px 12px rgba(26, 122, 74, 0.2)',
              }}
            >
              Browse More Jobs
            </button>
            <button
              onClick={() => navigate('/applied')}
              className="w-full py-4 rounded-2xl transition-transform active:scale-98"
              style={{
                backgroundColor: 'transparent',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                color: AppColors.forestGreen,
                border: `1.5px solid ${AppColors.forestGreen}`,
              }}
            >
              View My Applications
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
