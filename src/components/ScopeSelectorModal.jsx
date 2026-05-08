import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Icon,
  TextareaAutosize
} from "@mui/material";

const ScopeSelectorModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  allScopes,
  setAllScopes,
  projectScopes,
  setProjectScopes
}) => {
  const [showAllScopes, setShowAllScopes] = useState(true);
  // const [projectScopes, setProjectScopes] = useState(formData.scopes);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [draggingOver, setDraggingOver] = useState(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleFormChange = (keyvaluePair) => {
    setFormData((prevData) => ({
      ...prevData,
      ...keyvaluePair
    }));
  };

  useEffect(() => {
    updateTotalCost();
  }, [projectScopes, formData.retainerDeposit, formData.remainingBalance]);

  const handleClose = () => {
    handleFormChange({ scopes: projectScopes });
    onClose();
  };

  const toggleView = () => {
    setShowAllScopes(!showAllScopes);
    setEditingIndex(null);
  };

  const handleCheckboxChange = (index) => {
    const updatedScopes = [...allScopes];
    updatedScopes[index].selected = !updatedScopes[index].selected;
    setAllScopes(updatedScopes);
  };

  const addSelectedRows = () => {
    const newProjectScopes = allScopes.filter((scope) => scope.selected);
    setProjectScopes([...projectScopes, ...newProjectScopes]);
    setAllScopes(allScopes.map((scope) => ({ ...scope, selected: false })));
  };

  const removeItem = (index) => {
    const updatedProjectScopes = projectScopes.filter((_, i) => i !== index);
    setProjectScopes(updatedProjectScopes);
  };

  const updateTotalCost = () => {
    const totalCost =
      Math.round(
        projectScopes.reduce((acc, scope) => acc + scope.rate, 0) * 100
      ) / 100;

    const total =
      (Math.round(parseFloat(formData.retainerDeposit) * 100) / 100 || 0) +
      (Math.round(parseFloat(formData.remainingBalance) * 100) / 100 || 0);
    const gap = total - totalCost;

    handleFormChange({ totalCost, gap });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditFormData(projectScopes[index]);
  };

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: field === "rate" ? Number(value) : value,
    }));
  };

  const handleEditSave = () => {
    const updatedScopes = [...projectScopes];
    updatedScopes[editingIndex] = editFormData;
    setProjectScopes(updatedScopes);
    setEditingIndex(null);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
    setDraggingOver(index);
  };

  const handleDragLeave = () => {
    setDraggingOver(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const copyListItems = [...projectScopes];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setProjectScopes(copyListItems);
    setDraggingOver(null);
  };

  if (!isOpen) return null;

  const totalCost = formData.totalCost || 0;
  const retainerRemaining =
    (formData.retainerDeposit || 0) + (formData.remainingBalance || 0);
  const gap = retainerRemaining - totalCost;

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable  d-flex justify-content-center">
        <div className="modal-content">
          <div className="modal-header bg-light p-2">
            <div className="d-flex justify-content-between align-items-center w-100">
              <button
                className="btn btn-sm btn-danger d-flex align-items-center"
                onClick={handleClose}>
                <span
                  className="btn-close btn-close-white me-2"
                  aria-hidden="true"
                  style={{ fontSize: "0.5rem" }}></span>
                Close
              </button>
              {!showAllScopes ? (
                <div
                  className="bg-white p-2 rounded border"
                  style={{ minWidth: "400px" }}>
                  <div className="d-flex justify-content-between w-100">
                    <div className="flex-grow-1 me-1 w-75">
                      <div className="mb-2 d-flex align-items-center">
                        <label
                          htmlFor="retainer-deposit"
                          className="text-end pe-2 fw-bold w-75">
                          Retainer Deposit:
                        </label>
                        <input
                          type="number"
                          id="retainer-deposit"
                          className="form-control form-control-sm w-25"
                          value={formData.retainerDeposit || 0}
                          onChange={(e) =>
                            handleFormChange({
                              retainerDeposit:
                                Math.round(parseFloat(e.target.value) * 100) /
                                100
                            })
                          }
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <label
                          htmlFor="remaining-balance"
                          className="text-end pe-2 fw-bold w-75">
                          Balance Remaining:
                        </label>
                        <input
                          type="number"
                          id="remaining-balance"
                          className="form-control form-control-sm w-25"
                          value={formData.remainingBalance || 0}
                          onChange={(e) =>
                            handleFormChange({
                              remainingBalance:
                                Math.round(parseFloat(e.target.value) * 100) /
                                100
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1 w-50">
                      <div className="mb-2 d-flex align-items-center">
                        <span className="text-end pe-2 fw-bold w-50">
                          Total Cost:
                        </span>
                        <span className="w-50">${totalCost.toFixed(2)}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-end pe-2 fw-bold w-50">Gap:</span>
                        <span
                          className={
                            (gap === 0 ? "text-success" : "text-danger") +
                            " w-50"
                          }>
                          ${Math.abs(gap).toFixed(2)}
                          <span className="ms-1">
                            {gap === 0 ? "😃" : "😐"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div>
                {showAllScopes ? (
                  <button
                    className="btn btn-success me-2"
                    onClick={addSelectedRows}
                    type="button">
                    + Add
                  </button>
                ) : null}
                <button
                  className="btn btn-info"
                  onClick={toggleView}
                  type="button">
                  {showAllScopes ? `Show Selected (${projectScopes.length})` : "Show All"}
                </button>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th className="col-3  text-white">Desc</th>
                  <th className="col-2 text-white">Rate</th>
                  <th className="col-6 text-white">Details</th>
                  <th className="col-1 text-white">
                    {showAllScopes ? "Select" : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {showAllScopes
                  ? allScopes.map((scope, index) => (
                      <tr key={index}>
                        <td className="text-wrap">{scope.description}</td>
                        <td>${scope.rate}</td>
                        <td className="text-wrap">{scope.detail}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={scope.selected || false}
                            onChange={() => handleCheckboxChange(index)}
                            style={{ width: "1.5rem", height: "1.5rem" }}
                          />
                        </td>
                      </tr>
                    ))
                  : projectScopes.map((scope, index) => (
                      <tr
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`
                          ${dragItem.current === index ? "dragging" : ""}
                          ${draggingOver === index ? "drag-over" : ""}
                        `}>
                        <td className="text-wrap">{scope.description}</td>
                        <td>${scope.rate}</td>
                        <td className="text-wrap">{scope.detail}</td>
                        <td>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(index)}
                            sx={{ mr: 1 }}>
                            <Icon>edit</Icon>
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => removeItem(index)}>
                            <Icon>delete</Icon>
                          </IconButton>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {/* {!showAllScopes && getCostSummary()} */}
          </div>
        </div>
      </div>

      {/* Edit Scope Dialog */}
      <Dialog open={editingIndex !== null} onClose={handleEditCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editing Scope {editingIndex !== null ? editingIndex + 1 : ""}:{" "}
          {editingIndex !== null ? projectScopes[editingIndex]?.description : ""}
        </DialogTitle>
        <DialogContent>
          <div className="mb-3 mt-2">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={editFormData?.description || ""}
              onChange={(e) => handleEditChange("description", e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rate</label>
            <input
              type="number"
              className="form-control"
              value={editFormData?.rate || ""}
              onChange={(e) => handleEditChange("rate", e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Details</label>
            <TextareaAutosize
              className="form-control"
              minRows={3}
              value={editFormData?.detail || ""}
              onChange={(e) => handleEditChange("detail", e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ScopeSelectorModal;
