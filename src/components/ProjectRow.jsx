import React, { useState, useContext, useEffect } from "react";
import { MultiSelectDropdown } from "./Fields";
import { useData } from "../contexts/DataContext";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import { MdDelete } from "react-icons/md";
import { useData } from "../contexts/DataContext";

const ProjectTableRow = ({ project, viewRow, editRow }) => {
  const { updateProject } = useData();
  const { metadata, deleteProject } = useData();
  return (
    <tr key={project.id}>
      <td>
        <input
          type="checkbox"
          checked={project.isSelected || false}
          onChange={(e) =>
            updateProject({ id: project.id, isSelected: e.target.checked })
          }
        />
      </td>
      <td className="text-start w-25 text-wrap" style={{ minWidth: "25em" }}>
        {project.projectName}
      </td>
      <td>{project.projectNumber}</td>
      <td>{project.invoiceNumber}</td>
      <td>
        <MultiSelectDropdown
          options={metadata.assignTo}
          selectedOptions={project.assignedTo}
          setSelectedOptions={(newSelectedOptions) =>
            updateProject({ id: project.id, assignedTo: newSelectedOptions })
          }
          positionRelative={true}
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
          }
        >
          {metadata.status.map((status) => (
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
          }
        >
          {metadata.states.map((stateName) => (
            <option key={stateName} value={stateName}>
              {stateName}
            </option>
          ))}
        </select>
      </td>
      <td>
        <a
          href={project.projectFilesFolder}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline-none text-[15px] text-center pl-2.5"
        >
          View Files
        </a>
      </td>
      <td>
        <div className="actions d-flex align-items-center">
          <Button
            className="secondary"
            color="secondary"
            onClick={() => viewRow(project.id)} // Call the prop method for modal
          >
            <FaEye />
          </Button>
          <Button
            className="success"
            color="success"
            onClick={() => editRow(project.id)}
          >
            <FaPencilAlt />
          </Button>
          <Button
            className="error"
            color="error"
            onClick={() => deleteProject(project.id)}
          >
            <MdDelete />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ProjectTableRow;
