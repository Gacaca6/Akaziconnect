import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AppColors } from '../constants/colors';
import {
  ArrowLeft,
  Zap,
  MapPin,
  BadgeCheck,
  Sparkles,
  Check
} from 'lucide-react';
import { mockJobs } from '../constants/mockJobs';

function buildFallbackMessage(profileName: string, jobTitle: string, employer: string) {
  return `Hello, my name is ${profileName}. I am very interested in the ${jobTitle} position at ${employer}. I am available to start immediately and I am a reliable, hardworking person who would love the opportunity to work with you.`;
}

let applicationFetchInProgress = false;

export default function AIApplicationReview() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [applicationText, setApplicationText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Read real profile from localStorage (saved by SeekerProfileSetup)
  const stored = localStorage.getItem('seekerProfile');
  const savedProfile = stored ? JSON.parse(stored) : null;
  const profile = savedProfile
    ? {
        name: `${savedProfile.firstName} ${savedProfile.lastName}`.trim(),
        location: savedProfile.location,
        skills: savedProfile.skills,
        availability: savedProfile.availability,
        daysPerWeek: savedProfile.daysPerWeek,
        language: savedProfile.language === 'bilingual' ? 'english' : savedProfile.language,
      }
    : {
        name: 'Job Seeker',
        location: 'Rwanda',
        skills: ['General Labour'],
        availability: 'Immediately',
        language: 'english',
      };

  // First try mockJobs, then employer-posted jobs in localStorage
  let job = mockJobs.find((j) => j.id === jobId);
  if (!job) {
    try {
      const empStored = localStorage.getItem('employerJobs');
      if (empStored) {
        const employerJobs = JSON.parse(empStored);
        const empJob = employerJobs.find((j: any) => j.id === jobId);
        if (empJob) {
          job = {
            id: empJob.id,
            title: empJob.title,
            employer: empJob.employer,
            verified: false,
            type: empJob.type,
            matchScore: 75,
            distance: 'Nearby',
            duration: empJob.duration,
            workers: empJob.workers,
            payRate: empJob.payRate,
            aiNote: `${empJob.type} work in ${empJob.location}`,
            image: '',
            description: empJob.description,
          };
        }
      }
    } catch { /* ignore */ }
  }

  if (!job) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ backgroundColor: AppColors.surfaceLight }}>
        <div className="text-center px-5">
          <div className="text-5xl mb-4">🔍</div>
          <h2
            className="text-xl mb-2"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
          >
            Job Not Found
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}>
            This job may no longer be available.
          </p>
          <button
            onClick={() => navigate('/swipe-feed')}
            className="mt-6 px-6 py-3 rounded-2xl"
            style={{ backgroundColor: AppColors.greenLight, color: AppColors.surfaceWhite, fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const profileTags = [
    'Your farming skill',
    'Available immediately',
    'Near location',
    'Experience level'
  ];

  useEffect(() => {
    if (applicationFetchInProgress) return;
    applicationFetchInProgress = true;

    let cancelled = false;

    async function fetchApplication() {
      try {
        const apiBase = import.meta.env.VITE_API_URL || '';
        let response = await fetch(apiBase + '/api/generate-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile, job }),
        });

        // Retry once after 5s on 429 rate limit
        if (response.status === 429) {
          await new Promise((r) => setTimeout(r, 5000));
          response = await fetch(apiBase + '/api/generate-application', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile, job }),
          });
        }

        const data = await response.json();
        if (!response.ok || !data.text) throw new Error(data.error || 'No text returned');
        if (!cancelled) setApplicationText(data.text);
      } catch (err) {
        console.error('Application generation error:', err);
        if (!cancelled) setApplicationText(buildFallbackMessage(profile.name, job.title, job.employer));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchApplication();
    return () => { cancelled = true; applicationFetchInProgress = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const handleSend = () => {
    // Save conversation to localStorage
    const now = new Date().toISOString();
    const conversation = {
      id: `conv-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      employerName: job.employer,
      seekerName: profile.name,
      lastMessage: applicationText,
      lastMessageTime: now,
      unread: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          text: applicationText,
          sender: 'seeker',
          timestamp: now,
        },
      ],
    };
    try {
      const existing = localStorage.getItem('conversations');
      const convos = existing ? JSON.parse(existing) : [];
      convos.unshift(conversation);
      localStorage.setItem('conversations', JSON.stringify(convos));
    } catch {
      localStorage.setItem('conversations', JSON.stringify([conversation]));
    }

    // Track application count
    try {
      const count = parseInt(localStorage.getItem('applicationCount') || '0', 10);
      localStorage.setItem('applicationCount', String(count + 1));
    } catch {
      localStorage.setItem('applicationCount', '1');
    }

    navigate('/application-sent', { state: { job } });
  };

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1
            className="text-xl text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
          >
            Review Application
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="pb-24" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-md mx-auto px-5 py-6 space-y-6">
          {/* Match Score Card */}
          <div
            className="p-6 rounded-3xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${AppColors.forestGreen} 0%, ${AppColors.forestDark} 100%)`,
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap
                  className="w-6 h-6"
                  style={{ color: AppColors.aiAmber }}
                  fill={AppColors.aiAmber}
                />
                <span
                  className="text-sm text-white/80"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  AI Match Score
                </span>
              </div>
              <div className="text-5xl text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                {job.matchScore}%
              </div>
              <p
                className="text-white/90 text-sm"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Excellent match! Your profile aligns perfectly with this job.
              </p>
            </div>

            {/* Decorative gradient blob */}
            <div
              className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20"
              style={{ backgroundColor: AppColors.aiAmber }}
            />
          </div>

          {/* Job Summary Card */}
          <div
            className="p-5 rounded-2xl"
            style={{
              backgroundColor: AppColors.surfaceWhite,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3
                  className="text-xl mb-1"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    color: AppColors.textDark
                  }}
                >
                  {job.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: AppColors.textMuted
                    }}
                  >
                    {job.employer}
                  </span>
                  {job.verified && (
                    <BadgeCheck
                      className="w-4 h-4"
                      style={{ color: AppColors.forestGreen }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: AppColors.greenBackground }}
              >
                <MapPin
                  className="w-4 h-4"
                  style={{ color: AppColors.forestGreen }}
                />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: AppColors.textDark
                  }}
                >
                  {job.distance}
                </span>
              </div>

              <div>
                <span
                  className="text-lg"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    color: AppColors.forestGreen
                  }}
                >
                  {job.payRate}
                </span>
              </div>
            </div>
          </div>

          {/* AI-Written Message */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles
                className="w-5 h-5"
                style={{ color: AppColors.aiAmber }}
              />
              <h3
                className="text-lg"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  color: AppColors.textDark
                }}
              >
                Your Application
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs ml-auto"
                style={{
                  backgroundColor: `${AppColors.aiAmber}20`,
                  color: AppColors.aiAmber,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500
                }}
              >
                AI-Generated
              </span>
            </div>

            {isLoading ? (
              /* Skeleton shimmer while Gemini generates the application */
              <div
                className="w-full p-4 rounded-2xl space-y-3"
                style={{
                  backgroundColor: AppColors.surfaceWhite,
                  border: `1px solid ${AppColors.border}`,
                }}
              >
                {[100, 95, 85, 60].map((width, i) => (
                  <div
                    key={i}
                    className="rounded-lg animate-pulse"
                    style={{
                      height: '14px',
                      width: `${width}%`,
                      backgroundColor: AppColors.border,
                    }}
                  />
                ))}
                <div className="pt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" style={{ color: AppColors.aiAmber }} />
                  <span
                    className="text-xs animate-pulse"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: AppColors.aiAmber,
                    }}
                  >
                    AI is writing your application...
                  </span>
                </div>
              </div>
            ) : (
              <textarea
                value={applicationText}
                onChange={(e) => setApplicationText(e.target.value)}
                rows={8}
                className="w-full p-4 rounded-2xl resize-none focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: AppColors.surfaceWhite,
                  fontFamily: 'DM Sans, sans-serif',
                  color: AppColors.textDark,
                  border: `1px solid ${AppColors.border}`,
                }}
              />
            )}

            <p
              className="text-xs mt-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: AppColors.textMuted
              }}
            >
              You can edit this message before sending
            </p>
          </div>

          {/* Profile Tags Used */}
          <div>
            <h3
              className="text-sm mb-3"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 500,
                color: AppColors.textMuted
              }}
            >
              Based on your profile:
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileTags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full"
                  style={{ backgroundColor: AppColors.greenBackground }}
                >
                  <Check
                    className="w-4 h-4"
                    style={{ color: AppColors.forestGreen }}
                  />
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: AppColors.textDark
                    }}
                  >
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Language Indicator */}
          <div
            className="p-4 rounded-2xl"
            style={{ backgroundColor: AppColors.greenBackground }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: AppColors.forestGreen }}
              />
              <span
                className="text-sm"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: AppColors.textDark
                }}
              >
                Application will be sent in <strong>English</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Send Button - Fixed at Bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 p-5"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)'
        }}
      >
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-98"
          style={{
            backgroundColor: isLoading ? AppColors.textMuted : AppColors.greenLight,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            color: AppColors.surfaceWhite,
            fontSize: '16px',
            maxWidth: '448px',
            margin: '0 auto',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? 'Generating...' : 'Send Application'}
        </button>
      </div>
    </div>
  );
}
