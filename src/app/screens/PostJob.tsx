import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AppColors } from '../constants/colors';
import { ArrowLeft, Minus, Plus, MapPin, Calendar, Users, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TOTAL_STEPS = 3;
const STORAGE_KEY = 'postJobDraft';

const JOB_TYPES = [
  { emoji: '⏱️', id: 'Casual', labelKey: 'postJob.job_types.casual' },
  { emoji: '📅', id: 'Short-term', labelKey: 'postJob.job_types.short_term' },
  { emoji: '🗓️', id: 'Full-time', labelKey: 'postJob.job_types.full_time' },
  { emoji: '🎓', id: 'Apprenticeship', labelKey: 'postJob.job_types.apprenticeship' },
];

const PAY_PERIODS = [
  { id: 'Per Day', labelKey: 'postJob.pay_periods.per_day' },
  { id: 'Per Week', labelKey: 'postJob.pay_periods.per_week' },
  { id: 'Per Month', labelKey: 'postJob.pay_periods.per_month' },
  { id: 'Fixed Total', labelKey: 'postJob.pay_periods.fixed_total' },
];

interface JobDraft {
  title: string;
  type: string;
  description: string;
  location: string;
  payAmount: string;
  payPeriod: string;
  duration: string;
  workers: number;
}

function loadDraft(): JobDraft {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {
    title: '',
    type: '',
    description: '',
    location: '',
    payAmount: '',
    payPeriod: '',
    duration: '',
    workers: 1,
  };
}

function getEmployerProfile() {
  try {
    const stored = localStorage.getItem('employerProfile');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { orgName: 'My Organisation', location: '' };
}

export default function PostJob() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState<JobDraft>(loadDraft);
  const employer = getEmployerProfile();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const update = (fields: Partial<JobDraft>) =>
    setDraft((prev) => ({ ...prev, ...fields }));

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    if (step === 0) {
      navigate(-1);
      return;
    }
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const canProceed = (() => {
    switch (step) {
      case 0: return draft.title.trim() && draft.type && draft.description.trim();
      case 1: return draft.location.trim() && draft.payAmount.trim() && draft.payPeriod && draft.duration.trim();
      case 2: return true;
      default: return false;
    }
  })();

  const handlePublish = () => {
    const newJob = {
      id: `emp-${Date.now()}`,
      title: draft.title.trim(),
      type: draft.type,
      description: draft.description.trim(),
      location: draft.location.trim(),
      payAmount: draft.payAmount.trim(),
      payPeriod: draft.payPeriod,
      payRate: `${Number(draft.payAmount).toLocaleString()} RWF/${draft.payPeriod.replace('Per ', '').replace('Fixed Total', 'total').toLowerCase()}`,
      duration: draft.duration.trim(),
      workers: draft.workers,
      employer: employer.orgName,
      employerLocation: employer.location,
      status: 'active',
      createdAt: new Date().toISOString(),
      applicants: 0,
    };

    try {
      const existing = localStorage.getItem('employerJobs');
      const jobs = existing ? JSON.parse(existing) : [];
      jobs.unshift(newJob);
      localStorage.setItem('employerJobs', JSON.stringify(jobs));
    } catch {
      localStorage.setItem('employerJobs', JSON.stringify([newJob]));
    }

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
        className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <button
          onClick={goBack}
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1
          className="flex-1 text-center text-xl text-white"
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
        >
          {t('postJob.title')}
        </h1>
        <span
          className="text-white/70 flex-shrink-0"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', minWidth: '64px', textAlign: 'right' }}
        >
          {t('postJob.step_of', { current: step + 1, total: 3 })}
        </span>
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
              {step === 0 && <Step1 draft={draft} update={update} />}
              {step === 1 && <Step2 draft={draft} update={update} />}
              {step === 2 && <Step3 draft={draft} employer={employer} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Button Bar */}
      <div
        className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
        }}
      >
        {step > 0 && (
          <button
            onClick={goBack}
            className="p-3 rounded-2xl flex-shrink-0"
            style={{ border: `1.5px solid ${AppColors.border}` }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: AppColors.textDark }} />
          </button>
        )}
        <button
          onClick={step === TOTAL_STEPS - 1 ? handlePublish : goNext}
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
          {step === TOTAL_STEPS - 1 ? `🚀 ${t('postJob.publish')}` : t('postJob.next')}
        </button>
      </div>
    </div>
  );
}

/* ── Shared UI ───────────────────────────────────────────────── */

function StepHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="text-4xl mb-3">{emoji}</div>
      <h2
        className="text-xl mb-1"
        style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
      >
        {title}
      </h2>
    </div>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <p
      className="mb-2"
      style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '14px', color: AppColors.textDark }}
    >
      {children}
    </p>
  );
}

function InputField({
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  prefix?: string;
  suffix?: string;
  type?: string;
}) {
  return (
    <div
      className="flex items-center rounded-xl overflow-hidden"
      style={{ border: `1px solid ${AppColors.border}`, backgroundColor: AppColors.surfaceWhite }}
    >
      {prefix && <span className="pl-3 text-lg flex-shrink-0">{prefix}</span>}
      <input
        type={type}
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
      {suffix && (
        <span
          className="pr-3 flex-shrink-0"
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: AppColors.textMuted }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}

/* ── Step 1: Job Basics ──────────────────────────────────────── */

function Step1({
  draft,
  update,
}: {
  draft: JobDraft;
  update: (f: Partial<JobDraft>) => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <StepHeader emoji="📋" title={t('postJob.step1_title')} />

      <div className="mb-4">
        <FieldLabel>{t('postJob.job_title_label')}</FieldLabel>
        <InputField
          value={draft.title}
          onChange={(v) => update({ title: v })}
          placeholder={t('postJob.job_title_placeholder')}
        />
      </div>

      <div className="mb-4">
        <FieldLabel>{t('postJob.job_type_label')}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map(({ emoji, id, labelKey }) => {
            const selected = draft.type === id;
            return (
              <button
                key={id}
                onClick={() => update({ type: id })}
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
      </div>

      <div>
        <FieldLabel>{t('postJob.description_label')}</FieldLabel>
        <textarea
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder={t('postJob.description_placeholder')}
          rows={4}
          className="w-full px-3 py-3.5 rounded-xl resize-none focus:outline-none focus:ring-2"
          style={{
            border: `1px solid ${AppColors.border}`,
            backgroundColor: AppColors.surfaceWhite,
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '16px',
            color: AppColors.textDark,
          }}
        />
      </div>
    </>
  );
}

/* ── Step 2: Details & Pay ───────────────────────────────────── */

function Step2({
  draft,
  update,
}: {
  draft: JobDraft;
  update: (f: Partial<JobDraft>) => void;
}) {
  const { t } = useTranslation();
  const adjustWorkers = (delta: number) => {
    const next = Math.max(1, Math.min(50, draft.workers + delta));
    update({ workers: next });
  };

  return (
    <>
      <StepHeader emoji="💰" title={t('postJob.step2_title')} />

      <div className="mb-4">
        <FieldLabel>{t('postJob.location_label')}</FieldLabel>
        <InputField
          value={draft.location}
          onChange={(v) => update({ location: v })}
          placeholder={t('postJob.location_placeholder')}
          prefix="📍"
        />
      </div>

      <div className="mb-4">
        <FieldLabel>{t('postJob.pay_amount_label')}</FieldLabel>
        <InputField
          value={draft.payAmount}
          onChange={(v) => update({ payAmount: v.replace(/[^0-9]/g, '') })}
          placeholder={t('postJob.pay_placeholder')}
          type="text"
          suffix="RWF"
        />
      </div>

      <div className="mb-4">
        <FieldLabel>{t('postJob.pay_period_label')}</FieldLabel>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PAY_PERIODS.map((period) => {
            const selected = draft.payPeriod === period.id;
            return (
              <button
                key={period.id}
                onClick={() => update({ payPeriod: period.id })}
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
                {t(period.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <FieldLabel>{t('postJob.duration_label')}</FieldLabel>
        <InputField
          value={draft.duration}
          onChange={(v) => update({ duration: v })}
          placeholder={t('postJob.duration_placeholder')}
        />
      </div>

      <div>
        <FieldLabel>{t('postJob.workers_label')}</FieldLabel>
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{ border: `1px solid ${AppColors.border}`, backgroundColor: AppColors.surfaceWhite }}
        >
          <button
            onClick={() => adjustWorkers(-1)}
            disabled={draft.workers <= 1}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor: draft.workers <= 1 ? AppColors.surfaceLight : AppColors.greenBackground,
              border: `1.5px solid ${draft.workers <= 1 ? AppColors.border : AppColors.forestGreen}`,
              cursor: draft.workers <= 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <Minus
              className="w-4 h-4"
              style={{ color: draft.workers <= 1 ? AppColors.textMuted : AppColors.forestGreen }}
            />
          </button>

          <span
            className="text-2xl"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.textDark }}
          >
            {draft.workers}
          </span>

          <button
            onClick={() => adjustWorkers(1)}
            disabled={draft.workers >= 50}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
            style={{
              backgroundColor: draft.workers >= 50 ? AppColors.surfaceLight : AppColors.greenBackground,
              border: `1.5px solid ${draft.workers >= 50 ? AppColors.border : AppColors.forestGreen}`,
              cursor: draft.workers >= 50 ? 'not-allowed' : 'pointer',
            }}
          >
            <Plus
              className="w-4 h-4"
              style={{ color: draft.workers >= 50 ? AppColors.textMuted : AppColors.forestGreen }}
            />
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Step 3: Preview & Publish ───────────────────────────────── */

function Step3({
  draft,
  employer,
}: {
  draft: JobDraft;
  employer: { orgName: string; location: string };
}) {
  const { t } = useTranslation();
  const payRate = `${Number(draft.payAmount).toLocaleString()} RWF/${draft.payPeriod.replace('Per ', '').replace('Fixed Total', 'total').toLowerCase()}`;

  return (
    <>
      <StepHeader emoji="👁️" title={t('postJob.step3_title')} />

      {/* Preview Card */}
      <div
        className="rounded-3xl overflow-hidden mb-6"
        style={{
          backgroundColor: AppColors.surfaceWhite,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Green Gradient Banner */}
        <div
          className="px-5 pt-5 pb-4 relative"
          style={{
            background: `linear-gradient(135deg, ${AppColors.forestGreen} 0%, ${AppColors.forestDark} 100%)`,
          }}
        >
          <span
            className="px-3 py-1 rounded-full text-[13px]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
            }}
          >
            {draft.type}
          </span>
          <h3
            className="text-xl text-white mt-3"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
          >
            {draft.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-sm text-white/80"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {employer.orgName}
            </span>
            <BadgeCheck className="w-4 h-4 text-white/60" />
          </div>
        </div>

        {/* Card Body */}
        <div className="px-5 py-5 space-y-4">
          {/* Info Pills */}
          <div className="flex flex-wrap gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-full"
              style={{ backgroundColor: AppColors.greenBackground }}
            >
              <MapPin className="w-4 h-4" style={{ color: AppColors.forestGreen }} />
              <span
                className="text-sm"
                style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textDark }}
              >
                {draft.location}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-full"
              style={{ backgroundColor: AppColors.greenBackground }}
            >
              <Calendar className="w-4 h-4" style={{ color: AppColors.forestGreen }} />
              <span
                className="text-sm"
                style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textDark }}
              >
                {draft.duration}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-full"
              style={{ backgroundColor: AppColors.greenBackground }}
            >
              <Users className="w-4 h-4" style={{ color: AppColors.forestGreen }} />
              <span
                className="text-sm"
                style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textDark }}
              >
                {draft.workers} {t('postJob.needed_suffix')}
              </span>
            </div>
          </div>

          {/* Pay Rate */}
          <div>
            <p
              className="text-sm mb-1"
              style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted }}
            >
              {t('postJob.pay_amount_label')}
            </p>
            <p
              className="text-2xl"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: AppColors.forestGreen }}
            >
              {payRate}
            </p>
          </div>

          {/* Description */}
          <div>
            <p
              className="text-sm mb-2"
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 600, color: AppColors.textDark }}
            >
              {t('postJob.about_job')}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted, lineHeight: '1.7' }}
            >
              {draft.description}
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div
        className="p-4 rounded-2xl"
        style={{ backgroundColor: AppColors.greenBackground }}
      >
        <p
          className="text-sm"
          style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.forestGreen, lineHeight: '1.5' }}
        >
          {t('postJob.instant_publish')}
        </p>
      </div>
    </>
  );
}
