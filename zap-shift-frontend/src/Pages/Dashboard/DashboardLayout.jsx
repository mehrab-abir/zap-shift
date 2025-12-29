import React, { useState } from "react";
import { Outlet } from "react-router";
import Header from "../../Shared Components/Header";
import Footer from "../../Shared Components/Footer";
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { NavLink } from "react-router";

const DashboardLayout = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <div className="bg-base">
      <Header></Header>

      {/* dashboard drawer */}
      <div className="">
        <div className="w-10/12 mx-auto">
          <h1 className="text-2xl text-center font-bold text-accent my-2">
            Zap Shift Dashboard
          </h1>
        </div>

        <div
          className="top-22 md:top-5 left-0 absolute cursor-pointer bg-accent p-2 rounded-r-lg"
        >
          {openDrawer ? (
            <IoChevronBackCircleOutline
              onClick={() => setOpenDrawer(!openDrawer)}
              className="text-3xl text-white"
            />
          ) : (
            <IoChevronForwardCircleOutline
              onClick={() => setOpenDrawer(!openDrawer)}
              className="text-3xl text-white"
            />
          )}
        </div>

        <div
          className={`absolute top-0 left-0 w-52 h-screen bg-accent p-10 justify-center shadow-lg z-30 ${
            !openDrawer && "-translate-x-full"
          } transition-all duration-500`} data-theme='dark'
        >
          {openDrawer ? (
            <IoChevronBackCircleOutline
              onClick={() => setOpenDrawer(!openDrawer)}
              className="text-2xl text-white top-10 right-2 absolute cursor-pointer"
            />
          ) : (
            <IoChevronForwardCircleOutline
              onClick={() => setOpenDrawer(!openDrawer)}
              className="text-2xl text-white top-10 right-2 absolute cursor-pointer"
            />
          )}
          <nav className="mt-10 flex flex-col space-y-2 text-lg text-white">
            <NavLink
              to="/"
              className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard/myparcels"
              className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
            >
              My Parcels
            </NavLink>
            <NavLink
              to="/sendparcel"
              className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
            >
              Send a Parcel
            </NavLink>
          </nav>
        </div>
      </div>

      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default DashboardLayout;
