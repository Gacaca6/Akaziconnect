import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AppColors } from '../constants/colors';
import { ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../../assets/logo.png';

const TOTAL_STEPS = 4;
const STORAGE_KEY = 'seekerProfileDraft';

const SKILLS = [
  { emoji: '🌾', label: 'Farming' },
  { emoji: '🏗️', label: 'Construction' },
  { emoji: '🚗', label: 'Driving' },
  { emoji: '📦', label: 'Delivery' },
  { emoji: '🌿', label: 'Gardening' },
  { emoji: '🍳', label: 'Cooking' },
  { emoji: '🧹', label: 'Cleaning' },
  { emoji: '📱', label: 'Sales' },
  { emoji: '🔧', label: 'Repairs' },
  { emoji: '🐄', label: 'Livestock' },
  { emoji: '🌲', label: 'Forestry' },
  { emoji: '🧱', label: 'Masonry' },
  { emoji: '💧', label: 'Irrigation' },
  { emoji: '🎓', label: 'Teaching' },
  { emoji: '🏥', label: 'Health Worker' },
];

const AVAILABILITY_OPTIONS = [
  { id: 'immediately', emoji: '⚡', label: 'Immediately', desc: 'Can start right away' },
  { id: 'this-week', emoji: '📆', label: 'This week', desc: 'Available within 7 days' },
  { id: 'this-month', emoji: '🗓️', label: 'This month', desc: 'Available within 30 days' },
  { id: 'flexible', emoji: '🤝', label: 'Flexible', desc: 'Open to discuss' },
];

const DAYS_OPTIONS = ['1-2 days', '3-4 days', '5-6 days', 'Full time'];

interface ProfileDraft {
  firstName: string;
  lastName: string;
  location: string;
  skills: string[];
  availability: string;
  daysPerWeek: string;
  language: string[];
}

function loadDraft(): ProfileDraft {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {
    firstName: '',
    lastName: '',
    location: '',
    skills: [],
    availability: '',
    daysPerWeek: '',
    language: [],
  };
}

export default function SeekerProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialStep = (location.state as any)?.initialStep ?? 0;
  const [step, setStep] = useState(initialStep);
  const [direction, setDirection] = useState(1);
  const [profile, setProfile] = useState<ProfileDraft>(loadDraft);

  // Save draft on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const update = (fields: Partial<ProfileDraft>) =>
    setProfile((prev) => ({ ...prev, ...fields }));

  const toggleSkill = (skill: string) =>
    update({
      skills: profile.skills.includes(skill)
        ? profile.skills.filter((s) => s !== skill)
        : [...profile.skills, skill],
    });

  const toggleLanguage = (lang: string) =>
    update({
      language: profile.language.includes(lang)
        ? profile.language.filter((l) => l !== lang)
        : [...profile.language, lang],
    });

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const canProceed = (() => {
    switch (step) {
      case 0: return profile.firstName.trim() && profile.lastName.trim() && profile.location.trim();
      case 1: return profile.skills.length > 0;
      case 2: return profile.availability && profile.daysPerWeek;
      case 3: return profile.language.length > 0;
      default: return false;
    }
  })();

  const handleFinish = () => {
    if (!canProceed) return;
    localStorage.setItem(
      'seekerProfile',
      JSON.stringify({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        location: profile.location.trim(),
        skills: profile.skills,
        availability: profile.availability,
        daysPerWeek: profile.daysPerWeek,
        language: profile.language.length === 1 ? profile.language[0] : 'bilingual',
      })
    );
    localStorage.removeItem(STORAGE_KEY);
    navigate('/swipe-feed');
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: AppColors.surfaceLight }}>
      {/* Header */}
      <div
        className="px-5 pt-6 pb-5 flex flex-col items-center"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <img src={logo} alt="Akazi Connect" style={{ width: 32, height: 32, objectFit: 'contain', marginBottom: 12 }} />
        <h1
          className="text-white mb-1"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '22px' }}
        >
          Your Profile
        </h1>
        <p
          className="text-white/70"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontStyle: 'italic' }}
        >
          This replaces your CV — fill it once, use it forever
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 py-4" style={{ backgroundColor: AppColors.surfaceWhite }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? '24px' : '8px',
              height: '8px',
              backgroundColor: i <= step ? AppColors.forestGreen : AppColors.border,
            }}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="px-5 py-6 pb-28 max-w-md mx-auto">
              {step === 0 && <Step1 profile={profile} update={update} />}
              {step === 1 && <Step2 profile={profile} toggleSkill={toggleSkill} />}
              {step === 2 && <Step3 profile={profile} update={update} />}
              {step === 3 && <Step4 profile={profile} toggleLanguage={toggleLanguage} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Button Bar */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
        }}
      >
        {step === 0 ? (
          <button
            onClick={() => navigate('/role-selection')}
            className="p-3 rounded-2xl flex-shrink-0"
            style={{ border: `1.5px solid ${AppColors.border}` }}
          >
            <X className="w-5 h-5" style={{ color: AppColors.textDark }} />
          </button>
        ) : (
          <button
            onClick={goBack}
            className="p-3 rounded-2xl flex-shrink-0"
            style={{ border: `1.5px solid ${AppColors.border}` }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: AppColors.textDark }} />
          </button>
        )}
        <button
          onClick={step === TOTAL_STEPS - 1 ? handleFinish : goNext}
          disabled={!canProceed}
          className="flex-1 py-4 rounded-2xl transition-all"
          style={{
            backgroundColor: canProceed ? AppColors.greenLight : AppColors.textMuted,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            color: AppColors.surfaceWhite,
            fontSize: '16px',
            cursor: canProceed ? 'pointer' : 'not-allowed',
            maxWidth: '448px',
          }}
        >
          {step === TOTAL_STEPS - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

/* ── Step Components ─────────────────────────────────────────── */

function StepHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="text-4xl mb-3">{emoji}</div>
      <h2
        className="text-xl mb-1"
        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: AppColors.textMuted }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function InputField({
  value,
  onChange,
  placeholder,
  prefix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  prefix?: string;
}) {
  return (
    <div
      className="flex items-center rounded-xl overflow-hidden"
      style={{ border: `1px solid ${AppColors.border}`, backgroundColor: AppColors.surfaceWhite }}
    >
      {prefix && (
        <span className="pl-3 text-lg flex-shrink-0">{prefix}</span>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-3.5 focus:outline-none"
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '16px',
          color: AppColors.textDark,
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}

function Step1({
  profile,
  update,
}: {
  profile: ProfileDraft;
  update: (f: Partial<ProfileDraft>) => void;
}) {
  return (
    <>
      <StepHeader emoji="👤" title="What is your name?" />
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <InputField
            value={profile.firstName}
            onChange={(v) => update({ firstName: v })}
            placeholder="First name"
          />
        </div>
        <div className="flex-1">
          <InputField
            value={profile.lastName}
            onChange={(v) => update({ lastName: v })}
            placeholder="Last name"
          />
        </div>
      </div>
      <InputField
        value={profile.location}
        onChange={(v) => update({ location: v })}
        placeholder="Your sector or cell e.g. Musanze"
        prefix="📍"
      />
    </>
  );
}

function Step2({
  profile,
  toggleSkill,
}: {
  profile: ProfileDraft;
  toggleSkill: (skill: string) => void;
}) {
  return (
    <>
      <StepHeader
        emoji="💪"
        title="Select your skills"
        subtitle="Choose all that apply — this is how employers find you"
      />
      <div className="flex flex-wrap gap-2">
        {SKILLS.map(({ emoji, label }) => {
          const selected = profile.skills.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggleSkill(label)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full transition-all"
              style={{
                backgroundColor: selected ? AppColors.greenBackground : AppColors.surfaceWhite,
                border: `1.5px solid ${selected ? AppColors.forestGreen : AppColors.border}`,
              }}
            >
              <span className="text-base">{emoji}</span>
              <span
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  fontWeight: selected ? 600 : 400,
                  color: selected ? AppColors.forestGreen : AppColors.textDark,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function Step3({
  profile,
  update,
}: {
  profile: ProfileDraft;
  update: (f: Partial<ProfileDraft>) => void;
}) {
  return (
    <>
      <StepHeader emoji="📅" title="When can you work?" />

      {/* Availability Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {AVAILABILITY_OPTIONS.map(({ id, emoji, label, desc }) => {
          const selected = profile.availability === id;
          return (
            <button
              key={id}
              onClick={() => update({ availability: id })}
              className="p-4 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: AppColors.surfaceWhite,
                border: `2px solid ${selected ? AppColors.forestGreen : AppColors.border}`,
                boxShadow: selected ? '0 4px 12px rgba(26, 122, 74, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="text-2xl mb-2">{emoji}</div>
              <div
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: selected ? AppColors.forestGreen : AppColors.textDark,
                  marginBottom: '2px',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '12px',
                  color: AppColors.textMuted,
                }}
              >
                {desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Days Per Week */}
      <p
        className="mb-3"
        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', color: AppColors.textDark }}
      >
        Days per week
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DAYS_OPTIONS.map((option) => {
          const selected = profile.daysPerWeek === option;
          return (
            <button
              key={option}
              onClick={() => update({ daysPerWeek: option })}
              className="flex-shrink-0 px-4 py-2.5 rounded-full transition-all"
              style={{
                backgroundColor: selected ? AppColors.forestGreen : AppColors.surfaceWhite,
                border: `1.5px solid ${selected ? AppColors.forestGreen : AppColors.border}`,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: selected ? 600 : 400,
                color: selected ? AppColors.surfaceWhite : AppColors.textDark,
                whiteSpace: 'nowrap',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </>
  );
}

function Step4({
  profile,
  toggleLanguage,
}: {
  profile: ProfileDraft;
  toggleLanguage: (lang: string) => void;
}) {
  const both = profile.language.includes('english') && profile.language.includes('kinyarwanda');
  return (
    <>
      <StepHeader
        emoji="🗣️"
        title="How should we write your applications?"
        subtitle="Your AI assistant will write job applications in this language"
      />
      <div className="flex gap-3 mb-4">
        {[
          { id: 'english', flag: '🇬🇧', label: 'English', desc: 'Professional and widely understood' },
          { id: 'kinyarwanda', flag: '🇷🇼', label: 'Kinyarwanda', desc: 'More personal and natural for local employers' },
        ].map(({ id, flag, label, desc }) => {
          const selected = profile.language.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleLanguage(id)}
              className="flex-1 p-4 rounded-2xl text-center transition-all"
              style={{
                backgroundColor: AppColors.surfaceWhite,
                border: `2px solid ${selected ? AppColors.forestGreen : AppColors.border}`,
                boxShadow: selected ? '0 4px 12px rgba(26, 122, 74, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="text-3xl mb-2">{flag}</div>
              <div
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: selected ? AppColors.forestGreen : AppColors.textDark,
                  marginBottom: '4px',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '12px',
                  color: AppColors.textMuted,
                  lineHeight: '1.4',
                }}
              >
                {desc}
              </div>
            </button>
          );
        })}
      </div>

      {both && (
        <div
          className="p-3 rounded-xl flex items-center gap-2"
          style={{ backgroundColor: AppColors.greenBackground }}
        >
          <span className="text-lg">✨</span>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: AppColors.forestGreen,
            }}
          >
            We'll write in English with a Kinyarwanda greeting
          </p>
        </div>
      )}
    </>
  );
}
