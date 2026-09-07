# ✂️ SubSlash — 구독, 끊을 용기

> 매달 빠져나가는 구독료, 정말 그만한 가치가 있을까요?

**SubSlash**는 구독 서비스의 실제 가치를 추적하고, 불필요한 결제를 즉시 차단(해지)하도록 돕는 **능동형 구독 디톡스 웹 서비스**입니다.

## 🎯 핵심 기능

### 1. 💰 1회 사용 단가(Cost-Per-Use) 체감 엔진

- 결제일 3일 전, 단 하나의 질문: **"지난 30일 동안 몇 번 이용하셨나요?"**
- 충격 요법 UI: `"이번 달 영화 1편을 ₩17,000에 보셨습니다"`
- 가성비 신호등: 🟢 유지 · 🟡 주의 · 🔴 해지 권고

### 2. 🔪 1초 해지 직통 링크 (Kill-Switch)

- 국내 주요 20+ 구독 서비스의 해지 페이지 다이렉트 URL
- 다크 패턴 탈출 30초 가이드

### 3. 📊 방어 자산(Saved Pot) 시각화

- 해지 완료 구독의 연간 절약 금액 누적
- "이 돈으로 해외 여행 1회를 갈 수 있어요!" 성취감 극대화

## 🏗️ 기술 스택

| 영역       | 기술                         |
| ---------- | ---------------------------- |
| 프레임워크 | Next.js 15 (App Router)      |
| 스타일링   | Tailwind CSS 4               |
| 상태관리   | Zustand + localStorage       |
| DB         | Turso (libSQL) + Drizzle ORM |
| 알림       | Resend (이메일) + Web Push   |
| 배포       | Vercel (서버리스)            |
| 모노레포   | Turborepo + pnpm             |
| 테스트     | Vitest + Playwright          |

## 📁 프로젝트 구조

```
subslash/
├── apps/web/          # Next.js 웹 앱 (PWA)
│   ├── app/           # App Router 페이지 & API (/, /dashboard, /subs, /savings, /share)
│   ├── components/    # UI 컴포넌트
│   ├── lib/           # 스토어, DB, 유틸
│   └── hooks/         # React 커스텀 훅
├── packages/shared/   # 공유 타입, 유틸, 상수
└── (harness)          # Turborepo, ESLint, Husky, CI/CD
```

> 금액 합산은 `@subslash/shared`의 `sumMonthlyKRW` / `sumAnnualKRW`를 사용합니다.
> USD 구독과 연간 결제 구독을 월/연 단위 원화로 환산해 더하므로, 새 합산 로직을
> 직접 `reduce`로 작성하지 말고 이 헬퍼를 재사용하세요.

## 🚀 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 9+

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버 시작
pnpm dev
```

### 테스트

```bash
# 단위/통합 테스트
pnpm test

# E2E 테스트 (최초 1회: npx playwright install chromium)
pnpm test:e2e

# 린트 & 타입체크
pnpm turbo lint typecheck
```

## 🌟 Zero-Friction 온보딩

회원가입 없이 바로 시작합니다:

1. 첫 방문 시 구독 3개를 즉시 등록
2. 브라우저 localStorage에 데이터 저장
3. 알림이 필요할 때만 이메일 입력

## 📱 PWA 지원

- 모바일 홈 화면 추가 가능
- Android: Share Target API로 외부 앱에서 바로 구독 등록
- iOS: 클립보드 자동 감지로 대체

## 📄 라이선스

MIT
