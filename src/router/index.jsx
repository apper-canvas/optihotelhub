import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/organisms/Layout';

// Lazy load all page components
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const Rooms = lazy(() => import('@/components/pages/Rooms'));
const Guests = lazy(() => import('@/components/pages/Guests'));
const Bookings = lazy(() => import('@/components/pages/Bookings'));
const Staff = lazy(() => import('@/components/pages/Staff'));
const Reports = lazy(() => import('@/components/pages/Reports'));
const Analytics = lazy(() => import('@/components/pages/Analytics'));
const Billing = lazy(() => import('@/components/pages/Billing'));
const GuestBooking = lazy(() => import('@/components/pages/GuestBooking'));
const Profile = lazy(() => import('@/components/pages/Profile'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

// Suspense fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Wrap components in Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<SuspenseFallback />}>
    <Component />
  </Suspense>
);

// Main routes configuration
const mainRoutes = [
  // Standalone guest booking routes
  {
    path: "guest-booking",
    element: withSuspense(GuestBooking)
  },
  {
    path: "guest-booking/profile", 
    element: withSuspense(Profile)
  },
  // Layout routes
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        index: true,
        element: withSuspense(Dashboard)
      },
      {
        path: "rooms",
        element: withSuspense(Rooms)
      },
      {
        path: "guests", 
        element: withSuspense(Guests)
      },
      {
        path: "bookings",
        element: withSuspense(Bookings)
      },
      {
        path: "staff",
        element: withSuspense(Staff)
      },
      {
        path: "reports",
        element: withSuspense(Reports)
      },
      {
        path: "analytics",
        element: withSuspense(Analytics)
      },
      {
        path: "billing",
        element: withSuspense(Billing)
      },
      {
        path: "profile",
        element: withSuspense(Profile)
      }
    ]
  },
  // 404 catch-all
  {
    path: "*",
    element: withSuspense(NotFound)
  }
];

// Create router
const routes = [
  {
    path: "/",
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);