import React, { useEffect, useMemo, useState } from "react";
import App from "./App";
const PartnerDashboardApp = React.lazy(() => import("./features/partner-dashboard"));

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
    return <App />;
  }, [navigate, pathname]);

  return page;
}
