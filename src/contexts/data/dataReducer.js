export const initialState = {
  projects: [],
  payments: [],
};

export const dataReducer = (state, action) => {
  switch (action.type) {
    case "SET_INITIAL_DATA":
      return { ...state, ...action.payload };
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        payments: [...action.newPayments, ...state.payments],
      };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? { ...project, ...action.payload }
            : project
        ),
        payments: [...action.newPayments, ...state.payments],
      };
    case "ARCHIVE_PROJECTS":
      return {
        ...state,
        projects: state.projects.map((project) =>
          action.payload.ids.includes(project.id)
            ? { ...project, isArchived: true, isSelected: false }
            : project
        ),
      };
    case "UNARCHIVE_PROJECTS":
      return {
        ...state,
        projects: state.projects.map((project) =>
          action.payload.ids.includes(project.id)
            ? { ...project, isArchived: false, isSelected: false }
            : project
        ),
      };
    case "TOGGLE_PROJECT_SELECTION":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? { ...project, isSelected: !project.isSelected }
            : project
        ),
      };
    case "CREATE_DROPBOX":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? { ...project, ...action.payload }
            : project
        ),
      };
    case "UPDATE_PAYMENT":
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === action.payload.id
            ? { ...payment, ...action.payload }
            : payment
        ),
      };
    case "DELETE_PAYMENT":
      return {
        ...state,
        payments: state.payments.filter(
          (payment) => payment.id !== action.payload
        ),
      };
    case "CREATE_EXPENSE":
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === action.payload.id
            ? { ...payment, ...action.payload }
            : payment
        ),
      };
    default:
      return state;
  }
};
