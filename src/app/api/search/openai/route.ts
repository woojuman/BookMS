import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// OpenAI API 키는 환경변수에서 가져옵니다
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// AI 응답에서 relevant_books의 타입 정의
interface AIRelevantBook {
  book_id: string;
  relevance_score: number;
  reason: string;
  search_highlights?: string[];
}

// 시뮬레이션 및 검색 결과용 Book 타입 정의
interface SearchBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  location: string;
  available: boolean;
  rating: number;
  coverImage: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query, location } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "검색어가 필요합니다." },
        { status: 400 }
      );
    }

    if (!OPENAI_API_KEY) {
      // OpenAI API 키가 없으면 시뮬레이션된 검색을 수행
      console.warn(
        "OpenAI API 키가 설정되지 않았습니다. 시뮬레이션된 검색을 수행합니다."
      );
      const searchResults = await performSimulatedSearch(query, location);
      return NextResponse.json({ results: searchResults });
    }

    // OpenAI API를 사용한 실제 LLM 검색
    const searchResults = await performOpenAISearch(query, location);
    return NextResponse.json({ results: searchResults });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

async function performOpenAISearch(query: string, location: string) {
  try {
    // 먼저 데이터베이스에서 모든 도서 정보를 가져옵니다
    const books = await prisma.book.findMany();

    if (books.length === 0) {
      // 데이터베이스에 도서가 없으면 시뮬레이션된 데이터를 사용
      return await performSimulatedSearch(query, location);
    }

    // OpenAI API에 보낼 프롬프트 구성
    const systemPrompt = `당신은 도서 검색 전문가입니다. 사용자의 자연어 검색어를 분석하여 가장 관련성 높은 도서를 찾아주세요.

다음은 도서 목록입니다:
${books
  .map(
    (book) => `
- 제목: ${book.title}
- 저자: ${book.author}
- 장르: ${book.genre}
- 평점: ${book.rating}/5
- 설명: ${book.review || "설명 없음"}
`
  )
  .join("\n")}

사용자 검색어: "${query}"
위치: "${location}"

다음 JSON 형식으로 응답해주세요:
{
  "relevant_books": [
    {
      "book_id": "도서ID",
      "relevance_score": 0.95,
      "reason": "관련성 이유",
      "search_highlights": ["제목: 도서명", "저자: 저자명"]
    }
  ]
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `검색어: "${query}"에 대한 관련 도서를 찾아주세요.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 오류: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("OpenAI API 응답이 없습니다.");
    }

    // AI 응답을 파싱
    const parsedResponse = parseAIResponse(aiResponse);

    // 검색 결과 구성
    const searchResults = parsedResponse.relevant_books
      .map((item: AIRelevantBook) => {
        const book = books.find((b) => b.id.toString() === item.book_id);
        if (!book) return null;

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          description: book.review || "설명이 없습니다.",
          location: location || "전체",
          available: true, // 실제로는 데이터베이스에서 확인
          rating: book.rating,
          coverImage: book.coverImage || "/api/placeholder/default",
          relevance: item.relevance_score,
          searchHighlights: item.search_highlights || [],
          reason: item.reason,
        };
      })
      .filter(Boolean);

    return searchResults;
  } catch (error) {
    console.error("OpenAI API 오류:", error);
    // OpenAI API 오류 시 시뮬레이션된 검색으로 폴백
    return await performSimulatedSearch(query, location);
  }
}

function parseAIResponse(response: string) {
  try {
    // JSON 부분을 추출
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("JSON을 찾을 수 없습니다.");
  } catch (error) {
    console.error("AI 응답 파싱 오류:", error);
    return { relevant_books: [] };
  }
}

async function performSimulatedSearch(query: string, location: string) {
  // 시뮬레이션된 검색 결과 (기존 코드와 동일)
  const mockBooks = [
    {
      id: 1,
      title: "인공지능과 미래사회",
      author: "김철수",
      genre: "과학/기술",
      description: "AI 기술의 발전과 사회 변화에 대한 분석",
      location: "서울",
      available: true,
      rating: 4.5,
      coverImage: "/api/placeholder/1",
    },
    {
      id: 2,
      title: "머신러닝 입문",
      author: "이영희",
      genre: "컴퓨터/프로그래밍",
      description: "머신러닝의 기본 개념과 실습",
      location: "부산",
      available: true,
      rating: 4.2,
      coverImage: "/api/placeholder/2",
    },
    {
      id: 3,
      title: "딥러닝의 이해",
      author: "박민수",
      genre: "과학/기술",
      description: "딥러닝 알고리즘과 응용",
      location: "대구",
      available: false,
      rating: 4.8,
      coverImage: "/api/placeholder/3",
    },
    {
      id: 4,
      title: "AI 시대의 윤리",
      author: "최지영",
      genre: "철학/사회",
      description: "인공지능 발전에 따른 윤리적 고려사항",
      location: "서울",
      available: true,
      rating: 4.0,
      coverImage: "/api/placeholder/4",
    },
    {
      id: 5,
      title: "자연어 처리 기초",
      author: "정현우",
      genre: "컴퓨터/프로그래밍",
      description: "NLP 기술의 기본 원리와 구현",
      location: "부산",
      available: true,
      rating: 4.3,
      coverImage: "/api/placeholder/5",
    },
    {
      id: 6,
      title: "파이썬으로 배우는 데이터 과학",
      author: "홍길동",
      genre: "컴퓨터/프로그래밍",
      description: "파이썬을 활용한 데이터 분석과 시각화 실습",
      location: "광주",
      available: true,
      rating: 4.6,
      coverImage: "/api/placeholder/6",
    },
    {
      id: 7,
      title: "빅데이터 시대의 통계학",
      author: "김미정",
      genre: "과학/기술",
      description: "빅데이터 분석을 위한 통계학의 원리와 응용",
      location: "대전",
      available: true,
      rating: 4.4,
      coverImage: "/api/placeholder/7",
    },
    {
      id: 8,
      title: "알고리즘 문제 해결 전략",
      author: "이준호",
      genre: "컴퓨터/프로그래밍",
      description: "코딩 테스트와 알고리즘 문제 풀이 노하우",
      location: "서울",
      available: false,
      rating: 4.7,
      coverImage: "/api/placeholder/8",
    },
    {
      id: 9,
      title: "UX 디자인의 원칙",
      author: "박지은",
      genre: "디자인",
      description: "사용자 경험을 위한 디자인 이론과 실전",
      location: "부산",
      available: true,
      rating: 4.1,
      coverImage: "/api/placeholder/9",
    },
    {
      id: 10,
      title: "클라우드 컴퓨팅 입문",
      author: "최성훈",
      genre: "과학/기술",
      description: "클라우드 서비스와 인프라의 이해",
      location: "인천",
      available: true,
      rating: 4.3,
      coverImage: "/api/placeholder/10",
    },
  ];

  // 간단한 키워드 매칭
  const keywords = query.toLowerCase().split(" ");
  const filteredBooks = mockBooks.filter((book) => {
    const bookText =
      `${book.title} ${book.author} ${book.description} ${book.genre}`.toLowerCase();
    return keywords.some((keyword) => bookText.includes(keyword));
  });

  // 위치 필터링
  const locationFiltered =
    location && location !== "전체"
      ? filteredBooks.filter((book) => book.location === location)
      : filteredBooks;

  return locationFiltered.map((book) => ({
    ...book,
    relevance: Math.random() * 0.3 + 0.7,
    searchHighlights: generateSearchHighlights(query, book),
    reason: `"${query}"와 관련된 ${book.genre} 분야의 도서입니다.`,
  }));
}

function generateSearchHighlights(query: string, book: SearchBook) {
  const keywords = query.toLowerCase().split(" ");
  const highlights = [];

  if (keywords.some((keyword) => book.title.toLowerCase().includes(keyword))) {
    highlights.push(`제목: "${book.title}"`);
  }
  if (keywords.some((keyword) => book.author.toLowerCase().includes(keyword))) {
    highlights.push(`저자: "${book.author}"`);
  }
  if (
    keywords.some((keyword) => book.description.toLowerCase().includes(keyword))
  ) {
    highlights.push(`설명: "${book.description}"`);
  }

  return highlights;
}
