import { Stats } from "../../../../../types/statistical.admin";

export const CompetitionsSection: React.FC<{ stats: Stats }> = ({ stats }) => {
  const { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } = require('recharts');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thống kê cuộc thi</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-5xl">🏆</span>
          <div>
            <p className="text-gray-500 text-sm">Tổng số cuộc thi mới</p>
            <p className="text-4xl font-bold text-gray-800">{stats.totalCompetitions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Cuộc thi mới theo thời gian</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={stats.competitionsByPeriod}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#10b981" name="Số cuộc thi mới" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};