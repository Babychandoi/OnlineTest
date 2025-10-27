import { ChevronRight, ChevronLeft } from "lucide-react";

const PaginationSection: React.FC<{
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}> = ({ currentPage, pageSize, totalPages, totalElements, onPageChange, onPageSizeChange }) => {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <span className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{startItem}</span> đến{' '}
          <span className="font-semibold">{endItem}</span> từ{' '}
          <span className="font-semibold">{totalElements}</span> kết quả
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value={5}>5 hàng</option>
          <option value={10}>10 hàng</option>
          <option value={20}>20 hàng</option>
          <option value={50}>50 hàng</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Trang trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            let pageNum = currentPage;
            if (totalPages > 5) {
              if (currentPage < 3) pageNum = i;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 5 + i;
              else pageNum = currentPage - 2 + i;
            } else {
              pageNum = i;
            }

            if (pageNum >= totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white font-medium'
                    : 'border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Trang sau"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
export default PaginationSection