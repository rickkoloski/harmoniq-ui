import { Check, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { AccessLevel } from './types';

interface AccessLevelOption {
  value: AccessLevel;
  label: string;
  description: string;
}

const ACCESS_LEVEL_OPTIONS: AccessLevelOption[] = [
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Can view content',
  },
  {
    value: 'commenter',
    label: 'Commenter',
    description: 'Can view and comment',
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Can view, comment, and edit',
  },
  {
    value: 'full_access',
    label: 'Full Access',
    description: 'Can edit and share with others',
  },
];

interface AccessLevelSelectorProps {
  value: AccessLevel;
  onChange: (level: AccessLevel) => void;
  disabled?: boolean;
  allowedLevels?: AccessLevel[];
}

export function AccessLevelSelector({
  value,
  onChange,
  disabled = false,
  allowedLevels,
}: AccessLevelSelectorProps) {
  const options = allowedLevels
    ? ACCESS_LEVEL_OPTIONS.filter((opt) => allowedLevels.includes(opt.value))
    : ACCESS_LEVEL_OPTIONS;

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="gap-1">
          {selectedOption?.label || 'Select access'}
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-start gap-2 cursor-pointer py-3"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{option.label}</span>
                {value === option.value && <Check className="size-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {option.description}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}