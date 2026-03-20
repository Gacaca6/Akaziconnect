# Akazi Connect — Claude Code Project Guide

## What This Project Is
Akazi Connect is a mobile-first web app job marketplace for rural Rwandan youth aged 18–30.
It connects job seekers with local employers (farmers, cooperatives, NGOs, SMEs).
This is a university capstone project for Nyenyeri Patience at African Leadership University (ALU).
Deadline: March 29, 2026.

## The Core Innovation
- **Tinder-style swipe feed** — users swipe right to apply, left to skip (with real drag gesture)
- **AI application writer** — Claude API writes a personalised job application from the user's profile
- **Zero CV required** — onboarding profile replaces CV entirely
- **Offline-first** — job cards cached locally via localStorage for use without internet
- **Bilingual** — English default, Kinyarwanda support

## Tech Stack
- **Frontend:** React + Vite (mobile-first web app)
- **Styling:** Tailwind CSS + inline styles using AppColors constants
- **Navigation:** React Router v6
- **State management:** Zustand (global) + useState (local component state)
- **Animations:** Framer Motion (motion/react)
- **Swipe gesture:** react-swipeable
- **Icons:** lucide-react
- **AI:** Claude API — claude-sonnet-4-20250514 (application writing + job matching)
- **Backend:** Node.js + Express + PostgreSQL
- **Auth:** Africa's Talking SMS OTP
- **Deployment:** Vercel (frontend) + Railway (backend)

## Design System — NEVER DEVIATE FROM THIS

### Colours — always use AppColors constants, never hardcode hex values
```
AppColors.forestDark      = #0F4D2E   ← headers, cover elements
AppColors.forestGreen     = #1A7A4A   ← primary actions, icons, links
AppColors.greenLight      = #25A862   ← buttons, CTAs, apply action
AppColors.greenBackground = #F0FAF4   ← card tints, AI notes, info boxes
AppColors.aiAmber         = #F59E0B   ← AI features ONLY — match scores, AI badges
AppColors.skipRed         = #EF4444   ← skip/reject actions, errors
AppColors.textDark        = #1F2937   ← primary body text, headings
AppColors.textMuted       = #9CA3AF   ← secondary labels, metadata, captions
AppColors.surfaceWhite    = #FFFFFF   ← card backgrounds
AppColors.surfaceLight    = #F3F4F6   ← screen backgrounds
AppColors.border          = #E5E7EB   ← dividers, card borders, input borders
```

### Typography
- **Display / headings / numbers:** Space Grotesk, weight 700
- **Body / labels / metadata:** DM Sans, weight 400–600
- Never use any other font

### Spacing (4px base unit)
- xs=4px, sm=8px, md=12px, lg=16px, xl=20px, xl2=24px, xl3=32px

### Corner Radius
- Cards: 24px (rounded-3xl)
- Buttons: 14px (rounded-2xl)
- Chips/pills: 9999px (rounded-full)
- Inputs: 12px (rounded-xl)

### Shadows
- Cards: 0 2px 12px rgba(0,0,0,0.06)
- Elevated cards: 0 10px 40px rgba(0,0,0,0.1)
- Buttons: 0 4px 12px rgba(26,122,74,0.2)

## Folder Structure
```
src/
├── main.tsx
├── app/
│   ├── constants/
│   │   └── colors.ts            ← AppColors — single source of truth
│   ├── screens/                 ← one file per screen
│   │   ├── SplashScreen.tsx     ← S-01
│   │   ├── OnboardingCarousel.tsx ← S-02
│   │   ├── RoleSelection.tsx    ← S-03
│   │   ├── PhoneEntry.tsx       ← S-04
│   │   ├── OTPVerification.tsx  ← S-05
│   │   ├── SeekerProfileSetup.tsx ← S-06
│   │   ├── EmployerProfileSetup.tsx ← S-07
│   │   ├── SwipeFeed.tsx        ← S-08 CORE SCREEN
│   │   ├── JobDetail.tsx        ← S-09
│   │   ├── AIApplicationReview.tsx ← S-10 CORE SCREEN
│   │   ├── ApplicationSent.tsx  ← S-11
│   │   ├── FilterSearch.tsx     ← S-12
│   │   ├── SavedJobs.tsx        ← S-13
│   │   ├── NoJobsNearby.tsx     ← S-14
│   │   ├── MyApplications.tsx   ← S-15
│   │   ├── ApplicationDetail.tsx ← S-16
│   │   ├── MessagesInbox.tsx    ← S-17
│   │   ├── MessageThread.tsx    ← S-18
│   │   ├── MyProfile.tsx        ← S-19
│   │   ├── EditProfile.tsx      ← S-20
│   │   ├── SkillsManagement.tsx ← S-21
│   │   ├── RateEmployer.tsx     ← S-22
│   │   ├── Notifications.tsx    ← S-23
│   │   ├── EmployerDashboard.tsx ← S-24 CORE SCREEN
│   │   ├── PostJobStep1.tsx     ← S-25
│   │   ├── PostJobStep2.tsx     ← S-26
│   │   ├── PostJobStep3.tsx     ← S-27
│   │   ├── MyListings.tsx       ← S-28
│   │   ├── ListingDetail.tsx    ← S-29
│   │   ├── ApplicantsList.tsx   ← S-30
│   │   ├── ApplicantProfile.tsx ← S-31
│   │   ├── MessageApplicant.tsx ← S-32
│   │   ├── CloseEditJob.tsx     ← S-33
│   │   ├── RateReview.tsx       ← S-34
│   │   ├── ReportFlag.tsx       ← S-35
│   │   ├── OfflineCachedJobs.tsx ← S-36
│   │   ├── AdminDashboard.tsx   ← S-37
│   │   ├── AdminUsers.tsx       ← S-38
│   │   ├── AdminModeration.tsx  ← S-39
│   │   ├── AdminDisputes.tsx    ← S-40
│   │   └── AdminAnalytics.tsx   ← S-41
│   └── components/
│       ├── BottomNav.tsx
│       ├── JobCard.tsx
│       ├── ApplicantCard.tsx
│       ├── AcButton.tsx
│       ├── AcInput.tsx
│       └── MatchScoreBadge.tsx
├── assets/
│   └── logo.png                 ← import as: import logo from '../assets/logo.png'
└── styles/
    ├── index.css
    ├── fonts.css
    ├── tailwind.css
    └── theme.css
```

## What Currently Exists (8 of 41 screens)
- S-01 SplashScreen.tsx ✅
- S-03 RoleSelection.tsx ✅
- S-08 SwipeFeed.tsx ✅ — needs real swipe gesture
- S-10 AIApplicationReview.tsx ✅ — needs real Claude API
- S-15 AppliedJobs.tsx ✅
- S-17 Messages.tsx ✅
- S-19 Profile.tsx ✅
- S-24 EmployerDashboard.tsx ✅

## Priority Build Order
1. Fix logo import — replace figma:asset/ with ../assets/logo.png
2. Add real swipe gesture to SwipeFeed.tsx using react-swipeable
3. Connect Claude API to AIApplicationReview.tsx
4. S-04 Phone Entry
5. S-05 OTP Verification
6. S-06 Seeker Profile Setup (name, location, skills, availability, language pref)
7. S-09 Job Detail
8. S-11 Application Sent
9. S-25/26/27 Post Job flow
10. Remaining screens

## AI Integration — Claude API

### Application Writing (S-10)
```javascript
const model = "claude-sonnet-4-20250514";

const systemPrompt = `You are a helpful assistant that writes short,
professional job application messages for rural Rwandan youth.
Write in a warm, direct, confident tone. 3-4 sentences maximum.
If language is 'kinyarwanda', write entirely in Kinyarwanda.
If language is 'english', write in English.`;

const userPrompt = `Write a job application message for:
Applicant: ${profile.name} from ${profile.location}
Skills: ${profile.skills.join(', ')}
Availability: ${profile.availability}
Language: ${profile.language}

Job:
Title: ${job.title}
Employer: ${job.employer}
Location: ${job.location}
Pay: ${job.payRate}`;
```

## Key Product Decisions — Never Change These
- Swipe LEFT = skip
- Swipe RIGHT = apply → goes to AI Application Review
- Employer side = traditional post-and-review, NO swipe mechanic
- No CV anywhere in the app
- AI match scores visible to employers in applicant list
- Application arrives to employer as plain text — NO AI label shown to employer
- AI badge shown to job seeker only on S-10 so they know they can edit it
- Phone OTP via Africa's Talking

## Critical Code Rules
1. Never hardcode colours — always AppColors.xxx
2. Never use default browser blue
3. Every screen needs a custom header — no bare browser defaults
4. All cards: rounded corners + subtle shadow
5. Empty states: large emoji + heading + subtext — never a blank screen
6. Loading states: skeleton shimmer — never a plain spinner
7. Logo: import logo from '../assets/logo.png' — NEVER figma:asset/
8. Mobile-first: max-width 448px centered
9. One screen at a time — build, show me, get approval, then next screen

## App Identity
- Name: Akazi Connect
- Tagline: "Umurimo Wawe" (Your Work in Kinyarwanda)
- Target: Rural Rwandan youth 18–30
- Vibe: WhatsApp simplicity + Tinder mechanic + African fintech warmth
- NOT corporate. NOT generic. Warm, hopeful, community-oriented.

## Capstone Context
- Student: Nyenyeri Patience
- Institution: African Leadership University (ALU)
- Deadline: March 29, 2026
- Quality over speed — every screen reviewed before moving to the next
