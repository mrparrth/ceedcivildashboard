import { runScriptFunction } from "../../db/index";
export const updatePayment = (dispatch, addToQueue) => (updatedPayment) => {
  dispatch({ type: "UPDATE_PAYMENT", payload: updatedPayment });
  addToQueue("updatePayment", updatedPayment);
};

export const deletePayment = (dispatch, addToQueue) => (paymentId) => {
  dispatch({ type: "DELETE_PAYMENT", payload: paymentId });
  addToQueue("deletePayment", paymentId);
};

export const createExpense =
  (dispatch, addToQueue, setError) => async (payment) => {
    try {
      let expenseId = await runScriptFunction("createExpense", payment);
      dispatch({ type: "CREATE_EXPENSE", payload: { ...payment, expenseId } });
      return expenseId;
    } catch (error) {
      throw new Error("Error creating expense: " + error);
    }
  };
