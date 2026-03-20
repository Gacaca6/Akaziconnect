import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import {
  X,
  Info,
  Check,
  MapPin,
  Calendar,
  Users,
  Zap,
  BadgeCheck,
  SlidersHorizontal,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwipeable } from 'react-swipeable';
import BottomNav from '../components/BottomNav';
import { mockJobs } from '../constants/mockJobs';

interface ActiveFilters {
  jobTypes: string[];
  distance: string;
  minPay: string;
  availability: string;
  sortBy: string;
}

const calculateMatchScore = (job: any): number => {
  try {
    const profile = JSON.parse(localStorage.getItem('seekerProfile') || '{}');
    const skills = (profile.skills || []) as string[];
    const titleWords = job.title.toLowerCase().split(' ');
    const skillMatch = skills.some((skill: string) =>
      titleWords.some((word: string) =>
        skill.toLowerCase().includes(word) || word.includes(skill.toLowerCase())
      )
    );
    return skillMatch
      ? Math.floor(Math.random() * 15) + 80
      : Math.floor(Math.random() * 20) + 60;
  } catch {
    return 75;
  }
};

const getEmployerJobs = () => {
  try {
    const stored = localStorage.getItem('employerJobs');
    if (!stored) return [];
    const jobs = JSON.parse(stored);
    return jobs
      .filter((j: any) => j.status === 'active')
      .map((j: any) => ({
        id: j.id,
        title: j.title,
        employer: j.employer,
        verified: false,
        type: j.type,
        matchScore: calculateMatchScore(j),
        distance: 'Nearby',
        duration: j.duration,
        workers: j.workers,
        payRate: j.payRate,
        aiNote: `This job matches your profile — ${j.type} work in ${j.location}.`,
        image: '',
        description: j.description,
      }));
  } catch {
    return [];
  }
};

// Parse pay string to number
const parsePayValue = (pay: string): number => {
  const nums = pay.replace(/[^0-9]/g, '');
  return parseInt(nums) || 0;
};

const getFilterMinPay = (filter: string): number => {
  if (filter === 'Any') return 0;
  return parsePayValue(filter);
};

// Parse distance string to number in km
const parseDistance = (dist: string): number => {
  const nums = dist.replace(/[^0-9.]/g, '');
  return parseFloat(nums) || 999;
};

const getMatchLabel = (score: number, t: any): string => {
  if (score >= 85) return t('swipeFeed.match_great');
  if (score >= 70) return t('swipeFeed.match_good');
  return t('swipeFeed.match_possible');
};

const SWIPE_THRESHOLD = 100;

export default function SwipeFeed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Success banner after applying
  const [successBanner, setSuccessBanner] = useState<string | null>(() => {
    const state = location.state as { applied?: boolean; employerName?: string } | null;
    if (state?.applied) {
      window.history.replaceState({}, '');
      return state.employerName || 'the employer';
    }
    return null;
  });

  useEffect(() => {
    if (successBanner) {
      const timer = setTimeout(() => setSuccessBanner(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successBanner]);

  // Load all jobs then apply filters
  const [allJobs] = useState(() => {
    const employerJobs = getEmployerJobs();
    return [...employerJobs, ...mockJobs];
  });

  const [jobs, setJobs] = useState(allJobs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const swiping = useRef(false);

  // Count active filters for badge
  const getActiveFilterCount = (): number => {
    try {
      const stored = localStorage.getItem('activeFilters');
      if (!stored) return 0;
      const f: ActiveFilters = JSON.parse(stored);
      let count = 0;
      if (f.jobTypes && f.jobTypes.length > 0) count++;
      if (f.distance && f.distance !== 'Any') count++;
      if (f.minPay && f.minPay !== 'Any') count++;
      if (f.availability && f.availability !== 'Any') count++;
      if (f.sortBy && f.sortBy !== 'Best Match') count++;
      return count;
    } catch {
      return 0;
    }
  };

  const [filterCount, setFilterCount] = useState(getActiveFilterCount);

  // Apply filters and search on mount and when search changes
  useEffect(() => {
    let filtered = [...allJobs];

    // Read active filters from localStorage
    try {
      const stored = localStorage.getItem('activeFilters');
      if (stored) {
        const f: ActiveFilters = JSON.parse(stored);

        // Job type filter
        if (f.jobTypes && f.jobTypes.length > 0) {
          filtered = filtered.filter((j) => f.jobTypes.includes(j.type));
        }

        // Min pay filter
        if (f.minPay && f.minPay !== 'Any') {
          const min = getFilterMinPay(f.minPay);
          filtered = filtered.filter((j) => parsePayValue(j.payRate) >= min);
        }

        // Distance filter
        if (f.distance && f.distance !== 'Any') {
          const maxDist = parseDistance(f.distance);
          filtered = filtered.filter((j) => parseDistance(j.distance) <= maxDist);
        }

        // Sort
        if (f.sortBy === 'Highest Pay') {
          filtered.sort((a, b) => parsePayValue(b.payRate) - parsePayValue(a.payRate));
        } else if (f.sortBy === 'Nearest') {
          filtered.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
        } else if (f.sortBy === 'Best Match') {
          filtered.sort((a, b) => b.matchScore - a.matchScore);
        }
        // 'Most Recent' — keep original order (employer jobs first)
      }
    } catch { /* ignore */ }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.employer.toLowerCase().includes(q)
      );
    }

    setJobs(filtered);
    setCurrentIndex(0);
    setFilterCount(getActiveFilterCount());
  }, [searchQuery, allJobs]);

  const currentJob = jobs[currentIndex];

  const handleSkip = () => {
    if (swiping.current) return;
    swiping.current = true;
    setExitDirection('left');
    setTimeout(() => {
      if (currentIndex < jobs.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      setExitDirection(null);
      setDragX(0);
      swiping.current = false;
    }, 300);
  };

  const handleApply = () => {
    if (swiping.current || !currentJob) return;
    swiping.current = true;
    setExitDirection('right');
    setTimeout(() => {
      navigate(`/ai-application-review/${currentJob.id}`);
      swiping.current = false;
    }, 300);
  };

  const handleInfo = () => {
    if (currentJob) navigate('/job-detail', { state: { job: currentJob } });
  };

  const clearFilters = () => {
    localStorage.removeItem('activeFilters');
    setSearchQuery('');
    setJobs([...allJobs]);
    setCurrentIndex(0);
    setFilterCount(0);
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (e) => {
      if (!swiping.current) setDragX(e.deltaX);
    },
    onSwipedLeft: () => {
      if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
        handleSkip();
      } else {
        setDragX(0);
      }
    },
    onSwipedRight: () => {
      if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
        handleApply();
      } else {
        setDragX(0);
      }
    },
    onSwiped: () => {
      if (Math.abs(dragX) < SWIPE_THRESHOLD) setDragX(0);
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const cardRotation = dragX * 0.08;
  const cardOpacity = 1 - Math.min(Math.abs(dragX) / 300, 0.4);

  // Empty state — no jobs match
  if (!currentJob) {
    const hasFilters = filterCount > 0 || searchQuery.trim();
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
        {/* Header */}
        <div
          className="px-5 py-6 flex-shrink-0"
          style={{ backgroundColor: AppColors.forestDark }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl text-white"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
              >
                {t('swipeFeed.title')}
              </h1>
              <p
                className="text-sm text-white/70 mt-1"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                0 {t('swipeFeed.opportunities')}
              </p>
            </div>
            <button
              onClick={() => navigate('/filter-search')}
              className="w-11 h-11 rounded-xl flex items-center justify-center relative"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-5">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">{hasFilters ? '🔍' : '🎉'}</div>
            <h2
              className="text-2xl mb-2"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              {hasFilters ? t('swipeFeed.no_jobs_title') : t('swipeFeed.no_jobs_title')}
            </h2>
            <p
              className="mb-6"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: AppColors.textMuted,
              }}
            >
              {t('swipeFeed.no_jobs_subtitle')}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 rounded-2xl transition-transform active:scale-[0.97]"
                style={{
                  backgroundColor: AppColors.greenLight,
                  color: AppColors.surfaceWhite,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(26,122,74,0.2)',
                }}
              >
                {t('swipeFeed.clear_filters')}
              </button>
            )}
          </div>
        </div>
        <BottomNav activeTab="jobs" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: AppColors.surfaceLight }}>
      {/* Header */}
      <div
        className="px-5 pt-6 pb-4 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-2xl text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
            >
              {t('swipeFeed.title')}
            </h1>
            <p
              className="text-sm text-white/70 mt-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {jobs.length - currentIndex} {t('swipeFeed.opportunities')}
            </p>
          </div>
          {/* Filter button with badge */}
          <button
            onClick={() => navigate('/filter-search')}
            className="w-11 h-11 rounded-xl flex items-center justify-center relative"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
            {filterCount > 0 && (
              <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: AppColors.aiAmber,
                }}
              >
                <span
                  className="text-white"
                  style={{
                    fontSize: '13px',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                  }}
                >
                  {filterCount}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <Search className="w-4 h-4 text-white/60 flex-shrink-0" />
          <input
            type="text"
            placeholder={t('swipeFeed.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder-white/50"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              border: 'none',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Success Banner */}
      <AnimatePresence>
        {successBanner && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="mx-5 mt-3 p-3 rounded-2xl flex items-center gap-3"
            style={{ backgroundColor: AppColors.greenBackground }}
          >
            <span className="text-xl">🎉</span>
            <p
              className="text-sm"
              style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.forestGreen, fontWeight: 600 }}
            >
              {t('swipeFeed.application_sent_banner', { employer: successBanner })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Stack */}
      <div className="flex-1 px-5 py-8 relative">
        <div className="max-w-md mx-auto h-full flex flex-col">
          <div className="flex-1 relative" {...swipeHandlers}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentJob.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: cardOpacity,
                  x: exitDirection === 'left' ? -400 : exitDirection === 'right' ? 400 : dragX,
                  rotate: exitDirection === 'left' ? -20 : exitDirection === 'right' ? 20 : cardRotation,
                }}
                exit={{
                  x: exitDirection === 'left' ? -400 : 400,
                  rotate: exitDirection === 'left' ? -20 : 20,
                  opacity: 0,
                }}
                transition={exitDirection ? { duration: 0.3 } : { type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0"
                style={{ touchAction: 'pan-y' }}
              >
                <div
                  className="h-full rounded-3xl overflow-hidden flex flex-col relative"
                  style={{
                    backgroundColor: AppColors.surfaceWhite,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Swipe direction overlay */}
                  {dragX !== 0 && !exitDirection && (
                    <div
                      className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl pointer-events-none"
                      style={{
                        backgroundColor: dragX > 0
                          ? `rgba(37, 168, 98, ${Math.min(Math.abs(dragX) / 300, 0.3)})`
                          : `rgba(239, 68, 68, ${Math.min(Math.abs(dragX) / 300, 0.3)})`,
                      }}
                    >
                      <div
                        className="px-6 py-3 rounded-2xl border-4"
                        style={{
                          borderColor: dragX > 0 ? AppColors.greenLight : AppColors.skipRed,
                          opacity: Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1),
                          transform: `rotate(${dragX > 0 ? -15 : 15}deg)`,
                        }}
                      >
                        <span
                          className="text-3xl"
                          style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: 700,
                            color: dragX > 0 ? AppColors.greenLight : AppColors.skipRed,
                          }}
                        >
                          {dragX > 0 ? t('swipeFeed.apply').toUpperCase() : t('swipeFeed.skip').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Scrollable card content */}
                  <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
                    {/* Job Image */}
                    <div
                      className="w-full relative flex-shrink-0"
                      style={{ height: 160, backgroundColor: AppColors.border }}
                    >
                      {currentJob.image ? (
                        <img
                          src={currentJob.image}
                          alt={currentJob.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            background: `linear-gradient(135deg, ${AppColors.forestGreen}, ${AppColors.forestDark})`,
                          }}
                        />
                      )}
                      {/* Match Score Badge */}
                      {currentJob.matchScore >= 75 && (
                        <div
                          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: AppColors.aiAmber }}
                        >
                          <Zap className="w-4 h-4 text-white" fill="white" />
                          <span
                            className="text-sm text-white"
                            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
                          >
                            {getMatchLabel(currentJob.matchScore, t)}
                          </span>
                        </div>
                      )}
                      {/* Type Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span
                          className="px-3 py-1 rounded-full text-[13px]"
                          style={{
                            backgroundColor: AppColors.forestGreen,
                            color: AppColors.surfaceWhite,
                            fontFamily: 'DM Sans, sans-serif',
                            fontWeight: 500
                          }}
                        >
                          {currentJob.type}
                        </span>
                      </div>
                    </div>

                    {/* Job Title & Employer */}
                    <div className="px-5 pt-4 pb-3">
                      <h2
                        className="text-xl mb-1"
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 700,
                          color: AppColors.textDark
                        }}
                      >
                        {currentJob.title}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}
                        >
                          {currentJob.employer}
                        </span>
                        {currentJob.verified && (
                          <BadgeCheck className="w-4 h-4" style={{ color: AppColors.forestGreen }} />
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ height: 1, backgroundColor: AppColors.border }} />

                    {/* Key Details Grid */}
                    <div className="px-5 py-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: AppColors.greenBackground }}>
                          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: AppColors.forestGreen }} />
                          <div>
                            <p className="text-[13px]" style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}>{t('swipeFeed.location')}</p>
                            <p className="text-sm" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: AppColors.textDark }}>{currentJob.distance}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: AppColors.greenBackground }}>
                          <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: AppColors.forestGreen }} />
                          <div>
                            <p className="text-[13px]" style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}>{t('swipeFeed.duration')}</p>
                            <p className="text-sm" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: AppColors.textDark }}>{currentJob.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: AppColors.greenBackground }}>
                          <Users className="w-4 h-4 flex-shrink-0" style={{ color: AppColors.forestGreen }} />
                          <div>
                            <p className="text-[13px]" style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}>{t('swipeFeed.workers')}</p>
                            <p className="text-sm" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: AppColors.textDark }}>{currentJob.workers} {t('swipeFeed.workers_needed')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: AppColors.greenBackground }}>
                          <Zap className="w-4 h-4 flex-shrink-0" style={{ color: AppColors.forestGreen }} />
                          <div>
                            <p className="text-[13px]" style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}>{t('swipeFeed.pay_rate')}</p>
                            <p className="text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.forestGreen }}>{currentJob.payRate}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-5" style={{ height: 1, backgroundColor: AppColors.border }} />

                    {/* Job Description */}
                    <div className="px-5 py-3">
                      <p
                        className="text-sm mb-2"
                        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: AppColors.textDark }}
                      >
                        {t('swipeFeed.about_job')}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}
                      >
                        {currentJob.description}
                      </p>
                    </div>

                    {/* AI Note */}
                    <div className="px-5 pb-5">
                      <div
                        className="p-3 rounded-2xl flex items-start gap-3"
                        style={{ backgroundColor: AppColors.greenBackground }}
                      >
                        <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: AppColors.aiAmber }} />
                        <p
                          className="text-sm"
                          style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textDark }}
                        >
                          {currentJob.aiNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6 mt-6 mb-4">
            <button
              onClick={handleSkip}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
              style={{ backgroundColor: AppColors.skipRed }}
            >
              <X className="w-8 h-8 text-white" strokeWidth={3} />
            </button>

            <button
              onClick={handleInfo}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
              style={{ backgroundColor: AppColors.surfaceWhite, border: `2px solid ${AppColors.border}` }}
            >
              <Info className="w-6 h-6" style={{ color: AppColors.textMuted }} />
            </button>

            <button
              onClick={handleApply}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
              style={{ backgroundColor: AppColors.greenLight }}
            >
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab="jobs" />
    </div>
  );
}
