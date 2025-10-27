import { Stats } from "../../../../../types/statistical.admin";
import { StatCard } from "./StatCard";
export const UsersSection: React.FC<{ stats: Stats }> = ({ stats }) => {
  const { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } = require('recharts');
  const COLORS = ['#3b82f6', '#10b981'];

  const userRoleData = [
    { name: 'Học sinh mới', value: stats.newStudents, color: COLORS[0] },
    { name: 'Giáo viên mới', value: stats.newTeachers, color: COLORS[1] }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thống kê người dùng</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Tổng người dùng mới" value={stats.totalUsers} icon="👥" color="purple" />
        <StatCard title="Học sinh mới" value={stats.newStudents} icon="🎓" color="blue" />
        <StatCard title="Giáo viên mới" value={stats.newTeachers} icon="👨‍🏫" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Người dùng mới theo thời gian</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.usersByPeriod}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Người dùng mới" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Phân loại người dùng mới</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }: { name: string; value: number; percent: number }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};