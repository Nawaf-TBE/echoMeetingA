
import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmailSettingsSection = () => {
  const [emailSettings, setEmailSettings] = useState({
    sendFollowUps: true,
    includeTranscript: false,
    templateId: "template-1",
  });

  const handleSaveEmailSettings = () => {
    toast.success("Email settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
        <CardDescription>
          Configure how follow-up emails are generated and sent.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="send-followups">Automatic Follow-ups</Label>
            <p className="text-sm text-muted-foreground">
              Send follow-up emails after meetings are processed
            </p>
          </div>
          <Switch
            id="send-followups"
            checked={emailSettings.sendFollowUps}
            onCheckedChange={(checked) => 
              setEmailSettings(prev => ({ ...prev, sendFollowUps: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="include-transcript">Include Transcript</Label>
            <p className="text-sm text-muted-foreground">
              Attach the full transcript to follow-up emails
            </p>
          </div>
          <Switch
            id="include-transcript"
            checked={emailSettings.includeTranscript}
            onCheckedChange={(checked) => 
              setEmailSettings(prev => ({ ...prev, includeTranscript: checked }))
            }
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email-template">Email Template</Label>
          <Select 
            value={emailSettings.templateId}
            onValueChange={(value) => 
              setEmailSettings(prev => ({ ...prev, templateId: value }))
            }
          >
            <SelectTrigger id="email-template">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="template-1">Standard Template</SelectItem>
              <SelectItem value="template-2">Brief Summary Only</SelectItem>
              <SelectItem value="template-3">Detailed With Action Items</SelectItem>
              <SelectItem value="template-4">Custom Template</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sender-email">Sender Email</Label>
          <Input 
            id="sender-email" 
            placeholder="youremail@example.com" 
            type="email"
          />
          <p className="text-sm text-muted-foreground">
            The email address that will be used to send follow-ups
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveEmailSettings}>Save Email Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default EmailSettingsSection;
