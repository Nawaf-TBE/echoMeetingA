
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar } from "lucide-react";

// Use environment variable from Supabase edge function instead of hardcoded value
const GOOGLE_REDIRECT_URI = window.location.origin + "/settings";

const getCurrentUserId = async () => {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
};

const startGoogleOAuth = async (setConnecting: (val: boolean) => void, setError: (val: string | null) => void) => {
  setConnecting(true);
  setError(null);
  
  try {
    const user_id = await getCurrentUserId();
    if (!user_id) {
      toast.error("You must be logged in to connect Google Calendar.");
      setConnecting(false);
      return;
    }

    // Fetch the client ID from the edge function
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.functions.invoke('get-google-client-id', {
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      }
    });
    
    if (error || !data?.client_id) {
      console.error("Error fetching Google client ID:", error);
      const errorMessage = error?.message || data?.error || "Failed to retrieve Google client configuration";
      setError(errorMessage);
      toast.error(errorMessage);
      setConnecting(false);
      return;
    }
    
    const GOOGLE_CLIENT_ID = data.client_id;
    
    // Define scopes for Google Calendar
    const scope = encodeURIComponent([
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.events.readonly"
    ].join(" "));

    // Build OAuth URL parameters
    const params = [
      `client_id=${GOOGLE_CLIENT_ID}`,
      `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}`,
      "response_type=code",
      `scope=${scope}`,
      "access_type=offline",
      "prompt=consent",
      "include_granted_scopes=true",
    ].join("&");

    // Store user ID in state parameter for security
    const state = encodeURIComponent(user_id);
    
    // Redirect to Google OAuth consent screen
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}&state=${state}`;
  } catch (error) {
    console.error("Error starting OAuth:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to start Google authentication";
    setError(errorMessage);
    toast.error(errorMessage);
    setConnecting(false);
  }
};

type CalendarConnectionsProps = {
  googleConnected: boolean;
  outlookConnected: boolean;
  onSetGoogleConnected: (val: boolean) => void;
  onSetOutlookConnected: (val: boolean) => void;
  isUserLoggedIn: boolean | null;
};

const CalendarIntegrationCard = ({
  googleConnected,
  outlookConnected,
  onSetGoogleConnected,
  onSetOutlookConnected,
  isUserLoggedIn
}: CalendarConnectionsProps) => {
  const [connectingGoogle, setConnectingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for Google OAuth redirect back
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const errorParam = url.searchParams.get("error");
    
    if (errorParam) {
      setError(`Google authentication error: ${errorParam}`);
      toast.error(`Google authentication error: ${errorParam}`);
      // Clean up URL parameters
      url.searchParams.delete("error");
      window.history.replaceState({}, '', url.pathname);
      return;
    }
    
    if (code && state) {
      // Process OAuth callback
      const processOAuthCallback = async () => {
        try {
          setConnectingGoogle(true);
          const { supabase } = await import("@/integrations/supabase/client");
          
          // Get the user's session token for authorization
          const session = await supabase.auth.getSession();
          const authToken = session.data.session?.access_token;
          
          if (!authToken) {
            setError("Authentication required. Please login again.");
            toast.error("Authentication required. Please login again.");
            setConnectingGoogle(false);
            return;
          }
          
          // Call the edge function to exchange the code for tokens
          const response = await supabase.functions.invoke('google-calendar-oauth', {
            body: JSON.stringify({
              code,
              redirect_uri: GOOGLE_REDIRECT_URI,
              user_id: state,
            }),
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });
          
          setConnectingGoogle(false);
          
          if (response.error) {
            console.error("Error connecting Google Calendar:", response.error);
            const errorMessage = response.error.message || "Unknown error";
            setError(`Failed to connect Google Calendar: ${errorMessage}`);
            toast.error(`Failed to connect Google Calendar: ${errorMessage}`);
          } else {
            setError(null);
            toast.success("Google Calendar connected successfully!");
            onSetGoogleConnected(true);
          }
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          setError(`Failed to process Google Calendar connection: ${errorMessage}`);
          toast.error(`Failed to process Google Calendar connection: ${errorMessage}`);
          setConnectingGoogle(false);
        } finally {
          // Clean up URL parameters
          url.searchParams.delete("code");
          url.searchParams.delete("state");
          window.history.replaceState({}, '', url.pathname);
        }
      };
      
      processOAuthCallback();
    }
    // eslint-disable-next-line
  }, []);

  const handleConnectCalendar = (provider: string) => {
    toast.success(`Connected to ${provider} calendar!`);
    if (provider === "Outlook") {
      onSetOutlookConnected(true);
    }
  };

  const handleDisconnectCalendar = (provider: string) => {
    toast.success(`Disconnected from ${provider} calendar`);
    if (provider === "Google") {
      onSetGoogleConnected(false);
    } else if (provider === "Outlook") {
      onSetOutlookConnected(false);
    }
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Connections
        </CardTitle>
        <CardDescription>
          Connect your calendars to automatically detect and process meetings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Google Calendar</h4>
              <p className="text-sm text-muted-foreground">
                {googleConnected 
                  ? "Connected" 
                  : "Connect to sync your Google Calendar meetings"}
              </p>
            </div>
            {googleConnected ? (
              <Button 
                variant="outline" 
                onClick={() => handleDisconnectCalendar("Google")}
                disabled={isUserLoggedIn === false}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={() => startGoogleOAuth(setConnectingGoogle, setError)} 
                disabled={connectingGoogle || isUserLoggedIn === false}
              >
                {connectingGoogle ? "Connecting..." : "Connect"}
              </Button>
            )}
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Outlook Calendar</h4>
              <p className="text-sm text-muted-foreground">
                {outlookConnected 
                  ? "Connected" 
                  : "Connect to sync your Outlook Calendar meetings"}
              </p>
            </div>
            {outlookConnected ? (
              <Button 
                variant="outline" 
                onClick={() => handleDisconnectCalendar("Outlook")}
                disabled={isUserLoggedIn === false}
              >
                Disconnect
              </Button>
            ) : (
              <Button 
                onClick={() => handleConnectCalendar("Outlook")}
                disabled={isUserLoggedIn === false}
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIntegrationCard;
