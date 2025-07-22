import { WebSocketServer, WebSocket } from 'ws';

export const clients = new Set<WebSocket>();

type ThresholdRange = { min: number; max: number };

let thresholds: Record<string, ThresholdRange> = {
  temperature: { min: 10, max: 40 },
  ph: { min: 6.5, max: 8.0 },
  conductivity: { min: 0.5, max: 2.5 },
  level: { min: 10, max: 100 }
};

export const setupWebSocket = (server: import('http').Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.send(JSON.stringify({ type: 'connected', message: 'Conectado al sistema de alertas' }));

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  return wss;
};

export const broadcastAlert = (alertData: any) => {
  const message = JSON.stringify({ type: 'alert', ...alertData });
  for (const client of clients) client.send(message);
};

export const updateThresholds = (newThresholds: Partial<Record<string, ThresholdRange>>) => {
  for (const key in newThresholds) {
    if (thresholds[key]) {
      thresholds[key] = {
        min: newThresholds[key]!.min ?? thresholds[key].min,
        max: newThresholds[key]!.max ?? thresholds[key].max,
      };
    }
  }
};

export const getThresholds = () => thresholds;
