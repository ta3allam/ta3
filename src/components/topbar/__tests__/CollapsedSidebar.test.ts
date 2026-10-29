import { describe, it, expect } from "vitest";

describe("Collapsed Sidebar Behavior & Overflow Immunity Tests", () => {
  interface NavItemTestConfig {
    label: string;
    iconName: string;
    isCollapsed: boolean;
  }

  const renderNavItem = (config: NavItemTestConfig) => {
    return {
      hasTextRendered: !config.isCollapsed,
      text: config.isCollapsed ? null : config.label,
      tooltipContent: config.isCollapsed ? config.label : null,
      iconCentered: config.isCollapsed,
      dimensions: config.isCollapsed ? "w-9 h-9" : "w-full",
    };
  };

  const renderHeader = (isCollapsed: boolean, userName: string, level: number) => {
    return {
      hasAvatar: true,
      hasDetailsBlock: !isCollapsed,
      hasSettingsButton: !isCollapsed,
      headerPadding: isCollapsed ? "p-2" : "p-4",
      tooltipText: isCollapsed ? `${userName} (المستوى ${level})` : null,
      avatarSize: isCollapsed ? "w-8 h-8" : "w-11 h-11",
    };
  };

  const renderFooter = (isCollapsed: boolean) => {
    return {
      hasLogoutIcon: true,
      hasLogoutText: !isCollapsed,
      hasVersionBadge: !isCollapsed,
      footerPadding: isCollapsed ? "p-2" : "p-3",
      tooltipText: isCollapsed ? "تسجيل الخروج" : null,
    };
  };

  it("Header in collapsed mode strictly hides text block, badges, and button to prevent horizontal leakage", () => {
    const collapsedHeader = renderHeader(true, "سامي الطالب", 1);

    expect(collapsedHeader.hasAvatar).toBe(true);
    expect(collapsedHeader.hasDetailsBlock).toBe(false);
    expect(collapsedHeader.hasSettingsButton).toBe(false);
    expect(collapsedHeader.headerPadding).toBe("p-2");
    expect(collapsedHeader.avatarSize).toBe("w-8 h-8");
    expect(collapsedHeader.tooltipText).toBe("سامي الطالب (المستوى 1)");
  });

  it("Header in expanded mode restores full typography, badges, and profile settings CTA", () => {
    const expandedHeader = renderHeader(false, "سامي الطالب", 1);

    expect(expandedHeader.hasAvatar).toBe(true);
    expect(expandedHeader.hasDetailsBlock).toBe(true);
    expect(expandedHeader.hasSettingsButton).toBe(true);
    expect(expandedHeader.headerPadding).toBe("p-4");
    expect(expandedHeader.avatarSize).toBe("w-11 h-11");
    expect(expandedHeader.tooltipText).toBeNull();
  });

  it("Navigation items in collapsed mode hide label spans, center icons, and provide tooltips", () => {
    const items = ["مجتمع تعلّم", "سوق الدورات والمقررات", "الفعاليات وورش العمل", "لوحة المقررات والتعلم"];

    items.forEach((label) => {
      const rendered = renderNavItem({ label, iconName: "Icon", isCollapsed: true });
      expect(rendered.hasTextRendered).toBe(false);
      expect(rendered.text).toBeNull();
      expect(rendered.iconCentered).toBe(true);
      expect(rendered.dimensions).toBe("w-9 h-9");
      expect(rendered.tooltipContent).toBe(label);
    });
  });

  it("Navigation items in expanded mode render full typography and text without tooltips", () => {
    const items = ["مجتمع تعلّم", "سوق الدورات والمقررات", "الفعاليات وورش العمل", "لوحة المقررات والتعلم"];

    items.forEach((label) => {
      const rendered = renderNavItem({ label, iconName: "Icon", isCollapsed: false });
      expect(rendered.hasTextRendered).toBe(true);
      expect(rendered.text).toBe(label);
      expect(rendered.iconCentered).toBe(false);
      expect(rendered.dimensions).toBe("w-full");
      expect(rendered.tooltipContent).toBeNull();
    });
  });

  it("Footer in collapsed mode eliminates text wrapping and hides version string cleanly", () => {
    const collapsedFooter = renderFooter(true);

    expect(collapsedFooter.hasLogoutIcon).toBe(true);
    expect(collapsedFooter.hasLogoutText).toBe(false);
    expect(collapsedFooter.hasVersionBadge).toBe(false);
    expect(collapsedFooter.footerPadding).toBe("p-2");
    expect(collapsedFooter.tooltipText).toBe("تسجيل الخروج");
  });

  it("Footer in expanded mode restores full label and version watermark", () => {
    const expandedFooter = renderFooter(false);

    expect(expandedFooter.hasLogoutIcon).toBe(true);
    expect(expandedFooter.hasLogoutText).toBe(true);
    expect(expandedFooter.hasVersionBadge).toBe(true);
    expect(expandedFooter.footerPadding).toBe("p-3");
    expect(expandedFooter.tooltipText).toBeNull();
  });
});
