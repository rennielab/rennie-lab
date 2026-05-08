"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { LeftMenu } from "./LeftMenu";
import { RightMenu } from "./RightMenu";
import { CarbonTracker } from "./CarbonTracker";
import { SiteFooter } from "./SiteFooter";
import { ContactSlide } from "./ContactSlide";
import { DownloadSlide } from "./DownloadSlide";

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LeftMenu />
      <RightMenu />
      <CarbonTracker />
      {children}
      <SiteFooter />
      <ContactSlide />
      <DownloadSlide />
    </ThemeProvider>
  );
}
