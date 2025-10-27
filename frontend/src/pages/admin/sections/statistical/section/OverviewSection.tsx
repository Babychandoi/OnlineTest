import { Stats } from "../../../../../types/statistical.admin";
import { StatCard } from "./StatCard";

// components/sections/OverviewSection.tsx
export const OverviewSection: React.FC<{ stats: Stats }> = ({ stats }) => {
  const { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } = require('recharts');
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan hệ thống</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Đề thi mới" value={stats.totalExams} icon="📝" color="blue" />
        <StatCard title="Cuộc thi mới" value={stats.totalCompetitions} icon="🏆" color="green" />
        <StatCard 
          title="Người dùng mới" 
          value={stats.totalUsers} 
          icon="👥" 
          color="purple"
          subtitle={`HS: ${stats.newStudents} | GV: ${stats.newTeachers}`}
        />
        <StatCard title="Lượt làm đề thi" value={stats.examTakers} icon="📅" color="orange" />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Hoạt động hệ thống theo thời gian</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" allowDuplicatedCategory={false} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" data={stats.examsByPeriod} dataKey="count" stroke={COLORS[0]} name="Đề thi mới" strokeWidth={2} />
            <Line type="monotone" data={stats.competitionsByPeriod} dataKey="count" stroke={COLORS[1]} name="Cuộc thi mới" strokeWidth={2} />
            <Line type="monotone" data={stats.usersByPeriod} dataKey="count" stroke={COLORS[2]} name="Người dùng mới" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};