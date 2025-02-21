import DateRangePicker from "../DatePicker";
import {
  Button,
  Container,
  Paper,
  Box,
  Typography,
  Toolbar,
  useTheme,
  useMediaQuery
} from "@mui/material";
import useAppData from "hooks/useAppData";

const FinanceTrackerFilters = ({ filters, onFilterChange, onResetFilters }) => {
  let { appData } = useAppData();

  return (
    <Paper elevation={3}>
      <Toolbar
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          bgcolor: "grey.100"
        }}>
        <div className="col-md-2 flex-grow-1">
          <DateRangePicker
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStartDateChange={(value) => onFilterChange("startDate", value)}
            onEndDateChange={(value) => onFilterChange("endDate", value)}
          />
        </div>
        <div className="col-md flex-grow-1">
          <select
            className="form-select form-select-lg"
            value={filters.assignee}
            onChange={(e) => onFilterChange("assignee", e.target.value)}>
            <option value="">Assignee (All)</option>
            {(appData.assignTo || []).map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md flex-grow-1">
          <select
            className="form-select form-select-lg"
            value={filters.salesman}
            onChange={(e) => onFilterChange("salesman", e.target.value)}>
            <option value="">Salesman (All)</option>
            {(appData.salesmen || []).map((salesman) => (
              <option key={salesman} value={salesman}>
                {salesman}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md flex-grow-1">
          <input
            type="text"
            className="form-control"
            placeholder="Project Number"
            value={filters.projectNumber}
            onChange={(e) => onFilterChange("projectNumber", e.target.value)}
            spellCheck="false"
          />
        </div>
        <div className="col-md flex-grow-1">
          <select
            className="form-select form-select-lg"
            value={filters.paid}
            onChange={(e) => onFilterChange("paid", e.target.value)}>
            <option value="">Paid (All)</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="col-md-auto">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}>
            Reset Filters
          </button>
        </div>
      </Toolbar>
    </Paper>
  );
};

export default FinanceTrackerFilters;
