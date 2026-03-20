import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { AppColors } from '../constants/colors';
import { ArrowLeft, Plus, MapPin, Calendar, Users } from 'lucide-react';
import EmployerBottomNav from '../components/EmployerBottomNav';

interface EmployerJob {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  payAmount: string;
  payPeriod: string;
  payRate: string;
  duration: string;
  workers: number;
  employer: string;
  status: string;
  createdAt: string;
  applicants: number;
}

function loadJobs(): EmployerJob[] {
  try {
    const stored = localStorage.getItem('employerJobs');
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return [];
}

export default function MyListings() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<EmployerJob[]>(loadJobs);

  const closeJob = useCallback(
    (jobId: string) => {
      if (!confirm('Are you sure you want to close this listing?')) return;
      const updated = jobs.map((j) =>
        j.id === jobId ? { ...j, status: 'closed' } : j
      );
      setJobs(updated);
      localStorage.setItem('employerJobs', JSON.stringify(updated));
    },
    [jobs]
  );

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: AppColors.surfaceLight }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1
          className="flex-1 text-center text-white"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          My Job Listings
        </h1>
        <div className="w-10" />
      </div>

      {/* Scrollable Content */}
      <div
        className="relative"
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {jobs.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-8 py-20">
            <div className="text-6xl mb-4">📋</div>
            <h2
              className="text-xl mb-2 text-center"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              No jobs posted yet
            </h2>
            <p
              className="text-center mb-6"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: AppColors.textMuted,
              }}
            >
              Tap the button below to post your first job
            </p>
            <button
              onClick={() => navigate('/post-job')}
              className="px-8 py-4 rounded-2xl active:scale-95 transition-transform"
              style={{
                backgroundColor: AppColors.greenLight,
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                color: AppColors.surfaceWhite,
                boxShadow: '0 4px 12px rgba(26, 122, 74, 0.2)',
              }}
            >
              Post a Job
            </button>
          </div>
        ) : (
          /* Job Cards List */
          <div className="px-5 py-5 pb-28 space-y-4 max-w-md mx-auto">
            {jobs.map((job) => {
              const isActive = job.status === 'active';

              return (
                <div
                  key={job.id}
                  className="rounded-3xl p-5"
                  style={{
                    backgroundColor: AppColors.surfaceWhite,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Title + Status */}
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="flex-1 pr-3"
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        color: AppColors.textDark,
                      }}
                    >
                      {job.title}
                    </h3>
                    <div
                      className="px-3 py-1 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: isActive
                          ? AppColors.greenBackground
                          : AppColors.surfaceLight,
                      }}
                    >
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontWeight: 600,
                          color: isActive
                            ? AppColors.forestGreen
                            : AppColors.textMuted,
                        }}
                      >
                        {isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                  </div>

                  {/* Info Pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: AppColors.greenBackground }}
                    >
                      <MapPin
                        className="w-3.5 h-3.5"
                        style={{ color: AppColors.forestGreen }}
                      />
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontWeight: 500,
                          color: AppColors.textDark,
                        }}
                      >
                        {job.location}
                      </span>
                    </div>
                    {job.duration && (
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: AppColors.greenBackground }}
                      >
                        <Calendar
                          className="w-3.5 h-3.5"
                          style={{ color: AppColors.forestGreen }}
                        />
                        <span
                          className="text-xs"
                          style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontWeight: 500,
                            color: AppColors.textDark,
                          }}
                        >
                          {job.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pay Rate */}
                  <p
                    className="mb-4"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      color: AppColors.forestGreen,
                    }}
                  >
                    {job.payRate}
                  </p>

                  {/* Applicants + Actions */}
                  <div
                    className="pt-4 flex items-center justify-between"
                    style={{ borderTop: `1px solid ${AppColors.border}` }}
                  >
                    <div className="flex items-center gap-2">
                      <Users
                        className="w-4 h-4"
                        style={{ color: AppColors.textMuted }}
                      />
                      <span
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: AppColors.textDark,
                        }}
                      >
                        👥 {job.applicants || 0} applicants
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate('/applicants-list', { state: { job } })
                        }
                        className="px-3 py-1.5 rounded-xl"
                        style={{
                          backgroundColor: AppColors.greenBackground,
                          fontFamily: 'DM Sans, sans-serif',
                          fontWeight: 600,
                          fontSize: '12px',
                          color: AppColors.forestGreen,
                        }}
                      >
                        View Applicants
                      </button>
                      {isActive && (
                        <button
                          onClick={() => closeJob(job.id)}
                          className="px-3 py-1.5 rounded-xl"
                          style={{
                            backgroundColor: AppColors.surfaceLight,
                            border: `1px solid ${AppColors.border}`,
                            fontFamily: 'DM Sans, sans-serif',
                            fontWeight: 600,
                            fontSize: '12px',
                            color: AppColors.textMuted,
                          }}
                        >
                          Close Job
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating + button — bottom right */}
        {jobs.length > 0 && (
          <button
            onClick={() => navigate('/post-job')}
            className="fixed right-5 bottom-24 w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{
              backgroundColor: AppColors.greenLight,
              boxShadow: '0 4px 16px rgba(26, 122, 74, 0.35)',
              zIndex: 20,
            }}
          >
            <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Bottom Navigation */}
      <EmployerBottomNav activeTab="jobs" />
    </div>
  );
}
