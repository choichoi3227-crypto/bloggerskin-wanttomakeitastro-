export type ContentType = 'post' | 'notice' | 'community' | 'forum';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  type: ContentType;
  category: string;
  visibility: 'public' | 'members';
  thumbnail?: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  html: string;
  tags: string[];
}

export const initialContent: ContentItem[] = [
  {
    id: 'notice-launch',
    title: '클라우드프레스 운영 원칙과 콘텐츠 이용 안내',
    slug: 'cloudpress-launch-policy',
    excerpt: '클라우드프레스는 검증된 생활 정책 정보와 커뮤니티형 게시판을 분리해 제공하며, 정부지원금 실시간 검색은 관리자 검수 전용으로 운영됩니다.',
    type: 'notice',
    category: '운영공지',
    visibility: 'public',
    thumbnail: '/images/og-cloudpress.svg',
    publishedAt: '2026-06-02T00:00:00.000Z',
    author: '클라우드프레스 편집팀',
    tags: ['운영정책', '공지', '검수'],
    html: '<h2>정부지원금 정보는 관리자 검수 후 게시됩니다</h2><p>관리자 화면에서 공공데이터포털 기반 보조금 정보를 실시간으로 조회하고, 사실 확인을 거친 뒤 공개 게시글·공지·커뮤니티 안내로 전환합니다.</p><p>비로그인 사용자는 공개 콘텐츠만 볼 수 있고, 회원은 전체 게시글과 커뮤니티·포럼에 접근할 수 있습니다.</p>'
  },
  {
    id: 'post-guide-2026',
    title: '2026년 정책 정보 확인 전 반드시 점검할 5가지',
    slug: 'policy-checklist-2026',
    excerpt: '신청 대상, 기준일, 담당 기관, 제출 서류, 마감일을 먼저 확인하면 정책 정보 오해를 줄일 수 있습니다.',
    type: 'post',
    category: '정책가이드',
    visibility: 'public',
    thumbnail: '/images/og-cloudpress.svg',
    publishedAt: '2026-06-02T01:00:00.000Z',
    author: '클라우드프레스 편집팀',
    tags: ['정책가이드', '체크리스트', 'SEO'],
    html: '<h2>정책 정보는 기준일 확인이 핵심입니다</h2><ul><li>공고일과 신청 마감일을 구분하세요.</li><li>거주지·연령·소득 기준을 확인하세요.</li><li>공식 신청 링크에서 최종 조건을 재확인하세요.</li></ul><p><mark>클라우드프레스는 검수된 콘텐츠와 관리자 전용 실시간 수집 영역을 분리합니다.</mark></p>'
  },
  {
    id: 'forum-ops',
    title: '사이트 장애 및 개선 제안 접수 안내',
    slug: 'site-issue-feedback',
    excerpt: '서비스 장애, 접근성 문제, 광고 배치 개선, 콘텐츠 정정 요청은 포럼에서 접수합니다.',
    type: 'forum',
    category: '사이트개선',
    visibility: 'members',
    thumbnail: '/images/og-cloudpress.svg',
    publishedAt: '2026-06-02T02:00:00.000Z',
    author: '클라우드프레스 운영자',
    tags: ['포럼', '개선', '문의'],
    html: '<h2>회원 전용 포럼</h2><p>장애 제보와 개선 제안은 운영자가 확인 후 우선순위를 지정합니다.</p><table><thead><tr><th>분류</th><th>예시</th></tr></thead><tbody><tr><td>장애</td><td>로그인 실패, 페이지 오류</td></tr><tr><td>개선</td><td>검색 UI, 접근성, 광고 위치</td></tr></tbody></table>'
  }
];

export function getContentByType(type?: ContentType) {
  return initialContent
    .filter((item) => !type || item.type === type)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function getContentBySlug(slug: string) {
  return initialContent.find((item) => item.slug === slug);
}
