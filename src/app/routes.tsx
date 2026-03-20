import { createBrowserRouter } from "react-router";
import SplashScreen from "./screens/SplashScreen";
import RoleSelection from "./screens/RoleSelection";
import SwipeFeed from "./screens/SwipeFeed";
import AIApplicationReview from "./screens/AIApplicationReview";
import EmployerDashboard from "./screens/EmployerDashboard";
import AppliedJobs from "./screens/AppliedJobs";
import Messages from "./screens/Messages";
import Profile from "./screens/Profile";
import PhoneEntry from "./screens/PhoneEntry";
import OTPVerification from "./screens/OTPVerification";
import SeekerProfileSetup from "./screens/SeekerProfileSetup";
import EmployerProfileSetup from "./screens/EmployerProfileSetup";
import JobDetail from "./screens/JobDetail";
import ApplicationSent from "./screens/ApplicationSent";
import PostJob from "./screens/PostJob";
import OnboardingCarousel from "./screens/OnboardingCarousel";
import MyListings from "./screens/MyListings";
import EmployerProfile from "./screens/EmployerProfile";
import EmployerMessages from "./screens/EmployerMessages";
import MessageThread from "./screens/MessageThread";
import EmployerMessageThread from "./screens/EmployerMessageThread";
import Privacy from "./screens/Privacy";
import Help from "./screens/Help";
import Contact from "./screens/Contact";
import SignOut from "./screens/SignOut";
import FilterSearch from "./screens/FilterSearch";
import ApplicantsList from "./screens/ApplicantsList";
import ApplicantProfile from "./screens/ApplicantProfile";
import SavedJobs from "./screens/SavedJobs";
import { AppColors } from "./constants/colors";

function ErrorBoundary() {
  return (
    <div className="min-h-full flex items-center justify-center relative" style={{ backgroundColor: AppColors.surfaceLight }}>
      {/* Floating back button — top left */}
      <button
        onClick={() => window.location.href = '/'}
        className="absolute top-4 left-4 p-2 rounded-xl"
        style={{ backgroundColor: AppColors.forestDark }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
        </svg>
      </button>

      <div className="text-center">
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: AppColors.textDark }}>
          Oops! Something went wrong
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: AppColors.textMuted, marginBottom: '16px' }}>
          Please try refreshing the page
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: AppColors.forestGreen,
            color: AppColors.surfaceWhite,
            padding: '12px 24px',
            borderRadius: '14px',
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/onboarding",
    Component: OnboardingCarousel,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/role-selection",
    Component: RoleSelection,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/swipe-feed",
    Component: SwipeFeed,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/applied",
    Component: AppliedJobs,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/messages",
    Component: Messages,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/job-detail",
    Component: JobDetail,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/ai-application-review/:jobId",
    Component: AIApplicationReview,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/application-sent",
    Component: ApplicationSent,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/phone-entry",
    Component: PhoneEntry,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/otp-verification",
    Component: OTPVerification,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/seeker-profile-setup",
    Component: SeekerProfileSetup,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/employer-profile-setup",
    Component: EmployerProfileSetup,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/post-job",
    Component: PostJob,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/employer-dashboard",
    Component: EmployerDashboard,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/my-listings",
    Component: MyListings,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/employer-profile",
    Component: EmployerProfile,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/employer-messages",
    Component: EmployerMessages,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/message-thread",
    Component: MessageThread,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/employer-message-thread",
    Component: EmployerMessageThread,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/profile",
    Component: Profile,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/privacy",
    Component: Privacy,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/help",
    Component: Help,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/contact",
    Component: Contact,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/applicants-list",
    Component: ApplicantsList,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/applicant-profile",
    Component: ApplicantProfile,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/saved-jobs",
    Component: SavedJobs,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/filter-search",
    Component: FilterSearch,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/sign-out",
    Component: SignOut,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    Component: SplashScreen,
    errorElement: <ErrorBoundary />,
  },
]);