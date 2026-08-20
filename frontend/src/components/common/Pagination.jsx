import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, totalElements, pageSize, onPageChange }) => {
  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  // Calculate which page numbers to show (max 5 at a time)
  const getPageNumbers = () => {
    const pages = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 0;
      endPage = totalPages - 1;
    } else if (currentPage <= 2) {
      startPage = 0;
      endPage = 4;
    } else if (currentPage >= totalPages - 3) {
      startPage = totalPages - 5;
      endPage = totalPages - 1;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }

    // Leading ellipsis
    if (startPage > 0) {
      pages.push({ type: 'page', number: 0 });
      if (startPage > 1) {
        pages.push({ type: 'ellipsis', key: 'start' });
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push({ type: 'page', number: i });
    }

    // Trailing ellipsis
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push({ type: 'ellipsis', key: 'end' });
      }
      pages.push({ type: 'page', number: totalPages - 1 });
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
      {/* Showing X-Y of Z */}
      <p className="text-sm text-gray-500 order-2 sm:order-1">
        Showing <span className="font-semibold text-gray-700">{startItem}</span>–<span className="font-semibold text-gray-700">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-700">{totalElements}</span> issues
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous button */}
        <button
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((item, idx) =>
            item.type === 'ellipsis' ? (
              <span key={item.key} className="px-2 py-2 text-sm text-gray-400">
                …
              </span>
            ) : (
              <button
                key={item.number}
                onClick={() => onPageChange(item.number)}
                className={`min-w-[36px] h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                  currentPage === item.number
                    ? 'bg-primary text-white shadow-sm shadow-primary/25'
                    : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {item.number + 1}
              </button>
            )
          )}
        </div>

        {/* Next button */}
        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
