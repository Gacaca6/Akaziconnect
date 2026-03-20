I want you to redesign the entire app UI. Here is the full brief:
App: Akazi Connect — job marketplace for rural Rwandan youth aged 18–30
Inspiration: Telegram's clean, fast, list-based UI combined with a Tinder-style swipe card mechanic for the job feed. Think WhatsApp-level simplicity meets modern African fintech apps like MoMo and Chipper Cash.
Design direction: Clean, warm, confident. Not corporate. Not generic. This should feel like it was built specifically for Rwanda — hopeful, grounded, community-oriented.
Design system to use strictly:

Primary: Forest Green #1A7A4A, Dark Green #0F4D2E, Light Green #25A862
Accent (AI features only): Amber #F59E0B
Skip/reject actions: Red #EF4444
Backgrounds: White #FFFFFF, Light #F3F4F6, Green tint #F0FAF4
Display font: Space Grotesk (bold, headings, job titles, numbers)
Body font: DM Sans (all labels, body text, metadata)
Base spacing: 4px unit system (8, 12, 16, 20, 24, 32)
Corner radius: cards 24px, buttons 14px, chips 20px, inputs 12px

Screen-by-screen requirements:
Start with these 5 screens in this exact order — do them one at a time, show me the code, wait for my approval before moving to the next:

S-01 Splash Screen — full screen deep green (#0F4D2E), centered logo (I will provide the PNG), app name "Akazi Connect" in Space Grotesk bold white, tagline "Umurimo Wawe" (Your Work) in DM Sans italic, subtle loading indicator in amber
S-03 Role Selection — two large tappable cards, one for Job Seeker (icon: walking figure) and one for Employer (icon: building/shop), deep green header with app logo, cards use white background with green accent border on selection, warm and inviting not clinical
S-08 Swipe Feed — this is the most important screen. Stacked job cards like Tinder. Each card: green gradient banner at top, job title in Space Grotesk bold, employer name with verified badge, location + duration + pay in pill badges, AI match score in amber badge, one-line AI note in green tint box at bottom of card. Below cards: three action buttons — red circle (skip ✕), grey circle (info ℹ), green circle (apply ✓). Simple bottom navigation bar with 4 tabs.
S-10 AI Application Review — match score card in green gradient, job summary card, editable AI-written message in a text box, profile tags used shown as green chips below the message, large green Send button at bottom pinned above keyboard
S-24 Employer Dashboard — dark green header with employer name, stats row (applicants / active jobs / rating) in translucent white boxes, scrollable list of job listings each showing title, location, pay, status badge (Active/Closed), and applicant count with quick accept/message/decline buttons per applicant

Rules to follow strictly:

Never hardcode any colour — always use AppColors constants
Never use default Flutter blue anywhere
Every screen must have a custom AppBar or no AppBar — never the default grey Flutter AppBar
All cards must have rounded corners and subtle shadows
Empty states must have an illustration or large emoji, a heading, and a subtext — never just a blank screen
Loading states must use shimmer effect, never a plain CircularProgressIndicator in default blue
The app should feel like a premium product, not a university project