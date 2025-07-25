# 당근마켓 클론 프로젝트

## 📱 프로젝트 소개

당근마켓을 클론한 웹 애플리케이션입니다. 중고거래, 커뮤니티, 채팅 기능을 포함한 풀스택 웹앱입니다.

## 🛠 기술 스택

- **Frontend**: Next.js 15.3.2, TypeScript, Tailwind CSS
- **Backend**: Next.js App Router, Server Actions
- **Database**: Prisma
- **Authentication**: Iron Session
- **Image Upload**: Cloudflare Images
- **Real-time Chat**: Supabase Realtime
- **Deployment**: Vercel

## 🚀 주요 기능

- 🔐 사용자 인증 (GitHub OAuth)
- 📦 상품 등록 및 관리
- 💬 실시간 채팅
- 📝 커뮤니티 게시글
- 🔍 상품 검색
- 👤 사용자 프로필 관리
- 📱 PWA 지원 (모바일 웹앱)

## 🏃‍♂️ 시작하기

### 1. 저장소 클론

```bash
git clone [repository-url]
cd carrot-market-clone
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
DATABASE_URL="file:./dev.db"
IRON_SECRET="your-secret-key"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
CLOUDFLARE_API_KEY="your-cloudflare-api-key"
```

### 4. 데이터베이스 설정

```bash
npx prisma generate
npx prisma db push
```

### 5. 개발 서버 실행

```bash
npm run dev
```

### 6. Prisma Studio 실행 (선택사항)

```bash
npx prisma studio
```

## 📁 프로젝트 구조

```
carrot-market-clone/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (tabs)/            # 메인 탭 페이지들
│   ├── add-products/      # 상품 등록
│   ├── products/          # 상품 상세
│   ├── chats/             # 채팅 기능
│   └── posts/             # 커뮤니티 게시글
├── components/            # 재사용 가능한 컴포넌트
├── lib/                   # 유틸리티 및 설정
├── prisma/               # 데이터베이스 스키마
└── public/               # 정적 파일
```

## 🚀 배포

### Vercel 배포

```bash
vercel --prod
```

### 환경 변수 업데이트

```bash
vercel env pull .env.local
```

## 📝 개발 노트

- **컴포넌트화**: 재사용 가능한 컴포넌트로 구성하여 유지보수성 향상
- **PWA 지원**: 모바일 웹앱으로 설치 가능
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **실시간 기능**: Supabase를 통한 실시간 채팅

## 🔧 데이터베이스 관리

- 스키마 변경 시: `npx prisma migrate dev`
- Prisma Studio 재시작 필요

## 📱 모바일 지원

현재 PWA로 구성되어 있어 모바일에서도 네이티브 앱처럼 사용할 수 있습니다.
