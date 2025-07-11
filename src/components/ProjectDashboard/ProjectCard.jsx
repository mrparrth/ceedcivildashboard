import React from "react";
import { Card, CardContent, Typography, Box, Chip, Link, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArchiveIcon from "@mui/icons-material/Archive";

const EstimatedDateRow = ({ label, startDate, endDate, icon: Icon }) => (
  <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    {Icon && <Icon fontSize="small" sx={{ color: "#1976d2" }} />}
    {label}: <span style={{ fontWeight: "bold", color: "#1976d2" }}>{startDate}</span> <ArrowForwardIcon fontSize="small" sx={{ verticalAlign: "middle", color: "#757575" }} /> <span style={{ fontWeight: "bold", color: "#1976d2" }}>{endDate}</span>
  </Typography>
);

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
  borderRadius: "12px",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const ProjectCard = ({ project, editRow, showArchivedIcon }) => {
  const handleClick = () => {
    editRow(project.id);
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  let { projectName, engineeringEstimatedStartTime, draftingEstimatedStartTime, mepEstimatedStartTime, civilEstimatedStartTime, engineeringEstimatedDeliveryTime, draftingEstimatedDeliveryTime, mepEstimatedDeliveryTime, civilEstimatedDeliveryTime } = project;

  const hasEstimatedDates = !!project.engineeringEstimatedDeliveryTime || !!project.draftingEstimatedDeliveryTime || !!project.mepEstimatedDeliveryTime || !!project.civilEstimatedDeliveryTime;

  const hasEstimatedStartDates = !!project.engineeringEstimatedStartTime || !!project.draftingEstimatedStartTime || !!project.mepEstimatedStartTime || !!project.civilEstimatedStartTime;

  const formatDate = (date) => {
    if (!date) return "n/a";
    return new Date(date).toLocaleDateString();
  };

  return (
    <StyledCard onClick={handleClick}>
      <CardContent sx={{ padding: "12px", paddingBottom: "12px !important" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {showArchivedIcon && project.isArchived && <ArchiveIcon fontSize="small" sx={{ color: "text.secondary" }} />}
            {project.projectName && (
              <Typography variant="h6" component="div">
                {project.projectName}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {project.projectNumber && <Chip label={"#" + project.projectNumber} size="small" color="default" variant="outlined" />}
            {project.state && <Chip label={project.state} size="small" color="default" variant="outlined" />}

            {project.projectType && <Chip label={project.projectType} size="small" color="default" variant="outlined" />}
          </Box>

          {project.assignedTo && project.assignedTo.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Assigned to: {project.assignedTo.join(", ")}
            </Typography>
          )}

          {(hasEstimatedDates || hasEstimatedStartDates) && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold", mb: 1 }}>
                Estimated Dates:
              </Typography>

              {project.engineeringNeeded && <EstimatedDateRow label="Engineering" startDate={formatDate(project.engineeringEstimatedStartTime)} endDate={formatDate(project.engineeringEstimatedDeliveryTime)} />}
              {project.draftingNeeded && <EstimatedDateRow label="Drafting" startDate={formatDate(project.draftingEstimatedStartTime)} endDate={formatDate(project.draftingEstimatedDeliveryTime)} />}
              {project.mepNeeded && <EstimatedDateRow label="MEP" startDate={formatDate(project.mepEstimatedStartTime)} endDate={formatDate(project.mepEstimatedDeliveryTime)} />}
              {project.civilNeeded && <EstimatedDateRow label="Civil" startDate={formatDate(project.civilEstimatedStartTime)} endDate={formatDate(project.civilEstimatedDeliveryTime)} />}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            {project.projectFilesFolder && (
              <Link
                href={project.projectFilesFolder}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}>
                View Files
              </Link>
            )}

            {/* Bubble for personWorking */}
            {project.personWorking && (
              <Tooltip title={project.personWorking} arrow>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    boxShadow: 2,
                    cursor: "default",
                    padding: "0 6px", // Reduced top and bottom padding
                  }}>
                  {getInitials(project.personWorking)}
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

const getStatusColor = (status) => {
  const colors = {
    Hold: "#BDBDBD",
    "Pending Start": "#44AA80",
    "In Work": "#44AA80",
    "For Ryan Review": "#42A5F5",
    "Sent to Client": "#66BB6A",
    "Pending S&S": "#FFA726",
    "Rework/Updates": "#FFA726",
    "Submitted for Premit": "#42A5F5",
    Completed: "#66BB6A",
    Final: "#78909C",
    Cancelled: "#BDBDBD",
    "Not Started": "#BDBDBD",
    "No Status": "#BDBDBD",
  };
  return colors[status] || "#BDBDBD";
};

export default ProjectCard;
