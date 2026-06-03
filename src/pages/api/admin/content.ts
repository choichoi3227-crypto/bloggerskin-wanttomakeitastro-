import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { requireAdmin } from '@/lib/guards';
import { commitFile, utf8ToBase64 } from '@/lib/github';

const schema = z.object({
  title: z.string().min(1), slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  type: z.enum(['post', 'notice', 'community', 'forum', 'support']), category: z.string().min(1),
  visibility: z.enum(['public', 'members']), thumbnail: z.string().optional(), html: z.string().min(1)
});

export const POST: APIRoute = async ({ request }) => {
  const e = env as unknown as Env;
  if (!(await requireAdmin(request, e))) return Response.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues }, { status: 400 });
  const item = parsed.data;
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const frontmatter = `---\ntitle: ${JSON.stringify(item.title)}\nslug: ${JSON.stringify(item.slug)}\ntype: ${JSON.stringify(item.type)}\ncategory: ${JSON.stringify(item.category)}\nvisibility: ${JSON.stringify(item.visibility)}\nthumbnail: ${JSON.stringify(item.thumbnail ?? '')}\npublishedAt: ${JSON.stringify(now)}\n---\n\n${item.html}\n`;
  const githubPath = `content/${item.type}/${item.slug}.mdx`;
  await commitFile(e, githubPath, utf8ToBase64(frontmatter), `Publish ${item.type}: ${item.title}`);
  await e.DB.prepare('INSERT INTO contents (id, title, slug, type, category, visibility, thumbnail, html, github_path, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, item.title, item.slug, item.type, item.category, item.visibility, item.thumbnail ?? '', item.html, githubPath, now, now).run();
  return Response.json({ ok: true, id, githubPath });
};
