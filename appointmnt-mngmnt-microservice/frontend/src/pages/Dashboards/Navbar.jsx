// components/AdminNavbar.jsx
// import logo from "../../assets/images/svg/dashbord-logo.svg";
// import search from "../../assets/images/svg/searchIcon.svg";
// import ProfileCard from "../microComponent/ProfileCard";
import { useNavigate } from "react-router-dom";
// import Notification from "../Notification";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <>
      <header className="px-5  min-h-[50px] bg-[#116aef] sticky top-0 flex items-center z-10">
        <div className="flex items-center gap-5 justify-between w-full">
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center">
            <button
              type="button"
              className="bg-white w-8 h-8 rounded-md"
              onClick={toggleSidebar}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="ml-4 flex items-center">
              <div onClick={() => navigate("/admin")}>
                <img
                  // src={logo}
                  src="https://res.cloudinary.com/dqygfny9z/image/upload/v1739165425/dashbord-logo_iqogez.svg"
                  // src=""
                  alt="logo"
                  className="max-w-[190px] max-h-10 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right-side icons and login/logout button */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="mx-4 lg:block hidden relative">
              <input
                type="text"
                placeholder="Search"
                className="min-w-[230px] min-h-[30px] py-1.5 pl-9 pr-3 transition-all bg-white rounded-md text-sm text-black"
              />
              <img
                // src={search}
                alt="searchIcon"
                className="absolute top-1.5 left-2"
              />
            </div>

            {/*Notification box  */}
            {/* <Notification /> */}

            {/* Login/Logout and Profile Dropdown */}
            {/* <ProfileCard /> */}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
