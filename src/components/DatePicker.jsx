import React, { useState, useRef, useEffect } from "react";

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "";
  };

  const displayValue =
    startDate || endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : "";

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    onStartDateChange(newStartDate);
    if (endDate && new Date(newStartDate) > new Date(endDate)) {
      onEndDateChange("");
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    onEndDateChange(newEndDate);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <input
        type="text"
        className="form-control"
        value={displayValue}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="dropdown-menu show p-3" style={{ minWidth: "300px" }}>
          <div className="mb-3">
            <label className="form-label">From</label>
            <input
              type="date"
              className="form-control"
              value={startDate || ""}
              onChange={handleStartDateChange}
              max={endDate || undefined}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">To</label>
            <input
              type="date"
              className="form-control"
              value={endDate || ""}
              onChange={handleEndDateChange}
              min={startDate || undefined}
            />
          </div>
          <button className="btn btn-primary" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
