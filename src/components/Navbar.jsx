import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import Button from "@mui/material/Button";
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { IoShieldHalfSharp } from "react-icons/io5";
import Divider from "@mui/material/Divider";
import UserAvatarImgComponent from "./userAvatarImg";
import { useSettings } from "../contexts/SettingsContext";
import { useAuth } from "../contexts/auth/AuthContext";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMyAcc = Boolean(anchorEl);
  const handleOpenMyAccDrop = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMyAccDrop = () => setAnchorEl(null);
  const { logout } = useAuth();
  const { settings, updateSettings } = useSettings();

  const handleLogout = () => {
    handleCloseMyAccDrop();
    logout();
  };

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            <div className="col-sm-1 part1 d-flex justify-content-between">
              <Link to={"/"} className="d-flex align-items-center logo me-3">
                <img src={logo} />
                <span className="ml-2">CEEDCIVIL</span>
              </Link>
              {settings.windowWidth > 992 && (
                <div className="d-flex align-items-center res-hide">
                  <Button
                    className="rounded-circle mr-3"
                    onClick={() => {
                      updateSettings({ showSidebar: !settings.showSidebar });
                    }}
                  >
                    {settings.showSidebar ? <MdMenuOpen /> : <MdOutlineMenu />}
                  </Button>
                </div>
              )}
            </div>

            <div className="col-sm-11 d-flex align-items-center justify-content-end part3">
              <div className="myAccWrapper">
                <Button
                  className="myAcc d-flex align-items-center"
                  onClick={handleOpenMyAccDrop}
                >
                  {/* <div className="userImg">
                      <span className="rounded-circle">
                        <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" />
                      </span>
                    </div> */}

                  <div className="userInfo res-hide">
                    <h4>Parth Sahoo</h4>
                    {/* <p className="mb-0">@ps</p> */}
                  </div>
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openMyAcc}
                  onClose={handleCloseMyAccDrop}
                  onClick={handleCloseMyAccDrop}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleCloseMyAccDrop}>
                    <ListItemIcon>
                      <IoShieldHalfSharp />
                    </ListItemIcon>
                    Reset Password
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
