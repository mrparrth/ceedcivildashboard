import { useState, useEffect } from "react";
import { ProjectModal, ProjectTable } from "../components/ProjectDashboard";
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
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import useData from "hooks/useData";

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const Archived = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [modalProjectKey, setModalProjectKey] = useState(null);
  const { projects, unarchiveProjects } = useData();

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

  const handleInlineProjectChange = (key, fieldkey, value) => {
    projects.find((project) => project.id == key)[fieldkey] = value;
    setProjects([...projects]);
  };

  const handleUnarchiveProject = () => {
    let selectedProjects = projects
      .filter((project) => project.isSelected)
      .map((project) => project.id);
    unarchiveProjects(selectedProjects);
  };

  return (
    <Container maxWidth={false} sx={{ py: 2, px: { xs: 1, sm: 2, md: 2 } }}>
      <Paper elevation={3}>
        <Toolbar
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
          }}
        >
          <StyledButton
            variant="contained"
            color="secondary"
            startIcon={<UnarchiveIcon />}
            onClick={handleUnarchiveProject}
            fullWidth={isXsScreen}
          >
            Unarchive Project(s)
          </StyledButton>
        </Toolbar>
      </Paper>
      <Paper elevation={3} sx={{ mt: 1 }}>
        <Box p={1}>
          <ProjectTable
            projects={projects.filter(
              (project) => project.isArchived && !project.isDeleted
            )}
            pageNo={currentPage}
            onPageChange={handlePageChange}
            onOpenModal={setModalOpen}
            viewRow={handleViewProject}
            editRow={handleEditProject}
          />
          {isModalOpen && (
            <ProjectModal
              closeModal={handleCloseModal}
              projectKey={modalProjectKey}
              viewOnly={modalReadOnly}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Archived;
