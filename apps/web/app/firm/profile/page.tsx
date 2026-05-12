'use client';

import { FirmShell } from '@/components/FirmShell';
import { ProfileEditor } from '@/components/ProfileEditor';
import { currentFirmUser, firm } from '@/lib/mock';

export default function FirmProfile() {
  return (
    <FirmShell title="My profile" subtitle="How you appear inside Clockd and on client-facing invoices.">
      <ProfileEditor
        person={{
          name: currentFirmUser.name,
          role: currentFirmUser.role,
          avatarUrl: currentFirmUser.avatarUrl ?? '',
          email: currentFirmUser.email ?? '',
          phone: currentFirmUser.phone ?? '',
          bio: currentFirmUser.bio ?? '',
          org: firm.name,
          orgSub: firm.location,
        }}
      />
    </FirmShell>
  );
}
