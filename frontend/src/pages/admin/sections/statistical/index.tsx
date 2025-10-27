
import { Calendar} from 'lucide-react';
import { Sidebar } from './section/Sidebar';
import { ParticipationSection } from './section/ParticipationSection';
import { ResultsSection } from './section/ResultSection';
import { UsersSection } from './section/UserSection';
import { CompetitionsSection } from './section/CompetitionSection';
import { ExamsSection } from './section/ExamSection';
import { OverviewSection } from './section/OverviewSection';
import { calculateStats } from '../../../../util/statsCalculator';
import { useEffect, useMemo, useState } from 'react';
import { DateRange, MockData, ViewMode } from '../../../../types/statistical.admin';
import { getStatistics } from '../../../../services/service';

 const Index: React.FC = () => {
  const [mockData, setMockData] = useState<MockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ start: '2020-01-01', end: new Date().toISOString().split('T')[0] });
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedSection, setSelectedSection] = useState('overview');

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getStatistics();
        setMockData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Chỉ gọi 1 lần khi component mount

  const stats = useMemo(() => {
    if (!mockData) return null;
    return calculateStats(mockData, dateRange, viewMode);
  }, [mockData, dateRange, viewMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Lỗi tải dữ liệu</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview':
        return <OverviewSection stats={stats} />;
      case 'exams':
        return <ExamsSection stats={stats} />;
      case 'competitions':
        return <CompetitionsSection stats={stats} />;
      case 'users':
        return <UsersSection stats={stats} />;
      case 'results':
        return <ResultsSection stats={stats} />;
      case 'participation':
        return <ParticipationSection stats={stats} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        <Sidebar selectedSection={selectedSection} onSelectSection={setSelectedSection} />

        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-blue-600" size={28} />
              <h2 className="text-xl font-bold text-gray-800">Bộ lọc thời gian</h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Chế độ xem</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as ViewMode)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="day">Theo ngày</option>
                  <option value="month">Theo tháng</option>
                  <option value="year">Theo năm</option>
                </select>
              </div>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};
export default Index;