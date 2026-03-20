# Akazi Connect

A mobile-first job marketplace designed for rural Rwandan youth aged 18–30.

## Features

- **Tinder-Style Swipe Interface**: Browse jobs with a familiar swipe mechanic
- **AI-Powered Matching**: Get personalized job recommendations with match scores
- **AI Application Writing**: Auto-generated job applications based on your profile
- **Dual User Modes**: Separate experiences for Job Seekers and Employers
- **Clean, Accessible Design**: Built for low-end Android devices with offline support

## Design System

### Colors
- **Forest Green Theme**: #1A7A4A (Primary), #0F4D2E (Dark), #25A862 (Light)
- **AI Features**: #F59E0B (Amber accent)
- **Actions**: #EF4444 (Skip/Reject)

### Typography
- **Display/Headings**: Space Grotesk (Bold, 700)
- **Body/UI**: DM Sans (400-600)

### Key Screens
1. **Splash Screen** - App introduction with logo
2. **Role Selection** - Choose between Job Seeker or Employer
3. **Swipe Feed** - Main job browsing interface (Job Seeker)
4. **AI Application Review** - Review and send AI-generated applications
5. **Employer Dashboard** - Manage job listings and applicants

## Navigation Flow

```
Splash Screen → Role Selection → [Job Seeker OR Employer Flow]

Job Seeker Flow:
Swipe Feed → AI Application Review → Back to Feed

Employer Flow:
Dashboard → (Post Jobs, View Applicants)
```

## Tech Stack

- React 18
- React Router 7
- Tailwind CSS 4
- Motion (Framer Motion)
- Lucide Icons
- TypeScript
