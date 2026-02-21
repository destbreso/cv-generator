"use client";

import { CVStoreProvider } from "@/lib/cv-store";
import { MainLayout } from "@/components/layout/main-layout";
import { DesktopGuard } from "@/components/desktop-guard";

export default function EditorPage() {
  return (
    <DesktopGuard>
      <CVStoreProvider>
        <MainLayout />
      </CVStoreProvider>
    </DesktopGuard>
  );
}
