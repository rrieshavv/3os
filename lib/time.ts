export function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatDate(date: Date) {
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function formatMenuBarDate(date: Date) {
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export function formatMonth(date: Date) {
  return date.toLocaleDateString([], { month: "long", year: "numeric" });
}
