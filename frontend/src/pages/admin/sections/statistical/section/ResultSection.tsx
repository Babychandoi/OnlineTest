import { Stats } from "../../../../../types/statistical.admin";

export const ResultsSection: React.FC<{ stats: Stats }> = ({ stats }) => {
  const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = require('recharts');
  const COLORS = ['#10b981', '#ef4444'];

  const passRateData = [
    { name: 'Đạt (≥50%)', value: stats.competitionStats.passedCount, color: COLORS[0] },
    { name: 'Không đạt', value: stats.competitionStats.failedCount, color: COLORS[1] }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Kết quả thi</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <span className="text-5xl">✅</span>
            <div>
              <p className="text-gray-500 text-sm">Số bài thi đạt</p>
              <p className="text-3xl font-bold text-gray-800">{stats.competitionStats.passedCount}</p>
              <p className="text-xs text-gray-500">≥ 50% tổng điểm</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <span className="text-5xl">❌</span>
            <div>
              <p className="text-gray-500 text-sm">Số bài thi không đạt</p>
              <p className="text-3xl font-bold text-gray-800">{stats.competitionStats.failedCount}</p>
              <p className="text-xs text-gray-500">{'<'} 50% tổng điểm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tỷ lệ đạt/không đạt</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={passRateData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, value, percent }: { name: string; value: number; percent: number }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
              outerRadius={120}
              dataKey="value"
            >
              {passRateData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Thống kê chi tiết</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold">Chỉ số</th>
                <th className="px-4 py-3 text-sm font-semibold">Số lượng</th>
                <th className="px-4 py-3 text-sm font-semibold">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3">Tổng bài thi</td>
                <td className="px-4 py-3 font-medium">{stats.competitionStats.participated}</td>
                <td className="px-4 py-3">100%</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-4 py-3">Bài thi đạt (≥50%)</td>
                <td className="px-4 py-3 font-medium text-green-600">{stats.competitionStats.passedCount}</td>
                <td className="px-4 py-3">
                  {stats.competitionStats.participated > 0 
                    ? ((stats.competitionStats.passedCount / stats.competitionStats.participated) * 100).toFixed(1) 
                    : 0}%
                </td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-4 py-3">Bài thi không đạt</td>
                <td className="px-4 py-3 font-medium text-red-600">{stats.competitionStats.failedCount}</td>
                <td className="px-4 py-3">
                  {stats.competitionStats.participated > 0 
                    ? ((stats.competitionStats.failedCount / stats.competitionStats.participated) * 100).toFixed(1) 
                    : 0}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};