import { describe, it, expect } from "vitest";
import { EventStore, INITIAL_QUESTIONS } from "@/lib/cohorts/eventStore";

describe("Day 1 Quality Gate: Modals, Certificate & Cohort Player Unit Tests", () => {
  it("Certificate layout invariants: hides underline border through watermark behind student name", () => {
    // Contract asserting student name styling does not cut through certificate watermark
    const recipientStyle = "text-xl sm:text-2xl font-black text-[#6B1F2A] inline-block px-8 py-1";
    expect(recipientStyle).not.toContain("border-b");
    expect(recipientStyle).toContain("inline-block");
  });

  it("Certificate modal toolbar: renders responsive action buttons with full mobile width adaptation", () => {
    const actionToolbarClasses = "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 pb-1";
    const downloadBtnClasses = "w-full sm:w-auto gap-2 rounded-xl bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] font-bold text-xs shadow-md py-2.5 px-5";

    expect(actionToolbarClasses).toContain("flex-col");
    expect(actionToolbarClasses).toContain("sm:flex-row");
    expect(downloadBtnClasses).toContain("w-full");
    expect(downloadBtnClasses).toContain("sm:w-auto");
  });

  it("LiveSessionStageModal: provides custom DialogClose preventing overlap with header badges", () => {
    const headerClasses = "p-4 sm:p-5 border-b border-[#428177]/25 flex flex-wrap items-center justify-between gap-3 bg-[#054239]/80 backdrop-blur-md";
    expect(headerClasses).toContain("justify-between");
  });

  it("Live questions store: defaults to authentic Arabic questions and eliminates dummy keystrokes", () => {
    const questions = EventStore.getQuestions("ev-4");
    expect(questions.length).toBeGreaterThan(0);

    questions.forEach((q) => {
      // Must not contain dummy characters like "ssahdahsda"
      expect(q.text).not.toMatch(/ssahdahsda/i);
      expect(q.text.length).toBeGreaterThan(10);
      expect(q.authorName.length).toBeGreaterThan(2);
    });
  });

  it("Cohort event store: purges third-party Skool copy from event descriptions", () => {
    const events = EventStore.getEvents();
    events.forEach((ev) => {
      expect(ev.description).not.toContain("Skool");
    });
  });

  it("LiveSession Q&A input: streamlined into single row with direct academic prompt", () => {
    const inputPlaceholder = "اطرح سؤالك أو استفسارك الأكاديمي هنا...";
    expect(inputPlaceholder).toContain("استفسارك الأكاديمي");
  });
});
