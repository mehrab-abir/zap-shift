import React from "react";
import { Outlet } from "react-router";
import Header from "../../Shared Components/Header";
import Footer from "../../Shared Components/Footer";

const DashboardLayout = () => {
  return (
    <div className="bg-base">
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default DashboardLayout;
