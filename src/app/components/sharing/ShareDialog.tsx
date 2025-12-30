import { useState } from 'react';
import { ChevronDown, Link2, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PeopleAndTeamsPicker } from './PeopleAndTeamsPicker';
import { ShareList } from './ShareList';
import { AccessLevelSelector } from './AccessLevelSelector';
import { RolesPicker } from './RolesPicker';
import { RoleGrantsList } from './RoleGrantsList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import type { Grantee, Party, AccessLevel, ShareableEntity, SecurityRole } from './types';

interface ShareDialogProps {
  entity: ShareableEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
}

interface RoleGrant {
  role: SecurityRole;
  accessLevel: AccessLevel;
}

// Mock data for demonstration
const MOCK_GRANTEES: Grantee[] = [
  {
    id: '1',
    type: 'Individual',
    name: 'Russell Holmes',
    email: 'russell@example.com',
    accessLevel: 'owner',
    canReshare: true,
    isOwner: true,
  },
  {
    id: '2',
    type: 'Individual',
    name: 'Root User',
    email: 'rootuser33@gmail.com',
    accessLevel: 'editor',
    canReshare: false,
  },
  {
    id: '3',
    type: 'Team',
    name: 'Engineering Team',
    email: '12 members',
    accessLevel: 'editor',
    canReshare: false,
  },
  {
    id: '4',
    type: 'Individual',
    name: 'Russell Guest',
    email: 'russell-guest@gmail.com',
    accessLevel: 'viewer',
    canReshare: false,
  },
  {
    id: '5',
    type: 'Individual',
    name: 'Test External User',
    email: 'test-external-user@example.com',
    accessLevel: 'viewer',
    canReshare: false,
    isExternal: true,
  },
];

const MOCK_ROLE_GRANTS: RoleGrant[] = [
  {
    role: {
      id: 'role-1',
      name: 'Finance Admin',
      description: 'Manage budgets and financial records',
    },
    accessLevel: 'editor',
  },
];

export function ShareDialog({
  entity,
  open,
  onOpenChange,
  currentUserId,
}: ShareDialogProps) {
  const [grantees, setGrantees] = useState<Grantee[]>(MOCK_GRANTEES);
  const [roleGrants, setRoleGrants] = useState<RoleGrant[]>(MOCK_ROLE_GRANTS);
  const [defaultAccessLevel, setDefaultAccessLevel] = useState<AccessLevel>('viewer');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const handleAddPerson = (party: Party) => {
    // In real implementation, this would call the backend API
    const newGrantee: Grantee = {
      ...party,
      accessLevel: defaultAccessLevel,
      canReshare: false,
    };
    setGrantees([...grantees, newGrantee]);
  };

  const handleAddRole = (role: SecurityRole) => {
    const newGrant: RoleGrant = {
      role,
      accessLevel: defaultAccessLevel,
    };
    setRoleGrants([...roleGrants, newGrant]);
  };

  const handleChangeAccess = (granteeId: string, level: AccessLevel) => {
    setGrantees(
      grantees.map((g) => (g.id === granteeId ? { ...g, accessLevel: level } : g))
    );
  };

  const handleChangeRoleAccess = (roleId: string, level: AccessLevel) => {
    setRoleGrants(
      roleGrants.map((rg) => (rg.role.id === roleId ? { ...rg, accessLevel: level } : rg))
    );
  };

  const handleRemove = (granteeId: string) => {
    setGrantees(grantees.filter((g) => g.id !== granteeId));
  };

  const handleRemoveRole = (roleId: string) => {
    setRoleGrants(roleGrants.filter((rg) => rg.role.id !== roleId));
  };

  const excludePartyIds = grantees.map((g) => g.id);
  const excludeRoleIds = roleGrants.map((rg) => rg.role.id);
  const peopleWithAccess = grantees.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Share "{entity.name}"</DialogTitle>
          <DialogDescription>
            Manage who has access to this {entity.type.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="people" className="w-full flex flex-col flex-1 min-h-0">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="people">People & Teams</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 min-h-0">
            <TabsContent value="people" className="space-y-4 mt-4 pr-4 min-h-[400px]">
              {/* People picker */}
              <div>
                <label className="text-sm mb-2 block">Add people or teams</label>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <PeopleAndTeamsPicker
                      onSelect={handleAddPerson}
                      excludePartyIds={excludePartyIds}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Set access</label>
                    <AccessLevelSelector
                      value={defaultAccessLevel}
                      onChange={setDefaultAccessLevel}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* People with access */}
              <div>
                <div className="text-sm mb-3">
                  People with access ({peopleWithAccess})
                </div>
                <ShareList
                  grantees={grantees}
                  onChangeAccess={handleChangeAccess}
                  onRemove={handleRemove}
                  currentUserId={currentUserId}
                />
              </div>

              <Separator />

              {/* Advanced sharing options */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm hover:underline">
                  Advanced sharing options
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      advancedOpen ? 'rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="space-y-3">
                    {/* Public link sharing */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Link2 className="size-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">Public link</div>
                          <p className="text-xs text-muted-foreground">
                            Anyone with the link can access
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Create link
                      </Button>
                    </div>

                    {/* Expiration */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="size-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">Set expiration</div>
                          <p className="text-xs text-muted-foreground">
                            Access expires after a date
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Set date
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="roles" className="space-y-4 mt-4 pr-4 min-h-[400px]">
              <p className="text-sm text-muted-foreground">
                Grant access by functional role. Use roles for authority-based permissions
                (e.g., "Finance Admin" manages budgets). Use teams for collaboration.
              </p>

              {/* Role picker */}
              <div>
                <label className="text-sm mb-2 block">Add role</label>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <RolesPicker
                      onSelect={handleAddRole}
                      excludeRoleIds={excludeRoleIds}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Set access</label>
                    <AccessLevelSelector
                      value={defaultAccessLevel}
                      onChange={setDefaultAccessLevel}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Role grants */}
              {roleGrants.length > 0 ? (
                <div>
                  <div className="text-sm mb-3">
                    Role-based grants ({roleGrants.length})
                  </div>
                  <RoleGrantsList
                    roleGrants={roleGrants}
                    onChangeAccess={handleChangeRoleAccess}
                    onRemove={handleRemoveRole}
                  />
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No role-based grants yet
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}