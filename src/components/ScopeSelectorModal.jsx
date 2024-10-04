import React, { useState, useRef, useEffect } from "react";
import { useData } from "../contexts/DataContext";

const ScopeSelectorModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  handleChange,
}) => {
  const { metadata } = useData();
  const [showAllScopes, setShowAllScopes] = useState(true);
  const [allScopes, setAllScopes] = useState(metadata.scopes);
  const [selectedScopes, setSelectedScopes] = useState(formData.scopes);
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
  }, [formData.scopes, formData.retainerDeposit, formData.remainingBalance]);

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
    const newSelectedScopes = allScopes.filter((scope) => scope.selected);
    handleFormChange({ scopes: newSelectedScopes });
    setAllScopes(allScopes.map((scope) => ({ ...scope, selected: false })));
  };

  const removeItem = (index) => {
    const updatedSelectedScopes = selectedScopes.filter((_, i) => i !== index);
    handleFormChange({ scopes: updatedSelectedScopes });
  };

  const updateTotalCost = () => {
    const totalCost = formData.scopes.reduce(
      (acc, scope) => acc + parseFloat(scope.rate),
      0
    );

    const total = formData.retainerDeposit + formData.remainingBalance;
    const gap = total - totalCost;
    handleFormChange({ totalCost, gap });
  };

  const getCostSummary = () => {
    const totalCost = formData.totalCost;
    const retainerRemaining =
      formData.retainerDeposit + formData.remainingBalance;
    const gap = retainerRemaining - totalCost;
    const gapValueFormatted = Math.abs(gap).toFixed(2);

    let gapClass = "mb-0 fw-bold ";
    let gapIcon = "";

    if (gap === 0) {
      gapClass += "text-success";
      gapIcon = "😃";
    } else {
      gapClass += "text-danger";
      gapIcon = "😐";
    }

    return (
      <div className="row align-items-center bg-light p-3 rounded">
        <div className="col-md-4">
          <p className="mb-0 fw-bold text-primary">
            Total Cost:{" "}
            <span className="text-dark">${totalCost.toFixed(2)}</span>
          </p>
        </div>
        <div className="col-md-4">
          <p className="mb-0 fw-bold text-primary">
            Retainer Remaining:{" "}
            <span className="text-dark">${retainerRemaining.toFixed(2)}</span>
          </p>
        </div>
        <div className="col-md-4">
          <p className={gapClass} id="gap-label">
            Gap: ${gap >= 0 ? gapValueFormatted : `-${gapValueFormatted}`}
            <span className="ms-2" id="gap-icon">
              {gapIcon}
            </span>
          </p>
        </div>
      </div>
    );
  };

  // const handleSave = () => {
  //   onScopesSelected(selectedScopes, totalCost);
  //   onClose();
  // };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleEditChange = (index, field, value) => {
    const updatedScopes = [...selectedScopes];
    updatedScopes[index][field] = field === "rate" ? Number(value) : value;
    setSelectedScopes(updatedScopes);
    updateTotalCost(updatedScopes);
  };

  const handleEditSave = () => {
    setEditingIndex(null);
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;

    // Create a custom drag image
    const dragRow = e.target.cloneNode(true);
    dragRow.style.width = e.target.offsetWidth + "px";
    dragRow.style.backgroundColor = "#f0f0f0";
    dragRow.style.opacity = "0.8";
    dragRow.style.position = "absolute";
    dragRow.style.top = "-1000px";
    document.body.appendChild(dragRow);

    e.dataTransfer.setDragImage(dragRow, 0, 0);

    setTimeout(() => {
      document.body.removeChild(dragRow);
    }, 0);

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
    const copyListItems = [...selectedScopes];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setSelectedScopes(copyListItems);
    setDraggingOver(null);
    updateTotalCost(copyListItems);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable d-flex justify-content-center">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Scope Selector</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* style={{ maxHeight: "70vh", overflowY: "auto" }} */}
            <div className="d-flex justify-content-between mb-3">
              <button
                className="btn btn-primary"
                onClick={onClose}
                type="button"
              >
                ← Back To Form
              </button>
              {showAllScopes && (
                <button
                  className="btn btn-success"
                  onClick={addSelectedRows}
                  type="button"
                >
                  + Add
                </button>
              )}
              <button
                className="btn btn-info"
                onClick={toggleView}
                type="button"
              >
                {showAllScopes ? "Show Selected" : "Show All"}
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th className="col-3">Desc</th>
                    <th className="col-2">Rate</th>
                    <th className="col-6">Details</th>
                    <th className="col-1">Select</th>
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
                    : selectedScopes.map((scope, index) => (
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
                                  handleEditChange(
                                    index,
                                    "rate",
                                    e.target.value
                                  )
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
            </div>
            {!showAllScopes && (
              <>
                {getCostSummary()}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="retainer-deposit" className="form-label">
                      Retainer Deposit
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="retainer-deposit"
                      value={formData.retainerDeposit}
                      onChange={(e) =>
                        handleFormChange({
                          retainerDeposit: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="remaining-balance" className="form-label">
                      Remaining Balance
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="remaining-balance"
                      value={formData.remainingBalance}
                      onChange={(e) =>
                        handleFormChange({
                          remainingBalance: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeSelectorModal;
