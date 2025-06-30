'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  readDate: string;
  rating: number;
  review: string;
  pages: number;
  coverImage?: string;
  publisher?: string;
  isbn?: string;
  startDate?: string;
  notes?: string[];
}

// 샘플 데이터 (실제로는 API나 데이터베이스에서 가져올 데이터)
const sampleBooks: Book[] = [
  {
    id: 1,
    title: "클린 코드",
    author: "로버트 C. 마틴",
    genre: "프로그래밍",
    readDate: "2024-01-15",
    startDate: "2024-01-01",
    rating: 5,
    review: "개발자라면 반드시 읽어야 할 책. 코드의 품질을 높이는 다양한 기법들을 배울 수 있었다. 특히 함수와 클래스 작성법, 주석 작성 원칙 등이 매우 유용했다.",
    pages: 464,
    publisher: "인사이트",
    isbn: "9788966260959",
    notes: [
      "의미 있는 이름을 사용하라",
      "함수는 한 가지 일만 해야 한다",
      "주석보다는 코드로 의도를 표현하라",
      "오류 처리도 한 가지 작업이다"
    ]
  },
  {
    id: 2,
    title: "해리 포터와 마법사의 돌",
    author: "J.K. 롤링",
    genre: "판타지",
    readDate: "2024-02-20",
    startDate: "2024-02-10",
    rating: 4,
    review: "어린 시절의 추억을 되살려주는 마법 같은 이야기. 상상력이 풍부한 세계관이 인상적이다.",
    pages: 309,
    publisher: "문학수첩",
    isbn: "9788983920775",
    notes: [
      "호그와트의 세계관이 매우 흥미로움",
      "캐릭터들의 개성이 뚜렷함",
      "마법 시스템이 잘 구축되어 있음"
    ]
  },
  {
    id: 3,
    title: "사피엔스",
    author: "유발 하라리",
    genre: "역사/인문",
    readDate: "2024-03-10",
    startDate: "2024-02-25",
    rating: 5,
    review: "인류의 역사를 새로운 관점에서 바라볼 수 있게 해주는 책. 매우 흥미롭고 생각할 거리가 많다.",
    pages: 512,
    publisher: "김영사",
    isbn: "9788934972464",
    notes: [
      "인지혁명, 농업혁명, 과학혁명의 3단계",
      "허구의 힘이 인류 발전의 원동력",
      "현재 인류가 직면한 문제들에 대한 통찰"
    ]
  }
];

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const bookId = parseInt(params.id as string);
    const foundBook = sampleBooks.find(b => b.id === bookId);
    setBook(foundBook || null);
  }, [params.id]);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">책을 찾을 수 없습니다</h2>
          <Link href="/books" className="text-indigo-600 hover:text-indigo-900">
            책 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const calculateReadingDays = () => {
    if (!book.startDate) return null;
    const start = new Date(book.startDate);
    const end = new Date(book.readDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Link href="/books" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
            ← 책 목록으로 돌아가기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* 책 기본 정보 */}
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 책 커버 이미지 영역 */}
              <div className="lg:w-1/3">
                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-center text-gray-500">
                      <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p>책 표지 이미지</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 책 정보 */}
              <div className="lg:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    {isEditing ? '취소' : '편집'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 font-medium">저자:</span>
                    <span className="ml-2 text-gray-900">{book.author}</span>
                  </div>

                  <div>
                    <span className="text-gray-600 font-medium">장르:</span>
                    <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                      {book.genre}
                    </span>
                  </div>

                  {book.publisher && (
                    <div>
                      <span className="text-gray-600 font-medium">출판사:</span>
                      <span className="ml-2 text-gray-900">{book.publisher}</span>
                    </div>
                  )}

                  {book.isbn && (
                    <div>
                      <span className="text-gray-600 font-medium">ISBN:</span>
                      <span className="ml-2 text-gray-900">{book.isbn}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-600 font-medium">페이지 수:</span>
                    <span className="ml-2 text-gray-900">{book.pages}페이지</span>
                  </div>

                  <div>
                    <span className="text-gray-600 font-medium">읽기 시작한 날:</span>
                    <span className="ml-2 text-gray-900">{book.startDate || '기록 없음'}</span>
                  </div>

                  <div>
                    <span className="text-gray-600 font-medium">읽기 완료한 날:</span>
                    <span className="ml-2 text-gray-900">{book.readDate}</span>
                  </div>

                  {calculateReadingDays() && (
                    <div>
                      <span className="text-gray-600 font-medium">읽는 데 걸린 시간:</span>
                      <span className="ml-2 text-gray-900">{calculateReadingDays()}일</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium mr-3">평점:</span>
                    {renderStars(book.rating)}
                    <span className="ml-2 text-gray-600">({book.rating}/5)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 리뷰 섹션 */}
          <div className="border-t border-gray-200 px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">나의 리뷰</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{book.review}</p>
            </div>
          </div>

          {/* 메모 섹션 */}
          {book.notes && book.notes.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">읽기 메모</h2>
              <ul className="space-y-2">
                {book.notes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span className="text-gray-700">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between">
              <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                삭제하기
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                수정하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}