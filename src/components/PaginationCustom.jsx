import Pagination from "@mui/material/Pagination";
export default function PaginationCustom({
  data,
  pageNo,
  rowsPerPage = 10,
  onPageChange
}) {
  const indexOfLastRow = pageNo * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="d-flex justify-content-between align-items-center mt-2">
      {data.length > 0 && (
        <p className="mb-0">
          Showing <b>{indexOfFirstRow + 1}</b> to{" "}
          <b>{Math.min(indexOfLastRow, data.length)}</b> of <b>{data.length}</b>{" "}
          results
        </p>
      )}
      {data.length === 0 && <p className="mb-0">No results to display</p>}
      {
        <Pagination
          count={totalPages}
          page={pageNo}
          onChange={onPageChange} // Pass the page change handler here
          color="primary"
          showFirstButton
          showLastButton
        />
      }
    </div>
  );
}
