import DateRangePicker from "../components/DatePicker";
import { useData } from "../contexts/data/DataContext";

const FinanceTrackerFilters = ({ filters, onFilterChange, onResetFilters }) => {
  let { metadata } = useData();

  return (
    <div className="w-100 rounded-2 bg-success p-2 text-white bg-opacity-25 d-flex flex-wrap shadow align-items-center gap-1">
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
          onChange={(e) => onFilterChange("assignee", e.target.value)}
        >
          <option value="">Assignee (All)</option>
          {(metadata.assignTo || []).map((assignee) => (
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
          onChange={(e) => onFilterChange("salesman", e.target.value)}
        >
          <option value="">Salesman (All)</option>
          {(metadata.salesmen || []).map((salesman) => (
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
          onChange={(e) => onFilterChange("paid", e.target.value)}
        >
          <option value="">Paid (All)</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-md-auto">
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={onResetFilters}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export { FinanceTrackerFilters };
