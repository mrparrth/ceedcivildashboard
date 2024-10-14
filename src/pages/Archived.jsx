import { useState, useEffect } from "react";
import { ProjectModal, ProjectTable } from "../components/ProjectDashboard";
import Button from "@mui/material/Button";
import { BiSolidArchiveIn } from "react-icons/bi";

import useData from "hooks/useData";

const Archived = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [modalProjectKey, setModalProjectKey] = useState(null);
  const { projects, unarchiveProjects } = useData();

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
    <>
      <div className="right-content w-100">
        <div className="w-100 rounded-2 bg-success p-2 text-white bg-opacity-25 d-flex shadow">
          <div className="me-2">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUnarchiveProject}
            >
              <BiSolidArchiveIn className="me-2" /> Unarchive Project(s)
            </Button>
          </div>
        </div>
        <div className="card shadow border-0 p-3 mt-3">
          <div className="table-wrapper">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Archived;
