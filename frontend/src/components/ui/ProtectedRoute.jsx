import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();

  const isAuthenticated =
    sessionStorage.getItem("TechPath AIVerified") === "true" &&
    Boolean(sessionStorage.getItem("TechPath AIEmail"));

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}