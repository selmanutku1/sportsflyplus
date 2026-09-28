import { loadStore, applyCors } from '../demo-requests.js';

export default async function streamHandler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const items = loadStore();
  const payload = JSON.stringify({
    action: 'init',
    items,
    timestamp: Date.now(),
  });

  res.write(`retry: 2500\n\nevent: sync\ndata: ${payload}\n\n`);
  res.end();
}
