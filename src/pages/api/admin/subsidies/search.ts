import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { requireAdmin } from '@/lib/guards';

function normalizeItem(raw: Record<string, unknown>) {
  return {
    title: String(raw.servNm ?? raw.serviceName ?? raw.title ?? raw.svcNm ?? '제목 확인 필요'),
    summary: String(raw.servDgst ?? raw.description ?? raw.svcDgst ?? raw.summary ?? ''),
    department: String(raw.jurMnofNm ?? raw.department ?? raw.organization ?? raw.svcInstNm ?? ''),
    application: String(raw.aplyMtdNm ?? raw.application ?? raw.svcUseMtdNm ?? ''),
    url: String(raw.servDtlLink ?? raw.url ?? raw.link ?? '')
  };
}

export const GET: APIRoute = async ({ request }) => {
  const e = env as unknown as Env;
  const session = await requireAdmin(request, e);
  if (!session) return Response.json({ error: '관리자만 지원금 실시간 검색을 사용할 수 있습니다.' }, { status: 403 });
  const q = new URL(request.url).searchParams.get('q')?.trim() || '청년';
  if (!e.DATA_GO_KR_API_KEY) {
    return Response.json({ error: 'DATA_GO_KR_API_KEY secret이 필요합니다. 공공데이터포털 보조금24 수혜서비스 목록 API 서비스키를 설정하면 실제 데이터를 실시간으로 수집합니다.' }, { status: 503 });
  }
  const endpoint = new URL('https://api.odcloud.kr/api/gov24/v3/serviceList');
  endpoint.searchParams.set('page', '1');
  endpoint.searchParams.set('perPage', '20');
  endpoint.searchParams.set('serviceKey', e.DATA_GO_KR_API_KEY);
  endpoint.searchParams.set('cond[서비스명::LIKE]', q);
  const upstream = await fetch(endpoint, { headers: { accept: 'application/json' } });
  if (!upstream.ok) return Response.json({ error: `공공데이터 호출 실패: ${upstream.status}` }, { status: 502 });
  const data = await upstream.json() as { data?: Array<Record<string, unknown>> };
  const items = (data.data ?? []).map(normalizeItem);
  await e.DB.prepare('INSERT INTO subsidy_cache (id, query, source, payload, fetched_at) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), q, '공공데이터포털 보조금24 수혜서비스 목록', JSON.stringify(items), new Date().toISOString()).run();
  return Response.json({ source: '공공데이터포털 보조금24', items });
};
