// /portal/messages is now a redirect — the campfire chat slide-out in the
// header is the canonical conversation surface. Keeping the route so external
// links don't 404.

import { redirect } from 'next/navigation';

export default function PortalMessages() {
  redirect('/portal/contact');
}
