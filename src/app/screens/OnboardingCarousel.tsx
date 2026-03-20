import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'motion/react';

const SLIDES = [
  {
    emoji: '🤝',
    title: 'Find Work Near You',
    subtitle:
      'Discover jobs in your area — farming, construction, delivery and more. No CV needed.',
  },
  {
    emoji: '👆',
    title: 'Swipe to Apply',
    subtitle:
      'Swipe right on jobs you like. Our AI instantly writes your application for you — in English or Kinyarwanda.',
  },
  {
    emoji: '⚡',
    title: 'Get Hired Fast',
    subtitle:
      'Employers in your area see your profile and reach out directly. Start working within days.',
  },
];

export default function OnboardingCarousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const finish = useCallback(() => {
    localStorage.setItem('onboardingComplete', 'true');
    navigate('/role-selection');
  }, [navigate]);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= SLIDES.length) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    if (current === SLIDES.length - 1) {
      finish();
    } else {
      goTo(current + 1);
    }
  }, [current, finish, goTo]);

  const prev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  /* Swipe gesture — same library as SwipeFeed */
  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  /* Tap left half = prev, right half = next */
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x > rect.width / 2) {
      next();
    } else {
      prev();
    }
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const slide = SLIDES[current];

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: AppColors.forestDark }}
      {...swipeHandlers}
    >
      {/* Skip button — top right */}
      <div className="flex justify-end px-5 pt-5 flex-shrink-0">
        <button onClick={finish} className="px-4 py-2 rounded-full">
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Skip
          </span>
        </button>
      </div>

      {/* Slide content — centered in the middle ~70% */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative"
        onClick={handleTap}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center px-8"
          >
            <div className="text-center max-w-sm">
              <div className="text-7xl mb-8">{slide.emoji}</div>
              <h1
                className="text-white mb-4"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '28px',
                  lineHeight: '1.2',
                }}
              >
                {slide.title}
              </h1>
              <p
                className="text-white/70"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.6',
                }}
              >
                {slide.subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section — dots + button */}
      <div className="px-8 pb-10 flex-shrink-0">
        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                backgroundColor:
                  i === current
                    ? 'rgba(255, 255, 255, 1)'
                    : 'rgba(255, 255, 255, 0.3)',
              }}
            />
          ))}
        </div>

        {/* Next / Get Started button */}
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl transition-all active:scale-95"
          style={{
            backgroundColor: AppColors.greenLight,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            color: AppColors.surfaceWhite,
            boxShadow: '0 4px 12px rgba(26, 122, 74, 0.3)',
          }}
        >
          {current === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
