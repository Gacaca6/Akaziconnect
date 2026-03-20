import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../../assets/logo.png';

const TOTAL_STEPS = 3;
const STORAGE_KEY = 'employerProfileDraft';

const EMPLOYER_TYPES = [
  { emoji: '🌾', id: 'Farm / Agriculture', labelKey: 'employerSetup.employer_types.farm' },
  { emoji: '🏗️', id: 'Construction', labelKey: 'employerSetup.employer_types.construction' },
  { emoji: '🏪', id: 'Small Business', labelKey: 'employerSetup.employer_types.small_business' },
  { emoji: '🤝', id: 'NGO / Charity', labelKey: 'employerSetup.employer_types.ngo' },
  { emoji: '🏘️', id: 'Cooperative', labelKey: 'employerSetup.employer_types.cooperative' },
  { emoji: '👤', id: 'Individual', labelKey: 'employerSetup.employer_types.individual' },
];

const JOB_TYPES = [
  { emoji: '⏱️', id: 'Casual (daily)', labelKey: 'employerSetup.job_types.casual' },
  { emoji: '📅', id: 'Short-term (weeks)', labelKey: 'employerSetup.job_types.short_term' },
  { emoji: '🗓️', id: 'Long-term (months)', labelKey: 'employerSetup.job_types.long_term' },
  { emoji: '🎓', id: 'Apprentice', labelKey: 'employerSetup.job_types.apprentice' },
];

const WORKER_COUNTS = ['1-2', '3-5', '6-10', '10-20', '20+'];

interface EmployerDraft {
  orgName: string;
  employerType: string;
  location: string;
  contactMethods: string[];
  whatsapp: string;
  jobTypes: string[];
  typicalWorkers: string;
}

function loadDraft(): EmployerDraft {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {
    orgName: '',
    employerType: '',
    location: '',
    contactMethods: [],
    whatsapp: '',
    jobTypes: [],
    typicalWorkers: '',
  };
}

export default function EmployerProfileSetup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [profile, setProfile] = useState<EmployerDraft>(loadDraft);

  // Save draft on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const update = (fields: Partial<EmployerDraft>) =>
    setProfile((prev) => ({ ...prev, ...fields }));

  const toggleArrayField = (field: 'contactMethods' | 'jobTypes', value: string) =>
    update({
      [field]: profile[field].includes(value)
        ? profile[field].filter((v) => v !== value)
        : [...profile[field], value],
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
      case 0: return profile.orgName.trim() && profile.employerType && profile.location.trim();
      case 1: return profile.contactMethods.length > 0;
      case 2: return profile.jobTypes.length > 0 && profile.typicalWorkers;
      default: return false;
    }
  })();

  const handleFinish = () => {
    if (!canProceed) return;
    localStorage.setItem(
      'employerProfile',
      JSON.stringify({
        orgName: profile.orgName.trim(),
        employerType: profile.employerType,
        location: profile.location.trim(),
        contactMethods: profile.contactMethods,
        whatsapp: profile.whatsapp.trim(),
        jobTypes: profile.jobTypes,
        typicalWorkers: profile.typicalWorkers,
      })
    );
    localStorage.removeItem(STORAGE_KEY);
    navigate('/employer-dashboard');
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
          {t('employerSetup.title')}
        </h1>
        <p
          className="text-white/70"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontStyle: 'italic' }}
        >
          {t('employerSetup.subtitle')}
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
              {step === 1 && <Step2 profile={profile} toggleContact={(v) => toggleArrayField('contactMethods', v)} update={update} />}
              {step === 2 && <Step3 profile={profile} toggleJobType={(v) => toggleArrayField('jobTypes', v)} update={update} />}
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
          {step === TOTAL_STEPS - 1 ? t('employerSetup.finish') : t('employerSetup.next')}
        </button>
      </div>
    </div>
  );
}

/* ── Shared UI ───────────────────────────────────────────────── */

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
      {prefix && <span className="pl-3 text-lg flex-shrink-0">{prefix}</span>}
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

/* ── Step 1: Your Organisation ───────────────────────────────── */

function Step1({
  profile,
  update,
}: {
  profile: EmployerDraft;
  update: (f: Partial<EmployerDraft>) => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <StepHeader emoji="🏢" title={t('employerSetup.step1_title')} />

      {/* Org Name */}
      <div className="mb-4">
        <InputField
          value={profile.orgName}
          onChange={(v) => update({ orgName: v })}
          placeholder={t('employerSetup.org_name_placeholder')}
        />
      </div>

      {/* Employer Type */}
      <p
        className="mb-3"
        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', color: AppColors.textDark }}
      >
        {t('employerSetup.employer_type_label')}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {EMPLOYER_TYPES.map(({ emoji, id, labelKey }) => {
          const selected = profile.employerType === id;
          return (
            <button
              key={id}
              onClick={() => update({ employerType: id })}
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
                {t(labelKey)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Location */}
      <InputField
        value={profile.location}
        onChange={(v) => update({ location: v })}
        placeholder={t('employerSetup.location_placeholder')}
        prefix="📍"
      />
    </>
  );
}

/* ── Step 2: Contact & Verification ──────────────────────────── */

function Step2({
  profile,
  toggleContact,
  update,
}: {
  profile: EmployerDraft;
  toggleContact: (v: string) => void;
  update: (f: Partial<EmployerDraft>) => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <StepHeader emoji="📞" title={t('employerSetup.step2_title')} />

      {/* Contact Method Cards */}
      <div className="flex gap-3 mb-6">
        {[
          { id: 'phone', emoji: '📱', label: t('employerSetup.contact_phone'), desc: t('employerSetup.contact_phone_desc') },
          { id: 'in-app', emoji: '💬', label: t('employerSetup.contact_message'), desc: t('employerSetup.contact_message_desc') },
        ].map(({ id, emoji, label, desc }) => {
          const selected = profile.contactMethods.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleContact(id)}
              className="flex-1 p-4 rounded-2xl text-center transition-all"
              style={{
                backgroundColor: AppColors.surfaceWhite,
                border: `2px solid ${selected ? AppColors.forestGreen : AppColors.border}`,
                boxShadow: selected ? '0 4px 12px rgba(26, 122, 74, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="text-3xl mb-2">{emoji}</div>
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
                  fontSize: '13px',
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

      {/* WhatsApp Number */}
      <p
        className="mb-2"
        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: '14px', color: AppColors.textDark }}
      >
        {t('employerSetup.whatsapp_label')}
      </p>
      <div className="mb-6">
        <InputField
          value={profile.whatsapp}
          onChange={(v) => update({ whatsapp: v })}
          placeholder={t('employerSetup.whatsapp_label')}
          prefix="💬"
        />
      </div>

      {/* Verification Info Box */}
      <div
        className="p-4 rounded-2xl"
        style={{ backgroundColor: AppColors.greenBackground }}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg flex-shrink-0 mt-0.5">✓</span>
          <div>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: AppColors.textDark,
                lineHeight: '1.5',
                marginBottom: '8px',
              }}
            >
              {t('employerSetup.verification_text')}
            </p>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: AppColors.forestGreen,
              }}
            >
              {t('employerSetup.request_verification')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Step 3: Hiring Preferences ──────────────────────────────── */

function Step3({
  profile,
  toggleJobType,
  update,
}: {
  profile: EmployerDraft;
  toggleJobType: (v: string) => void;
  update: (f: Partial<EmployerDraft>) => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <StepHeader emoji="👥" title={t('employerSetup.step3_title')} />

      {/* Job Type Chips */}
      <p
        className="mb-3"
        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', color: AppColors.textDark }}
      >
        {t('employerSetup.work_types_label')}
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {JOB_TYPES.map(({ emoji, id, labelKey }) => {
          const selected = profile.jobTypes.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleJobType(id)}
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
                {t(labelKey)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Typical Workers Count */}
      <p
        className="mb-3"
        style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', color: AppColors.textDark }}
      >
        {t('employerSetup.workers_needed_label')}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {WORKER_COUNTS.map((count) => {
          const selected = profile.typicalWorkers === count;
          return (
            <button
              key={count}
              onClick={() => update({ typicalWorkers: count })}
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
              {count}
            </button>
          );
        })}
      </div>
    </>
  );
}
