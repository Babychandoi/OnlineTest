import { Filter, Search, X } from "lucide-react";

interface FilterState {
  name: string;
  email: string;
  phone: string;
  role: string;
  isPremium: string;
}

const FilterSection: React.FC<{
  filters: FilterState;
  onFilterChange: (field: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  hasActiveFilters: boolean;
}> = ({ filters, onFilterChange, onClearFilters, showFilters, onToggleFilters, hasActiveFilters }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Filter className="h-5 w-5" />
        {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
      </button>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
        >
          <X className="h-5 w-5" />
          Xóa bộ lọc
        </button>
      )}
    </div>

    {showFilters && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên..."
              value={filters.name}
              onChange={(e) => onFilterChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Tìm kiếm email..."
              value={filters.email}
              onChange={(e) => onFilterChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Điện thoại</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              placeholder="Tìm kiếm số điện thoại..."
              value={filters.phone}
              onChange={(e) => onFilterChange('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange('role', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Tất cả</option>
            <option value="TEACHER">Giáo viên</option>
            <option value="STUDENT">Học sinh</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Premium</label>
          <select
            value={filters.isPremium}
            onChange={(e) => onFilterChange('isPremium', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Tất cả</option>
            <option value="true">Premium</option>
            <option value="false">Free</option>
          </select>
        </div>
      </div>
    )}
  </div>
);

export default FilterSection;