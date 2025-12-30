import { MoreHorizontal, Trash2, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { AccessLevelSelector } from './AccessLevelSelector';
import type { SecurityRole, AccessLevel } from './types';

interface RoleGrant {
  role: SecurityRole;
  accessLevel: AccessLevel;
}

interface RoleGrantsListProps {
  roleGrants: RoleGrant[];
  onChangeAccess: (roleId: string, level: AccessLevel) => void;
  onRemove: (roleId: string) => void;
  canManage?: boolean;
}

export function RoleGrantsList({
  roleGrants,
  onChangeAccess,
  onRemove,
  canManage = true,
}: RoleGrantsListProps) {
  return (
    <div className="space-y-2">
      {roleGrants.map((grant) => (
        <div
          key={grant.role.id}
          className="flex items-center gap-3 py-2 px-1 hover:bg-accent/50 rounded"
        >
          <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Shield className="size-4 text-blue-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm">{grant.role.name}</div>
            {grant.role.description && (
              <p className="text-xs text-muted-foreground truncate">
                {grant.role.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <AccessLevelSelector
              value={grant.accessLevel}
              onChange={(level) => onChangeAccess(grant.role.id, level)}
              disabled={!canManage}
            />

            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onRemove(grant.role.id)}
                    className="text-destructive cursor-pointer"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Remove role grant
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
