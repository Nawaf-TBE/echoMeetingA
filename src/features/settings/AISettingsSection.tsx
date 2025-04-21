
import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AISettingsSection = () => {
  const [aiSettings, setAiSettings] = useState({
    model: "gpt-4o",
    summarizationEnabled: true,
    extractActionItems: true,
    extractDecisions: true,
  });

  const handleSaveAISettings = () => {
    toast.success("AI settings saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI & Transcription Settings</CardTitle>
        <CardDescription>
          Configure how meetings are transcribed and processed by AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-model">AI Model</Label>
          <Select 
            value={aiSettings.model}
            onValueChange={(value) => 
              setAiSettings(prev => ({ ...prev, model: value }))
            }
          >
            <SelectTrigger id="ai-model">
              <SelectValue placeholder="Select AI model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
              <SelectItem value="gemini">Gemini Pro</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Select the AI model used for summarization and insights
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="summarization">Meeting Summarization</Label>
            <p className="text-sm text-muted-foreground">
              Generate concise summaries of meetings
            </p>
          </div>
          <Switch
            id="summarization"
            checked={aiSettings.summarizationEnabled}
            onCheckedChange={(checked) => 
              setAiSettings(prev => ({ ...prev, summarizationEnabled: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="action-items">Extract Action Items</Label>
            <p className="text-sm text-muted-foreground">
              Identify and extract action items from meetings
            </p>
          </div>
          <Switch
            id="action-items"
            checked={aiSettings.extractActionItems}
            onCheckedChange={(checked) => 
              setAiSettings(prev => ({ ...prev, extractActionItems: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="decisions">Extract Key Decisions</Label>
            <p className="text-sm text-muted-foreground">
              Identify and extract key decisions from meetings
            </p>
          </div>
          <Switch
            id="decisions"
            checked={aiSettings.extractDecisions}
            onCheckedChange={(checked) => 
              setAiSettings(prev => ({ ...prev, extractDecisions: checked }))
            }
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveAISettings}>Save AI Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default AISettingsSection;
