
import { Meeting, MeetingStatus } from "@/types/meeting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

interface MeetingListProps {
  meetings: Meeting[];
  title: string;
}

const MeetingList = ({ meetings, title }: MeetingListProps) => {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Scheduled</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case "inProgress":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">In Progress</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const handleMeetingClick = (id: string) => {
    navigate(`/meeting/${id}`);
  };

  if (meetings.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetings.map((meeting) => (
          <Card 
            key={meeting.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleMeetingClick(meeting.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">{meeting.title}</CardTitle>
                {getStatusBadge(meeting.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                <p>
                  {format(parseISO(meeting.startTime), 'MMM d, yyyy')} • {format(parseISO(meeting.startTime), 'h:mm a')} - {format(parseISO(meeting.endTime), 'h:mm a')}
                </p>
                <div className="mt-2">
                  {meeting.transcript ? (
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Transcribed</Badge>
                      {meeting.transcript.summary && (
                        <Badge variant="secondary" className="text-xs">Summarized</Badge>
                      )}
                      {meeting.emailLogs.length > 0 && (
                        <Badge variant="secondary" className="text-xs">Follow-up Sent</Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No transcript available</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MeetingList;
