import { Stats } from "../../../../../types/statistical.admin";

export const ExamsSection: React.FC<{ stats: Stats }> = ({ stats }) => {
  const { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } = require('recharts');
  const COLORS = ['#3b82f6', '#ef4444'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thống kê đề thi</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <span className="text-5xl">📝</span>
            <div>
              <p className="text-gray-500 text-sm">Tổng số đề thi mới</p>
              <p className="text-4xl font-bold text-gray-800">{stats.totalExams}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <span className="text-5xl">✍️</span>
            <div>
              <p className="text-gray-500 text-sm">Lượt làm đề thi</p>
              <p className="text-4xl font-bold text-gray-800">{stats.examTakers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Đề thi mới theo thời gian</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={stats.examsByPeriod}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill={COLORS[0]} name="Số đề thi mới" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Lượt làm đề thi theo thời gian</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={stats.resultsByPeriod}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke={COLORS[1]} name="Lượt làm bài" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};