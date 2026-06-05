import React, { useEffect, useMemo, useState } from "react";
import App from "./App";
const PartnerDashboardApp = React.lazy(() => import("./features/partner-dashboard"));
const AdminDashboardApp = React.lazy(() => import("./features/admin-dashboard"));
const OrganizationsPage = React.lazy(() => import("./features/public-pages/OrganizationsPage"));
const DemoPage = React.lazy(() => import("./features/public-pages/DemoPage"));
const PrivacyPage = React.lazy(() => import("./features/public-pages/PrivacyPage"));

function usePathRouter() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to, replace = false) => {
    if (replace) {
      window.history.replaceState({}, "", to);
    } else {
      window.history.pushState({}, "", to);
    }
    setPathname(window.location.pathname);
  };

  return { pathname, navigate };
}

export default function RootApp() {
  const { pathname, navigate } = usePathRouter();

  const page = useMemo(() => {
    if (pathname.startsWith("/partner-dashboard")) {
      return (
        <React.Suspense
          fallback={
            <div className="min-h-screen bg-slate-950 px-4 py-10 text-center text-slate-300">
              Loading partner dashboard...
            </div>
          }
        >
          <PartnerDashboardApp pathname={pathname} navigate={navigate} />
        </React.Suspense>
      );
    }
    if (pathname.startsWith("/owner-admin") || pathname.startsWith("/admin-dashboard")) {
      return (
        <React.Suspense
          fallback={
            <div className="min-h-screen bg-slate-950 px-4 py-10 text-center text-slate-300">
              Loading admin dashboard...
            </div>
          }
        >
          <AdminDashboardApp pathname={pathname} navigate={navigate} />
        </React.Suspense>
      );
    }
    if (pathname.startsWith("/partner-orgs") || pathname.startsWith("/organizations")) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 px-4 py-10 text-center text-slate-300">Loading organizations page...</div>}>
          <OrganizationsPage />
        </React.Suspense>
      );
    }
    if (pathname.startsWith("/partner-demo") || pathname.startsWith("/demo")) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 px-4 py-10 text-center text-slate-300">Loading guided demo...</div>}>
          <DemoPage />
        </React.Suspense>
      );
    }
    if (pathname.startsWith("/privacy")) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 px-4 py-10 text-center text-slate-300">Loading privacy page...</div>}>
          <PrivacyPage />
        </React.Suspense>
      );
    }
    return <App />;
  }, [navigate, pathname]);

  return page;
}
