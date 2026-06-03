export async function commitFile(env: Env, path: string, contentBase64: string, message: string) {
  if (!env.GITHUB_TOKEN || env.GITHUB_OWNER.startsWith('REPLACE_') || env.GITHUB_REPO.startsWith('REPLACE_')) {
    throw new Error('GitHub 저장을 위해 GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH 설정이 필요합니다.');
  }
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
  const headers = {
    authorization: `Bearer ${env.GITHUB_TOKEN}`,
    accept: 'application/vnd.github+json',
    'user-agent': 'cloudpress-worker'
  };
  const existing = await fetch(`${url}?ref=${env.GITHUB_BRANCH}`, { headers });
  const sha = existing.ok ? ((await existing.json()) as { sha?: string }).sha : undefined;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify({ message, content: contentBase64, branch: env.GITHUB_BRANCH, sha })
  });
  if (!response.ok) throw new Error(`GitHub commit failed: ${response.status} ${await response.text()}`);
  return response.json();
}

export function utf8ToBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
