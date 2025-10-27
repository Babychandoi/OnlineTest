// HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { Star, ChevronRight, Megaphone, Calendar, Clock } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useNavigate } from 'react-router-dom';
const HeroSection = () => {
  // Countdown
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetDate = new Date('2026-06-11T00:00:00');
  const nagivate = useNavigate();
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const days = differenceInDays(targetDate, now);
      const hours = differenceInHours(targetDate, now) % 24;
      const minutes = differenceInMinutes(targetDate, now) % 60;
      const seconds = differenceInSeconds(targetDate, now) % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);
  const handleCompetition = () => {
    nagivate('/quiz-test');
  }
  const handleExam  = () => {
    nagivate('/subjects');
  }
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-blue-300 blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-blue-800/50 px-4 py-2 text-sm">
                <Star className="mr-2 h-4 w-4 text-yellow-400" />
                <span>Nền tảng ôn luyện hàng đầu Việt Nam</span>
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-6xl">Thư viện Đề thi Online</h1>
              <p className="text-xl leading-relaxed text-blue-100">
                Hệ thống đầy đủ đề thi từ lớp 1 → 12, đa dạng môn học, ngành nghề.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleCompetition} className="group flex items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl">
                Tham gia kì thi
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={handleExam} className="group flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl">
                Bắt đầu ôn tập
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Announcement Box */}
            <div className="relative mt-6 rounded-2xl border border-blue-300/30 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 p-5 shadow-lg backdrop-blur-sm">
              <span className="absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full border border-emerald-300/40 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
                Thông báo
              </span>
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-full bg-white/15 p-2 ring-1 ring-white/20">
                  <Megaphone className="h-5 w-5 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-base leading-relaxed text-blue-100">
                  <span className="font-semibold text-white">Bộ Giáo dục và Đào tạo</span> chủ trì xây dựng đề án{' '}
                  <span className="font-semibold">thi tốt nghiệp THPT</span> và{' '}
                  <span className="font-semibold">thi tuyển sinh đại học trên máy tính</span>, 
                  dự kiến hoàn thành vào năm <span className="font-bold text-green-300">2026</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Countdown */}
          <div className="relative">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <div className="mb-6 text-center">
                <div className="mb-3 flex items-center justify-center gap-3">
                  <Calendar className="h-8 w-8 text-yellow-400" />
                  <Clock className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">Kỳ thi tốt nghiệp THPT 2026</h3>
                <p className="text-blue-200">Ngày 11, tháng 6, 2026</p>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="rounded-xl bg-gradient-to-b from-green-500 to-green-600 p-4 text-white shadow-lg">
                  <div className="text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-xs uppercase tracking-wide">Ngày</div>
                </div>
                <div className="rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 p-4 text-white shadow-lg">
                  <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs uppercase tracking-wide">Giờ</div>
                </div>
                <div className="rounded-xl bg-gradient-to-b from-purple-500 to-purple-600 p-4 text-white shadow-lg">
                  <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs uppercase tracking-wide">Phút</div>
                </div>
                <div className="rounded-xl bg-gradient-to-b from-red-500 to-red-600 p-4 text-white shadow-lg">
                  <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs uppercase tracking-wide">Giây</div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-green-400/30 bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 text-center">
                <div className="mb-1 font-semibold text-green-300">🎯 Chuẩn bị sẵn sàng!</div>
                <div className="text-sm text-green-200">
                  Bắt đầu ôn tập ngay hôm nay để đạt kết quả tốt nhất
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
