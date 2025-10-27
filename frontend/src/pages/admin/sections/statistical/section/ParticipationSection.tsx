import { Stats } from "../../../../../types/statistical.admin";
import { StatCard } from "./StatCard";

export const ParticipationSection: React.FC<{ stats: Stats }> = ({ stats }) => {
  const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = require('recharts');
  const COLORS = ['#3b82f6', '#ef4444'];

  const competitionParticipationData = [
    { name: 'Đã tham gia', value: stats.competitionStats.participated, color: COLORS[0] },
    { name: 'Chỉ đăng ký', value: stats.competitionStats.registered, color: COLORS[1] }
  ];

  const total = stats.competitionStats.participated + stats.competitionStats.registered;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tham gia cuộc thi</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Tổng đăng ký" value={total} icon="📋" color="purple" />
        <StatCard title="Đã tham gia thi" value={stats.competitionStats.participated} icon="✅" color="blue" />
        <StatCard title="Đăng ký nhưng chưa thi" value={stats.competitionStats.registered} icon="⏳" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Tỷ lệ tham gia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={competitionParticipationData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value, percent }: { name: string; value: number; percent: number }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                outerRadius={100}
                dataKey="value"
              >
                {competitionParticipationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Thống kê chi tiết</h3>
          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-gray-700 font-medium">Tổng đăng ký</span>
              <span className="text-2xl font-bold text-gray-800">{total}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">Đã tham gia thi</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{stats.competitionStats.participated}</div>
                <div className="text-sm text-gray-600">
                  {total > 0 ? ((stats.competitionStats.participated / total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <span className="text-gray-700 font-medium">Đăng ký nhưng chưa thi</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">{stats.competitionStats.registered}</div>
                <div className="text-sm text-gray-600">
                  {total > 0 ? ((stats.competitionStats.registered / total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};