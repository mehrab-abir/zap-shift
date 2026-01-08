import React from "react";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../Context/Auth/AuthContext";
import useAxios from "../../../Hook/useAxios";
import { Link } from "react-router";
import useRole from "../../../Hook/useRole";
import LoaderBar from "../../../Shared Components/LoaderBar";

const UserDashboardHome = () => {
  const { user, loading } = use(AuthContext);
  const axios = useAxios();
  const { role } = useRole();

  const { data: parcelSentCount } = useQuery({
    queryKey: ["sentParcels", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/count-sent-parcel/${user?.email}`);
      return response.data;
    },
  });

  if (loading) {
    return (
      <LoaderBar></LoaderBar>
    );
  }

  return (
    <div className="bg-surface p-5 md:p-10">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-accent">
        Your Stats As A User
      </h1>
      <div className="flex flex-col md:flex-row md:items-center justify-between md:gap-10">
        <h2 className="text-xl md:text-2xl font-bold">
          Number of parcels you sent : {parcelSentCount}
        </h2>
        <p className="text-lg flex flex-col mt-4">
          See:
          <Link
            to="/dashboard/myparcels"
            className="text-accent hover:underline font-semibold"
          >
            &gt;Your Parcels
          </Link>
          <Link
            to="/dashboard/payment-history"
            className="text-accent hover:underline font-semibold"
          >
            &gt;Payment History
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center mb-10">
        <button className="btn btn-sm bg-cyan-700 border-none text-white mt-4">
          <Link to="/sendparcel"> Send a Parcel Now!</Link>
        </button>
      </div>

    <div className="flex flex-col md:flex-row md:items-center justify-between">
        {role === "user" && (
        <div className="mt-5">
          <h3 className="text-2xl font-semibold text-lime-600">
            Interested to earn as a delivery rider?{" "}
          </h3>
          <Link
            to="/rider-registration"
            className="text-accent hover:underline font-semibold text-lg mt-2"
          >
            &gt; Apply to be a Delivery Rider
          </Link>
        </div>
      )}
      <div></div>
      <button className="btn btn-sm bg-primary text-black">
        <Link to='/'>Go to Home Page</Link>
      </button>
    </div>
      
    </div>
  );
};

export default UserDashboardHome;
