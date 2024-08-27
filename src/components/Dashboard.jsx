// import React from "react";
import { Link, Outlet } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
// import "./";
import axios from "axios";

const Dashboard = () => {
  // const anvigate = useNavigate()
  axios.defaults.withCredentials = true;
  // const handleLogout = () => {
  //   axios.get('http://localhost:3000/auth/logout')
  //   .then(result => {
  //     if(result.data.Status) { 
  //       localStorage.removeItem("valid")
  //       anvigate('/adminlogin')
  //     }
  //   })
  // }

  return (
    <div className="dashboard-container min-h-[700px] h-100"> {/* New root div with class name */}
      <div className="container mx-auto">
        <div className="flex flex-nowrap">
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="fixed top-0 left-0 bottom-0 flex flex-col w-3/4 lg:w-80 sm:w[20px] pt-6 pb-8 bg-gray-800 overflow-y-auto">
              <Link
                to="/dashboard/project-tracker"
                className="flex items-center pb-3 mb-4 md:mb-1 md:mt-3 md:mr-auto text-white no-underline justify-center" // added justify-center to center the image
              >
                <span className="text-[20px] font-extrabold hidden sm:inline flex flex-col items-center"> {/* Centering the text and image */}
                  <div className="ml-10 mt-5 relative w-[120px] h-[120px] rounded-full bg-white flex items-center justify-center"> {/* Outer circle with white background */}
                    <img
                      src="https://ceedcivil.com/wp-content/uploads/thegem-logos/logo_4d56f686668bce5695ed72f5ec338800_1x.png"
                      alt="CeedCivil Logo"
                      className="  w-[100px] h-[100px] p-2" // logo size
                    />
                  </div>
                </span>
              </Link>
              <ul className="flex flex-col mb-0 sm:mb-auto items-center sm:items-start" id="menu">
                {/* <li className="w-full p-4">
                  <Link to="/dashboard" className="text-white px-0 align-middle">
                    <i className="text-4xl bi-speedometer2 ml-2"></i>
                    <span className="ml-2 hidden sm:inline text-[20px]">Dashboard</span>
                  </Link>
                </li> */}

                <li className="w-full p-4">
                  <Link to="/dashboard/project-tracker" className="text-white px-0 align-middle">
                    <i className="text-4xl bi-speedometer2 ml-2"></i>
                    <span className="ml-2 hidden sm:inline text-[20px]">Dashboard</span>
                  </Link>
                </li>

                <li className="w-full p-4">
                  <Link to="/dashboard/finance" className="text-white px-0 align-middle">
                    <i className="text-4xl bi-people ml-2"></i>
                    <span className="ml-2 hidden sm:inline text-[20px]">Finance</span>
                  </Link>
                </li>

                <li className="w-full p-4">
                  <Link to="/dashboard/archieve" className="text-white px-0 align-middle">
                    <i className="text-4xl bi-columns ml-2"></i>
                    <span className="ml-2 hidden sm:inline text-[20px]">Archive project</span>
                  </Link>
                </li>

                <li className="w-full p-4">
                  <Link className="text-white px-0 align-middle">
                    <i className="text-4xl bi-power ml-2"></i>
                    <span className="ml-2 hidden sm:inline text-[20px]">Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="col p-0 m-0 w-full h-80px">
        <div className="flex items-center justify-between p-2 bg-gray-800 text-white shadow-lg w-full h-20"> {/* Height updated to 80px */}
          <h4 className="text-[30px] font-semibold text-center flex-grow">Welcome to CeedCivil</h4>

          <button className="h-full bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 mr-5 rounded">
            <Link to="/dashboard/newproject" className="text-white">
              New Project
            </Link>
          </button>

        </div>


        <div className="p-4"> {/* New wrapper div for content alignment */}
          <Outlet />
        </div>
      </div>
    </div>
    // </div>
    // </div>
  );
};

export default Dashboard;
