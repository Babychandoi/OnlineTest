import React from 'react';
import { BookOpen, Play, GraduationCap } from 'lucide-react';

const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 p-4 md:p-8 lg:p-10 mb-6 md:mb-8">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
        {/* Left Column - Text Content */}
        <div className="text-center md:text-left">
          <h1 className="mt-3 md:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            <div className="leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">
              Ôn Tập &amp; Luyện Thi
            </div>
          </h1>
          
          <ul className="mt-4 md:mt-5 space-y-2 md:space-y-3 text-sm md:text-base text-gray-700">
            <li className="flex items-start gap-2">
              <BookOpen 
                className="mt-0.5 text-indigo-600 flex-shrink-0" 
                size={16}
                aria-hidden="true"
              />
              <span>Bất kể ở đâu, chỉ cần có internet là bạn có thể học tập.</span>
            </li>
            
            <li className="flex items-start gap-2">
              <Play 
                className="mt-0.5 text-indigo-600 flex-shrink-0" 
                size={16}
                aria-hidden="true"
              />
              <span>Học trên điện thoại, máy tính bảng, laptop hoặc máy tính để bàn.</span>
            </li>
            
            <li className="flex items-start gap-2">
              <GraduationCap 
                className="mt-0.5 text-indigo-600 flex-shrink-0" 
                size={16}
                aria-hidden="true"
              />
              <span>Khám phá kho đề thi khổng lồ giúp bạn học hiệu quả hơn.</span>
            </li>
          </ul>
        </div>

        {/* Right Column - Icon Card (Hidden on mobile) */}
        <div className="hidden md:flex justify-end items-center">
          <div className="w-full max-w-xs lg:max-w-md">
            <div className="bg-indigo-100 rounded-2xl p-6 text-center">
              <GraduationCap 
                className="mx-auto text-indigo-500 mb-4" 
                size={80}
                aria-hidden="true"
              />
              <p className="text-indigo-700 font-semibold">
                Học tập hiệu quả mọi lúc mọi nơi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;