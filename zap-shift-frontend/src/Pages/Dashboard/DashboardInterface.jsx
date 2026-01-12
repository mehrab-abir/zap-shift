import React from "react";
import useRole from "../../Hook/useRole";
import AdminDashboardHome from "../Dashboard/DashboardHome/Admin Dashboard Home/AdminDashboardHome";
import RiderDashboardHome from "./DashboardHome/RiderDashboardHome";
import UserDashboardHome from "./DashboardHome/UserDashboardHome";
import LoaderBar from "../../Shared Components/LoaderBar";

const DashboardInterface = () => {
  const { isLoading, role } = useRole();

  if (isLoading) {
    return (
      <div className="h-[50vh]">
        <LoaderBar></LoaderBar>
      </div>
    );
  }

  if (role === "admin") {
    return <AdminDashboardHome></AdminDashboardHome>;
  } else if (role === "rider") {
    return (
      <>
        <RiderDashboardHome></RiderDashboardHome>
        <UserDashboardHome></UserDashboardHome>
      </>
    );
  } else {
    return <UserDashboardHome></UserDashboardHome>;
  }
};

export default DashboardInterface;
