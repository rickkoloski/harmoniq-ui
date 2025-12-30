import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PeopleAndTeamsPicker } from './PeopleAndTeamsPicker';
import { ShareList } from './ShareList';
import type { Grantee, Party, AccessLevel, ShareableEntity } from './types';

interface ManageParticipantsDialogProps {
  entity: ShareableEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
}

// Mock data for demonstration - following Conversation's "open collaboration" pattern
const MOCK_MEMBERS: Grantee[] = [
  {
    id: '1',
    type: 'Individual',
    name: 'Rick Kolosk',
    email: 'rick.kolosk@gmail.com',
    accessLevel: 'editor',
    canReshare: false,
  },
  {
    id: '2',
    type: 'Individual',
    name: 'Jonathan Bailey',
    email: 'jonathan.bailey@cloud.com',
    accessLevel: 'editor',
    canReshare: false,
  },
  {
    id: '3',
    type: 'Individual',
    name: 'Russell Holmes',
    email: 'russell@example.com',
    accessLevel: 'editor',
    canReshare: false,
  },
  {
    id: '4',
    type: 'Individual',
    name: 'Paul Plushbell',
    email: 'paul@acme.com',
    accessLevel: 'editor',
    canReshare: false,
  },
  {
    id: '5',
    type: 'Individual',
    name: 'Claude Code',
    email: 'claude@ai.com',
    accessLevel: 'editor',
    canReshare: false,
  },
];

const MOCK_GUESTS: Grantee[] = [];

export function ManageParticipantsDialog({
  entity,
  open,
  onOpenChange,
  currentUserId,
}: ManageParticipantsDialogProps) {
  const [members, setMembers] = useState<Grantee[]>(MOCK_MEMBERS);
  const [guests, setGuests] = useState<Grantee[]>(MOCK_GUESTS);
  const [showInvite, setShowInvite] = useState(false);

  const handleAddGuest = (party: Party) => {
    // In real implementation, this would call the backend API
    const newGuest: Grantee = {
      ...party,
      accessLevel: 'viewer',
      canReshare: false,
      isExternal: true,
    };
    setGuests([...guests, newGuest]);
    setShowInvite(false);
  };

  const handleChangeMemberAccess = (granteeId: string, level: AccessLevel) => {
    setMembers(members.map((m) => (m.id === granteeId ? { ...m, accessLevel: level } : m)));
  };

  const handleChangeGuestAccess = (granteeId: string, level: AccessLevel) => {
    setGuests(guests.map((g) => (g.id === granteeId ? { ...g, accessLevel: level } : g)));
  };

  const handleRemoveMember = (granteeId: string) => {
    setMembers(members.filter((m) => m.id !== granteeId));
  };

  const handleRemoveGuest = (granteeId: string) => {
    setGuests(guests.filter((g) => g.id !== granteeId));
  };

  const excludePartyIds = [...members, ...guests].map((g) => g.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Conversation Participants</DialogTitle>
          <DialogDescription>
            Manage who can participate in this conversation and their access levels.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="members" className="w-full flex flex-col flex-1 min-h-0">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
            <TabsTrigger value="guests">Guests ({guests.length})</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 min-h-0">
            <TabsContent value="members" className="space-y-4 mt-4 pr-4 min-h-[350px]">
              <p className="text-sm text-muted-foreground">
                Workspace users can join this conversation. Participants cannot be removed,
                only their access level can be changed.
              </p>
              <ShareList
                grantees={members}
                onChangeAccess={handleChangeMemberAccess}
                onRemove={handleRemoveMember}
                currentUserId={currentUserId}
                canManage={false} // Open collaboration pattern - can't remove members
              />
            </TabsContent>

            <TabsContent value="guests" className="space-y-4 mt-4 pr-4 min-h-[350px]">
              <p className="text-sm text-muted-foreground">
                Invite guests to join this conversation with limited messages before signing up.
              </p>

              {showInvite ? (
                <div className="space-y-3">
                  <PeopleAndTeamsPicker
                    onSelect={handleAddGuest}
                    excludePartyIds={excludePartyIds}
                    placeholder="Search for external users..."
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInvite(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : guests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    No guests invited yet
                  </p>
                  <Button onClick={() => setShowInvite(true)} size="sm">
                    <UserPlus className="size-4 mr-2" />
                    Invite Guest
                  </Button>
                </div>
              ) : (
                <>
                  <ShareList
                    grantees={guests}
                    onChangeAccess={handleChangeGuestAccess}
                    onRemove={handleRemoveGuest}
                    currentUserId={currentUserId}
                  />
                  <Button
                    onClick={() => setShowInvite(true)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <UserPlus className="size-4 mr-2" />
                    Invite Guest
                  </Button>
                </>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Update Members</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}