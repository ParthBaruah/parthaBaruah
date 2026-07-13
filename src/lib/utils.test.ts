import { describe, it, expect } from "vitest";
import { slugify, formatCurrency } from "./utils";

describe("Core Utility Layer Unit Operational Vectors", () => {
  describe("slugify() String Conversion Engine", () => {
    it("converts uppercase alpha text strings into clean slug handles", () => {
      expect(slugify("Hello World SaaS Target")).toBe("hello-world-saas-target");
    });

    it("strips custom regex expressions or symbol entities safely", () => {
      expect(slugify("Brand & Co. Pro!!")).toBe("brand-co-pro");
    });
  });

  describe("formatCurrency() Number Conversions", () => {
    it("converts regular integer expressions into stylized money fields", () => {
      expect(formatCurrency(29)).toContain("$29.00");
    });
  });
});
