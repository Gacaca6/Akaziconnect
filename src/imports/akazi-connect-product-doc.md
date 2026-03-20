PRODUCT DESIGN DOCUMENT
Akazi Connect
Connecting Rural Rwandan Youth to Real Work


Prepared by
Nyenyeri Patience

Institution
African Leadership University (ALU)

Project Type
Capstone Project — MVP + Phase 2 Vision

Version
v2.0 — Redesign

Date
March 2026
 
1. Executive Summary

Akazi Connect is a mobile-first job marketplace designed specifically for rural Rwandan youth aged 18–30. Built on research into real usage patterns of this demographic, the product takes a fundamentally different approach to job discovery: instead of complex CV uploads and form-heavy applications, it uses a Tinder-style swipe interface powered by an AI layer that writes personalised job applications on behalf of the user.

The product vision is grounded in three research-backed truths about the target user:
•	They use WhatsApp and MTN MoMo daily — familiar, minimal, tap-first interfaces
•	They face significant literacy and confidence barriers when applying for work
•	Phone calls and word-of-mouth are still the primary job discovery methods, indicating an unmet digital need

	Design Philosophy
Akazi Connect removes every possible barrier between a young person and a job. One profile. One swipe. One tap to send an AI-written application. That is the entire flow.

2. Research Foundation

Every design decision in this document is traceable to a specific piece of research. The following findings shaped the product from the ground up.
2.1 The Problem Is Quantified
Finding	Source	Design Implication
Youth unemployment (16–30) stands at 18% in Rwanda	Rwanda Labour Force Survey 2024	Large, validated addressable market
Rural unemployment (15.2%) exceeds urban (13.6%)	NISR Rwanda 2024	Rural-first is the right focus
75%+ of Rwandan youth work in the informal sector	ILO Africa Report 2024	Target casual/gig work, not formal jobs only
Core barriers: mismatches, limited opportunities, informal work	Ministry of Youth Rwanda	Product must solve discovery AND application friction

2.2 Who The Users Are
Characteristic	Data Point	Source
Primary device	Budget Android (Infinix SMART 5 most common)	Statcounter Rwanda 2024
Smartphone ownership	34% of households	NISR Household Survey 2024
Target age group on smartphones	72.1% are aged 25–34	Rwanda mobile data 2024
Peak usage time	5 PM – 9 PM daily	DAI Digital Insights Rwanda
Internet access	Intermittent; 34.4% national penetration	ITU Rwanda 2024

2.3 How They Already Use Apps
A 2017 field study of 116 rural youth outside Kigali (DAI Global Digital) found that phone calls were consistently in the top four methods for hearing about jobs, training, and opportunities. This established that the target demographic is mobile-ready but lacks a structured digital job discovery tool.

The most used apps among Rwandan users are:
•	WhatsApp — conversational, list-based, fast, trusted for both personal and business use
•	Facebook — dominant at 62%+ social media share in Rwanda
•	MTN MoMo — daily transactional app; simple tap-to-complete flows

	Key Insight
Users are comfortable with WhatsApp-style and MoMo-style UX: clean lists, minimal text, fast navigation, and clear single-purpose screens. This directly informed the Telegram-inspired UI direction.

3. Product Vision & Goals

3.1 Vision Statement
	Vision
Akazi Connect becomes the trusted employment layer for rural Rwanda — the first place a young person looks when they need work, and the first place a local employer looks when they need help.

3.2 The Core Innovation
Unlike any existing job platform in Rwanda, Akazi Connect combines three elements that have never appeared together in this context:

Innovation	What It Means	Why It Matters
Swipe-to-apply	Tinder-style card stack; swipe right to apply, left to skip	Eliminates form anxiety; familiar gesture mechanic
AI application writer	Claude AI generates a personalised application from your profile	Removes the #1 barrier: 'I don't know what to write'
Kinyarwanda support	AI writes in English by default; switches to Kinyarwanda on request	Meets users in their primary language

3.3 Primary Goals
•	Increase access to job opportunities for rural youth aged 18–30
•	Reduce friction between employers and job seekers to near zero
•	Enable faster local job matching through AI-powered relevance scoring
•	Build trust through employer verification and post-job ratings
3.4 Success Metrics (KPIs)
Metric	MVP Target (Month 3)	Phase 2 Target (Month 12)
Registered job seekers	500	5,000
Active job listings	50/month	500/month
Job matches per month	100	1,000
Application completion rate	60%	80%
30-day user retention	40%	60%
Employer repeat usage	50%	70%

4. User Personas

4.1 Primary Persona — Job Seeker

Jean-Marie, 23
Rural youth job seeker, Musanze
Education:  Secondary school (S4)
Device:  Infinix SMART 5 (Android)
Internet:  MTN data, intermittent
Income:  Irregular, below 30,000 RWF/month
Apps used daily:  WhatsApp, MTN MoMo
Language:  Kinyarwanda (primary), basic English	Pain Points
•	Hears about jobs only through friends — misses opportunities
•	Intimidated by application forms and CVs
•	Does not know how to write a professional message to employers
•	Loses work time traveling to find jobs that may not exist

Goals
•	Find work close to home within a few days
•	Earn consistently to support family
•	Be taken seriously by employers despite having no CV
•	Know the job details (pay, duration, location) upfront

4.2 Secondary Persona — Employer

Esperance, 38
Tea cooperative manager, Musanze
Organisation:  Musanze Tea Cooperative
Hiring frequency:  Seasonal — 3-4 times per year
Current method:  Word of mouth via community leaders
Tech comfort:  Uses WhatsApp for business	Pain Points
•	Spending 2–3 days finding enough workers for harvest season
•	Workers show up without the right skills or availability
•	No system to recall previously good workers

Goals
•	Post a job in under 5 minutes and receive applications same day
•	See applicant skills and location before responding
•	Build a reliable pool of returning workers

5. Design System

The design system is built on three principles drawn directly from user research: familiarity (mirrors apps users already trust), accessibility (works on low-end devices and low-literacy users), and speed (minimum taps to complete any action).
5.1 Colour Palette
Token	Hex Value	Usage
Forest Dark	#0F4D2E	Header backgrounds, cover elements, deep contrast
Forest Green (Primary)	#1A7A4A	Primary actions, icons, links, active states
Green Light	#25A862	Buttons, CTAs, apply action, success states
Green Background	#F0FAF4	Card backgrounds, AI notes, info sections
AI Amber	#F59E0B	Match score badges, AI feature highlights
Skip Red	#EF4444	Skip/reject actions, error states
Text Dark	#1F2937	Primary body text, headings
Text Muted	#9CA3AF	Secondary labels, metadata, captions
Surface White	#FFFFFF	Card backgrounds, screen backgrounds
Border	#E5E7EB	Dividers, card borders, input borders

	Rationale
Forest green was chosen to reflect Rwanda's landscape identity and signal growth and opportunity. The amber accent exclusively marks AI-generated features, creating a clear, learnable visual language. Red is used only for skip/reject — users should never see red as an error on their first interaction.

5.2 Typography
Role	Typeface	Weight	Size	Usage
Display / Brand	Space Grotesk	700	24–36pt	App name, section titles, job titles
Body / UI	DM Sans	400–600	12–16pt	All body text, labels, metadata
Numeric	Space Grotesk	700	18–24pt	Pay rates, match scores, statistics

Both typefaces are available via Google Fonts and support Latin characters fully. DM Sans was selected for its high legibility at small sizes on low-resolution Android screens — a critical requirement for the Infinix SMART 5 and similar budget devices.

5.3 Spacing & Layout
Token	Value	Usage
xs	4px	Icon gaps, tight label spacing
sm	8px	Chip gaps, internal card padding
md	12px	Between UI elements
lg	16px	Section padding, card padding
xl	20px	Screen horizontal padding
xl2	24px	Between cards
xl3	32px	Section spacing

5.4 Corner Radius
Token	Value	Usage
sm	6px	Chips, small badges
md	10px	Input fields, small buttons
lg	16px	Cards, employer profile
xl	24px	Job swipe cards, modals
full	9999px	Pill badges, avatar circles

6. Information Architecture

The app has two distinct user paths that never overlap in navigation: Job Seeker and Employer. Role is chosen at registration and determines the entire app experience.
6.1 Job Seeker Navigation (Bottom Tab Bar)
Tab	Icon	Screen	Purpose
Jobs	Briefcase	Swipe Feed	Browse and swipe through matched job cards
Applied	Clipboard	Applications List	Track status of all submitted applications
Messages	Chat bubble	Inbox	Receive updates and messages from employers
Profile	Person	My Profile	View and edit profile, skills, availability

6.2 Employer Navigation
Section	Access	Purpose
Dashboard	Home screen	Stats overview: applicants, active jobs, rating
Post Job	Top-right button (always visible)	Create new job listing in under 5 minutes
My Listings	Dashboard scroll	View, edit, close active and past job posts
Applicants	Within each listing	Review applicants, accept, message, or decline
Profile	Settings icon	Manage employer profile and verification status

6.3 Complete Screen Inventory
The following 41 screens comprise the full MVP + Phase 2 scope:

Authentication (S-01 to S-07)
Screen ID	Screen Name	Phase
S-01	Splash Screen	MVP
S-02	Onboarding Carousel (3 slides)	MVP
S-03	Role Selection (Seeker / Employer)	MVP
S-04	Phone Number Entry	MVP
S-05	OTP Verification	MVP
S-06	Job Seeker Profile Setup	MVP
S-07	Employer Profile Setup	MVP

Job Seeker — Discovery (S-08 to S-14)
Screen ID	Screen Name	Phase
S-08	Swipe Feed (Job Cards Stack)	MVP
S-09	Job Detail Expanded View	MVP
S-10	AI Application Review Screen	MVP
S-11	Application Sent Confirmation	MVP
S-12	Filter / Search Jobs	MVP
S-13	Saved Jobs List	MVP
S-14	No Jobs Nearby Empty State	MVP

Job Seeker — Applications & Profile (S-15 to S-23)
Screen ID	Screen Name	Phase
S-15	My Applications List	MVP
S-16	Application Detail & Status	MVP
S-17	Messages Inbox	MVP
S-18	Message Thread	MVP
S-19	My Profile View	MVP
S-20	Edit Profile	MVP
S-21	Skills Management	MVP
S-22	Rate Employer (Post-Job)	MVP
S-23	Notifications Centre	MVP

Employer Flow (S-24 to S-33)
Screen ID	Screen Name	Phase
S-24	Employer Dashboard	MVP
S-25	Post New Job — Step 1 (Details)	MVP
S-26	Post New Job — Step 2 (Pay & Duration)	MVP
S-27	Post New Job — Step 3 (Preview & Publish)	MVP
S-28	My Job Listings	MVP
S-29	Job Listing Detail	MVP
S-30	Applicants List (per job)	MVP
S-31	Applicant Profile View	MVP
S-32	Message Applicant	MVP
S-33	Close / Edit Job Post	MVP

Shared & Admin (S-34 to S-41)
Screen ID	Screen Name	Phase
S-34	Rate & Review Screen	MVP
S-35	Report / Flag Screen	MVP
S-36	Offline Cached Jobs View	MVP
S-37	Admin Dashboard	MVP
S-38	Admin User Management	MVP
S-39	Admin Job Moderation	MVP
S-40	Admin Dispute Resolution	MVP
S-41	Admin Analytics Overview	MVP

7. Key Screens & UX Flows

7.1 Onboarding Flow (S-02 to S-07)
Onboarding is the most critical part of the product. Every subsequent AI recommendation and application depends on the quality of the profile built here. The design principle is: collect everything once, use it forever.

Step	What We Collect	Why We Collect It
1. Slide carousel	Value proposition introduction	Set expectations before asking for data
2. Role selection	Job Seeker or Employer	Determines entire app experience
3. Phone + OTP	Phone number (primary identity)	No email or password required — Rwanda-appropriate
4. Name + Location	Full name, sector/cell	Enables proximity matching
5. Skills	Select from emoji-illustrated list	Core input for AI matching and application writing
6. Availability	Days per week, start date	Helps AI score job fit
7. Language preference	English (default) or Kinyarwanda	AI writes applications in correct language

	UX Principle
No CV. No document uploads. No typing long paragraphs. Every input is a tap, a selection, or a short text field. Total onboarding time target: under 3 minutes.

7.2 The Swipe Feed (S-08) — Core Innovation Screen
This is the heart of Akazi Connect. Job cards are presented one at a time in a stacked card format. The AI pre-ranks cards by match score before they appear, so the best matches are always shown first.

Each job card displays:
•	Job title and employer name with verification badge
•	Job type badge (Casual / Short-term / Full-time / Apprenticeship)
•	AI match score badge (e.g. ⚡ 94% Match) — shown only when score is above 75%
•	Distance from user's location
•	Duration and number of workers needed
•	Pay rate in RWF (daily or weekly)
•	AI note — one sentence explaining why this job matches the user's profile

Interaction model:
Gesture / Action	Result
Swipe right OR tap green button	Proceed to AI Application Review screen (S-10)
Swipe left OR tap red button	Skip card; AI learns preference; next card appears
Tap card body	Expand to full Job Detail view (S-09)
Tap info button	See employer profile inline
Tap save icon	Save job for later (S-13)

7.3 AI Application Flow (S-10 to S-11)
When a user swipes right, they are taken to the AI Application Review screen. This screen has one job: show the user what the AI has written and let them send it with one tap.

The AI system prompt uses the user's onboarding profile (name, location, skills, availability, language preference) combined with the job details (title, employer, requirements) to generate a short, polite, relevant application message.

Element	Description
Match Score Card	Visual display of AI confidence score with brief explanation
Job Summary	Compact card showing job title, employer, and pay
AI-Written Message	Editable text box with the generated application
Used Profile Tags	Chips showing which profile elements were used (e.g. 'Your farming skill')
Language indicator	Shows whether message is in English or Kinyarwanda
Send Button	Primary CTA — sends application and notifies employer immediately

	Privacy Note
The AI application is generated client-side using the Claude API. The message is shown to the user before sending. No application is ever sent without the user tapping Send. The employer receives the message as a plain text message — no AI badge or label is shown.

7.4 Employer Dashboard (S-24)
The employer experience is deliberately traditional. Employers are typically less tech-native than the job seekers in this context, and they value speed and clarity over novelty.

Dashboard displays at a glance:
•	Total applicants across all active jobs
•	Number of active job listings
•	Employer rating (from post-job reviews)
•	Quick access to Post Job button (always visible top-right)

Per-listing applicant view shows:
•	Applicant name, location, and primary skill
•	AI match score for that job (visible to employer as a trust signal)
•	Three action buttons: Accept, Message, Decline

	Design Decision
AI match scores ARE shown to employers in the applicant list, even though the AI badge is not shown on the application message itself. This gives employers a useful signal without revealing the automation to them in a way that reduces trust in the applicant.

8. AI Feature Specification

The AI layer is built on the Claude API (claude-sonnet model). It serves two functions: job matching/ranking and application writing.
8.1 Job Matching & Ranking
Input	Weight	Notes
Skills match (seeker skills vs. job requirements)	40%	Primary signal
Location proximity	30%	Calculated from sector/cell data
Availability match	20%	Duration and start date overlap
Job type preference	10%	Learned from swipe history (Phase 2)

Match scores above 75% display the ⚡ badge. Scores are calculated server-side on job load, not during the swipe, ensuring no latency in the swipe animation.

8.2 Application Writing
The AI writes in the following format:

	English Template
Hello, my name is [Name] from [Location]. I have [X] years of experience in [Skill] and I am available [Availability]. I am interested in the [Job Title] position at [Employer]. I am a reliable and hardworking person and would love the opportunity to work with you.

	Kinyarwanda Template
Muraho, nditwa [Izina] ntuye i [Ahantu]. Mfite uburambe mu [Ubumenyi] kandi nshobora gutangira [Igihe]. Nifuza akazi ka [Umwanya] kuri [Usaba]. Ndi umuntu wiringirwa kandi nkora cyane, ndakwinginze mumpe amahirwe yo gukorana namwe.

Both templates are personalised with the user's actual data at generation time. The message is intentionally short (3–4 sentences) because research shows rural employers prefer direct, clear communication over long formal letters.

8.3 Phase 2 AI Enhancements
•	Learn from swipe history to improve job ranking over time
•	Suggest profile improvements based on which jobs the user keeps skipping
•	Flag potential scam job listings before they appear in the feed
•	Recommend skill additions based on local job market demand

9. Technical Architecture

9.1 Technology Stack
Layer	Technology	Rationale
Mobile Frontend	Flutter (Dart)	Single codebase for Android + iOS; excellent low-end Android performance
State Management	Riverpod	Reactive, testable, scales cleanly with feature-based architecture
Local Storage	Hive CE	Fast offline caching for job cards; works without internet
Backend API	Node.js + Express	REST API; well-documented, fast to build
Database	PostgreSQL	Relational data fits jobs/users/applications model well
Authentication	Africa's Talking SMS API	Rwanda-specific; more reliable than Twilio for rural SMS OTP
AI Layer	Claude API (Anthropic)	Application writing and job matching scoring
Push Notifications	Firebase Cloud Messaging	Free tier sufficient for MVP
Hosting	Railway or Render	Simple deployment; no AWS complexity for solo developer
Navigation	go_router	Declarative routing with deep link support

9.2 Offline-First Architecture
Given that 65.6% of Rwanda lacks reliable internet access, offline functionality is not a nice-to-have — it is a core requirement.

•	Job cards are cached locally via Hive when the user has connectivity
•	Users can browse and swipe cached jobs with no internet connection
•	Applications are queued locally and sent when connectivity returns
•	Profile data is stored securely in flutter_secure_storage
•	Connectivity status is monitored via connectivity_plus with graceful UI feedback

9.3 Feature-Based Folder Structure
Folder	Contents
lib/core/constants/	app_colors, app_text_styles, app_spacing, app_radius — all design tokens
lib/core/router/	app_router, route_names — all 41 routes defined here
lib/core/network/	dio_client, api_endpoints, network_exception
lib/features/auth/	S-01 to S-07: OTP login, role selection, onboarding
lib/features/jobs/	S-08 to S-14: swipe feed, AI application, job detail
lib/features/profile/	S-19 to S-23: profile view, skills, notifications
lib/features/employer/	S-24 to S-33: dashboard, post job, applicants
lib/features/admin/	S-37 to S-41: moderation, analytics, disputes
lib/shared/widgets/	AcButton, AcJobCard, AcTextField — all prefixed 'Ac'

10. Non-Functional Requirements

Category	Requirement	Target
App Size	Must run on budget Android devices	Under 30MB installed
Load Time	First meaningful paint on 3G	Under 3 seconds
Offline	Core job browsing without internet	100% of cached content accessible
Accessibility	Low-literacy users must complete core flow	Icon-first navigation; no wall-of-text screens
Language	English default with Kinyarwanda support	AI switches on user preference set in onboarding
Security	User data protection	OTP auth, encrypted local storage, RBAC on API
Compatibility	Android-first, iOS secondary	Android 8.0+; iOS 13+
Performance	Swipe animation smoothness	60fps card swipe on low-end devices

11. MVP Scope vs. Phase 2 Vision

Feature	MVP (Phase 1)	Phase 2
User registration + OTP	Included	—
Swipe-to-apply job feed	Included	—
AI application writing	Included	—
Kinyarwanda language support	Included	—
Employer post-and-review	Included	—
SMS notifications	Included	—
Offline job caching	Included	—
Admin moderation panel	Included	—
AI learns from swipe history	Not included	Phase 2
AI scam detection	Not included	Phase 2
Employer analytics dashboard	Not included	Phase 2
USSD support (feature phones)	Not included	Phase 2
Skill certification badges	Not included	Phase 2
TVET institution integration	Not included	Phase 2
In-app payments	Not included	Phase 2
CV builder	Not included	Phase 2

12. Risks & Mitigation

Risk	Likelihood	Impact	Mitigation Strategy
Low digital literacy slows adoption	High	High	Emoji-illustrated skills, icon navigation, 3-minute onboarding target
Intermittent internet breaks experience	High	High	Offline-first architecture; job cards cached on each session
Fake or scam job listings	Medium	High	Employer verification badges; user reporting; admin moderation
AI-written messages feel generic	Medium	Medium	Messages editable before sending; profile completeness improves output
Low employer adoption	Medium	High	Zero-friction posting (5 minutes); WhatsApp sharing of job link
App too large for budget devices	Low	High	Flutter + deferred loading; target under 30MB
Claude API latency on slow connections	Medium	Medium	Generate application in background while user reads match score

13. Development Timeline (23 Days)

Phase	Days	Deliverables
Phase A: Stabilise	Days 1–7	All 41 routes in router; app compiles; design tokens applied; no crashes
Phase B: Core Flows	Days 8–14	Auth end-to-end; swipe feed with real data; AI application working; employer post-job working
Phase C: Polish	Days 15–21	Offline caching; push notifications; empty states; loading states; test on real Android device
Phase D: Capstone Prep	Days 22–23	Screenshots; demo script; thesis writeup; slide deck preparation

	Priority Order
If time runs short, prioritise in this order: (1) Swipe feed + AI application — this is the core innovation. (2) Employer post-and-review — needed for there to be any jobs to swipe. (3) Auth + onboarding — needed for a working demo. Everything else is secondary.

14. Definition of Success

Akazi Connect succeeds when:

•	A rural youth in Rwanda can go from opening the app to submitting a personalised job application in under 60 seconds
•	A local employer can post a job listing in under 5 minutes and receive qualified applicants the same day
•	Users return to the app after 30 days because it found them real work
•	The platform becomes a trusted community employment tool — not just another unused app

	Capstone Statement
This product is not designed to look impressive to investors. It is designed to work for a 23-year-old in Musanze who has never written a job application and does not know where to start. If it works for them, it succeeds.


Akazi Connect — Product Design Document v2.0
Nyenyeri Patience · African Leadership University · March 2026
