import { useState } from 'react';
import { Search, Users, User, Building2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import type { Party } from './types';

interface PeopleAndTeamsPickerProps {
  onSelect: (party: Party) => void;
  excludePartyIds?: string[];
  placeholder?: string;
}

// Mock data for demonstration
const MOCK_PARTIES: Party[] = [
  {
    id: '1',
    type: 'Individual',
    name: 'Russell Holmes',
    email: 'russell@example.com',
    avatarUrl: '',
  },
  {
    id: '2',
    type: 'Individual',
    name: 'Jonathan Bailey',
    email: 'jonathan.bailey@cloud.com',
    avatarUrl: '',
  },
  {
    id: '3',
    type: 'Individual',
    name: 'Rick Kolosk',
    email: 'rick.kolosk@gmail.com',
    avatarUrl: '',
  },
  {
    id: '4',
    type: 'Individual',
    name: 'Test External User',
    email: 'test-external-user@example.com',
    avatarUrl: '',
    isExternal: true,
  },
  {
    id: '5',
    type: 'Organization',
    name: 'Engineering Team',
    avatarUrl: '',
  },
  {
    id: '6',
    type: 'Organization',
    name: 'Design Team',
    avatarUrl: '',
  },
  {
    id: '7',
    type: 'Organization',
    name: 'Product Team',
    avatarUrl: '',
  },
];

export function PeopleAndTeamsPicker({
  onSelect,
  excludePartyIds = [],
  placeholder = 'Search for people, teams, or enter...',
}: PeopleAndTeamsPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredParties = MOCK_PARTIES.filter(
    (party) =>
      !excludePartyIds.includes(party.id) &&
      (party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        party.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const individuals = filteredParties.filter((p) => p.type === 'Individual');
  const teams = filteredParties.filter((p) => p.type === 'Organization');

  const handleSelect = (party: Party) => {
    onSelect(party);
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
            {individuals.length > 0 && (
              <div className="p-2">
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                  <User className="size-3" />
                  <span>People</span>
                </div>
                {individuals.map((party) => (
                  <button
                    key={party.id}
                    onClick={() => handleSelect(party)}
                    className="w-full flex items-center gap-3 px-2 py-2 hover:bg-accent rounded text-left"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={party.avatarUrl} />
                      <AvatarFallback>
                        {party.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm truncate">{party.name}</span>
                        {party.isExternal && (
                          <Badge variant="secondary" className="text-xs">
                            external
                          </Badge>
                        )}
                      </div>
                      {party.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {party.email}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {teams.length > 0 && (
              <div className="p-2 border-t">
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
                  <Users className="size-3" />
                  <span>Teams</span>
                </div>
                {teams.map((party) => (
                  <button
                    key={party.id}
                    onClick={() => handleSelect(party)}
                    className="w-full flex items-center gap-3 px-2 py-2 hover:bg-accent rounded text-left"
                  >
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm truncate block">{party.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredParties.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No people or teams found
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
