export interface HeartbeatPayload {
  service: string;
}

export interface IncidentPayload {
  service: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
}

export interface ServiceStatus {
  status: "healthy" | "unhealthy" | "offline";
  lastSeen: number;
}