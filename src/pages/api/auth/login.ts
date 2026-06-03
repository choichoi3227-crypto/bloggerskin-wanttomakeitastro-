import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { signSession, verifyPassword } from '@/lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const e = env as unknown as Env;
  const form = await request.formData();
  const email = String(form.get('email') ?? '').toLowerCase();
  const password = String(form.get('password') ?? '');
  let role: 'admin' | 'member' | null = null;
  let hash = '';

  if (email === e.ADMIN_EMAIL) {
    hash = e.ADMIN_PASSWORD_HASH;
    role = 'admin';
  } else {
    const user = await e.DB.prepare('SELECT password_hash, role FROM users WHERE email = ?').bind(email).first<{ password_hash: string; role: 'member' }>();
    if (user) { hash = user.password_hash; role = user.role; }
  }
  if (!role || !hash || !(await verifyPassword(password, hash))) return new Response('Invalid credentials', { status: 401 });
  const token = await signSession({ email, role }, e.SESSION_SECRET);
  return new Response(null, { status: 302, headers: { Location: role === 'admin' ? '/admin' : '/posts', 'Set-Cookie': `cloudpress_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` } });
};
