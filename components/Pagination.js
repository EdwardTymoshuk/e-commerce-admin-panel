/**
 * Pagination component for navigating through pages.
 *
 * @param {Object} props - Component props.
 * @param {number} props.currentPage - Current active page.
 * @param {number} props.totalPages - Total number of pages.
 * @param {Function} props.onPageChange - Callback function for page change.
 * @returns {JSX.Element} - Pagination component.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate an array of page numbers from 1 to totalPages
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  /**
   * Render a page button.
   *
   * @param {number} page - Page number.
   * @returns {JSX.Element} - Page button.
   */
  const renderPageButton = (page) => (
    <button
      key={page}
      className={`page-item ${currentPage === page ? "active" : ""}`}
      onClick={() => onPageChange(page)}
    >
      {page}
    </button>
  )

  // Element representing an ellipsis for indicating skipped pages
  const ellipsis = <p key={Math.random()} className="cursor-default">...</p>

  return (
    <div className="pagination flex row gap-1 py-2 justify-center">
      {currentPage > 1 && (
        <button className="page-item" onClick={() => onPageChange(currentPage - 1)}>
          {"<"}
        </button>
      )}

      {pageNumbers.map((page) => {
        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
          return renderPageButton(page)
        } else if (page === currentPage - 2 || page === currentPage + 2) {
          return ellipsis
        }
        return null
      })}

      {currentPage < totalPages && (
        <button className="page-item" onClick={() => onPageChange(currentPage + 1)}>
          {">"}
        </button>
      )}
    </div>
  )
}

export default Pagination
