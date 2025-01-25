import { useState, useEffect, useMemo } from "react";
import {
  FinanceTrackerFilters,
  FinanceTable,
  FinanceActionBar
} from "../components/FinanceDashboard";
import { Container } from "@mui/material";
import useData from "hooks/useData";
import useNotification from "hooks/useNotification";
import { ConfirmationModal } from "../components";
import { NewPaymentModal } from "../components/FinanceDashboard/";

const initialFilters = {
  startDate: null,
  endDate: null,
  assignee: "",
  salesman: "",
  projectNumber: "",
  paid: ""
};

const FinanceTracker = () => {
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const { payments, createFbExpense } = useData();
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processedRowsCount, setProcessedRowsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalChoices, setModalChoices] = useState([]);
  const [justCompleted, setJustCompleted] = useState(false);
  const [isNewPaymentModalOpen, setIsNewPaymentModalOpen] = useState(false);

  const { addNotification } = useNotification();

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
        ? payment.paid == (filters.paid.toLowerCase() === "yes")
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

  const totalExpenses = useMemo(() => {
    return filteredPayments.reduce(
      (total, payment) =>
        total +
        ((typeof payment.totalCost === "string"
          ? parseFloat(payment.totalCost)
          : payment.totalCost) || 0),
      0
    );
  }, [filteredPayments]);

  const handlePageChange = (event, pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (name, value) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    localStorage.removeItem("financeTrackerFilters");
  };

  const handleRowSelection = (rows) => {
    setSelectedRows(rows);
  };

  const handleCreateFbExpense = () => {
    const rowsWithExpenses = selectedRows.filter((row) => row.expenseId);
    const rowsWithoutExpenses = selectedRows.filter((row) => !row.expenseId);

    if (rowsWithExpenses.length > 0) {
      setModalTitle("Existing Expenses Detected");
      setModalMessage(
        `There are existing expenses for ${rowsWithExpenses.length} item(s).`
      );

      const choices = [
        {
          label: `Create for All (${selectedRows.length} items)`,
          value: "all"
        }
      ];

      if (rowsWithoutExpenses.length > 0) {
        choices.push({
          label: `Create Only for New (${rowsWithoutExpenses.length} items)`,
          value: "new"
        });
      }
      setModalChoices(choices);

      setIsModalOpen(true);
    } else {
      processExpenseCreation(selectedRows);
    }
  };

  const handleNewPayment = () => {
    setIsNewPaymentModalOpen(true);
  };

  const processExpenseCreation = (rows) => {
    setLoading(true);
    setProcessedRowsCount(0);
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    rows.forEach((row, index) => {
      createFbExpense(row)
        .then(() => {
          setProcessedRowsCount((c) => c + 1);
          successCount++;
          if (index === rows.length - 1) {
            finishProcess();
          }
        })
        .catch((error) => {
          setProcessedRowsCount((c) => c + 1);
          failCount++;
          errors.push({
            projectNumber: row.projectNumber,
            error: error.message
          });
          if (index === rows.length - 1) {
            finishProcess();
          }
        });
    });

    const finishProcess = async () => {
      if (successCount > 0) {
        addNotification({
          title: `Successfully created ${successCount} expense(s)`,
          type: "success"
        });
      }

      if (failCount > 0) {
        const errorMessage = errors
          .map((e) => `Project ${e.projectNumber}: ${e.error}`)
          .join("\n");
        addNotification({
          title: `Failed to create ${failCount} expense(s)`,
          subtitle: errorMessage,
          type: "alert"
        });
      }

      setJustCompleted(true);

      // Wait for 3 seconds before resetting states
      setTimeout(() => {
        setProcessedRowsCount(0);
        setSelectedRows([]);
        setLoading(false);
        setJustCompleted(false);
      }, 3000);
    };
  };

  const handleModalConfirm = (choice) => {
    setIsModalOpen(false);
    if (choice === "all") {
      processExpenseCreation(selectedRows);
    } else if (choice === "new") {
      const rowsWithoutExpenses = selectedRows.filter((row) => !row.expenseId);
      setSelectedRows((row) => rowsWithoutExpenses);
      processExpenseCreation(rowsWithoutExpenses);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Container maxWidth={false} sx={{ py: 2, px: { xs: 1, sm: 2, md: 2 } }}>
      <FinanceTrackerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
      />

      <FinanceActionBar
        selectedRows={selectedRows}
        totalExpenses={totalExpenses}
        loading={loading || justCompleted}
        processedRowsCount={processedRowsCount}
        justCompleted={justCompleted}
        handleNewPayment={handleNewPayment}
        onCreateFreshbooksExpense={handleCreateFbExpense}
      />

      <FinanceTable
        pageNo={currentPage}
        onPageChange={handlePageChange}
        data={filteredPayments}
        selectedRows={selectedRows}
        onRowSelection={handleRowSelection}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title={modalTitle}
        message={modalMessage}
        choices={modalChoices}
      />

      {isNewPaymentModalOpen && (
        <NewPaymentModal closeModal={() => setIsNewPaymentModalOpen(false)} />
      )}
    </Container>
  );
};

export default FinanceTracker;
