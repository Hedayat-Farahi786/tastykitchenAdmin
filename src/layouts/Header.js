import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import Logo from "./Logo";
import user1 from "../assets/images/users/user4.jpg";
import logo from "../assets/images/logos/logo.png";
import { AuthContext } from "../AuthContext";
import decodeToken from "../tokenUtils";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const [tokenData, setTokenData] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
    if (token) {
      const decoded = decodeToken(token);
      setTokenData(decoded);
    }
  }, []);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <Navbar color="white" light expand="md" className="fix-header">
      <div className="flex items-center justify-between w-full">
        <div className="d-lg-block d-none me-5 pe-3">
        <img src={logo} alt="logo" className="w-44 ml-5" />
        </div>
        <NavbarBrand href="/">
          <img src={logo} alt="logo" className="w-28 md:hidden flex" />
        </NavbarBrand>
        <Button
          color="link"
          size="lg"
          className="d-lg-none text-[#e60404]"
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>
      {/* <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div> */}

      {/* <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link to="/starter" className="nav-link">
              Starter
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/about" className="nav-link">
              About
            </Link>
          </NavItem>
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle caret nav>
              DD Menu
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav> */}
            {
              tokenData && (
                <p className="text-sm">{tokenData.username}</p>
              )
            }
        <Dropdown isOpen={dropdownOpen} toggle={toggle} className="hidden md:flex">
          <DropdownToggle color="transparent">
            <img
              src={user1}
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img>
          </DropdownToggle>
          <DropdownMenu>
            {/* <DropdownItem header>Info</DropdownItem>
            <DropdownItem>My Account</DropdownItem>
            <DropdownItem>Edit Profile</DropdownItem>
            <DropdownItem divider />
            <DropdownItem>My Balance</DropdownItem>
            <DropdownItem>Inbox</DropdownItem> */}
            <DropdownItem onClick={handleLogout}><i className="bi bi-box-arrow-left mr-2"></i> Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      {/* </Collapse> */}
    </Navbar>
  );
};

export default Header;
