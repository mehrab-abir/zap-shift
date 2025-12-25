import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router";
import { LiaTimesCircleSolid } from "react-icons/lia";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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
        <div className="flex">
          <img src={logo} alt="" />
          <h1 className="font-bold text-3xl self-end -ml-4">ZapShift</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Services
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Coverage
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            About Us
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Pricing
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Blog
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Contact
          </NavLink>
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

          <button className="btn bg-surface border-lime-400 rounded-xl  cursor-pointer">
            Sign In
          </button>
          <button
            className={`btn bg-primary rounded-xl cursor-pointer text-gray-800 hover:bg-primary-hover hover:text-white`}
          >
            Sign Up
          </button>
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
          >
            Services
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Coverage
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            About Us
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Pricing
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Blog
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Contact
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Sign In
          </NavLink>
          <NavLink
            to="/"
            className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          >
            Sign Up
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
