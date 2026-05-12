'use client';

import { AdminShell } from '@/components/AdminShell';
import { ProfileEditor } from '@/components/ProfileEditor';
import { currentAdmin, firm } from '@/lib/mock';

export default function AdminProfile() {
  return (
    <AdminShell title="My profile" subtitle="How you appear inside Clockd and to your team.">
      <ProfileEditor
        person={{
          name: currentAdmin.name,
          role: currentAdmin.role,
          avatarUrl: currentAdmin.avatarUrl ?? '',
          email: currentAdmin.email ?? '',
          phone: currentAdmin.phone ?? '',
          bio: currentAdmin.bio ?? '',
          org: firm.name,
          orgSub: firm.location,
        }}
      />
    </AdminShell>
  );
}
