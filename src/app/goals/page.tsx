'use client';

import { useState } from 'react';
import Link from 'next/link';

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
}

// 샘플 데이터
const sampleBooks: Book[] = [
  {
    id: 1,
    title: "클린 코드",
    author: "로버트 C. 마틴",
    genre: "프로그래밍",
    readDate: "2024-01-15",
    rating: 5,
    review: "개발자라면 반드시 읽어야 할 책. 코드의 품질을 높이는 다양한 기법들을 배울 수 있었다.",
    pages: 464
  },
  {
    id: 2,
    title: "해리 포터와 마법사의 돌",
    author: "J.K. 롤링",
    genre: "판타지",
    readDate: "2024-02-20",
    rating: 4,
    review: "어린 시절의 추억을 되살려주는 마법 같은 이야기. 상상력이 풍부한 세계관이 인상적이다.",
    pages: 309
  },
  {
    id: 3,
    title: "사피엔스",
    author: "유발 하라리",
    genre: "역사/인문",
    readDate: "2024-03-10",
    rating: 5,
    review: "인류의 역사를 새로운 관점에서 바라볼 수 있게 해주는 책. 매우 흥미롭고 생각할 거리가 많다.",
    pages: 512
  }
];

export default function BooksPage() {
  const [books] = useState<Book[]>(sampleBooks);
  const [selectedGenre, setSelectedGenre] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<string>('readDate');

  const genres = ['전체', ...Array.from(new Set(books.map(book => book.genre)))];

  const filteredBooks = books.filter(book => 
    selectedGenre === '전체' || book.genre === selectedGenre
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'readDate':
        return new Date(b.readDate).getTime() - new Date(a.readDate).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                ← 홈으로 돌아가기
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">읽은 책 목록</h1>
            </div>
            <Link
              href="/books/add"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              새 책 추가
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 필터 및 정렬 옵션 */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                  장르별 필터
                </label>
                <select
                  id="genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  정렬 기준
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="readDate">읽은 날짜순</option>
                  <option value="rating">평점순</option>
                  <option value="title">제목순</option>
                </select>
              </div>
            </div>
          </div>

          {/* 통계 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">총 읽은 책</h3>
              <p className="text-3xl font-bold text-indigo-600">{books.length}권</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">총 페이지 수</h3>
              <p className="text-3xl font-bold text-green-600">
                {books.reduce((total, book) => total + book.pages, 0).toLocaleString()}페이지
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">평균 평점</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {(books.reduce((total, book) => total + book.rating, 0) / books.length).toFixed(1)}점
              </p>
            </div>
          </div>

          {/* 책 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {book.genre}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">저자: {book.author}</p>
                  <p className="text-gray-500 text-sm mb-3">읽은 날짜: {book.readDate}</p>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-gray-600 mr-2">평점:</span>
                    {renderStars(book.rating)}
                    <span className="ml-2 text-sm text-gray-600">({book.rating}/5)</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{book.review}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{book.pages}페이지</span>
                    <Link
                      href={`/books/${book.id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      자세히 보기 →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedBooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">선택한 조건에 맞는 책이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}