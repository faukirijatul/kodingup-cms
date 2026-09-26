import type { Assignment } from "./assignment";
import type { LiveSession } from "./liveSession";

export interface DayEvents {
  liveSessions: LiveSession[];
  assignments: Assignment[];
}