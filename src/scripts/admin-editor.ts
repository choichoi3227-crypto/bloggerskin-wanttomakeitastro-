export {};
const editor = document.querySelector<HTMLTextAreaElement>('#htmlEditor');
const preview = document.querySelector<HTMLDivElement>('#editorPreview');
const toolbar = document.querySelector<HTMLDivElement>('.toolbar');

function syncPreview() {
  if (editor && preview) preview.innerHTML = editor.value;
}
function insertSnippet(snippet: string) {
  if (!editor) return;
  const start = editor.selectionStart;
  editor.value = `${editor.value.slice(0, start)}${snippet}${editor.value.slice(editor.selectionEnd)}`;
  editor.focus();
  editor.selectionStart = editor.selectionEnd = start + snippet.length;
  syncPreview();
}
const snippets: Record<string, string> = {
  h1: '<h1>큰 제목</h1>', h2: '<h2>중간 제목</h2>', h3: '<h3>소제목</h3>',
  ul: '<ul><li>첫 번째 항목</li><li>두 번째 항목</li></ul>',
  table: '<table><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody><tr><td>대상</td><td>내용</td></tr></tbody></table>',
  button: '<a class="content-button" href="#">버튼 링크</a>',
  mark: '<mark>하이라이트 문장</mark>',
  link: '<a href="https://www.gov.kr" rel="noopener noreferrer" target="_blank">공식 링크</a>',
  image: '<figure><img src="/images/og-cloudpress.svg" alt="설명" /><figcaption>이미지 설명</figcaption></figure>'
};
toolbar?.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-command]');
  if (!button) return;
  insertSnippet(snippets[button.dataset.command ?? ''] ?? '');
});
editor?.addEventListener('input', syncPreview);

document.querySelector<HTMLButtonElement>('#uploadButton')?.addEventListener('click', async () => {
  const input = document.querySelector<HTMLInputElement>('#mediaUpload');
  const file = input?.files?.[0];
  if (!file) return alert('업로드할 파일을 선택하세요.');
  const body = new FormData();
  body.set('file', file);
  const res = await fetch('/api/admin/github/upload', { method: 'POST', body });
  const json = await res.json() as { path?: string; error?: string };
  if (!res.ok) return alert(json.error ?? '업로드 실패');
  const thumb = document.querySelector<HTMLInputElement>('#editorThumbnail');
  if (thumb && json.path) thumb.value = `/${json.path}`;
});

document.querySelector<HTMLButtonElement>('#publishButton')?.addEventListener('click', async () => {
  const payload = {
    title: document.querySelector<HTMLInputElement>('#editorTitle')?.value,
    slug: document.querySelector<HTMLInputElement>('#editorSlug')?.value,
    type: document.querySelector<HTMLSelectElement>('#editorType')?.value,
    category: document.querySelector<HTMLInputElement>('#editorCategory')?.value,
    visibility: document.querySelector<HTMLSelectElement>('#editorVisibility')?.value,
    thumbnail: document.querySelector<HTMLInputElement>('#editorThumbnail')?.value,
    html: editor?.value
  };
  const res = await fetch('/api/admin/content', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  const json = await res.json() as { ok?: boolean; error?: string };
  alert(res.ok ? '게시 요청이 저장되었습니다.' : (json.error ?? '게시 실패'));
});
