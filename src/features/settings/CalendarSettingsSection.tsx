
// Import dependencies, including new cards.
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CalendarIntegrationCard from "./CalendarIntegrationCard";
import CalendarPreferencesCard from "./CalendarPreferencesCard";

const getCurrentUserId = async () => {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
};

const CalendarSettingsSection = () => {
  const [calendarSettings, setCalendarSettings] = useState({
    googleConnected: false,
    outlookConnected: false,
    recordMeetings: true,
    reminderMinutes: "15",
  });

  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userId = await getCurrentUserId();
      setIsUserLoggedIn(!!userId);
    };
    checkLoginStatus();
  }, []);

  return (
    <>
      {isUserLoggedIn === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to connect and manage calendar integrations.
          </AlertDescription>
        </Alert>
      )}
      <CalendarIntegrationCard
        googleConnected={calendarSettings.googleConnected}
        outlookConnected={calendarSettings.outlookConnected}
        onSetGoogleConnected={val => setCalendarSettings(prev => ({ ...prev, googleConnected: val }))}
        onSetOutlookConnected={val => setCalendarSettings(prev => ({ ...prev, outlookConnected: val }))}
        isUserLoggedIn={isUserLoggedIn}
      />
      <CalendarPreferencesCard
        preferences={{
          recordMeetings: calendarSettings.recordMeetings,
          reminderMinutes: calendarSettings.reminderMinutes
        }}
        setPreferences={prefs => setCalendarSettings(prev => ({ ...prev, ...prefs }))}
        isUserLoggedIn={isUserLoggedIn}
      />
    </>
  );
};

export default CalendarSettingsSection;
