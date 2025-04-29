import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Paper,
  Box,
  Typography,
  Toolbar,
  useTheme,
  useMediaQuery,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArchiveIcon from "@mui/icons-material/Archive";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import {
  ProjectModal,
  ProjectTable,
  ProjectKanban,
} from "../components/ProjectDashboard";
import useNotification from "hooks/useNotification";
import useData from "hooks/useData";
import useAuth from "hooks/useAuth";

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const ViewToggleToolbar = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  minWidth: "96px",
  backgroundColor: theme.palette.background.paper,
}));

const ProjectTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalProjectKey, setModalProjectKey] = useState(null);
  const {
    projects,
    archiveProjects,
    createDropboxFolder,
    updateProjectStatus,
  } = useData();
  const { user } = useAuth();

  const [includeArchived, setIncludeArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState(
    user.defaultDashboard?.toLowerCase() || "kanban"
  ); // 'table' or 'kanban'

  const { addNotification } = useNotification();

  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.only("xs"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const setModalOpen = (projectKey, viewOnly = false) => {
    setModalProjectKey(projectKey);
    setIsModalOpen(true);
    setModalReadOnly(viewOnly);
  };

  const handleCloseModal = () => {
    setModalProjectKey(null);
    setIsModalOpen(false);
  };

  const handlePageChange = (event, pageNumber) => setCurrentPage(pageNumber);

  const handleViewProject = (key) => setModalOpen(key, true);

  const handleEditProject = (key) => setModalOpen(key);

  const showNewProjectModal = () => setModalOpen(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleArchiveProject = () => {
    let selectedProjects = projects
      .filter((project) => project.isSelected)
      .filter((project) => !project.isArchived)
      .map((project) => project.id);
    if (selectedProjects.length > 0) {
      archiveProjects(selectedProjects);
    } else {
      addNotification({
        title: "No active projects selected which can be archived",
        type: "alert",
      });
    }
  };

  const handleDropboxFolderCreation = () => {
    let selectedProjects = projects.filter((project) => project.isSelected);
    selectedProjects.forEach((project) => createDropboxFolder(project));
  };

  const filteredProjects = projects.filter((project) => {
    return (
      (includeArchived || !project.isArchived) &&
      !project.isDeleted &&
      (searchQuery === "" ||
        [
          project.projectName,
          project.description,
          project.projectNotes,
          project.projectNumber.toString(),
        ].some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
  });

  return (
    <Container maxWidth={false} sx={{ py: 2, px: { xs: 1, sm: 2, md: 2 } }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Paper elevation={3} sx={{ flex: 1 }}>
          <Toolbar
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              justifyContent: "space-between",
            }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}>
              <StyledButton
                variant="contained"
                color="secondary"
                startIcon={<ArchiveIcon />}
                onClick={handleArchiveProject}
                fullWidth={isXsScreen}>
                Archive Project(s)
              </StyledButton>
              <StyledButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={showNewProjectModal}
                fullWidth={isXsScreen}>
                New Project
              </StyledButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}>
              <TextField
                size="small"
                placeholder="Search project by number, name, description, or note"
                sx={{ minWidth: 420 }}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeArchived}
                    onChange={(e) => setIncludeArchived(e.target.checked)}
                    color="primary"
                  />
                }
                label="Include Archived"
              />
            </Box>
          </Toolbar>
        </Paper>

        <ViewToggleToolbar elevation={3}>
          <Tooltip title="Table View">
            <IconButton
              onClick={() => setViewMode("table")}
              color={viewMode === "table" ? "primary" : "default"}
              size="small">
              <ViewListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Kanban View">
            <IconButton
              onClick={() => setViewMode("kanban")}
              color={viewMode === "kanban" ? "primary" : "default"}
              size="small">
              <ViewKanbanIcon />
            </IconButton>
          </Tooltip>
        </ViewToggleToolbar>
      </Box>

      <Paper elevation={3} sx={{ mt: 2 }}>
        <Box
          p={1}
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
              "&:hover": {
                background: "#555",
              },
            },
          }}>
          {viewMode === "table" ? (
            <ProjectTable
              projects={filteredProjects}
              pageNo={currentPage}
              onPageChange={handlePageChange}
              onOpenModal={setModalOpen}
              viewRow={handleViewProject}
              editRow={handleEditProject}
              showArchivedIcon={includeArchived}
            />
          ) : (
            <ProjectKanban
              projects={filteredProjects}
              viewRow={handleViewProject}
              editRow={handleEditProject}
              updateProjectStatus={updateProjectStatus}
            />
          )}
        </Box>
      </Paper>

      {isModalOpen && (
        <ProjectModal
          closeModal={handleCloseModal}
          projectKey={modalProjectKey}
          viewOnly={modalReadOnly}
        />
      )}
    </Container>
  );
};

export default ProjectTracker;
