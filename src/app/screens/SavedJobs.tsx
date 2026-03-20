import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { ArrowLeft, BadgeCheck, MapPin, Calendar, Trash2 } from 'lucide-react';
import type { Job } from '../constants/mockJobs';

function loadSavedJobs(): Job[] {
  try {
    const stored = localStorage.getItem('savedJobs');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

export default function SavedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(loadSavedJobs);

  const removeJob = (jobId: string) => {
    const updated = jobs.filter((j) => j.id !== jobId);
    setJobs(updated);
    localStorage.setItem('savedJobs', JSON.stringify(updated));
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1
          className="flex-1 text-center text-lg text-white pr-9"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
        >
          Saved Jobs
        </h1>
      </div>

      {/* Content */}
      {jobs.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-5">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">🤍</div>
            <h2
              className="text-xl mb-2"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              No saved jobs yet
            </h2>
            <p
              className="mb-6"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: AppColors.textMuted,
                lineHeight: 1.6,
              }}
            >
              Tap the heart on any job to save it for later
            </p>
            <button
              onClick={() => navigate('/swipe-feed')}
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
              Browse Jobs
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
          <div className="px-5 py-4 space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-3xl p-4"
                style={{
                  backgroundColor: AppColors.surfaceWhite,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                {/* Title + employer */}
                <h3
                  className="text-base mb-1"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    color: AppColors.textDark,
                  }}
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

                {/* Info pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: AppColors.greenBackground }}
                  >
                    <MapPin className="w-3.5 h-3.5" style={{ color: AppColors.forestGreen }} />
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textDark }}
                    >
                      {job.distance}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: AppColors.greenBackground }}
                  >
                    <Calendar className="w-3.5 h-3.5" style={{ color: AppColors.forestGreen }} />
                    <span
                      className="text-xs"
                      style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textDark }}
                    >
                      {job.duration}
                    </span>
                  </div>
                </div>

                {/* Pay */}
                <p
                  className="text-base mb-4"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    color: AppColors.forestGreen,
                  }}
                >
                  {job.payRate}
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/ai-application-review/${job.id}`, { state: { job } })}
                    className="flex-1 py-2.5 rounded-2xl transition-transform active:scale-[0.97]"
                    style={{
                      backgroundColor: AppColors.greenLight,
                      border: 'none',
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 600,
                      fontSize: 13,
                      color: AppColors.surfaceWhite,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(26,122,74,0.2)',
                    }}
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => removeJob(job.id)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl transition-transform active:scale-[0.97]"
                    style={{
                      backgroundColor: 'transparent',
                      border: `1.5px solid ${AppColors.skipRed}`,
                      fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 600,
                      fontSize: 13,
                      color: AppColors.skipRed,
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
