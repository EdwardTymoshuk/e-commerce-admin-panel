import React from "react"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  const renderPageButton = (page) => (
    <button
      key={page}
      className={`page-item ${currentPage === page ? "active" : ""}`}
      onClick={() => onPageChange(page)}
    >
      {page}
    </button>
  )

  const ellipsis = <p className="cursor-default">...</p>

  return (
    <div className="pagination flex row gap-1 py-2 justify-center">
      {currentPage > 1 && (
        <>
          <button className="page-item" onClick={() => onPageChange(currentPage - 1)}>{"<"}</button>
        </>
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
        <>
          <button className="page-item" onClick={() => onPageChange(currentPage + 1)}>{">"}</button>
        </>
      )}
    </div>
  )
}

export default Pagination
