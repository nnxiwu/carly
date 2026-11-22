import { max, parseISO, addMonths, format, differenceInCalendarDays } from "date-fns";
import { MaintenanceItem, Status } from "./types";

export const DUE_SOON_DAYS = 30;

export function getLastDone(item: MaintenanceItem): string | null {
  const histories = item.history;
  const dates = histories.map((history) => history.date);
  if (dates.length !== 0) {
    const parsedDates = dates.map((d) => parseISO(d));
    return format(max(parsedDates), "yyyy-MM-dd");
  }
  return null;
}

export function getDueDate(item: MaintenanceItem): string | null {
  if (item.interval.type === "none") return null;

  const lastDoneDate = getLastDone(item);
  if (!lastDoneDate) return null;

  const monthInterval = item.interval.value;
  const parsedDueDate = parseISO(lastDoneDate);
  const dueDate = addMonths(parsedDueDate, monthInterval);
  return format(dueDate, "yyyy-MM-dd")
}

export function getStatus(item: MaintenanceItem, today: string): Status | null {
  if (item.interval.type === "none") return null;
  const dueDate = getDueDate(item);
  if (!dueDate) return "unknown";
  const parsedDueDate = parseISO(dueDate)
  const parsedToday = parseISO(today)
  const daysUntilDue = differenceInCalendarDays(parsedDueDate, parsedToday)

  switch (true) {
    case daysUntilDue < 0:
      return "overdue";
    case daysUntilDue <= DUE_SOON_DAYS:
      return "due-soon";
    default:
      return "ok"
  }
}