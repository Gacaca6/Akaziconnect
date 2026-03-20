import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { ArrowLeft } from 'lucide-react';
import { mockJobs } from '../constants/mockJobs';

interface ActiveFilters {
  jobTypes: string[];
  distance: string;
  minPay: string;
  availability: string;
  sortBy: string;
}

const defaultFilters: ActiveFilters = {
  jobTypes: [],
  distance: 'Any',
  minPay: 'Any',
  availability: 'Any',
  sortBy: 'Best Match',
};

const jobTypeOptions = [
  { emoji: '⏱️', label: 'Casual' },
  { emoji: '📅', label: 'Short-term' },
  { emoji: '🗓️', label: 'Full-time' },
  { emoji: '🎓', label: 'Apprenticeship' },
];

const distanceOptions = ['Any', '1 km', '5 km', '10 km', '25 km'];
const payOptions = ['Any', '2,000+ RWF', '5,000+ RWF', '10,000+ RWF', '20,000+ RWF'];
const availabilityOptions = ['Any', 'Today', 'This Week', 'This Month'];
const sortOptions = ['Best Match', 'Nearest', 'Highest Pay', 'Most Recent'];

// Parse pay string to number for comparison
const parsePayValue = (pay: string): number => {
  const nums = pay.replace(/[^0-9]/g, '');
  return parseInt(nums) || 0;
};

const getFilterMinPay = (filter: string): number => {
  if (filter === 'Any') return 0;
  return parsePayValue(filter);
};

// Count matching jobs
const countMatchingJobs = (filters: ActiveFilters): number => {
  let allJobs = [...mockJobs];

  // Add employer jobs
  try {
    const stored = localStorage.getItem('employerJobs');
    if (stored) {
      const empJobs = JSON.parse(stored);
      empJobs
        .filter((j: any) => j.status === 'active')
        .forEach((j: any) => {
          allJobs.push({
            id: j.id,
            title: j.title,
            employer: j.employer,
            verified: false,
            type: j.type,
            matchScore: 75,
            location: j.location || '',
            distance: 'Nearby',
            duration: j.duration,
            workers: j.workers,
            payRate: j.payRate,
            aiNote: '',
            image: '',
            description: j.description || '',
          });
        });
    }
  } catch { /* ignore */ }

  // Apply filters
  if (filters.jobTypes.length > 0) {
    allJobs = allJobs.filter((j) => filters.jobTypes.includes(j.type));
  }

  if (filters.minPay !== 'Any') {
    const min = getFilterMinPay(filters.minPay);
    allJobs = allJobs.filter((j) => parsePayValue(j.payRate) >= min);
  }

  return allJobs.length;
};

export default function FilterSearch() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<ActiveFilters>(() => {
    try {
      const stored = localStorage.getItem('activeFilters');
      if (stored) return { ...defaultFilters, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { ...defaultFilters };
  });

  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    setJobCount(countMatchingJobs(filters));
  }, [filters]);

  const toggleJobType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(type)
        ? prev.jobTypes.filter((t) => t !== type)
        : [...prev.jobTypes, type],
    }));
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.jobTypes.length > 0) count++;
    if (filters.distance !== 'Any') count++;
    if (filters.minPay !== 'Any') count++;
    if (filters.availability !== 'Any') count++;
    if (filters.sortBy !== 'Best Match') count++;
    return count;
  };

  const resetAll = () => {
    setFilters({ ...defaultFilters });
  };

  const applyFilters = () => {
    // Only save non-default filters
    const count = activeFilterCount();
    if (count > 0) {
      localStorage.setItem('activeFilters', JSON.stringify(filters));
    } else {
      localStorage.removeItem('activeFilters');
    }
    navigate('/swipe-feed');
  };

  const renderPillRow = (
    options: string[],
    selected: string,
    onSelect: (val: string) => void
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className="px-4 py-2 rounded-full transition-all"
            style={{
              backgroundColor: isActive ? AppColors.forestGreen : AppColors.surfaceWhite,
              color: isActive ? AppColors.surfaceWhite : AppColors.textDark,
              border: `1.5px solid ${isActive ? AppColors.forestGreen : AppColors.border}`,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: isActive ? 600 : 400,
              fontSize: '13px',
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      {/* Dark overlay top — tapping goes back */}
      <div className="flex-shrink-0" style={{ height: '8%' }} onClick={() => navigate(-1)} />

      {/* Bottom sheet */}
      <div
        className="flex-1 flex flex-col"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div
            className="rounded-full"
            style={{
              width: 40,
              height: 4,
              backgroundColor: AppColors.border,
            }}
          />
        </div>

        {/* Header row */}
        <div className="px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: AppColors.surfaceLight }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: AppColors.textDark }} />
            </button>
            <h1
              className="text-xl"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              Filter Jobs
            </h1>
          </div>
          <button
            onClick={resetAll}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: AppColors.forestGreen,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Reset All
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: AppColors.border }} />

        {/* Scrollable filter sections */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
          <div className="px-5 py-4 space-y-6">
            {/* Job Type — multiselect chips */}
            <div>
              <p
                className="text-sm mb-3"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: AppColors.textDark,
                }}
              >
                Job Type
              </p>
              <div className="flex flex-wrap gap-2">
                {jobTypeOptions.map(({ emoji, label }) => {
                  const isActive = filters.jobTypes.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleJobType(label)}
                      className="px-4 py-2.5 rounded-full flex items-center gap-2 transition-all"
                      style={{
                        backgroundColor: isActive ? AppColors.forestGreen : AppColors.surfaceWhite,
                        color: isActive ? AppColors.surfaceWhite : AppColors.textDark,
                        border: `1.5px solid ${isActive ? AppColors.forestGreen : AppColors.border}`,
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: isActive ? 600 : 400,
                        fontSize: '14px',
                      }}
                    >
                      <span>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Distance */}
            <div>
              <p
                className="text-sm mb-3"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: AppColors.textDark,
                }}
              >
                Distance
              </p>
              {renderPillRow(distanceOptions, filters.distance, (val) =>
                setFilters((prev) => ({ ...prev, distance: val }))
              )}
            </div>

            {/* Pay Rate */}
            <div>
              <p
                className="text-sm mb-3"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: AppColors.textDark,
                }}
              >
                Minimum Pay
              </p>
              {renderPillRow(payOptions, filters.minPay, (val) =>
                setFilters((prev) => ({ ...prev, minPay: val }))
              )}
            </div>

            {/* Availability */}
            <div>
              <p
                className="text-sm mb-3"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: AppColors.textDark,
                }}
              >
                Availability
              </p>
              {renderPillRow(availabilityOptions, filters.availability, (val) =>
                setFilters((prev) => ({ ...prev, availability: val }))
              )}
            </div>

            {/* Sort By */}
            <div>
              <p
                className="text-sm mb-3"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: AppColors.textDark,
                }}
              >
                Sort By
              </p>
              {renderPillRow(sortOptions, filters.sortBy, (val) =>
                setFilters((prev) => ({ ...prev, sortBy: val }))
              )}
            </div>

            {/* Bottom spacer for button */}
            <div style={{ height: 80 }} />
          </div>
        </div>

        {/* Apply button — fixed at bottom */}
        <div
          className="px-5 py-4 flex-shrink-0"
          style={{
            borderTop: `1px solid ${AppColors.border}`,
            backgroundColor: AppColors.surfaceWhite,
          }}
        >
          <button
            onClick={applyFilters}
            className="w-full py-4 rounded-2xl flex items-center justify-center transition-transform active:scale-[0.98]"
            style={{
              backgroundColor: AppColors.greenLight,
              color: AppColors.surfaceWhite,
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(26,122,74,0.2)',
            }}
          >
            Show {jobCount} Job{jobCount !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
