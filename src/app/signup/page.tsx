'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문 대소문자와 숫자를 포함해야 합니다.';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^[0-9-]+$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식을 입력해주세요.';
    }

    // Terms agreement validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: 실제 회원가입 API 호출
      console.log('회원가입 데이터:', formData);
      
      // 임시로 성공 처리 (실제로는 API 응답을 기다려야 함)
      setTimeout(() => {
        alert('회원가입이 완료되었습니다!');
        router.push('/');
      }, 1000);
      
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
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
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent transform hover:scale-105 transition-transform">
                  📚 BookMS 
                </h1>
              </Link>
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
              <Link href="/signup" className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:bg-white/10 px-3 py-2 rounded-lg">
                회원가입
              </Link>
              <Link href="/login" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                로그인
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              회원가입
            </h2>
            <p className="text-white/70">
              BookMS와 함께 독서 여정을 시작하세요
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  이메일 *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white/10 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-white/20 focus:ring-cyan-500'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                  비밀번호 *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white/10 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-white/20 focus:ring-cyan-500'
                  }`}
                  placeholder="8자 이상, 영문 대소문자 + 숫자"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
                  비밀번호 확인 *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white/10 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.confirmPassword 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-white/20 focus:ring-cyan-500'
                  }`}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                  이름 *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white/10 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.name 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-white/20 focus:ring-cyan-500'
                  }`}
                  placeholder="홍길동"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">
                  전화번호 *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl bg-white/10 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.phone 
                      ? 'border-red-400 focus:ring-red-400' 
                      : 'border-white/20 focus:ring-cyan-500'
                  }`}
                  placeholder="010-1234-5678"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-white/20 rounded bg-white/10"
                  />
                  <label htmlFor="agreeTerms" className="ml-3 text-sm text-white/80">
                    <span className="text-white/90">이용약관</span>에 동의합니다 *
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-400 ml-7">{errors.agreeTerms}</p>
                )}

                <div className="flex items-start">
                  <input
                    id="agreePrivacy"
                    name="agreePrivacy"
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-white/20 rounded bg-white/10"
                  />
                  <label htmlFor="agreePrivacy" className="ml-3 text-sm text-white/80">
                    <span className="text-white/90">개인정보처리방침</span>에 동의합니다 *
                  </label>
                </div>
                {errors.agreePrivacy && (
                  <p className="mt-1 text-sm text-red-400 ml-7">{errors.agreePrivacy}</p>
                )}

                <div className="flex items-start">
                  <input
                    id="agreeMarketing"
                    name="agreeMarketing"
                    type="checkbox"
                    checked={formData.agreeMarketing}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-white/20 rounded bg-white/10"
                  />
                  <label htmlFor="agreeMarketing" className="ml-3 text-sm text-white/80">
                    <span className="text-white/90">마케팅 정보 수신</span>에 동의합니다 (선택)
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? '가입 중...' : '회원가입'}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-white/70 text-sm">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300">
                  로그인하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 