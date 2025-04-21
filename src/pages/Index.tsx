
import { useState, useEffect } from "react";
import { mockMeetings } from "@/data/mockMeetings";
import { Meeting } from "@/types/meeting";
import AppLayout from "@/components/layout/AppLayout";
import MeetingList from "@/components/meetings/MeetingList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Check } from "lucide-react";

const Dashboard = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    transcribedMeetings: 0,
    completedActions: 0,
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const now = new Date();
    
    const upcoming = mockMeetings
      .filter((meeting) => new Date(meeting.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 6);
    
    const recent = mockMeetings
      .filter((meeting) => meeting.status === "completed")
      .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
      .slice(0, 6);
    
    setUpcomingMeetings(upcoming);
    setRecentMeetings(recent);
    
    // Calculate stats
    const transcribed = mockMeetings.filter(m => m.transcript).length;
    
    let actionItems = 0;
    let completedActions = 0;
    mockMeetings.forEach(meeting => {
      if (meeting.transcript?.summary) {
        actionItems += meeting.transcript.summary.actionItems.length;
        completedActions += meeting.transcript.summary.actionItems.filter(item => item.completed).length;
      }
    });
    
    setStats({
      totalMeetings: mockMeetings.length,
      transcribedMeetings: transcribed,
      completedActions: completedActions,
    });
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transcribed Meetings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.transcribedMeetings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Actions</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedActions}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Upcoming meetings */}
        <MeetingList meetings={upcomingMeetings} title="Upcoming Meetings" />
        
        {/* Recent meetings */}
        <MeetingList meetings={recentMeetings} title="Recent Meetings" />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
