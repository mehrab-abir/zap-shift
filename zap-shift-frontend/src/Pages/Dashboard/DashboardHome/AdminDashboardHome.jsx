import React from "react";
import useAxios from "../../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const AdminDashboardHome = () => {
  const axios = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ["delivery-status"],
    queryFn: async () => {
      const response = await axios.get("/parcel-deliverystatus");
      return response.data;
    },
  });

  if(isLoading){
    return <p><i>Loading...</i></p>
  }

  return (
    <div className="bg-surface p-5 md:p-10">
      <h1 className="text-2xl md:text-4xl text-center font-bold mb-4 text-purple-500">
        Admin
      </h1>

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">
            Number of Parcels by: Delivery Status
          </h1>
          <div className="stats shadow bg-base">
            {data?.map((stat) => {
              return (
                <div key={stat._id} className="stat place-items-center">
                  <div className="stat-title text-lg">{stat._id ? stat._id : "Parcel Request Placed"}</div>
                  <div className="stat-value">{stat.count}</div>
                </div>
              );
            })}
          </div>
          <Link
            to="/dashboard/allparcels"
            className="btn btn-sm bg-cyan-800 text-white hover:underline font-semibold mt-4 text-lg border-none"
          >
            Assign Rider to Parcel
          </Link>
        </div>

        <div className="flex flex-col">
          <p className="text-lg flex flex-col mt-4">
            See:
            <Link
              to="/dashboard/allparcels"
              className="text-accent hover:underline font-semibold"
            >
              &gt;All Parcels
            </Link>
            <Link
              to="/dashboard/riders"
              className="text-accent hover:underline font-semibold"
            >
              &gt;All Riders
            </Link>
            <Link
              to="/dashboard/manage-users"
              className="text-accent hover:underline font-semibold"
            >
              &gt;Manage Users
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
