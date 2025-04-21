
import RequireAuth from "@/components/auth/RequireAuth";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarSettingsSection from "@/features/settings/CalendarSettingsSection";
import EmailSettingsSection from "@/features/settings/EmailSettingsSection";
import AISettingsSection from "@/features/settings/AISettingsSection";
import { Settings, Calendar, Mail, Sparkles, UserCircle } from "lucide-react";
import AccountSettingsSection from "@/features/settings/AccountSettingsSection";

const SettingsPage = () => (
  <RequireAuth>
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>AI & Transcription</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-1">
              <UserCircle className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="space-y-4 py-4">
            <CalendarSettingsSection />
          </TabsContent>
          <TabsContent value="email" className="space-y-4 py-4">
            <EmailSettingsSection />
          </TabsContent>
          <TabsContent value="ai" className="space-y-4 py-4">
            <AISettingsSection />
          </TabsContent>
          <TabsContent value="account" className="space-y-4 py-4">
            <AccountSettingsSection />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  </RequireAuth>
);

export default SettingsPage;
