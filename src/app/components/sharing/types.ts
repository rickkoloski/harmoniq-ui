// Types for the unified sharing system
// Maps to EntityShare schema from spec v5.5

export type AccessLevel = 'viewer' | 'commenter' | 'editor' | 'full_access' | 'owner';

export type GranteeType = 'Party' | 'SecurityRole';

export type GranteeScope = 'specific' | 'tenant_members' | 'from_parent' | 'public_link' | 'dynamic';

export type ShareScope = 'instance' | 'class' | 'dynamic';

export interface Party {
  id: string;
  type: 'Individual' | 'Organization'; // Individual = user, Organization = team
  name: string;
  email?: string; // Only for Individual
  avatarUrl?: string;
  isExternal?: boolean; // External to tenant (guest)
}

export interface SecurityRole {
  id: string;
  name: string;
  description?: string;
}

export interface EntityShare {
  id: string;
  shareableType: string;
  shareableId: string | null;
  shareScope: ShareScope;
  granteeType: GranteeType;
  granteeId: string;
  granteeScope: GranteeScope;
  accessLevel: AccessLevel;
  canReshare: boolean;
  grantedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  metadata?: {
    expiresAt?: string;
    message?: string;
    publicLinkToken?: string;
  };
}

export interface ShareableEntity {
  id: string;
  type: string;
  name: string;
  ownerPartyId: string;
  tenantId: string;
}

export interface Grantee extends Party {
  accessLevel: AccessLevel;
  canReshare: boolean;
  grantedBy?: string;
  isOwner?: boolean;
}
