import Fastify,{ FastifyRequest } from "fastify";

import {
    HeartbeatPayload,
    IncidentPayload,
    ServiceStatus,
} from "./types/service";

const app = Fastify({
  logger: true,
});

const services: Record<
  string,
  ServiceStatus
> = {};

app.post(
    "/heartbeat",
    async (
        request: FastifyRequest<{ 
            Body: HeartbeatPayload 
        }>
    ) => {
        const body = request.body;

        services[body.service] = {
            status: "healthy",
            lastSeen: Date.now(),
        };

        return { success: true };
    }
);

app.post<{ Body: IncidentPayload }>(
    "/incident", 
    async (
        request: FastifyRequest<{ 
            Body: IncidentPayload
        }>
    ) => {
    const body = request.body;

    app.log.error(body);

    services[body.service] = {
        status: "unhealthy",
        lastSeen: Date.now(),
    };

    return { success: true };
});

app.get("/health", async () => {
  return services;
});

const interval = setInterval(() => {
  const now = Date.now();

  Object.entries(services).forEach(([service, data]) => {
    const diff = now - data.lastSeen;

    if (diff > 15 * 60 * 1000) {
      services[service].status = "offline";
    }
  });
}, 60 * 1000);

const start = async () => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 3000,
    });

    console.log("Middleware running");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

const shutdown = async () => {
  clearInterval(interval);

  await app.close();

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();