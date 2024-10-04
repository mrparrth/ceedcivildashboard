import { useState, useEffect, useContext } from "react";
import ProjectModal from "../components/ProjectModal";
import { FaDropbox } from "react-icons/fa";
import Button from "@mui/material/Button";
import { BiSolidArchiveIn } from "react-icons/bi";
import { MdAddToPhotos } from "react-icons/md";
import ProjectTable from "../components/ProjectTable";
import { useData } from "../contexts/DataContext";

const ProjectTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [modalProjectKey, setModalProjectKey] = useState(null);
  const { projects, archiveProject, createDropboxFolder } = useData();

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
    let selectedProjects = projects.filter((project) => project.isSelected);
    selectedProjects.forEach((project) => archiveProject(project.id));
  };

  const handleDropboxFolderCreation = () => {
    let selectedProjects = projects.filter((project) => project.isSelected);
    selectedProjects.forEach((project) => createDropboxFolder(project.id));
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="w-100 rounded-2 bg-success p-2 text-white bg-opacity-25 d-flex shadow">
          <div className="me-2">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleArchiveProject}
            >
              <BiSolidArchiveIn className="me-2" /> Archive Project(s)
            </Button>
          </div>
          <div className="me-2">
            <Button
              variant="contained"
              color="info"
              onClick={handleDropboxFolderCreation}
            >
              <FaDropbox className="me-2" /> Create Dropbox Folder
            </Button>
          </div>
          <div className="me-2">
            <Button
              variant="contained"
              color="success"
              onClick={showNewProjectModal}
            >
              <MdAddToPhotos className="me-2" /> New Project
            </Button>
          </div>
        </div>
        <div className="card shadow border-0 p-3 mt-3">
          <div className="table-wrapper">
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

export default ProjectTracker;
