'use client';

import { PortalShell } from '@/components/PortalShell';
import { ProfileEditor } from '@/components/ProfileEditor';
import { currentClient, firm } from '@/lib/mock';

export default function PortalProfile() {
  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-[-0.5px]">My profile</h1>
        <p className="text-sm text-fg-muted mt-1">Manage your contact info and preferences.</p>
      </div>
      <ProfileEditor
        person={{
          name: currentClient.name,
          role: currentClient.role,
          avatarUrl: currentClient.avatarUrl,
          email: currentClient.email,
          phone: currentClient.phone,
          bio: currentClient.bio,
          org: 'Reyes Family Trust',
          orgSub: `Client of ${firm.name}`,
        }}
      />
    </PortalShell>
  );
}
