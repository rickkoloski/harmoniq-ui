import { useState } from 'react';
import { Search, Shield } from 'lucide-react';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import type { SecurityRole } from './types';

interface RolesPickerProps {
  onSelect: (role: SecurityRole) => void;
  excludeRoleIds?: string[];
  placeholder?: string;
}

// Mock data for demonstration
const MOCK_ROLES: SecurityRole[] = [
  {
    id: 'role-1',
    name: 'Finance Admin',
    description: 'Manage budgets and financial records',
  },
  {
    id: 'role-2',
    name: 'HR Manager',
    description: 'Access employee records and benefits',
  },
  {
    id: 'role-3',
    name: 'Project Admin',
    description: 'Create and manage all projects',
  },
  {
    id: 'role-4',
    name: 'Content Editor',
    description: 'Edit and publish content across workspace',
  },
  {
    id: 'role-5',
    name: 'Timesheet Approver',
    description: 'Review and approve timesheets',
  },
];

export function RolesPicker({
  onSelect,
  excludeRoleIds = [],
  placeholder = 'Search for roles...',
}: RolesPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredRoles = MOCK_ROLES.filter(
    (role) =>
      !excludeRoleIds.includes(role.id) &&
      (role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (role: SecurityRole) => {
    onSelect(role);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="pl-9"
        />
      </div>

      {showResults && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
          <ScrollArea className="max-h-64">
            {filteredRoles.length > 0 ? (
              <div className="p-2">
                {filteredRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleSelect(role)}
                    className="w-full flex items-start gap-3 px-2 py-2 hover:bg-accent rounded text-left"
                  >
                    <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="size-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{role.name}</div>
                      {role.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No roles found
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
