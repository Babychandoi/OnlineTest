import FeatureCard from "./FeatureCard";
import { Calendar, Users, Trophy } from 'lucide-react';
const WhyUseAI3Section: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      iconColor: "text-blue-600",
      title: "Cập nhật nhan chóng",
      description: "Đầy đủ đề thi mọi cấp, đáp án chính."
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      iconColor: "text-green-600",
      title: "Cuộc thi",
      description: "Các cuộc thi với bộ đề chuẩn hoá cho học sinh."
    },
    {
      icon: <Users className="h-6 w-6" />,
      iconColor: "text-amber-600",
      title: "Giáo viên",
      description: "Đội ngũ giáo viên chuyên nghiệp xây dựng và làm đề ."
    }
  ];

  return (
    <section className="py-14 bg-gradient-to-br from-white to-indigo-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            Vì sao nên dùng OnlineTest?
          </h2>
          <p className="mt-2 text-slate-600">
            Tập trung đúng nhu cầu muốn ôn luyện, chuẩn bị cho kì thi quan trọng sắp tới
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
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

export default WhyUseAI3Section;