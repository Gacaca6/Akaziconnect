import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import {
  Plus,
  Briefcase,
  Users,
  Star,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import EmployerBottomNav from '../components/EmployerBottomNav';

function loadStats() {
  try {
    const stored = localStorage.getItem('employerJobs');
    if (!stored) return { total: 0, active: 0, applicants: 0 };
    const jobs = JSON.parse(stored);
    return {
      total: jobs.length,
      active: jobs.filter((j: any) => j.status === 'active').length,
      applicants: jobs.reduce(
        (sum: number, j: any) => sum + (j.applicantCount || 0),
        0
      ),
    };
  } catch {
    return { total: 0, active: 0, applicants: 0 };
  }
}

function loadRecentJobs() {
  try {
    const stored = localStorage.getItem('employerJobs');
    if (!stored) return [];
    return JSON.parse(stored).slice(0, 3);
  } catch {
    return [];
  }
}

function loadOrgName(): string {
  try {
    const stored = localStorage.getItem('employerProfile');
    if (stored) return JSON.parse(stored).orgName || 'My Organisation';
  } catch {
    /* ignore */
  }
  return 'My Organisation';
}

export default function EmployerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stats = loadStats();
  const recentJobs = loadRecentJobs();
  const orgName = loadOrgName();

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: AppColors.surfaceLight }}
    >
      {/* Header */}
      <div
        className="px-5 py-8 relative overflow-hidden flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="text-2xl text-white mb-1"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                }}
              >
                {orgName}
              </h1>
              <p
                className="text-sm text-white/70"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {t('employerDashboard.title')}
              </p>
            </div>
            <button
              onClick={() => navigate('/post-job')}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl transition-transform active:scale-95"
              style={{ backgroundColor: AppColors.greenLight }}
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
              <span
                className="text-white"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                }}
              >
                {t('employerDashboard.post_job')}
              </span>
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="p-4 rounded-2xl backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-white/80" />
              </div>
              <div
                className="text-3xl text-white mb-1"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                }}
              >
                {stats.total}
              </div>
              <p
                className="text-[13px] text-white/70"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {t('employerDashboard.total_listings')}
              </p>
            </div>

            <div
              className="p-4 rounded-2xl backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-white/80" />
              </div>
              <div
                className="text-3xl text-white mb-1"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                }}
              >
                {stats.active}
              </div>
              <p
                className="text-[13px] text-white/70"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {t('employerDashboard.active_jobs')}
              </p>
            </div>

            <div
              className="p-4 rounded-2xl backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-white/80" />
              </div>
              <div
                className="text-3xl text-white mb-1"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                }}
              >
                {stats.applicants}
              </div>
              <p
                className="text-[13px] text-white/70"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {t('employerDashboard.total_applicants')}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative gradient blob */}
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: AppColors.greenLight }}
        />
      </div>

      {/* Job Listings — scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="max-w-md mx-auto px-5 py-6 pb-24 space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2
              className="text-xl"
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: AppColors.textDark,
              }}
            >
              {t('employerDashboard.recent_listings')}
            </h2>
            <button
              onClick={() => navigate('/my-listings')}
              className="flex items-center gap-1"
              style={{ minHeight: '44px' }}
            >
              <span
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: AppColors.forestGreen,
                }}
              >
                {t('employerDashboard.view_all')}
              </span>
              <ChevronRight
                className="w-4 h-4"
                style={{ color: AppColors.forestGreen }}
              />
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3
                className="text-lg mb-2"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  color: AppColors.textDark,
                }}
              >
                {t('employerDashboard.no_jobs_title')}
              </h3>
              <p
                className="mb-6"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  color: AppColors.textMuted,
                }}
              >
                {t('employerDashboard.no_jobs_subtitle')}
              </p>
              <button
                onClick={() => navigate('/post-job')}
                className="px-6 py-3.5 rounded-2xl"
                style={{
                  backgroundColor: AppColors.greenLight,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: AppColors.surfaceWhite,
                }}
              >
                {t('employerDashboard.post_job')}
              </button>
            </div>
          ) : (
            recentJobs.map((job: any) => {
              const isActive = job.status === 'active';
              return (
                <button
                  key={job.id}
                  onClick={() => navigate('/my-listings')}
                  className="w-full rounded-2xl p-5 text-left"
                  style={{
                    backgroundColor: AppColors.surfaceWhite,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-lg"
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 700,
                        color: AppColors.textDark,
                      }}
                    >
                      {job.title}
                    </h3>
                    <div
                      className="px-3 py-1 rounded-full flex-shrink-0 ml-3"
                      style={{
                        backgroundColor: isActive
                          ? AppColors.greenBackground
                          : AppColors.surfaceLight,
                      }}
                    >
                      <span
                        className="text-[13px]"
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

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin
                        className="w-4 h-4"
                        style={{ color: AppColors.textMuted }}
                      />
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          color: AppColors.textMuted,
                        }}
                      >
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users
                        className="w-4 h-4"
                        style={{ color: AppColors.textMuted }}
                      />
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          color: AppColors.textMuted,
                        }}
                      >
                        {job.applicantCount || 0} {t('employerDashboard.applicants')}
                      </span>
                    </div>
                  </div>

                  <span
                    className="text-lg"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 700,
                      color: AppColors.forestGreen,
                    }}
                  >
                    {job.payRate}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <EmployerBottomNav activeTab="home" />
    </div>
  );
}
