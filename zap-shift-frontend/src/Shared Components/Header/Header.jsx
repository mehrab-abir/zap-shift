import React, { use, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { AuthContext } from "../../Context/Auth/AuthContext";
import LoaderBar from "../LoaderBar";
import NavbarSmallDevice from "./NavbarSmallDevice";
import NavbarLargeDevice from "./NavbarLargeDevice";
import UserProfileDropdown from "./UserProfileDropdown";

const Header = () => {
  const { user, loading } = use(AuthContext);

  const [openMenu, setOpenMenu] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

    if(loading){
      return <LoaderBar></LoaderBar>
    }

  return (
    <header className="w-full md:w-10/12 mx-auto py-5 bg-surface md:rounded-xl">
      <div className="px-5 flex justify-between items-center">
        <div
          onClick={() => setOpenMenu(true)}
          className="md:hidden flex flex-col items-center justify-center space-y-1 cursor-pointer"
        >
          <span className="w-7 h-1 bg-gray-300 rounded-md"></span>
          <span className="w-7 h-1 bg-gray-300 rounded-md"></span>
          <span className="w-7 h-1 bg-gray-300 rounded-md"></span>
        </div>
        <Link to="/" className="flex">
          <img src={logo} alt="" />
          <h1 className="font-bold text-xl md:text-3xl self-center md:self-end -ml-4">
            ZapShift
          </h1>
        </Link>

        {/* navbar for large screens */}
        <NavbarLargeDevice></NavbarLargeDevice>

        <div className="flex gap-2 items-center">
          {theme === "light" ? (
            <MdDarkMode
              onClick={() => setTheme("dark")}
              className="text-2xl md:text-4xl cursor-pointer"
            />
          ) : (
            <CiLight
              onClick={() => setTheme("light")}
              className="text-2xl md:text-4xl cursor-pointer"
            />
          )}

          {user ? (
            <UserProfileDropdown></UserProfileDropdown>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="btn bg-surface border-lime-400 rounded-xl  cursor-pointer"
              >
                Log In
              </Link>
              <Link
                to="/auth/register"
                className={`btn bg-primary rounded-xl cursor-pointer text-gray-800 hover:bg-primary-hover hover:text-white`}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* menu for small screens  */}
      <NavbarSmallDevice openMenu={openMenu} setOpenMenu={setOpenMenu}></NavbarSmallDevice>
    </header>
  );
};

export default Header;
