import { useState, useEffect, useMemo, useRef } from "react";
import FinanceTable from "../components/FinanceTable";
import { useData } from "../contexts/data/DataContext";
import { FinanceTrackerFilters } from "../components/FinanceTrackerFilters";

const initialFilters = {
  startDate: null,
  endDate: null,
  assignee: "",
  salesman: "",
  projectNumber: "",
  paid: "",
};

const FinanceTracker = () => {
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const { payments } = useData();

  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("financeTrackerFilters");
    return savedFilters ? JSON.parse(savedFilters) : initialFilters;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("financeTrackerFilters", JSON.stringify(filters));
  }, [filters]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const dateFilter =
        filters.startDate && filters.endDate
          ? new Date(payment.datePaid) >= new Date(filters.startDate) &&
            new Date(payment.datePaid) <= new Date(filters.endDate)
          : true;

      const assigneeFilter = filters.assignee
        ? payment.assignee?.toLowerCase() == filters.assignee.toLowerCase()
        : true;

      const salesmanFilter = filters.salesman
        ? payment.salesMan?.toLowerCase() == filters.salesman.toLowerCase()
        : true;

      const projectNumberFilter = filters.projectNumber
        ? payment.projectNumber?.toString().includes(filters.projectNumber)
        : true;

      const paidFilter = filters.paid
        ? payment.paid === (filters.paid.toLowerCase() === "yes")
        : true;

      return (
        dateFilter &&
        assigneeFilter &&
        salesmanFilter &&
        projectNumberFilter &&
        paidFilter
      );
    });
  }, [payments, filters]);

  const handlePageChange = (event, pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    localStorage.removeItem("financeTrackerFilters");
  };

  return (
    <>
      <div className="right-content w-100">
        <FinanceTrackerFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
        />

        <FinanceTable
          pageNo={currentPage}
          onPageChange={handlePageChange}
          data={filteredPayments}
        />
      </div>
    </>
  );
};

export default FinanceTracker;
