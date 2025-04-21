
import { useState, useEffect } from "react";
import { mockMeetings } from "@/data/mockMeetings";
import { Meeting } from "@/types/meeting";
import AppLayout from "@/components/layout/AppLayout";
import MeetingList from "@/components/meetings/MeetingList";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const MeetingsPage = () => {
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Filter meetings based on search query and status
    const filtered = mockMeetings.filter((meeting) => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    
    setFilteredMeetings(filtered);
  }, [searchQuery, statusFilter]);

  // Group meetings by status
  const upcomingMeetings = filteredMeetings.filter(
    (meeting) => meeting.status === "scheduled"
  );
  
  const completedMeetings = filteredMeetings.filter(
    (meeting) => meeting.status === "completed"
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Meetings</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="inProgress">In Progress</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {filteredMeetings.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold">No meetings found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <MeetingList meetings={upcomingMeetings} title="Upcoming Meetings" />
            <MeetingList meetings={completedMeetings} title="Completed Meetings" />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default MeetingsPage;
