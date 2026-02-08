import type { Metadata } from "next";
import { PrivacyContent } from "./privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy — CV Generator",
  description:
    "Privacy policy for CV Generator. Learn how your data is stored locally and never sent to external servers.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
