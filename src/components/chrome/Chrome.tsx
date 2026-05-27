"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { LeftMenu } from "./LeftMenu";
import { CarbonTracker } from "./CarbonTracker";
import { SiteFooter } from "./SiteFooter";
import { ContactSlide } from "./ContactSlide";
import { DownloadSlide } from "./DownloadSlide";
import { CaseStudyDrawer } from "./CaseStudyDrawer";
import { JournalPostDrawer } from "./JournalPostDrawer";
import { WelcomeAcknowledgement } from "./WelcomeAcknowledgement";
import { AccessibilityModes } from "./AccessibilityModes";
import { ImpactCaseStudyDrawer } from "@/components/impact/ImpactCaseStudyDrawer";

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LeftMenu />
      <CarbonTracker />
      {children}
      <SiteFooter />
      <ContactSlide />
      <DownloadSlide />
      <CaseStudyDrawer />
      <JournalPostDrawer />
      <ImpactCaseStudyDrawer />
      <WelcomeAcknowledgement />
      <AccessibilityModes />
    </ThemeProvider>
  );
}
