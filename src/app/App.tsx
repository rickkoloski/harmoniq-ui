import { useState } from 'react';
import { Share2, Users, FileText, MessageSquare } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { ShareDialog } from './components/sharing/ShareDialog';
import { ManageParticipantsDialog } from './components/sharing/ManageParticipantsDialog';

export default function App() {
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [conversationDialogOpen, setConversationDialogOpen] = useState(false);

  // Mock entities following the spec
  const mockProject = {
    id: 'proj-1',
    type: 'Project',
    name: 'DEV Cross-Tenant Test Project',
    ownerPartyId: '1',
    tenantId: 'tenant-1',
  };

  const mockConversation = {
    id: 'conv-1',
    type: 'LlmConversation',
    name: 'Team Planning Discussion',
    ownerPartyId: '1',
    tenantId: 'tenant-1',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl">Unified Sharing System</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Based on EntityShare Spec v5.5
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="prose dark:prose-invert max-w-none">
            <h2>Sharing Patterns</h2>
            <p>
              This demo showcases the two primary sharing patterns from the unified
              specification:
            </p>
            <ul>
              <li>
                <strong>Confidential</strong> (Projects, Files) - Private by default,
                explicit sharing required
              </li>
              <li>
                <strong>Open Collaboration</strong> (Conversations) - Visible to all tenant
                members, manage participants
              </li>
            </ul>
          </div>

          {/* Demo cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Project Sharing */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="size-5" />
                  <CardTitle>Project Sharing</CardTitle>
                </div>
                <CardDescription>
                  Confidential pattern - Private by default with explicit share grants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <h4 className="font-medium">Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Search for people and teams</li>
                    <li>Set individual access levels (Viewer, Editor, etc.)</li>
                    <li>Advanced options: Public links, expiration dates</li>
                    <li>Support for external users (guests)</li>
                  </ul>
                </div>
                <Button
                  onClick={() => setProjectDialogOpen(true)}
                  className="w-full gap-2"
                >
                  <Share2 className="size-4" />
                  Open Share Dialog
                </Button>
              </CardContent>
            </Card>

            {/* Conversation Participants */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="size-5" />
                  <CardTitle>Conversation Participants</CardTitle>
                </div>
                <CardDescription>
                  Open collaboration pattern - Visible to tenant members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <h4 className="font-medium">Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Separate tabs for Members and Guests</li>
                    <li>Members join automatically (tenant-wide visibility)</li>
                    <li>Invite external guests with limited access</li>
                    <li>Manage access levels for all participants</li>
                  </ul>
                </div>
                <Button
                  onClick={() => setConversationDialogOpen(true)}
                  className="w-full gap-2"
                >
                  <Users className="size-4" />
                  Manage Participants
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Design principles */}
          <Card>
            <CardHeader>
              <CardTitle>Design Principles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Simplified Mental Model</h4>
                  <p className="text-muted-foreground">
                    Users think in terms of Teams, Shares, and Access Levels - not complex
                    permissions
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Progressive Disclosure</h4>
                  <p className="text-muted-foreground">
                    Common actions front and center, advanced features collapsed by default
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Cross-Entity Consistency</h4>
                  <p className="text-muted-foreground">
                    Same UI patterns work for Projects, Files, Conversations, and Tasks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical mapping */}
          <Card>
            <CardHeader>
              <CardTitle>Backend Mapping</CardTitle>
              <CardDescription>How UI actions map to EntityShare records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm font-mono">
                <div className="p-3 bg-muted rounded">
                  <div className="text-xs text-muted-foreground mb-1">
                    "Share Project" → Creates instance-level EntityShare
                  </div>
                  <code className="text-xs">
                    EntityShare.create!(shareable: project, grantee: user.party,
                    access_level: :viewer, ...)
                  </code>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="text-xs text-muted-foreground mb-1">
                    "Add team" → Party with type: 'Organization'
                  </div>
                  <code className="text-xs">
                    EntityShare.create!(shareable: project, grantee: team_party,
                    access_level: :editor, ...)
                  </code>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="text-xs text-muted-foreground mb-1">
                    "Manage Participants" → Updates Conversation EntityShares
                  </div>
                  <code className="text-xs">
                    EntityShare.create!(shareable: conversation, grantee: user.party,
                    access_level: :editor, ...)
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialogs */}
      <ShareDialog
        entity={mockProject}
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        currentUserId="1"
      />

      <ManageParticipantsDialog
        entity={mockConversation}
        open={conversationDialogOpen}
        onOpenChange={setConversationDialogOpen}
        currentUserId="1"
      />
    </div>
  );
}
