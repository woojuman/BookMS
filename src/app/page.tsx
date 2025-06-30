'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchResults from '../components/SearchResults';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('서울');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSearchResults(true);
    // 검색 로직은 SearchResults 컴포넌트에서 처리됩니다
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCloseSearch = () => {
    setShowSearchResults(false);
    setIsSearching(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent transform hover:scale-105 transition-transform">
                  📚 BookMS
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/books" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-lg">
                  도서검색
                </Link>
                <Link href="/books" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-lg">
                  추천 도서
                </Link>
                <Link href="/statistics" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-lg">
                  독후활동 들러보기
                </Link>
                <Link href="/goals" className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-lg">
                  내 위한 도서 찾기
                </Link>
                <span className="text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-lg cursor-pointer">
                  안내
                </span>
              </div>
            </nav>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <button className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-lg">
                회원가입
              </button>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                로그인
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12 transform hover:scale-105 transition-transform duration-500">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              내가 <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent px-2 py-1 rounded-lg shadow-2xl">이달의 독후왕</span> 이 될 상인가~
            </h2>
            <p className="text-white/90 text-xl mb-3">
              독서로가 <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">5월 독후왕을 선정</span> 하여 상품을 드립니다!
            </p>
            <p className="text-white/70 text-sm">(3월~5월)</p>
            <p className="text-white/90 text-xl mt-6">
              지금 바로 <span className="font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">독후왕</span> 이 되어 볼까요?
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex transform hover:scale-105 transition-transform duration-300">
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-4 border border-white/20 rounded-l-xl bg-white/10 text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="전체" className="bg-slate-800">전체</option>
                <option value="서울" className="bg-slate-800">서울</option>
                <option value="부산" className="bg-slate-800">부산</option>
                <option value="대구" className="bg-slate-800">대구</option>
              </select>
              <input
                type="text"
                placeholder="도서명 또는 저자를 입력하세요. (AI가 자연어로 검색합니다)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-4 border-t border-b border-white/20 bg-white/10 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button 
                onClick={handleSearch}
                className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-r-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🔍
              </button>
            </div>
            <div className="mt-3 text-white/60 text-sm">
              💡 AI 검색 팁: "인공지능에 대한 책", "김철수가 쓴 소설", "머신러닝 입문서" 등 자연어로 검색해보세요
            </div>
            <button className="mt-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-3 rounded-full text-sm hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-md">
              이벤트 안내 바로가기
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Announcements */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 transform hover:scale-105 transition-all duration-500 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">공지사항</h3>
                <button className="text-white/60 hover:text-white transition-colors duration-300 text-2xl">+</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-sm p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <span className="text-cyan-400 mr-3 text-lg">📢</span>
                  <span className="text-white/60 mr-3">2025-05-20</span>
                  <span className="text-white/90">[개선안내]독서로 서비스 요청사항 기능 개선 안...</span>
                </div>
                <div className="flex items-center text-sm p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <span className="text-white/60 mr-3">2025-05-07</span>
                  <span className="text-white/90">독서로 2025년 1학기 이벤트 '이달의 독후왕' 4...</span>
                </div>
                <div className="flex items-center text-sm p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <span className="text-white/60 mr-3">2025-04-30</span>
                  <span className="text-white/90">[개선안내]독서로 서비스 요청사항 기능 개선 안...</span>
                </div>
                <div className="flex items-center text-sm p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <span className="text-white/60 mr-3">2025-04-24</span>
                  <span className="text-white/90">[개선안내]독서로 서비스 요청사항 기능 개선 안...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recommended Books */}
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 transform hover:scale-105 transition-all duration-500 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">기관 추천도서</h3>
                <button className="text-white/60 hover:text-white transition-colors duration-300 text-2xl">+</button>
              </div>
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="w-20 h-30 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg transform hover:rotate-3 transition-transform duration-300"></div>
                  <div className="w-20 h-30 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg shadow-lg transform hover:-rotate-3 transition-transform duration-300"></div>
                </div>
                <div className="text-sm space-y-2">
                  <div className="font-medium text-white/90">[25년 독서서평단] One world or none</div>
                  <div className="font-medium text-white/90">[25년 독서서평단] 오늘도 뇌 마음대로 하는...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/books" className="group bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 text-center transition-all duration-500 transform hover:scale-105 hover:rotate-1 shadow-2xl border border-white/20">
            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📚</div>
            <h3 className="text-xl font-semibold text-white mb-3">내 서재</h3>
            <p className="text-white/70 text-sm">읽은 책들을 관리하고 기록해보세요</p>
          </Link>
          
          <Link href="/statistics" className="group bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-md rounded-2xl p-8 text-center transition-all duration-500 transform hover:scale-105 hover:-rotate-1 shadow-2xl border border-white/20">
            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-xl font-semibold text-white mb-3">독서 통계</h3>
            <p className="text-white/70 text-sm">나의 독서 패턴을 분석해보세요</p>
          </Link>
          
          <Link href="/goals" className="group bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-8 text-center transition-all duration-500 transform hover:scale-105 hover:rotate-1 shadow-2xl border border-white/20">
            <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-3">독서 목표</h3>
            <p className="text-white/70 text-sm">올해의 독서 목표를 설정하고 달성해보세요</p>
          </Link>
        </div>
      </main>

      {/* Search Results Modal */}
      {showSearchResults && (
        <SearchResults 
          query={searchQuery}
          location={selectedLocation}
          isSearching={isSearching}
          onClose={handleCloseSearch}
          onSearchEnd={() => setIsSearching(false)}
        />
      )}
    </div>
  );
}
