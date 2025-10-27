
export const StatCard: React.FC<{ 
  title: string; 
  value: number; 
  icon: string; 
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <span className="text-5xl">{icon}</span>
    </div>
  </div>
);


