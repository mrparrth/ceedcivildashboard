import { runScriptFunction } from "../../db/index";

const findNewItemsInArray = (oldArray, newArray) =>
  (newArray || []).filter((item) => !(oldArray || []).includes(item)) || [];

export const createProject =
  (dispatch, addToQueue, user, addNotification) => (newProject) => {
    const newPayments = [];

    const processTask = (taskField, estimateField) => {
      const assignees = newProject[taskField] || [];
      const estimate = newProject[estimateField] || 0;

      assignees.forEach((assignee) => {
        const payment = createPaymentForAssignment(newProject, assignee, user);

        // If there's an estimate, add it to the payment
        if (estimate > 0) {
          payment.estimatedBudget = estimate;
        }

        newPayments.push(payment);
      });
    };

    // Process each type of task
    processTask("draftingTaskedTo", "draftingEstimate");
    processTask("engineeringTaskedTo", "engineeringEstimate");
    processTask("mepTaskedTo", "mepEstimate");
    processTask("civilTaskedTo", "civilEstimate");

    const projectWithDates = {
      ...newProject,
      id: crypto.randomUUID(),
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      createdBy: user?.name,
      modifiedBy: user?.name,
      payments: newPayments.map((payment) => ({
        assignedTo: payment.assignee,
        paymentId: payment.id,
      })),
    };

    addNotification({
      title: `Creating project ${projectWithDates.projectName}`,
    });

    addToQueue("createProject", projectWithDates, {
      immediate: true, // This will bypass debounce
      onSuccess: (project) => {
        addNotification({ title: `Project ${project.projectNumber} created` });
        dispatch({ type: "ADD_PROJECT", payload: project, newPayments });

        if (newPayments.length > 0) {
          addToQueue("createPayments", newPayments);
        }
      },
      onError: (error) => {
        addNotification({
          title: `Unfortunately failed to create ${newProject.projectName}`,
          type: "alert",
        });
      },
    });
  };

export const updateProject =
  (dispatch, projects, payments, addToQueue, user) => (updatedProject) => {
    //if there is a new assignee, creates a new payment
    //if payment already exists, then updates the estimate if there is a new estimate
    const originalProject =
      projects.find((p) => p.id === updatedProject.id) || {};

    const newlyAddedUsers = findNewItemsInArray(
      originalProject.assignedTo,
      updatedProject.assignedTo
    );

    const newPayments = [];
    const updatedPayments = [];

    const processTask = (taskField, estimateField) => {
      const newAssignees = findNewItemsInArray(
        originalProject[taskField],
        updatedProject[taskField]
      );

      newAssignees.forEach((assignee) => {
        if (!newlyAddedUsers.includes(assignee)) return;
        const hasExistingPayment = originalProject.payments?.some(
          (exp) => exp.assignedTo === assignee
        );

        if (!hasExistingPayment) {
          const payment = createPaymentForAssignment(
            originalProject,
            assignee,
            user
          );

          payment.estimatedBudget = updateProject[estimateField];

          newPayments.push(payment);
        }
      });

      const oldEstimate = originalProject[estimateField] || 0;
      const newEstimate = updatedProject[estimateField] || 0;

      if (oldEstimate !== newEstimate) {
        originalProject.payments?.forEach((originalProjectPayment) => {
          if (
            updatedProject[taskField]?.includes(
              originalProjectPayment.assignedTo
            )
          ) {
            const existingPaymentInfo = payments.find(
              (payment) => payment.id == originalProjectPayment.paymentId
            );

            updatedPayments.push({
              ...existingPaymentInfo,
              estimatedBudget: newEstimate,
            });
          }
        });
      }
    };

    processTask("draftingTaskedTo", "draftingEstimate");
    processTask("engineeringTaskedTo", "engineeringEstimate");
    processTask("mepTaskedTo", "mepEstimate");
    processTask("civilTaskedTo", "civilEstimate");

    const updatedProjectWithPayments = {
      ...updatedProject,
      payments: [
        ...originalProject.payments,
        ...newPayments.map((payment) => ({
          assignedTo: payment.assignee,
          paymentId: payment.id,
        })),
      ],
    };

    dispatch({
      type: "UPDATE_PROJECT",
      payload: updatedProjectWithPayments,
      newPayments,
      updatedPayments,
    });

    addToQueue("updateProject", updatedProject);
    if (newPayments.length > 0) addToQueue("createPayments", newPayments);
    if (updatedPayments.length > 0)
      updatedPayments.forEach((updatedPayment) =>
        addToQueue("updatePayment", updatedPayment)
      );
  };

export const addNewChat = (dispatch, addToQueue) => (projectId, chat) => {
  dispatch({
    type: "ADD_CHAT_MESSAGE",
    payload: { projectId, chat },
  });
  addToQueue("newChat", { projectId, chat });
};

export const updateChat =
  (dispatch, addToQueue) => (projectId, updatedChat) => {
    dispatch({
      type: "UPDATE_CHAT_MESSAGE",
      payload: { projectId, updatedChat },
    });
    addToQueue("updateChat", { projectId, updatedChat });
  };

export const deleteProject = (dispatch, addToQueue) => (projectId) => {
  dispatch({
    type: "UPDATE_PROJECT",
    payload: { id: projectId, isDeleted: true },
    newPayments: [],
  });
  addToQueue("updateProject", { id: projectId, isDeleted: true });
};

export const archiveProjects = (dispatch, addToQueue) => (ids) => {
  dispatch({
    type: "ARCHIVE_PROJECTS",
    payload: { ids },
  });

  addToQueue("archiveProjects", ids);
};

export const unarchiveProjects = (dispatch, addToQueue) => (ids) => {
  dispatch({
    type: "UNARCHIVE_PROJECTS",
    payload: { ids },
  });

  addToQueue("unarchiveProjects", ids);
};

//create dropbox folder is unused
export const createDropboxFolder =
  (dispatch, addNotification) => async (project) => {
    runScriptFunction("createDropboxFolder", project)
      .then((url) => {
        dispatch({
          type: "CREATE_DROPBOX",
          payload: {
            id: project.id,
            projectFilesFolder: url,
            isSelected: false,
          },
        });

        addNotification({
          title: `Dropbox created for Project ${project.projectNumber}`,
        });
      })
      .catch((error) => {
        addNotification({
          title: `Dropbox creation failed for Project ${project.projectNumber}`,
          type: "alert",
        });
      });
  };

export const toggleProjectSelection = (dispatch) => (projectId) => {
  dispatch({
    type: "TOGGLE_PROJECT_SELECTION",
    payload: { id: projectId },
  });
};

const createPaymentForAssignment = (project, assignee, user) => ({
  id: crypto.randomUUID(),
  projectId: project.id,
  assignee,
  projectNumber: project.projectNumber,
  projectName: project.projectName,
  salesMan: project.salesMan,
  projectStatus: project.overallProjectStatus,
  estimatedBudget: project.estimatedBudget,
  actualCost: 0,
  paid: false,
  datePaid: "",
  revisionNeeded: false,
  datePaid2: "",
  revisionCost: 0,
  revisionPaid: false,
  notes: "",
  totalCost: 0,
  expenseId: "",
  createdBy: user?.name,
  modifiedBy: user?.name,
  dateCreated: new Date().toISOString(),
  dateModified: new Date().toISOString(),
});
