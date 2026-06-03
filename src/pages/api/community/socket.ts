import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
  const pair = new WebSocketPair();
  const [client, server] = Object.values(pair);
  server.accept();
  server.send('클라우드프레스 커뮤니티에 연결되었습니다.');
  server.addEventListener('message', (event: MessageEvent) => {
    const text = String(event.data).slice(0, 500);
    server.send(`나: ${text}`);
  });
  return new Response(null, { status: 101, webSocket: client } as ResponseInit & { webSocket: WebSocket });
};
