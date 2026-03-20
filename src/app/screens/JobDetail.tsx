import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AppColors } from '../constants/colors';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Zap,
  BadgeCheck,
  Heart,
  Sparkles,
} from 'lucide-react';
import type { Job } from '../constants/mockJobs';

export default function JobDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const job = (location.state as { job?: Job })?.job;

  const [saved, setSaved] = useState(() => {
    if (!job) return false;
    try {
      const stored = localStorage.getItem('savedJobs');
      if (stored) {
        const savedJobs = JSON.parse(stored);
        return savedJobs.some((j: any) => j.id === job.id);
      }
    } catch { /* ignore */ }
    return false;
  });

  const toggleSave = () => {
    if (!job) return;
    try {
      const stored = localStorage.getItem('savedJobs');
      let savedJobs = stored ? JSON.parse(stored) : [];
      if (saved) {
        savedJobs = savedJobs.filter((j: any) => j.id !== job.id);
      } else {
        savedJobs.push(job);
      }
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setSaved(!saved);
    } catch { /* ignore */ }
  };

  // No job passed — go back immediately
  if (!job) {
    navigate(-1);
    return null;
  }

  const infoPills = [
    { icon: MapPin, text: job.distance },
    { icon: Calendar, text: job.duration },
    { icon: Users, text: `${job.workers} needed` },
  ];

  // Derive some "skills required" from the job type & title for display
  const skillsRequired = (() => {
    const skills: string[] = [];
    const t = `${job.title} ${job.description}`.toLowerCase();
    if (t.includes('farm') || t.includes('harvest') || t.includes('tea')) skills.push('Farming', 'Manual Labour');
    if (t.includes('construct') || t.includes('building')) skills.push('Construction', 'Heavy Lifting');
    if (t.includes('cook') || t.includes('kitchen') || t.includes('restaurant')) skills.push('Cooking', 'Cleaning');
    if (t.includes('driv')) skills.push('Driving');
    if (t.includes('deliver')) skills.push('Delivery');
    if (skills.length === 0) skills.push('General Labour', 'Reliability');
    return skills;
  })();

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
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
          className="flex-1 text-center text-xl text-white"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
        >
          Job Details
        </h1>
        {/* Spacer to keep title centered */}
        <div className="w-10" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Hero Image */}
        <div className="relative w-full" style={{ height: '200px', backgroundColor: AppColors.border }}>
          <img
            src={job.image}
            alt={job.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />

          {/* Bottom gradient overlay */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
            }}
          />

          {/* Type Badge — bottom-left */}
          <div className="absolute bottom-4 left-4">
            <span
              className="px-4 py-1.5 rounded-full text-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                color: AppColors.textDark,
              }}
            >
              {job.type}
            </span>
          </div>

          {/* Match Score Badge — top-right */}
          {job.matchScore >= 75 && (
            <div
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: AppColors.aiAmber }}
            >
              <Zap className="w-4 h-4 text-white" fill="white" />
              <span
                className="text-sm text-white"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
              >
                {job.matchScore}% Match
              </span>
            </div>
          )}
        </div>

        <div className="max-w-md mx-auto px-5 py-6 space-y-6">
          {/* Employer Row */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: AppColors.greenBackground }}
            >
              <span
                className="text-lg"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.forestGreen }}
              >
                {job.employer.charAt(0)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-base"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
              >
                {job.employer}
              </span>
              {job.verified && (
                <BadgeCheck className="w-5 h-5" style={{ color: AppColors.forestGreen }} />
              )}
            </div>
          </div>

          {/* Job Title */}
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '26px',
              color: AppColors.textDark,
              lineHeight: 1.2,
            }}
          >
            {job.title}
          </h2>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-2">
            {infoPills.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full"
                style={{ backgroundColor: AppColors.greenBackground }}
              >
                <Icon className="w-4 h-4" style={{ color: AppColors.forestGreen }} />
                <span
                  className="text-sm"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textDark }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Pay Rate */}
          <div>
            <p
              className="text-sm mb-1"
              style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}
            >
              Pay Rate
            </p>
            <p
              className="text-3xl"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.forestGreen }}
            >
              {job.payRate}
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: AppColors.border }} />

          {/* About this job */}
          <div>
            <h3
              className="text-lg mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
            >
              About this job
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted, lineHeight: '1.7' }}
            >
              {job.description}
            </p>
          </div>

          {/* What you need */}
          <div>
            <h3
              className="text-lg mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
            >
              What you need
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full text-sm"
                  style={{
                    backgroundColor: AppColors.greenBackground,
                    border: `1px solid ${AppColors.forestGreen}30`,
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 500,
                    color: AppColors.forestGreen,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* AI Note */}
          {job.aiNote && (
            <div
              className="p-4 rounded-2xl"
              style={{ backgroundColor: AppColors.greenBackground }}
            >
              <div className="flex items-start gap-3">
                <Zap
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: AppColors.aiAmber }}
                  fill={AppColors.aiAmber}
                />
                <div>
                  <p
                    className="text-xs mb-1"
                    style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: AppColors.aiAmber }}
                  >
                    AI Insight
                  </p>
                  <p
                    className="text-sm"
                    style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textDark, lineHeight: '1.5' }}
                  >
                    {job.aiNote}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pinned Bottom Bar */}
      <div
        className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Save Button */}
        <button
          onClick={toggleSave}
          className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl transition-all"
          style={{
            backgroundColor: saved ? AppColors.greenBackground : AppColors.surfaceWhite,
            border: `1.5px solid ${saved ? AppColors.forestGreen : AppColors.border}`,
          }}
        >
          <Heart
            className="w-5 h-5"
            style={{ color: saved ? AppColors.forestGreen : AppColors.textMuted }}
            fill={saved ? AppColors.forestGreen : 'none'}
          />
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: saved ? AppColors.forestGreen : AppColors.textDark,
              whiteSpace: 'nowrap',
            }}
          >
            {saved ? 'Saved' : 'Save Job'}
          </span>
        </button>

        {/* Apply Button */}
        <button
          onClick={() => navigate(`/ai-application-review/${job.id}`)}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-transform active:scale-98"
          style={{
            backgroundColor: AppColors.greenLight,
            boxShadow: '0 4px 12px rgba(26, 122, 74, 0.2)',
          }}
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: AppColors.surfaceWhite,
            }}
          >
            Apply Now
          </span>
        </button>
      </div>
    </div>
  );
}
