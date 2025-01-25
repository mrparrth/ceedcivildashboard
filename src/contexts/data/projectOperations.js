import { runScriptFunction } from "../../db/index";

export const createProject =
  (dispatch, addToQueue, user, addNotification) => (newProject) => {
    const projectWithDates = {
      ...newProject,
      id: crypto.randomUUID(),
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      createdBy: user?.name,
      modifiedBy: user?.name
    };

    addNotification({
      title: `Creating project ${projectWithDates.projectName}`
    });
    runScriptFunction("createProject", projectWithDates)
      .then((project) => {
        addNotification({ title: `Project ${project.projectNumber} created` });

        const newPayments =
          project.assignedTo?.map((assignee) =>
            createPaymentForAssignment(project, assignee, user)
          ) || [];

        dispatch({ type: "ADD_PROJECT", payload: project, newPayments });
        if (newPayments.length > 0) addToQueue("createPayments", newPayments);
      })
      .catch((e) => {
        addNotification({
          title: `Unfortunately failed to create ${newProject.projectName}`,
          type: "alert"
        });
      });
  };

export const updateProject =
  (dispatch, projects, addToQueue) => (updatedProject) => {
    const originalProject =
      projects.find((p) => p.id === updatedProject.id) || {};
    const newAssignees =
      updatedProject.assignedTo?.filter(
        (assignee) => !originalProject.assignedTo?.includes(assignee)
      ) || [];
    const newPayments = newAssignees.map((assignee) =>
      createPaymentForAssignment(originalProject, assignee, {
        name: updatedProject.modifiedBy
      })
    );

    dispatch({ type: "UPDATE_PROJECT", payload: updatedProject, newPayments });
    addToQueue("updateProject", updatedProject);
    if (newPayments.length > 0) addToQueue("createPayments", newPayments);
  };

export const deleteProject = (dispatch, addToQueue) => (projectId) => {
  dispatch({
    type: "UPDATE_PROJECT",
    payload: { id: projectId, isDeleted: true },
    newPayments: []
  });
  addToQueue("updateProject", { id: projectId, isDeleted: true });
};

export const archiveProjects = (dispatch, addToQueue) => (ids) => {
  dispatch({
    type: "ARCHIVE_PROJECTS",
    payload: { ids }
  });

  addToQueue("archiveProjects", ids);
};

export const unarchiveProjects = (dispatch, addToQueue) => (ids) => {
  dispatch({
    type: "UNARCHIVE_PROJECTS",
    payload: { ids }
  });

  addToQueue("unarchiveProjects", ids);
};

export const createDropboxFolder =
  (dispatch, addNotification) => async (project) => {
    runScriptFunction("createDropboxFolder", project)
      .then((url) => {
        dispatch({
          type: "CREATE_DROPBOX",
          payload: {
            id: project.id,
            projectFilesFolder: url,
            isSelected: false
          }
        });

        addNotification({
          title: `Dropbox created for Project ${project.projectNumber}`
        });
      })
      .catch((error) => {
        addNotification({
          title: `Dropbox creation failed for Project ${project.projectNumber}`,
          type: "alert"
        });
      });
  };

export const toggleProjectSelection = (dispatch) => (projectId) => {
  dispatch({
    type: "TOGGLE_PROJECT_SELECTION",
    payload: { id: projectId }
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
  datePaid: null,
  revisionNeeded: false,
  datePaid2: null,
  revisionCost: 0,
  revisionPaid: false,
  notes: "",
  totalCost: 0,
  createdBy: user?.name,
  modifiedBy: user?.name,
  dateCreated: new Date().toISOString(),
  dateModified: new Date().toISOString()
});
