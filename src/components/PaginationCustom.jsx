import Pagination from "@mui/material/Pagination";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function PaginationCustom({
  data,
  pageNo,
  rowsPerPage = 10,
  onPageChange,
  handleRowsPerPageChange,
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
      <FormControl variant="standard" sx={{ minWidth: 80, ml: 2 }}>
        <select
          className="form-select form-select-lg"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}>
          {[50, 75, 100, 150].map((rpp) => (
            <option key={rpp} value={rpp}>
              {rpp}
            </option>
          ))}
        </select>
      </FormControl>
      {data.length === 0 && <p className="mb-0">No projects to display</p>}
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
