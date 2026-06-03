export {};
const form = document.querySelector<HTMLFormElement>('#subsidyForm');
const results = document.querySelector<HTMLDivElement>('#subsidyResults');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!results) return;
  const query = new FormData(form).get('query');
  results.innerHTML = '<div class="subsidy-card">실시간 수집 중입니다...</div>';
  const response = await fetch(`/api/admin/subsidies/search?q=${encodeURIComponent(String(query ?? ''))}`);
  const payload = await response.json() as { items?: Array<Record<string, string>>; error?: string; source?: string };
  if (!response.ok) {
    results.innerHTML = `<div class="subsidy-card"><strong>설정 필요</strong><p>${payload.error ?? '검색에 실패했습니다.'}</p></div>`;
    return;
  }
  results.innerHTML = (payload.items ?? []).map((item) => `
    <article class="subsidy-card">
      <span class="eyebrow">${payload.source ?? '공공데이터'}</span>
      <h3>${item.title ?? item.serviceName ?? '제목 없음'}</h3>
      <p>${item.summary ?? item.description ?? ''}</p>
      <p><strong>기관:</strong> ${item.department ?? item.organization ?? '확인 필요'} · <strong>신청:</strong> ${item.application ?? '공식 페이지 확인'}</p>
      ${item.url ? `<a class="cta secondary" href="${item.url}" target="_blank" rel="noopener noreferrer">공식 링크 확인</a>` : ''}
    </article>`).join('') || '<div class="subsidy-card">검색 결과가 없습니다.</div>';
});
