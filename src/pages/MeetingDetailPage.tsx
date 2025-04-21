
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockMeetings } from "@/data/mockMeetings";
import { Meeting } from "@/types/meeting";
import AppLayout from "@/components/layout/AppLayout";
import MeetingDetail from "@/components/meetings/MeetingDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MeetingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchMeeting = () => {
      setLoading(true);
      const found = mockMeetings.find((m) => m.id === id);
      
      if (found) {
        setMeeting(found);
      }
      
      setLoading(false);
    };

    fetchMeeting();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <AppLayout>
      <Button 
        variant="ghost" 
        onClick={handleBack} 
        className="mb-4 pl-0 flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        Back
      </Button>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-center">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-8 mx-auto"></div>
            <div className="h-24 w-full max-w-3xl bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      ) : meeting ? (
        <MeetingDetail meeting={meeting} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold">Meeting not found</h2>
          <p className="text-muted-foreground mt-2">The requested meeting doesn't exist or has been removed.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </div>
      )}
    </AppLayout>
  );
};

export default MeetingDetailPage;
