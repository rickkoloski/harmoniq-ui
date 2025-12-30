import { MoreHorizontal, Trash2, Building2, Crown, Mail, Link } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { AccessLevelSelector } from './AccessLevelSelector';
import type { Grantee, AccessLevel } from './types';

interface ShareListProps {
  grantees: Grantee[];
  onChangeAccess: (granteeId: string, level: AccessLevel) => void;
  onRemove: (granteeId: string) => void;
  canManage?: boolean;
  currentUserId?: string;
}

export function ShareList({
  grantees,
  onChangeAccess,
  onRemove,
  canManage = true,
  currentUserId,
}: ShareListProps) {
  const handleResendInvitation = (granteeId: string) => {
    // In real implementation, this would call the backend API
    console.log('Resending invitation to:', granteeId);
  };

  const handleCopyShareLink = (granteeId: string) => {
    // In real implementation, this would generate and copy a share link
    console.log('Copying share link for:', granteeId);
    // Mock: copy to clipboard
    navigator.clipboard.writeText(`https://example.com/share/${granteeId}`);
  };

  return (
    <div className="space-y-2">
      {grantees.map((grantee) => {
        const isCurrentUser = currentUserId === grantee.id;
        const canEdit = canManage && !grantee.isOwner && !isCurrentUser;

        return (
          <div
            key={grantee.id}
            className="flex items-center gap-3 py-2 px-1 hover:bg-accent/50 rounded"
          >
            {grantee.type === 'Individual' ? (
              <Avatar className="size-8">
                <AvatarImage src={grantee.avatarUrl} />
                <AvatarFallback>
                  {grantee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="size-4 text-primary" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm truncate">{grantee.name}</span>
                {grantee.isOwner && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Crown className="size-3" />
                    Owner
                  </Badge>
                )}
                {grantee.isExternal && (
                  <Badge variant="outline" className="text-xs">
                    external
                  </Badge>
                )}
              </div>
              {grantee.email && (
                <p className="text-xs text-muted-foreground truncate">
                  {grantee.email}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {grantee.isOwner ? (
                <Badge variant="secondary">Owner</Badge>
              ) : (
                <AccessLevelSelector
                  value={grantee.accessLevel}
                  onChange={(level) => onChangeAccess(grantee.id, level)}
                  disabled={!canEdit}
                />
              )}

              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleResendInvitation(grantee.id)}
                      className="cursor-pointer"
                    >
                      <Mail className="size-4 mr-2" />
                      Resend invitation
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopyShareLink(grantee.id)}
                      className="cursor-pointer"
                    >
                      <Link className="size-4 mr-2" />
                      Copy share link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onRemove(grantee.id)}
                      className="text-destructive cursor-pointer"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Remove access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}