
export type MeetingStatus = 'scheduled' | 'completed' | 'inProgress' | 'cancelled';

export interface ActionItem {
  id: string;
  summaryId: string;
  assignee: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
}

export interface Summary {
  id: string;
  transcriptId: string;
  summaryText: string;
  decisions: string[];
  createdAt: string;
  actionItems: ActionItem[];
}

export interface Transcript {
  id: string;
  eventId: string;
  text: string;
  createdAt: string;
  summary: Summary | null;
}

export interface EmailLog {
  id: string;
  summaryId: string;
  recipients: string[];
  sentAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  calendarId: string;
  status: MeetingStatus;
  transcript: Transcript | null;
  emailLogs: EmailLog[];
}
