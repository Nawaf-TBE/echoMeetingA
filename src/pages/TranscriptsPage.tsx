
import { useState, useEffect } from "react";
import { mockMeetings } from "@/data/mockMeetings";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TranscriptsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [transcripts, setTranscripts] = useState<Array<{
    id: string;
    meetingId: string;
    meetingTitle: string;
    date: string;
    excerpt: string;
  }>>([]);

  useEffect(() => {
    // Extract transcripts from meetings
    const extractedTranscripts = mockMeetings
      .filter(meeting => meeting.transcript)
      .map(meeting => ({
        id: meeting.transcript!.id,
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        date: meeting.startTime,
        excerpt: meeting.transcript!.text.substring(0, 150) + "...",
      }));
    
    // Filter by search query
    const filtered = extractedTranscripts.filter(transcript => 
      transcript.meetingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transcript.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setTranscripts(filtered);
  }, [searchQuery]);

  const handleTranscriptClick = (meetingId: string) => {
    navigate(`/meeting/${meetingId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Transcripts</h1>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transcripts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {transcripts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold">No transcripts found</h2>
            <p className="text-muted-foreground mt-2">
              {searchQuery ? "Try adjusting your search terms." : "There are no transcripts available yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transcripts.map((transcript) => (
              <Card 
                key={transcript.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTranscriptClick(transcript.meetingId)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-medium">{transcript.meetingTitle}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(transcript.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText size={14} />
                    Transcript
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{transcript.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TranscriptsPage;
