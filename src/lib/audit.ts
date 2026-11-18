/**
 * Audit trail — a visible record of every sensitive thing LEGACY does.
 * Written locally first (works offline) and mirrored to the cloud when signed in.
 */
import { supabase } from "@/integrations/supabase/client";

export type AuditKind =
  | "permission"
  | "tool"
  | "call"
  | "message"
  | "auth"
  | "wipe"
  | "security";

export interface AuditEvent {
  id: string;
  kind: AuditKind;
  summary: string;
  detail?: Record<string, unknown>;
  at: number;
  synced?: boolean;
}

const KEY = "legacy.audit.v1";
const MAX = 500;

export function loadAudit(): AuditEvent[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as AuditEvent[];
  } catch {
    return [];
  }
}

function write(all: AuditEvent[]) {
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, MAX)));
  window.dispatchEvent(new Event("legacy:audit"));
}

export function audit(kind: AuditKind, summary: string, detail?: Record<string, unknown>): AuditEvent {
  const event: AuditEvent = { id: crypto.randomUUID(), kind, summary, detail, at: Date.now() };
  const all = loadAudit();
  all.unshift(event);
  write(all);
  void mirror(event);
  return event;
}

async function mirror(event: AuditEvent) {
  if (supabase === null) return;
  try {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user?.id;
    if (!uid) return;
    const { error } = await supabase.from("audit_events").insert({
      user_id: uid,
      kind: event.kind,
      summary: event.summary,
      detail: (event.detail ?? {}) as never,
    });
    if (!error) {
      write(loadAudit().map((e) => (e.id === event.id ? { ...e, synced: true } : e)));
    }
  } catch {
    /* offline — the local record still stands */
  }
}

export function clearAudit() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("legacy:audit"));
}

/** Nuke every trace of the operator on this device (and the cloud copy if signed in). */
export async function wipeEverything(includeCloud = true) {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("legacy"));
  for (const k of keys) localStorage.removeItem(k);

  if (includeCloud && supabase !== null) {
    try {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id;
      if (uid) {
        await supabase.from("messages").delete().eq("user_id", uid);
        await supabase.from("conversations").delete().eq("user_id", uid);
        await supabase.from("audit_events").delete().eq("user_id", uid);
      }
    } catch {
      /* best effort */
    }
  }

  window.dispatchEvent(new Event("legacy:audit"));
  window.dispatchEvent(new Event("legacy:transcript"));
  window.dispatchEvent(new CustomEvent("legacy:memory-updated"));
  audit("wipe", "Operator wiped all local data", { cloud: includeCloud });
}
