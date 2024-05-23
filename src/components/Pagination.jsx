import "./pagination.css";

// eslint-disable-next-line react/prop-types
const Pagination = ({ page, totalPages, selectPage }) => {
  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= totalPages &&
      selectedPage !== page
    ) {
      selectPage(selectedPage);
    }
  };

  // to limit visible pagination numbers
  const maxPagesToShow = 10;
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pages = [...Array(endPage - startPage + 1)].map(
    (_, i) => startPage + i
  );

  return (
    <div className="pagination">
      <span
        onClick={() => selectPageHandler(page - 1)}
        className={page > 1 ? "" : "pagination__disable"}
      >
        ◀️
      </span>

      {pages.map((pageNumber) => {
        return (
          <span
            key={pageNumber}
            className={page === pageNumber ? "pagination__selected" : ""}
            onClick={() => selectPageHandler(pageNumber)}
          >
            {pageNumber}
          </span>
        );
      })}

      <span
        onClick={() => selectPageHandler(page + 1)}
        className={page < totalPages ? "" : "pagination__disable"}
      >
        ▶️
      </span>
    </div>
  );
};

export default Pagination;
