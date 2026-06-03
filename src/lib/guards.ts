import { readSession } from './auth';

export async function requireAdmin(request: Request, env: Env) {
  const session = await readSession(request.headers.get('cookie'), env.SESSION_SECRET);
  return session?.role === 'admin' ? session : null;
}
