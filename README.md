# BookMS - AI 도서 관리 시스템

AI를 활용한 지능형 도서 검색 및 관리 시스템입니다.

## 주요 기능

- 🤖 **AI 자연어 검색**: 도서명, 저자, 내용을 자연어로 검색
- 📚 **도서 관리**: 개인 서재 관리 및 독서 기록
- 📊 **독서 통계**: 독서 패턴 분석 및 통계
- 🎯 **독서 목표**: 연간 독서 목표 설정 및 달성 추적

## AI 검색 기능

### OpenAI API 설정 (선택사항)

실제 OpenAI API를 사용한 LLM 검색을 원한다면:

1. `.env.local` 파일을 프로젝트 루트에 생성
2. 다음 내용을 추가:

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL="file:./dev.db"
```

3. OpenAI API 키를 발급받아 입력

### 검색 사용법

- **자연어 검색**: "인공지능에 대한 책", "김철수가 쓴 소설", "머신러닝 입문서"
- **위치 필터링**: 서울, 부산, 대구 지역별 검색
- **실시간 검색**: 타이핑과 동시에 AI가 검색 수행

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 데이터베이스 시드 실행
npx prisma db seed
```

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (Prisma ORM)
- **AI**: OpenAI GPT-3.5-turbo (선택사항)

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── search/          # AI 검색 API
│   ├── books/              # 도서 관련 페이지
│   ├── goals/              # 독서 목표 페이지
│   ├── statistics/         # 통계 페이지
│   └── page.tsx           # 메인 페이지
├── components/
│   └── SearchResults.tsx   # 검색 결과 컴포넌트
└── prisma/
    └── schema.prisma       # 데이터베이스 스키마
```

## AI 검색 API 엔드포인트

### POST /api/search
자연어 검색을 수행합니다.

**요청:**
```json
{
  "query": "인공지능에 대한 책",
  "location": "서울"
}
```

**응답:**
```json
{
  "results": [
    {
      "id": 1,
      "title": "인공지능과 미래사회",
      "author": "김철수",
      "genre": "과학/기술",
      "description": "AI 기술의 발전과 사회 변화에 대한 분석",
      "location": "서울",
      "available": true,
      "rating": 4.5,
      "relevance": 0.95,
      "searchHighlights": ["제목: 인공지능과 미래사회"],
      "reason": "인공지능 주제와 직접적으로 관련된 도서입니다."
    }
  ]
}
```

## 라이선스

MIT License
