import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { requireAdmin } from '@/lib/guards';
import { commitFile } from '@/lib/github';

export const POST: APIRoute = async ({ request }) => {
  const e = env as unknown as Env;
  if (!(await requireAdmin(request, e))) return Response.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return Response.json({ error: '파일이 없습니다.' }, { status: 400 });
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  const path = `${e.GITHUB_IMAGE_DIR || 'images'}/${Date.now()}-${safeName}`;
  const buffer = await file.arrayBuffer();
  const binary = [...new Uint8Array(buffer)].map((byte) => String.fromCharCode(byte)).join('');
  await commitFile(e, path, btoa(binary), `Upload media: ${safeName}`);
  return Response.json({ ok: true, path });
};
