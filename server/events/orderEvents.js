import { EventEmitter } from "node:events";

const orderEvents = new EventEmitter();
orderEvents.setMaxListeners(50);

const sseClients = new Map();

function toSseFormat(event, data) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  return `event: ${event}\ndata: ${payload}\n\n`;
}

function addSseClient(clientId, res) {
  sseClients.set(clientId, res);
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("\n");
}

function removeSseClient(clientId) {
  const res = sseClients.get(clientId);
  if (res) {
    try {
      res.end();
    } catch (error) {
      console.error("Error closing SSE client:", error);
    }
    sseClients.delete(clientId);
  }
}

function broadcast(event, payload) {
  const message = toSseFormat(event, payload);
  for (const [clientId, res] of sseClients.entries()) {
    try {
      res.write(message);
    } catch (error) {
      console.error(`Failed to write to SSE client ${clientId}:`, error);
      removeSseClient(clientId);
    }
  }
}

orderEvents.on("notification:new", (payload) => {
  broadcast("notification:new", payload);
});

orderEvents.on("notification:update", (payload) => {
  broadcast("notification:update", payload);
});

export { orderEvents, addSseClient, removeSseClient };
