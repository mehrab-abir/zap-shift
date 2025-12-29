import React from "react";
import { useState } from "react";
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { NavLink } from "react-router";

const DashboardInterface = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <div className="md:my-5 bg-surface relative">
      {/* drawer opener */}
      {/* <div className="absolute top-0 left-0 w-8 h-screen bg-surface p-1 shadow-xl">
        <IoChevronForwardCircleOutline
          onClick={() => setOpenDrawer(!openDrawer)}
          className="text-2xl text-primary cursor-pointer"
        />
      </div> */}

      <div className="w-9/12 md:w-10/12 mx-auto">
        <h1 className="text-4xl font-bold text-lime-500">
          Dashboard Interface
        </h1>
      </div>

      {/* dashboard drawer */}
      <div
        className={`absolute top-0 left-0 w-52 h-screen bg-accent p-10 justify-center shadow-lg ${
          !openDrawer && "-translate-x-42"
        } transition-all duration-500`} data-theme='dark'
      >
        {openDrawer ? (
          <IoChevronBackCircleOutline
            onClick={() => setOpenDrawer(!openDrawer)}
            className="text-2xl text-accent top-10 right-2 absolute cursor-pointer"
          />
        ) : (
          <IoChevronForwardCircleOutline
            onClick={() => setOpenDrawer(!openDrawer)}
            className="text-2xl text-accent top-10 right-2 absolute cursor-pointer"
          />
        )}
        <nav className="mt-10 flex flex-col space-y-2 text-lg">
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
  );
};

export default DashboardInterface;
