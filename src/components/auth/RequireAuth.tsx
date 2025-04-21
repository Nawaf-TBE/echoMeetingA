
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks the user authentication status. If not logged in, redirects to the /auth login page.
 * Wrap any page with this component to require authentication.
 */
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    // Listen to auth changes so the UI reacts dynamically
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      setAuthChecked(true);
      if (!session?.user && mounted) {
        navigate("/auth");
      }
    });
    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setIsLoggedIn(!!data.session?.user);
        setAuthChecked(true);
        if (!data.session?.user) {
          navigate("/auth");
        }
      }
    });
    return () => {
      mounted = false;
      // Fix: Use the subscription property to unsubscribe
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Optionally: add loading spinner here
  if (!authChecked) return null;

  return <>{children}</>;
};

export default RequireAuth;
