"use client";

import { CVStoreProvider } from "@/lib/cv-store";
import { MainLayout } from "@/components/layout/main-layout";

export default function EditorPage() {
  return (
    <CVStoreProvider>
      <MainLayout />
    </CVStoreProvider>
  );
}
