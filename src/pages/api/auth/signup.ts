import type { APIRoute } from 'astro';
import { hashPassword, signSession } from '@/lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const form = await request.formData();
  const email = String(form.get('email') ?? '').toLowerCase();
  const password = String(form.get('password') ?? '');
  if (!email.includes('@') || password.length < 10) return new Response('Invalid signup data', { status: 400 });
  const passwordHash = await hashPassword(password);
  await env.DB.prepare('INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), email, passwordHash, 'member', new Date().toISOString()).run();
  const token = await signSession({ email, role: 'member' }, env.SESSION_SECRET);
  return new Response(null, { status: 302, headers: { Location: '/posts', 'Set-Cookie': `cloudpress_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` } });
};
