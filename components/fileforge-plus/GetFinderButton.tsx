"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { MagneticButton } from "@/components/fileforge/ui/MagneticButton";

// The "Get FileForge Finder+" CTA that sits beside the sign-in link in the
// /fileforge-plus page's fixed top-right corner. Unlike the download-based CTA
// on /finder, this always routes the visitor to the early-access
// lead-capture page (the paid subscribe flow isn't live yet).
export function GetFinderButton() {
  return (
    <MagneticButton
      href="/finder/early-access"
      className="px-6 py-3 bg-[#d97706] !text-white text-base font-medium rounded-full hover:bg-[#b45309]"
    >
      <span className="flex items-center gap-2">
        Get FileForge Finder+
        <ArrowRight size={18} weight="bold" />
      </span>
    </MagneticButton>
  );
}
