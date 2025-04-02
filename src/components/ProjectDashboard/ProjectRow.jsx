import React, { useState } from "react";
import { MultiSelectDropdown, SingleSelectDropdown } from "../Fields";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import { MdDelete } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { getAssignedToBreakdown } from "utils/utils";
import ArchiveIcon from "@mui/icons-material/Archive";
import { Tooltip } from "@mui/material";

import useAppData from "hooks/useAppData";
import useData from "hooks/useData";

const ProjectRow = ({ project, viewRow, editRow, showArchivedIcon }) => {
  const { updateProject, deleteProject, toggleProjectSelection } = useData();
  const { appData } = useAppData();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    deleteProject(project.id);
    setOpenDeleteDialog(false);
  };

  const getRowStyle = () => {
    switch (project.overallProjectStatus) {
      case "Completed":
        return "table-success text-white";
      case "Sent to Client":
        return "table-info text-dark";
      case "For Ryan Review":
        return "table-danger";
      case "Pending S&S":
        return "table-warning";
      default:
        return "";
    }
  };

  return (
    <>
      <tr key={project.id} className={getRowStyle()}>
        <td>
          <input type="checkbox" checked={project.isSelected || false} onChange={(e) => toggleProjectSelection(project.id)} />
        </td>
        <td className="text-start text-wrap" style={{ minWidth: "20em" }}>
          {showArchivedIcon && project.isArchived && (
            <Tooltip title="Archived">
              <ArchiveIcon sx={{ mr: 1, fontSize: "1.2rem", color: "text.secondary" }} />
            </Tooltip>
          )}
          {project.projectName}
        </td>
        <td>{project.projectNumber}</td>
        <td>{project.invoiceNumber}</td>
        <td>
          <MultiSelectDropdown
            options={appData.assignTo}
            selectedOptions={project.assignedTo}
            setSelectedOptions={(newSelectedOptions) => {
              const { draftingTaskedTo, engineeringTaskedTo, mepTaskedTo, civilTaskedTo } = getAssignedToBreakdown(newSelectedOptions, appData);

              updateProject({
                id: project.id,
                assignedTo: newSelectedOptions,
                draftingTaskedTo,
                engineeringTaskedTo,
                mepTaskedTo,
                civilTaskedTo,
                draftingNeeded: draftingTaskedTo !== "",
                engineeringNeeded: engineeringTaskedTo !== "",
                mepNeeded: mepTaskedTo !== "",
                civilNeeded: civilTaskedTo !== "",
              });
            }}
            positionRelative={true}
            style={{ minWidth: "230px" }}
          />
        </td>
        <td>
          <select
            className="form-select w-auto"
            value={project.overallProjectStatus}
            onChange={(e) =>
              updateProject({
                id: project.id,
                overallProjectStatus: e.target.value,
              })
            }>
            <option value="" disabled>
              {"-"}
            </option>
            {appData.status.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </td>
        <td>
          <select
            className="form-select w-auto"
            value={project.state}
            onChange={(e) =>
              updateProject({
                id: project.id,
                state: e.target.value,
              })
            }>
            <option value="" disabled>
              {"-"}
            </option>
            {appData.states.map((stateName) => (
              <option key={stateName} value={stateName}>
                {stateName}
              </option>
            ))}
          </select>
        </td>
        <td>
          {project.projectFilesFolder ? (
            <a href={project.projectFilesFolder} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline-none text-[15px] text-center pl-2.5">
              View Files
            </a>
          ) : (
            <></>
          )}
        </td>
        <td>
          <div className="actions d-flex align-items-center">
            <Button className="secondary" color="secondary" onClick={() => viewRow(project.id)}>
              <FaEye />
            </Button>
            <Button className="success" color="success" onClick={() => editRow(project.id)}>
              <FaPencilAlt />
            </Button>
            <Button className="error" color="error" onClick={handleDeleteClick}>
              <MdDelete />
            </Button>
          </div>
        </td>
      </tr>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete project - {project.projectName}?
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectRow;
