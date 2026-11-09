import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Close Button Padding & Component Overlap Gate", () => {
  it("DialogPrimitive.Close: provides generous padding (p-2.5), rounded-xl, and high z-index", () => {
    const dialogPath = path.resolve(__dirname, "../dialog.tsx");
    const content = fs.readFileSync(dialogPath, "utf-8");

    // Must contain p-2.5, rounded-xl, and z-30 for touch comfort and no edge collision
    expect(content).toContain("p-2.5");
    expect(content).toContain("rounded-xl");
    expect(content).toContain("z-30");
    expect(content).toContain("rtl:left-4");
  });

  it("DialogHeader: enforces rtl:pl-12 ltr:pr-12 to prevent child text/badges from colliding with close button", () => {
    const dialogPath = path.resolve(__dirname, "../dialog.tsx");
    const content = fs.readFileSync(dialogPath, "utf-8");

    expect(content).toContain("rtl:pl-12 ltr:pr-12");
  });

  it("SheetPrimitive.Close: provides generous padding (p-2.5) and RTL-aware placement", () => {
    const sheetPath = path.resolve(__dirname, "../sheet.tsx");
    const content = fs.readFileSync(sheetPath, "utf-8");

    expect(content).toContain("p-2.5");
    expect(content).toContain("rounded-xl");
    expect(content).toContain("rtl:left-4");
  });

  it("UserProfileModal: offsets header role badge with left-16 to prevent overlap with Dialog close button", () => {
    const profileModalPath = path.resolve(__dirname, "../../profile/UserProfileModal.tsx");
    const content = fs.readFileSync(profileModalPath, "utf-8");

    expect(content).toContain("absolute top-4 left-16 rtl:left-16");
  });

  it("CertificateViewerModal: provides p-2.5 and ms-2 spacing on DialogClose", () => {
    const certPath = path.resolve(__dirname, "../../profile/CertificateViewerModal.tsx");
    const content = fs.readFileSync(certPath, "utf-8");

    expect(content).toContain("p-2.5 ms-2");
  });

  it("LiveSessionStageModal: provides p-2.5 and ms-2 spacing on DialogClose", () => {
    const livePath = path.resolve(__dirname, "../../cohorts/LiveSessionStageModal.tsx");
    const content = fs.readFileSync(livePath, "utf-8");

    expect(content).toContain("p-2.5 ms-2");
  });

  it("MarketplaceCourseModal: adds safe clearance (rtl:pl-16 ltr:pr-16) to hero banner", () => {
    const marketPath = path.resolve(__dirname, "../../marketplace/MarketplaceCourseModal.tsx");
    const content = fs.readFileSync(marketPath, "utf-8");

    expect(content).toContain("rtl:pl-16 ltr:pr-16");
  });

  it("Study Groups: member removal X button has padding (p-1) and margin (mx-1) preventing overlap with student names", () => {
    const groupsPath = path.resolve(__dirname, "../../../pages/courses/Groups.tsx");
    const content = fs.readFileSync(groupsPath, "utf-8");

    expect(content).toContain("p-1 rounded-full transition-colors mx-1");
  });
});
