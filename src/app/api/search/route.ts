import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { query, location } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "검색어가 필요합니다." },
        { status: 400 }
      );
    }

    // 실제 LLM API 호출 대신 시뮬레이션된 검색 로직
    // 실제 구현시에는 OpenAI API를 사용하여 자연어 검색을 수행
    const searchResults = await performLLMSearch(query, location);

    return NextResponse.json({ results: searchResults });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

async function performLLMSearch(query: string, location: string) {
  // 시뮬레이션된 LLM 검색 결과
  // 실제 구현시에는 OpenAI API를 호출하여 자연어 처리를 수행
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

  // 간단한 키워드 매칭 (실제로는 LLM이 더 정교한 검색을 수행)
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
    relevance: Math.random() * 0.3 + 0.7, // 시뮬레이션된 관련도 점수
    searchHighlights: generateSearchHighlights(query, book),
  }));
}

function generateSearchHighlights(query: string, book: any) {
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
