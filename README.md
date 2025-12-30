# Harmoniq UI - Unified Sharing & Permissions System

A comprehensive React-based UI component library for implementing modern sharing and permissions interfaces, following patterns from Figma, Slack, Jira, and Asana.

## Overview

This project implements a unified sharing system based on the **EntityShare Specification v5.5**, consolidating all access control into a single, consistent mechanism across multiple entity types.

### Key Features

- **🔒 Confidential Sharing** - Private by default with explicit share grants (Projects, Files)
- **🤝 Open Collaboration** - Tenant-wide visibility with participant management (Conversations)
- **👥 Teams & People** - Support for both individual users and organizational teams
- **🎚️ Access Levels** - Four-tier access control (Viewer, Commenter, Editor, Full Access)
- **🌐 External Collaboration** - Guest access for users outside the organization
- **♾️ Progressive Disclosure** - Advanced features hidden until needed

## Live Demo

Try the interactive demo to see both sharing patterns in action:
- **Share Dialog** for confidential entities
- **Manage Participants Dialog** for open collaboration

## Architecture

### Mental Model

The system presents users with three simple concepts:

1. **Teams** - Groups of people with shared access
2. **Shares** - Who has access to specific resources
3. **Access Levels** - What each person/team can do

### Access Levels

| Level | Capabilities |
|-------|-------------|
| **Viewer** | View content only |
| **Commenter** | View and add comments |
| **Editor** | View, comment, and edit content |
| **Full Access** | All editor permissions plus sharing with others |
| **Owner** | Complete control (cannot be changed) |

### Entity Types

The system supports two sharing patterns:

#### Confidential (Private by Default)
- Projects
- Files  
- Tasks
- Requires explicit share grants

#### Open Collaboration (Tenant-Wide Visibility)
- Conversations (LLM chats, discussions)
- Accessible to all tenant members by default
- External guests can be invited

## Project Structure

```
harmoniq-ui/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── sharing/          # Core sharing components
│   │   │   │   ├── ShareDialog.tsx
│   │   │   │   ├── ManageParticipantsDialog.tsx
│   │   │   │   ├── ShareList.tsx
│   │   │   │   ├── AccessLevelSelector.tsx
│   │   │   │   ├── PeopleAndTeamsPicker.tsx
│   │   │   │   ├── RolesPicker.tsx
│   │   │   │   ├── RoleGrantsList.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   └── ui/               # Radix UI primitives
│   │   └── App.tsx              # Demo application
│   └── styles/                  # Tailwind CSS styles
├── package.json
└── README.md
```

## Components

### ShareDialog

Primary component for confidential entities (Projects, Files).

```tsx
import { ShareDialog } from './components/sharing';

<ShareDialog
  entity={project}
  open={isOpen}
  onOpenChange={setIsOpen}
  currentUserId="user-123"
/>
```

**Features:**
- People and teams search with autocomplete
- Access level selection per share
- Advanced options (public links, expiration, roles)
- Guest/external user support

### ManageParticipantsDialog

Component for open collaboration entities (Conversations).

```tsx
import { ManageParticipantsDialog } from './components/sharing';

<ManageParticipantsDialog
  entity={conversation}
  open={isOpen}
  onOpenChange={setIsOpen}
  currentUserId="user-123"
/>
```

**Features:**
- Separate tabs for Members and Guests
- Batch access level changes
- Remove participants
- Guest invitation

### AccessLevelSelector

Reusable dropdown for selecting access levels.

```tsx
import { AccessLevelSelector } from './components/sharing';

<AccessLevelSelector
  value={currentLevel}
  onChange={handleLevelChange}
  allowedLevels={['viewer', 'editor', 'full_access']}
/>
```

### PeopleAndTeamsPicker

Search and select component for adding people or teams.

```tsx
import { PeopleAndTeamsPicker } from './components/sharing';

<PeopleAndTeamsPicker
  onSelect={(selection) => handleAdd(selection)}
  excludePartyIds={existingShares.map(s => s.id)}
/>
```

## Installation

```bash
# Clone the repository
git clone https://github.com/rickkoloski/harmoniq-ui.git

# Install dependencies
npm install

# Run development server
npm run dev
```

## Tech Stack

- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4.1** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Vite** - Build tool

## Backend Integration

The UI components are designed to work with an EntityShare backend model:

```ruby
# Example EntityShare creation
EntityShare.create!(
  shareable: project,           # The resource being shared
  grantee: user.party,         # Who gets access (User or Team)
  access_level: :editor,       # viewer, commenter, editor, full_access
  invited_by: current_user.party,
  context: :explicit_share
)
```

### Required Backend APIs

Your backend should implement these endpoints:

- `GET /api/shares/:entity_id` - List current shares
- `POST /api/shares` - Create new share
- `PATCH /api/shares/:id` - Update access level
- `DELETE /api/shares/:id` - Remove share
- `GET /api/search/people` - Search for users/teams
- `GET /api/search/roles` - Search for roles

## Design Principles

1. **Consistency** - Same patterns across all entity types
2. **Progressive Disclosure** - Advanced features hidden until needed
3. **Clear Hierarchy** - Visual distinction between internal and external users
4. **Accessibility** - WCAG 2.1 AA compliant
5. **Responsive** - Works on desktop, tablet, and mobile

## Customization

### Styling

The project uses Tailwind CSS with CSS variables for theming. Customize in `/src/styles/theme.css`:

```css
@theme {
  --color-primary: /* your brand color */;
  --color-background: /* background color */;
  /* ... */
}
```

### Access Levels

Modify available access levels in `/src/app/components/sharing/types.ts`:

```typescript
export type AccessLevel = 
  | 'viewer' 
  | 'commenter' 
  | 'editor' 
  | 'full_access'
  | 'custom_level'; // Add your own
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Design patterns inspired by Figma, Slack, Jira, and Asana
- Built with Radix UI for accessibility
- Styled with Tailwind CSS

## Support

For questions or issues:
- Open an issue on GitHub
- Check the [specification document](./docs/entity-share-spec-v5.5.md) (if available)
- Review example implementations in `/src/app/App.tsx`

---

**Built with ❤️ for modern collaboration**
