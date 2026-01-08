import React, { use, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link, NavLink } from "react-router";
import { LiaTimesCircleSolid } from "react-icons/lia";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { AuthContext } from "../Context/Auth/AuthContext";
import userAvatar from "../assets/userAvatar.png";
import LoaderBar from "./LoaderBar";

const Header = () => {
  const { user, logOutUser, loading } = use(AuthContext);

  const [openMenu, setOpenMenu] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogOut = () => {
    logOutUser().then(() => {});
  };

  // console.log(user);
  const userProfile =
    user?.photoURL || user?.providerData[0]?.photoURL || userAvatar;

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

        {/* navabr for large screens */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Home
          </NavLink>
          <NavLink
            to="/coverage"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Coverage
          </NavLink>
          <NavLink
            to="/sendparcel"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Send a Parcel
          </NavLink>

          <NavLink
            to="/rider-registration"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Be a Rider
          </NavLink>
          {user && (
            <NavLink
              to="/dashboard"
              className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
            >
              Dashboard
            </NavLink>
          )}
        </nav>

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
            <div className="flex ietms-center gap-2">
              <img
                src={userProfile}
                alt=""
                className="w-10 md:w-12 rounded-full"
              />
              <button
                onClick={handleLogOut}
                className="btn btn-sm md:btn-md self-center bg-surface border border-red-500"
              >
                Log Out
              </button>
            </div>
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
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-surface z-50 ${
          !openMenu && "-translate-x-full"
        } transition-all duration-500 `}
      >
        <LiaTimesCircleSolid
          onClick={() => setOpenMenu(false)}
          className="absolute top-6 right-8 text-4xl cursor-pointer"
        />
        <nav className="flex flex-col md:hidden items-center justify-center text-center space-y-4 mt-14 text-lg">
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
            onClick={() => setOpenMenu(!openMenu)}
          >
            Home
          </NavLink>
          {user && (
            <>
              <NavLink
                to="/dashboard"
                className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
                onClick={() => setOpenMenu(!openMenu)}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/sendparcel"
                className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
                onClick={() => setOpenMenu(!openMenu)}
              >
                Send a Parcel
              </NavLink>
            </>
          )}

          <NavLink
            to="/coverage"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
            onClick={() => setOpenMenu(!openMenu)}
          >
            Coverage
          </NavLink>
          <NavLink
            to="/rider-registration"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
            onClick={() => setOpenMenu(!openMenu)}
          >
            Be A Rider
          </NavLink>

          {user ? (
            <button
              onClick={handleLogOut}
              className="btn btn-sm md:btn-md self-center bg-surface border border-red-500"
            >
              Log Out
            </button>
          ) : (
            <>
              <NavLink
                to="/auth/login"
                className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
                onClick={() => setOpenMenu(!openMenu)}
              >
                Log In
              </NavLink>
              <NavLink
                to="/auth/register"
                className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
                onClick={() => setOpenMenu(!openMenu)}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
