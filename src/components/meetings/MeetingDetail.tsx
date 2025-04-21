
import { Meeting, ActionItem } from "@/types/meeting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { Mail, MessageSquare, FileText, CheckSquare, XSquare } from "lucide-react";
import { toast } from "sonner";

interface MeetingDetailProps {
  meeting: Meeting;
}

const MeetingDetail = ({ meeting }: MeetingDetailProps) => {
  const hasTranscript = !!meeting.transcript;
  const hasSummary = hasTranscript && !!meeting.transcript?.summary;
  const hasEmailBeenSent = meeting.emailLogs.length > 0;
  
  const handleSendFollowUp = () => {
    toast.success("Follow-up email sent successfully!");
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMMM d, yyyy h:mm a');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{meeting.title}</h1>
          <p className="text-muted-foreground">
            {formatDate(meeting.startTime)} - {format(parseISO(meeting.endTime), 'h:mm a')}
          </p>
        </div>
        {meeting.status === "completed" && hasSummary && (
          <Button 
            onClick={handleSendFollowUp}
            variant={hasEmailBeenSent ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            <Mail size={16} />
            {hasEmailBeenSent ? "Resend Follow-Up" : "Send Follow-Up"}
          </Button>
        )}
      </div>

      {hasTranscript ? (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4">
            {hasSummary && <TabsTrigger value="summary">Summary</TabsTrigger>}
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            {hasSummary && <TabsTrigger value="actions">Action Items</TabsTrigger>}
            {hasEmailBeenSent && <TabsTrigger value="emails">Email Logs</TabsTrigger>}
          </TabsList>

          {hasSummary && (
            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meeting Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{meeting.transcript?.summary?.summaryText}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1">
                    {meeting.transcript?.summary?.decisions.map((decision, index) => (
                      <li key={index}>{decision}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="transcript">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Raw Transcript</CardTitle>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  Transcript
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line bg-secondary p-4 rounded-md overflow-auto max-h-[500px]">
                  {meeting.transcript?.text}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {hasSummary && (
            <TabsContent value="actions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Action Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {meeting.transcript?.summary?.actionItems.map((item) => (
                      <ActionItemCard key={item.id} actionItem={item} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {hasEmailBeenSent && (
            <TabsContent value="emails">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Email History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {meeting.emailLogs.map((log) => (
                      <div key={log.id} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Sent at {formatDate(log.sentAt)}</span>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Mail size={14} />
                            Email Sent
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Recipients: {log.recipients.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <FileText size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-1">No transcript available</h3>
          <p className="text-muted-foreground max-w-md">
            {meeting.status === "scheduled" 
              ? "This meeting hasn't occurred yet. A transcript will be generated after the meeting."
              : "No transcript was generated for this meeting."}
          </p>
        </div>
      )}
    </div>
  );
};

const ActionItemCard = ({ actionItem }: { actionItem: ActionItem }) => {
  return (
    <div className="p-3 border rounded-md flex items-start gap-3">
      {actionItem.completed ? (
        <CheckSquare className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
      ) : (
        <XSquare className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
      )}
      <div className="flex-1">
        <p className="font-medium">{actionItem.description}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
          <span className="text-muted-foreground">Assigned to: {actionItem.assignee}</span>
          {actionItem.dueDate && (
            <span className="text-muted-foreground">Due: {format(parseISO(actionItem.dueDate), 'MMM d, yyyy')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingDetail;
