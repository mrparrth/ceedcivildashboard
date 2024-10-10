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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArchiveIcon from "@mui/icons-material/Archive";
import AddIcon from "@mui/icons-material/Add";
import DropboxIcon from "@mui/icons-material/CloudQueue"; // Using a cloud icon as a substitute for Dropbox
import ProjectModal from "../components/ProjectModal";
import ProjectTable from "../components/ProjectTable";
import { useData } from "../contexts/data/DataContext";

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const ProjectTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalProjectKey, setModalProjectKey] = useState(null);
  const { projects, archiveProjects, createDropboxFolder } = useData();

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

  const handleArchiveProject = () => {
    let selectedProjects = projects
      .filter((project) => project.isSelected)
      .map((project) => project.id);
    archiveProjects(selectedProjects);
  };

  const handleDropboxFolderCreation = () => {
    let selectedProjects = projects.filter((project) => project.isSelected);
    selectedProjects.forEach((project) => createDropboxFolder(project));
  };

  return (
    <Container maxWidth={false} sx={{ py: 2, px: { xs: 1, sm: 2, md: 2 } }}>
      <Paper elevation={3}>
        <Toolbar
          sx={{
            flexDirection: isXsScreen ? "column" : "row",
            alignItems: isXsScreen ? "stretch" : "center",
            "& > button": {
              width: isXsScreen ? "100%" : "auto",
              marginBottom: isXsScreen ? 1 : 0,
            },
          }}
        >
          <StyledButton
            variant="contained"
            color="secondary"
            startIcon={<ArchiveIcon />}
            onClick={handleArchiveProject}
          >
            Archive Project(s)
          </StyledButton>
          <StyledButton
            variant="contained"
            color="info"
            startIcon={<DropboxIcon />}
            onClick={handleDropboxFolderCreation}
          >
            Create Dropbox Folder
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={showNewProjectModal}
          >
            New Project
          </StyledButton>
        </Toolbar>
      </Paper>

      <Paper elevation={3} sx={{ mt: 3 }}>
        <Box p={2}>
          <ProjectTable
            projects={projects.filter(
              (project) => !project.isArchived && !project.isDeleted
            )}
            pageNo={currentPage}
            onPageChange={handlePageChange}
            onOpenModal={setModalOpen}
            viewRow={handleViewProject}
            editRow={handleEditProject}
          />
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
