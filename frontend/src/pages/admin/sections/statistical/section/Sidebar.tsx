import { BarChart3 } from "lucide-react";

export const Sidebar: React.FC<{ selectedSection: string; onSelectSection: (section: string) => void }> = ({ 
  selectedSection, 
  onSelectSection 
}) => {
  const menuItems = [
    { id: 'overview', name: 'Tổng quan', icon: '📊' },
    { id: 'exams', name: 'Thống kê đề thi', icon: '📝' },
    { id: 'competitions', name: 'Thống kê cuộc thi', icon: '🏆' },
    { id: 'users', name: 'Thống kê người dùng', icon: '👥' },
    { id: 'results', name: 'Kết quả thi', icon: '🎯' },
    { id: 'participation', name: 'Tham gia cuộc thi', icon: '📈' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 size={28} />
          Thống Kê Hệ Thống
        </h1>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
              selectedSection === item.id
                ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};