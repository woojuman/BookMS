'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  location: string;
  available: boolean;
  rating: number;
  coverImage: string;
  relevance: number;
  searchHighlights: string[];
  reason?: string;
}

interface SearchResultsProps {
  query: string;
  location: string;
  isSearching: boolean;
  onClose?: () => void;
  onSearchEnd?: () => void;
}

// 상세정보 모달 컴포넌트
function BookDetailModal({ book, onClose }: { book: any, onClose: () => void }) {
  if (!book) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">✕</button>
        <div className="flex flex-col items-center">
          <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-4xl text-gray-400">📚</span>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">{book.title}</h2>
          <div className="text-gray-700 mb-1">저자: {book.author}</div>
          <div className="text-gray-700 mb-1">장르: {book.genre}</div>
          <div className="text-gray-700 mb-1">설명: {book.description}</div>
          <div className="text-gray-700 mb-1">평점: {book.rating} / 5</div>
          <div className="text-gray-700 mb-1">위치: {book.location}</div>
          {book.reason && <div className="text-cyan-600 text-sm mt-2">🤖 {book.reason}</div>}
          {book.searchHighlights && book.searchHighlights.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-cyan-500 mb-1">검색 관련 항목:</div>
              <div className="flex flex-wrap gap-2">
                {book.searchHighlights.map((h: string, i: number) => (
                  <span key={i} className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs">{h}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchResults({ query, location, isSearching, onClose, onSearchEnd }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<SearchResult | null>(null);

  useEffect(() => {
    console.log('[SearchResults] useEffect triggered', { query, location });
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      console.log('[SearchResults] performSearch start', { query, location });
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, location }),
        });
        console.log('[SearchResults] fetch response', response);
        if (!response.ok) {
          throw new Error('검색 요청에 실패했습니다.');
        }
        const data = await response.json();
        console.log('[SearchResults] fetch data', data);
        setResults(data.results || []);
      } catch (err) {
        console.error('[SearchResults] fetch error', err);
        setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
        setResults([]);
      } finally {
        setLoading(false);
        console.log('[SearchResults] setLoading(false)');
        if (typeof onSearchEnd === 'function') onSearchEnd();
      }
    };

    // 디바운싱을 위한 타이머
    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [query, location]);

  // 상태 변화 로그
  useEffect(() => {
    console.log('[SearchResults] 상태 변화', { loading, results, error });
  }, [loading, results, error]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // 기본 닫기 동작: 검색 결과를 초기화
      setResults([]);
      setError(null);
    }
  };

  // ESC 키로 닫기 (모달도 닫힘)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedBook) setSelectedBook(null);
        else handleClose();
      }
    };
    if (query.trim() || isSearching || selectedBook) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [query, isSearching, selectedBook]);

  if (!query.trim() && !isSearching) {
    return null;
  }

  if (loading || isSearching) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 relative">
          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-300 text-xl hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center"
            title="닫기 (ESC)"
          >
            ✕
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <div className="text-white text-lg">AI가 도서를 검색하고 있습니다...</div>
          </div>
          <div className="mt-4 text-white/60 text-sm text-center">
            자연어를 분석하여 가장 관련성 높은 도서를 찾고 있습니다
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md relative">
          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-300 text-xl hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center"
            title="닫기 (ESC)"
          >
            ✕
          </button>

          <div className="text-red-400 text-center">
            <div className="text-2xl mb-4">⚠️</div>
            <div className="text-white mb-4">{error}</div>
            <button 
              onClick={() => setError(null)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0 && query.trim()) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md relative">
          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-300 text-xl hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center"
            title="닫기 (ESC)"
          >
            ✕
          </button>

          <div className="text-center text-white">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-xl mb-2">검색 결과가 없습니다</div>
            <div className="text-white/70 text-sm">
              "{query}"에 대한 도서를 찾을 수 없습니다.
            </div>
            <div className="text-white/50 text-xs mt-4">
              다른 키워드로 검색해보세요.
            </div>
            <div className="text-white/40 text-xs mt-2">
              예: "인공지능", "김철수", "소설" 등
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-4xl mt-20 mb-8 relative">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  🤖 AI 검색 결과
                </h2>
                <p className="text-white/70">
                  "{query}"에 대한 {results.length}개의 도서를 찾았습니다
                </p>
                <p className="text-white/50 text-sm mt-1">
                  AI가 자연어를 분석하여 가장 관련성 높은 도서를 추천했습니다
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white/40 text-xs">
                  ESC로 닫기
                </span>
                <button 
                  onClick={handleClose}
                  className="text-white/60 hover:text-white transition-colors duration-300 text-2xl hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center"
                  title="닫기 (ESC)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-6">
            <div className="space-y-6">
              {results.map((book) => (
                <div 
                  key={book.id}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedBook(book)}
                >
                  <div className="flex space-x-6">
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
                        <span className="text-white text-2xl">📚</span>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {book.title}
                          </h3>
                          <p className="text-white/80 mb-2">
                            저자: {book.author} | 장르: {book.genre}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-yellow-400">
                            {'★'.repeat(Math.floor(book.rating))}
                            <span className="text-white/60 ml-1 text-sm">
                              {book.rating}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            book.available 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {book.available ? '대출가능' : '대출중'}
                          </span>
                        </div>
                      </div>

                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {book.description}
                      </p>

                      {/* AI Recommendation Reason */}
                      {book.reason && (
                        <div className="mb-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                          <div className="text-cyan-400 text-xs font-medium mb-1">
                            🤖 AI 추천 이유:
                          </div>
                          <div className="text-white/90 text-sm">
                            {book.reason}
                          </div>
                        </div>
                      )}

                      {/* Search Highlights */}
                      {book.searchHighlights.length > 0 && (
                        <div className="mb-3">
                          <div className="text-cyan-400 text-xs font-medium mb-1">
                            🔍 검색 관련 항목:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {book.searchHighlights.map((highlight, index) => (
                              <span 
                                key={index}
                                className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs border border-cyan-500/30"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-white/60">
                            📍 {book.location}
                          </span>
                          <span className="text-white/60">
                            관련도: {Math.round(book.relevance * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 상세정보 모달 */}
          {selectedBook && (
            <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
          )}
        </div>
      </div>
    </div>
  );
} 