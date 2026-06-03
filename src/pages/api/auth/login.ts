import type { APIRoute } from 'astro';
import { signSession, verifyPassword } from '@/lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const form = await request.formData();
  const email = String(form.get('email') ?? '').toLowerCase();
  const password = String(form.get('password') ?? '');
  let role: 'admin' | 'member' | null = null;
  let hash = '';

  if (email === env.ADMIN_EMAIL) {
    hash = env.ADMIN_PASSWORD_HASH;
    role = 'admin';
  } else {
    const user = await env.DB.prepare('SELECT password_hash, role FROM users WHERE email = ?').bind(email).first<{ password_hash: string; role: 'member' }>();
    if (user) { hash = user.password_hash; role = user.role; }
  }
  if (!role || !hash || !(await verifyPassword(password, hash))) return new Response('Invalid credentials', { status: 401 });
  const token = await signSession({ email, role }, env.SESSION_SECRET);
  return new Response(null, { status: 302, headers: { Location: role === 'admin' ? '/admin' : '/posts', 'Set-Cookie': `cloudpress_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` } });
};
