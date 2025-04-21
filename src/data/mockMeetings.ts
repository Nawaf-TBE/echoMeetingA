
import { Meeting, MeetingStatus } from "@/types/meeting";

export const mockMeetings: Meeting[] = [
  {
    id: "meet-1",
    title: "Product Team Weekly Sync",
    startTime: "2025-04-18T10:00:00Z",
    endTime: "2025-04-18T11:00:00Z",
    calendarId: "cal-1",
    status: "completed",
    transcript: {
      id: "trans-1",
      eventId: "meet-1",
      text: "Sarah: Welcome everyone to our weekly product sync. Let's start with updates from each team.\n\nAlex: The design team has finalized the new dashboard wireframes. We'll share them by EOD.\n\nJamie: Engineering is on track with the API refactoring. We expect to complete it by next Thursday.\n\nSarah: Great, and marketing is preparing for the May launch. We need to finalize the messaging by Friday.\n\nAlex: Are we still planning to include the analytics features in this release?\n\nJamie: Yes, but we might need to simplify some visualization aspects.\n\nSarah: Let's make that decision by Wednesday. Ok, for action items...",
      createdAt: "2025-04-18T11:05:00Z",
      summary: {
        id: "sum-1",
        transcriptId: "trans-1",
        summaryText: "The product team discussed progress on the upcoming release, including dashboard wireframes, API refactoring, and marketing preparations for the May launch. The team decided to include analytics features but may simplify visualizations.",
        decisions: [
          "Include analytics features in the May release",
          "Simplify visualization aspects of the analytics dashboard",
          "Finalize marketing messaging by Friday"
        ],
        createdAt: "2025-04-18T11:10:00Z",
        actionItems: [
          {
            id: "act-1",
            summaryId: "sum-1",
            assignee: "alex@example.com",
            description: "Share dashboard wireframes with the team",
            dueDate: "2025-04-18T23:59:59Z",
            completed: true
          },
          {
            id: "act-2",
            summaryId: "sum-1",
            assignee: "jamie@example.com",
            description: "Complete API refactoring",
            dueDate: "2025-04-25T23:59:59Z",
            completed: false
          },
          {
            id: "act-3",
            summaryId: "sum-1",
            assignee: "sarah@example.com",
            description: "Make final decision on analytics visualization scope",
            dueDate: "2025-04-24T23:59:59Z",
            completed: false
          },
          {
            id: "act-4",
            summaryId: "sum-1",
            assignee: "marketing@example.com",
            description: "Finalize launch messaging",
            dueDate: "2025-04-19T23:59:59Z",
            completed: false
          }
        ]
      }
    },
    emailLogs: [
      {
        id: "email-1",
        summaryId: "sum-1",
        recipients: ["team@example.com"],
        sentAt: "2025-04-18T11:15:00Z"
      }
    ]
  },
  {
    id: "meet-2",
    title: "Quarterly Business Review",
    startTime: "2025-04-19T14:00:00Z",
    endTime: "2025-04-19T16:00:00Z",
    calendarId: "cal-1",
    status: "scheduled",
    transcript: null,
    emailLogs: []
  },
  {
    id: "meet-3",
    title: "Engineering Standup",
    startTime: "2025-04-19T09:00:00Z",
    endTime: "2025-04-19T09:30:00Z",
    calendarId: "cal-2",
    status: "scheduled",
    transcript: null,
    emailLogs: []
  },
  {
    id: "meet-4",
    title: "Customer Interview - Acme Corp",
    startTime: "2025-04-17T13:00:00Z",
    endTime: "2025-04-17T14:00:00Z",
    calendarId: "cal-1",
    status: "completed",
    transcript: {
      id: "trans-2",
      eventId: "meet-4",
      text: "Michael: Thanks for joining us today. We're excited to hear about your experience with our product.\n\nClient: Happy to be here. We've been using your platform for about 3 months now.\n\nMichael: Great. What aspects have been most useful for your team?\n\nClient: The reporting features are excellent. We've been able to generate insights we couldn't before. However, we're struggling with the user management section.\n\nMichael: Could you elaborate on the issues you're facing?\n\nClient: Adding new team members is cumbersome, and permission settings are confusing.\n\nMichael: That's valuable feedback. We're actually working on improvements to that area now...",
      createdAt: "2025-04-17T14:05:00Z",
      summary: {
        id: "sum-2",
        transcriptId: "trans-2",
        summaryText: "The customer interview with Acme Corp revealed they've been using the platform for 3 months. They praised the reporting features but expressed frustration with user management, specifically around adding team members and permission settings.",
        decisions: [
          "Prioritize user management improvements in the next sprint",
          "Schedule a follow-up demo of the new features when ready"
        ],
        createdAt: "2025-04-17T14:10:00Z",
        actionItems: [
          {
            id: "act-5",
            summaryId: "sum-2",
            assignee: "product@example.com",
            description: "Review user management UX issues and prioritize fixes",
            dueDate: "2025-04-22T23:59:59Z",
            completed: false
          },
          {
            id: "act-6",
            summaryId: "sum-2",
            assignee: "michael@example.com",
            description: "Schedule follow-up demo with Acme Corp",
            dueDate: "2025-05-01T23:59:59Z",
            completed: false
          }
        ]
      }
    },
    emailLogs: [
      {
        id: "email-2",
        summaryId: "sum-2",
        recipients: ["client@acmecorp.com", "internal@example.com"],
        sentAt: "2025-04-17T14:30:00Z"
      }
    ]
  },
  {
    id: "meet-5",
    title: "Marketing Campaign Planning",
    startTime: "2025-04-22T11:00:00Z",
    endTime: "2025-04-22T12:30:00Z",
    calendarId: "cal-3",
    status: "scheduled",
    transcript: null,
    emailLogs: []
  },
  {
    id: "meet-6",
    title: "1:1 with Direct Report",
    startTime: "2025-04-19T15:30:00Z",
    endTime: "2025-04-19T16:00:00Z",
    calendarId: "cal-2",
    status: "scheduled",
    transcript: null,
    emailLogs: []
  },
  {
    id: "meet-7",
    title: "All-Hands Meeting",
    startTime: "2025-04-15T16:00:00Z",
    endTime: "2025-04-15T17:00:00Z",
    calendarId: "cal-1",
    status: "completed",
    transcript: {
      id: "trans-3",
      eventId: "meet-7",
      text: "CEO: Welcome everyone to our monthly all-hands. Today we'll cover Q1 results, department updates, and our roadmap for Q2.\n\nCFO: Starting with financials, we exceeded our Q1 revenue targets by 12%. New customer acquisition was up 18% compared to the previous quarter.\n\nCTO: From the tech side, we completed the migration to the new infrastructure, which should improve performance by approximately 35%.\n\nVP Sales: The sales team closed three major enterprise deals this quarter, including the Smith Industries contract we've been working on for months...",
      createdAt: "2025-04-15T17:05:00Z",
      summary: {
        id: "sum-3",
        transcriptId: "trans-3",
        summaryText: "The monthly all-hands covered Q1 results, with the company exceeding revenue targets by 12% and increasing customer acquisition by 18%. The tech team completed a major infrastructure migration, and sales closed three major enterprise deals.",
        decisions: [
          "Proceed with the Q2 roadmap as presented",
          "Increase hiring targets for the engineering team",
          "Launch the new marketing campaign in May"
        ],
        createdAt: "2025-04-15T17:15:00Z",
        actionItems: [
          {
            id: "act-7",
            summaryId: "sum-3",
            assignee: "hr@example.com",
            description: "Update hiring plan for engineering team",
            dueDate: "2025-04-22T23:59:59Z",
            completed: true
          },
          {
            id: "act-8",
            summaryId: "sum-3",
            assignee: "product@example.com",
            description: "Circulate detailed Q2 roadmap document",
            dueDate: "2025-04-19T23:59:59Z",
            completed: true
          }
        ]
      }
    },
    emailLogs: [
      {
        id: "email-3",
        summaryId: "sum-3",
        recipients: ["all-staff@example.com"],
        sentAt: "2025-04-15T17:30:00Z"
      }
    ]
  }
];
