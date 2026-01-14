import React from "react";
import { use } from "react";
import { AuthContext } from "../../../Context/Auth/AuthContext";
import useAxios from "../../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import LoaderBar from "../../../Shared Components/LoaderBar";

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

  //latest 2 deliveries
  const {data : latestDeliveries = []}= useQuery({
    queryKey : ["latest-deliveries", user?.email],
    queryFn : async ()=>{
      const response = await axios.get(
        `/rider/my-completed-deliveries/${user?.email}?latest=latest`
      );
      return response.data;
    }
  })

  if (loading) {
    return (
      <div className="h-[50vh]">
        <LoaderBar></LoaderBar>
      </div>
    );
  }
  
  return (
    <div className="bg-surface p-5 md:p-8 mb-5 rounded-lg">
      <title>Dashboard</title>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between md:gap-10">
        <h2 className="text-lg md:text-2xl font-semibold">
          Number of deliveries you completed : {countDeliveries}
        </h2>
        <h3 className="text-lg md:text-xl font-bold my-5">
          Total earnings: <span className="text-green-500">${totalIncome}</span>
        </h3>
        <p className="text-lg flex flex-col mt-2 space-y-1.5">
          <span className="mb-1">See:</span>
          <Link
            to="/dashboard/my-deliveries"
            className="text-sm md:text-lg text-accent hover:underline font-semibold"
          >
            &gt;Your Completed Deliveries
          </Link>
          <Link
            to="/dashboard/rider-page"
            className="text-sm md:text-lg text-accent hover:underline font-semibold"
          >
            &gt;Rider Page
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center mb-10">
        <button className="btn btn-sm bg-lime-600 border-none text-white mt-4">
          <Link to="/dashboard/rider-page"> Go Online Now!</Link>
        </button>
      </div>

      <h3 className="text-2xl font-bold mb-1">Latest deliveries:</h3>
      <div className="flex flex-col space-y-2.5 mb-5">
        {latestDeliveries.map((delivery) => {
          return (
            <div
              key={delivery._id}
              className="p-2 bg-base rounded-lg shadow-lg"
            >
              <p>
                {" "}
                <span className="font-semibold">Parcel Name:</span>{" "}
                {delivery.parcelName}
              </p>
              <p>
                {" "}
                <span className="font-semibold">Sender Name:</span>{" "}
                {delivery.senderName}
              </p>
              <p>
                {" "}
                <span className="font-semibold">Receiver Name:</span>{" "}
                {delivery.receiverName}
              </p>
              <p>
                {" "}
                <span className="font-semibold">From:</span>{" "}
                {delivery.senderDistrict}
              </p>
              <p>
                {" "}
                <span className="font-semibold">To:</span>{" "}
                {delivery.receiverDistrict}
              </p>
              <p>
                {" "}
                <span className="font-semibold">Fare: </span>
                {"$"}
                {delivery.fare}
              </p>
              <p></p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiderDashboardHome;
