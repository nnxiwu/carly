export type IntervalRule =
  | {
      type: "months";
      value: number;
    }
  | { type: "none" };

export type ServiceRecord = {
  id: string;
  date: string; // "YYYY-MM-DD"
  notes?: string;
};

export type MaintenanceItem = {
  id: string;
  name: string;
  interval: IntervalRule;
  history: ServiceRecord[];
  careNote?: string;
};

export type Status = "ok" | "due-soon" | "overdue" | "unknown";
