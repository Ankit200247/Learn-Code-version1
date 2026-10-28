import { createBrowserRouter, Navigate } from "react-router-dom";

// Public pages
import LandingPage from "../pages/landing/LandingPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage.jsx";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";

// Dashboard pages
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import PracticePage from "../pages/practice/PracticePage.jsx";
import AiEditorPage from "../pages/ai-editor/AiEditorPage.jsx";
import AiAssistantPage from "../pages/ai-assistant/AiAssistantPage.jsx";
import ProgressPage from "../pages/progress/ProgressPage.jsx";

// Beginner Zone pages
import BeginnerZonePage from "../pages/beginner-zone/BeginnerZonePage.jsx";
import JavaModulePage from "../pages/beginner-zone/JavaModulePage.jsx";
import JavaLessonPage from "../pages/beginner-zone/JavaLessonPage.jsx";
import BeginnerZoneQuiz from "../pages/beginner-zone/BeginnerZoneQuiz.jsx";
import BeginnerZoneProgress from "../pages/beginner-zone/BeginnerZoneProgress.jsx";

// Other pages
import CampusPrepPage from "../pages/campus-prep/CampusPrepPage.jsx";
import ResourcesPage from "../pages/resources/ResourcesPage.jsx";
import PremiumPage from "../pages/premium/PremiumPage.jsx";

// Route protection
import ProtectedRoute from "../components/ui/ProtectedRoute.jsx";

const router = createBrowserRouter([
  // ========================================
  // PUBLIC ROUTES
  // ========================================
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtpPage />,
      },
    ],
  },

  // ========================================
  // PROTECTED ROUTES
  // ProtectedRoute checks authentication.
  // DashboardLayout provides the sidebar.
  // ========================================
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/practice",
            element: <PracticePage />,
          },
          {
            path: "/ai-editor",
            element: <AiEditorPage />,
          },
          {
            path: "/ai-assistant",
            element: <AiAssistantPage />,
          },
          {
            path: "/progress",
            element: <ProgressPage />,
          },
          {
            path: "/beginner-zone",
            element: <BeginnerZonePage />,
          },
          {
            path: "/beginner-zone/java",
            element: <JavaModulePage />,
          },
          {
            path: "/beginner-zone/java/lesson/:lessonId",
            element: <JavaLessonPage />,
          },
          {
            path: "/beginner-zone/quiz",
            element: <BeginnerZoneQuiz />,
          },
          {
            path: "/beginner-zone/progress",
            element: <BeginnerZoneProgress />,
          },
          {
            path: "/campus-prep",
            element: <CampusPrepPage />,
          },
          {
            path: "/resources",
            element: <ResourcesPage />,
          },
          {
            path: "/premium",
            element: <PremiumPage />,
          },
        ],
      },
    ],
  },

  // ========================================
  // UNKNOWN ROUTES
  // ========================================
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;