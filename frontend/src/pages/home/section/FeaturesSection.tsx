// FeaturesSection.tsx
import React from 'react';
import { Search, ChartColumn, Users, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';

interface Feature {
  icon: React.ReactNode;
  title: string;
  iconColor : string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Search className="h-6 w-6 text-blue-600" />,
    title: 'Tìm kiếm Thông minh',
    iconColor: "text-amber-600",
    description: 'Lọc đề thi theo lớp, môn',
  },
  {
    icon: <ChartColumn className="h-6 w-6 text-blue-600" />,
    title: 'Phân tích Chi tiết',
    iconColor: "text-amber-600",
    description: 'Báo cáo tiến độ và điểm yếu cá nhân',
  },
  {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: 'Giáo viên',
    iconColor: "text-amber-600",
    description: 'Đội ngũ giáo viên chuyên nghiệp',
  },
  {
    icon: <Zap className="h-6 w-6 text-blue-600" />,
    title: 'Học tập hiệu quả',
    iconColor: "text-amber-600",
    description: 'Phương pháp học khoa học, tiết kiệm thời gian',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              iconColor={feature.iconColor}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
