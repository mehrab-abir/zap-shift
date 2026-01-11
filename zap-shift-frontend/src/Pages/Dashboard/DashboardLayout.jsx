import React, { use, useState } from "react";
import { Outlet } from "react-router";
import Header from "../../Shared Components/Header/Header";
import Footer from "../../Shared Components/Footer";
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { NavLink } from "react-router";
import useRole from "../../Hook/useRole";
import { AuthContext } from "../../Context/Auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hook/useAxios";

const DashboardLayout = () => {
  const {user} = use(AuthContext);
  const { role } = useRole();
  const axios = useAxios();

  const {data : thisUser} = useQuery({
    queryKey : ["rider-application", user?.email],
    queryFn : async ()=>{
      const response = await axios.get(`/rider-application/${user?.email}`);
      // console.log("Rider application status",response.data);
      return response.data;
    }
  })

  // console.log("This user",thisUser?.appliedToBeRider);

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

        <div className="top-22 md:top-5 left-0 absolute cursor-pointer bg-accent p-2 rounded-r-lg">
          <IoChevronForwardCircleOutline
            onClick={() => setOpenDrawer(!openDrawer)}
            className="text-4xl text-white"
          />
        </div>

        <div
          className={`fixed top-0 left-0 w-60 h-screen bg-accent p-10 justify-center shadow-lg z-30 ${
            !openDrawer && "-translate-x-full"
          } transition-all duration-500`}
          data-theme="dark"
        >
          <IoChevronBackCircleOutline
            onClick={() => setOpenDrawer(!openDrawer)}
            className="text-4xl text-white top-10 right-2 absolute cursor-pointer"
          />
          <nav className="mt-10 flex flex-col space-y-2 md:text-lg text-secondary">
            <NavLink
              to="/"
              className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
              onClick={() => setOpenDrawer(!openDrawer)}
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
              onClick={() => setOpenDrawer(!openDrawer)}
            >
              Dashboard Home
            </NavLink>
            <NavLink
              to="/dashboard/myparcels"
              className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
              onClick={() => setOpenDrawer(!openDrawer)}
            >
              My Parcels
            </NavLink>
            <NavLink
              to="/sendparcel"
              className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
              onClick={() => setOpenDrawer(!openDrawer)}
            >
              Send a Parcel
            </NavLink>
            <NavLink
              to="/dashboard/payment-history"
              className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
              onClick={() => setOpenDrawer(!openDrawer)}
            >
              Payment History
            </NavLink>

            {role === "rider" && (
              <>
                <NavLink
                  to="/dashboard/rider-page"
                  className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
                  onClick={() => setOpenDrawer(!openDrawer)}
                >
                  Rider Page
                </NavLink>
                <NavLink
                  to="/dashboard/my-deliveries"
                  className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
                  onClick={() => setOpenDrawer(!openDrawer)}
                >
                  My Deliveries
                </NavLink>
              </>
            )}

            {thisUser?.appliedToBeRider && (
              <NavLink
                to="/dashboard/rider-application"
                className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
                onClick={() => setOpenDrawer(!openDrawer)}
              >
                Rider Application
              </NavLink>
            )}

            {role === "admin" && (
              <>
                <NavLink
                  to="/dashboard/riders"
                  className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
                  onClick={() => setOpenDrawer(!openDrawer)}
                >
                  All Riders
                </NavLink>
                <NavLink
                  to="/dashboard/allparcels"
                  className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
                  onClick={() => setOpenDrawer(!openDrawer)}
                >
                  Assign Rider To Parcel
                </NavLink>
                <NavLink
                  to="/dashboard/manage-users"
                  className="hover:text-lime-500 hover:tracking-wider transition-all duration-500"
                  onClick={() => setOpenDrawer(!openDrawer)}
                >
                  Manage Users
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="py-2 md:p-10">
        <Outlet></Outlet>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default DashboardLayout;
