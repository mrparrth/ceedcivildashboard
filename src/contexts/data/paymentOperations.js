import { runScriptFunction } from "../../db/index";

export const createPayment = (dispatch, addToQueue) => async (payment) => {
  try {
    payment.id = crypto.randomUUID();

    addToQueue("createPayments", [payment]);
    dispatch({ type: "ADD_PAYMENT", payload: payment });
  } catch (error) {
    throw new Error("Error creating expense: " + error);
  }
};

export const updatePayment = (dispatch, addToQueue) => (updatedPayment) => {
  dispatch({ type: "UPDATE_PAYMENT", payload: updatedPayment });
  addToQueue("updatePayment", updatedPayment);
};

export const deletePayment = (dispatch, addToQueue) => (paymentId) => {
  dispatch({ type: "DELETE_PAYMENT", payload: paymentId });
  addToQueue("deletePayment", paymentId);
};

export const createFbExpense = (dispatch) => async (payment) => {
  try {
    let expenseId = await runScriptFunction("createFBExpense", payment);
    dispatch({ type: "CREATE_EXPENSE", payload: { ...payment, expenseId } });
    return expenseId;
  } catch (error) {
    throw new Error("Error creating expense: " + error);
  }
};
