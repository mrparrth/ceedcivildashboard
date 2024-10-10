import React, { useState, useRef, useEffect } from "react";
import { useContractMetadata } from "../contexts/ContractMetadataHook";

const ScopeSelectorModal = ({ isOpen, onClose, formData, setFormData }) => {
  const { contractMetadata } = useContractMetadata();
  const [showAllScopes, setShowAllScopes] = useState(true);
  const [allScopes, setAllScopes] = useState(contractMetadata.scopes);
  const [projectScopes, setProjectScopes] = useState(formData.scopes);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draggingOver, setDraggingOver] = useState(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleFormChange = (keyvaluePair) => {
    setFormData((prevData) => ({
      ...prevData,
      ...keyvaluePair,
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
    const totalCost = projectScopes.reduce(
      (acc, scope) => acc + parseFloat(scope.rate),
      0
    );

    const total = formData.retainerDeposit + formData.remainingBalance;
    const gap = total - totalCost;
    handleFormChange({ totalCost, gap });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleEditChange = (index, field, value) => {
    const updatedScopes = [...projectScopes];
    updatedScopes[index][field] = field === "rate" ? Number(value) : value;
    setProjectScopes(updatedScopes);
  };

  const handleEditSave = () => {
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
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable  d-flex justify-content-center">
        <div className="modal-content">
          <div className="modal-header bg-light p-2">
            <div className="d-flex justify-content-between align-items-center w-100">
              <button
                className="btn btn-sm btn-danger d-flex align-items-center"
                onClick={handleClose}
              >
                <span
                  className="btn-close btn-close-white me-2"
                  aria-hidden="true"
                  style={{ fontSize: "0.5rem" }}
                ></span>
                Close
              </button>
              {!showAllScopes ? (
                <div
                  className="bg-white p-2 rounded border"
                  style={{ minWidth: "400px" }}
                >
                  <div className="d-flex justify-content-between w-100">
                    <div className="flex-grow-1 me-3 w-50">
                      <div className="mb-2 d-flex align-items-center">
                        <label
                          htmlFor="retainer-deposit"
                          className="text-end pe-2 fw-bold w-75"
                        >
                          Retainer Deposit:
                        </label>
                        <input
                          type="number"
                          id="retainer-deposit"
                          className="form-control form-control-sm w-25"
                          value={formData.retainerDeposit || 0}
                          onChange={(e) =>
                            handleFormChange({
                              retainerDeposit: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <label
                          htmlFor="remaining-balance"
                          className="text-end pe-2 fw-bold w-75"
                        >
                          Balance Remaining:
                        </label>
                        <input
                          type="number"
                          id="remaining-balance"
                          className="form-control form-control-sm w-25"
                          value={formData.remainingBalance || 0}
                          onChange={(e) =>
                            handleFormChange({
                              remainingBalance: parseFloat(e.target.value) || 0,
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
                        <span className="w-50">${totalCost.toFixed(0)}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-end pe-2 fw-bold w-50">Gap:</span>
                        <span
                          className={
                            (gap === 0 ? "text-success" : "text-danger") +
                            " w-50"
                          }
                        >
                          ${Math.abs(gap).toFixed(0)}
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
                    type="button"
                  >
                    + Add
                  </button>
                ) : null}
                <button
                  className="btn btn-info"
                  onClick={toggleView}
                  type="button"
                >
                  {showAllScopes ? "Show Selected" : "Show All"}
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
                  <th className="col-1 text-white">Select</th>
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
                        `}
                      >
                        <td className="text-wrap">
                          {editingIndex === index ? (
                            <input
                              type="text"
                              className="form-control"
                              value={scope.description}
                              onChange={(e) =>
                                handleEditChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            scope.description
                          )}
                        </td>
                        <td>
                          {editingIndex === index ? (
                            <input
                              type="number"
                              value={scope.rate}
                              className="form-control"
                              onChange={(e) =>
                                handleEditChange(index, "rate", e.target.value)
                              }
                            />
                          ) : (
                            `$${scope.rate}`
                          )}
                        </td>
                        <td className="text-wrap">
                          {editingIndex === index ? (
                            <textarea
                              value={scope.detail}
                              className="form-control"
                              onChange={(e) =>
                                handleEditChange(
                                  index,
                                  "detail",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            scope.detail
                          )}
                        </td>
                        <td>
                          {editingIndex === index ? (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={handleEditSave}
                              type="button"
                            >
                              Save
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn btn-warning btn-sm me-1"
                                onClick={() => handleEdit(index)}
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => removeItem(index)}
                                type="button"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {/* {!showAllScopes && getCostSummary()} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeSelectorModal;
