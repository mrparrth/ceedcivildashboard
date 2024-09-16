import { useState, useEffect, useContext } from "react";
import ProjectDetails from "./Modal";
import { GlobalContext } from "../App";
import { FaDropbox } from "react-icons/fa";
import Button from "@mui/material/Button";
import { BiSolidArchiveIn } from "react-icons/bi";
import { MdAddToPhotos } from "react-icons/md";
import Table from "../components/table";
import { GlobalContext, DataContext } from "../App";
import { DataContext } from "../App";
import { Modal } from "../components/Modal";

const ProjectTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [rowToEdit, setRowToEdit] = useState(null);

  const { projects, setProjects } = useContext(DataContext);
  const context = useContext(GlobalContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber); // Correct the page change logic
  };

  const handleDeleteProject = (targetIndex) => {
    setProjects(projects.filter((_, idx) => idx !== targetIndex));
  };

  const handleViewProject = (project) => {
    console.log("View Project:", project);
    handleOpenModal(project);
  };

  const handleEditProject = (project) => {
    setRowToEdit(project);
    console.log("Edit Project:", project);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="w-100 rounded-2 bg-success p-2 text-white bg-opacity-25 d-flex shadow">
          <div className="me-2">
            <Button variant="contained" color="secondary">
              <BiSolidArchiveIn className="me-2" /> Archive Project(s)
            </Button>
          </div>
          <div className="me-2">
            <Button variant="contained" color="info">
              <FaDropbox className="me-2" /> Create Dropbox Folder
            </Button>
          </div>
          <div className="me-2">
            <Button variant="contained" color="success">
              <MdAddToPhotos className="me-2" /> New Project
            </Button>
          </div>
        </div>
        <div className="card shadow border-0 p-3 mt-3">
          <div className="table-wrapper">
            <Table
              rows={projects}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onOpenModal={handleOpenModal}
              viewRow={handleViewProject}
              editRow={handleEditProject}
              deleteRow={handleDeleteProject}
            />
            {isModalOpen && (
              <ProjectDetails
                project={selectedProject}
                handleCloseModal={handleCloseModal}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTracker;
