# 클라우드프레스

블로그스팟 XML 스킨을 Astro + TypeScript + 분리 CSS + Cloudflare D1/Worker 구조로 재구성한 정책 콘텐츠 플랫폼입니다. 기존 XML의 외부 스크립트 의존과 특정 제작자 흔적은 신규 코드에 포함하지 않았습니다.

## 핵심 구조

- `src/pages`: Astro 페이지, SEO 메타, 관리자/회원 화면
- `src/styles/global.css`: 70% 딥 틸, 20% 웜 앰버, 10% 퍼플 액센트 색상 시스템
- `src/pages/api`: Cloudflare Worker 런타임 API, 인증, D1, GitHub 저장, WebSocket
- `migrations`: Cloudflare D1 스키마
- `wrangler.toml`: Cloudflare 배포 설정

## 배포 순서

1. 의존성 설치: `npm install`
2. D1 생성 후 `wrangler.toml`의 `database_id` 교체
3. 관리자 비밀번호 해시 생성: `ADMIN_PASSWORD="비밀번호" npm run admin:hash`
4. Secret 등록:
   - `wrangler secret put ADMIN_PASSWORD_HASH`
   - `wrangler secret put SESSION_SECRET`
   - `wrangler secret put DATA_GO_KR_API_KEY`
   - `wrangler secret put GITHUB_TOKEN`
5. GitHub 저장소 변수 설정: `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`, `GITHUB_IMAGE_DIR`
6. D1 마이그레이션: `npm run db:migrate:remote`
7. 빌드 및 배포: `npm run build && npm run deploy`

## 정부지원금 데이터 정책

지원금 검색 UI와 API는 `/admin` 관리자 화면에만 있습니다. 실제 사용자 페이지에는 지원금 원천 검색 버튼과 원천 결과를 노출하지 않습니다. 공공데이터포털 서비스키가 설정되면 서버 API가 보조금24 수혜서비스 목록을 호출해 실시간으로 수집하고 D1에 캐시합니다.

## 저장 정책

R2는 사용하지 않습니다. 관리자 에디터에서 생성한 콘텐츠와 이미지/미디어 파일은 GitHub Contents API로 저장소에 커밋됩니다.
