import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const BillingItemsModal = ({ open, onClose, onSave, initialItems = [] }) => {
  const [billingItems, setBillingItems] = useState(initialItems);
  const [newItem, setNewItem] = useState({
    description: "",
    hoursWorked: 0,
    hourlyRate: 0,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const handleBillingItemChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addBillingItem = () => {
    const totalAmount = newItem.hoursWorked * newItem.hourlyRate;
    setBillingItems((prev) => [
      ...prev,
      { ...newItem, totalAmount, slNo: prev.length + 1 },
    ]);
    setNewItem({ description: "", hoursWorked: 0, hourlyRate: 0 });
    setHasChanges(true);
  };

  const deleteBillingItem = (index) => {
    setBillingItems((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setNewItem(billingItems[index]);
  };

  const saveEdit = () => {
    const updatedItems = [...billingItems];
    const totalAmount = newItem.hoursWorked * newItem.hourlyRate;
    updatedItems[editIndex] = { ...newItem, totalAmount, slNo: editIndex + 1 };
    setBillingItems(updatedItems);
    setEditIndex(null);
    setNewItem({ description: "", hoursWorked: 0, hourlyRate: 0 });
    setHasChanges(true);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setNewItem({ description: "", hoursWorked: 0, hourlyRate: 0 });
  };

  const handleSaveAndClose = () => {
    if (hasChanges) {
      onSave(billingItems);
      setHasChanges(false);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="billing-modal-title"
      aria-describedby="billing-modal-description">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
        <Typography id="billing-modal-title" variant="h6" component="h2">
          Billing Items
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "5%" }}>SlNo</TableCell>
                <TableCell sx={{ width: "50%" }}>Description</TableCell>
                <TableCell sx={{ width: "15%" }}>Hours Worked</TableCell>
                <TableCell sx={{ width: "15%" }}>Hourly Rate</TableCell>
                <TableCell sx={{ width: "15%" }}>Total Amount</TableCell>
                <TableCell sx={{ width: "10%" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billingItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.slNo}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.hoursWorked}</TableCell>
                  <TableCell>{formatCurrency(item.hourlyRate)}</TableCell>
                  <TableCell>{formatCurrency(item.totalAmount)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => startEditing(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteBillingItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>{editIndex !== null ? "Editing" : "New"}</TableCell>
                <TableCell>
                  <TextField
                    value={newItem.description}
                    onChange={(e) =>
                      handleBillingItemChange("description", e.target.value)
                    }
                    placeholder="Enter description"
                    fullWidth
                    multiline
                    rows={1.5}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={newItem.hoursWorked}
                    onChange={(e) =>
                      handleBillingItemChange(
                        "hoursWorked",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Hours"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={newItem.hourlyRate}
                    onChange={(e) =>
                      handleBillingItemChange(
                        "hourlyRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="Rate"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  {formatCurrency(
                    newItem.hoursWorked * newItem.hourlyRate || 0
                  )}
                </TableCell>
                <TableCell>
                  {editIndex !== null ? (
                    <>
                      <IconButton color="primary" onClick={saveEdit}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={cancelEdit}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={addBillingItem}>
                      Add
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAndClose}>
            {hasChanges ? "Save and Close" : "Close"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BillingItemsModal;
