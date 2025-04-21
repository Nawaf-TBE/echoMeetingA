
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

type CalendarPreferences = {
  recordMeetings: boolean;
  reminderMinutes: string;
};

type CalendarPreferencesCardProps = {
  preferences: CalendarPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<CalendarPreferences>>;
  isUserLoggedIn: boolean | null;
};

const CalendarPreferencesCard = ({
  preferences,
  setPreferences,
  isUserLoggedIn,
}: CalendarPreferencesCardProps) => {
  const handleSaveCalendarSettings = () => {
    toast.success("Calendar settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Settings</CardTitle>
        <CardDescription>
          Configure how your meetings are processed from connected calendars.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="record-meetings">Automatically Record Meetings</Label>
            <p className="text-sm text-muted-foreground">
              Attempt to join and record meetings for transcription
            </p>
          </div>
          <Switch
            id="record-meetings"
            checked={preferences.recordMeetings}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, recordMeetings: checked }))
            }
            disabled={isUserLoggedIn === false}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reminder-minutes">Reminder Before Meeting</Label>
          <Select 
            value={preferences.reminderMinutes}
            onValueChange={(value) => 
              setPreferences(prev => ({ ...prev, reminderMinutes: value }))
            }
            disabled={isUserLoggedIn === false}
          >
            <SelectTrigger id="reminder-minutes">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Get a notification before meetings start
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveCalendarSettings}
          disabled={isUserLoggedIn === false}
        >
          Save Calendar Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalendarPreferencesCard;
