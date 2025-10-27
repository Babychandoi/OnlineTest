import React from 'react';


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, iconColor }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-transform">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 ring-2 ring-slate-200">
        <div className={iconColor}>
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
    </div>
  );
};
export default FeatureCard
