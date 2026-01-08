import React from "react";
import useRole from "../../Hook/useRole";
import AdminDashboardHome from "./DashboardHome/AdminDashboardHome";
import RiderDashboardHome from "./DashboardHome/RiderDashboardHome";
import UserDashboardHome from "./DashboardHome/UserDashboardHome";
import LoaderBar from "../../Shared Components/LoaderBar";

const DashboardInterface = () => {
  const { isLoading, role } = useRole();

  if (isLoading) {
    return (
      <LoaderBar></LoaderBar>
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
