import { getDueDate, getLastDone, getStatus } from "./status";
import type { IntervalRule, MaintenanceItem } from "./types";

function makeItem(interval: IntervalRule, dates: string[] = []): MaintenanceItem {
  return {
    id: "item-1",
    name: "Test item",
    interval,
    history: dates.map((date, i) => ({ id: `record-${i}`, date })),
  };
}

const every12Months: IntervalRule = { type: "months", value: 12 };
const every1Month: IntervalRule = { type: "months", value: 1 };
const trackOnly: IntervalRule = { type: "none" };

describe("getLastDone", () => {
  it("returns null when there is no history", () => {
    expect(getLastDone(makeItem(every12Months))).toBeNull();
  });

  it("returns the latest date even when records are out of order", () => {
    const item = makeItem(every12Months, ["2025-03-01", "2025-12-20", "2025-06-15"]);
    expect(getLastDone(item)).toBe("2025-12-20");
  });
});

describe("getDueDate", () => {
  it("returns null when there is no history", () => {
    expect(getDueDate(makeItem(every12Months))).toBeNull();
  });

  it("returns null for track-only items", () => {
    expect(getDueDate(makeItem(trackOnly, ["2025-12-20"]))).toBeNull();
  });

  it("adds the interval in months to the last done date", () => {
    expect(getDueDate(makeItem(every12Months, ["2025-12-20"]))).toBe("2026-12-20");
  });

  it("uses the latest record", () => {
    const item = makeItem(every12Months, ["2024-01-01", "2025-12-20"]);
    expect(getDueDate(item)).toBe("2026-12-20");
  });

  it("clamps 31 Jan + 1 month to the end of February", () => {
    expect(getDueDate(makeItem(every1Month, ["2025-01-31"]))).toBe("2025-02-28");
  });

  it("clamps to 29 Feb in a leap year", () => {
    expect(getDueDate(makeItem(every1Month, ["2024-01-31"]))).toBe("2024-02-29");
  });
});

describe("getStatus", () => {
  // Last done 2025-12-20 with a 12 month interval, so due 2026-12-20.
  const item = makeItem(every12Months, ["2025-12-20"]);

  it("returns unknown when there is no history", () => {
    expect(getStatus(makeItem(every12Months), "2026-01-01")).toBe("unknown");
  });

  it("returns null for track-only items, even with history", () => {
    expect(getStatus(makeItem(trackOnly, ["2025-12-20"]), "2026-01-01")).toBeNull();
  });

  it("is ok when the due date is 31 days away", () => {
    expect(getStatus(item, "2026-11-19")).toBe("ok");
  });

  it("is due soon when the due date is exactly 30 days away", () => {
    expect(getStatus(item, "2026-11-20")).toBe("due-soon");
  });

  it("is due soon the day before the due date", () => {
    expect(getStatus(item, "2026-12-19")).toBe("due-soon");
  });

  it("is due soon on the due date itself", () => {
    expect(getStatus(item, "2026-12-20")).toBe("due-soon");
  });

  it("is overdue the day after the due date", () => {
    expect(getStatus(item, "2026-12-21")).toBe("overdue");
  });

  it("is overdue well after the due date", () => {
    expect(getStatus(item, "2027-06-01")).toBe("overdue");
  });
});