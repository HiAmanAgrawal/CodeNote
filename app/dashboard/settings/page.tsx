import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Save,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your CodeNote experience
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Basic account and application settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive updates about contests and new features</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Language</h4>
              <p className="text-sm text-muted-foreground">Choose your preferred language</p>
            </div>
            <Button variant="outline" size="sm">English</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Timezone</h4>
              <p className="text-sm text-muted-foreground">Set your local timezone for contest schedules</p>
            </div>
            <Button variant="outline" size="sm">UTC-5</Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Theme</h4>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Sun className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button variant="outline" size="sm">
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </Button>
              <Button variant="outline" size="sm">
                <Monitor className="mr-2 h-4 w-4" />
                System
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Code Editor Theme</h4>
              <p className="text-sm text-muted-foreground">Choose your preferred editor theme</p>
            </div>
            <Button variant="outline" size="sm">VS Dark</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Font Size</h4>
              <p className="text-sm text-muted-foreground">Adjust the font size in the editor</p>
            </div>
            <Button variant="outline" size="sm">14px</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Contest Reminders</h4>
              <p className="text-sm text-muted-foreground">Get notified before contests start</p>
            </div>
            <Badge variant="default">Enabled</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Problem Recommendations</h4>
              <p className="text-sm text-muted-foreground">Receive personalized problem suggestions</p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Achievement Notifications</h4>
              <p className="text-sm text-muted-foreground">Celebrate your milestones</p>
            </div>
            <Badge variant="default">Enabled</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Digest</h4>
              <p className="text-sm text-muted-foreground">Weekly summary of your progress</p>
            </div>
            <Badge variant="outline">Disabled</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
          <CardDescription>
            Manage your privacy settings and account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Profile Visibility</h4>
              <p className="text-sm text-muted-foreground">Control who can see your profile</p>
            </div>
            <Button variant="outline" size="sm">Public</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Badge variant="outline">Not Enabled</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Data Export</h4>
              <p className="text-sm text-muted-foreground">Download your data</p>
            </div>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
} 