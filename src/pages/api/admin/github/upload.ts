import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/guards';
import { commitFile } from '@/lib/github';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  if (!(await requireAdmin(request, env))) return Response.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return Response.json({ error: '파일이 없습니다.' }, { status: 400 });
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
  const path = `${env.GITHUB_IMAGE_DIR || 'images'}/${Date.now()}-${safeName}`;
  const buffer = await file.arrayBuffer();
  const binary = [...new Uint8Array(buffer)].map((byte) => String.fromCharCode(byte)).join('');
  await commitFile(env, path, btoa(binary), `Upload media: ${safeName}`);
  return Response.json({ ok: true, path });
};
