import React, { useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ProjectCard from "./ProjectCard";
import useAppData from "hooks/useAppData";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useData from "hooks/useData";
import Loader from "../LoaderCustom";

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

const ProjectKanban = ({
  projects = [],
  viewRow = () => {},
  editRow = () => {},
}) => {
  const { appData } = useAppData();
  const { updateProject, isLoading } = useData();

  const [showBlankGroups, setShowBlankGroups] = useState(false);

  const groupedProjects = useMemo(() => {
    const groups = {};

    // Add all status groups
    appData.status.forEach((status) => {
      groups[status] = projects.filter(
        (project) => project.overallProjectStatus === status
      );
    });

    // Add projects with no status
    const noStatusProjects = projects.filter(
      (project) => !project.overallProjectStatus
    );
    if (noStatusProjects.length > 0) {
      groups["No Status"] = noStatusProjects;
    }

    return groups;
  }, [projects, appData.status]);

  const handleDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;

    const { source, destination } = result;
    const projectId = result.draggableId;
    const newStatus = destination.droppableId;

    console.log("Project ID:", projectId, "New Status:", newStatus);
    if (newStatus && newStatus !== source.droppableId) {
      updateProject({
        id: projectId,
        overallProjectStatus: newStatus !== "No Status" ? newStatus : undefined,
      });
    }
  };

  // if (loading) return <Loader />;

  return (
    <>
      {projects.length === 0 && !isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 200px)",
          }}>
          <Typography variant="h6" color="text.secondary">
            No projects to display
          </Typography>
        </Box>
      ) : (
        <Box sx={{ position: "relative" }}>
          <Box
            onClick={() => setShowBlankGroups(!showBlankGroups)}
            sx={{
              position: "absolute",
              right: -8,
              top: -11,
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              backgroundColor: "transparent",
              padding: "1px 6px",
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}>
            <IconButton
              size="small"
              sx={{
                padding: 0.5,
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}>
              {showBlankGroups ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {showBlankGroups ? "Hide" : "Show"} blank groups
            </Typography>
          </Box>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                height: "calc(100vh - 200px)",
                width: "fit-content",
                minWidth: "100%",
              }}>
              {Object.entries(groupedProjects).map(([status, projects]) => {
                // Skip empty groups if showBlankGroups is false
                if (!showBlankGroups && projects.length === 0) return null;

                return (
                  <Droppable key={status} droppableId={status}>
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          width: 300,
                          p: 2,
                          bgcolor: getStatusColor(status) + "10",
                          borderTop: `4px solid ${getStatusColor(status)}`,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          {status} ({projects.length})
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            flex: 1,
                            overflowY: "auto",
                            "&::-webkit-scrollbar": {
                              width: "6px",
                            },
                            "&::-webkit-scrollbar-track": {
                              background: "#f1f1f1",
                              borderRadius: "3px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "#888",
                              borderRadius: "3px",
                              "&:hover": {
                                background: "#555",
                              },
                            },
                          }}>
                          {projects.map((project, index) => (
                            <Draggable
                              key={project.id}
                              draggableId={project.id}
                              index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  <ProjectCard
                                    project={project}
                                    viewRow={viewRow}
                                    editRow={editRow}
                                    showArchivedIcon={true}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Box>
                      </Paper>
                    )}
                  </Droppable>
                );
              })}
            </Box>
          </DragDropContext>
        </Box>
      )}
      {isLoading && <Loader />}
    </>
  );
};

export default ProjectKanban;
