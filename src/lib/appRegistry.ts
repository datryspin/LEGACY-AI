/** User-added apps that LEGACY can launch (web apps, deep links, local protocols). */

export interface LegacyApp {
  id: string;
  name: string;
  url: string;
  emoji: string;
  addedAt: number;
}

const KEY = "legacy.apps";

export function listApps(): LegacyApp[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addApp(app: Omit<LegacyApp, "id" | "addedAt">): LegacyApp {
  const next: LegacyApp = { ...app, id: crypto.randomUUID(), addedAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify([...listApps(), next]));
  return next;
}

export function removeApp(id: string) {
  localStorage.setItem(KEY, JSON.stringify(listApps().filter((a) => a.id !== id)));
}

export function launchApp(app: LegacyApp) {
  window.open(app.url, "_blank", "noopener,noreferrer");
}
