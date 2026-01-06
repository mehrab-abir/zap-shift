import React from "react";
import { use } from "react";
import { AuthContext } from "../../../Context/Auth/AuthContext";
import useAxios from "../../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const RiderDashboardHome = () => {
  const { user, loading } = use(AuthContext);
  const axios = useAxios();

  const { data: countDeliveries } = useQuery({
    queryKey: ["delivery-count", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/count-deliveries/${user?.email}`);
      return response.data;
    },
  });

  const {data : totalIncome} = useQuery({
    queryKey : ["total-income", user?.email],
    queryFn : async ()=>{
        const response = await axios.get(`/total-income/${user?.email}`);
        return response.data;
    }
  })

  if (loading) {
    return (
      <p>
        <i>Loading...</i>
      </p>
    );
  }
  return (
    <div className="bg-surface p-5 md:p-10 mb-5">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-accent">
        Your Stats As A Delivery Rider
      </h1>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between md:gap-10">
        <h2 className="text-xl md:text-2xl font-bold">
          Number of deliveries you completed : {countDeliveries}
        </h2>
        <h3 className="text-2xl font-bold my-5">
          Total earnings: <span className="text-green-500">${totalIncome}</span>
        </h3>
        <p className="text-lg flex flex-col mt-4">
          See:
          <Link
            to="/dashboard/my-deliveries"
            className="text-accent hover:underline font-semibold"
          >
            &gt;Your Completed Deliveries
          </Link>
          <Link
            to="/dashboard/rider-page"
            className="text-accent hover:underline font-semibold"
          >
            &gt;Rider Page
          </Link>
        </p>
      </div>

    <div className="flex items-center justify-center">
        <button className="btn btn-sm bg-lime-600 border-none text-white mt-4">
        <Link to="/dashboard/rider-page"> Go Online Now!</Link>
      </button>
    </div>
      
    </div>
  );
};

export default RiderDashboardHome;
