import { useEffect, useState } from "react";

interface ServiceStatus {
  status: "healthy" | "unhealthy" | "offline";
  lastSeen: number;
}

function App() {
  const [services, setServices] = useState<
    Record<string, ServiceStatus>
  >({});

  const fetchHealth = async () => {
    const response = await fetch(
      "http://localhost:3000/health"
    );

    const data = await response.json();

    setServices(data);
  };

  useEffect(() => {
    fetchHealth();

    const interval = setInterval(fetchHealth, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Service Health
      </h1>

      <div className="space-y-4">
        {Object.entries(services).map(
          ([name, service]) => (
            <div
              key={name}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {name}
                </h2>

                <p className="text-zinc-400 text-sm">
                  Last seen:{" "}
                  {new Date(
                    service.lastSeen
                  ).toLocaleTimeString()}
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-lg font-medium ${
                  service.status === "healthy"
                    ? "bg-green-500/20 text-green-400"
                    : service.status ===
                      "unhealthy"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {service.status}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;